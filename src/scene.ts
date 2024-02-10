import ECS from "./ecs/ecs";
import Sprite from "./components/sprite.ts";
import Transform from "./components/transform.ts";
import { CameraBundle } from "./components/camera.ts";
import { init_webgl, clear } from "./graphics/webgl.ts";
import { mat3 } from "gl-matrix";

export default class Scene {
    private _active_camera: CameraBundle | null = null;

    readonly ecs = new ECS();

    constructor(canvas: HTMLCanvasElement) {
        init_webgl(canvas);
    }

    set_active_camera(camera: CameraBundle) {
        this._active_camera = camera;
    }

    draw() {
        clear();

        if (!this._active_camera || !Sprite.shader) {
            return;
        }

        Sprite.shader.use();

        // Create view matrix from camera transform
        const view_matrix = mat3.create();
        mat3.invert(view_matrix, this._active_camera[1].matrix);

        const vp_matrix = mat3.create(); // View projection matrix
        mat3.multiply(vp_matrix, this._active_camera[0].projection_matrix, view_matrix);

        Sprite.shader.set_uniform_matrix("vp_matrix", vp_matrix as Float32Array, 3);

        this.ecs.query<[Sprite, Transform]>([Sprite, Transform]).forEach(([sprite, transform]) => {
            Sprite.shader!.set_uniform_matrix("model_matrix", transform.matrix as Float32Array, 3);
            sprite.draw();
        });
    }
}
