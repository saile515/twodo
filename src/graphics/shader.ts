import type { Buffer } from "./buffer";
import { Context } from "../context";

export class Shader<
    Attributes extends readonly string[],
    Uniforms extends readonly string[],
> {
    private _gl: WebGL2RenderingContext;
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

    constructor(
        context: Context,
        vertex: string,
        fragment: string,
        attributes: Attributes,
        uniforms: Uniforms,
    ) {
        this._gl = context.gl;
        this._vertex = vertex;
        this._fragment = fragment;
        this._attributeKeys = attributes;
        this._uniformKeys = uniforms;

        this._program = this._gl.createProgram();
        this.compile();
    }

    private compile() {
        const vertexShader = this._gl.createShader(this._gl.VERTEX_SHADER)!;
        this._gl.shaderSource(vertexShader, this._vertex);
        this._gl.compileShader(vertexShader);

        if (
            !this._gl.getShaderParameter(vertexShader, this._gl.COMPILE_STATUS)
        ) {
            console.error(this._gl.getShaderInfoLog(vertexShader));
            this._gl.deleteShader(vertexShader);
            throw Error("Vertex shader failed to compile.");
        }

        const fragmentShader = this._gl.createShader(this._gl.FRAGMENT_SHADER)!;
        this._gl.shaderSource(fragmentShader, this._fragment);
        this._gl.compileShader(fragmentShader);

        if (
            !this._gl.getShaderParameter(
                fragmentShader,
                this._gl.COMPILE_STATUS,
            )
        ) {
            console.error(this._gl.getShaderInfoLog(fragmentShader));
            this._gl.deleteShader(fragmentShader);
            throw Error("Fragment shader failed to compile.");
        }

        this._gl.attachShader(this._program, vertexShader);
        this._gl.attachShader(this._program, fragmentShader);
        this._gl.linkProgram(this._program);

        if (
            !this._gl.getProgramParameter(this._program, this._gl.LINK_STATUS)
        ) {
            throw Error("Shader program failed to link.");
        }

        for (const attribute of this._attributeKeys) {
            this._attributes[attribute as Attributes[number]] =
                this._gl.getAttribLocation(this._program, attribute);
        }

        for (const uniform of this._uniformKeys) {
            const uniformLocation = this._gl.getUniformLocation(
                this._program,
                uniform,
            );

            if (!uniformLocation) {
                continue;
            }

            this._uniforms[uniform as Uniforms[number]] = uniformLocation;
        }
    }

    use() {
        this._gl.useProgram(this._program);
    }

    setAttribute(attribute: Attributes[number], data: Buffer) {
        data.bind();
        this._gl.vertexAttribPointer(
            this._attributes[attribute],
            data.components,
            this._gl.FLOAT,
            false,
            0,
            0,
        );
        this._gl.enableVertexAttribArray(this._attributes[attribute]);
    }

    setUniformFloat(uniform: Uniforms[number], data: number[]) {
        if (data.length < 1 || data.length > 4) {
            throw new Error("Length of data must be in the range 1-4.");
        }

        (this._gl as any)[`uniform${data.length}f`](
            this._uniforms[uniform],
            ...data,
        );
    }

    setUniformInt(uniform: Uniforms[number], data: number[]) {
        if (data.length < 1 || data.length > 4) {
            throw new Error("Length of data must be in the range 1-4.");
        }

        (this._gl as any)[`uniform${data.length}i`](
            this._uniforms[uniform],
            ...data,
        );
    }

    setUniformVector(uniform: Uniforms[number], data: number[]) {
        if (data.length < 1 || data.length > 4) {
            throw new Error("Length of data must be in the range 1-4.");
        }

        (this._gl as any)[`uniform${data.length}fv`](
            this._uniforms[uniform],
            data,
        );
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

        (this._gl as any)[`uniformMatrix${components}fv`](
            this._uniforms[uniform],
            false,
            data,
        );
    }
}
