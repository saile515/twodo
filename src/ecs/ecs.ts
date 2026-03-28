import type { ArrayElement } from "../types/util";
import { Component } from "./component";
import { Entity } from "./entity";

// Entity Component System
export class ECS {
    private _entities: Entity[] = [];
    private _components: { [key: string]: Component[] } = {};

    private addComponent(instance: Component) {
        const className = instance.constructor.name;

        if (!this._components[className]) {
            this._components[className] = [];
        }

        this._components[className].push(instance);
    }

    createEntity<T extends Component[]>(components: T) {
        const entity = new Entity();

        components.forEach((component) => {
            component.setParent(entity);
            this.addComponent(component);
        });

        this._entities.push(entity);

        return components;
    }

    deleteEntity(entity: Entity) {
        Object.entries(this._components).forEach(([type, components]) => {
            this._components[type] = components.filter(
                (component) => component.parent != entity,
            );
        });
    }

    query<T extends Array<Component>>(
        query: (new (...arg: any[]) => ArrayElement<T>)[],
    ) {
        const components: { [key: string]: Component[] } = {};

        // Initialize component array lookup table with first component in query.
        this._components[query[0].name].forEach((component) => {
            components[component.parent!.id] = [component];
        });

        for (let componentType of query) {
            let componentName = componentType.name;

            // Skip first component
            if (componentName == query[0].name) {
                continue;
            }

            // Add components to lookup table if they share parent
            this._components[componentName].forEach((component) => {
                const componentArray = components[component.parent!.id];
                if (componentArray) {
                    componentArray.push(component);
                }
            });
        }

        // Remove all component arrays that don't match all query components
        return Object.values(components).filter(
            (component) => component.length == query.length,
        ) as T[];
    }
}
