import { Axis } from "../types/axis";
import { Component } from "../ecs/component";
import { Entity } from "../ecs/entity";

export class Camera extends Component {
    active = true;
    scale = 25;
    scaleAxis = Axis.X;

    constructor(parent: Entity) {
        super(parent);
    }
}
