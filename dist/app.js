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
function destroy_each(iterations, detaching) {
  for (let i = 0; i < iterations.length; i += 1) {
    if (iterations[i])
      iterations[i].d(detaching);
  }
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
function listen(node, event, handler, options) {
  node.addEventListener(event, handler, options);
  return () => node.removeEventListener(event, handler, options);
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
function set_input_value(input, value) {
  input.value = value == null ? "" : value;
}
function set_style(node, key, value, important) {
  if (value === null) {
    node.style.removeProperty(key);
  } else {
    node.style.setProperty(key, value, important ? "important" : "");
  }
}
function select_option(select, value) {
  for (let i = 0; i < select.options.length; i += 1) {
    const option = select.options[i];
    if (option.__value === value) {
      option.selected = true;
      return;
    }
  }
  select.selectedIndex = -1;
}
function select_value(select) {
  const selected_option = select.querySelector(":checked") || select.options[0];
  return selected_option && selected_option.__value;
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
function init(component, options, instance4, create_fragment5, not_equal, props, append_styles2, dirty = [-1]) {
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
  $$.ctx = instance4 ? instance4(component, options.props || {}, (i, ret, ...rest) => {
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
  $$.fragment = create_fragment5 ? create_fragment5($$.ctx) : false;
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
  append_styles(target, "svelte-fuylwe", ".tg.svelte-fuylwe.svelte-fuylwe{border-collapse:collapse;border-spacing:0;background-color:black;color:white}.tg.svelte-fuylwe td.svelte-fuylwe{border-color:black;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;overflow:hidden;padding:10px 5px;word-break:normal}.tg.svelte-fuylwe th.svelte-fuylwe{border-color:black;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;font-weight:normal;overflow:hidden;padding:10px 5px;word-break:normal;width:auto}.tg.svelte-fuylwe .tg-0pky.svelte-fuylwe{border-color:inherit;text-align:left;vertical-align:top;cursor:pointer}");
}
function get_each_context(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[16] = list[i];
  child_ctx[18] = i;
  return child_ctx;
}
function create_each_block(ctx) {
  let tr;
  let td0;
  let span0;
  let t0_value = (ctx[4][ctx[18]] ? hiddentext : ctx[2][ctx[18]] == void 0 ? empty : ctx[2][ctx[18]]) + "";
  let t0;
  let t1;
  let td1;
  let span1;
  let t2_value = (ctx[4][Number(ctx[1]) + ctx[18]] ? hiddentext : ctx[3][ctx[18]] == void 0 ? emptypoints : ctx[3][ctx[18]]) + "";
  let t2;
  let mounted;
  let dispose;
  function click_handler() {
    return ctx[13](ctx[18]);
  }
  function click_handler_1() {
    return ctx[14](ctx[18]);
  }
  return {
    c() {
      tr = element("tr");
      td0 = element("td");
      span0 = element("span");
      t0 = text(t0_value);
      t1 = space();
      td1 = element("td");
      span1 = element("span");
      t2 = text(t2_value);
      attr(td0, "class", "tg-0pky svelte-fuylwe");
      attr(td1, "class", "tg-0pky svelte-fuylwe");
    },
    m(target, anchor) {
      insert(target, tr, anchor);
      append(tr, td0);
      append(td0, span0);
      append(span0, t0);
      append(tr, t1);
      append(tr, td1);
      append(td1, span1);
      append(span1, t2);
      if (!mounted) {
        dispose = [
          listen(td0, "click", click_handler),
          listen(td1, "click", click_handler_1)
        ];
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty & 20 && t0_value !== (t0_value = (ctx[4][ctx[18]] ? hiddentext : ctx[2][ctx[18]] == void 0 ? empty : ctx[2][ctx[18]]) + ""))
        set_data(t0, t0_value);
      if (dirty & 26 && t2_value !== (t2_value = (ctx[4][Number(ctx[1]) + ctx[18]] ? hiddentext : ctx[3][ctx[18]] == void 0 ? emptypoints : ctx[3][ctx[18]]) + ""))
        set_data(t2, t2_value);
    },
    d(detaching) {
      if (detaching)
        detach(tr);
      mounted = false;
      run_all(dispose);
    }
  };
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
  let t6;
  let tr1;
  let td0;
  let t8;
  let td1;
  let span1;
  let t9_value = (ctx[4][-1] ? hiddentext : ctx[5]) + "";
  let t9;
  let mounted;
  let dispose;
  let each_value = {length: ctx[1]};
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
  }
  return {
    c() {
      table = element("table");
      thead = element("thead");
      tr0 = element("tr");
      th0 = element("th");
      t0 = text("Group ");
      t1 = text(ctx[0]);
      t2 = text(" Answers");
      t3 = space();
      th1 = element("th");
      th1.textContent = "Points";
      t5 = space();
      tbody = element("tbody");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      t6 = space();
      tr1 = element("tr");
      td0 = element("td");
      td0.innerHTML = `<span>Total Points</span>`;
      t8 = space();
      td1 = element("td");
      span1 = element("span");
      t9 = text(t9_value);
      attr(th0, "class", "tg-0pky svelte-fuylwe");
      attr(th1, "class", "tg-0pky svelte-fuylwe");
      attr(td0, "class", "tg-0pky svelte-fuylwe");
      attr(td1, "class", "tg-0pky svelte-fuylwe");
      set_style(tr1, "border-color", "yellow");
      set_style(tr1, "border-width", "thick");
      attr(table, "class", "tg svelte-fuylwe");
      set_style(table, "margin", "0");
      set_style(table, "padding", "0");
      set_style(table, "width", "45%");
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
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].m(tbody, null);
      }
      append(tbody, t6);
      append(tbody, tr1);
      append(tr1, td0);
      append(tr1, t8);
      append(tr1, td1);
      append(td1, span1);
      append(span1, t9);
      if (!mounted) {
        dispose = listen(td1, "click", ctx[15]);
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (dirty & 1)
        set_data(t1, ctx2[0]);
      if (dirty & 94) {
        each_value = {length: ctx2[1]};
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
          } else {
            each_blocks[i] = create_each_block(child_ctx);
            each_blocks[i].c();
            each_blocks[i].m(tbody, t6);
          }
        }
        for (; i < each_blocks.length; i += 1) {
          each_blocks[i].d(1);
        }
        each_blocks.length = each_value.length;
      }
      if (dirty & 48 && t9_value !== (t9_value = (ctx2[4][-1] ? hiddentext : ctx2[5]) + ""))
        set_data(t9, t9_value);
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(table);
      destroy_each(each_blocks, detaching);
      mounted = false;
      dispose();
    }
  };
}
var empty = "________";
var emptypoints = "__";
var hiddentext = "-";
function instance($$self, $$props, $$invalidate) {
  let {playernum} = $$props;
  let {numrows} = $$props;
  let chartvals = [];
  let pointvals = [];
  let hidden = Array(numrows * 2);
  let totalpoints = 0;
  function addAnswer(answer) {
    if (chartvals.length == numrows)
      $$invalidate(2, chartvals = []);
    $$invalidate(2, chartvals = [...chartvals, answer]);
  }
  function addPoint(point) {
    if (pointvals.length == numrows)
      $$invalidate(3, pointvals = []);
    $$invalidate(3, pointvals = [...pointvals, point]);
    $$invalidate(5, totalpoints = 0);
    pointvals.forEach((val) => {
      $$invalidate(5, totalpoints += val);
    });
  }
  function hideAll() {
    for (var i = 0; i < numrows * 2 + 1; i++) {
      $$invalidate(4, hidden[i] = true, hidden);
    }
    $$invalidate(4, hidden[-1] = true, hidden);
  }
  function showAll() {
    for (var i = 0; i < numrows * 2 + 1; i++) {
      $$invalidate(4, hidden[i] = false, hidden);
    }
    $$invalidate(4, hidden[-1] = false, hidden);
  }
  function getCurrentNum() {
    return pointvals.length;
  }
  function unhide(hiddennum) {
    console.log(hiddennum);
    $$invalidate(4, hidden[hiddennum] = false, hidden);
  }
  function deleteLastAnswer() {
    $$invalidate(2, chartvals = chartvals.slice(0, chartvals.length - 1));
  }
  const click_handler = (i) => unhide(i);
  const click_handler_1 = (i) => unhide(Number(numrows) + i);
  const click_handler_2 = () => unhide(-1);
  $$self.$$set = ($$props2) => {
    if ("playernum" in $$props2)
      $$invalidate(0, playernum = $$props2.playernum);
    if ("numrows" in $$props2)
      $$invalidate(1, numrows = $$props2.numrows);
  };
  return [
    playernum,
    numrows,
    chartvals,
    pointvals,
    hidden,
    totalpoints,
    unhide,
    addAnswer,
    addPoint,
    hideAll,
    showAll,
    getCurrentNum,
    deleteLastAnswer,
    click_handler,
    click_handler_1,
    click_handler_2
  ];
}
var Chart = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance, create_fragment, safe_not_equal, {
      playernum: 0,
      numrows: 1,
      addAnswer: 7,
      addPoint: 8,
      hideAll: 9,
      showAll: 10,
      getCurrentNum: 11,
      deleteLastAnswer: 12
    }, add_css);
  }
  get addAnswer() {
    return this.$$.ctx[7];
  }
  get addPoint() {
    return this.$$.ctx[8];
  }
  get hideAll() {
    return this.$$.ctx[9];
  }
  get showAll() {
    return this.$$.ctx[10];
  }
  get getCurrentNum() {
    return this.$$.ctx[11];
  }
  get deleteLastAnswer() {
    return this.$$.ctx[12];
  }
};
var chart_default = Chart;

