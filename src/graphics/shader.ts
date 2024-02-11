import type Buffer from "./buffer";

export default class Shader<Attributes extends string[], Uniforms extends string[]> {
    private _vertex: string;
    private _fragment: string;
    private _attribute_keys: Attributes;
    private _uniform_keys: Uniforms;
    private _program: WebGLProgram;
    private _attributes: { [key in Attributes[number]]: GLint } = {} as { [key in Attributes[number]]: GLint };
    private _uniforms: { [key in Uniforms[number]]: WebGLUniformLocation } = {} as {
        [key in Uniforms[number]]: WebGLUniformLocation;
    };

    constructor(vertex: string, fragment: string, attributes: Attributes, uniforms: Uniforms) {
        this._vertex = vertex;
        this._fragment = fragment;
        this._attribute_keys = attributes;
        this._uniform_keys = uniforms;

        this._program = gl.createProgram()!;
    }

    async compile() {
        // Compile vertex shader
        const vertex_shader = gl.createShader(gl.VERTEX_SHADER)!;
        gl.shaderSource(vertex_shader, this._vertex);
        gl.compileShader(vertex_shader);

        // Verify vertex shader
        if (!gl.getShaderParameter(vertex_shader, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(vertex_shader));
            gl.deleteShader(vertex_shader);
            throw Error("Vertex shader failed to compile.");
        }

        // Compile fragment shader
        const fragment_shader = gl.createShader(gl.FRAGMENT_SHADER)!;
        gl.shaderSource(fragment_shader, this._fragment);
        gl.compileShader(fragment_shader);

        // Verify fragment shader
        if (!gl.getShaderParameter(fragment_shader, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(fragment_shader));
            gl.deleteShader(fragment_shader);
            throw Error("Fragment shader failed to compile.");
        }

        // Link shader program
        gl.attachShader(this._program, vertex_shader);
        gl.attachShader(this._program, fragment_shader);
        gl.linkProgram(this._program);

        if (!gl.getProgramParameter(this._program, gl.LINK_STATUS)) {
            throw Error("Shader program failed to link.");
        }

        // Initialize attributes and uniforms
        this._attribute_keys.forEach((attribute) => {
            this._attributes[attribute as Attributes[number]] = gl.getAttribLocation(this._program, attribute);
        });

        this._uniform_keys.forEach((uniform) => {
            let uniform_location = gl.getUniformLocation(this._program, uniform);

            if (uniform_location) {
                this._uniforms[uniform as Uniforms[number]] = uniform_location;
            }
        });
    }

    use() {
        gl.useProgram(this._program);
    }

    set_attribute(attribute: Attributes[number], data: Buffer) {
        data.bind();
        gl.vertexAttribPointer(this._attributes[attribute], data.components, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this._attributes[attribute]);
    }

    // Components should be integer betweeen 1 and 4
    set_uniform_float(uniform: Uniforms[number], data: number[], components: number) {
        // Throws an error if not called like this, do not touch
        (gl as any)[("uniform" + components + "f") as keyof WebGL2RenderingContext](this._uniforms[uniform], ...data);
    }

    // Components should be integer betweeen 1 and 4
    set_uniform_int(uniform: Uniforms[number], data: number[], components: number) {
        // Throws an error if not called like this, do not touch
        (gl as any)[("uniform" + components + "i") as keyof WebGL2RenderingContext](this._uniforms[uniform], ...data);
    }

    // Components should be integer betweeen 1 and 4
    set_uniform_vector(uniform: Uniforms[number], data: number[], components: number) {
        // Throws an error if not called like this, do not touch
        (gl as any)[("uniform" + components + "fv") as keyof WebGL2RenderingContext](this._uniforms[uniform], data);
    }

    // Components should be integer between 2 and 4, matrix of n*n size
    set_uniform_matrix(uniform: Uniforms[number], data: Float32Array, components: number) {
        // Throws an error if not called like this, do not touch
        (gl as any)[("uniformMatrix" + components + "fv") as keyof WebGL2RenderingContext](
            this._uniforms[uniform],
            false,
            data,
        );
    }
}
