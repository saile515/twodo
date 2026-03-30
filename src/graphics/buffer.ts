export class Buffer {
    private _gl: WebGL2RenderingContext;
    private _buffer: WebGLBuffer;
    private _target: GLenum;
    private _usage: GLenum;
    readonly components: number;

    constructor(
        gl: WebGL2RenderingContext,
        settings: { target: GLenum; usage: GLenum; components: number } = {
            target: gl.ARRAY_BUFFER,
            usage: gl.STATIC_DRAW,
            components: 2,
        },
    ) {
        this._gl = gl;
        this._target = settings.target;
        this._usage = settings.usage;
        this.components = settings.components;

        this._buffer = gl.createBuffer();
    }

    set(data: number[]) {
        this._gl.bindBuffer(this._target, this._buffer);
        this._gl.bufferData(
            this._target,
            new Float32Array(data),
            this._usage,
            0,
        );
    }

    get() {
        return this._buffer;
    }

    bind() {
        this._gl.bindBuffer(this._target, this._buffer);
    }
}
