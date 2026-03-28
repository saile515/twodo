import { mat3, vec2 } from "gl-matrix";

import { Component } from "../ecs/component";
import { Entity } from "../ecs/entity";
import { Transform } from "../components/transform";

export class Camera extends Component {
    private _projectionMatrix = mat3.create();

    constructor(parent: Entity, viewportWidth: number, viewportHeight: number) {
        super(parent);
        this.calculateProjectionMatrix(viewportWidth, viewportHeight);
    }

    calculateProjectionMatrix(viewportWidth: number, viewportHeight: number) {
        mat3.projection(this._projectionMatrix, viewportWidth, viewportHeight);
        mat3.translate(this._projectionMatrix, this._projectionMatrix, [
            viewportWidth / 2,
            viewportHeight / 2,
        ]);
        // Create appropriate scale relative to screen width
        mat3.scale(
            this._projectionMatrix,
            this._projectionMatrix,
            vec2.fromValues(viewportWidth / 25, -viewportWidth / 25),
        );
    }

    get projectionMatrix() {
        return this._projectionMatrix;
    }
}

export type CameraBundle = [Camera, Transform];
