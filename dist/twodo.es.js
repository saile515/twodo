var U = Object.defineProperty;
var L = (t, e, r) => e in t ? U(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[e] = r;
var a = (t, e, r) => (L(t, typeof e != "symbol" ? e + "" : e, r), r);
class D {
  constructor() {
    a(this, "id", crypto.randomUUID());
  }
}
class M {
  constructor() {
    a(this, "_entities", []);
    a(this, "_components", {});
  }
  add_component(e) {
    const r = e.constructor.name;
    this._components[r] || (this._components[r] = []), this._components[r].push(e);
  }
  create_entity(e) {
    const r = new D();
    return e.forEach((i) => {
      i.set_parent(r), this.add_component(i);
    }), this._entities.push(r), e;
  }
  query(e) {
    const r = {};
    this._components[e[0].name].forEach((i) => {
      r[i.parent.id] = [i];
    });
    for (let i of e) {
      let n = i.name;
      n != e[0].name && this._components[n].forEach((_) => {
        const o = r[_.parent.id];
        o && o.push(_);
      });
    }
    return Object.values(r).filter((i) => i.length == e.length);
  }
}
class P {
  constructor() {
    a(this, "_parent", null);
  }
  // Can only be called once. Should not be called unless component exists outside an ECS.
  set_parent(e) {
    this._parent || (this._parent = e);
  }
  get parent() {
    return this._parent;
  }
}
class F {
  constructor(e) {
    a(this, "_texture");
    a(this, "_image", new Image());
    a(this, "_errored", !1);
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
class j {
  constructor(e, r, i, n) {
    a(this, "_vertex");
    a(this, "_fragment");
    a(this, "_attribute_keys");
    a(this, "_uniform_keys");
    a(this, "_program");
    a(this, "_attributes", {});
    a(this, "_uniforms", {});
    this._vertex = e, this._fragment = r, this._attribute_keys = i, this._uniform_keys = n, this._program = gl.createProgram();
  }
  async compile() {
    const e = gl.createShader(gl.VERTEX_SHADER);
    if (gl.shaderSource(e, this._vertex), gl.compileShader(e), !gl.getShaderParameter(e, gl.COMPILE_STATUS))
      throw console.error(gl.getShaderInfoLog(e)), gl.deleteShader(e), Error("Vertex shader failed to compile.");
    const r = gl.createShader(gl.FRAGMENT_SHADER);
    if (gl.shaderSource(r, this._fragment), gl.compileShader(r), !gl.getShaderParameter(r, gl.COMPILE_STATUS))
      throw console.error(gl.getShaderInfoLog(r)), gl.deleteShader(r), Error("Fragment shader failed to compile.");
    if (gl.attachShader(this._program, e), gl.attachShader(this._program, r), gl.linkProgram(this._program), !gl.getProgramParameter(this._program, gl.LINK_STATUS))
      throw Error("Shader program failed to link.");
    this._attribute_keys.forEach((i) => {
      this._attributes[i] = gl.getAttribLocation(this._program, i);
    }), this._uniform_keys.forEach((i) => {
      let n = gl.getUniformLocation(this._program, i);
      n && (this._uniforms[i] = n);
    });
  }
  use() {
    gl.useProgram(this._program);
  }
  set_attribute(e, r) {
    r.bind(), gl.vertexAttribPointer(this._attributes[e], r.components, gl.FLOAT, !1, 0, 0), gl.enableVertexAttribArray(this._attributes[e]);
  }
  // Components should be integer betweeen 1 and 4
  set_uniform_float(e, r, i) {
    gl["uniform" + i + "f"](this._uniforms[e], ...r);
  }
  // Components should be integer betweeen 1 and 4
  set_uniform_int(e, r, i) {
    gl["uniform" + i + "i"](this._uniforms[e], ...r);
  }
  // Components should be integer betweeen 1 and 4
  set_uniform_vector(e, r, i) {
    gl["uniform" + i + "fv"](this._uniforms[e], r);
  }
  // Components should be integer between 2 and 4, matrix of n*n size
  set_uniform_matrix(e, r, i) {
    gl["uniformMatrix" + i + "fv"](
      this._uniforms[e],
      !1,
      r
    );
  }
}
function B(t) {
  const e = t.getBoundingClientRect();
  t.width = e.width, t.height = e.height;
  const r = t.getContext("webgl2");
  if (!r)
    return alert("This browser does not support WebGL2."), 1;
  r.enable(r.BLEND), r.blendFunc(r.SRC_ALPHA, r.ONE_MINUS_SRC_ALPHA), r.clearColor(0, 0, 0, 1);
  const i = globalThis || window;
  i.gl = r;
}
function C() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}
function X() {
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}
const N = `#version 300 es

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
`, G = `#version 300 es

in highp vec2 texture_position;
uniform sampler2D sampler;

out highp vec4 frag_color;

void main(void) {
    frag_color = texture(sampler, texture_position);
}
`;
let x, w = !1;
class p extends P {
  constructor(r) {
    super();
    a(this, "_texture");
    a(this, "_failed", !1);
    a(this, "_texture_ready", !1);
    this._texture = new F(r), this._texture.init().then(() => {
      this._texture_ready = !0;
    }).catch(() => {
      this._failed = !0;
    });
  }
  draw() {
    !this._texture_ready || !p.shader || (p.shader.set_uniform_int("sampler", [0], 1), X());
  }
  get failed() {
    return this._failed;
  }
  static get shader() {
    if (gl) {
      if (x && w)
        return x;
      x && !w || (x = new j(
        N,
        G,
        [],
        ["sampler", "vp_matrix", "model_matrix"]
      ), x.compile().then(() => {
        w = !0;
      }));
    }
  }
}
class d {
  constructor(e, r) {
    a(this, "_x");
    a(this, "_y");
    this._x = e, this._y = r;
  }
  get x() {
    return this._x;
  }
  get y() {
    return this._y;
  }
  static sub(e, r) {
    return new d(e.x - r.x, e.y - r.y);
  }
  static add(e, r) {
    return new d(e.x + r.x, e.y + r.y);
  }
}
var E = typeof Float32Array < "u" ? Float32Array : Array;
Math.hypot || (Math.hypot = function() {
  for (var t = 0, e = arguments.length; e--; )
    t += arguments[e] * arguments[e];
  return Math.sqrt(t);
});
function v() {
  var t = new E(9);
  return E != Float32Array && (t[1] = 0, t[2] = 0, t[3] = 0, t[5] = 0, t[6] = 0, t[7] = 0), t[0] = 1, t[4] = 1, t[8] = 1, t;
}
function O(t, e) {
  var r = e[0], i = e[1], n = e[2], _ = e[3], o = e[4], s = e[5], l = e[6], g = e[7], f = e[8], u = f * o - s * g, h = -f * _ + s * l, c = g * _ - o * l, m = r * u + i * h + n * c;
  return m ? (m = 1 / m, t[0] = u * m, t[1] = (-f * i + n * g) * m, t[2] = (s * i - n * o) * m, t[3] = h * m, t[4] = (f * r - n * l) * m, t[5] = (-s * r + n * _) * m, t[6] = c * m, t[7] = (-g * r + i * l) * m, t[8] = (o * r - i * _) * m, t) : null;
}
function k(t, e, r) {
  var i = e[0], n = e[1], _ = e[2], o = e[3], s = e[4], l = e[5], g = e[6], f = e[7], u = e[8], h = r[0], c = r[1], m = r[2], T = r[3], y = r[4], A = r[5], R = r[6], b = r[7], S = r[8];
  return t[0] = h * i + c * o + m * g, t[1] = h * n + c * s + m * f, t[2] = h * _ + c * l + m * u, t[3] = T * i + y * o + A * g, t[4] = T * n + y * s + A * f, t[5] = T * _ + y * l + A * u, t[6] = R * i + b * o + S * g, t[7] = R * n + b * s + S * f, t[8] = R * _ + b * l + S * u, t;
}
function H(t, e, r) {
  var i = e[0], n = e[1], _ = e[2], o = e[3], s = e[4], l = e[5], g = e[6], f = e[7], u = e[8], h = r[0], c = r[1];
  return t[0] = i, t[1] = n, t[2] = _, t[3] = o, t[4] = s, t[5] = l, t[6] = h * i + c * o + g, t[7] = h * n + c * s + f, t[8] = h * _ + c * l + u, t;
}
function V(t, e, r) {
  var i = e[0], n = e[1], _ = e[2], o = e[3], s = e[4], l = e[5], g = e[6], f = e[7], u = e[8], h = Math.sin(r), c = Math.cos(r);
  return t[0] = c * i + h * o, t[1] = c * n + h * s, t[2] = c * _ + h * l, t[3] = c * o - h * i, t[4] = c * s - h * n, t[5] = c * l - h * _, t[6] = g, t[7] = f, t[8] = u, t;
}
function I(t, e, r) {
  var i = r[0], n = r[1];
  return t[0] = i * e[0], t[1] = i * e[1], t[2] = i * e[2], t[3] = n * e[3], t[4] = n * e[4], t[5] = n * e[5], t[6] = e[6], t[7] = e[7], t[8] = e[8], t;
}
function Y(t, e) {
  return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 1, t[5] = 0, t[6] = e[0], t[7] = e[1], t[8] = 1, t;
}
function W(t, e, r) {
  return t[0] = 2 / e, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = -2 / r, t[5] = 0, t[6] = -1, t[7] = 1, t[8] = 1, t;
}
function z() {
  var t = new E(2);
  return E != Float32Array && (t[0] = 0, t[1] = 0), t;
}
function K(t, e) {
  var r = new E(2);
  return r[0] = t, r[1] = e, r;
}
(function() {
  var t = z();
  return function(e, r, i, n, _, o) {
    var s, l;
    for (r || (r = 2), i || (i = 0), n ? l = Math.min(n * r + i, e.length) : l = e.length, s = i; s < l; s += r)
      t[0] = e[s], t[1] = e[s + 1], _(t, t, o), e[s] = t[0], e[s + 1] = t[1];
    return e;
  };
})();
class $ extends P {
  constructor() {
    super();
    a(this, "_matrix", v());
    a(this, "_position", new d(0, 0));
    a(this, "_scale", new d(1, 1));
    a(this, "_rotation", 0);
  }
  calculate_matrix() {
    Y(this._matrix, [this._position.x, this._position.y]), V(this._matrix, this._matrix, this._rotation * Math.PI / 180), I(this._matrix, this._matrix, [this._scale.x, this._scale.y]);
  }
  set position(r) {
    this._position = r, this.calculate_matrix();
  }
  set scale(r) {
    this._scale = r, this.calculate_matrix();
  }
  set rotation(r) {
    this._rotation = r, this.calculate_matrix();
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
  get matrix() {
    return this._matrix;
  }
}
class q {
  constructor() {
    a(this, "_position", new d(0, 0));
    a(this, "_last_position", null);
    window.addEventListener("mousemove", (e) => {
      this._position = new d(e.offsetX, e.offsetY);
    });
  }
  clear_delta() {
    this._last_position = new d(this._position.x, this._position.y);
  }
  get delta() {
    return d.sub(this._position, this._last_position || this._position);
  }
}
class J {
  constructor() {
    a(this, "_mouse", new q());
  }
  get mouse() {
    return this._mouse;
  }
}
class Z {
  constructor(e) {
    a(this, "_active_camera", null);
    a(this, "input", new J());
    a(this, "ecs", new M());
    B(e);
  }
  set_active_camera(e) {
    this._active_camera = e;
  }
  draw() {
    if (C(), !this._active_camera || !p.shader)
      return;
    p.shader.use();
    const e = v();
    O(e, this._active_camera[1].matrix);
    const r = v();
    k(r, this._active_camera[0].projection_matrix, e), p.shader.set_uniform_matrix("vp_matrix", r, 3), this.ecs.query([p, $]).forEach(([i, n]) => {
      p.shader.set_uniform_matrix("model_matrix", n.matrix, 3), i.draw();
    });
  }
}
class ee {
  constructor(e = {
    target: gl.ARRAY_BUFFER,
    usage: gl.STATIC_DRAW,
    components: 2
  }) {
    a(this, "_buffer");
    a(this, "_target");
    a(this, "_usage");
    a(this, "components");
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
class te extends P {
  constructor(r, i) {
    super();
    a(this, "_projection_matrix", v());
    this.calculate_projection_matrix(r, i);
  }
  calculate_projection_matrix(r, i) {
    W(this._projection_matrix, r, i), H(this._projection_matrix, this._projection_matrix, [r / 2, i / 2]), I(
      this._projection_matrix,
      this._projection_matrix,
      K(r / 25, r / 25)
    );
  }
  get projection_matrix() {
    return this._projection_matrix;
  }
}
export {
  ee as Buffer,
  te as Camera,
  P as Component,
  M as ECS,
  D as Entity,
  J as InputManager,
  Z as Scene,
  j as Shader,
  p as Sprite,
  F as Texture,
  $ as Transform,
  d as Vector2
};
