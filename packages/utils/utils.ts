/* eslint-disable @typescript-eslint/no-explicit-any */

export function createLookup<T, U extends string, Y = never>(arr: T[], keyFn: (d: T) => U | U[], valFn?: (d: T) => Y) {
  type R = [Y] extends [never] ? T : Y;
  const lookup: { [key in U]?: R } = {};
  const _valFn = (valFn ?? (d => d)) as (d: T) => R;

  arr.forEach(d => {
    const key = keyFn(d);
    if (typeof key === 'string') {
      lookup[key] = _valFn(d);
    } else {
      key.forEach(k => (lookup[k] = _valFn(d)));
    }
  });

  return lookup;
}

export function groupBy<T, K extends string, U = null>(arr: T[], keyFn: (i: T) => K, mapFn?: (i: T) => U) {
  return arr.reduce<{ [KV in K]?: (U extends null ? T : U)[] }>((acc, item) => {
    const key = keyFn(item);
    acc[key] = acc[key] || [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    acc[key]?.push(!mapFn ? (item as any) : mapFn(item));
    return acc;
  }, {});
}

export function range(start: number, end: number) {
  const length = Math.abs(end - start);
  if (length === 0) return [];
  const step = start < end ? 1 : -1;
  return Array.from({ length }, (_, i) => start + i * step);
}

export function slugify(text: string, maxLen = 40) {
  return (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .slice(0, maxLen);
}

// ************************
//     TypeScript util
// ************************

export type ExpandRecursively<T> = T extends object
  ? T extends infer O
    ? { [K in keyof O]: ExpandRecursively<O[K]> }
    : never
  : T;
export type Unpacked<T> = T extends (infer U)[] ? U : T;
export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;
export type Modify<T, R> = Expand<Omit<T, keyof R> & R>;

export type DistributiveOmit<T, K extends keyof any> = T extends any ? Omit<T, K> : never;

type Cast<A, B> = A extends B ? A : B;

type Narrowable = string | number | boolean | bigint;

export type Exact<A, W = unknown> = W extends unknown
  ? A extends Narrowable
    ? Cast<A, W>
    : Cast<
        { [K in keyof A]: K extends keyof W ? Exact<A[K], W[K]> : never },
        { [K in keyof W]: K extends keyof A ? Exact<A[K], W[K]> : W[K] }
      >
  : never;

export type ExcludeKeysWithTypeOf<T, V> = {
  [K in keyof T]: Exclude<T[K], undefined> extends V ? never : K;
}[keyof T];

export type Without<V, T> = Pick<T, ExcludeKeysWithTypeOf<T, V>>;

// ****************************
//      Merge objects
// ****************************

type CommonKeys<T extends object> = keyof T;
type AllKeys<T> = T extends any ? keyof T : never;
type Subtract<A, C> = A extends C ? never : A;
type NonCommonKeys<T extends object> = Subtract<AllKeys<T>, CommonKeys<T>>;
type PickType<T, K extends AllKeys<T>> = T extends { [k in K]?: any } ? T[K] : undefined;
export type Merge<T extends object> = {
  [k in CommonKeys<T>]: PickTypeOf<T, k>;
} & {
  [k in NonCommonKeys<T>]?: PickTypeOf<T, k>;
};
type PickTypeOf<T, K extends string | number | symbol> = K extends AllKeys<T> ? PickType<T, K> : never;
