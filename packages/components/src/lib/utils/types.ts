// eslint-disable @typescript-eslint/no-explicit-any

export type AnyFn = (...v: any[]) => any;
export type AnyVoidFn = (...v: any[]) => void;
export type VoidFn<T> = (v: T) => void;
export type Getter<T> = () => T;
export type Setter<T> = (v: T) => void;
