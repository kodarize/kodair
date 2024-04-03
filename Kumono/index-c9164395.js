(function() {
  const t = document.createElement("link").relList;
  if (t && t.supports && t.supports("modulepreload")) return;
  for (const r of document.querySelectorAll('link[rel="modulepreload"]')) s(r);
  new MutationObserver(r => {
    for (const o of r)
      if (o.type === "childList")
        for (const i of o.addedNodes) i.tagName === "LINK" && i.rel === "modulepreload" && s(i)
  }).observe(document, {
    childList: !0,
    subtree: !0
  });

  function n(r) {
    const o = {};
    return r.integrity && (o.integrity = r.integrity), r.referrerPolicy && (o.referrerPolicy = r.referrerPolicy), r.crossOrigin === "use-credentials" ? o.credentials = "include" : r.crossOrigin === "anonymous" ? o.credentials = "omit" : o.credentials = "same-origin", o
  }

  function s(r) {
    if (r.ep) return;
    r.ep = !0;
    const o = n(r);
    fetch(r.href, o)
  }
})();

function Fn(e, t) {
  const n = Object.create(null),
    s = e.split(",");
  for (let r = 0; r < s.length; r++) n[s[r]] = !0;
  return t ? r => !!n[r.toLowerCase()] : r => !!n[r]
}
const H = {},
  Ve = [],
  he = () => { },
  Nr = () => !1,
  Ur = /^on[^a-z]/,
  Jt = e => Ur.test(e),
  Sn = e => e.startsWith("onUpdate:"),
  V = Object.assign,
  Rn = (e, t) => {
    const n = e.indexOf(t);
    n > -1 && e.splice(n, 1)
  },
  Lr = Object.prototype.hasOwnProperty,
  R = (e, t) => Lr.call(e, t),
  I = Array.isArray,
  ke = e => yt(e) === "[object Map]",
  Vt = e => yt(e) === "[object Set]",
  rs = e => yt(e) === "[object Date]",
  M = e => typeof e == "function",
  q = e => typeof e == "string",
  at = e => typeof e == "symbol",
  K = e => e !== null && typeof e == "object",
  Us = e => K(e) && M(e.then) && M(e.catch),
  Ls = Object.prototype.toString,
  yt = e => Ls.call(e),
  $r = e => yt(e).slice(8, -1),
  $s = e => yt(e) === "[object Object]",
  jn = e => q(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e,
  St = Fn(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"),
  kt = e => {
    const t = Object.create(null);
    return n => t[n] || (t[n] = e(n))
  },
  Hr = /-(\w)/g,
  Xe = kt(e => e.replace(Hr, (t, n) => n ? n.toUpperCase() : "")),
  Kr = /\B([A-Z])/g,
  We = kt(e => e.replace(Kr, "-$1").toLowerCase()),
  Hs = kt(e => e.charAt(0).toUpperCase() + e.slice(1)),
  an = kt(e => e ? `on${Hs(e)}` : ""),
  dt = (e, t) => !Object.is(e, t),
  Rt = (e, t) => {
    for (let n = 0; n < e.length; n++) e[n](t)
  },
  $t = (e, t, n) => {
    Object.defineProperty(e, t, {
      configurable: !0,
      enumerable: !1,
      value: n
    })
  },
  Ht = e => {
    const t = parseFloat(e);
    return isNaN(t) ? e : t
  };
let os;
const mn = () => os || (os = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});

function Nn(e) {
  if (I(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++) {
      const s = e[n],
        r = q(s) ? qr(s) : Nn(s);
      if (r)
        for (const o in r) t[o] = r[o]
    }
    return t
  } else {
    if (q(e)) return e;
    if (K(e)) return e
  }
}
const Dr = /;(?![^(]*\))/g,
  Br = /:([^]+)/,
  Wr = /\/\*[^]*?\*\//g;

function qr(e) {
  const t = {};
  return e.replace(Wr, "").split(Dr).forEach(n => {
    if (n) {
      const s = n.split(Br);
      s.length > 1 && (t[s[0].trim()] = s[1].trim())
    }
  }), t
}

function Yt(e) {
  let t = "";
  if (q(e)) t = e;
  else if (I(e))
    for (let n = 0; n < e.length; n++) {
      const s = Yt(e[n]);
      s && (t += s + " ")
    } else if (K(e))
    for (const n in e) e[n] && (t += n + " ");
  return t.trim()
}
const zr = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly",
  Jr = Fn(zr);

function Ks(e) {
  return !!e || e === ""
}

function Vr(e, t) {
  if (e.length !== t.length) return !1;
  let n = !0;
  for (let s = 0; n && s < e.length; s++) n = Qt(e[s], t[s]);
  return n
}

function Qt(e, t) {
  if (e === t) return !0;
  let n = rs(e),
    s = rs(t);
  if (n || s) return n && s ? e.getTime() === t.getTime() : !1;
  if (n = at(e), s = at(t), n || s) return e === t;
  if (n = I(e), s = I(t), n || s) return n && s ? Vr(e, t) : !1;
  if (n = K(e), s = K(t), n || s) {
    if (!n || !s) return !1;
    const r = Object.keys(e).length,
      o = Object.keys(t).length;
    if (r !== o) return !1;
    for (const i in e) {
      const c = e.hasOwnProperty(i),
        f = t.hasOwnProperty(i);
      if (c && !f || !c && f || !Qt(e[i], t[i])) return !1
    }
  }
  return String(e) === String(t)
}

function kr(e, t) {
  return e.findIndex(n => Qt(n, t))
}
const Un = e => q(e) ? e : e == null ? "" : I(e) || K(e) && (e.toString === Ls || !M(e.toString)) ? JSON.stringify(e, Ds, 2) : String(e),
  Ds = (e, t) => t && t.__v_isRef ? Ds(e, t.value) : ke(t) ? {
    [`Map(${t.size})`]: [...t.entries()].reduce((n, [s, r]) => (n[`${s} =>`] = r, n), {})
  } : Vt(t) ? {
    [`Set(${t.size})`]: [...t.values()]
  } : K(t) && !I(t) && !$s(t) ? String(t) : t;
let ce;
class Yr {
  constructor(t = !1) {
    this.detached = t, this._active = !0, this.effects = [], this.cleanups = [], this.parent = ce, !t && ce && (this.index = (ce.scopes || (ce.scopes = [])).push(this) - 1)
  }
  get active() {
    return this._active
  }
  run(t) {
    if (this._active) {
      const n = ce;
      try {
        return ce = this, t()
      } finally {
        ce = n
      }
    }
  }
  on() {
    ce = this
  }
  off() {
    ce = this.parent
  }
  stop(t) {
    if (this._active) {
      let n, s;
      for (n = 0, s = this.effects.length; n < s; n++) this.effects[n].stop();
      for (n = 0, s = this.cleanups.length; n < s; n++) this.cleanups[n]();
      if (this.scopes)
        for (n = 0, s = this.scopes.length; n < s; n++) this.scopes[n].stop(!0);
      if (!this.detached && this.parent && !t) {
        const r = this.parent.scopes.pop();
        r && r !== this && (this.parent.scopes[this.index] = r, r.index = this.index)
      }
      this.parent = void 0, this._active = !1
    }
  }
}

function Qr(e, t = ce) {
  t && t.active && t.effects.push(e)
}

function Xr() {
  return ce
}
const Ln = e => {
  const t = new Set(e);
  return t.w = 0, t.n = 0, t
},
  Bs = e => (e.w & Me) > 0,
  Ws = e => (e.n & Me) > 0,
  Zr = ({
    deps: e
  }) => {
    if (e.length)
      for (let t = 0; t < e.length; t++) e[t].w |= Me
  },
  Gr = e => {
    const {
      deps: t
    } = e;
    if (t.length) {
      let n = 0;
      for (let s = 0; s < t.length; s++) {
        const r = t[s];
        Bs(r) && !Ws(r) ? r.delete(e) : t[n++] = r, r.w &= ~Me, r.n &= ~Me
      }
      t.length = n
    }
  },
  bn = new WeakMap;
let lt = 0,
  Me = 1;
const xn = 30;
let ue;
const Ke = Symbol(""),
  yn = Symbol("");
class $n {
  constructor(t, n = null, s) {
    this.fn = t, this.scheduler = n, this.active = !0, this.deps = [], this.parent = void 0, Qr(this, s)
  }
  run() {
    if (!this.active) return this.fn();
    let t = ue,
      n = Oe;
    for (; t;) {
      if (t === this) return;
      t = t.parent
    }
    try {
      return this.parent = ue, ue = this, Oe = !0, Me = 1 << ++lt, lt <= xn ? Zr(this) : is(this), this.fn()
    } finally {
      lt <= xn && Gr(this), Me = 1 << --lt, ue = this.parent, Oe = n, this.parent = void 0, this.deferStop && this.stop()
    }
  }
  stop() {
    ue === this ? this.deferStop = !0 : this.active && (is(this), this.onStop && this.onStop(), this.active = !1)
  }
}

function is(e) {
  const {
    deps: t
  } = e;
  if (t.length) {
    for (let n = 0; n < t.length; n++) t[n].delete(e);
    t.length = 0
  }
}
let Oe = !0;
const qs = [];

function tt() {
  qs.push(Oe), Oe = !1
}

function nt() {
  const e = qs.pop();
  Oe = e === void 0 ? !0 : e
}

function re(e, t, n) {
  if (Oe && ue) {
    let s = bn.get(e);
    s || bn.set(e, s = new Map);
    let r = s.get(n);
    r || s.set(n, r = Ln()), zs(r)
  }
}

function zs(e, t) {
  let n = !1;
  lt <= xn ? Ws(e) || (e.n |= Me, n = !Bs(e)) : n = !e.has(ue), n && (e.add(ue), ue.deps.push(e))
}

function we(e, t, n, s, r, o) {
  const i = bn.get(e);
  if (!i) return;
  let c = [];
  if (t === "clear") c = [...i.values()];
  else if (n === "length" && I(e)) {
    const f = Number(s);
    i.forEach((a, _) => {
      (_ === "length" || _ >= f) && c.push(a)
    })
  } else switch (n !== void 0 && c.push(i.get(n)), t) {
    case "add":
      I(e) ? jn(n) && c.push(i.get("length")) : (c.push(i.get(Ke)), ke(e) && c.push(i.get(yn)));
      break;
    case "delete":
      I(e) || (c.push(i.get(Ke)), ke(e) && c.push(i.get(yn)));
      break;
    case "set":
      ke(e) && c.push(i.get(Ke));
      break
  }
  if (c.length === 1) c[0] && vn(c[0]);
  else {
    const f = [];
    for (const a of c) a && f.push(...a);
    vn(Ln(f))
  }
}

function vn(e, t) {
  const n = I(e) ? e : [...e];
  for (const s of n) s.computed && ls(s);
  for (const s of n) s.computed || ls(s)
}

function ls(e, t) {
  (e !== ue || e.allowRecurse) && (e.scheduler ? e.scheduler() : e.run())
}
const eo = Fn("__proto__,__v_isRef,__isVue"),
  Js = new Set(Object.getOwnPropertyNames(Symbol).filter(e => e !== "arguments" && e !== "caller").map(e => Symbol[e]).filter(at)),
  to = Hn(),
  no = Hn(!1, !0),
  so = Hn(!0),
  cs = ro();

function ro() {
  const e = {};
  return ["includes", "indexOf", "lastIndexOf"].forEach(t => {
    e[t] = function(...n) {
      const s = j(this);
      for (let o = 0, i = this.length; o < i; o++) re(s, "get", o + "");
      const r = s[t](...n);
      return r === -1 || r === !1 ? s[t](...n.map(j)) : r
    }
  }), ["push", "pop", "shift", "unshift", "splice"].forEach(t => {
    e[t] = function(...n) {
      tt();
      const s = j(this)[t].apply(this, n);
      return nt(), s
    }
  }), e
}

function oo(e) {
  const t = j(this);
  return re(t, "has", e), t.hasOwnProperty(e)
}

function Hn(e = !1, t = !1) {
  return function(s, r, o) {
    if (r === "__v_isReactive") return !e;
    if (r === "__v_isReadonly") return e;
    if (r === "__v_isShallow") return t;
    if (r === "__v_raw" && o === (e ? t ? wo : Xs : t ? Qs : Ys).get(s)) return s;
    const i = I(s);
    if (!e) {
      if (i && R(cs, r)) return Reflect.get(cs, r, o);
      if (r === "hasOwnProperty") return oo
    }
    const c = Reflect.get(s, r, o);
    return (at(r) ? Js.has(r) : eo(r)) || (e || re(s, "get", r), t) ? c : G(c) ? i && jn(r) ? c : c.value : K(c) ? e ? Zs(c) : Zt(c) : c
  }
}
const io = Vs(),
  lo = Vs(!0);

function Vs(e = !1) {
  return function(n, s, r, o) {
    let i = n[s];
    if (Ze(i) && G(i) && !G(r)) return !1;
    if (!e && (!Kt(r) && !Ze(r) && (i = j(i), r = j(r)), !I(n) && G(i) && !G(r))) return i.value = r, !0;
    const c = I(n) && jn(s) ? Number(s) < n.length : R(n, s),
      f = Reflect.set(n, s, r, o);
    return n === j(o) && (c ? dt(r, i) && we(n, "set", s, r) : we(n, "add", s, r)), f
  }
}

function co(e, t) {
  const n = R(e, t);
  e[t];
  const s = Reflect.deleteProperty(e, t);
  return s && n && we(e, "delete", t, void 0), s
}

function fo(e, t) {
  const n = Reflect.has(e, t);
  return (!at(t) || !Js.has(t)) && re(e, "has", t), n
}

function uo(e) {
  return re(e, "iterate", I(e) ? "length" : Ke), Reflect.ownKeys(e)
}
const ks = {
  get: to,
  set: io,
  deleteProperty: co,
  has: fo,
  ownKeys: uo
},
  ao = {
    get: so,
    set(e, t) {
      return !0
    },
    deleteProperty(e, t) {
      return !0
    }
  },
  ho = V({}, ks, {
    get: no,
    set: lo
  }),
  Kn = e => e,
  Xt = e => Reflect.getPrototypeOf(e);

function It(e, t, n = !1, s = !1) {
  e = e.__v_raw;
  const r = j(e),
    o = j(t);
  n || (t !== o && re(r, "get", t), re(r, "get", o));
  const {
    has: i
  } = Xt(r), c = s ? Kn : n ? Wn : ht;
  if (i.call(r, t)) return c(e.get(t));
  if (i.call(r, o)) return c(e.get(o));
  e !== r && e.get(t)
}

function Ot(e, t = !1) {
  const n = this.__v_raw,
    s = j(n),
    r = j(e);
  return t || (e !== r && re(s, "has", e), re(s, "has", r)), e === r ? n.has(e) : n.has(e) || n.has(r)
}

function Pt(e, t = !1) {
  return e = e.__v_raw, !t && re(j(e), "iterate", Ke), Reflect.get(e, "size", e)
}

function fs(e) {
  e = j(e);
  const t = j(this);
  return Xt(t).has.call(t, e) || (t.add(e), we(t, "add", e, e)), this
}

function us(e, t) {
  t = j(t);
  const n = j(this),
    {
      has: s,
      get: r
    } = Xt(n);
  let o = s.call(n, e);
  o || (e = j(e), o = s.call(n, e));
  const i = r.call(n, e);
  return n.set(e, t), o ? dt(t, i) && we(n, "set", e, t) : we(n, "add", e, t), this
}

function as(e) {
  const t = j(this),
    {
      has: n,
      get: s
    } = Xt(t);
  let r = n.call(t, e);
  r || (e = j(e), r = n.call(t, e)), s && s.call(t, e);
  const o = t.delete(e);
  return r && we(t, "delete", e, void 0), o
}

function ds() {
  const e = j(this),
    t = e.size !== 0,
    n = e.clear();
  return t && we(e, "clear", void 0, void 0), n
}

function Mt(e, t) {
  return function(s, r) {
    const o = this,
      i = o.__v_raw,
      c = j(i),
      f = t ? Kn : e ? Wn : ht;
    return !e && re(c, "iterate", Ke), i.forEach((a, _) => s.call(r, f(a), f(_), o))
  }
}

function At(e, t, n) {
  return function(...s) {
    const r = this.__v_raw,
      o = j(r),
      i = ke(o),
      c = e === "entries" || e === Symbol.iterator && i,
      f = e === "keys" && i,
      a = r[e](...s),
      _ = n ? Kn : t ? Wn : ht;
    return !t && re(o, "iterate", f ? yn : Ke), {
      next() {
        const {
          value: y,
          done: E
        } = a.next();
        return E ? {
          value: y,
          done: E
        } : {
          value: c ? [_(y[0]), _(y[1])] : _(y),
          done: E
        }
      },
      [Symbol.iterator]() {
        return this
      }
    }
  }
}

function Te(e) {
  return function(...t) {
    return e === "delete" ? !1 : this
  }
}

function po() {
  const e = {
    get(o) {
      return It(this, o)
    },
    get size() {
      return Pt(this)
    },
    has: Ot,
    add: fs,
    set: us,
    delete: as,
    clear: ds,
    forEach: Mt(!1, !1)
  },
    t = {
      get(o) {
        return It(this, o, !1, !0)
      },
      get size() {
        return Pt(this)
      },
      has: Ot,
      add: fs,
      set: us,
      delete: as,
      clear: ds,
      forEach: Mt(!1, !0)
    },
    n = {
      get(o) {
        return It(this, o, !0)
      },
      get size() {
        return Pt(this, !0)
      },
      has(o) {
        return Ot.call(this, o, !0)
      },
      add: Te("add"),
      set: Te("set"),
      delete: Te("delete"),
      clear: Te("clear"),
      forEach: Mt(!0, !1)
    },
    s = {
      get(o) {
        return It(this, o, !0, !0)
      },
      get size() {
        return Pt(this, !0)
      },
      has(o) {
        return Ot.call(this, o, !0)
      },
      add: Te("add"),
      set: Te("set"),
      delete: Te("delete"),
      clear: Te("clear"),
      forEach: Mt(!0, !0)
    };
  return ["keys", "values", "entries", Symbol.iterator].forEach(o => {
    e[o] = At(o, !1, !1), n[o] = At(o, !0, !1), t[o] = At(o, !1, !0), s[o] = At(o, !0, !0)
  }), [e, n, t, s]
}
const [go, _o, mo, bo] = po();

function Dn(e, t) {
  const n = t ? e ? bo : mo : e ? _o : go;
  return (s, r, o) => r === "__v_isReactive" ? !e : r === "__v_isReadonly" ? e : r === "__v_raw" ? s : Reflect.get(R(n, r) && r in s ? n : s, r, o)
}
const xo = {
  get: Dn(!1, !1)
},
  yo = {
    get: Dn(!1, !0)
  },
  vo = {
    get: Dn(!0, !1)
  },
  Ys = new WeakMap,
  Qs = new WeakMap,
  Xs = new WeakMap,
  wo = new WeakMap;

function Eo(e) {
  switch (e) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0
  }
}

