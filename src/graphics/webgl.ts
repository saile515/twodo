declare global {
    var gl: Readonly<WebGL2RenderingContext>;
}

export function init_webgl(canvas: HTMLCanvasElement) {
    const canvas_size = canvas.getBoundingClientRect();

    canvas.width = canvas_size.width;
    canvas.height = canvas_size.height;

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

export function clear() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

export function draw() {
    // Assumes rectangle
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}
