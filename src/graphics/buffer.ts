export default class Buffer {
    private _buffer: WebGLBuffer;
    private _target: GLenum;
    private _usage: GLenum;
    readonly components: number;

    constructor(
        settings: { target: GLenum; usage: GLenum; components: number } = {
            target: gl.ARRAY_BUFFER,
            usage: gl.STATIC_DRAW,
            components: 2,
        },
    ) {
        this._target = settings.target;
        this._usage = settings.usage;
        this.components = settings.components;

        this._buffer = gl.createBuffer()!;
    }

    set(data: number[]) {
        gl.bindBuffer(this._target, this._buffer);
        gl.bufferData(this._target, new Float32Array(data), this._usage, 0);
    }

    get() {
        return this._buffer;
    }

    bind() {
        gl.bindBuffer(this._target, this._buffer);
    }
}
