import Component from "./component.ts";
import Entity from "./entity.ts";
import type { ArrayElement } from "../types/array_element.ts";

// Entity Component System
export default class ECS {
    private _entities: Entity[] = [];
    private _components: { [key: string]: Component[] } = {};

    private add_component(instance: Component) {
        const class_name = instance.constructor.name;

        if (!this._components[class_name]) {
            this._components[class_name] = [];
        }

        this._components[class_name].push(instance);
    }

    create_entity<T extends Component[]>(components: T) {
        const entity = new Entity();

        components.forEach((component) => {
            component.set_parent(entity);
            this.add_component(component);
        });

        this._entities.push(entity);

        return components;
    }

    query<T extends Array<Component>>(query: (new (...arg: any[]) => ArrayElement<T>)[]) {
        const components: { [key: string]: Component[] } = {};

        // Initialize component array lookup table with first component in query.
        this._components[query[0].name].forEach((component) => {
            components[component.parent!.id] = [component];
        });

        for (let component_type of query) {
            let component_name = component_type.name;

            // Skip first component
            if (component_name == query[0].name) {
                continue;
            }

            // Add components to lookup table if they share parent
            this._components[component_name].forEach((component) => {
                const component_array = components[component.parent!.id];
                if (component_array) {
                    component_array.push(component);
                }
            });
        }

        // Remove all component arrays that don't match all query components
        return Object.values(components).filter((component) => component.length == query.length) as T[];
    }
}
