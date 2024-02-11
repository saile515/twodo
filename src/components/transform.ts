import Component from "../ecs/component";
import { Vector2 } from "../types/vector";
import { mat3 } from "gl-matrix";

export default class Transform extends Component {
    private _matrix = mat3.create();
    private _position = new Vector2(0, 0);
    private _scale = new Vector2(1, 1);
    private _rotation = 0;
    private _depth = 0;

    constructor() {
        super();
    }

    private calculate_matrix() {
        mat3.fromTranslation(this._matrix, [this._position.x, this._position.y]);
        mat3.rotate(this._matrix, this._matrix, (this._rotation * Math.PI) / 180);
        mat3.scale(this._matrix, this._matrix, [this._scale.x, this._scale.y]);
    }

    set position(value: Vector2) {
        this._position = value;
        this.calculate_matrix();
    }

    set scale(value: Vector2) {
        this._scale = value;
        this.calculate_matrix();
    }

    set rotation(value: number) {
        this._rotation = value;
        this.calculate_matrix();
    }

    set depth(value: number) {
        this._depth = value;
    }

    get position() {
        return this._position;
    }

    get scale() {
        return this._scale;
    }

    get rotation() {
        return this._rotation;
    }

    get depth() {
        return this._depth;
    }

    get matrix() {
        return this._matrix;
    }
}
