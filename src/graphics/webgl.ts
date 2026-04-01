export function createWebGLContext(canvas: HTMLCanvasElement) {
    const canvasSize = canvas.getBoundingClientRect();

    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;

    const gl = canvas.getContext("webgl2", { antialias: true });

    if (!gl) {
        throw new Error("This browser does not support WebGL2.");
    }

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 1);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    return gl;
}
