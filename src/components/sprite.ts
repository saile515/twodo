import { Component } from "../ecs/component";
import { Entity } from "./../ecs/entity";
import { Texture } from "../graphics/texture";

export class Sprite extends Component {
    private _texture: Texture;
    hidden = false;

    constructor(parent: Entity, texture: Texture) {
        super(parent);

        this._texture = texture;
    }

    get texture() {
        return this._texture;
    }
}
