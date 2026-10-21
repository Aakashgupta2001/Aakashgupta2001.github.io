// Quiet, always-moving background behind the whole page: dark marbled smoke on one fixed WebGL canvas.
// The blue in it grows as the reader gets further down the page, and the cursor parts it like a hand
// through smoke. It pauses when the tab is hidden and draws a single still frame for reduced motion.

type Mouse = { x: number; y: number; on: number; rx: number; ry: number }; // rx/ry: the raw, unsmoothed position
type Painter = { resize(w: number, h: number, dpr: number): void; draw(t: number, m: Mouse): void };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// --- liquid: domain-warped noise in a fragment shader ------------------------
const NOISE = `
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
  return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y); }
float fbm(vec2 p){ float v = 0., a = .5; for (int i = 0; i < 5; i++){ v += a*noise(p); p = p*2.03 + vec2(1.7, 9.2); a *= .5; } return v; }`;

const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float; // phones default lower, which breaks the noise
#else
precision mediump float;
#endif
uniform vec2 res; uniform float t; uniform float sc;
uniform float pr; // how far the reader has got, 0..1: the blue in the smoke grows as they read
uniform sampler2D air; // how far the cursor has pushed the smoke, per point (see AIR)
${NOISE}
void main(){
  vec2 uv = gl_FragCoord.xy / (sqrt(res.x * res.y) * .79); // swirl size follows screen area, so tall phones aren't zoomed in
  vec2 push = texture2D(air, gl_FragCoord.xy / res).xy * 2. - 1.;
  vec2 p = uv * 1.3 + vec2(0., sc) - push * .3;
  vec2 q = vec2(fbm(p + t*.035), fbm(p + vec2(5.2, 1.3) - t*.03));
  vec2 r = vec2(fbm(p + 2.6*q + vec2(1.7, 9.2) + t*.045), fbm(p + 2.6*q + vec2(8.3, 2.8) - t*.035));
  float f = fbm(p + 2.6*r);
  vec3 col = vec3(.043, .043, .047);
  col = mix(col, vec3(.1, .1, .105), smoothstep(.3, 1., f*f*1.9) * .75);
  // blue lives in its own patches of the smoke; reading lets them spread a little and deepen
  float blue = smoothstep(mix(.4, .3, pr), .9, r.y) * smoothstep(mix(.25, .15, pr), .8, q.x);
  col = mix(col, mix(vec3(.12, .18, .3), vec3(.13, .22, .42), pr), blue * mix(.5, .85, pr));
  col += (hash(gl_FragCoord.xy + fract(t)) - .5) / 255. * 2.;
  gl_FragColor = vec4(col, 1.);
}`;

// The "air": a small offscreen texture holding, per point, how far the smoke is pushed (rg) and how
// fast it's still moving (ba). A passing cursor parts the smoke to either side and gives it momentum;
// the air carries itself along (so it rolls and curls) and slowly settles back, like smoke after a hand.
const AIR = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float; // phones default lower, which breaks the noise
#else
precision mediump float;
#endif
uniform sampler2D prev; uniform vec2 res; uniform vec2 m; uniform vec2 vel; uniform float aspect;
void main(){
  vec2 uv = gl_FragCoord.xy / res;
  vec4 s = texture2D(prev, uv) * 2. - 1.;
  s = texture2D(prev, uv - s.zw * vec2(.015 / aspect, .015)) * 2. - 1.; // carried along by its own motion
  vec2 d = s.xy, v = s.zw;
  vec2 dm = (uv - m) * vec2(aspect, 1.);
  float speed = length(vel);
  if (speed > 0.) {
    vec2 dir = vel / speed;
    vec2 side = dm - dir * dot(dm, dir); // which side of the cursor's path this point is on
    float g = exp(-dot(dm, dm) / .007); // about a hand-width around the cursor
    v += g * (dir * speed * 1.2 + side * (speed * 60.)); // grows smoothly from the path outwards: no seam
  }
  d += v * .4;
  v = sign(v) * max(abs(v) * .9 - .001, 0.);  // momentum fades
  d = sign(d) * max(abs(d) * .985 - .002, 0.); // and the smoke drifts home (the constants stop low-precision values sticking)
  gl_FragColor = clamp(vec4(d, v), -1., 1.) * .5 + .5;
}`;