// src/timer.svelte
function add_css2(target) {
  append_styles(target, "svelte-1bbb752", "#timer.svelte-1bbb752{background-color:black;color:white}p.svelte-1bbb752{background-color:black;border-radius:5px;padding-left:10px;padding-right:10px}");
}
function create_fragment2(ctx) {
  let div;
  let button0;
  let t0_value = (ctx[1] ? "Stop" : "Start") + "";
  let t0;
  let t1;
  let button1;
  let t3;
  let button2;
  let t5;
  let p;
  let t6;
  let mounted;
  let dispose;
  return {
    c() {
      div = element("div");
      button0 = element("button");
      t0 = text(t0_value);
      t1 = space();
      button1 = element("button");
      button1.textContent = "Reset";
      t3 = space();
      button2 = element("button");
      button2.textContent = "Add 1 Minute";
      t5 = space();
      p = element("p");
      t6 = text(ctx[0]);
      set_style(p, "float", "right");
      set_style(p, "font-size", "28pt");
      set_style(p, "margin", "0");
      set_style(p, "color", "red");
      attr(p, "class", "svelte-1bbb752");
      attr(div, "id", "timer");
      attr(div, "class", "svelte-1bbb752");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      append(div, button0);
      append(button0, t0);
      append(div, t1);
      append(div, button1);
      append(div, t3);
      append(div, button2);
      append(div, t5);
      append(div, p);
      append(p, t6);
      if (!mounted) {
        dispose = [
          listen(button0, "click", ctx[2]),
          listen(button1, "click", ctx[3]),
          listen(button2, "click", ctx[4])
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (dirty & 2 && t0_value !== (t0_value = (ctx2[1] ? "Stop" : "Start") + ""))
        set_data(t0, t0_value);
      if (dirty & 1)
        set_data(t6, ctx2[0]);
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(div);
      mounted = false;
      run_all(dispose);
    }
  };
}
function instance2($$self, $$props, $$invalidate) {
  let time = 60;
  let countingdown = false;
  function toggle() {
    $$invalidate(1, countingdown = !countingdown);
  }
  function reset() {
    $$invalidate(0, time = 60);
    $$invalidate(1, countingdown = false);
  }
  function addMin() {
    $$invalidate(0, time += 60);
  }
  let countinterval = setInterval(function() {
    if (countingdown)
      $$invalidate(0, time--, time);
  }, 1e3);
  return [time, countingdown, toggle, reset, addMin];
}
var Timer = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance2, create_fragment2, safe_not_equal, {}, add_css2);
  }
};
var timer_default = Timer;

