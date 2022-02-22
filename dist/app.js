// node_modules/svelte/internal/index.mjs
function noop() {
}
function run(fn) {
  return fn();
}
function blank_object() {
  return Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function is_function(thing) {
  return typeof thing === "function";
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
function is_empty(obj) {
  return Object.keys(obj).length === 0;
}
var tasks = new Set();
var is_hydrating = false;
function start_hydrating() {
  is_hydrating = true;
}
function end_hydrating() {
  is_hydrating = false;
}
function append(target, node) {
  target.appendChild(node);
}
function append_styles(target, style_sheet_id, styles) {
  const append_styles_to = get_root_for_style(target);
  if (!append_styles_to.getElementById(style_sheet_id)) {
    const style = element("style");
    style.id = style_sheet_id;
    style.textContent = styles;
    append_stylesheet(append_styles_to, style);
  }
}
function get_root_for_style(node) {
  if (!node)
    return document;
  const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
  if (root && root.host) {
    return root;
  }
  return node.ownerDocument;
}
function append_stylesheet(node, style) {
  append(node.head || node, style);
}
function insert(target, node, anchor) {
  target.insertBefore(node, anchor || null);
}
function detach(node) {
  node.parentNode.removeChild(node);
}
function element(name) {
  return document.createElement(name);
}
function text(data) {
  return document.createTextNode(data);
}
function space() {
  return text(" ");
}
function attr(node, attribute, value) {
  if (value == null)
    node.removeAttribute(attribute);
  else if (node.getAttribute(attribute) !== value)
    node.setAttribute(attribute, value);
}
function children(element2) {
  return Array.from(element2.childNodes);
}
function set_data(text2, data) {
  data = "" + data;
  if (text2.wholeText !== data)
    text2.data = data;
}
function set_style(node, key, value, important) {
  if (value === null) {
    node.style.removeProperty(key);
  } else {
    node.style.setProperty(key, value, important ? "important" : "");
  }
}
var managed_styles = new Map();
var current_component;
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component)
    throw new Error("Function called outside component initialization");
  return current_component;
}
function onMount(fn) {
  get_current_component().$$.on_mount.push(fn);
}
var dirty_components = [];
var binding_callbacks = [];
var render_callbacks = [];
var flush_callbacks = [];
var resolved_promise = Promise.resolve();
var update_scheduled = false;
function schedule_update() {
  if (!update_scheduled) {
    update_scheduled = true;
    resolved_promise.then(flush);
  }
}
function add_render_callback(fn) {
  render_callbacks.push(fn);
}
var seen_callbacks = new Set();
var flushidx = 0;
function flush() {
  const saved_component = current_component;
  do {
    while (flushidx < dirty_components.length) {
      const component = dirty_components[flushidx];
      flushidx++;
      set_current_component(component);
      update(component.$$);
    }
    set_current_component(null);
    dirty_components.length = 0;
    flushidx = 0;
    while (binding_callbacks.length)
      binding_callbacks.pop()();
    for (let i = 0; i < render_callbacks.length; i += 1) {
      const callback = render_callbacks[i];
      if (!seen_callbacks.has(callback)) {
        seen_callbacks.add(callback);
        callback();
      }
    }
    render_callbacks.length = 0;
  } while (dirty_components.length);
  while (flush_callbacks.length) {
    flush_callbacks.pop()();
  }
  update_scheduled = false;
  seen_callbacks.clear();
  set_current_component(saved_component);
}
function update($$) {
  if ($$.fragment !== null) {
    $$.update();
    run_all($$.before_update);
    const dirty = $$.dirty;
    $$.dirty = [-1];
    $$.fragment && $$.fragment.p($$.ctx, dirty);
    $$.after_update.forEach(add_render_callback);
  }
}
var outroing = new Set();
var outros;
function transition_in(block, local) {
  if (block && block.i) {
    outroing.delete(block);
    block.i(local);
  }
}
function transition_out(block, local, detach2, callback) {
  if (block && block.o) {
    if (outroing.has(block))
      return;
    outroing.add(block);
    outros.c.push(() => {
      outroing.delete(block);
      if (callback) {
        if (detach2)
          block.d(1);
        callback();
      }
    });
    block.o(local);
  }
}
var globals = typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : global;
var boolean_attributes = new Set([
  "allowfullscreen",
  "allowpaymentrequest",
  "async",
  "autofocus",
  "autoplay",
  "checked",
  "controls",
  "default",
  "defer",
  "disabled",
  "formnovalidate",
  "hidden",
  "ismap",
  "loop",
  "multiple",
  "muted",
  "nomodule",
  "novalidate",
  "open",
  "playsinline",
  "readonly",
  "required",
  "reversed",
  "selected"
]);
function create_component(block) {
  block && block.c();
}
function mount_component(component, target, anchor, customElement) {
  const {fragment, on_mount, on_destroy, after_update} = component.$$;
  fragment && fragment.m(target, anchor);
  if (!customElement) {
    add_render_callback(() => {
      const new_on_destroy = on_mount.map(run).filter(is_function);
      if (on_destroy) {
        on_destroy.push(...new_on_destroy);
      } else {
        run_all(new_on_destroy);
      }
      component.$$.on_mount = [];
    });
  }
  after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
  const $$ = component.$$;
  if ($$.fragment !== null) {
    run_all($$.on_destroy);
    $$.fragment && $$.fragment.d(detaching);
    $$.on_destroy = $$.fragment = null;
    $$.ctx = [];
  }
}
function make_dirty(component, i) {
  if (component.$$.dirty[0] === -1) {
    dirty_components.push(component);
    schedule_update();
    component.$$.dirty.fill(0);
  }
  component.$$.dirty[i / 31 | 0] |= 1 << i % 31;
}
function init(component, options, instance3, create_fragment4, not_equal, props, append_styles2, dirty = [-1]) {
  const parent_component = current_component;
  set_current_component(component);
  const $$ = component.$$ = {
    fragment: null,
    ctx: null,
    props,
    update: noop,
    not_equal,
    bound: blank_object(),
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
    callbacks: blank_object(),
    dirty,
    skip_bound: false,
    root: options.target || parent_component.$$.root
  };
  append_styles2 && append_styles2($$.root);
  let ready = false;
  $$.ctx = instance3 ? instance3(component, options.props || {}, (i, ret, ...rest) => {
    const value = rest.length ? rest[0] : ret;
    if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
      if (!$$.skip_bound && $$.bound[i])
        $$.bound[i](value);
      if (ready)
        make_dirty(component, i);
    }
    return ret;
  }) : [];
  $$.update();
  ready = true;
  run_all($$.before_update);
  $$.fragment = create_fragment4 ? create_fragment4($$.ctx) : false;
  if (options.target) {
    if (options.hydrate) {
      start_hydrating();
      const nodes = children(options.target);
      $$.fragment && $$.fragment.l(nodes);
      nodes.forEach(detach);
    } else {
      $$.fragment && $$.fragment.c();
    }
    if (options.intro)
      transition_in(component.$$.fragment);
    mount_component(component, options.target, options.anchor, options.customElement);
    end_hydrating();
    flush();
  }
  set_current_component(parent_component);
}
var SvelteElement;
if (typeof HTMLElement === "function") {
  SvelteElement = class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({mode: "open"});
    }
    connectedCallback() {
      const {on_mount} = this.$$;
      this.$$.on_disconnect = on_mount.map(run).filter(is_function);
      for (const key in this.$$.slotted) {
        this.appendChild(this.$$.slotted[key]);
      }
    }
    attributeChangedCallback(attr2, _oldValue, newValue) {
      this[attr2] = newValue;
    }
    disconnectedCallback() {
      run_all(this.$$.on_disconnect);
    }
    $destroy() {
      destroy_component(this, 1);
      this.$destroy = noop;
    }
    $on(type, callback) {
      const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
      callbacks.push(callback);
      return () => {
        const index = callbacks.indexOf(callback);
        if (index !== -1)
          callbacks.splice(index, 1);
      };
    }
    $set($$props) {
      if (this.$$set && !is_empty($$props)) {
        this.$$.skip_bound = true;
        this.$$set($$props);
        this.$$.skip_bound = false;
      }
    }
  };
}
var SvelteComponent = class {
  $destroy() {
    destroy_component(this, 1);
    this.$destroy = noop;
  }
  $on(type, callback) {
    const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
    callbacks.push(callback);
    return () => {
      const index = callbacks.indexOf(callback);
      if (index !== -1)
        callbacks.splice(index, 1);
    };
  }
  $set($$props) {
    if (this.$$set && !is_empty($$props)) {
      this.$$.skip_bound = true;
      this.$$set($$props);
      this.$$.skip_bound = false;
    }
  }
};

