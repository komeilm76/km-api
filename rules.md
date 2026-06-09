# km-api — Contributor Rules: IDE-Safe Zod Types

These rules prevent TypeScript Language Server from hanging when a consumer
imports km-api. Every rule below is actively enforced in the codebase.

---

## Why this matters

When a TypeScript library exports a generic function whose type constraint
resolves to a Zod class (`ZodType`, `ZodObject`, etc.), tsserver must fully
expand Zod's deeply recursive conditional type system the moment it processes
the import statement. On a cold load this takes several seconds and freezes
IntelliSense for every consumer file.

---

## The two local structural types

These types live in `src/schemas/endpoint.ts` and are the only permitted
substitutes for Zod types in exported signatures.

```ts
type $AnyZodType = {
  readonly _zod: { readonly output: unknown };
};

type $AnyZodObject = {
  readonly _zod: { readonly output: Record<string, unknown> };
  shape: Record<string, unknown>;
};
```

`$AnyZodType` mirrors the minimum shape of any Zod schema.
`$AnyZodObject` mirrors the minimum shape of a `ZodObject`.

`T['_zod']['output']` is fully equivalent to `z.infer<T>` for inference
purposes, but requires zero knowledge of Zod's type system to evaluate.

---

## Rule 1 — No Zod type as a generic constraint in an exported signature

```ts
// BAD — forces ZodType expansion at import time
function makeConfig<B extends z.ZodType>(body: B) { ... }
function makeConfig<B extends z.ZodTypeAny>(body: B) { ... }
function makeConfig<B extends ZodObject<any>>(body: B) { ... }

// GOOD — resolved structurally, zero Zod loading
function makeConfig<B extends $AnyZodType>(body: B) { ... }
function makeConfig<B extends $AnyZodObject>(body: B) { ... }
```

**Applied to:** `makeApiConfig` (all 16 generic parameters through `IBody`,
`IParams`, `IQuery`, `IHeaders`, `ICookies`, `IResponseSuccessData`,
`IResponseErrorData`), `makeResponseSuccessShape` (`RESPONSE` parameter).

---

## Rule 2 — No `z.infer<T>` in exported function signatures

```ts
// BAD — z.infer appears in the .d.ts, forces Zod loading
const makeBody = <B extends z.infer<CONFIG['request']['body']>>(body: B) => body;

// GOOD — property access resolves without touching Zod's type system
const makeBody = <B extends CONFIG['request']['body']['_zod']['output']>(body: B) => body;
```

**Applied to:** `makeBody`, `makeQueries`, `makeParams`, `makeHeaders`,
`makeCookies`, `makeFullPath` inside `factory.ts`.

---

## Rule 3 — No Zod type in an exported return type

```ts
// BAD — ZodObject appears in the .d.ts signature
item: () => ZodObject<{ [K in KEY]: RESPONSE }>

// GOOD — structural return type; real ZodObject lives inside the body only
item: (): { readonly _zod: { readonly output: { [K in KEY]: RESPONSE['_zod']['output'] } } } =>
  z.object({ [key]: response }) as unknown as ...
```

**Applied to:** `makeResponseSuccessShape().item()`,
`makeResponseSuccessShape().list()`, `paginationSchema()`.

---

## Rule 4 — Zod types are permitted inside function bodies

Casting to a real Zod type inside a function body is fine. Bodies are erased
from `.d.ts` files, so they never reach the consumer.

```ts
// FINE — cast lives in the body, never reaches the declaration file
list: <AND extends $AnyZodObject>(and: AND) => {
  const data = z.object({ [key]: z.array(s) }) as unknown as ZodObject<ZodRawShape>;
  return data.merge(and as unknown as ZodObject<ZodRawShape>) as unknown as StructuralReturnType;
}
```

---

## Rule 5 — Zod is a peerDependency, never a dependency

`package.json` must declare:

```json
"peerDependencies": { "zod": ">=4.0.0" }
```

When Zod is a peer, tsserver resolves `'zod'` to the consumer's already-cached
copy. No re-parsing. If Zod were a regular `dependency`, npm could install a
separate nested copy at a different path, forcing a full cold-load of Zod's
type system on top of any work already done for the consumer's own Zod usage.

---

## Rule 6 — Exported type aliases must not resolve to Zod types

```ts
// BAD — IBody resolves to ZodType, which flows into makeApiConfig's constraints
const bodySchema = z.instanceof(ZodType);
type IBody = z.infer<typeof bodySchema>; // = ZodType

// GOOD — IBody is a local structural type; bodySchema stays a valid Zod schema
const bodySchema = z.instanceof(ZodType);
type IBody = $AnyZodType;
```

**Applied to:** `IBody`, `IParams`, `IQuery`, `IHeaders`, `ICookies`,
`IResponseSuccessData`, `IResponseErrorData` in `src/schemas/endpoint.ts`.

---

## Verification after every build

Run after `bun run build`. The named Zod class imports (`ZodObject`,
`ZodRawShape`, etc.) must not appear. A single `import z from 'zod'` is
acceptable only for exported schema values (`methodSchema`, `bodySchema`, etc.)
whose runtime type is genuinely a Zod schema.

```bash
grep "^import" build/esm/index.d.mts
grep "^import" build/cjs/index.d.ts
grep "^import" build/js/index.d.mts
```

**Passing state** (as of v0.3.3):

```
import z from 'zod';
```

No `ZodObject`, `ZodRawShape`, `ZodArray`, `z as z$1`, or any named Zod type
import should appear.

---

## Quick reference

| Situation | What to use |
|-----------|-------------|
| Generic constraint — any Zod schema | `T extends $AnyZodType` |
| Generic constraint — Zod object schema | `T extends $AnyZodObject` |
| Infer output type in a signature | `T['_zod']['output']` |
| Full Zod API inside a function body | cast with `as unknown as z.ZodTypeAny` |
| Return type of a builder function | explicit structural annotation + body cast |
| Zod as a package dependency | `peerDependencies` only |
