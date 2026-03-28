import type { Buffer } from "./buffer";

export class Shader<Attributes extends string[], Uniforms extends string[]> {
    private _vertex: string;
    private _fragment: string;
    private _attributeKeys: Attributes;
    private _uniformKeys: Uniforms;
    private _program: WebGLProgram;
    private _attributes: { [key in Attributes[number]]: GLint } = {} as {
        [key in Attributes[number]]: GLint;
    };
    private _uniforms: { [key in Uniforms[number]]: WebGLUniformLocation } =
        {} as {
            [key in Uniforms[number]]: WebGLUniformLocation;
        };

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

        this._program = gl.createProgram()!;
    }

    async compile() {
        // Compile vertex shader
        const vertexShader = gl.createShader(gl.VERTEX_SHADER)!;
        gl.shaderSource(vertexShader, this._vertex);
        gl.compileShader(vertexShader);

        // Verify vertex shader
        if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(vertexShader));
            gl.deleteShader(vertexShader);
            throw Error("Vertex shader failed to compile.");
        }

        // Compile fragment shader
        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;
        gl.shaderSource(fragmentShader, this._fragment);
        gl.compileShader(fragmentShader);

        // Verify fragment shader
        if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(fragmentShader));
            gl.deleteShader(fragmentShader);
            throw Error("Fragment shader failed to compile.");
        }

        // Link shader program
        gl.attachShader(this._program, vertexShader);
        gl.attachShader(this._program, fragmentShader);
        gl.linkProgram(this._program);

        if (!gl.getProgramParameter(this._program, gl.LINK_STATUS)) {
            throw Error("Shader program failed to link.");
        }

        // Initialize attributes and uniforms
        this._attributeKeys.forEach((attribute) => {
            this._attributes[attribute as Attributes[number]] =
                gl.getAttribLocation(this._program, attribute);
        });

        this._uniformKeys.forEach((uniform) => {
            let uniformLocation = gl.getUniformLocation(this._program, uniform);

            if (uniformLocation) {
                this._uniforms[uniform as Uniforms[number]] = uniformLocation;
            }
        });
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

    // Components should be integer between 1 and 4
    setUniformFloat(
        uniform: Uniforms[number],
        data: number[],
        components: number,
    ) {
        // Throws an error if not called like this, do not touch
        (gl as any)[
            ("uniform" + components + "f") as keyof WebGL2RenderingContext
        ](this._uniforms[uniform], ...data);
    }

    // Components should be integer between 1 and 4
    setUniformInt(
        uniform: Uniforms[number],
        data: number[],
        components: number,
    ) {
        // Throws an error if not called like this, do not touch
        (gl as any)[
            ("uniform" + components + "i") as keyof WebGL2RenderingContext
        ](this._uniforms[uniform], ...data);
    }

    // Components should be integer between 1 and 4
    setUniformVector(
        uniform: Uniforms[number],
        data: number[],
        components: number,
    ) {
        // Throws an error if not called like this, do not touch
        (gl as any)[
            ("uniform" + components + "fv") as keyof WebGL2RenderingContext
        ](this._uniforms[uniform], data);
    }

    // Components should be integer between 2 and 4, matrix of n*n size
    setUniformMatrix(
        uniform: Uniforms[number],
        data: Float32Array,
        components: number,
    ) {
        // Throws an error if not called like this, do not touch
        (gl as any)[
            ("uniformMatrix" +
                components +
                "fv") as keyof WebGL2RenderingContext
        ](this._uniforms[uniform], false, data);
    }
}
