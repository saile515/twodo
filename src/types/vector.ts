import Scene from "../scene.ts";
import { mat3, vec2 } from "gl-matrix";

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

    clip_space_to_world_space(scene: Scene) {
        if (!scene.active_camera) {
            return new Vector2(0, 0);
        }

        const [camera, camera_transform] = scene.active_camera;

        const view_matrix = mat3.create();
        mat3.invert(view_matrix, camera_transform.matrix);

        const vp_matrix = mat3.create(); // View projection matrix
        mat3.multiply(vp_matrix, camera.projection_matrix, view_matrix);

        const inversed = mat3.create();
        mat3.invert(inversed, vp_matrix);

        const clip_space = vec2.fromValues(this._x, this._y);
        const world_space = vec2.create();
        vec2.transformMat3(world_space, clip_space, inversed);

        return new Vector2(world_space[0], world_space[1]);
    }

    is_within(a: Vector2, b: Vector2) {
        if (a.x <= this._x && b.x >= this._x && a.y <= this._y && b.y >= this._y) {
            return true;
        } else {
            return false;
        }
    }

    static sub(a: Vector2, b: Vector2) {
        return new Vector2(a.x - b.x, a.y - b.y);
    }

    static add(a: Vector2, b: Vector2) {
        return new Vector2(a.x + b.x, a.y + b.y);
    }
}
