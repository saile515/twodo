import {
    initSpriteShader,
    spriteRenderer,
    spriteRendererBundle,
    spriteShader,
} from "./sprite-renderer";
import { mat3, vec2 } from "gl-matrix";

import { Camera } from "../components/camera";
import { Context } from "../context";
import { Transform } from "../components/transform";

export const cameraBundle = [Camera, Transform] as const;

export function renderer(context: Context) {
    context.gl.clear(context.gl.COLOR_BUFFER_BIT | context.gl.DEPTH_BUFFER_BIT);

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

    const projectionMatrix = mat3.create();

    const viewportWidth = context.gl.canvas.width;
    const viewportHeight = context.gl.canvas.height;

    mat3.projection(projectionMatrix, viewportWidth, viewportWidth);
    mat3.translate(projectionMatrix, projectionMatrix, [
        viewportWidth / 2,
        viewportHeight / 2,
    ]);
    // Create appropriate scale relative to screen width
    mat3.scale(
        projectionMatrix,
        projectionMatrix,
        vec2.fromValues(viewportWidth / 25, -viewportWidth / 25),
    );

    const vpMatrix = mat3.create();
    mat3.multiply(vpMatrix, projectionMatrix, viewMatrix);

    spriteShader.setUniformMatrix("vp_matrix", vpMatrix);

    context.invoke(spriteRenderer, spriteRendererBundle);
}
