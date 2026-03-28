import { CameraBundle } from "./components/camera";
import { ECS } from "./ecs/ecs";
import { InputManager } from "./input/input-manager";
import { Sprite } from "./components/sprite";
import { Transform } from "./components/transform";
import { initWebGL } from "./graphics/webgl";
import { mat3 } from "gl-matrix";

export class Scene {
    private _activeCamera: CameraBundle | null = null;

    readonly input = new InputManager();
    readonly ecs = new ECS();

    constructor(canvas: HTMLCanvasElement) {
        initWebGL(canvas);
    }

    set activeCamera(camera: CameraBundle) {
        this._activeCamera = camera;
    }

    get activeCamera(): CameraBundle | null {
        return this._activeCamera;
    }

    draw() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        this.input.mouse.clearDelta();

        if (!this._activeCamera) {
            return;
        }

        Sprite.shader.use();

        const viewMatrix = mat3.create();
        mat3.invert(viewMatrix, this._activeCamera[1].matrix);

        const vpMatrix = mat3.create();
        mat3.multiply(
            vpMatrix,
            this._activeCamera[0].projectionMatrix,
            viewMatrix,
        );

        Sprite.shader.setUniformMatrix("vp_matrix", vpMatrix);

        this.ecs.query([Sprite, Transform]).forEach(([sprite, transform]) => {
            if (sprite.hidden) {
                return;
            }

            Sprite.shader.setUniformMatrix("model_matrix", transform.matrix);
            Sprite.shader.setUniformFloat("depth", [transform.depth]);
            sprite.draw();
        });
    }
}
