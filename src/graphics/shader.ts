import type { Buffer } from "./buffer";

export class Shader<
    Attributes extends readonly string[],
    Uniforms extends readonly string[],
> {
    private _vertex: string;
    private _fragment: string;
    private _attributeKeys: Attributes;
    private _uniformKeys: Uniforms;
    private _program: WebGLProgram;
    private _attributes: { [Attribute in Attributes[number]]: GLint } = {} as {
        [Attribute in Attributes[number]]: GLint;
    };
    private _uniforms: {
        [Uniform in Uniforms[number]]: WebGLUniformLocation;
    } = {} as {
        [Uniform in Uniforms[number]]: WebGLUniformLocation;
    };
    private _isCompiled = false;

    constructor(
        vertex: string,
        fragment: string,
        attributes: Attributes,
        uniforms: Uniforms,
    ) {
        this._vertex = vertex;
        this._fragment = fragment;
        this._attributeKeys = attributes;
        this._uniformKeys = uniforms;

        this._program = gl.createProgram();
    }

    get isCompiled() {
        return this._isCompiled;
    }

    compile() {
        const vertexShader = gl.createShader(gl.VERTEX_SHADER)!;
        gl.shaderSource(vertexShader, this._vertex);
        gl.compileShader(vertexShader);

        if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(vertexShader));
            gl.deleteShader(vertexShader);
            throw Error("Vertex shader failed to compile.");
        }

        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;
        gl.shaderSource(fragmentShader, this._fragment);
        gl.compileShader(fragmentShader);

        if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(fragmentShader));
            gl.deleteShader(fragmentShader);
            throw Error("Fragment shader failed to compile.");
        }

        gl.attachShader(this._program, vertexShader);
        gl.attachShader(this._program, fragmentShader);
        gl.linkProgram(this._program);

        if (!gl.getProgramParameter(this._program, gl.LINK_STATUS)) {
            throw Error("Shader program failed to link.");
        }

        for (const attribute of this._attributeKeys) {
            this._attributes[attribute as Attributes[number]] =
                gl.getAttribLocation(this._program, attribute);
        }

        for (const uniform of this._uniformKeys) {
            const uniformLocation = gl.getUniformLocation(
                this._program,
                uniform,
            );

            if (!uniformLocation) {
                continue;
            }

            this._uniforms[uniform as Uniforms[number]] = uniformLocation;
        }

        this._isCompiled = true;
    }

    use() {
        gl.useProgram(this._program);
    }

    setAttribute(attribute: Attributes[number], data: Buffer) {
        data.bind();
        gl.vertexAttribPointer(
            this._attributes[attribute],
            data.components,
            gl.FLOAT,
            false,
            0,
            0,
        );
        gl.enableVertexAttribArray(this._attributes[attribute]);
    }

    setUniformFloat(uniform: Uniforms[number], data: number[]) {
        if (data.length < 1 || data.length > 4) {
            throw new Error("Length of data must be in the range 1-4.");
        }

        (gl as any)[`uniform${data.length}f`](this._uniforms[uniform], ...data);
    }

    setUniformInt(uniform: Uniforms[number], data: number[]) {
        if (data.length < 1 || data.length > 4) {
            throw new Error("Length of data must be in the range 1-4.");
        }

        (gl as any)[`uniform${data.length}i`](this._uniforms[uniform], ...data);
    }

    setUniformVector(uniform: Uniforms[number], data: number[]) {
        if (data.length < 1 || data.length > 4) {
            throw new Error("Length of data must be in the range 1-4.");
        }

        (gl as any)[`uniform${data.length}fv`](this._uniforms[uniform], data);
    }

    setUniformMatrix(
        uniform: Uniforms[number],
        data: { [index: number]: number; length: number },
    ) {
        let components: number;

        switch (data.length) {
            case 4:
                components = 2;
                break;
            case 9:
                components = 3;
                break;
            case 16:
                components = 4;
                break;
            default:
                throw new Error(
                    `Invalid matrix size, expected length 4 | 9 | 16, got ${data.length}`,
                );
        }

        (gl as any)[`uniformMatrix${components}fv`](
            this._uniforms[uniform],
            false,
            data,
        );
    }
}
