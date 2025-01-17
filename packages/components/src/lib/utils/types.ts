// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyFn = (...args: any[]) => any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type VoidFn = (...args: any[]) => void;
export type MapperFn<T, U> = (arg: T) => U;
export type Getter<T> = () => T;
export type Setter<T> = (arg: T) => void;
