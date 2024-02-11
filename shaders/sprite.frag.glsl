#version 300 es

in highp vec2 texture_position;
uniform sampler2D sampler;

out highp vec4 frag_color;

void main(void) {
    frag_color = texture(sampler, texture_position);
}
