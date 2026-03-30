import { Component } from "../ecs/component";
import { Entity } from "../ecs/entity";

export type Constructor<T, Args extends any[]> = new (...args: Args) => T;

export type InstanceOf<C extends Constructor<any, any[]>> =
    C extends Constructor<infer T, any[]> ? T : never;

export type Bundle = readonly Constructor<Component, any[]>[];

export type BundleInstance<T extends Bundle> = {
    [Index in keyof T]: InstanceOf<T[Index]>;
};

export type RecipeComponent<T extends Constructor<Component, any[]>> =
    ConstructorParameters<T> extends readonly [Entity, ...infer Rest]
        ? readonly [T, ...Rest]
        : never;

export type Recipe<T extends Bundle> = {
    [Index in keyof T]: RecipeComponent<T[Index]>;
};
