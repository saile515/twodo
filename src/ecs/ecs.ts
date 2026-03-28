import type { Constructor, InstancesOf } from "../types/util";

import { Component } from "./component";
import { Entity } from "./entity";

/** Entity Component System */
export class ECS {
    private _entities: Entity[] = [];
    private _components: { [key: string]: Component[] } = {};

    createComponent<T extends Constructor<Component>>(
        parent: Entity,
        type: T,
        ...args: Omit<ConstructorParameters<T>, "0">
    ) {
        const instance = new type(parent, ...args);

        this._components[type.name] ??= [];
        this._components[type.name].push(instance);

        return instance as InstancesOf<T>;
    }

    createEntity() {
        const entity = new Entity();

        this._entities.push(entity);

        return entity;
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

        const components: { [key: string]: Component[] } = {};

        for (let i = 0; i < query.length; i++) {
            for (const component of this._components[query[i].name]) {
                components[component.parent!.id]?.push(component);
            }
        }

        return Object.values(components).filter(
            (component) => component.length == query.length,
        ) as {
            [Index in keyof Constructors]: InstancesOf<Constructors[Index]>;
        }[];
    }
}
