import Component from "../ecs/component.ts";
import Texture from "../graphics/texture.ts";
import Shader from "../graphics/shader.ts";
import { draw } from "../graphics/webgl.ts";
import sprite_vertex_shader from "../../shaders/sprite.vert.glsl?raw";
import sprite_fragment_shader from "../../shaders/sprite.frag.glsl?raw";

// vp_matrix = view projection matrix
let _sprite_shader: Shader<[], ["sampler", "vp_matrix", "model_matrix", "depth"]>;
let _shader_ready = false;

export default class Sprite extends Component {
    private _texture: Texture;
    private _failed = false;
    private _texture_ready: boolean = false;
    hidden = false;

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

        this._texture.use();
        Sprite.shader.set_uniform_int("sampler", [0], 1);

        draw();
    }

    set src(src: string) {
        this._texture = new Texture(src);
        this._texture
            .init()
            .then(() => {
                this._texture_ready = true;
            })
            .catch(() => {
                this._failed = true;
            });
    }

    get failed() {
        return this._failed;
    }

    static get shader() {
        if (!gl) return;
        if (_sprite_shader && _shader_ready) return _sprite_shader;
        if (_sprite_shader && !_shader_ready) return;

        _sprite_shader = new Shader<[], ["sampler", "vp_matrix", "model_matrix", "depth"]>(
            sprite_vertex_shader,
            sprite_fragment_shader,
            [],
            ["sampler", "vp_matrix", "model_matrix", "depth"],
        );

        _sprite_shader.compile().then(() => {
            _shader_ready = true;
        });
    }
}