// src/qa.json
var qa_default = [
  {
    question: "What does Tea Cake teach Janie to do once they're in the Everglades?",
    answers: [
      {answer: "cook", points: 0},
      {answer: "shoot a gun", points: 6},
      {answer: "make lemonade", points: 1},
      {answer: "socialize with others", points: 0}
    ]
  },
  {
    question: "What sort of work do Tea Cake and Janie do in the Everglades?",
    answers: [
      {answer: "sew clothes", points: 0},
      {answer: "cashiers at a marketplace", points: 0},
      {answer: "raise farm animals", points: 1},
      {answer: "farm beans", points: 6}
    ]
  },
  {
    question: "Who says the quote, \u201COh, you needs tuh learn how. 'Tain't no need uh you not known' how tuh handle shootin' tools.\u201D",
    answers: [
      {answer: "Tea Cake", points: 6},
      {answer: "Jody", points: 0},
      {answer: "Janie", points: 1},
      {answer: "Amos Hicks", points: 0}
    ]
  },
  {
    question: "Where do most of the workers migrate from?",
    answers: [
      {answer: "Georgia", points: 2},
      {answer: "Florida", points: 1},
      {answer: "Mississippi", points: 1},
      {answer: "The South in general", points: 3}
    ]
  },
  {
    question: "How does Janie think about the people she left behind in Eatonville?",
    answers: [
      {answer: "resent", points: 2},
      {answer: "pities", points: 3},
      {answer: "envies", points: 1},
      {answer: "fears", points: 1}
    ]
  },
  {
    question: "What does Tea Cake call the land that he works on?",
    answers: [
      {answer: "glades", points: 2},
      {answer: "grounds", points: 1},
      {answer: "muck", points: 4},
      {answer: "patch", points: 0}
    ]
  },
  {
    question: "What are the main themes shown in chapter 14?",
    answers: [
      {answer: "love", points: 6},
      {answer: "redemption", points: 1},
      {answer: "coming of age", points: 0},
      {answer: "revenge", points: 0}
    ]
  },
  {
    question: "Where do all the workers from the muck go for fun?",
    answers: [
      {answer: "Janie's store", points: 0},
      {answer: "Tea Cake and Janie's house", points: 5},
      {answer: "town center", points: 2},
      {answer: "Jacksonville", points: 0}
    ]
  },
  {
    question: "While working, Tea Cake misses Janie dearly. What does he convince her to do after?",
    answers: [
      {answer: "pay her", points: 0},
      {answer: "talk to his friends", points: 1},
      {answer: "work alongside him", points: 6},
      {answer: "make lemonade", points: 0}
    ]
  },
  {
    question: "The argument between Ed and Gabe (near the end of chapter 14) shows the theme of ___.",
    answers: [
      {answer: "nature vs nurture", points: 1},
      {answer: "racism", points: 4},
      {answer: "gender roles", points: 2},
      {answer: "revenge", points: 0}
    ]
  },
  {
    question: "How is Nunkie's appearance described?",
    answers: [
      {answer: "chuncky", points: 5},
      {answer: "slim", points: 1},
      {answer: "attractive", points: 1},
      {answer: "strong", points: 0}
    ]
  },
  {
    question: "What does Nunkie do to get Tea Cake's attention?",
    answers: [
      {answer: "bribe", points: 1},
      {answer: "blackmail", points: 0},
      {answer: "make food", points: 1},
      {answer: "tease", points: 5}
    ]
  }
];

