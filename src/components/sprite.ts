import { Component } from "../ecs/component";
import { Shader } from "../graphics/shader";
import { Texture } from "../graphics/texture";
import { draw } from "../graphics/webgl";
import spriteFragmentShader from "../../shaders/sprite.frag.glsl?raw";
import spriteVertexShader from "../../shaders/sprite.vert.glsl?raw";

// vp_matrix = view projection matrix
let _spriteShader: Shader<
    [],
    ["sampler", "vp_matrix", "model_matrix", "depth"]
>;
let _shaderReady = false;

export class Sprite extends Component {
    private _texture!: Texture;
    private _failed = false;
    private _textureReady: boolean = false;
    private _src!: string;
    hidden = false;

    constructor(src: string) {
        super();

        this.src = src;
    }

    draw() {
        if (!this._textureReady || !Sprite.shader) {
            return;
        }

        this._texture.use();
        Sprite.shader.setUniformInt("sampler", [0], 1);

        draw();
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
        if (!gl) return;
        if (_spriteShader && _shaderReady) return _spriteShader;
        if (_spriteShader && !_shaderReady) return;

        _spriteShader = new Shader<
            [],
            ["sampler", "vp_matrix", "model_matrix", "depth"]
        >(
            spriteVertexShader,
            spriteFragmentShader,
            [],
            ["sampler", "vp_matrix", "model_matrix", "depth"],
        );

        _spriteShader.compile().then(() => {
            _shaderReady = true;
        });
    }
}
