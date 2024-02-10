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

    const global = globalThis || window;

    global.gl = gl;
}

export function clear() {
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

export function draw() {
    // Assumes rectangle
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}
