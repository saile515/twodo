import Component from "../ecs/component.ts";
import Texture from "../graphics/texture.ts";
import Shader from "../graphics/shader.ts";
import { draw } from "../graphics/webgl.ts";

// vp_matrix = view projection matrix
let _sprite_shader: Shader<[], ["sampler", "vp_matrix", "model_matrix"]>;
let _shader_ready = false;

export default class Sprite extends Component {
    private _texture: Texture;
    private _failed = false;
    private _texture_ready: boolean = false;

    constructor(image_source: string) {
        super();

        this._texture = new Texture(image_source);
        this._texture
            .init()
            .then(() => {
                this._texture_ready = true;
            })
            .catch(() => {
                this._failed = true;
            });
    }

    draw() {
        if (!this._texture_ready || !Sprite.shader) {
            return;
        }

        Sprite.shader.set_uniform_int("sampler", [0], 1);

        draw();
    }

    get failed() {
        return this._failed;
    }

    static get shader() {
        if (!gl) return;
        if (_sprite_shader && _shader_ready) return _sprite_shader;
        if (_sprite_shader && !_shader_ready) return;

        _sprite_shader = new Shader<[], ["sampler", "vp_matrix", "model_matrix"]>(
            "/shaders/sprite.vert.glsl",
            "/shaders/sprite.frag.glsl",
            [],
            ["sampler", "vp_matrix", "model_matrix"],
        );

        _sprite_shader.compile().then(() => {
            _shader_ready = true;
        });
    }
}
