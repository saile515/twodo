import { Entity } from "./entity";

export class Component {
    private _parent: Entity | null = null;

    // Can only be called once. Should not be called unless component exists outside an ECS.
    setParent(parent: Entity) {
        if (!this._parent) {
            this._parent = parent;
        }
    }

    get parent() {
        return this._parent;
    }
}
