import type { Constructor, InstanceOf } from "../types/util";

import { Component } from "./component";
import { Entity } from "./entity";

export type ComponentRecipe<T extends Constructor<Component>> =
    ConstructorParameters<T> extends [any, ...infer Rest]
        ? [T, ...Rest]
        : T | [T];

/** Entity Component System */
export class ECS {
    private _entities: Entity[] = [];
    private _components = new Map<
        Constructor<Component>,
        Map<number, Component>
    >();

    private createComponent<T extends Constructor<Component>>(
        parent: Entity,
        recipe: ComponentRecipe<T>,
    ) {
        const [Component, ...args] = Array.isArray(recipe) ? recipe : [recipe];
        const instance = new Component(parent, ...args);

        if (!this._components.has(Component)) {
            this._components.set(Component, new Map<number, Component>());
        }

        this._components.get(Component)!.set(parent.id, instance);

        return instance as InstanceOf<T>;
    }

    createEntity<
        T extends readonly Constructor<Component>[],
    >(componentRecipes: { [Index in keyof T]: ComponentRecipe<T[Index]> }) {
        for (let i = 0; i < componentRecipes.length; i++) {
            for (let l = i + 1; l < componentRecipes.length; l++) {
                if (componentRecipes[i] == componentRecipes[l]) {
                    throw new Error(
                        "Only one instance of a component type is allowed per entity.",
                    );
                }
            }
        }

        const entity = new Entity();

        const components: Component[] = [];

        for (const recipe of componentRecipes) {
            components.push(this.createComponent(entity, recipe));
        }

        this._entities.push(entity);

        return components as { [Index in keyof T]: InstanceOf<T[Index]> };
    }

    deleteEntity(entity: Entity) {
        for (const [, components] of this._components) {
            components.delete(entity.id);
        }
    }

    query<Constructors extends readonly Constructor<Component>[]>(
        query: [...Constructors],
    ) {
        const componentMaps = new Array(query.length);

        for (let i = 0; i < query.length; i++) {
            const map = this._components.get(query[i]);

            if (!map) {
                return [];
            }

            componentMaps[i] = map;
        }

        const pairs = componentMaps.map((map, originalIndex) => ({
            map,
            originalIndex,
        }));

        pairs.sort((a, b) => a.map.size - b.map.size);

        const results: Component[][] = [];

        const first = pairs[0];

        for (const [id, component] of first.map) {
            const tuple = new Array(query.length);
            tuple[first.originalIndex] = component;

            let valid = true;

            for (let i = 1; i < pairs.length; i++) {
                const { map, originalIndex } = pairs[i];
                const component = map.get(id);

                if (!component) {
                    valid = false;
                    break;
                }

                tuple[originalIndex] = component;
            }

            if (valid) {
                results.push(tuple);
            }
        }

        return results as {
            [Index in keyof Constructors]: InstanceOf<Constructors[Index]>;
        }[];
    }
}