function Co(e) {
  return e.__v_skip || !Object.isExtensible(e) ? 0 : Eo($r(e))
}

function Zt(e) {
  return Ze(e) ? e : Bn(e, !1, ks, xo, Ys)
}

function To(e) {
  return Bn(e, !1, ho, yo, Qs)
}

function Zs(e) {
  return Bn(e, !0, ao, vo, Xs)
}

function Bn(e, t, n, s, r) {
  if (!K(e) || e.__v_raw && !(t && e.__v_isReactive)) return e;
  const o = r.get(e);
  if (o) return o;
  const i = Co(e);
  if (i === 0) return e;
  const c = new Proxy(e, i === 2 ? s : n);
  return r.set(e, c), c
}

function Ye(e) {
  return Ze(e) ? Ye(e.__v_raw) : !!(e && e.__v_isReactive)
}

function Ze(e) {
  return !!(e && e.__v_isReadonly)
}

function Kt(e) {
  return !!(e && e.__v_isShallow)
}

function Gs(e) {
  return Ye(e) || Ze(e)
}

function j(e) {
  const t = e && e.__v_raw;
  return t ? j(t) : e
}

function er(e) {
  return $t(e, "__v_skip", !0), e
}
const ht = e => K(e) ? Zt(e) : e,
  Wn = e => K(e) ? Zs(e) : e;

function tr(e) {
  Oe && ue && (e = j(e), zs(e.dep || (e.dep = Ln())))
}

function nr(e, t) {
  e = j(e);
  const n = e.dep;
  n && vn(n)
}

function G(e) {
  return !!(e && e.__v_isRef === !0)
}

function pt(e) {
  return Io(e, !1)
}

function Io(e, t) {
  return G(e) ? e : new Oo(e, t)
}
class Oo {
  constructor(t, n) {
    this.__v_isShallow = n, this.dep = void 0, this.__v_isRef = !0, this._rawValue = n ? t : j(t), this._value = n ? t : ht(t)
  }
  get value() {
    return tr(this), this._value
  }
  set value(t) {
    const n = this.__v_isShallow || Kt(t) || Ze(t);
    t = n ? t : j(t), dt(t, this._rawValue) && (this._rawValue = t, this._value = n ? t : ht(t), nr(this))
  }
}

function Po(e) {
  return G(e) ? e.value : e
}
const Mo = {
  get: (e, t, n) => Po(Reflect.get(e, t, n)),
  set: (e, t, n, s) => {
    const r = e[t];
    return G(r) && !G(n) ? (r.value = n, !0) : Reflect.set(e, t, n, s)
  }
};

function sr(e) {
  return Ye(e) ? e : new Proxy(e, Mo)
}
class Ao {
  constructor(t, n, s, r) {
    this._setter = n, this.dep = void 0, this.__v_isRef = !0, this.__v_isReadonly = !1, this._dirty = !0, this.effect = new $n(t, () => {
      this._dirty || (this._dirty = !0, nr(this))
    }), this.effect.computed = this, this.effect.active = this._cacheable = !r, this.__v_isReadonly = s
  }
  get value() {
    const t = j(this);
    return tr(t), (t._dirty || !t._cacheable) && (t._dirty = !1, t._value = t.effect.run()), t._value
  }
  set value(t) {
    this._setter(t)
  }
}

function Fo(e, t, n = !1) {
  let s, r;
  const o = M(e);
  return o ? (s = e, r = he) : (s = e.get, r = e.set), new Ao(s, r, o || !r, n)
}

function Pe(e, t, n, s) {
  let r;
  try {
    r = s ? e(...s) : e()
  } catch (o) {
    Gt(o, t, n)
  }
  return r
}

function pe(e, t, n, s) {
  if (M(e)) {
    const o = Pe(e, t, n, s);
    return o && Us(o) && o.catch(i => {
      Gt(i, t, n)
    }), o
  }
  const r = [];
  for (let o = 0; o < e.length; o++) r.push(pe(e[o], t, n, s));
  return r
}

function Gt(e, t, n, s = !0) {
  const r = t ? t.vnode : null;
  if (t) {
    let o = t.parent;
    const i = t.proxy,
      c = n;
    for (; o;) {
      const a = o.ec;
      if (a) {
        for (let _ = 0; _ < a.length; _++)
          if (a[_](e, i, c) === !1) return
      }
      o = o.parent
    }
    const f = t.appContext.config.errorHandler;
    if (f) {
      Pe(f, null, 10, [e, i, c]);
      return
    }
  }
  So(e, n, r, s)
}

function So(e, t, n, s = !0) {
  console.error(e)
}
let gt = !1,
  wn = !1;
const X = [];
let xe = 0;
const Qe = [];
let ve = null,
  Ue = 0;
const rr = Promise.resolve();
let qn = null;

function Ro(e) {
  const t = qn || rr;
  return e ? t.then(this ? e.bind(this) : e) : t
}

function jo(e) {
  let t = xe + 1,
    n = X.length;
  for (; t < n;) {
    const s = t + n >>> 1;
    _t(X[s]) < e ? t = s + 1 : n = s
  }
  return t
}

function zn(e) {
  (!X.length || !X.includes(e, gt && e.allowRecurse ? xe + 1 : xe)) && (e.id == null ? X.push(e) : X.splice(jo(e.id), 0, e), or())
}

function or() {
  !gt && !wn && (wn = !0, qn = rr.then(lr))
}

function No(e) {
  const t = X.indexOf(e);
  t > xe && X.splice(t, 1)
}

function Uo(e) {
  I(e) ? Qe.push(...e) : (!ve || !ve.includes(e, e.allowRecurse ? Ue + 1 : Ue)) && Qe.push(e), or()
}

function hs(e, t = gt ? xe + 1 : 0) {
  for (; t < X.length; t++) {
    const n = X[t];
    n && n.pre && (X.splice(t, 1), t--, n())
  }
}

function ir(e) {
  if (Qe.length) {
    const t = [...new Set(Qe)];
    if (Qe.length = 0, ve) {
      ve.push(...t);
      return
    }
    for (ve = t, ve.sort((n, s) => _t(n) - _t(s)), Ue = 0; Ue < ve.length; Ue++) ve[Ue]();
    ve = null, Ue = 0
  }
}
const _t = e => e.id == null ? 1 / 0 : e.id,
  Lo = (e, t) => {
    const n = _t(e) - _t(t);
    if (n === 0) {
      if (e.pre && !t.pre) return -1;
      if (t.pre && !e.pre) return 1
    }
    return n
  };

function lr(e) {
  wn = !1, gt = !0, X.sort(Lo);
  const t = he;
  try {
    for (xe = 0; xe < X.length; xe++) {
      const n = X[xe];
      n && n.active !== !1 && Pe(n, null, 14)
    }
  } finally {
    xe = 0, X.length = 0, ir(), gt = !1, qn = null, (X.length || Qe.length) && lr()
  }
}

