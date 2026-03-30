import { BundleInstance } from "../types/util";
import { Context } from "../context";
import { Shader } from "../graphics/shader";
import { Sprite } from "../components/sprite";
import { TextureStatus } from "../graphics/texture";
import { Transform } from "../components/transform";
import spriteFragmentShader from "../../shaders/sprite.frag.glsl?raw";
import spriteVertexShader from "../../shaders/sprite.vert.glsl?raw";

export const spriteRendererBundle = [Sprite, Transform] as const;

export type SpriteRendererBundle = BundleInstance<typeof spriteRendererBundle>;

export let spriteShader: Shader<
    [],
    ["sampler", "vp_matrix", "model_matrix", "depth"]
>;

export function initSpriteShader(context: Context) {
    spriteShader ??= new Shader(
        context,
        spriteVertexShader,
        spriteFragmentShader,
        [],
        ["sampler", "vp_matrix", "model_matrix", "depth"],
    );
}

export function spriteRenderer(
    context: Context,
    [sprite, transform]: SpriteRendererBundle,
) {
    if (sprite.hidden || sprite.texture.status != TextureStatus.Ready) {
        return;
    }

    spriteShader.setUniformMatrix("model_matrix", transform.matrix);
    spriteShader.setUniformFloat("depth", [transform.depth]);

    sprite.texture.use();
    spriteShader.setUniformInt("sampler", [0]);

    context.gl.drawArrays(context.gl.TRIANGLE_STRIP, 0, 4);
}
