import Entity from "./entity.ts";

export default class Component {
    private _parent: Entity | null = null;

    // Can only be called once. Should not be called unless component exists outside an ECS.
    set_parent(parent: Entity) {
        if (!this._parent) {
            this._parent = parent;
        }
    }

    get parent() {
        return this._parent;
    }
}
