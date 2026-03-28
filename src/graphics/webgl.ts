declare global {
    var gl: Readonly<WebGL2RenderingContext>;
}

export function initWebGL(canvas: HTMLCanvasElement) {
    const canvasSize = canvas.getBoundingClientRect();

    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;

    const gl = canvas.getContext("webgl2");

    if (!gl) {
        alert("This browser does not support WebGL2.");
        return 1;
    }

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 1);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    const global = globalThis || window;

    global.gl = gl;
}
