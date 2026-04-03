import { mat3, vec2 } from "gl-matrix";

import { Axis } from "../types/axis";
import { Camera } from "../components/camera";
import { Context } from "../context";

export function createProjectMatrix(context: Context, camera: Camera) {
    const projectionMatrix = mat3.create();

    const viewportWidth = context.gl.canvas.width;
    const viewportHeight = context.gl.canvas.height;

    mat3.projection(projectionMatrix, viewportWidth, viewportHeight);
    mat3.translate(projectionMatrix, projectionMatrix, [
        viewportWidth / 2,
        viewportHeight / 2,
    ]);

    const scaleReference =
        camera.scaleAxis == Axis.X ? viewportWidth : viewportHeight;
    const scale = scaleReference / camera.scale;

    mat3.scale(
        projectionMatrix,
        projectionMatrix,
        vec2.fromValues(scale, -scale),
    );

    return projectionMatrix;
}