// src/chart.svelte
function add_css(target) {
  append_styles(target, "svelte-1hkzpio", ".tg.svelte-1hkzpio.svelte-1hkzpio{border-collapse:collapse;border-spacing:0}.tg.svelte-1hkzpio td.svelte-1hkzpio{border-color:black;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;overflow:hidden;padding:10px 5px;word-break:normal}.tg.svelte-1hkzpio th.svelte-1hkzpio{border-color:black;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;font-weight:normal;overflow:hidden;padding:10px 5px;word-break:normal}.tg.svelte-1hkzpio .tg-0pky.svelte-1hkzpio{border-color:inherit;text-align:left;vertical-align:top}");
}
function create_fragment(ctx) {
  let table;
  let thead;
  let tr0;
  let th0;
  let t0;
  let t1;
  let t2;
  let t3;
  let th1;
  let t5;
  let tbody;
  let tr1;
  let td0;
  let t6_value = (ctx[1][0] == void 0 ? "" : ctx[1][0]) + "";
  let t6;
  let t7;
  let td1;
  let t8_value = (ctx[2][0] == void 0 ? "" : ctx[2][0]) + "";
  let t8;
  let t9;
  let tr2;
  let td2;
  let t10_value = (ctx[1][1] == void 0 ? "" : ctx[1][1]) + "";
  let t10;
  let t11;
  let td3;
  let t12_value = (ctx[2][1] == void 0 ? "" : ctx[2][1]) + "";
  let t12;
  let t13;
  let tr3;
  let td4;
  let t14_value = (ctx[1][2] == void 0 ? "" : ctx[1][2]) + "";
  let t14;
  let t15;
  let td5;
  let t16_value = (ctx[2][2] == void 0 ? "" : ctx[2][2]) + "";
  let t16;
  let t17;
  let tr4;
  let td6;
  let t18_value = (ctx[1][3] == void 0 ? "" : ctx[1][3]) + "";
  let t18;
  let t19;
  let td7;
  let t20_value = (ctx[2][3] == void 0 ? "" : ctx[2][3]) + "";
  let t20;
  return {
    c() {
      table = element("table");
      thead = element("thead");
      tr0 = element("tr");
      th0 = element("th");
      t0 = text("Player ");
      t1 = text(ctx[0]);
      t2 = text(" Answers");
      t3 = space();
      th1 = element("th");
      th1.textContent = "Points";
      t5 = space();
      tbody = element("tbody");
      tr1 = element("tr");
      td0 = element("td");
      t6 = text(t6_value);
      t7 = space();
      td1 = element("td");
      t8 = text(t8_value);
      t9 = space();
      tr2 = element("tr");
      td2 = element("td");
      t10 = text(t10_value);
      t11 = space();
      td3 = element("td");
      t12 = text(t12_value);
      t13 = space();
      tr3 = element("tr");
      td4 = element("td");
      t14 = text(t14_value);
      t15 = space();
      td5 = element("td");
      t16 = text(t16_value);
      t17 = space();
      tr4 = element("tr");
      td6 = element("td");
      t18 = text(t18_value);
      t19 = space();
      td7 = element("td");
      t20 = text(t20_value);
      attr(th0, "class", "tg-0pky svelte-1hkzpio");
      attr(th1, "class", "tg-0pky svelte-1hkzpio");
      attr(td0, "class", "tg-0pky svelte-1hkzpio");
      attr(td1, "class", "tg-0pky svelte-1hkzpio");
      attr(td2, "class", "tg-0pky svelte-1hkzpio");
      attr(td3, "class", "tg-0pky svelte-1hkzpio");
      attr(td4, "class", "tg-0pky svelte-1hkzpio");
      attr(td5, "class", "tg-0pky svelte-1hkzpio");
      attr(td6, "class", "tg-0pky svelte-1hkzpio");
      attr(td7, "class", "tg-0pky svelte-1hkzpio");
      attr(table, "class", "tg svelte-1hkzpio");
      set_style(table, "margin", "0");
      set_style(table, "padding", "0");
    },
    m(target, anchor) {
      insert(target, table, anchor);
      append(table, thead);
      append(thead, tr0);
      append(tr0, th0);
      append(th0, t0);
      append(th0, t1);
      append(th0, t2);
      append(tr0, t3);
      append(tr0, th1);
      append(table, t5);
      append(table, tbody);
      append(tbody, tr1);
      append(tr1, td0);
      append(td0, t6);
      append(tr1, t7);
      append(tr1, td1);
      append(td1, t8);
      append(tbody, t9);
      append(tbody, tr2);
      append(tr2, td2);
      append(td2, t10);
      append(tr2, t11);
      append(tr2, td3);
      append(td3, t12);
      append(tbody, t13);
      append(tbody, tr3);
      append(tr3, td4);
      append(td4, t14);
      append(tr3, t15);
      append(tr3, td5);
      append(td5, t16);
      append(tbody, t17);
      append(tbody, tr4);
      append(tr4, td6);
      append(td6, t18);
      append(tr4, t19);
      append(tr4, td7);
      append(td7, t20);
    },
    p(ctx2, [dirty]) {
      if (dirty & 1)
        set_data(t1, ctx2[0]);
      if (dirty & 2 && t6_value !== (t6_value = (ctx2[1][0] == void 0 ? "" : ctx2[1][0]) + ""))
        set_data(t6, t6_value);
      if (dirty & 4 && t8_value !== (t8_value = (ctx2[2][0] == void 0 ? "" : ctx2[2][0]) + ""))
        set_data(t8, t8_value);
      if (dirty & 2 && t10_value !== (t10_value = (ctx2[1][1] == void 0 ? "" : ctx2[1][1]) + ""))
        set_data(t10, t10_value);
      if (dirty & 4 && t12_value !== (t12_value = (ctx2[2][1] == void 0 ? "" : ctx2[2][1]) + ""))
        set_data(t12, t12_value);
      if (dirty & 2 && t14_value !== (t14_value = (ctx2[1][2] == void 0 ? "" : ctx2[1][2]) + ""))
        set_data(t14, t14_value);
      if (dirty & 4 && t16_value !== (t16_value = (ctx2[2][2] == void 0 ? "" : ctx2[2][2]) + ""))
        set_data(t16, t16_value);
      if (dirty & 2 && t18_value !== (t18_value = (ctx2[1][3] == void 0 ? "" : ctx2[1][3]) + ""))
        set_data(t18, t18_value);
      if (dirty & 4 && t20_value !== (t20_value = (ctx2[2][3] == void 0 ? "" : ctx2[2][3]) + ""))
        set_data(t20, t20_value);
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(table);
    }
  };
}
function instance($$self, $$props, $$invalidate) {
  let {playernum} = $$props;
  let chartvals = [];
  let pointvals = [];
  function addAnswer(answer) {
    if (chartvals.length == 4)
      $$invalidate(1, chartvals = []);
    $$invalidate(1, chartvals = [...chartvals, answer]);
  }
  function addPoint(point) {
    if (pointvals.length == 4)
      $$invalidate(2, pointvals = []);
    $$invalidate(2, pointvals = [...pointvals, point]);
  }
  $$self.$$set = ($$props2) => {
    if ("playernum" in $$props2)
      $$invalidate(0, playernum = $$props2.playernum);
  };
  return [playernum, chartvals, pointvals, addAnswer, addPoint];
}
var Chart = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance, create_fragment, safe_not_equal, {playernum: 0, addAnswer: 3, addPoint: 4}, add_css);
  }
  get addAnswer() {
    return this.$$.ctx[3];
  }
  get addPoint() {
    return this.$$.ctx[4];
  }
};
var chart_default = Chart;

