import { Entity } from "./entity";

export class Component {
    private _parent: Entity;

    constructor(parent: Entity) {
        this._parent = parent;
    }

    get parent() {
        return this._parent;
    }
}
