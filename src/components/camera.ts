import { Component } from "../ecs/component";
import { Entity } from "../ecs/entity";

export class Camera extends Component {
    active = true;

    constructor(parent: Entity) {
        super(parent);
    }
}