// src/fastmoney.svelte
function add_css2(target) {
  append_styles(target, "svelte-egghtq", ".container.svelte-egghtq{display:flex;margin:0 auto;width:fit-content}");
}
function create_fragment2(ctx) {
  let div1;
  let chart0;
  let t0;
  let div0;
  let t1;
  let chart1_1;
  let current;
  let chart0_props = {playernum: "1"};
  chart0 = new chart_default({props: chart0_props});
  ctx[2](chart0);
  let chart1_1_props = {playernum: "2"};
  chart1_1 = new chart_default({props: chart1_1_props});
  ctx[3](chart1_1);
  return {
    c() {
      div1 = element("div");
      create_component(chart0.$$.fragment);
      t0 = space();
      div0 = element("div");
      t1 = space();
      create_component(chart1_1.$$.fragment);
      set_style(div0, "min-width", "25px");
      attr(div1, "class", "container svelte-egghtq");
    },
    m(target, anchor) {
      insert(target, div1, anchor);
      mount_component(chart0, div1, null);
      append(div1, t0);
      append(div1, div0);
      append(div1, t1);
      mount_component(chart1_1, div1, null);
      current = true;
    },
    p(ctx2, [dirty]) {
      const chart0_changes = {};
      chart0.$set(chart0_changes);
      const chart1_1_changes = {};
      chart1_1.$set(chart1_1_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(chart0.$$.fragment, local);
      transition_in(chart1_1.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(chart0.$$.fragment, local);
      transition_out(chart1_1.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div1);
      ctx[2](null);
      destroy_component(chart0);
      ctx[3](null);
      destroy_component(chart1_1);
    }
  };
}
function instance2($$self, $$props, $$invalidate) {
  let chart1;
  let chart2;
  onMount(async () => {
    chart1.addAnswer("Hello");
    chart1.addPoint(51);
  });
  function chart0_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      chart1 = $$value;
      $$invalidate(0, chart1);
    });
  }
  function chart1_1_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      chart2 = $$value;
      $$invalidate(1, chart2);
    });
  }
  return [chart1, chart2, chart0_binding, chart1_1_binding];
}
var Fastmoney = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance2, create_fragment2, safe_not_equal, {}, add_css2);
  }
};
var fastmoney_default = Fastmoney;

// src/app.svelte
function add_css3(target) {
  append_styles(target, "svelte-rtqa4o", "body{margin:0}");
}
function create_fragment3(ctx) {
  let marquee;
  let t1;
  let fastmoney;
  let current;
  fastmoney = new fastmoney_default({});
  return {
    c() {
      marquee = element("marquee");
      marquee.textContent = "FAST MONEY";
      t1 = space();
      create_component(fastmoney.$$.fragment);
      attr(marquee, "loop", "10");
    },
    m(target, anchor) {
      insert(target, marquee, anchor);
      insert(target, t1, anchor);
      mount_component(fastmoney, target, anchor);
      current = true;
    },
    p: noop,
    i(local) {
      if (current)
        return;
      transition_in(fastmoney.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(fastmoney.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(marquee);
      if (detaching)
        detach(t1);
      destroy_component(fastmoney, detaching);
    }
  };
}
var App = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, null, create_fragment3, safe_not_equal, {}, add_css3);
  }
};
var app_default = App;

// src/app.js
new app_default({
  target: document.body
});
