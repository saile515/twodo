import { mat3, vec2 } from "gl-matrix";

import { Scene } from "../scene";

export class Vector2 {
    private _x: number;
    private _y: number;

    constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    clipSpaceToWorldSpace(scene: Scene) {
        if (!scene.activeCamera) {
            return new Vector2(0, 0);
        }

        const [camera, cameraTransform] = scene.activeCamera;

        const viewMatrix = mat3.create();
        mat3.invert(viewMatrix, cameraTransform.matrix);

        const vpMatrix = mat3.create(); // View projection matrix
        mat3.multiply(vpMatrix, camera.projectionMatrix, viewMatrix);

        const inversed = mat3.create();
        mat3.invert(inversed, vpMatrix);

        const clipSpace = vec2.fromValues(this._x, this._y);
        const worldSpace = vec2.create();
        vec2.transformMat3(worldSpace, clipSpace, inversed);

        return new Vector2(worldSpace[0], -worldSpace[1]);
    }

    isWithin(a: Vector2, b: Vector2) {
        return (
            a.x <= this._x && b.x >= this._x && a.y <= this._y && b.y >= this._y
        );
    }

    static subtract(a: Vector2, b: Vector2) {
        return new Vector2(a.x - b.x, a.y - b.y);
    }

    static add(a: Vector2, b: Vector2) {
        return new Vector2(a.x + b.x, a.y + b.y);
    }
}