function $o(e, t, ...n) {
  if (e.isUnmounted) return;
  const s = e.vnode.props || H;
  let r = n;
  const o = t.startsWith("update:"),
    i = o && t.slice(7);
  if (i && i in s) {
    const _ = `${i === "modelValue" ? "model" : i}Modifiers`,
      {
        number: y,
        trim: E
      } = s[_] || H;
    E && (r = n.map(P => q(P) ? P.trim() : P)), y && (r = n.map(Ht))
  }
  let c, f = s[c = an(t)] || s[c = an(Xe(t))];
  !f && o && (f = s[c = an(We(t))]), f && pe(f, e, 6, r);
  const a = s[c + "Once"];
  if (a) {
    if (!e.emitted) e.emitted = {};
    else if (e.emitted[c]) return;
    e.emitted[c] = !0, pe(a, e, 6, r)
  }
}

function cr(e, t, n = !1) {
  const s = t.emitsCache,
    r = s.get(e);
  if (r !== void 0) return r;
  const o = e.emits;
  let i = {},
    c = !1;
  if (!M(e)) {
    const f = a => {
      const _ = cr(a, t, !0);
      _ && (c = !0, V(i, _))
    };
    !n && t.mixins.length && t.mixins.forEach(f), e.extends && f(e.extends), e.mixins && e.mixins.forEach(f)
  }
  return !o && !c ? (K(e) && s.set(e, null), null) : (I(o) ? o.forEach(f => i[f] = null) : V(i, o), K(e) && s.set(e, i), i)
}

function en(e, t) {
  return !e || !Jt(t) ? !1 : (t = t.slice(2).replace(/Once$/, ""), R(e, t[0].toLowerCase() + t.slice(1)) || R(e, We(t)) || R(e, t))
}
let ae = null,
  tn = null;

function Dt(e) {
  const t = ae;
  return ae = e, tn = e && e.type.__scopeId || null, t
}

function fr(e) {
  tn = e
}

function ur() {
  tn = null
}

function Ho(e, t = ae, n) {
  if (!t || e._n) return e;
  const s = (...r) => {
    s._d && Es(-1);
    const o = Dt(t);
    let i;
    try {
      i = e(...r)
    } finally {
      Dt(o), s._d && Es(1)
    }
    return i
  };
  return s._n = !0, s._c = !0, s._d = !0, s
}

function dn(e) {
  const {
    type: t,
    vnode: n,
    proxy: s,
    withProxy: r,
    props: o,
    propsOptions: [i],
    slots: c,
    attrs: f,
    emit: a,
    render: _,
    renderCache: y,
    data: E,
    setupState: P,
    ctx: B,
    inheritAttrs: S
  } = e;
  let z, k;
  const Y = Dt(e);
  try {
    if (n.shapeFlag & 4) {
      const A = r || s;
      z = be(_.call(A, A, y, o, P, E, B)), k = f
    } else {
      const A = t;
      z = be(A.length > 1 ? A(o, {
        attrs: f,
        slots: c,
        emit: a
      }) : A(o, null)), k = t.props ? f : Ko(f)
    }
  } catch (A) {
    ut.length = 0, Gt(A, e, 1), z = ie(Be)
  }
  let Q = z;
  if (k && S !== !1) {
    const A = Object.keys(k),
      {
        shapeFlag: Ce
      } = Q;
    A.length && Ce & 7 && (i && A.some(Sn) && (k = Do(k, i)), Q = Ge(Q, k))
  }
  return n.dirs && (Q = Ge(Q), Q.dirs = Q.dirs ? Q.dirs.concat(n.dirs) : n.dirs), n.transition && (Q.transition = n.transition), z = Q, Dt(Y), z
}
const Ko = e => {
  let t;
  for (const n in e) (n === "class" || n === "style" || Jt(n)) && ((t || (t = {}))[n] = e[n]);
  return t
},
  Do = (e, t) => {
    const n = {};
    for (const s in e) (!Sn(s) || !(s.slice(9) in t)) && (n[s] = e[s]);
    return n
  };

function Bo(e, t, n) {
  const {
    props: s,
    children: r,
    component: o
  } = e, {
    props: i,
    children: c,
    patchFlag: f
  } = t, a = o.emitsOptions;
  if (t.dirs || t.transition) return !0;
  if (n && f >= 0) {
    if (f & 1024) return !0;
    if (f & 16) return s ? ps(s, i, a) : !!i;
    if (f & 8) {
      const _ = t.dynamicProps;
      for (let y = 0; y < _.length; y++) {
        const E = _[y];
        if (i[E] !== s[E] && !en(a, E)) return !0
      }
    }
  } else return (r || c) && (!c || !c.$stable) ? !0 : s === i ? !1 : s ? i ? ps(s, i, a) : !0 : !!i;
  return !1
}

function ps(e, t, n) {
  const s = Object.keys(t);
  if (s.length !== Object.keys(e).length) return !0;
  for (let r = 0; r < s.length; r++) {
    const o = s[r];
    if (t[o] !== e[o] && !en(n, o)) return !0
  }
  return !1
}

function Wo({
  vnode: e,
  parent: t
}, n) {
  for (; t && t.subTree === e;)(e = t.vnode).el = n, t = t.parent
}
const qo = e => e.__isSuspense;

function zo(e, t) {
  t && t.pendingBranch ? I(e) ? t.effects.push(...e) : t.effects.push(e) : Uo(e)
}
const Ft = {};

function jt(e, t, n) {
  return ar(e, t, n)
}

function ar(e, t, {
  immediate: n,
  deep: s,
  flush: r,
  onTrack: o,
  onTrigger: i
} = H) {
  var c;
  const f = Xr() === ((c = Z) == null ? void 0 : c.scope) ? Z : null;
  let a, _ = !1,
    y = !1;
  if (G(e) ? (a = () => e.value, _ = Kt(e)) : Ye(e) ? (a = () => e, s = !0) : I(e) ? (y = !0, _ = e.some(A => Ye(A) || Kt(A)), a = () => e.map(A => {
    if (G(A)) return A.value;
    if (Ye(A)) return He(A);
    if (M(A)) return Pe(A, f, 2)
  })) : M(e) ? t ? a = () => Pe(e, f, 2) : a = () => {
    if (!(f && f.isUnmounted)) return E && E(), pe(e, f, 3, [P])
  } : a = he, t && s) {
    const A = a;
    a = () => He(A())
  }
  let E, P = A => {
    E = Y.onStop = () => {
      Pe(A, f, 4)
    }
  },
    B;
  if (xt)
    if (P = he, t ? n && pe(t, f, 3, [a(), y ? [] : void 0, P]) : a(), r === "sync") {
      const A = $i();
      B = A.__watcherHandles || (A.__watcherHandles = [])
    } else return he;
  let S = y ? new Array(e.length).fill(Ft) : Ft;
  const z = () => {
    if (Y.active)
      if (t) {
        const A = Y.run();
        (s || _ || (y ? A.some((Ce, st) => dt(Ce, S[st])) : dt(A, S))) && (E && E(), pe(t, f, 3, [A, S === Ft ? void 0 : y && S[0] === Ft ? [] : S, P]), S = A)
      } else Y.run()
  };
  z.allowRecurse = !!t;
  let k;
  r === "sync" ? k = z : r === "post" ? k = () => se(z, f && f.suspense) : (z.pre = !0, f && (z.id = f.uid), k = () => zn(z));
  const Y = new $n(a, k);
  t ? n ? z() : S = Y.run() : r === "post" ? se(Y.run.bind(Y), f && f.suspense) : Y.run();
  const Q = () => {
    Y.stop(), f && f.scope && Rn(f.scope.effects, Y)
  };
  return B && B.push(Q), Q
}

function Jo(e, t, n) {
  const s = this.proxy,
    r = q(e) ? e.includes(".") ? dr(s, e) : () => s[e] : e.bind(s, s);
  let o;
  M(t) ? o = t : (o = t.handler, n = t);
  const i = Z;
  et(this);
  const c = ar(r, o.bind(s), n);
  return i ? et(i) : De(), c
}

function dr(e, t) {
  const n = t.split(".");
  return () => {
    let s = e;
    for (let r = 0; r < n.length && s; r++) s = s[n[r]];
    return s
  }
}

function He(e, t) {
  if (!K(e) || e.__v_skip || (t = t || new Set, t.has(e))) return e;
  if (t.add(e), G(e)) He(e.value, t);
  else if (I(e))
    for (let n = 0; n < e.length; n++) He(e[n], t);
  else if (Vt(e) || ke(e)) e.forEach(n => {
    He(n, t)
  });
  else if ($s(e))
    for (const n in e) He(e[n], t);
  return e
}

function Jn(e, t) {
  const n = ae;
  if (n === null) return e;
  const s = on(n) || n.proxy,
    r = e.dirs || (e.dirs = []);
  for (let o = 0; o < t.length; o++) {
    let [i, c, f, a = H] = t[o];
    i && (M(i) && (i = {
      mounted: i,
      updated: i
    }), i.deep && He(c), r.push({
      dir: i,
      instance: s,
      value: c,
      oldValue: void 0,
      arg: f,
      modifiers: a
    }))
  }
  return e
}

function je(e, t, n, s) {
  const r = e.dirs,
    o = t && t.dirs;
  for (let i = 0; i < r.length; i++) {
    const c = r[i];
    o && (c.oldValue = o[i].value);
    let f = c.dir[s];
    f && (tt(), pe(f, n, 8, [e.el, c, e, t]), nt())
  }
}
const Nt = e => !!e.type.__asyncLoader,
  hr = e => e.type.__isKeepAlive;

function Vo(e, t) {
  pr(e, "a", t)
}

function ko(e, t) {
  pr(e, "da", t)
}

function pr(e, t, n = Z) {
  const s = e.__wdc || (e.__wdc = () => {
    let r = n;
    for (; r;) {
      if (r.isDeactivated) return;
      r = r.parent
    }
    return e()
  });
  if (nn(t, s, n), n) {
    let r = n.parent;
    for (; r && r.parent;) hr(r.parent.vnode) && Yo(s, t, n, r), r = r.parent
  }
}

function Yo(e, t, n, s) {
  const r = nn(t, e, s, !0);
  _r(() => {
    Rn(s[t], r)
  }, n)
}

function nn(e, t, n = Z, s = !1) {
  if (n) {
    const r = n[e] || (n[e] = []),
      o = t.__weh || (t.__weh = (...i) => {
        if (n.isUnmounted) return;
        tt(), et(n);
        const c = pe(t, n, e, i);
        return De(), nt(), c
      });
    return s ? r.unshift(o) : r.push(o), o
  }
}
const Ee = e => (t, n = Z) => (!xt || e === "sp") && nn(e, (...s) => t(...s), n),
  Qo = Ee("bm"),
  gr = Ee("m"),
  Xo = Ee("bu"),
  Zo = Ee("u"),
  Go = Ee("bum"),
  _r = Ee("um"),
  ei = Ee("sp"),
  ti = Ee("rtg"),
  ni = Ee("rtc");

function si(e, t = Z) {
  nn("ec", e, t)
}
const ri = Symbol.for("v-ndc");

