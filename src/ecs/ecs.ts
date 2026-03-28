import type { Constructor, InstanceOf } from "../types/util";

import { Component } from "./component";
import { Entity } from "./entity";

export type ComponentRecipe<T extends Constructor<Component>> = [
    T,
    ...(ConstructorParameters<T> extends [any, ...infer Rest] ? Rest : never),
];

/** Entity Component System */
export class ECS {
    private _entities: Entity[] = [];
    private _components: { [key: string]: Component[] } = {};

    createComponent<T extends Constructor<Component>>(
        parent: Entity,
        [Component, ...args]: ComponentRecipe<T>,
    ) {
        const instance = new Component(parent, ...args);

        this._components[Component.name] ??= [];
        this._components[Component.name].push(instance);

        return instance as InstanceOf<T>;
    }

    createEntity<T extends readonly Constructor<Component>[]>(
        ...componentRecipes: { [Index in keyof T]: ComponentRecipe<T[Index]> }
    ) {
        const entity = new Entity();

        const components: Component[] = [];

        for (const recipe of componentRecipes) {
            components.push(this.createComponent(entity, recipe));
        }

        this._entities.push(entity);

        return components as { [Index in keyof T]: InstanceOf<T[Index]> };
    }

    deleteEntity(entity: Entity) {
        for (const type in this._components) {
            const components = this._components[type];

            for (let i = 0; i < components.length; i++) {
                if (components[i].parent != entity) {
                    continue;
                }

                components.splice(i, 1);
                i--;
            }
        }
    }

    query<Constructors extends readonly Constructor<Component>[]>(
        query: [...Constructors],
    ) {
        if (query.length == 0) {
            return [];
        }

        const components: { [key: number]: Component[] } = {};

        for (let i = 0; i < query.length; i++) {
            for (const component of this._components[query[i].name]) {
                components[component.parent.id] ??= [];
                components[component.parent.id].push(component);
            }
        }

        return Object.values(components).filter(
            (componentList) => componentList.length == query.length,
        ) as {
            [Index in keyof Constructors]: InstanceOf<Constructors[Index]>;
        }[];
    }
}
