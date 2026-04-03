import {
    initSpriteShader,
    spriteRenderer,
    spriteRendererBundle,
    spriteShader,
} from "./sprite-renderer";

import { Camera } from "../components/camera";
import { Context } from "../context";
import { Transform } from "../components/transform";
import { createProjectMatrix } from "../lib/projection";
import { mat3 } from "gl-matrix";

export const cameraBundle = [Camera, Transform] as const;

export function renderer(context: Context) {
    context.input.mouse.clearDelta();

    const camera = context.ecs
        .query(cameraBundle)
        .find(([camera]) => camera.active);

    if (!camera) {
        return;
    }

    initSpriteShader(context);
    spriteShader.use();

    const viewMatrix = mat3.create();
    mat3.invert(viewMatrix, camera[1].matrix);

    const viewportWidth = context.gl.canvas.width;
    const viewportHeight = context.gl.canvas.height;

    context.gl.viewport(0, 0, viewportWidth, viewportHeight);
    context.gl.clear(context.gl.COLOR_BUFFER_BIT | context.gl.DEPTH_BUFFER_BIT);

    const projectionMatrix = createProjectMatrix(context, camera[0]);

    const vpMatrix = mat3.create();
    mat3.multiply(vpMatrix, projectionMatrix, viewMatrix);

    spriteShader.setUniformMatrix("vp_matrix", vpMatrix);

    context.invoke(spriteRenderer, spriteRendererBundle);
}