function mr(e, t, n, s) {
  let r;
  const o = n && n[s];
  if (I(e) || q(e)) {
    r = new Array(e.length);
    for (let i = 0, c = e.length; i < c; i++) r[i] = t(e[i], i, void 0, o && o[i])
  } else if (typeof e == "number") {
    r = new Array(e);
    for (let i = 0; i < e; i++) r[i] = t(i + 1, i, void 0, o && o[i])
  } else if (K(e))
    if (e[Symbol.iterator]) r = Array.from(e, (i, c) => t(i, c, void 0, o && o[c]));
    else {
      const i = Object.keys(e);
      r = new Array(i.length);
      for (let c = 0, f = i.length; c < f; c++) {
        const a = i[c];
        r[c] = t(e[a], a, c, o && o[c])
      }
    }
  else r = [];
  return n && (n[s] = r), r
}
const En = e => e ? Pr(e) ? on(e) || e.proxy : En(e.parent) : null,
  ft = V(Object.create(null), {
    $: e => e,
    $el: e => e.vnode.el,
    $data: e => e.data,
    $props: e => e.props,
    $attrs: e => e.attrs,
    $slots: e => e.slots,
    $refs: e => e.refs,
    $parent: e => En(e.parent),
    $root: e => En(e.root),
    $emit: e => e.emit,
    $options: e => Vn(e),
    $forceUpdate: e => e.f || (e.f = () => zn(e.update)),
    $nextTick: e => e.n || (e.n = Ro.bind(e.proxy)),
    $watch: e => Jo.bind(e)
  }),
  hn = (e, t) => e !== H && !e.__isScriptSetup && R(e, t),
  oi = {
    get({
      _: e
    }, t) {
      const {
        ctx: n,
        setupState: s,
        data: r,
        props: o,
        accessCache: i,
        type: c,
        appContext: f
      } = e;
      let a;
      if (t[0] !== "$") {
        const P = i[t];
        if (P !== void 0) switch (P) {
          case 1:
            return s[t];
          case 2:
            return r[t];
          case 4:
            return n[t];
          case 3:
            return o[t]
        } else {
          if (hn(s, t)) return i[t] = 1, s[t];
          if (r !== H && R(r, t)) return i[t] = 2, r[t];
          if ((a = e.propsOptions[0]) && R(a, t)) return i[t] = 3, o[t];
          if (n !== H && R(n, t)) return i[t] = 4, n[t];
          Cn && (i[t] = 0)
        }
      }
      const _ = ft[t];
      let y, E;
      if (_) return t === "$attrs" && re(e, "get", t), _(e);
      if ((y = c.__cssModules) && (y = y[t])) return y;
      if (n !== H && R(n, t)) return i[t] = 4, n[t];
      if (E = f.config.globalProperties, R(E, t)) return E[t]
    },
    set({
      _: e
    }, t, n) {
      const {
        data: s,
        setupState: r,
        ctx: o
      } = e;
      return hn(r, t) ? (r[t] = n, !0) : s !== H && R(s, t) ? (s[t] = n, !0) : R(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (o[t] = n, !0)
    },
    has({
      _: {
        data: e,
        setupState: t,
        accessCache: n,
        ctx: s,
        appContext: r,
        propsOptions: o
      }
    }, i) {
      let c;
      return !!n[i] || e !== H && R(e, i) || hn(t, i) || (c = o[0]) && R(c, i) || R(s, i) || R(ft, i) || R(r.config.globalProperties, i)
    },
    defineProperty(e, t, n) {
      return n.get != null ? e._.accessCache[t] = 0 : R(n, "value") && this.set(e, t, n.value, null), Reflect.defineProperty(e, t, n)
    }
  };

function gs(e) {
  return I(e) ? e.reduce((t, n) => (t[n] = null, t), {}) : e
}
let Cn = !0;

function ii(e) {
  const t = Vn(e),
    n = e.proxy,
    s = e.ctx;
  Cn = !1, t.beforeCreate && _s(t.beforeCreate, e, "bc");
  const {
    data: r,
    computed: o,
    methods: i,
    watch: c,
    provide: f,
    inject: a,
    created: _,
    beforeMount: y,
    mounted: E,
    beforeUpdate: P,
    updated: B,
    activated: S,
    deactivated: z,
    beforeDestroy: k,
    beforeUnmount: Y,
    destroyed: Q,
    unmounted: A,
    render: Ce,
    renderTracked: st,
    renderTriggered: vt,
    errorCaptured: Ae,
    serverPrefetch: ln,
    expose: Fe,
    inheritAttrs: rt,
    components: wt,
    directives: Et,
    filters: cn
  } = t;
  if (a && li(a, s, null), i)
    for (const D in i) {
      const U = i[D];
      M(U) && (s[D] = U.bind(n))
    }
  if (r) {
    const D = r.call(n, n);
    K(D) && (e.data = Zt(D))
  }
  if (Cn = !0, o)
    for (const D in o) {
      const U = o[D],
        Se = M(U) ? U.bind(n, n) : M(U.get) ? U.get.bind(n, n) : he,
        Ct = !M(U) && M(U.set) ? U.set.bind(n) : he,
        Re = Ui({
          get: Se,
          set: Ct
        });
      Object.defineProperty(s, D, {
        enumerable: !0,
        configurable: !0,
        get: () => Re.value,
        set: ge => Re.value = ge
      })
    }
  if (c)
    for (const D in c) br(c[D], s, n, D);
  if (f) {
    const D = M(f) ? f.call(n) : f;
    Reflect.ownKeys(D).forEach(U => {
      hi(U, D[U])
    })
  }
  _ && _s(_, e, "c");

  function ee(D, U) {
    I(U) ? U.forEach(Se => D(Se.bind(n))) : U && D(U.bind(n))
  }
  if (ee(Qo, y), ee(gr, E), ee(Xo, P), ee(Zo, B), ee(Vo, S), ee(ko, z), ee(si, Ae), ee(ni, st), ee(ti, vt), ee(Go, Y), ee(_r, A), ee(ei, ln), I(Fe))
    if (Fe.length) {
      const D = e.exposed || (e.exposed = {});
      Fe.forEach(U => {
        Object.defineProperty(D, U, {
          get: () => n[U],
          set: Se => n[U] = Se
        })
      })
    } else e.exposed || (e.exposed = {});
  Ce && e.render === he && (e.render = Ce), rt != null && (e.inheritAttrs = rt), wt && (e.components = wt), Et && (e.directives = Et)
}

function li(e, t, n = he) {
  I(e) && (e = Tn(e));
  for (const s in e) {
    const r = e[s];
    let o;
    K(r) ? "default" in r ? o = Ut(r.from || s, r.default, !0) : o = Ut(r.from || s) : o = Ut(r), G(o) ? Object.defineProperty(t, s, {
      enumerable: !0,
      configurable: !0,
      get: () => o.value,
      set: i => o.value = i
    }) : t[s] = o
  }
}

function _s(e, t, n) {
  pe(I(e) ? e.map(s => s.bind(t.proxy)) : e.bind(t.proxy), t, n)
}

function br(e, t, n, s) {
  const r = s.includes(".") ? dr(n, s) : () => n[s];
  if (q(e)) {
    const o = t[e];
    M(o) && jt(r, o)
  } else if (M(e)) jt(r, e.bind(n));
  else if (K(e))
    if (I(e)) e.forEach(o => br(o, t, n, s));
    else {
      const o = M(e.handler) ? e.handler.bind(n) : t[e.handler];
      M(o) && jt(r, o, e)
    }
}

function Vn(e) {
  const t = e.type,
    {
      mixins: n,
      extends: s
    } = t,
    {
      mixins: r,
      optionsCache: o,
      config: {
        optionMergeStrategies: i
      }
    } = e.appContext,
    c = o.get(t);
  let f;
  return c ? f = c : !r.length && !n && !s ? f = t : (f = {}, r.length && r.forEach(a => Bt(f, a, i, !0)), Bt(f, t, i)), K(t) && o.set(t, f), f
}

function Bt(e, t, n, s = !1) {
  const {
    mixins: r,
    extends: o
  } = t;
  o && Bt(e, o, n, !0), r && r.forEach(i => Bt(e, i, n, !0));
  for (const i in t)
    if (!(s && i === "expose")) {
      const c = ci[i] || n && n[i];
      e[i] = c ? c(e[i], t[i]) : t[i]
    } return e
}
const ci = {
  data: ms,
  props: bs,
  emits: bs,
  methods: ct,
  computed: ct,
  beforeCreate: te,
  created: te,
  beforeMount: te,
  mounted: te,
  beforeUpdate: te,
  updated: te,
  beforeDestroy: te,
  beforeUnmount: te,
  destroyed: te,
  unmounted: te,
  activated: te,
  deactivated: te,
  errorCaptured: te,
  serverPrefetch: te,
  components: ct,
  directives: ct,
  watch: ui,
  provide: ms,
  inject: fi
};

function ms(e, t) {
  return t ? e ? function() {
    return V(M(e) ? e.call(this, this) : e, M(t) ? t.call(this, this) : t)
  } : t : e
}

function fi(e, t) {
  return ct(Tn(e), Tn(t))
}

function Tn(e) {
  if (I(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++) t[e[n]] = e[n];
    return t
  }
  return e
}

function te(e, t) {
  return e ? [...new Set([].concat(e, t))] : t
}

function ct(e, t) {
  return e ? V(Object.create(null), e, t) : t
}

function bs(e, t) {
  return e ? I(e) && I(t) ? [...new Set([...e, ...t])] : V(Object.create(null), gs(e), gs(t ?? {})) : t
}

function ui(e, t) {
  if (!e) return t;
  if (!t) return e;
  const n = V(Object.create(null), e);
  for (const s in t) n[s] = te(e[s], t[s]);
  return n
}

function xr() {
  return {
    app: null,
    config: {
      isNativeTag: Nr,
      performance: !1,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: Object.create(null),
    optionsCache: new WeakMap,
    propsCache: new WeakMap,
    emitsCache: new WeakMap
  }
}
let ai = 0;

function di(e, t) {
  return function(s, r = null) {
    M(s) || (s = V({}, s)), r != null && !K(r) && (r = null);
    const o = xr(),
      i = new Set;
    let c = !1;
    const f = o.app = {
      _uid: ai++,
      _component: s,
      _props: r,
      _container: null,
      _context: o,
      _instance: null,
      version: Hi,
      get config() {
        return o.config
      },
      set config(a) { },
      use(a, ..._) {
        return i.has(a) || (a && M(a.install) ? (i.add(a), a.install(f, ..._)) : M(a) && (i.add(a), a(f, ..._))), f
      },
      mixin(a) {
        return o.mixins.includes(a) || o.mixins.push(a), f
      },
      component(a, _) {
        return _ ? (o.components[a] = _, f) : o.components[a]
      },
      directive(a, _) {
        return _ ? (o.directives[a] = _, f) : o.directives[a]
      },
      mount(a, _, y) {
        if (!c) {
          const E = ie(s, r);
          return E.appContext = o, _ && t ? t(E, a) : e(E, a, y), c = !0, f._container = a, a.__vue_app__ = f, on(E.component) || E.component.proxy
        }
      },
      unmount() {
        c && (e(null, f._container), delete f._container.__vue_app__)
      },
      provide(a, _) {
        return o.provides[a] = _, f
      },
      runWithContext(a) {
        Wt = f;
        try {
          return a()
        } finally {
          Wt = null
        }
      }
    };
    return f
  }
}
let Wt = null;

function hi(e, t) {
  if (Z) {
    let n = Z.provides;
    const s = Z.parent && Z.parent.provides;
    s === n && (n = Z.provides = Object.create(s)), n[e] = t
  }
}

function Ut(e, t, n = !1) {
  const s = Z || ae;
  if (s || Wt) {
    const r = s ? s.parent == null ? s.vnode.appContext && s.vnode.appContext.provides : s.parent.provides : Wt._context.provides;
    if (r && e in r) return r[e];
    if (arguments.length > 1) return n && M(t) ? t.call(s && s.proxy) : t
  }
}

function pi(e, t, n, s = !1) {
  const r = {},
    o = {};
  $t(o, rn, 1), e.propsDefaults = Object.create(null), yr(e, t, r, o);
  for (const i in e.propsOptions[0]) i in r || (r[i] = void 0);
  n ? e.props = s ? r : To(r) : e.type.props ? e.props = r : e.props = o, e.attrs = o
}

function gi(e, t, n, s) {
  const {
    props: r,
    attrs: o,
    vnode: {
      patchFlag: i
    }
  } = e, c = j(r), [f] = e.propsOptions;
  let a = !1;
  if ((s || i > 0) && !(i & 16)) {
    if (i & 8) {
      const _ = e.vnode.dynamicProps;
      for (let y = 0; y < _.length; y++) {
        let E = _[y];
        if (en(e.emitsOptions, E)) continue;
        const P = t[E];
        if (f)
          if (R(o, E)) P !== o[E] && (o[E] = P, a = !0);
          else {
            const B = Xe(E);
            r[B] = In(f, c, B, P, e, !1)
          }
        else P !== o[E] && (o[E] = P, a = !0)
      }
    }
  } else {
    yr(e, t, r, o) && (a = !0);
    let _;
    for (const y in c) (!t || !R(t, y) && ((_ = We(y)) === y || !R(t, _))) && (f ? n && (n[y] !== void 0 || n[_] !== void 0) && (r[y] = In(f, c, y, void 0, e, !0)) : delete r[y]);
    if (o !== c)
      for (const y in o) (!t || !R(t, y)) && (delete o[y], a = !0)
  }
  a && we(e, "set", "$attrs")
}

function yr(e, t, n, s) {
  const [r, o] = e.propsOptions;
  let i = !1,
    c;
  if (t)
    for (let f in t) {
      if (St(f)) continue;
      const a = t[f];
      let _;
      r && R(r, _ = Xe(f)) ? !o || !o.includes(_) ? n[_] = a : (c || (c = {}))[_] = a : en(e.emitsOptions, f) || (!(f in s) || a !== s[f]) && (s[f] = a, i = !0)
    }
  if (o) {
    const f = j(n),
      a = c || H;
    for (let _ = 0; _ < o.length; _++) {
      const y = o[_];
      n[y] = In(r, f, y, a[y], e, !R(a, y))
    }
  }
  return i
}

function In(e, t, n, s, r, o) {
  const i = e[n];
  if (i != null) {
    const c = R(i, "default");
    if (c && s === void 0) {
      const f = i.default;
      if (i.type !== Function && !i.skipFactory && M(f)) {
        const {
          propsDefaults: a
        } = r;
        n in a ? s = a[n] : (et(r), s = a[n] = f.call(null, t), De())
      } else s = f
    }
    i[0] && (o && !c ? s = !1 : i[1] && (s === "" || s === We(n)) && (s = !0))
  }
  return s
}

function vr(e, t, n = !1) {
  const s = t.propsCache,
    r = s.get(e);
  if (r) return r;
  const o = e.props,
    i = {},
    c = [];
  let f = !1;
  if (!M(e)) {
    const _ = y => {
      f = !0;
      const [E, P] = vr(y, t, !0);
      V(i, E), P && c.push(...P)
    };
    !n && t.mixins.length && t.mixins.forEach(_), e.extends && _(e.extends), e.mixins && e.mixins.forEach(_)
  }
  if (!o && !f) return K(e) && s.set(e, Ve), Ve;
  if (I(o))
    for (let _ = 0; _ < o.length; _++) {
      const y = Xe(o[_]);
      xs(y) && (i[y] = H)
    } else if (o)
    for (const _ in o) {
      const y = Xe(_);
      if (xs(y)) {
        const E = o[_],
          P = i[y] = I(E) || M(E) ? {
            type: E
          } : V({}, E);
        if (P) {
          const B = ws(Boolean, P.type),
            S = ws(String, P.type);
          P[0] = B > -1, P[1] = S < 0 || B < S, (B > -1 || R(P, "default")) && c.push(y)
        }
      }
    }
  const a = [i, c];
  return K(e) && s.set(e, a), a
}

function xs(e) {
  return e[0] !== "$"
}

function ys(e) {
  const t = e && e.toString().match(/^\s*(function|class) (\w+)/);
  return t ? t[2] : e === null ? "null" : ""
}

function vs(e, t) {
  return ys(e) === ys(t)
}

function ws(e, t) {
  return I(t) ? t.findIndex(n => vs(n, e)) : M(t) && vs(t, e) ? 0 : -1
}
const wr = e => e[0] === "_" || e === "$stable",
  kn = e => I(e) ? e.map(be) : [be(e)],
  _i = (e, t, n) => {
    if (t._n) return t;
    const s = Ho((...r) => kn(t(...r)), n);
    return s._c = !1, s
  },
  Er = (e, t, n) => {
    const s = e._ctx;
    for (const r in e) {
      if (wr(r)) continue;
      const o = e[r];
      if (M(o)) t[r] = _i(r, o, s);
      else if (o != null) {
        const i = kn(o);
        t[r] = () => i
      }
    }
  },
  Cr = (e, t) => {
    const n = kn(t);
    e.slots.default = () => n
  },
  mi = (e, t) => {
    if (e.vnode.shapeFlag & 32) {
      const n = t._;
      n ? (e.slots = j(t), $t(t, "_", n)) : Er(t, e.slots = {})
    } else e.slots = {}, t && Cr(e, t);
    $t(e.slots, rn, 1)
  },
  bi = (e, t, n) => {
    const {
      vnode: s,
      slots: r
    } = e;
    let o = !0,
      i = H;
    if (s.shapeFlag & 32) {
      const c = t._;
      c ? n && c === 1 ? o = !1 : (V(r, t), !n && c === 1 && delete r._) : (o = !t.$stable, Er(t, r)), i = t
    } else t && (Cr(e, t), i = {
      default: 1
    });
    if (o)
      for (const c in r) !wr(c) && !(c in i) && delete r[c]
  };

function On(e, t, n, s, r = !1) {
  if (I(e)) {
    e.forEach((E, P) => On(E, t && (I(t) ? t[P] : t), n, s, r));
    return
  }
  if (Nt(s) && !r) return;
  const o = s.shapeFlag & 4 ? on(s.component) || s.component.proxy : s.el,
    i = r ? null : o,
    {
      i: c,
      r: f
    } = e,
    a = t && t.r,
    _ = c.refs === H ? c.refs = {} : c.refs,
    y = c.setupState;
  if (a != null && a !== f && (q(a) ? (_[a] = null, R(y, a) && (y[a] = null)) : G(a) && (a.value = null)), M(f)) Pe(f, c, 12, [i, _]);
  else {
    const E = q(f),
      P = G(f);
    if (E || P) {
      const B = () => {
        if (e.f) {
          const S = E ? R(y, f) ? y[f] : _[f] : f.value;
          r ? I(S) && Rn(S, o) : I(S) ? S.includes(o) || S.push(o) : E ? (_[f] = [o], R(y, f) && (y[f] = _[f])) : (f.value = [o], e.k && (_[e.k] = f.value))
        } else E ? (_[f] = i, R(y, f) && (y[f] = i)) : P && (f.value = i, e.k && (_[e.k] = i))
      };
      i ? (B.id = -1, se(B, n)) : B()
    }
  }
}
const se = zo;

function xi(e) {
  return yi(e)
}

function yi(e, t) {
  const n = mn();
  n.__VUE__ = !0;
  const {
    insert: s,
    remove: r,
    patchProp: o,
    createElement: i,
    createText: c,
    createComment: f,
    setText: a,
    setElementText: _,
    parentNode: y,
    nextSibling: E,
    setScopeId: P = he,
    insertStaticContent: B
  } = e, S = (l, u, d, p = null, h = null, b = null, v = !1, m = null, x = !!u.dynamicChildren) => {
    if (l === u) return;
    l && !it(l, u) && (p = Tt(l), ge(l, h, b, !0), l = null), u.patchFlag === -2 && (x = !1, u.dynamicChildren = null);
    const {
      type: g,
      ref: C,
      shapeFlag: w
    } = u;
    switch (g) {
      case sn:
        z(l, u, d, p);
        break;
      case Be:
        k(l, u, d, p);
        break;
      case pn:
        l == null && Y(u, d, p, v);
        break;
      case fe:
        wt(l, u, d, p, h, b, v, m, x);
        break;
      default:
        w & 1 ? Ce(l, u, d, p, h, b, v, m, x) : w & 6 ? Et(l, u, d, p, h, b, v, m, x) : (w & 64 || w & 128) && g.process(l, u, d, p, h, b, v, m, x, qe)
    }
    C != null && h && On(C, l && l.ref, b, u || l, !u)
  }, z = (l, u, d, p) => {
    if (l == null) s(u.el = c(u.children), d, p);
    else {
      const h = u.el = l.el;
      u.children !== l.children && a(h, u.children)
    }
  }, k = (l, u, d, p) => {
    l == null ? s(u.el = f(u.children || ""), d, p) : u.el = l.el
  }, Y = (l, u, d, p) => {
    [l.el, l.anchor] = B(l.children, u, d, p, l.el, l.anchor)
  }, Q = ({
    el: l,
    anchor: u
  }, d, p) => {
    let h;
    for (; l && l !== u;) h = E(l), s(l, d, p), l = h;
    s(u, d, p)
  }, A = ({
    el: l,
    anchor: u
  }) => {
    let d;
    for (; l && l !== u;) d = E(l), r(l), l = d;
    r(u)
  }, Ce = (l, u, d, p, h, b, v, m, x) => {
    v = v || u.type === "svg", l == null ? st(u, d, p, h, b, v, m, x) : ln(l, u, h, b, v, m, x)
  }, st = (l, u, d, p, h, b, v, m) => {
    let x, g;
    const {
      type: C,
      props: w,
      shapeFlag: T,
      transition: O,
      dirs: F
    } = l;
    if (x = l.el = i(l.type, b, w && w.is, w), T & 8 ? _(x, l.children) : T & 16 && Ae(l.children, x, null, p, h, b && C !== "foreignObject", v, m), F && je(l, null, p, "created"), vt(x, l, l.scopeId, v, p), w) {
      for (const N in w) N !== "value" && !St(N) && o(x, N, null, w[N], b, l.children, p, h, ye);
      "value" in w && o(x, "value", null, w.value), (g = w.onVnodeBeforeMount) && me(g, p, l)
    }
    F && je(l, null, p, "beforeMount");
    const L = (!h || h && !h.pendingBranch) && O && !O.persisted;
    L && O.beforeEnter(x), s(x, u, d), ((g = w && w.onVnodeMounted) || L || F) && se(() => {
      g && me(g, p, l), L && O.enter(x), F && je(l, null, p, "mounted")
    }, h)
  }, vt = (l, u, d, p, h) => {
    if (d && P(l, d), p)
      for (let b = 0; b < p.length; b++) P(l, p[b]);
    if (h) {
      let b = h.subTree;
      if (u === b) {
        const v = h.vnode;
        vt(l, v, v.scopeId, v.slotScopeIds, h.parent)
      }
    }
  }, Ae = (l, u, d, p, h, b, v, m, x = 0) => {
    for (let g = x; g < l.length; g++) {
      const C = l[g] = m ? Ie(l[g]) : be(l[g]);
      S(null, C, u, d, p, h, b, v, m)
    }
  }, ln = (l, u, d, p, h, b, v) => {
    const m = u.el = l.el;
    let {
      patchFlag: x,
      dynamicChildren: g,
      dirs: C
    } = u;
    x |= l.patchFlag & 16;
    const w = l.props || H,
      T = u.props || H;
    let O;
    d && Ne(d, !1), (O = T.onVnodeBeforeUpdate) && me(O, d, u, l), C && je(u, l, d, "beforeUpdate"), d && Ne(d, !0);
    const F = h && u.type !== "foreignObject";
    if (g ? Fe(l.dynamicChildren, g, m, d, p, F, b) : v || U(l, u, m, null, d, p, F, b, !1), x > 0) {
      if (x & 16) rt(m, u, w, T, d, p, h);
      else if (x & 2 && w.class !== T.class && o(m, "class", null, T.class, h), x & 4 && o(m, "style", w.style, T.style, h), x & 8) {
        const L = u.dynamicProps;
        for (let N = 0; N < L.length; N++) {
          const W = L[N],
            le = w[W],
            ze = T[W];
          (ze !== le || W === "value") && o(m, W, le, ze, h, l.children, d, p, ye)
        }
      }
      x & 1 && l.children !== u.children && _(m, u.children)
    } else !v && g == null && rt(m, u, w, T, d, p, h);
    ((O = T.onVnodeUpdated) || C) && se(() => {
      O && me(O, d, u, l), C && je(u, l, d, "updated")
    }, p)
  }, Fe = (l, u, d, p, h, b, v) => {
    for (let m = 0; m < u.length; m++) {
      const x = l[m],
        g = u[m],
        C = x.el && (x.type === fe || !it(x, g) || x.shapeFlag & 70) ? y(x.el) : d;
      S(x, g, C, null, p, h, b, v, !0)
    }
  }, rt = (l, u, d, p, h, b, v) => {
    if (d !== p) {
      if (d !== H)
        for (const m in d) !St(m) && !(m in p) && o(l, m, d[m], null, v, u.children, h, b, ye);
      for (const m in p) {
        if (St(m)) continue;
        const x = p[m],
          g = d[m];
        x !== g && m !== "value" && o(l, m, g, x, v, u.children, h, b, ye)
      }
      "value" in p && o(l, "value", d.value, p.value)
    }
  }, wt = (l, u, d, p, h, b, v, m, x) => {
    const g = u.el = l ? l.el : c(""),
      C = u.anchor = l ? l.anchor : c("");
    let {
      patchFlag: w,
      dynamicChildren: T,
      slotScopeIds: O
    } = u;
    O && (m = m ? m.concat(O) : O), l == null ? (s(g, d, p), s(C, d, p), Ae(u.children, d, C, h, b, v, m, x)) : w > 0 && w & 64 && T && l.dynamicChildren ? (Fe(l.dynamicChildren, T, d, h, b, v, m), (u.key != null || h && u === h.subTree) && Tr(l, u, !0)) : U(l, u, d, C, h, b, v, m, x)
  }, Et = (l, u, d, p, h, b, v, m, x) => {
    u.slotScopeIds = m, l == null ? u.shapeFlag & 512 ? h.ctx.activate(u, d, p, v, x) : cn(u, d, p, h, b, v, x) : Zn(l, u, x)
  }, cn = (l, u, d, p, h, b, v) => {
    const m = l.component = Ai(l, p, h);
    if (hr(l) && (m.ctx.renderer = qe), Fi(m), m.asyncDep) {
      if (h && h.registerDep(m, ee), !l.el) {
        const x = m.subTree = ie(Be);
        k(null, x, u, d)
      }
      return
    }
    ee(m, l, u, d, h, b, v)
  }, Zn = (l, u, d) => {
    const p = u.component = l.component;
    if (Bo(l, u, d))
      if (p.asyncDep && !p.asyncResolved) {
        D(p, u, d);
        return
      } else p.next = u, No(p.update), p.update();
    else u.el = l.el, p.vnode = u
  }, ee = (l, u, d, p, h, b, v) => {
    const m = () => {
      if (l.isMounted) {
        let {
          next: C,
          bu: w,
          u: T,
          parent: O,
          vnode: F
        } = l, L = C, N;
        Ne(l, !1), C ? (C.el = F.el, D(l, C, v)) : C = F, w && Rt(w), (N = C.props && C.props.onVnodeBeforeUpdate) && me(N, O, C, F), Ne(l, !0);
        const W = dn(l),
          le = l.subTree;
        l.subTree = W, S(le, W, y(le.el), Tt(le), l, h, b), C.el = W.el, L === null && Wo(l, W.el), T && se(T, h), (N = C.props && C.props.onVnodeUpdated) && se(() => me(N, O, C, F), h)
      } else {
        let C;
        const {
          el: w,
          props: T
        } = u, {
          bm: O,
          m: F,
          parent: L
        } = l, N = Nt(u);
        if (Ne(l, !1), O && Rt(O), !N && (C = T && T.onVnodeBeforeMount) && me(C, L, u), Ne(l, !0), w && un) {
          const W = () => {
            l.subTree = dn(l), un(w, l.subTree, l, h, null)
          };
          N ? u.type.__asyncLoader().then(() => !l.isUnmounted && W()) : W()
        } else {
          const W = l.subTree = dn(l);
          S(null, W, d, p, l, h, b), u.el = W.el
        }
        if (F && se(F, h), !N && (C = T && T.onVnodeMounted)) {
          const W = u;
          se(() => me(C, L, W), h)
        } (u.shapeFlag & 256 || L && Nt(L.vnode) && L.vnode.shapeFlag & 256) && l.a && se(l.a, h), l.isMounted = !0, u = d = p = null
      }
    },
      x = l.effect = new $n(m, () => zn(g), l.scope),
      g = l.update = () => x.run();
    g.id = l.uid, Ne(l, !0), g()
  }, D = (l, u, d) => {
    u.component = l;
    const p = l.vnode.props;
    l.vnode = u, l.next = null, gi(l, u.props, p, d), bi(l, u.children, d), tt(), hs(), nt()
  }, U = (l, u, d, p, h, b, v, m, x = !1) => {
    const g = l && l.children,
      C = l ? l.shapeFlag : 0,
      w = u.children,
      {
        patchFlag: T,
        shapeFlag: O
      } = u;
    if (T > 0) {
      if (T & 128) {
        Ct(g, w, d, p, h, b, v, m, x);
        return
      } else if (T & 256) {
        Se(g, w, d, p, h, b, v, m, x);
        return
      }
    }
    O & 8 ? (C & 16 && ye(g, h, b), w !== g && _(d, w)) : C & 16 ? O & 16 ? Ct(g, w, d, p, h, b, v, m, x) : ye(g, h, b, !0) : (C & 8 && _(d, ""), O & 16 && Ae(w, d, p, h, b, v, m, x))
  }, Se = (l, u, d, p, h, b, v, m, x) => {
    l = l || Ve, u = u || Ve;
    const g = l.length,
      C = u.length,
      w = Math.min(g, C);
    let T;
    for (T = 0; T < w; T++) {
      const O = u[T] = x ? Ie(u[T]) : be(u[T]);
      S(l[T], O, d, null, h, b, v, m, x)
    }
    g > C ? ye(l, h, b, !0, !1, w) : Ae(u, d, p, h, b, v, m, x, w)
  }, Ct = (l, u, d, p, h, b, v, m, x) => {
    let g = 0;
    const C = u.length;
    let w = l.length - 1,
      T = C - 1;
    for (; g <= w && g <= T;) {
      const O = l[g],
        F = u[g] = x ? Ie(u[g]) : be(u[g]);
      if (it(O, F)) S(O, F, d, null, h, b, v, m, x);
      else break;
      g++
    }
    for (; g <= w && g <= T;) {
      const O = l[w],
        F = u[T] = x ? Ie(u[T]) : be(u[T]);
      if (it(O, F)) S(O, F, d, null, h, b, v, m, x);
      else break;
      w--, T--
    }
    if (g > w) {
      if (g <= T) {
        const O = T + 1,
          F = O < C ? u[O].el : p;
        for (; g <= T;) S(null, u[g] = x ? Ie(u[g]) : be(u[g]), d, F, h, b, v, m, x), g++
      }
    } else if (g > T)
      for (; g <= w;) ge(l[g], h, b, !0), g++;
    else {
      const O = g,
        F = g,
        L = new Map;
      for (g = F; g <= T; g++) {
        const oe = u[g] = x ? Ie(u[g]) : be(u[g]);
        oe.key != null && L.set(oe.key, g)
      }
      let N, W = 0;
      const le = T - F + 1;
      let ze = !1,
        ts = 0;
      const ot = new Array(le);
      for (g = 0; g < le; g++) ot[g] = 0;
      for (g = O; g <= w; g++) {
        const oe = l[g];
        if (W >= le) {
          ge(oe, h, b, !0);
          continue
        }
        let _e;
        if (oe.key != null) _e = L.get(oe.key);
        else
          for (N = F; N <= T; N++)
            if (ot[N - F] === 0 && it(oe, u[N])) {
              _e = N;
              break
            } _e === void 0 ? ge(oe, h, b, !0) : (ot[_e - F] = g + 1, _e >= ts ? ts = _e : ze = !0, S(oe, u[_e], d, null, h, b, v, m, x), W++)
      }
      const ns = ze ? vi(ot) : Ve;
      for (N = ns.length - 1, g = le - 1; g >= 0; g--) {
        const oe = F + g,
          _e = u[oe],
          ss = oe + 1 < C ? u[oe + 1].el : p;
        ot[g] === 0 ? S(null, _e, d, ss, h, b, v, m, x) : ze && (N < 0 || g !== ns[N] ? Re(_e, d, ss, 2) : N--)
      }
    }
  }, Re = (l, u, d, p, h = null) => {
    const {
      el: b,
      type: v,
      transition: m,
      children: x,
      shapeFlag: g
    } = l;
    if (g & 6) {
      Re(l.component.subTree, u, d, p);
      return
    }
    if (g & 128) {
      l.suspense.move(u, d, p);
      return
    }
    if (g & 64) {
      v.move(l, u, d, qe);
      return
    }
    if (v === fe) {
      s(b, u, d);
      for (let w = 0; w < x.length; w++) Re(x[w], u, d, p);
      s(l.anchor, u, d);
      return
    }
    if (v === pn) {
      Q(l, u, d);
      return
    }
    if (p !== 2 && g & 1 && m)
      if (p === 0) m.beforeEnter(b), s(b, u, d), se(() => m.enter(b), h);
      else {
        const {
          leave: w,
          delayLeave: T,
          afterLeave: O
        } = m, F = () => s(b, u, d), L = () => {
          w(b, () => {
            F(), O && O()
          })
        };
        T ? T(b, F, L) : L()
      }
    else s(b, u, d)
  }, ge = (l, u, d, p = !1, h = !1) => {
    const {
      type: b,
      props: v,
      ref: m,
      children: x,
      dynamicChildren: g,
      shapeFlag: C,
      patchFlag: w,
      dirs: T
    } = l;
    if (m != null && On(m, null, d, l, !0), C & 256) {
      u.ctx.deactivate(l);
      return
    }
    const O = C & 1 && T,
      F = !Nt(l);
    let L;
    if (F && (L = v && v.onVnodeBeforeUnmount) && me(L, u, l), C & 6) jr(l.component, d, p);
    else {
      if (C & 128) {
        l.suspense.unmount(d, p);
        return
      }
      O && je(l, null, u, "beforeUnmount"), C & 64 ? l.type.remove(l, u, d, h, qe, p) : g && (b !== fe || w > 0 && w & 64) ? ye(g, u, d, !1, !0) : (b === fe && w & 384 || !h && C & 16) && ye(x, u, d), p && Gn(l)
    } (F && (L = v && v.onVnodeUnmounted) || O) && se(() => {
      L && me(L, u, l), O && je(l, null, u, "unmounted")
    }, d)
  }, Gn = l => {
    const {
      type: u,
      el: d,
      anchor: p,
      transition: h
    } = l;
    if (u === fe) {
      Rr(d, p);
      return
    }
    if (u === pn) {
      A(l);
      return
    }
    const b = () => {
      r(d), h && !h.persisted && h.afterLeave && h.afterLeave()
    };
    if (l.shapeFlag & 1 && h && !h.persisted) {
      const {
        leave: v,
        delayLeave: m
      } = h, x = () => v(d, b);
      m ? m(l.el, b, x) : x()
    } else b()
  }, Rr = (l, u) => {
    let d;
    for (; l !== u;) d = E(l), r(l), l = d;
    r(u)
  }, jr = (l, u, d) => {
    const {
      bum: p,
      scope: h,
      update: b,
      subTree: v,
      um: m
    } = l;
    p && Rt(p), h.stop(), b && (b.active = !1, ge(v, l, u, d)), m && se(m, u), se(() => {
      l.isUnmounted = !0
    }, u), u && u.pendingBranch && !u.isUnmounted && l.asyncDep && !l.asyncResolved && l.suspenseId === u.pendingId && (u.deps--, u.deps === 0 && u.resolve())
  }, ye = (l, u, d, p = !1, h = !1, b = 0) => {
    for (let v = b; v < l.length; v++) ge(l[v], u, d, p, h)
  }, Tt = l => l.shapeFlag & 6 ? Tt(l.component.subTree) : l.shapeFlag & 128 ? l.suspense.next() : E(l.anchor || l.el), es = (l, u, d) => {
    l == null ? u._vnode && ge(u._vnode, null, null, !0) : S(u._vnode || null, l, u, null, null, null, d), hs(), ir(), u._vnode = l
  }, qe = {
    p: S,
    um: ge,
    m: Re,
    r: Gn,
    mt: cn,
    mc: Ae,
    pc: U,
    pbc: Fe,
    n: Tt,
    o: e
  };
  let fn, un;
  return t && ([fn, un] = t(qe)), {
    render: es,
    hydrate: fn,
    createApp: di(es, fn)
  }
}

function Ne({
  effect: e,
  update: t
}, n) {
  e.allowRecurse = t.allowRecurse = n
}

function Tr(e, t, n = !1) {
  const s = e.children,
    r = t.children;
  if (I(s) && I(r))
    for (let o = 0; o < s.length; o++) {
      const i = s[o];
      let c = r[o];
      c.shapeFlag & 1 && !c.dynamicChildren && ((c.patchFlag <= 0 || c.patchFlag === 32) && (c = r[o] = Ie(r[o]), c.el = i.el), n || Tr(i, c)), c.type === sn && (c.el = i.el)
    }
}

function vi(e) {
  const t = e.slice(),
    n = [0];
  let s, r, o, i, c;
  const f = e.length;
  for (s = 0; s < f; s++) {
    const a = e[s];
    if (a !== 0) {
      if (r = n[n.length - 1], e[r] < a) {
        t[s] = r, n.push(s);
        continue
      }
      for (o = 0, i = n.length - 1; o < i;) c = o + i >> 1, e[n[c]] < a ? o = c + 1 : i = c;
      a < e[n[o]] && (o > 0 && (t[s] = n[o - 1]), n[o] = s)
    }
  }
  for (o = n.length, i = n[o - 1]; o-- > 0;) n[o] = i, i = t[i];
  return n
}
const wi = e => e.__isTeleport,
  fe = Symbol.for("v-fgt"),
  sn = Symbol.for("v-txt"),
  Be = Symbol.for("v-cmt"),
  pn = Symbol.for("v-stc"),
  ut = [];
let de = null;

function J(e = !1) {
  ut.push(de = e ? null : [])
}

function Ei() {
  ut.pop(), de = ut[ut.length - 1] || null
}
let mt = 1;

function Es(e) {
  mt += e
}

function Ir(e) {
  return e.dynamicChildren = mt > 0 ? de || Ve : null, Ei(), mt > 0 && de && de.push(e), e
}

function ne(e, t, n, s, r, o) {
  return Ir($(e, t, n, s, r, o, !0))
}

function Pn(e, t, n, s, r) {
  return Ir(ie(e, t, n, s, r, !0))
}

function Ci(e) {
  return e ? e.__v_isVNode === !0 : !1
}

function it(e, t) {
  return e.type === t.type && e.key === t.key
}
const rn = "__vInternal",
  Or = ({
    key: e
  }) => e ?? null,
  Lt = ({
    ref: e,
    ref_key: t,
    ref_for: n
  }) => (typeof e == "number" && (e = "" + e), e != null ? q(e) || G(e) || M(e) ? {
    i: ae,
    r: e,
    k: t,
    f: !!n
  } : e : null);

function $(e, t = null, n = null, s = 0, r = null, o = e === fe ? 0 : 1, i = !1, c = !1) {
  const f = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e,
    props: t,
    key: t && Or(t),
    ref: t && Lt(t),
    scopeId: tn,
    slotScopeIds: null,
    children: n,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag: o,
    patchFlag: s,
    dynamicProps: r,
    dynamicChildren: null,
    appContext: null,
    ctx: ae
  };
  return c ? (Yn(f, n), o & 128 && e.normalize(f)) : n && (f.shapeFlag |= q(n) ? 8 : 16), mt > 0 && !i && de && (f.patchFlag > 0 || o & 6) && f.patchFlag !== 32 && de.push(f), f
}
const ie = Ti;

function Ti(e, t = null, n = null, s = 0, r = null, o = !1) {
  if ((!e || e === ri) && (e = Be), Ci(e)) {
    const c = Ge(e, t, !0);
    return n && Yn(c, n), mt > 0 && !o && de && (c.shapeFlag & 6 ? de[de.indexOf(e)] = c : de.push(c)), c.patchFlag |= -2, c
  }
  if (Ni(e) && (e = e.__vccOpts), t) {
    t = Ii(t);
    let {
      class: c,
      style: f
    } = t;
    c && !q(c) && (t.class = Yt(c)), K(f) && (Gs(f) && !I(f) && (f = V({}, f)), t.style = Nn(f))
  }
  const i = q(e) ? 1 : qo(e) ? 128 : wi(e) ? 64 : K(e) ? 4 : M(e) ? 2 : 0;
  return $(e, t, n, s, r, i, o, !0)
}

function Ii(e) {
  return e ? Gs(e) || rn in e ? V({}, e) : e : null
}

function Ge(e, t, n = !1) {
  const {
    props: s,
    ref: r,
    patchFlag: o,
    children: i
  } = e, c = t ? Oi(s || {}, t) : s;
  return {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e.type,
    props: c,
    key: c && Or(c),
    ref: t && t.ref ? n && r ? I(r) ? r.concat(Lt(t)) : [r, Lt(t)] : Lt(t) : r,
    scopeId: e.scopeId,
    slotScopeIds: e.slotScopeIds,
    children: i,
    target: e.target,
    targetAnchor: e.targetAnchor,
    staticCount: e.staticCount,
    shapeFlag: e.shapeFlag,
    patchFlag: t && e.type !== fe ? o === -1 ? 16 : o | 16 : o,
    dynamicProps: e.dynamicProps,
    dynamicChildren: e.dynamicChildren,
    appContext: e.appContext,
    dirs: e.dirs,
    transition: e.transition,
    component: e.component,
    suspense: e.suspense,
    ssContent: e.ssContent && Ge(e.ssContent),
    ssFallback: e.ssFallback && Ge(e.ssFallback),
    el: e.el,
    anchor: e.anchor,
    ctx: e.ctx,
    ce: e.ce
  }
}

function Mn(e = " ", t = 0) {
  return ie(sn, null, e, t)
}

function bt(e = "", t = !1) {
  return t ? (J(), Pn(Be, null, e)) : ie(Be, null, e)
}

function be(e) {
  return e == null || typeof e == "boolean" ? ie(Be) : I(e) ? ie(fe, null, e.slice()) : typeof e == "object" ? Ie(e) : ie(sn, null, String(e))
}

function Ie(e) {
  return e.el === null && e.patchFlag !== -1 || e.memo ? e : Ge(e)
}

function Yn(e, t) {
  let n = 0;
  const {
    shapeFlag: s
  } = e;
  if (t == null) t = null;
  else if (I(t)) n = 16;
  else if (typeof t == "object")
    if (s & 65) {
      const r = t.default;
      r && (r._c && (r._d = !1), Yn(e, r()), r._c && (r._d = !0));
      return
    } else {
      n = 32;
      const r = t._;
      !r && !(rn in t) ? t._ctx = ae : r === 3 && ae && (ae.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024))
    }
  else M(t) ? (t = {
    default: t,
    _ctx: ae
  }, n = 32) : (t = String(t), s & 64 ? (n = 16, t = [Mn(t)]) : n = 8);
  e.children = t, e.shapeFlag |= n
}

