import { mat3, vec2 } from "gl-matrix";

export function createProjectMatrix(
    viewportWidth: number,
    viewportHeight: number,
) {
    const projectionMatrix = mat3.create();

    mat3.projection(projectionMatrix, viewportWidth, viewportHeight);
    mat3.translate(projectionMatrix, projectionMatrix, [
        viewportWidth / 2,
        viewportHeight / 2,
    ]);
    // TODO: Make scale adjustable in, for example, context.
    mat3.scale(
        projectionMatrix,
        projectionMatrix,
        vec2.fromValues(viewportWidth / 25, -viewportWidth / 25),
    );

    return projectionMatrix;
}