// src/fastmoney.svelte
function add_css3(target) {
  append_styles(target, "svelte-1cijtmy", ".container.svelte-1cijtmy{display:flex;justify-content:space-around}footer.svelte-1cijtmy{position:absolute;bottom:0;width:100%;height:80px}");
}
function get_each_context2(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[18] = list[i];
  child_ctx[20] = i;
  return child_ctx;
}
function create_each_block2(ctx) {
  let option;
  let t_value = ctx[18].answer + "";
  let t;
  let option_value_value;
  return {
    c() {
      option = element("option");
      t = text(t_value);
      option.__value = option_value_value = ctx[20];
      option.value = option.__value;
    },
    m(target, anchor) {
      insert(target, option, anchor);
      append(option, t);
    },
    p(ctx2, dirty) {
      if (dirty & 16 && t_value !== (t_value = ctx2[18].answer + ""))
        set_data(t, t_value);
    },
    d(detaching) {
      if (detaching)
        detach(option);
    }
  };
}
function create_fragment3(ctx) {
  let timer;
  let t0;
  let br0;
  let t1;
  let br1;
  let t2;
  let div;
  let chart0;
  let t3;
  let chart1_1;
  let t4;
  let footer;
  let button0;
  let t6;
  let button1;
  let t8;
  let button2;
  let t10;
  let button3;
  let t12;
  let br2;
  let t13;
  let select0;
  let option0;
  let option1;
  let t16;
  let input;
  let t17;
  let button4;
  let t19;
  let button5;
  let t21;
  let br3;
  let t22;
  let select1;
  let option2;
  let t24;
  let button6;
  let current;
  let mounted;
  let dispose;
  timer = new timer_default({});
  let chart0_props = {playernum: "1", numrows: "5"};
  chart0 = new chart_default({props: chart0_props});
  ctx[13](chart0);
  let chart1_1_props = {playernum: "2", numrows: "5"};
  chart1_1 = new chart_default({props: chart1_1_props});
  ctx[14](chart1_1);
  let each_value = qa_default[ctx[4]].answers;
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block2(get_each_context2(ctx, each_value, i));
  }
  return {
    c() {
      create_component(timer.$$.fragment);
      t0 = space();
      br0 = element("br");
      t1 = space();
      br1 = element("br");
      t2 = space();
      div = element("div");
      create_component(chart0.$$.fragment);
      t3 = space();
      create_component(chart1_1.$$.fragment);
      t4 = space();
      footer = element("footer");
      button0 = element("button");
      button0.textContent = "hide chart 1";
      t6 = space();
      button1 = element("button");
      button1.textContent = "hide chart 2";
      t8 = space();
      button2 = element("button");
      button2.textContent = "show chart 1";
      t10 = space();
      button3 = element("button");
      button3.textContent = "show chart 2";
      t12 = space();
      br2 = element("br");
      t13 = space();
      select0 = element("select");
      option0 = element("option");
      option0.textContent = "Chart 1";
      option1 = element("option");
      option1.textContent = "Chart 2";
      t16 = space();
      input = element("input");
      t17 = space();
      button4 = element("button");
      button4.textContent = "Add";
      t19 = space();
      button5 = element("button");
      button5.textContent = "Delete Last Answer";
      t21 = space();
      br3 = element("br");
      t22 = space();
      select1 = element("select");
      option2 = element("option");
      option2.textContent = "none";
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      t24 = space();
      button6 = element("button");
      button6.textContent = "Submit Answer";
      attr(div, "class", "container svelte-1cijtmy");
      option0.__value = "chart1";
      option0.value = option0.__value;
      option1.__value = "chart2";
      option1.value = option1.__value;
      if (ctx[2] === void 0)
        add_render_callback(() => ctx[15].call(select0));
      attr(input, "type", "text");
      attr(input, "name", "player answer");
      option2.__value = "-1";
      option2.value = option2.__value;
      if (ctx[5] === void 0)
        add_render_callback(() => ctx[17].call(select1));
      attr(footer, "class", "svelte-1cijtmy");
    },
    m(target, anchor) {
      mount_component(timer, target, anchor);
      insert(target, t0, anchor);
      insert(target, br0, anchor);
      insert(target, t1, anchor);
      insert(target, br1, anchor);
      insert(target, t2, anchor);
      insert(target, div, anchor);
      mount_component(chart0, div, null);
      append(div, t3);
      mount_component(chart1_1, div, null);
      insert(target, t4, anchor);
      insert(target, footer, anchor);
      append(footer, button0);
      append(footer, t6);
      append(footer, button1);
      append(footer, t8);
      append(footer, button2);
      append(footer, t10);
      append(footer, button3);
      append(footer, t12);
      append(footer, br2);
      append(footer, t13);
      append(footer, select0);
      append(select0, option0);
      append(select0, option1);
      select_option(select0, ctx[2]);
      append(footer, t16);
      append(footer, input);
      set_input_value(input, ctx[3]);
      append(footer, t17);
      append(footer, button4);
      append(footer, t19);
      append(footer, button5);
      append(footer, t21);
      append(footer, br3);
      append(footer, t22);
      append(footer, select1);
      append(select1, option2);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].m(select1, null);
      }
      select_option(select1, ctx[5]);
      append(footer, t24);
      append(footer, button6);
      current = true;
      if (!mounted) {
        dispose = [
          listen(button0, "click", ctx[6]),
          listen(button1, "click", ctx[7]),
          listen(button2, "click", ctx[8]),
          listen(button3, "click", ctx[9]),
          listen(select0, "change", ctx[15]),
          listen(input, "input", ctx[16]),
          listen(input, "keyup", ctx[10]),
          listen(button4, "click", ctx[10]),
          listen(button5, "click", ctx[11]),
          listen(select1, "change", ctx[17]),
          listen(button6, "click", ctx[12])
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      const chart0_changes = {};
      chart0.$set(chart0_changes);
      const chart1_1_changes = {};
      chart1_1.$set(chart1_1_changes);
      if (dirty & 4) {
        select_option(select0, ctx2[2]);
      }
      if (dirty & 8 && input.value !== ctx2[3]) {
        set_input_value(input, ctx2[3]);
      }
      if (dirty & 16) {
        each_value = qa_default[ctx2[4]].answers;
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context2(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
          } else {
            each_blocks[i] = create_each_block2(child_ctx);
            each_blocks[i].c();
            each_blocks[i].m(select1, null);
          }
        }
        for (; i < each_blocks.length; i += 1) {
          each_blocks[i].d(1);
        }
        each_blocks.length = each_value.length;
      }
      if (dirty & 32) {
        select_option(select1, ctx2[5]);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(timer.$$.fragment, local);
      transition_in(chart0.$$.fragment, local);
      transition_in(chart1_1.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(timer.$$.fragment, local);
      transition_out(chart0.$$.fragment, local);
      transition_out(chart1_1.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(timer, detaching);
      if (detaching)
        detach(t0);
      if (detaching)
        detach(br0);
      if (detaching)
        detach(t1);
      if (detaching)
        detach(br1);
      if (detaching)
        detach(t2);
      if (detaching)
        detach(div);
      ctx[13](null);
      destroy_component(chart0);
      ctx[14](null);
      destroy_component(chart1_1);
      if (detaching)
        detach(t4);
      if (detaching)
        detach(footer);
      destroy_each(each_blocks, detaching);
      mounted = false;
      run_all(dispose);
    }
  };
}
function instance3($$self, $$props, $$invalidate) {
  let chart1;
  let chart2;
  let selectedChart;
  let userAnswer;
  let qnum = 0;
  let selectedAnswer;
  onMount(async () => {
  });
  function hideChart1() {
    chart1.hideAll();
  }
  function hideChart2() {
    chart2.hideAll();
  }
  function showChart1() {
    chart1.showAll();
  }
  function showChart2() {
    chart2.showAll();
  }
  function addToChart(e) {
    if (e.key != "Enter" && e.type != "click")
      return;
    if (userAnswer == "")
      return;
    if (selectedChart == "chart1")
      chart1.addAnswer(userAnswer);
    else
      chart2.addAnswer(userAnswer);
    $$invalidate(3, userAnswer = "");
  }
  function deleteLastAnswer() {
    if (selectedChart == "chart1")
      chart1.deleteLastAnswer();
    else
      chart2.deleteLastAnswer();
  }
  function submitAnswerPoints() {
    if (selectedChart == "chart1") {
      if (selectedAnswer == -1) {
        chart1.addPoint(0);
        return;
      }
      chart1.addPoint(qa_default[qnum].answers[selectedAnswer].points);
    } else {
      if (selectedAnswer == -1) {
        chart2.addPoint(0);
        return;
      }
      chart2.addPoint(qa_default[qnum].answers[selectedAnswer].points);
    }
    $$invalidate(4, qnum++, qnum);
    $$invalidate(5, selectedAnswer = "none");
  }
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
  function select0_change_handler() {
    selectedChart = select_value(this);
    $$invalidate(2, selectedChart);
  }
  function input_input_handler() {
    userAnswer = this.value;
    $$invalidate(3, userAnswer);
  }
  function select1_change_handler() {
    selectedAnswer = select_value(this);
    $$invalidate(5, selectedAnswer);
  }
  return [
    chart1,
    chart2,
    selectedChart,
    userAnswer,
    qnum,
    selectedAnswer,
    hideChart1,
    hideChart2,
    showChart1,
    showChart2,
    addToChart,
    deleteLastAnswer,
    submitAnswerPoints,
    chart0_binding,
    chart1_1_binding,
    select0_change_handler,
    input_input_handler,
    select1_change_handler
  ];
}
var Fastmoney = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance3, create_fragment3, safe_not_equal, {}, add_css3);
  }
};
var fastmoney_default = Fastmoney;

// src/app.svelte
function add_css4(target) {
  append_styles(target, "svelte-1iqkgmr", "body{margin:0;height:100%;background-color:blue}");
}
function create_fragment4(ctx) {
  let fastmoney;
  let current;
  fastmoney = new fastmoney_default({});
  return {
    c() {
      create_component(fastmoney.$$.fragment);
    },
    m(target, anchor) {
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
      destroy_component(fastmoney, detaching);
    }
  };
}
var App = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, null, create_fragment4, safe_not_equal, {}, add_css4);
  }
};
var app_default = App;

// src/app.js
new app_default({
  target: document.body
});