function Oi(...e) {
  const t = {};
  for (let n = 0; n < e.length; n++) {
    const s = e[n];
    for (const r in s)
      if (r === "class") t.class !== s.class && (t.class = Yt([t.class, s.class]));
      else if (r === "style") t.style = Nn([t.style, s.style]);
      else if (Jt(r)) {
        const o = t[r],
          i = s[r];
        i && o !== i && !(I(o) && o.includes(i)) && (t[r] = o ? [].concat(o, i) : i)
      } else r !== "" && (t[r] = s[r])
  }
  return t
}

function me(e, t, n, s = null) {
  pe(e, t, 7, [n, s])
}
const Pi = xr();
let Mi = 0;

function Ai(e, t, n) {
  const s = e.type,
    r = (t ? t.appContext : e.appContext) || Pi,
    o = {
      uid: Mi++,
      vnode: e,
      type: s,
      parent: t,
      appContext: r,
      root: null,
      next: null,
      subTree: null,
      effect: null,
      update: null,
      scope: new Yr(!0),
      render: null,
      proxy: null,
      exposed: null,
      exposeProxy: null,
      withProxy: null,
      provides: t ? t.provides : Object.create(r.provides),
      accessCache: null,
      renderCache: [],
      components: null,
      directives: null,
      propsOptions: vr(s, r),
      emitsOptions: cr(s, r),
      emit: null,
      emitted: null,
      propsDefaults: H,
      inheritAttrs: s.inheritAttrs,
      ctx: H,
      data: H,
      props: H,
      attrs: H,
      slots: H,
      refs: H,
      setupState: H,
      setupContext: null,
      attrsProxy: null,
      slotsProxy: null,
      suspense: n,
      suspenseId: n ? n.pendingId : 0,
      asyncDep: null,
      asyncResolved: !1,
      isMounted: !1,
      isUnmounted: !1,
      isDeactivated: !1,
      bc: null,
      c: null,
      bm: null,
      m: null,
      bu: null,
      u: null,
      um: null,
      bum: null,
      da: null,
      a: null,
      rtg: null,
      rtc: null,
      ec: null,
      sp: null
    };
  return o.ctx = {
    _: o
  }, o.root = t ? t.root : o, o.emit = $o.bind(null, o), e.ce && e.ce(o), o
}
let Z = null,
  Qn, Je, Cs = "__VUE_INSTANCE_SETTERS__";
