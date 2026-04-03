import { mat3, vec2 } from "gl-matrix";

import { Camera } from "../components/camera";
import { Context } from "../context";
import { Transform } from "../components/transform";
import { createProjectMatrix } from "../lib/projection";

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

    isWithin(a: Vector2, b: Vector2) {
        return (
            a.x <= this._x && b.x >= this._x && a.y <= this._y && b.y >= this._y
        );
    }

    clipSpaceToWorldSpace(context: Context) {
        const cameraBundle = context.ecs
            .query([Camera, Transform])
            .find(([camera]) => camera.active);

        if (!cameraBundle) {
            throw new Error("No active camera in context.");
        }

        const [camera, transform] = cameraBundle;

        const viewMatrix = mat3.create();
        mat3.invert(viewMatrix, transform.matrix);

        const projectionMatrix = createProjectMatrix(context, camera);

        const vpMatrix = mat3.create();
        mat3.multiply(vpMatrix, projectionMatrix, viewMatrix);

        const inversed = mat3.create();
        mat3.invert(inversed, vpMatrix);

        const clipSpace = vec2.fromValues(this._x, this._y);
        const worldSpace = vec2.create();
        vec2.transformMat3(worldSpace, clipSpace, inversed);

        return new Vector2(worldSpace[0], -worldSpace[1]);
    }

    static subtract(a: Vector2, b: Vector2) {
        return new Vector2(a.x - b.x, a.y - b.y);
    }

    static add(a: Vector2, b: Vector2) {
        return new Vector2(a.x + b.x, a.y + b.y);
    }
}
