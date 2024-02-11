#version 300 es

uniform highp mat3 vp_matrix;
uniform highp mat3 model_matrix;

out highp vec2 texture_position;

void main(void) {
    vec2 vertex_position = vec2(0.0);
    vertex_position.x = floor(float(gl_VertexID / 2)) - 0.5;
    vertex_position.y = mod(float(gl_VertexID), 2.0) - 0.5;

    gl_Position = vec4((vp_matrix * model_matrix * vec3(vertex_position, 1.0)).xy, 0.0, 1.0);
    texture_position = vertex_position + vec2(0.5);
}