(Je = mn()[Cs]) || (Je = mn()[Cs] = []), Je.push(e => Z = e), Qn = e => {
  Je.length > 1 ? Je.forEach(t => t(e)) : Je[0](e)
};
const et = e => {
  Qn(e), e.scope.on()
},
  De = () => {
    Z && Z.scope.off(), Qn(null)
  };

function Pr(e) {
  return e.vnode.shapeFlag & 4
}
let xt = !1;

function Fi(e, t = !1) {
  xt = t;
  const {
    props: n,
    children: s
  } = e.vnode, r = Pr(e);
  pi(e, n, r, t), mi(e, s);
  const o = r ? Si(e, t) : void 0;
  return xt = !1, o
}

function Si(e, t) {
  const n = e.type;
  e.accessCache = Object.create(null), e.proxy = er(new Proxy(e.ctx, oi));
  const {
    setup: s
  } = n;
  if (s) {
    const r = e.setupContext = s.length > 1 ? ji(e) : null;
    et(e), tt();
    const o = Pe(s, e, 0, [e.props, r]);
    if (nt(), De(), Us(o)) {
      if (o.then(De, De), t) return o.then(i => {
        Ts(e, i, t)
      }).catch(i => {
        Gt(i, e, 0)
      });
      e.asyncDep = o
    } else Ts(e, o, t)
  } else Mr(e, t)
}

