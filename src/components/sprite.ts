import { Component } from "../ecs/component";
import { Entity } from "./../ecs/entity";
import { Shader } from "../graphics/shader";
import { Texture } from "../graphics/texture";
import spriteFragmentShader from "../../shaders/sprite.frag.glsl?raw";
import spriteVertexShader from "../../shaders/sprite.vert.glsl?raw";

export class Sprite extends Component {
    private static _spriteShader: Shader<
        [],
        ["sampler", "vp_matrix", "model_matrix", "depth"]
    >;

    private _texture!: Texture;
    private _failed = false;
    private _textureReady: boolean = false;
    private _src!: string;
    hidden = false;

    constructor(parent: Entity, src: string) {
        super(parent);

        this.src = src;
    }

    draw() {
        if (!this._textureReady) {
            return;
        }

        this._texture.use();
        Sprite.shader.setUniformInt("sampler", [0]);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    set src(src: string) {
        this._src = src;
        this._texture = new Texture(src);
        this._texture
            .init()
            .then(() => {
                this._textureReady = true;
            })
            .catch(() => {
                this._failed = true;
            });
    }

    get src() {
        return this._src;
    }

    get failed() {
        return this._failed;
    }

    static get shader() {
        if (!this._spriteShader) {
            this._spriteShader = new Shader<
                [],
                ["sampler", "vp_matrix", "model_matrix", "depth"]
            >(
                spriteVertexShader,
                spriteFragmentShader,
                [],
                ["sampler", "vp_matrix", "model_matrix", "depth"],
            );
            this._spriteShader.compile();
        }

        return this._spriteShader;
    }
}