function liquid(canvas: HTMLCanvasElement): Painter | null {
  const ctx = canvas.getContext('webgl', { antialias: false, alpha: false });
  if (!ctx) return null;
  const gl: WebGLRenderingContext = ctx;
  const sh = (type: number, src: string) => { const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); return s; };
  const program = (frag: string) => {
    const p = gl.createProgram()!;
    gl.attachShader(p, sh(gl.VERTEX_SHADER, 'attribute vec2 p; void main(){ gl_Position = vec4(p, 0., 1.); }'));
    gl.attachShader(p, sh(gl.FRAGMENT_SHADER, frag));
    gl.bindAttribLocation(p, 0, 'p');
    gl.linkProgram(p);
    return gl.getProgramParameter(p, gl.LINK_STATUS) ? p : null;
  };
  const smoke = program(FRAG), air = program(AIR);
  if (!smoke || !air) return null;
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  const su = (n: string) => gl.getUniformLocation(smoke, n);
  const au = (n: string) => gl.getUniformLocation(air, n);
  const S = { res: su('res'), t: su('t'), sc: su('sc'), pr: su('pr'), air: su('air') };
  const A = { prev: au('prev'), res: au('res'), m: au('m'), vel: au('vel'), aspect: au('aspect') };

  // two air textures we read from and write to in turn
  let targets: { tex: WebGLTexture; fb: WebGLFramebuffer }[] = [];
  let aw = 0, ah = 0, read = 0;
  // half-float air keeps the small per-frame pushes from being rounded away; 8-bit is the fallback
  const half = gl.getExtension('OES_texture_half_float');
  const halfLinear = gl.getExtension('OES_texture_half_float_linear');
  gl.getExtension('EXT_color_buffer_half_float');
  function build(type: number) {
    return [0, 1].map(() => {
      const tex = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, aw, ah, 0, gl.RGBA, type, null);
      const filter = type === gl.UNSIGNED_BYTE || halfLinear ? gl.LINEAR : gl.NEAREST;
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      const fb = gl.createFramebuffer()!;
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
      gl.clearColor(0.5, 0.5, 0.5, 0.5); // 0.5 = no push, no motion
      gl.clear(gl.COLOR_BUFFER_BIT);
      return { tex, fb, ok };
    });
  }
  function makeAir(w: number, h: number) {
    targets.forEach((x) => { gl.deleteTexture(x.tex); gl.deleteFramebuffer(x.fb); });
    aw = Math.max(16, Math.round(w / 10)); ah = Math.max(16, Math.round(h / 10));
    let made = half ? build(half.HALF_FLOAT_OES) : [];
    if (!made.length || made.some((x) => !x.ok)) {
      made.forEach((x) => { gl.deleteTexture(x.tex); gl.deleteFramebuffer(x.fb); });
      made = build(gl.UNSIGNED_BYTE);
    }
    targets = made;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  let vw = 0, vh = 0, cw = 0, ch = 0;
  // reading progress only ever goes up, so scrolling back doesn't undo the reward
  let best = 0, pr = 0, clock = 0, lastT = 0, lx = -9999, ly = -9999;
  return {
    resize(w, h) {
      vw = w; vh = h;
      canvas.width = cw = Math.round(w * 0.5); canvas.height = ch = Math.round(h * 0.5); // half resolution: it's soft anyway
      makeAir(w, h);
    },
    draw(t, m) {
      const room = document.documentElement.scrollHeight - innerHeight;
      best = Math.max(best, room > 0 ? Math.min(1, scrollY / (room * 0.7)) : 1); // fully blue by ~70% of the page
      pr = lerp(pr, best, 0.025); // eases in over a second or two
      clock += Math.min(0.1, t - lastT);
      lastT = t;

      // 1. stir the air with the cursor's movement since last frame
      const moved = lx > -999 && m.rx > -999;
      const vx = moved ? (m.rx - lx) / vh : 0, vy = moved ? -(m.ry - ly) / vh : 0;
      lx = m.rx; ly = m.ry;
      const src = targets[read], dst = targets[1 - read];
      gl.useProgram(air);
      gl.bindFramebuffer(gl.FRAMEBUFFER, dst.fb);
      gl.viewport(0, 0, aw, ah);
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, src.tex);
      gl.uniform1i(A.prev, 0);
      gl.uniform2f(A.res, aw, ah);
      gl.uniform2f(A.m, m.rx / vw, 1 - m.ry / vh);
      gl.uniform2f(A.vel, vx * m.on, vy * m.on);
      gl.uniform1f(A.aspect, vw / vh);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      read = 1 - read;

      // 2. draw the smoke, displaced by the air
      gl.useProgram(smoke);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, cw, ch);
      gl.bindTexture(gl.TEXTURE_2D, dst.tex);
      gl.uniform1i(S.air, 0);
      gl.uniform2f(S.res, cw, ch);
      gl.uniform1f(S.t, clock);
      gl.uniform1f(S.pr, pr);
      gl.uniform1f(S.sc, scrollY / innerHeight * 0.35);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
  };
}
export function initBackdrop() {

  const canvas = document.createElement('canvas');
  canvas.className = 'backdrop';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.prepend(canvas);
  const painter = liquid(canvas);
  if (!painter) { canvas.remove(); return; }

  // phones get the same moving smoke, a little fainter and at a gentler frame rate (no cursor there to stir it)
  const phone = matchMedia('(max-width: 640px)').matches;
  if (phone) canvas.style.opacity = '0.6';
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mouse: Mouse = { x: -9999, y: -9999, on: 0, rx: -9999, ry: -9999 };
  const target = { x: -9999, y: -9999, on: 0 };
  const resize = () => painter.resize(innerWidth, innerHeight, Math.min(devicePixelRatio || 1, 2));
  resize();
  addEventListener('resize', () => { resize(); if (still) painter.draw(0, mouse); });
  addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    if (target.on === 0 && mouse.x < -999) { mouse.x = e.clientX; mouse.y = e.clientY; }
    target.x = e.clientX; target.y = e.clientY; target.on = 1;
  }, { passive: true });
  document.addEventListener('pointerleave', () => { target.on = 0; });

  if (still) { painter.draw(0, mouse); return; }

  let last = 0, raf = 0;
  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    if (now - last < 1000 / (phone ? 30 : 40)) return; // slow motion doesn't need more than this
    last = now;
    mouse.x = lerp(mouse.x, target.x, 0.08);
    mouse.y = lerp(mouse.y, target.y, 0.08);
    mouse.on = lerp(mouse.on, target.on, 0.05);
    mouse.rx = target.x; mouse.ry = target.y;
    painter.draw(now / 1000, mouse);
  };
  raf = requestAnimationFrame(frame);
  document.addEventListener('visibilitychange', () => {
    cancelAnimationFrame(raf);
    if (!document.hidden) raf = requestAnimationFrame(frame);
  });
}