function Ts(e, t, n) {
  M(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : K(t) && (e.setupState = sr(t)), Mr(e, n)
}
let Is;

function Mr(e, t, n) {
  const s = e.type;
  if (!e.render) {
    if (!t && Is && !s.render) {
      const r = s.template || Vn(e).template;
      if (r) {
        const {
          isCustomElement: o,
          compilerOptions: i
        } = e.appContext.config, {
          delimiters: c,
          compilerOptions: f
        } = s, a = V(V({
          isCustomElement: o,
          delimiters: c
        }, i), f);
        s.render = Is(r, a)
      }
    }
    e.render = s.render || he
  }
  et(e), tt(), ii(e), nt(), De()
}

function Ri(e) {
  return e.attrsProxy || (e.attrsProxy = new Proxy(e.attrs, {
    get(t, n) {
      return re(e, "get", "$attrs"), t[n]
    }
  }))
}

function ji(e) {
  const t = n => {
    e.exposed = n || {}
  };
  return {
    get attrs() {
      return Ri(e)
    },
    slots: e.slots,
    emit: e.emit,
    expose: t
  }
}

function on(e) {
  if (e.exposed) return e.exposeProxy || (e.exposeProxy = new Proxy(sr(er(e.exposed)), {
    get(t, n) {
      if (n in t) return t[n];
      if (n in ft) return ft[n](e)
    },
    has(t, n) {
      return n in t || n in ft
    }
  }))
}

function Ni(e) {
  return M(e) && "__vccOpts" in e
}
const Ui = (e, t) => Fo(e, t, xt),
  Li = Symbol.for("v-scx"),
  $i = () => Ut(Li),
  Hi = "3.3.4",
  Ki = "http://www.w3.org/2000/svg",
  Le = typeof document < "u" ? document : null,
  Os = Le && Le.createElement("template"),
  Di = {
    insert: (e, t, n) => {
      t.insertBefore(e, n || null)
    },
    remove: e => {
      const t = e.parentNode;
      t && t.removeChild(e)
    },
    createElement: (e, t, n, s) => {
      const r = t ? Le.createElementNS(Ki, e) : Le.createElement(e, n ? {
        is: n
      } : void 0);
      return e === "select" && s && s.multiple != null && r.setAttribute("multiple", s.multiple), r
    },
    createText: e => Le.createTextNode(e),
    createComment: e => Le.createComment(e),
    setText: (e, t) => {
      e.nodeValue = t
    },
    setElementText: (e, t) => {
      e.textContent = t
    },
    parentNode: e => e.parentNode,
    nextSibling: e => e.nextSibling,
    querySelector: e => Le.querySelector(e),
    setScopeId(e, t) {
      e.setAttribute(t, "")
    },
    insertStaticContent(e, t, n, s, r, o) {
      const i = n ? n.previousSibling : t.lastChild;
      if (r && (r === o || r.nextSibling))
        for (; t.insertBefore(r.cloneNode(!0), n), !(r === o || !(r = r.nextSibling)););
      else {
        Os.innerHTML = s ? `<svg>${e}</svg>` : e;
        const c = Os.content;
        if (s) {
          const f = c.firstChild;
          for (; f.firstChild;) c.appendChild(f.firstChild);
          c.removeChild(f)
        }
        t.insertBefore(c, n)
      }
      return [i ? i.nextSibling : t.firstChild, n ? n.previousSibling : t.lastChild]
    }
  };

function Bi(e, t, n) {
  const s = e._vtc;
  s && (t = (t ? [t, ...s] : [...s]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t
}

function Wi(e, t, n) {
  const s = e.style,
    r = q(n);
  if (n && !r) {
    if (t && !q(t))
      for (const o in t) n[o] == null && An(s, o, "");
    for (const o in n) An(s, o, n[o])
  } else {
    const o = s.display;
    r ? t !== n && (s.cssText = n) : t && e.removeAttribute("style"), "_vod" in e && (s.display = o)
  }
}
const Ps = /\s*!important$/;

function An(e, t, n) {
  if (I(n)) n.forEach(s => An(e, t, s));
  else if (n == null && (n = ""), t.startsWith("--")) e.setProperty(t, n);
  else {
    const s = qi(e, t);
    Ps.test(n) ? e.setProperty(We(s), n.replace(Ps, ""), "important") : e[s] = n
  }
}
const Ms = ["Webkit", "Moz", "ms"],
  gn = {};

function qi(e, t) {
  const n = gn[t];
  if (n) return n;
  let s = Xe(t);
  if (s !== "filter" && s in e) return gn[t] = s;
  s = Hs(s);
  for (let r = 0; r < Ms.length; r++) {
    const o = Ms[r] + s;
    if (o in e) return gn[t] = o
  }
  return t
}
const As = "http://www.w3.org/1999/xlink";

function zi(e, t, n, s, r) {
  if (s && t.startsWith("xlink:")) n == null ? e.removeAttributeNS(As, t.slice(6, t.length)) : e.setAttributeNS(As, t, n);
  else {
    const o = Jr(t);
    n == null || o && !Ks(n) ? e.removeAttribute(t) : e.setAttribute(t, o ? "" : n)
  }
}

function Ji(e, t, n, s, r, o, i) {
  if (t === "innerHTML" || t === "textContent") {
    s && i(s, r, o), e[t] = n ?? "";
    return
  }
  const c = e.tagName;
  if (t === "value" && c !== "PROGRESS" && !c.includes("-")) {
    e._value = n;
    const a = c === "OPTION" ? e.getAttribute("value") : e.value,
      _ = n ?? "";
    a !== _ && (e.value = _), n == null && e.removeAttribute(t);
    return
  }
  let f = !1;
  if (n === "" || n == null) {
    const a = typeof e[t];
    a === "boolean" ? n = Ks(n) : n == null && a === "string" ? (n = "", f = !0) : a === "number" && (n = 0, f = !0)
  }
  try {
    e[t] = n
  } catch { }
  f && e.removeAttribute(t)
}

function $e(e, t, n, s) {
  e.addEventListener(t, n, s)
}

function Vi(e, t, n, s) {
  e.removeEventListener(t, n, s)
}

function ki(e, t, n, s, r = null) {
  const o = e._vei || (e._vei = {}),
    i = o[t];
  if (s && i) i.value = s;
  else {
    const [c, f] = Yi(t);
    if (s) {
      const a = o[t] = Zi(s, r);
      $e(e, c, a, f)
    } else i && (Vi(e, c, i, f), o[t] = void 0)
  }
}
const Fs = /(?:Once|Passive|Capture)$/;

function Yi(e) {
  let t;
  if (Fs.test(e)) {
    t = {};
    let s;
    for (; s = e.match(Fs);) e = e.slice(0, e.length - s[0].length), t[s[0].toLowerCase()] = !0
  }
  return [e[2] === ":" ? e.slice(3) : We(e.slice(2)), t]
}
let _n = 0;
const Qi = Promise.resolve(),
  Xi = () => _n || (Qi.then(() => _n = 0), _n = Date.now());

function Zi(e, t) {
  const n = s => {
    if (!s._vts) s._vts = Date.now();
    else if (s._vts <= n.attached) return;
    pe(Gi(s, n.value), t, 5, [s])
  };
  return n.value = e, n.attached = Xi(), n
}

function Gi(e, t) {
  if (I(t)) {
    const n = e.stopImmediatePropagation;
    return e.stopImmediatePropagation = () => {
      n.call(e), e._stopped = !0
    }, t.map(s => r => !r._stopped && s && s(r))
  } else return t
}
const Ss = /^on[a-z]/,
  el = (e, t, n, s, r = !1, o, i, c, f) => {
    t === "class" ? Bi(e, s, r) : t === "style" ? Wi(e, n, s) : Jt(t) ? Sn(t) || ki(e, t, n, s, i) : (t[0] === "." ? (t = t.slice(1), !0) : t[0] === "^" ? (t = t.slice(1), !1) : tl(e, t, s, r)) ? Ji(e, t, s, o, i, c, f) : (t === "true-value" ? e._trueValue = s : t === "false-value" && (e._falseValue = s), zi(e, t, s, r))
  };

function tl(e, t, n, s) {
  return s ? !!(t === "innerHTML" || t === "textContent" || t in e && Ss.test(t) && M(n)) : t === "spellcheck" || t === "draggable" || t === "translate" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA" || Ss.test(t) && q(n) ? !1 : t in e
}
const qt = e => {
  const t = e.props["onUpdate:modelValue"] || !1;
  return I(t) ? n => Rt(t, n) : t
};

function nl(e) {
  e.target.composing = !0
}

function Rs(e) {
  const t = e.target;
  t.composing && (t.composing = !1, t.dispatchEvent(new Event("input")))
}
const Ar = {
  created(e, {
    modifiers: {
      lazy: t,
      trim: n,
      number: s
    }
  }, r) {
    e._assign = qt(r);
    const o = s || r.props && r.props.type === "number";
    $e(e, t ? "change" : "input", i => {
      if (i.target.composing) return;
      let c = e.value;
      n && (c = c.trim()), o && (c = Ht(c)), e._assign(c)
    }), n && $e(e, "change", () => {
      e.value = e.value.trim()
    }), t || ($e(e, "compositionstart", nl), $e(e, "compositionend", Rs), $e(e, "change", Rs))
  },
  mounted(e, {
    value: t
  }) {
    e.value = t ?? ""
  },
  beforeUpdate(e, {
    value: t,
    modifiers: {
      lazy: n,
      trim: s,
      number: r
    }
  }, o) {
    if (e._assign = qt(o), e.composing || document.activeElement === e && e.type !== "range" && (n || s && e.value.trim() === t || (r || e.type === "number") && Ht(e.value) === t)) return;
    const i = t ?? "";
    e.value !== i && (e.value = i)
  }
},
  sl = {
    deep: !0,
    created(e, {
      value: t,
      modifiers: {
        number: n
      }
    }, s) {
      const r = Vt(t);
      $e(e, "change", () => {
        const o = Array.prototype.filter.call(e.options, i => i.selected).map(i => n ? Ht(zt(i)) : zt(i));
        e._assign(e.multiple ? r ? new Set(o) : o : o[0])
      }), e._assign = qt(s)
    },
    mounted(e, {
      value: t
    }) {
      js(e, t)
    },
    beforeUpdate(e, t, n) {
      e._assign = qt(n)
    },
    updated(e, {
      value: t
    }) {
      js(e, t)
    }
  };

function js(e, t) {
  const n = e.multiple;
  if (!(n && !I(t) && !Vt(t))) {
    for (let s = 0, r = e.options.length; s < r; s++) {
      const o = e.options[s],
        i = zt(o);
      if (n) I(t) ? o.selected = kr(t, i) > -1 : o.selected = t.has(i);
      else if (Qt(zt(o), t)) {
        e.selectedIndex !== s && (e.selectedIndex = s);
        return
      }
    } !n && e.selectedIndex !== -1 && (e.selectedIndex = -1)
  }
}

function zt(e) {
  return "_value" in e ? e._value : e.value
}
const rl = {
  esc: "escape",
  space: " ",
  up: "arrow-up",
  left: "arrow-left",
  right: "arrow-right",
  down: "arrow-down",
  delete: "backspace"
},
  Fr = (e, t) => n => {
    if (!("key" in n)) return;
    const s = We(n.key);
    if (t.some(r => r === s || rl[r] === s)) return e(n)
  },
  ol = V({
    patchProp: el
  }, Di);
let Ns;

function il() {
  return Ns || (Ns = xi(ol))
}
const ll = (...e) => {
  const t = il().createApp(...e),
    {
      mount: n
    } = t;
  return t.mount = s => {
    const r = cl(s);
    if (!r) return;
    const o = t._component;
    !M(o) && !o.render && !o.template && (o.template = r.innerHTML), r.innerHTML = "";
    const i = n(r, !1, r instanceof SVGElement);
    return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), i
  }, t
};

function cl(e) {
  return q(e) ? document.querySelector(e) : e
}
const fl = {
  class: "container"
},
  ul = {
    class: "title-card"
  },
  al = {
    class: "title"
  },
  dl = {
    __name: "HeaderCard",
    setup(e) {
      const t = pt("Kumonō AI");
      return (n, s) => (J(), ne("div", fl, [$("div", ul, [$("h1", al, Un(t.value), 1)])]))
    }
  };
const Xn = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [s, r] of t) n[s] = r;
  return n
},
  hl = {
    data() {
      return {
        selectedModel: "gpt-35-turbo",
        modelOptions: [{
          label: "GPT-3.5-turbo",
          value: "gpt-35-turbo"
        }, {
          label: "Image generation with DALL-E",
          value: "DALL-E"
        }]
      }
    },
    methods: {
      emitSelectedModel() {
        this.$emit("model-selected", this.selectedModel)
      }
    }
  },
  pl = {
    class: "model-list"
  },
  gl = $("label", null, "Choose Chat or Image generation:", -1),
  _l = $("br", null, null, -1),
  ml = ["value"];

