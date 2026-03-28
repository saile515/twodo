export type Constructor<T> = new (...args: any[]) => T;

export type InstanceOf<C extends Constructor<any>> =
    C extends Constructor<infer T> ? T : never;
