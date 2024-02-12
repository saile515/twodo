var M = Object.defineProperty;
var F = (r, e, t) => e in r ? M(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t;
var s = (r, e, t) => (F(r, typeof e != "symbol" ? e + "" : e, t), t);
class j {
  constructor() {
    s(this, "id", crypto.randomUUID());
  }
}
class B {
  constructor() {
    s(this, "_entities", []);
    s(this, "_components", {});
  }
  add_component(e) {
    const t = e.constructor.name;
    this._components[t] || (this._components[t] = []), this._components[t].push(e);
  }
  create_entity(e) {
    const t = new j();
    return e.forEach((i) => {
      i.set_parent(t), this.add_component(i);
    }), this._entities.push(t), e;
  }
  query(e) {
    const t = {};
    this._components[e[0].name].forEach((i) => {
      t[i.parent.id] = [i];
    });
    for (let i of e) {
      let a = i.name;
      a != e[0].name && this._components[a].forEach((_) => {
        const o = t[_.parent.id];
        o && o.push(_);
      });
    }
    return Object.values(t).filter((i) => i.length == e.length);
  }
}
class k {
  constructor() {
    s(this, "_parent", null);
  }
  // Can only be called once. Should not be called unless component exists outside an ECS.
  set_parent(e) {
    this._parent || (this._parent = e);
  }
  get parent() {
    return this._parent;
  }
}
class C {
  constructor(e) {
    s(this, "_texture");
    s(this, "_image", new Image());
    s(this, "_errored", !1);
    this._image.src = e, this._texture = gl.createTexture(), this._image.addEventListener("onerror", () => this._errored = !0);
  }
  handle_loaded_image() {
    gl.bindTexture(gl.TEXTURE_2D, this._texture), gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this._image), gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE), gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE), gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST), gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  }
  async init() {
    if (this._image.complete && !this._errored)
      return this.handle_loaded_image(), Promise.resolve();
    if (this._errored)
      return Promise.reject("Image could not be loaded.");
    this._image.addEventListener("load", () => (this.handle_loaded_image(), Promise.resolve())), this._image.addEventListener("error", () => Promise.reject("Image could not be loaded"));
  }
  use() {
    gl.activeTexture(gl.TEXTURE0), gl.bindTexture(gl.TEXTURE_2D, this._texture);
  }
}
class X {
  constructor(e, t, i, a) {
    s(this, "_vertex");
    s(this, "_fragment");
    s(this, "_attribute_keys");
    s(this, "_uniform_keys");
    s(this, "_program");
    s(this, "_attributes", {});
    s(this, "_uniforms", {});
    this._vertex = e, this._fragment = t, this._attribute_keys = i, this._uniform_keys = a, this._program = gl.createProgram();
  }
  async compile() {
    const e = gl.createShader(gl.VERTEX_SHADER);
    if (gl.shaderSource(e, this._vertex), gl.compileShader(e), !gl.getShaderParameter(e, gl.COMPILE_STATUS))
      throw console.error(gl.getShaderInfoLog(e)), gl.deleteShader(e), Error("Vertex shader failed to compile.");
    const t = gl.createShader(gl.FRAGMENT_SHADER);
    if (gl.shaderSource(t, this._fragment), gl.compileShader(t), !gl.getShaderParameter(t, gl.COMPILE_STATUS))
      throw console.error(gl.getShaderInfoLog(t)), gl.deleteShader(t), Error("Fragment shader failed to compile.");
    if (gl.attachShader(this._program, e), gl.attachShader(this._program, t), gl.linkProgram(this._program), !gl.getProgramParameter(this._program, gl.LINK_STATUS))
      throw Error("Shader program failed to link.");
    this._attribute_keys.forEach((i) => {
      this._attributes[i] = gl.getAttribLocation(this._program, i);
    }), this._uniform_keys.forEach((i) => {
      let a = gl.getUniformLocation(this._program, i);
      a && (this._uniforms[i] = a);
    });
  }
  use() {
    gl.useProgram(this._program);
  }
  set_attribute(e, t) {
    t.bind(), gl.vertexAttribPointer(this._attributes[e], t.components, gl.FLOAT, !1, 0, 0), gl.enableVertexAttribArray(this._attributes[e]);
  }
  // Components should be integer betweeen 1 and 4
  set_uniform_float(e, t, i) {
    gl["uniform" + i + "f"](this._uniforms[e], ...t);
  }
  // Components should be integer betweeen 1 and 4
  set_uniform_int(e, t, i) {
    gl["uniform" + i + "i"](this._uniforms[e], ...t);
  }
  // Components should be integer betweeen 1 and 4
  set_uniform_vector(e, t, i) {
    gl["uniform" + i + "fv"](this._uniforms[e], t);
  }
  // Components should be integer between 2 and 4, matrix of n*n size
  set_uniform_matrix(e, t, i) {
    gl["uniformMatrix" + i + "fv"](
      this._uniforms[e],
      !1,
      t
    );
  }
}
function N(r) {
  const e = r.getBoundingClientRect();
  r.width = e.width, r.height = e.height;
  const t = r.getContext("webgl2");
  if (!t)
    return alert("This browser does not support WebGL2."), 1;
  t.enable(t.BLEND), t.blendFunc(t.SRC_ALPHA, t.ONE_MINUS_SRC_ALPHA), t.clearColor(0, 0, 0, 1), t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL, !0);
  const i = globalThis || window;
  i.gl = t;
}
function G() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}
function O() {
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}
const Y = `#version 300 es

uniform highp mat3 vp_matrix;
uniform highp mat3 model_matrix;
uniform highp float depth;

out highp vec2 texture_position;

void main(void) {
    vec2 vertex_position = vec2(0.0);
    vertex_position.x = floor(float(gl_VertexID / 2)) - 0.5;
    vertex_position.y = mod(float(gl_VertexID), 2.0) - 0.5;

    gl_Position = vec4((vp_matrix * model_matrix * vec3(vertex_position, 1.0)).xy, depth, 1.0);
    texture_position = vertex_position + vec2(0.5);
}
`, H = `#version 300 es

in highp vec2 texture_position;
uniform sampler2D sampler;

out highp vec4 frag_color;

void main(void) {
    frag_color = texture(sampler, texture_position);
}
`;
let v, S = !1;
class p extends k {
  constructor(t) {
    super();
    s(this, "_texture");
    s(this, "_failed", !1);
    s(this, "_texture_ready", !1);
    s(this, "hidden", !1);
    this._texture = new C(t), this._texture.init().then(() => {
      this._texture_ready = !0;
    }).catch(() => {
      this._failed = !0;
    });
  }
  draw() {
    !this._texture_ready || !p.shader || (this._texture.use(), p.shader.set_uniform_int("sampler", [0], 1), O());
  }
  get failed() {
    return this._failed;
  }
  static get shader() {
    if (gl) {
      if (v && S)
        return v;
      v && !S || (v = new X(
        Y,
        H,
        [],
        ["sampler", "vp_matrix", "model_matrix", "depth"]
      ), v.compile().then(() => {
        S = !0;
      }));
    }
  }
}
var E = typeof Float32Array < "u" ? Float32Array : Array;
Math.hypot || (Math.hypot = function() {
  for (var r = 0, e = arguments.length; e--; )
    r += arguments[e] * arguments[e];
  return Math.sqrt(r);
});
function x() {
  var r = new E(9);
  return E != Float32Array && (r[1] = 0, r[2] = 0, r[3] = 0, r[5] = 0, r[6] = 0, r[7] = 0), r[0] = 1, r[4] = 1, r[8] = 1, r;
}
function P(r, e) {
  var t = e[0], i = e[1], a = e[2], _ = e[3], o = e[4], n = e[5], l = e[6], g = e[7], f = e[8], d = f * o - n * g, c = -f * _ + n * l, h = g * _ - o * l, m = t * d + i * c + a * h;
  return m ? (m = 1 / m, r[0] = d * m, r[1] = (-f * i + a * g) * m, r[2] = (n * i - a * o) * m, r[3] = c * m, r[4] = (f * t - a * l) * m, r[5] = (-n * t + a * _) * m, r[6] = h * m, r[7] = (-g * t + i * l) * m, r[8] = (o * t - i * _) * m, r) : null;
}
function I(r, e, t) {
  var i = e[0], a = e[1], _ = e[2], o = e[3], n = e[4], l = e[5], g = e[6], f = e[7], d = e[8], c = t[0], h = t[1], m = t[2], T = t[3], y = t[4], b = t[5], w = t[6], A = t[7], R = t[8];
  return r[0] = c * i + h * o + m * g, r[1] = c * a + h * n + m * f, r[2] = c * _ + h * l + m * d, r[3] = T * i + y * o + b * g, r[4] = T * a + y * n + b * f, r[5] = T * _ + y * l + b * d, r[6] = w * i + A * o + R * g, r[7] = w * a + A * n + R * f, r[8] = w * _ + A * l + R * d, r;
}
function W(r, e, t) {
  var i = e[0], a = e[1], _ = e[2], o = e[3], n = e[4], l = e[5], g = e[6], f = e[7], d = e[8], c = t[0], h = t[1];
  return r[0] = i, r[1] = a, r[2] = _, r[3] = o, r[4] = n, r[5] = l, r[6] = c * i + h * o + g, r[7] = c * a + h * n + f, r[8] = c * _ + h * l + d, r;
}
function V(r, e, t) {
  var i = e[0], a = e[1], _ = e[2], o = e[3], n = e[4], l = e[5], g = e[6], f = e[7], d = e[8], c = Math.sin(t), h = Math.cos(t);
  return r[0] = h * i + c * o, r[1] = h * a + c * n, r[2] = h * _ + c * l, r[3] = h * o - c * i, r[4] = h * n - c * a, r[5] = h * l - c * _, r[6] = g, r[7] = f, r[8] = d, r;
}
function L(r, e, t) {
  var i = t[0], a = t[1];
  return r[0] = i * e[0], r[1] = i * e[1], r[2] = i * e[2], r[3] = a * e[3], r[4] = a * e[4], r[5] = a * e[5], r[6] = e[6], r[7] = e[7], r[8] = e[8], r;
}
function K(r, e) {
  return r[0] = 1, r[1] = 0, r[2] = 0, r[3] = 0, r[4] = 1, r[5] = 0, r[6] = e[0], r[7] = e[1], r[8] = 1, r;
}
function z(r, e, t) {
  return r[0] = 2 / e, r[1] = 0, r[2] = 0, r[3] = 0, r[4] = -2 / t, r[5] = 0, r[6] = -1, r[7] = 1, r[8] = 1, r;
}
function U() {
  var r = new E(2);
  return E != Float32Array && (r[0] = 0, r[1] = 0), r;
}
function D(r, e) {
  var t = new E(2);
  return t[0] = r, t[1] = e, t;
}
function $(r, e, t) {
  var i = e[0], a = e[1];
  return r[0] = t[0] * i + t[3] * a + t[6], r[1] = t[1] * i + t[4] * a + t[7], r;
}
(function() {
  var r = U();
  return function(e, t, i, a, _, o) {
    var n, l;
    for (t || (t = 2), i || (i = 0), a ? l = Math.min(a * t + i, e.length) : l = e.length, n = i; n < l; n += t)
      r[0] = e[n], r[1] = e[n + 1], _(r, r, o), e[n] = r[0], e[n + 1] = r[1];
    return e;
  };
})();
class u {
  constructor(e, t) {
    s(this, "_x");
    s(this, "_y");
    this._x = e, this._y = t;
  }
  get x() {
    return this._x;
  }
  get y() {
    return this._y;
  }
  clip_space_to_world_space(e) {
    if (!e.active_camera)
      return new u(0, 0);
    const [t, i] = e.active_camera, a = x();
    P(a, i.matrix);
    const _ = x();
    I(_, t.projection_matrix, a);
    const o = x();
    P(o, _);
    const n = D(this._x, this._y), l = U();
    return $(l, n, o), new u(l[0], -l[1]);
  }
  is_within(e, t) {
    return e.x <= this._x && t.x >= this._x && e.y <= this._y && t.y >= this._y;
  }
  static sub(e, t) {
    return new u(e.x - t.x, e.y - t.y);
  }
  static add(e, t) {
    return new u(e.x + t.x, e.y + t.y);
  }
}
class q extends k {
  constructor() {
    super();
    s(this, "_matrix", x());
    s(this, "_position", new u(0, 0));
    s(this, "_scale", new u(1, 1));
    s(this, "_rotation", 0);
    s(this, "_depth", 0);
  }
  calculate_matrix() {
    K(this._matrix, [this._position.x, this._position.y]), V(this._matrix, this._matrix, this._rotation * Math.PI / 180), L(this._matrix, this._matrix, [this._scale.x, this._scale.y]);
  }
  set position(t) {
    this._position = t, this.calculate_matrix();
  }
  set scale(t) {
    this._scale = t, this.calculate_matrix();
  }
  set rotation(t) {
    this._rotation = t, this.calculate_matrix();
  }
  set depth(t) {
    this._depth = t;
  }
  get position() {
    return this._position;
  }
  get scale() {
    return this._scale;
  }
  get rotation() {
    return this._rotation;
  }
  get depth() {
    return this._depth;
  }
  get matrix() {
    return this._matrix;
  }
}
class J {
  constructor() {
    s(this, "_position", new u(0, 0));
    s(this, "_last_position", null);
    s(this, "_callbacks", {
      left_click: [],
      right_click: [],
      middle_click: []
    });
    window.addEventListener("mousemove", (e) => {
      this._position = new u(
        e.offsetX / gl.canvas.width * 2 - 1,
        e.offsetY / gl.canvas.height * 2 - 1
      );
    }), window.addEventListener("click", (e) => {
      switch (e.button) {
        case 0:
          this._callbacks.left_click.forEach((t) => t());
          break;
        case 1:
          this._callbacks.right_click.forEach((t) => t());
          break;
        case 2:
          this._callbacks.middle_click.forEach((t) => t());
          break;
      }
    });
  }
  clear_delta() {
    this._last_position = new u(this._position.x, this._position.y);
  }
  get delta() {
    return u.sub(this._position, this._last_position || this._position);
  }
  get position() {
    return this._position;
  }
  register_callback(e, t) {
    return this._callbacks[e].push(t), t;
  }
  unregister_callback(e) {
    for (let t in this._callbacks)
      this._callbacks[t] = this._callbacks[t].filter((i) => i != e);
  }
}
class Q {
  constructor() {
    s(this, "_mouse", new J());
  }
  get mouse() {
    return this._mouse;
  }
}
class ee {
  constructor(e) {
    s(this, "_active_camera", null);
    s(this, "input", new Q());
    s(this, "ecs", new B());
    N(e);
  }
  set active_camera(e) {
    this._active_camera = e;
  }
  get active_camera() {
    return this._active_camera;
  }
  draw() {
    if (G(), this.input.mouse.clear_delta(), !this._active_camera || !p.shader)
      return;
    p.shader.use();
    const e = x();
    P(e, this._active_camera[1].matrix);
    const t = x();
    I(t, this._active_camera[0].projection_matrix, e), p.shader.set_uniform_matrix("vp_matrix", t, 3), this.ecs.query([p, q]).forEach(([i, a]) => {
      i.hidden || (p.shader.set_uniform_matrix("model_matrix", a.matrix, 3), p.shader.set_uniform_float("depth", [a.depth], 1), i.draw());
    });
  }
}
class te {
  constructor(e = {
    target: gl.ARRAY_BUFFER,
    usage: gl.STATIC_DRAW,
    components: 2
  }) {
    s(this, "_buffer");
    s(this, "_target");
    s(this, "_usage");
    s(this, "components");
    this._target = e.target, this._usage = e.usage, this.components = e.components, this._buffer = gl.createBuffer();
  }
  set(e) {
    gl.bindBuffer(this._target, this._buffer), gl.bufferData(this._target, new Float32Array(e), this._usage, 0);
  }
  get() {
    return this._buffer;
  }
  bind() {
    gl.bindBuffer(this._target, this._buffer);
  }
}
class re extends k {
  constructor(t, i) {
    super();
    s(this, "_projection_matrix", x());
    this.calculate_projection_matrix(t, i);
  }
  calculate_projection_matrix(t, i) {
    z(this._projection_matrix, t, i), W(this._projection_matrix, this._projection_matrix, [t / 2, i / 2]), L(
      this._projection_matrix,
      this._projection_matrix,
      D(t / 25, -t / 25)
    );
  }
  get projection_matrix() {
    return this._projection_matrix;
  }
}
export {
  te as Buffer,
  re as Camera,
  k as Component,
  B as ECS,
  j as Entity,
  Q as InputManager,
  ee as Scene,
  X as Shader,
  p as Sprite,
  C as Texture,
  q as Transform,
  u as Vector2
};