function bl(e, t, n, s, r, o) {
  return J(), ne("div", pl, [gl, _l, Jn($("select", {
    "onUpdate:modelValue": t[0] || (t[0] = i => r.selectedModel = i),
    onChange: t[1] || (t[1] = (...i) => o.emitSelectedModel && o.emitSelectedModel(...i))
  }, [(J(!0), ne(fe, null, mr(r.modelOptions, i => (J(), ne("option", {
    key: i.value,
    value: i.value
  }, Un(i.label), 9, ml))), 128))], 544), [
    [sl, r.selectedModel]
  ])])
}
const xl = Xn(hl, [
  ["render", bl]
]),
  yl = "ai-bot-logo.jpg",
  vl = "human-logo.jpg";
const wl = {
  class: "chat-container"
},
  El = {
    class: "msg-content"
  },
  Cl = {
    key: 0,
    src: yl
  },
  Tl = {
    key: 1,
    src: vl
  },
  Il = {
    class: "msg"
  },
  Ol = {
    class: "chat-input"
  },
  Pl = ["onKeyup"],
  Ml = {
    __name: "ChatInterface",
    setup(e) {
      const t = pt(""),
        n = pt(null),
        s = Zt([]);

      function r() {
        if (t.value === "") return alert("Cannot send blank message");
        o();
        const i = {
          role: "user",
          message: t.value
        };
        s.push(i), t.value = "", o();
        const c = {
          role: "assistant",
          message: "Typing..."
        };
        s.push(c);
        const f = {
          role: "user",
          message: i.message
        };
        try {
          fetch("https://chatgpt-clone-py-itssanjayhere-pmme.vercel.app/process_request", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(f)
          }).then(a => a.json()).then(a => {
            const _ = {
              role: "assistant",
              message: a.content
            },
              y = s.indexOf(c);
            y !== -1 && s.splice(y, 1, _), o(), localStorage.setItem("messages", JSON.stringify(s))
          })
        } catch (a) {
          console.log(a)
        }
      }
      jt(s, () => {
        o()
      });

      function o() {
        n.value && (n.value.scrollTop = n.value.scrollHeight)
      }
      return gr(() => {
        const i = JSON.parse(localStorage.getItem("messages")) || [];
        s.push(...i), o()
      }), (i, c) => (J(), ne("div", wl, [$("div", {
        class: "chat-messages",
        ref_key: "chatContainer",
        ref: n
      }, [(J(!0), ne(fe, null, mr(s, f => (J(), ne("div", {
        key: f.id
      }, [$("div", {
        class: Yt(["chat-bubble", f.role])
      }, [$("div", El, [f.role === "assistant" ? (J(), ne("img", Cl)) : bt("", !0), f.role === "user" ? (J(), ne("img", Tl)) : bt("", !0), $("p", Il, Un(f.message), 1)])], 2)]))), 128))], 512), $("div", Ol, [Jn($("input", {
        type: "text",
        "onUpdate:modelValue": c[0] || (c[0] = f => t.value = f),
        id: "input-box",
        placeholder: "Send a message",
        class: "message-input",
        onKeyup: Fr(r, ["enter"])
      }, null, 40, Pl), [
        [Ar, t.value]
      ]), $("button", {
        onClick: r,
        class: "send-button"
      }, "Send")])]))
    }
  };
const Al = {
  data() {
    return {
      examplePrompt: "An Impressionist oil painting of sunflowers in a purple vase...",
      isImageGenerated: !1,
      startGenerate: !1,
      outputImgURL: "",
      userPromptText: ""
    }
  },
  methods: {
    handleUserSubmit() {
      if (this.userPromptText === "") return alert("Please Enter Some Text to Generate Image");
      const e = {
        role: "user",
        content: this.userPromptText
      };
      this.startGenerate = !0;
      try {
        fetch("https://chatgpt-clone-py-itssanjayhere-pmme.vercel.app/generate_image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(e)
        }).then(t => t.json()).then(t => {
          this.isImageGenerated = !0, this.outputImgURL = t.url, console.log(t)
        })
      } catch (t) {
        console.error(t)
      }
      this.userPromptText = ""
    }
  }
},
  Sr = e => (fr("data-v-ce3dbb2a"), e = e(), ur(), e),
  Fl = {
    class: "container-img"
  },
  Sl = Sr(() => $("p", {
    class: "intro"
  }, " Start with a detailed description ", -1)),
  Rl = {
    class: "prompt-card"
  },
  jl = ["placeholder"],
  Nl = {
    key: 0,
    class: "gen-info"
  },
  Ul = Sr(() => $("p", null, " Generating Image ... Please Wait ", -1)),
  Ll = [Ul],
  $l = {
    key: 1,
    class: "img-gen-output"
  },
  Hl = {
    class: "img-container"
  },
  Kl = ["href"],
  Dl = ["src", "alt"],
  Bl = {
    key: 2,
    class: "hideBlock"
  };

function Wl(e, t, n, s, r, o) {
  return J(), ne("div", Fl, [Sl, $("div", Rl, [Jn($("input", {
    type: "text",
    placeholder: r.examplePrompt,
    name: "user-prompt",
    class: "prompt-user-text",
    "onUpdate:modelValue": t[0] || (t[0] = i => r.userPromptText = i),
    onKeyup: t[1] || (t[1] = Fr((...i) => o.handleUserSubmit && o.handleUserSubmit(...i), ["enter"]))
  }, null, 40, jl), [
    [Ar, r.userPromptText]
  ]), $("button", {
    type: "submit",
    name: "generate-image",
    class: "submit-btn",
    onClick: t[2] || (t[2] = (...i) => o.handleUserSubmit && o.handleUserSubmit(...i))
  }, "Generate")]), r.startGenerate && r.outputImgURL === "" ? (J(), ne("div", Nl, Ll)) : bt("", !0), r.isImageGenerated ? (J(), ne("div", $l, [$("div", Hl, [$("a", {
    href: r.outputImgURL,
    download: ""
  }, [$("img", {
    src: r.outputImgURL,
    alt: r.userPromptText
  }, null, 8, Dl)], 8, Kl)])])) : (J(), ne("div", Bl))])
}
const ql = Xn(Al, [
  ["render", Wl],
  ["__scopeId", "data-v-ce3dbb2a"]
]);
const zl = e => (fr("data-v-6abc5e40"), e = e(), ur(), e),
Xl = {
  class: "App"
},
Zl = {
  __name: "App",
  setup(e) {
    const t = pt("gpt-35-turbo");
    
    function n(s) {
      t.value = s
    }
    return (s, r) => (J(), ne("div", Xl, [ie(dl), ie(xl, {
      onModelSelected: n
    }), t.value === "gpt-35-turbo" ? (J(), Pn(Ml, {
      key: 0
    })) : bt("", !0), t.value === "DALL-E" ? (J(), Pn(ql, {
      key: 1
    })) : bt("", !0)]))
  }
};
ll(Zl).mount("#app");