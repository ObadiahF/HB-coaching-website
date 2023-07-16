
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
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
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        if (value == null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    /**
     * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
     * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
     * it can be called from an external module).
     *
     * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
     *
     * https://svelte.dev/docs#run-time-svelte-onmount
     */
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    let render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = /* @__PURE__ */ Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        // Do not reenter flush while dirty components are updated, as this can
        // result in an infinite loop. Instead, let the inner flush handle it.
        // Reentrancy is ok afterwards for bindings etc.
        if (flushidx !== 0) {
            return;
        }
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            try {
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update(component.$$);
                }
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
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
    /**
     * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
     */
    function flush_render_callbacks(fns) {
        const filtered = [];
        const targets = [];
        render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
        targets.forEach((c) => c());
        render_callbacks = filtered;
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
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
            flush_render_callbacks($$.after_update);
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
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
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
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
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.59.2' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation, has_stop_immediate_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        if (has_stop_immediate_propagation)
            modifiers.push('stopImmediatePropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=} start
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0 && stop) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const state = writable("front-page");
    const dashState = writable(["dash", "dark-mode"]);

    const scrollIntoView = (componentId) => {
        const component = document.getElementById(componentId);
        component.scrollIntoView({ behavior: 'smooth' });
    };

    /* src/home-components/nav-bar.svelte generated by Svelte v3.59.2 */
    const file$a = "src/home-components/nav-bar.svelte";

    // (54:12) {:else}
    function create_else_block$1(ctx) {
    	let i;

    	const block = {
    		c: function create() {
    			i = element("i");
    			attr_dev(i, "class", "fa-solid fa-bars svelte-htf06f");
    			set_style(i, "color", "#ffffff");
    			add_location(i, file$a, 54, 16, 1568);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(54:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (52:12) {#if open}
    function create_if_block$2(ctx) {
    	let i;

    	const block = {
    		c: function create() {
    			i = element("i");
    			attr_dev(i, "class", "fa-solid fa-x svelte-htf06f");
    			set_style(i, "color", "#ffffff");
    			add_location(i, file$a, 52, 16, 1478);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(52:12) {#if open}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let script;
    	let script_src_value;
    	let t0;
    	let div;
    	let h1;
    	let t2;
    	let ul;
    	let a0;
    	let t4;
    	let a1;
    	let t6;
    	let a2;
    	let t8;
    	let a3;
    	let t10;
    	let button0;
    	let ul_class_value;
    	let t12;
    	let button1;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*open*/ ctx[0]) return create_if_block$2;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			script = element("script");
    			t0 = space();
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "HUMBLEBEAST";
    			t2 = space();
    			ul = element("ul");
    			a0 = element("a");
    			a0.textContent = "home";
    			t4 = space();
    			a1 = element("a");
    			a1.textContent = "pricing";
    			t6 = space();
    			a2 = element("a");
    			a2.textContent = "resources";
    			t8 = space();
    			a3 = element("a");
    			a3.textContent = "contact";
    			t10 = space();
    			button0 = element("button");
    			button0.textContent = "sign in";
    			t12 = space();
    			button1 = element("button");
    			if_block.c();
    			if (!src_url_equal(script.src, script_src_value = "https://kit.fontawesome.com/db3c0028dc.js")) attr_dev(script, "src", script_src_value);
    			attr_dev(script, "crossorigin", "anonymous");
    			attr_dev(script, "class", "svelte-htf06f");
    			add_location(script, file$a, 1, 4, 18);
    			attr_dev(h1, "class", "svelte-htf06f");
    			add_location(h1, file$a, 41, 8, 925);
    			attr_dev(a0, "class", "svelte-htf06f");
    			add_location(a0, file$a, 43, 16, 1027);
    			attr_dev(a1, "class", "svelte-htf06f");
    			add_location(a1, file$a, 44, 16, 1089);
    			attr_dev(a2, "class", "svelte-htf06f");
    			add_location(a2, file$a, 45, 16, 1157);
    			attr_dev(a3, "class", "svelte-htf06f");
    			add_location(a3, file$a, 46, 16, 1229);
    			attr_dev(button0, "id", "signIn");
    			attr_dev(button0, "class", "svelte-htf06f");
    			add_location(button0, file$a, 47, 16, 1297);
    			attr_dev(ul, "class", ul_class_value = "" + (null_to_empty(/*open*/ ctx[0] === false ? 'nav-items' : 'mobile') + " svelte-htf06f"));
    			add_location(ul, file$a, 42, 12, 958);
    			attr_dev(button1, "id", "mobile");
    			attr_dev(button1, "class", "svelte-htf06f");
    			add_location(button1, file$a, 50, 8, 1390);
    			attr_dev(div, "class", "nav-bar svelte-htf06f");
    			add_location(div, file$a, 40, 0, 895);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, script);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(div, t2);
    			append_dev(div, ul);
    			append_dev(ul, a0);
    			append_dev(ul, t4);
    			append_dev(ul, a1);
    			append_dev(ul, t6);
    			append_dev(ul, a2);
    			append_dev(ul, t8);
    			append_dev(ul, a3);
    			append_dev(ul, t10);
    			append_dev(ul, button0);
    			append_dev(div, t12);
    			append_dev(div, button1);
    			if_block.m(button1, null);

    			if (!mounted) {
    				dispose = [
    					listen_dev(a0, "click", /*click_handler*/ ctx[4], false, false, false, false),
    					listen_dev(a1, "click", /*click_handler_1*/ ctx[5], false, false, false, false),
    					listen_dev(a2, "click", /*click_handler_2*/ ctx[6], false, false, false, false),
    					listen_dev(a3, "click", /*click_handler_3*/ ctx[7], false, false, false, false),
    					listen_dev(button0, "click", /*goToSignIn*/ ctx[3], false, false, false, false),
    					listen_dev(button1, "click", /*toggleMobileMenu*/ ctx[2], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*open*/ 1 && ul_class_value !== (ul_class_value = "" + (null_to_empty(/*open*/ ctx[0] === false ? 'nav-items' : 'mobile') + " svelte-htf06f"))) {
    				attr_dev(ul, "class", ul_class_value);
    			}

    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(button1, null);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			detach_dev(script);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div);
    			if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Nav_bar', slots, []);

    	const scroll = ref => {
    		let element;

    		switch (ref) {
    			case 'home':
    				element = 'hero';
    				break;
    			case 'pricing':
    				element = 'price';
    				break;
    			case 'resources':
    				element = 'resources';
    				break;
    			case 'contact':
    				element = 'contact';
    				break;
    		}

    		scrollIntoView(element);
    	};

    	//toggle menu
    	let open = false;

    	const toggleMobileMenu = () => {
    		$$invalidate(0, open = !open);
    	};

    	const goToSignIn = () => {
    		state.set('signIn');
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Nav_bar> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		scroll('home');
    	};

    	const click_handler_1 = () => {
    		scroll('pricing');
    	};

    	const click_handler_2 = () => {
    		scroll('resources');
    	};

    	const click_handler_3 = () => {
    		scroll('contact');
    	};

    	$$self.$capture_state = () => ({
    		scrollIntoView,
    		state,
    		scroll,
    		open,
    		toggleMobileMenu,
    		goToSignIn
    	});

    	$$self.$inject_state = $$props => {
    		if ('open' in $$props) $$invalidate(0, open = $$props.open);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		open,
    		scroll,
    		toggleMobileMenu,
    		goToSignIn,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3
    	];
    }

    class Nav_bar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Nav_bar",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src/home-components/hero.svelte generated by Svelte v3.59.2 */
    const file$9 = "src/home-components/hero.svelte";

    function create_fragment$a(ctx) {
    	let div7;
    	let div5;
    	let div4;
    	let div3;
    	let div0;
    	let h1;
    	let t1;
    	let div1;
    	let p;
    	let t3;
    	let div2;
    	let button0;
    	let t5;
    	let button1;
    	let t7;
    	let div6;
    	let img;
    	let img_src_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div7 = element("div");
    			div5 = element("div");
    			div4 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Unleash your inner beast";
    			t1 = space();
    			div1 = element("div");
    			p = element("p");
    			p.textContent = "At HumbleBeast Coaching, we specialize in weightlifting, fat loss, and muscle building. Let our expert coach guide your transformation with personalized workout programs and tailored nutrition plans.";
    			t3 = space();
    			div2 = element("div");
    			button0 = element("button");
    			button0.textContent = "Meet Our Coaches";
    			t5 = space();
    			button1 = element("button");
    			button1.textContent = "View Pricing";
    			t7 = space();
    			div6 = element("div");
    			img = element("img");
    			attr_dev(h1, "class", "svelte-17sdxeu");
    			add_location(h1, file$9, 13, 20, 354);
    			attr_dev(div0, "class", "hero-title-container svelte-17sdxeu");
    			add_location(div0, file$9, 12, 16, 299);
    			attr_dev(p, "class", "svelte-17sdxeu");
    			add_location(p, file$9, 16, 20, 481);
    			attr_dev(div1, "class", "paragraph-container svelte-17sdxeu");
    			add_location(div1, file$9, 15, 16, 427);
    			attr_dev(button0, "id", "meet");
    			attr_dev(button0, "class", "hero-btn svelte-17sdxeu");
    			add_location(button0, file$9, 19, 20, 775);
    			attr_dev(button1, "id", "pricing");
    			attr_dev(button1, "class", "hero-btn svelte-17sdxeu");
    			add_location(button1, file$9, 20, 20, 856);
    			attr_dev(div2, "class", "btn-container svelte-17sdxeu");
    			add_location(div2, file$9, 18, 16, 727);
    			attr_dev(div3, "class", "hero-container svelte-17sdxeu");
    			add_location(div3, file$9, 11, 12, 254);
    			attr_dev(div4, "class", "gradient svelte-17sdxeu");
    			add_location(div4, file$9, 10, 8, 219);
    			attr_dev(div5, "class", "black-column svelte-17sdxeu");
    			add_location(div5, file$9, 9, 4, 184);
    			if (!src_url_equal(img.src, img_src_value = "pictures/brian.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Brians a cool guy");
    			attr_dev(img, "height", "248px");
    			attr_dev(img, "width", "341");
    			attr_dev(img, "class", "svelte-17sdxeu");
    			add_location(img, file$9, 26, 8, 1055);
    			attr_dev(div6, "class", "picture-container svelte-17sdxeu");
    			add_location(div6, file$9, 25, 4, 1015);
    			attr_dev(div7, "class", "container svelte-17sdxeu");
    			add_location(div7, file$9, 8, 0, 156);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div7, anchor);
    			append_dev(div7, div5);
    			append_dev(div5, div4);
    			append_dev(div4, div3);
    			append_dev(div3, div0);
    			append_dev(div0, h1);
    			append_dev(div3, t1);
    			append_dev(div3, div1);
    			append_dev(div1, p);
    			append_dev(div3, t3);
    			append_dev(div3, div2);
    			append_dev(div2, button0);
    			append_dev(div2, t5);
    			append_dev(div2, button1);
    			append_dev(div7, t7);
    			append_dev(div7, div6);
    			append_dev(div6, img);

    			if (!mounted) {
    				dispose = listen_dev(button1, "click", /*scrollToPricing*/ ctx[0], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div7);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Hero', slots, []);

    	const scrollToPricing = () => {
    		scrollIntoView('price');
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Hero> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ scrollIntoView, scrollToPricing });
    	return [scrollToPricing];
    }

    class Hero extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Hero",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* src/home-components/pricing.svelte generated by Svelte v3.59.2 */

    const file$8 = "src/home-components/pricing.svelte";

    function create_fragment$9(ctx) {
    	let script;
    	let script_src_value;
    	let t0;
    	let div5;
    	let div0;
    	let h10;
    	let t2;
    	let div4;
    	let div1;
    	let h60;
    	let t4;
    	let h11;
    	let t6;
    	let ul0;
    	let li0;
    	let i0;
    	let t7;
    	let t8;
    	let li1;
    	let i1;
    	let t9;
    	let t10;
    	let li2;
    	let i2;
    	let t11;
    	let t12;
    	let li3;
    	let i3;
    	let t13;
    	let t14;
    	let button0;
    	let t16;
    	let div2;
    	let h61;
    	let t18;
    	let h12;
    	let t20;
    	let ul1;
    	let li4;
    	let i4;
    	let t21;
    	let t22;
    	let li5;
    	let i5;
    	let t23;
    	let t24;
    	let li6;
    	let i6;
    	let t25;
    	let t26;
    	let li7;
    	let i7;
    	let t27;
    	let t28;
    	let button1;
    	let t30;
    	let div3;
    	let h62;
    	let t32;
    	let h13;
    	let t34;
    	let ul2;
    	let li8;
    	let i8;
    	let t35;
    	let t36;
    	let li9;
    	let i9;
    	let t37;
    	let t38;
    	let li10;
    	let i10;
    	let t39;
    	let t40;
    	let li11;
    	let i11;
    	let t41;
    	let t42;
    	let button2;

    	const block = {
    		c: function create() {
    			script = element("script");
    			t0 = space();
    			div5 = element("div");
    			div0 = element("div");
    			h10 = element("h1");
    			h10.textContent = "Pricing";
    			t2 = space();
    			div4 = element("div");
    			div1 = element("div");
    			h60 = element("h6");
    			h60.textContent = "Standard";
    			t4 = space();
    			h11 = element("h1");
    			h11.textContent = "$34.99/mo";
    			t6 = space();
    			ul0 = element("ul");
    			li0 = element("li");
    			i0 = element("i");
    			t7 = text("   Custom workouts");
    			t8 = space();
    			li1 = element("li");
    			i1 = element("i");
    			t9 = text("   Nutrition guidance");
    			t10 = space();
    			li2 = element("li");
    			i2 = element("i");
    			t11 = text("   Bi-weekly check-ins");
    			t12 = space();
    			li3 = element("li");
    			i3 = element("i");
    			t13 = text("   Email support");
    			t14 = space();
    			button0 = element("button");
    			button0.textContent = "Get Started";
    			t16 = space();
    			div2 = element("div");
    			h61 = element("h6");
    			h61.textContent = "Premium";
    			t18 = space();
    			h12 = element("h1");
    			h12.textContent = "$49.99/mo";
    			t20 = space();
    			ul1 = element("ul");
    			li4 = element("li");
    			i4 = element("i");
    			t21 = text("   All Standard");
    			t22 = space();
    			li5 = element("li");
    			i5 = element("i");
    			t23 = text("   Progress tracking");
    			t24 = space();
    			li6 = element("li");
    			i6 = element("i");
    			t25 = text("   Weekly check-ins");
    			t26 = space();
    			li7 = element("li");
    			i7 = element("i");
    			t27 = text("   priority support");
    			t28 = space();
    			button1 = element("button");
    			button1.textContent = "Go Premium";
    			t30 = space();
    			div3 = element("div");
    			h62 = element("h6");
    			h62.textContent = "Elite";
    			t32 = space();
    			h13 = element("h1");
    			h13.textContent = "$59.99/mo";
    			t34 = space();
    			ul2 = element("ul");
    			li8 = element("li");
    			i8 = element("i");
    			t35 = text("   All Premium");
    			t36 = space();
    			li9 = element("li");
    			i9 = element("i");
    			t37 = text("   Progress tracking");
    			t38 = space();
    			li10 = element("li");
    			i10 = element("i");
    			t39 = text("   Weekly check-ins");
    			t40 = space();
    			li11 = element("li");
    			i11 = element("i");
    			t41 = text("   priority support");
    			t42 = space();
    			button2 = element("button");
    			button2.textContent = "Go Elite";
    			if (!src_url_equal(script.src, script_src_value = "https://kit.fontawesome.com/db3c0028dc.js")) attr_dev(script, "src", script_src_value);
    			attr_dev(script, "crossorigin", "anonymous");
    			attr_dev(script, "class", "svelte-1en6bye");
    			add_location(script, file$8, 5, 0, 35);
    			attr_dev(h10, "class", "svelte-1en6bye");
    			add_location(h10, file$8, 10, 8, 197);
    			attr_dev(div0, "class", "title svelte-1en6bye");
    			add_location(div0, file$8, 9, 4, 169);
    			attr_dev(h60, "class", "svelte-1en6bye");
    			add_location(h60, file$8, 16, 12, 305);
    			attr_dev(h11, "class", "svelte-1en6bye");
    			add_location(h11, file$8, 17, 12, 335);
    			attr_dev(i0, "class", "fa-solid fa-check svelte-1en6bye");
    			set_style(i0, "color", "#ffffff");
    			add_location(i0, file$8, 19, 20, 405);
    			attr_dev(li0, "class", "svelte-1en6bye");
    			add_location(li0, file$8, 19, 16, 401);
    			attr_dev(i1, "class", "fa-solid fa-check svelte-1en6bye");
    			set_style(i1, "color", "#ffffff");
    			add_location(i1, file$8, 20, 20, 506);
    			attr_dev(li1, "class", "svelte-1en6bye");
    			add_location(li1, file$8, 20, 16, 502);
    			attr_dev(i2, "class", "fa-solid fa-check svelte-1en6bye");
    			set_style(i2, "color", "#ffffff");
    			add_location(i2, file$8, 21, 20, 610);
    			attr_dev(li2, "class", "svelte-1en6bye");
    			add_location(li2, file$8, 21, 16, 606);
    			attr_dev(i3, "class", "fa-solid fa-check svelte-1en6bye");
    			set_style(i3, "color", "#ffffff");
    			add_location(i3, file$8, 22, 20, 715);
    			attr_dev(li3, "class", "svelte-1en6bye");
    			add_location(li3, file$8, 22, 16, 711);
    			attr_dev(ul0, "class", "parts svelte-1en6bye");
    			add_location(ul0, file$8, 18, 12, 366);
    			attr_dev(button0, "class", "call-to-action svelte-1en6bye");
    			add_location(button0, file$8, 24, 12, 824);
    			attr_dev(div1, "class", "options svelte-1en6bye");
    			add_location(div1, file$8, 15, 8, 271);
    			attr_dev(h61, "class", "svelte-1en6bye");
    			add_location(h61, file$8, 28, 12, 938);
    			attr_dev(h12, "class", "svelte-1en6bye");
    			add_location(h12, file$8, 29, 12, 967);
    			attr_dev(i4, "class", "fa-solid fa-check svelte-1en6bye");
    			set_style(i4, "color", "#ffffff");
    			add_location(i4, file$8, 31, 20, 1037);
    			attr_dev(li4, "class", "svelte-1en6bye");
    			add_location(li4, file$8, 31, 16, 1033);
    			attr_dev(i5, "class", "fa-solid fa-check svelte-1en6bye");
    			set_style(i5, "color", "#ffffff");
    			add_location(i5, file$8, 32, 20, 1135);
    			attr_dev(li5, "class", "svelte-1en6bye");
    			add_location(li5, file$8, 32, 16, 1131);
    			attr_dev(i6, "class", "fa-solid fa-check svelte-1en6bye");
    			set_style(i6, "color", "#ffffff");
    			add_location(i6, file$8, 33, 20, 1238);
    			attr_dev(li6, "class", "svelte-1en6bye");
    			add_location(li6, file$8, 33, 16, 1234);
    			attr_dev(i7, "class", "fa-solid fa-check svelte-1en6bye");
    			set_style(i7, "color", "#ffffff");
    			add_location(i7, file$8, 34, 20, 1340);
    			attr_dev(li7, "class", "svelte-1en6bye");
    			add_location(li7, file$8, 34, 16, 1336);
    			attr_dev(ul1, "class", "parts svelte-1en6bye");
    			add_location(ul1, file$8, 30, 12, 998);
    			attr_dev(button1, "class", "call-to-action svelte-1en6bye");
    			add_location(button1, file$8, 36, 12, 1452);
    			attr_dev(div2, "class", "options svelte-1en6bye");
    			add_location(div2, file$8, 27, 8, 904);
    			attr_dev(h62, "class", "svelte-1en6bye");
    			add_location(h62, file$8, 40, 12, 1565);
    			attr_dev(h13, "class", "svelte-1en6bye");
    			add_location(h13, file$8, 41, 12, 1592);
    			attr_dev(i8, "class", "fa-solid fa-check svelte-1en6bye");
    			set_style(i8, "color", "#ffffff");
    			add_location(i8, file$8, 43, 20, 1662);
    			attr_dev(li8, "class", "svelte-1en6bye");
    			add_location(li8, file$8, 43, 16, 1658);
    			attr_dev(i9, "class", "fa-solid fa-check svelte-1en6bye");
    			set_style(i9, "color", "#ffffff");
    			add_location(i9, file$8, 44, 20, 1759);
    			attr_dev(li9, "class", "svelte-1en6bye");
    			add_location(li9, file$8, 44, 16, 1755);
    			attr_dev(i10, "class", "fa-solid fa-check svelte-1en6bye");
    			set_style(i10, "color", "#ffffff");
    			add_location(i10, file$8, 45, 20, 1862);
    			attr_dev(li10, "class", "svelte-1en6bye");
    			add_location(li10, file$8, 45, 16, 1858);
    			attr_dev(i11, "class", "fa-solid fa-check svelte-1en6bye");
    			set_style(i11, "color", "#ffffff");
    			add_location(i11, file$8, 46, 20, 1964);
    			attr_dev(li11, "class", "svelte-1en6bye");
    			add_location(li11, file$8, 46, 16, 1960);
    			attr_dev(ul2, "class", "parts svelte-1en6bye");
    			add_location(ul2, file$8, 42, 12, 1623);
    			attr_dev(button2, "class", "call-to-action svelte-1en6bye");
    			add_location(button2, file$8, 48, 12, 2076);
    			attr_dev(div3, "class", "options svelte-1en6bye");
    			add_location(div3, file$8, 39, 8, 1531);
    			attr_dev(div4, "class", "options-container svelte-1en6bye");
    			add_location(div4, file$8, 13, 4, 230);
    			attr_dev(div5, "class", "container svelte-1en6bye");
    			add_location(div5, file$8, 8, 0, 141);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, script);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div0);
    			append_dev(div0, h10);
    			append_dev(div5, t2);
    			append_dev(div5, div4);
    			append_dev(div4, div1);
    			append_dev(div1, h60);
    			append_dev(div1, t4);
    			append_dev(div1, h11);
    			append_dev(div1, t6);
    			append_dev(div1, ul0);
    			append_dev(ul0, li0);
    			append_dev(li0, i0);
    			append_dev(li0, t7);
    			append_dev(ul0, t8);
    			append_dev(ul0, li1);
    			append_dev(li1, i1);
    			append_dev(li1, t9);
    			append_dev(ul0, t10);
    			append_dev(ul0, li2);
    			append_dev(li2, i2);
    			append_dev(li2, t11);
    			append_dev(ul0, t12);
    			append_dev(ul0, li3);
    			append_dev(li3, i3);
    			append_dev(li3, t13);
    			append_dev(div1, t14);
    			append_dev(div1, button0);
    			append_dev(div4, t16);
    			append_dev(div4, div2);
    			append_dev(div2, h61);
    			append_dev(div2, t18);
    			append_dev(div2, h12);
    			append_dev(div2, t20);
    			append_dev(div2, ul1);
    			append_dev(ul1, li4);
    			append_dev(li4, i4);
    			append_dev(li4, t21);
    			append_dev(ul1, t22);
    			append_dev(ul1, li5);
    			append_dev(li5, i5);
    			append_dev(li5, t23);
    			append_dev(ul1, t24);
    			append_dev(ul1, li6);
    			append_dev(li6, i6);
    			append_dev(li6, t25);
    			append_dev(ul1, t26);
    			append_dev(ul1, li7);
    			append_dev(li7, i7);
    			append_dev(li7, t27);
    			append_dev(div2, t28);
    			append_dev(div2, button1);
    			append_dev(div4, t30);
    			append_dev(div4, div3);
    			append_dev(div3, h62);
    			append_dev(div3, t32);
    			append_dev(div3, h13);
    			append_dev(div3, t34);
    			append_dev(div3, ul2);
    			append_dev(ul2, li8);
    			append_dev(li8, i8);
    			append_dev(li8, t35);
    			append_dev(ul2, t36);
    			append_dev(ul2, li9);
    			append_dev(li9, i9);
    			append_dev(li9, t37);
    			append_dev(ul2, t38);
    			append_dev(ul2, li10);
    			append_dev(li10, i10);
    			append_dev(li10, t39);
    			append_dev(ul2, t40);
    			append_dev(ul2, li11);
    			append_dev(li11, i11);
    			append_dev(li11, t41);
    			append_dev(div3, t42);
    			append_dev(div3, button2);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			detach_dev(script);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div5);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Pricing', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Pricing> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Pricing extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Pricing",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src/home-components/resources.svelte generated by Svelte v3.59.2 */

    const file$7 = "src/home-components/resources.svelte";

    function create_fragment$8(ctx) {
    	let div2;
    	let div0;
    	let h1;
    	let t1;
    	let div1;
    	let iframe0;
    	let iframe0_src_value;
    	let t2;
    	let iframe1;
    	let iframe1_src_value;
    	let t3;
    	let iframe2;
    	let iframe2_src_value;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Resources";
    			t1 = space();
    			div1 = element("div");
    			iframe0 = element("iframe");
    			t2 = space();
    			iframe1 = element("iframe");
    			t3 = space();
    			iframe2 = element("iframe");
    			attr_dev(h1, "class", "svelte-1vhp63q");
    			add_location(h1, file$7, 6, 8, 77);
    			attr_dev(div0, "class", "title svelte-1vhp63q");
    			add_location(div0, file$7, 5, 4, 49);
    			attr_dev(iframe0, "width", "560");
    			attr_dev(iframe0, "height", "315");
    			if (!src_url_equal(iframe0.src, iframe0_src_value = "https://www.youtube-nocookie.com/embed/q3EItdmyf2A")) attr_dev(iframe0, "src", iframe0_src_value);
    			attr_dev(iframe0, "title", "YouTube video player");
    			attr_dev(iframe0, "frameborder", "0");
    			attr_dev(iframe0, "allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share");
    			iframe0.allowFullscreen = true;
    			attr_dev(iframe0, "class", "svelte-1vhp63q");
    			add_location(iframe0, file$7, 9, 8, 150);
    			attr_dev(iframe1, "width", "560");
    			attr_dev(iframe1, "height", "315");
    			if (!src_url_equal(iframe1.src, iframe1_src_value = "https://www.youtube-nocookie.com/embed/jLg9kdVUwoE")) attr_dev(iframe1, "src", iframe1_src_value);
    			attr_dev(iframe1, "title", "YouTube video player");
    			attr_dev(iframe1, "frameborder", "0");
    			attr_dev(iframe1, "allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share");
    			iframe1.allowFullscreen = true;
    			attr_dev(iframe1, "class", "svelte-1vhp63q");
    			add_location(iframe1, file$7, 10, 8, 427);
    			attr_dev(iframe2, "width", "560");
    			attr_dev(iframe2, "height", "315");
    			if (!src_url_equal(iframe2.src, iframe2_src_value = "https://www.youtube-nocookie.com/embed/d1z_-Kc6DS4")) attr_dev(iframe2, "src", iframe2_src_value);
    			attr_dev(iframe2, "title", "YouTube video player");
    			attr_dev(iframe2, "frameborder", "0");
    			attr_dev(iframe2, "allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share");
    			iframe2.allowFullscreen = true;
    			attr_dev(iframe2, "class", "svelte-1vhp63q");
    			add_location(iframe2, file$7, 11, 8, 708);
    			attr_dev(div1, "class", "videos-container svelte-1vhp63q");
    			add_location(div1, file$7, 8, 4, 111);
    			attr_dev(div2, "class", "container");
    			add_location(div2, file$7, 4, 0, 21);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, h1);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, iframe0);
    			append_dev(div1, t2);
    			append_dev(div1, iframe1);
    			append_dev(div1, t3);
    			append_dev(div1, iframe2);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Resources', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Resources> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Resources extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Resources",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src/home-components/contact.svelte generated by Svelte v3.59.2 */

    const file$6 = "src/home-components/contact.svelte";

    function create_fragment$7(ctx) {
    	let div7;
    	let div0;
    	let h1;
    	let t1;
    	let div6;
    	let div5;
    	let form;
    	let div4;
    	let ul;
    	let li0;
    	let select;
    	let option0;
    	let option1;
    	let option2;
    	let option3;
    	let option4;
    	let t7;
    	let li1;
    	let div1;
    	let input0;
    	let t8;
    	let input1;
    	let t9;
    	let li2;
    	let textarea;
    	let t10;
    	let div3;
    	let div2;
    	let t12;
    	let button0;
    	let span0;
    	let t14;
    	let button1;
    	let span1;

    	const block = {
    		c: function create() {
    			div7 = element("div");
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Contact";
    			t1 = space();
    			div6 = element("div");
    			div5 = element("div");
    			form = element("form");
    			div4 = element("div");
    			ul = element("ul");
    			li0 = element("li");
    			select = element("select");
    			option0 = element("option");
    			option0.textContent = "-- Please choose an option --";
    			option1 = element("option");
    			option1.textContent = "Ask Question";
    			option2 = element("option");
    			option2.textContent = "Send Resume To Become A Coach";
    			option3 = element("option");
    			option3.textContent = "Request a feature/service";
    			option4 = element("option");
    			option4.textContent = "Other";
    			t7 = space();
    			li1 = element("li");
    			div1 = element("div");
    			input0 = element("input");
    			t8 = space();
    			input1 = element("input");
    			t9 = space();
    			li2 = element("li");
    			textarea = element("textarea");
    			t10 = space();
    			div3 = element("div");
    			div2 = element("div");
    			div2.textContent = "REQUIRED FIELDS";
    			t12 = space();
    			button0 = element("button");
    			span0 = element("span");
    			span0.textContent = "SUBMIT";
    			t14 = space();
    			button1 = element("button");
    			span1 = element("span");
    			span1.textContent = "RESET";
    			attr_dev(h1, "class", "svelte-k7gngf");
    			add_location(h1, file$6, 6, 8, 85);
    			attr_dev(div0, "class", "title svelte-k7gngf");
    			add_location(div0, file$6, 5, 4, 57);
    			option0.selected = true;
    			option0.disabled = true;
    			option0.__value = "-- Please choose an option --";
    			option0.value = option0.__value;
    			attr_dev(option0, "class", "svelte-k7gngf");
    			add_location(option0, file$6, 16, 10, 302);
    			option1.__value = "Ask Question";
    			option1.value = option1.__value;
    			attr_dev(option1, "class", "svelte-k7gngf");
    			add_location(option1, file$6, 17, 10, 377);
    			option2.__value = "Send Resume To Become A Coach";
    			option2.value = option2.__value;
    			attr_dev(option2, "class", "svelte-k7gngf");
    			add_location(option2, file$6, 18, 10, 417);
    			option3.__value = "Request a feature/service";
    			option3.value = option3.__value;
    			attr_dev(option3, "class", "svelte-k7gngf");
    			add_location(option3, file$6, 19, 10, 474);
    			option4.__value = "Other";
    			option4.value = option4.__value;
    			attr_dev(option4, "class", "svelte-k7gngf");
    			add_location(option4, file$6, 20, 10, 527);
    			attr_dev(select, "class", "svelte-k7gngf");
    			add_location(select, file$6, 15, 8, 283);
    			attr_dev(li0, "class", "svelte-k7gngf");
    			add_location(li0, file$6, 14, 6, 270);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "placeholder", "Name");
    			input0.required = true;
    			attr_dev(input0, "class", "svelte-k7gngf");
    			add_location(input0, file$6, 25, 10, 641);
    			attr_dev(input1, "type", "email");
    			attr_dev(input1, "placeholder", "Email");
    			input1.required = true;
    			attr_dev(input1, "class", "svelte-k7gngf");
    			add_location(input1, file$6, 26, 10, 699);
    			attr_dev(div1, "class", "grid grid-2 svelte-k7gngf");
    			add_location(div1, file$6, 24, 8, 605);
    			attr_dev(li1, "class", "svelte-k7gngf");
    			add_location(li1, file$6, 23, 6, 592);
    			attr_dev(textarea, "placeholder", "Message");
    			attr_dev(textarea, "class", "svelte-k7gngf");
    			add_location(textarea, file$6, 30, 8, 798);
    			attr_dev(li2, "class", "svelte-k7gngf");
    			add_location(li2, file$6, 29, 6, 785);
    			attr_dev(div2, "class", "required-msg svelte-k7gngf");
    			add_location(div2, file$6, 33, 10, 901);
    			attr_dev(span0, "class", "front svelte-k7gngf");
    			add_location(span0, file$6, 35, 12, 1011);
    			attr_dev(button0, "class", "btn-grid svelte-k7gngf");
    			attr_dev(button0, "type", "submit");
    			add_location(button0, file$6, 34, 10, 959);
    			attr_dev(span1, "class", "front svelte-k7gngf");
    			add_location(span1, file$6, 38, 12, 1126);
    			attr_dev(button1, "class", "btn-grid svelte-k7gngf");
    			attr_dev(button1, "type", "reset");
    			add_location(button1, file$6, 37, 10, 1075);
    			attr_dev(div3, "class", "grid grid-3 svelte-k7gngf");
    			add_location(div3, file$6, 32, 8, 865);
    			attr_dev(ul, "class", "svelte-k7gngf");
    			add_location(ul, file$6, 13, 4, 259);
    			attr_dev(div4, "class", "container svelte-k7gngf");
    			add_location(div4, file$6, 12, 2, 231);
    			attr_dev(form, "class", "my-form svelte-k7gngf");
    			add_location(form, file$6, 11, 8, 206);
    			attr_dev(div5, "class", "content-container svelte-k7gngf");
    			add_location(div5, file$6, 10, 8, 166);
    			attr_dev(div6, "class", "contact-content-container svelte-k7gngf");
    			add_location(div6, file$6, 9, 4, 118);
    			attr_dev(div7, "class", "contact-container svelte-k7gngf");
    			add_location(div7, file$6, 4, 0, 21);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div7, anchor);
    			append_dev(div7, div0);
    			append_dev(div0, h1);
    			append_dev(div7, t1);
    			append_dev(div7, div6);
    			append_dev(div6, div5);
    			append_dev(div5, form);
    			append_dev(form, div4);
    			append_dev(div4, ul);
    			append_dev(ul, li0);
    			append_dev(li0, select);
    			append_dev(select, option0);
    			append_dev(select, option1);
    			append_dev(select, option2);
    			append_dev(select, option3);
    			append_dev(select, option4);
    			append_dev(ul, t7);
    			append_dev(ul, li1);
    			append_dev(li1, div1);
    			append_dev(div1, input0);
    			append_dev(div1, t8);
    			append_dev(div1, input1);
    			append_dev(ul, t9);
    			append_dev(ul, li2);
    			append_dev(li2, textarea);
    			append_dev(ul, t10);
    			append_dev(ul, div3);
    			append_dev(div3, div2);
    			append_dev(div3, t12);
    			append_dev(div3, button0);
    			append_dev(button0, span0);
    			append_dev(div3, t14);
    			append_dev(div3, button1);
    			append_dev(button1, span1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div7);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Contact', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Contact> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Contact extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Contact",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src/home-components/footer.svelte generated by Svelte v3.59.2 */

    const file$5 = "src/home-components/footer.svelte";

    function create_fragment$6(ctx) {
    	let div2;
    	let div0;
    	let a0;
    	let i0;
    	let t0;
    	let a1;
    	let i1;
    	let t1;
    	let a2;
    	let i2;
    	let t2;
    	let a3;
    	let i3;
    	let t3;
    	let div1;
    	let h6;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			a0 = element("a");
    			i0 = element("i");
    			t0 = space();
    			a1 = element("a");
    			i1 = element("i");
    			t1 = space();
    			a2 = element("a");
    			i2 = element("i");
    			t2 = space();
    			a3 = element("a");
    			i3 = element("i");
    			t3 = space();
    			div1 = element("div");
    			h6 = element("h6");
    			h6.textContent = "© 2023 HumbleBeast Coaching";
    			attr_dev(i0, "class", "fa-brands fa-instagram");
    			set_style(i0, "color", "#ffffff");
    			add_location(i0, file$5, 4, 19, 170);
    			attr_dev(a0, "href", "");
    			attr_dev(a0, "class", "svelte-3aetk7");
    			add_location(a0, file$5, 4, 8, 159);
    			attr_dev(i1, "class", "fa-brands fa-twitter");
    			set_style(i1, "color", "#ffffff");
    			add_location(i1, file$5, 5, 19, 256);
    			attr_dev(a1, "href", "");
    			attr_dev(a1, "class", "svelte-3aetk7");
    			add_location(a1, file$5, 5, 8, 245);
    			attr_dev(i2, "class", "fa-brands fa-facebook");
    			set_style(i2, "color", "#ffffff");
    			add_location(i2, file$5, 6, 19, 340);
    			attr_dev(a2, "href", "");
    			attr_dev(a2, "class", "svelte-3aetk7");
    			add_location(a2, file$5, 6, 8, 329);
    			attr_dev(i3, "class", "fa-brands fa-youtube");
    			set_style(i3, "color", "#ffffff");
    			add_location(i3, file$5, 7, 19, 425);
    			attr_dev(a3, "href", "");
    			attr_dev(a3, "class", "svelte-3aetk7");
    			add_location(a3, file$5, 7, 8, 414);
    			attr_dev(div0, "class", "socials-container svelte-3aetk7");
    			add_location(div0, file$5, 3, 4, 119);
    			attr_dev(h6, "class", "svelte-3aetk7");
    			add_location(h6, file$5, 10, 8, 529);
    			attr_dev(div1, "class", "C svelte-3aetk7");
    			add_location(div1, file$5, 9, 4, 505);
    			attr_dev(div2, "class", "container svelte-3aetk7");
    			add_location(div2, file$5, 2, 0, 91);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, a0);
    			append_dev(a0, i0);
    			append_dev(div0, t0);
    			append_dev(div0, a1);
    			append_dev(a1, i1);
    			append_dev(div0, t1);
    			append_dev(div0, a2);
    			append_dev(a2, i2);
    			append_dev(div0, t2);
    			append_dev(div0, a3);
    			append_dev(a3, i3);
    			append_dev(div2, t3);
    			append_dev(div2, div1);
    			append_dev(div1, h6);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Footer', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src/pages/homePage.svelte generated by Svelte v3.59.2 */
    const file$4 = "src/pages/homePage.svelte";

    function create_fragment$5(ctx) {
    	let t0;
    	let body;
    	let section0;
    	let navbar;
    	let t1;
    	let section1;
    	let hero;
    	let t2;
    	let section2;
    	let pricing;
    	let t3;
    	let section3;
    	let resources;
    	let t4;
    	let section4;
    	let contact;
    	let t5;
    	let section5;
    	let footer;
    	let current;
    	navbar = new Nav_bar({ $$inline: true });
    	hero = new Hero({ $$inline: true });
    	pricing = new Pricing({ $$inline: true });
    	resources = new Resources({ $$inline: true });
    	contact = new Contact({ $$inline: true });
    	footer = new Footer({ $$inline: true });

    	const block = {
    		c: function create() {
    			t0 = space();
    			body = element("body");
    			section0 = element("section");
    			create_component(navbar.$$.fragment);
    			t1 = space();
    			section1 = element("section");
    			create_component(hero.$$.fragment);
    			t2 = space();
    			section2 = element("section");
    			create_component(pricing.$$.fragment);
    			t3 = space();
    			section3 = element("section");
    			create_component(resources.$$.fragment);
    			t4 = space();
    			section4 = element("section");
    			create_component(contact.$$.fragment);
    			t5 = space();
    			section5 = element("section");
    			create_component(footer.$$.fragment);
    			document.title = "HUMBLEBEAST Coaching";
    			attr_dev(section0, "id", "nav");
    			attr_dev(section0, "class", "svelte-blzzfp");
    			add_location(section0, file$4, 13, 4, 461);
    			attr_dev(section1, "id", "hero");
    			attr_dev(section1, "class", "svelte-blzzfp");
    			add_location(section1, file$4, 17, 4, 521);
    			attr_dev(section2, "id", "price");
    			attr_dev(section2, "class", "svelte-blzzfp");
    			add_location(section2, file$4, 21, 4, 580);
    			attr_dev(section3, "id", "resources");
    			attr_dev(section3, "class", "svelte-blzzfp");
    			add_location(section3, file$4, 25, 4, 643);
    			attr_dev(section4, "id", "contact");
    			attr_dev(section4, "class", "svelte-blzzfp");
    			add_location(section4, file$4, 29, 4, 712);
    			attr_dev(section5, "id", "footer");
    			attr_dev(section5, "class", "svelte-blzzfp");
    			add_location(section5, file$4, 33, 4, 774);
    			attr_dev(body, "class", "svelte-blzzfp");
    			add_location(body, file$4, 12, 0, 450);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, body, anchor);
    			append_dev(body, section0);
    			mount_component(navbar, section0, null);
    			append_dev(body, t1);
    			append_dev(body, section1);
    			mount_component(hero, section1, null);
    			append_dev(body, t2);
    			append_dev(body, section2);
    			mount_component(pricing, section2, null);
    			append_dev(body, t3);
    			append_dev(body, section3);
    			mount_component(resources, section3, null);
    			append_dev(body, t4);
    			append_dev(body, section4);
    			mount_component(contact, section4, null);
    			append_dev(body, t5);
    			append_dev(body, section5);
    			mount_component(footer, section5, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navbar.$$.fragment, local);
    			transition_in(hero.$$.fragment, local);
    			transition_in(pricing.$$.fragment, local);
    			transition_in(resources.$$.fragment, local);
    			transition_in(contact.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navbar.$$.fragment, local);
    			transition_out(hero.$$.fragment, local);
    			transition_out(pricing.$$.fragment, local);
    			transition_out(resources.$$.fragment, local);
    			transition_out(contact.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(body);
    			destroy_component(navbar);
    			destroy_component(hero);
    			destroy_component(pricing);
    			destroy_component(resources);
    			destroy_component(contact);
    			destroy_component(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('HomePage', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<HomePage> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		NavBar: Nav_bar,
    		Hero,
    		Pricing,
    		Resources,
    		Contact,
    		Footer
    	});

    	return [];
    }

    class HomePage extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "HomePage",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/pages/userAuthPage.svelte generated by Svelte v3.59.2 */

    const { document: document_1 } = globals;
    const file$3 = "src/pages/userAuthPage.svelte";

    function create_fragment$4(ctx) {
    	let title_value;
    	let t0;
    	let main;
    	let div7;
    	let div6;
    	let div2;
    	let h10;
    	let t2;
    	let div0;
    	let h11;
    	let t4;
    	let form0;
    	let input0;
    	let t5;
    	let br0;
    	let br1;
    	let t6;
    	let input1;
    	let t7;
    	let br2;
    	let br3;
    	let t8;
    	let div1;
    	let input2;
    	let t9;
    	let button0;
    	let t11;
    	let h60;
    	let t12;
    	let span0;
    	let t14;
    	let div5;
    	let h12;
    	let t16;
    	let div3;
    	let h13;
    	let t18;
    	let form1;
    	let input3;
    	let t19;
    	let br4;
    	let br5;
    	let t20;
    	let input4;
    	let t21;
    	let br6;
    	let br7;
    	let t22;
    	let input5;
    	let t23;
    	let br8;
    	let br9;
    	let t24;
    	let div4;
    	let input6;
    	let t25;
    	let button1;
    	let t27;
    	let h61;
    	let t28;
    	let span1;
    	let mounted;
    	let dispose;

    	document_1.title = title_value = /*loginFormActive*/ ctx[2]
    	? 'HumbleBeast Login'
    	: 'HumbleBeast Signup';

    	const block = {
    		c: function create() {
    			t0 = space();
    			main = element("main");
    			div7 = element("div");
    			div6 = element("div");
    			div2 = element("div");
    			h10 = element("h1");
    			h10.textContent = "Login";
    			t2 = space();
    			div0 = element("div");
    			h11 = element("h1");
    			h11.textContent = "Error";
    			t4 = space();
    			form0 = element("form");
    			input0 = element("input");
    			t5 = space();
    			br0 = element("br");
    			br1 = element("br");
    			t6 = space();
    			input1 = element("input");
    			t7 = space();
    			br2 = element("br");
    			br3 = element("br");
    			t8 = space();
    			div1 = element("div");
    			input2 = element("input");
    			t9 = space();
    			button0 = element("button");
    			button0.textContent = "Back";
    			t11 = space();
    			h60 = element("h6");
    			t12 = text("Not a member? ");
    			span0 = element("span");
    			span0.textContent = "Signup";
    			t14 = space();
    			div5 = element("div");
    			h12 = element("h1");
    			h12.textContent = "Signup";
    			t16 = space();
    			div3 = element("div");
    			h13 = element("h1");
    			h13.textContent = "Error";
    			t18 = space();
    			form1 = element("form");
    			input3 = element("input");
    			t19 = space();
    			br4 = element("br");
    			br5 = element("br");
    			t20 = space();
    			input4 = element("input");
    			t21 = space();
    			br6 = element("br");
    			br7 = element("br");
    			t22 = space();
    			input5 = element("input");
    			t23 = space();
    			br8 = element("br");
    			br9 = element("br");
    			t24 = space();
    			div4 = element("div");
    			input6 = element("input");
    			t25 = space();
    			button1 = element("button");
    			button1.textContent = "Back";
    			t27 = space();
    			h61 = element("h6");
    			t28 = text("Already a member? ");
    			span1 = element("span");
    			span1.textContent = "Login";
    			attr_dev(h10, "class", "title svelte-pybn9g");
    			add_location(h10, file$3, 82, 16, 2474);
    			attr_dev(h11, "class", "svelte-pybn9g");
    			add_location(h11, file$3, 84, 20, 2563);
    			attr_dev(div0, "class", "error-msg svelte-pybn9g");
    			add_location(div0, file$3, 83, 16, 2519);
    			attr_dev(input0, "name", "Email");
    			attr_dev(input0, "placeholder", "Email");
    			attr_dev(input0, "class", "input-field svelte-pybn9g");
    			attr_dev(input0, "autocomplete", "off");
    			add_location(input0, file$3, 87, 17, 2724);
    			attr_dev(br0, "class", "svelte-pybn9g");
    			add_location(br0, file$3, 88, 17, 2821);
    			attr_dev(br1, "class", "svelte-pybn9g");
    			add_location(br1, file$3, 88, 21, 2825);
    			attr_dev(input1, "type", "password");
    			attr_dev(input1, "name", "Pass");
    			attr_dev(input1, "placeholder", "Password");
    			attr_dev(input1, "class", "input-field svelte-pybn9g");
    			attr_dev(input1, "autocomplete", "off");
    			add_location(input1, file$3, 89, 17, 2847);
    			attr_dev(br2, "class", "svelte-pybn9g");
    			add_location(br2, file$3, 90, 17, 2962);
    			attr_dev(br3, "class", "svelte-pybn9g");
    			add_location(br3, file$3, 90, 21, 2966);
    			attr_dev(input2, "type", "submit");
    			input2.value = "Login";
    			attr_dev(input2, "class", "login svelte-pybn9g");
    			attr_dev(input2, "id", "Login-submit");
    			add_location(input2, file$3, 92, 20, 3037);
    			attr_dev(button0, "class", "login svelte-pybn9g");
    			add_location(button0, file$3, 93, 20, 3125);
    			attr_dev(div1, "class", "btns-container svelte-pybn9g");
    			add_location(div1, file$3, 91, 17, 2988);
    			attr_dev(span0, "class", "little-msg svelte-pybn9g");
    			add_location(span0, file$3, 95, 53, 3259);
    			attr_dev(h60, "class", "sign-text svelte-pybn9g");
    			add_location(h60, file$3, 95, 17, 3223);
    			attr_dev(form0, "action", "");
    			attr_dev(form0, "name", "Login");
    			attr_dev(form0, "id", "Login-form");
    			attr_dev(form0, "class", "svelte-pybn9g");
    			add_location(form0, file$3, 86, 16, 2617);
    			attr_dev(div2, "class", "login-container svelte-pybn9g");
    			add_location(div2, file$3, 81, 12, 2406);
    			attr_dev(h12, "class", "title svelte-pybn9g");
    			add_location(h12, file$3, 99, 16, 3455);
    			attr_dev(h13, "class", "svelte-pybn9g");
    			add_location(h13, file$3, 101, 20, 3545);
    			attr_dev(div3, "class", "error-msg svelte-pybn9g");
    			add_location(div3, file$3, 100, 16, 3501);
    			attr_dev(input3, "type", "email");
    			attr_dev(input3, "name", "Email1");
    			attr_dev(input3, "placeholder", "Email");
    			attr_dev(input3, "class", "input-field svelte-pybn9g");
    			attr_dev(input3, "autocomplete", "off");
    			add_location(input3, file$3, 104, 17, 3703);
    			attr_dev(br4, "class", "svelte-pybn9g");
    			add_location(br4, file$3, 105, 17, 3814);
    			attr_dev(br5, "class", "svelte-pybn9g");
    			add_location(br5, file$3, 105, 21, 3818);
    			attr_dev(input4, "type", "password");
    			attr_dev(input4, "name", "Pass1");
    			attr_dev(input4, "placeholder", "Password");
    			attr_dev(input4, "class", "input-field svelte-pybn9g");
    			attr_dev(input4, "autocomplete", "off");
    			add_location(input4, file$3, 106, 17, 3840);
    			attr_dev(br6, "class", "svelte-pybn9g");
    			add_location(br6, file$3, 107, 17, 3956);
    			attr_dev(br7, "class", "svelte-pybn9g");
    			add_location(br7, file$3, 107, 21, 3960);
    			attr_dev(input5, "type", "password");
    			attr_dev(input5, "name", "ConPass");
    			attr_dev(input5, "placeholder", "Confirm Password");
    			attr_dev(input5, "class", "input-field svelte-pybn9g");
    			attr_dev(input5, "autocomplete", "off");
    			add_location(input5, file$3, 108, 17, 3982);
    			attr_dev(br8, "class", "svelte-pybn9g");
    			add_location(br8, file$3, 109, 17, 4108);
    			attr_dev(br9, "class", "svelte-pybn9g");
    			add_location(br9, file$3, 109, 21, 4112);
    			attr_dev(input6, "type", "submit");
    			input6.value = "Signup";
    			attr_dev(input6, "class", "login svelte-pybn9g");
    			attr_dev(input6, "id", "Signup-Submit");
    			add_location(input6, file$3, 111, 21, 4184);
    			attr_dev(button1, "class", "login svelte-pybn9g");
    			add_location(button1, file$3, 112, 21, 4275);
    			attr_dev(div4, "class", "btns-container svelte-pybn9g");
    			add_location(div4, file$3, 110, 17, 4134);
    			attr_dev(span1, "class", "little-msg svelte-pybn9g");
    			add_location(span1, file$3, 114, 57, 4414);
    			attr_dev(h61, "class", "sign-text svelte-pybn9g");
    			add_location(h61, file$3, 114, 17, 4374);
    			attr_dev(form1, "action", "");
    			attr_dev(form1, "id", "Signup");
    			attr_dev(form1, "name", "Signup");
    			attr_dev(form1, "class", "svelte-pybn9g");
    			add_location(form1, file$3, 103, 16, 3599);
    			attr_dev(div5, "class", "signup-container svelte-pybn9g");
    			add_location(div5, file$3, 98, 12, 3385);
    			attr_dev(div6, "class", "form-container svelte-pybn9g");
    			add_location(div6, file$3, 80, 8, 2365);
    			attr_dev(div7, "class", "container svelte-pybn9g");
    			add_location(div7, file$3, 79, 4, 2333);
    			attr_dev(main, "class", "svelte-pybn9g");
    			add_location(main, file$3, 78, 0, 2322);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, div7);
    			append_dev(div7, div6);
    			append_dev(div6, div2);
    			append_dev(div2, h10);
    			append_dev(div2, t2);
    			append_dev(div2, div0);
    			append_dev(div0, h11);
    			append_dev(div2, t4);
    			append_dev(div2, form0);
    			append_dev(form0, input0);
    			append_dev(form0, t5);
    			append_dev(form0, br0);
    			append_dev(form0, br1);
    			append_dev(form0, t6);
    			append_dev(form0, input1);
    			append_dev(form0, t7);
    			append_dev(form0, br2);
    			append_dev(form0, br3);
    			append_dev(form0, t8);
    			append_dev(form0, div1);
    			append_dev(div1, input2);
    			append_dev(div1, t9);
    			append_dev(div1, button0);
    			append_dev(form0, t11);
    			append_dev(form0, h60);
    			append_dev(h60, t12);
    			append_dev(h60, span0);
    			/*div2_binding*/ ctx[7](div2);
    			append_dev(div6, t14);
    			append_dev(div6, div5);
    			append_dev(div5, h12);
    			append_dev(div5, t16);
    			append_dev(div5, div3);
    			append_dev(div3, h13);
    			append_dev(div5, t18);
    			append_dev(div5, form1);
    			append_dev(form1, input3);
    			append_dev(form1, t19);
    			append_dev(form1, br4);
    			append_dev(form1, br5);
    			append_dev(form1, t20);
    			append_dev(form1, input4);
    			append_dev(form1, t21);
    			append_dev(form1, br6);
    			append_dev(form1, br7);
    			append_dev(form1, t22);
    			append_dev(form1, input5);
    			append_dev(form1, t23);
    			append_dev(form1, br8);
    			append_dev(form1, br9);
    			append_dev(form1, t24);
    			append_dev(form1, div4);
    			append_dev(div4, input6);
    			append_dev(div4, t25);
    			append_dev(div4, button1);
    			append_dev(form1, t27);
    			append_dev(form1, h61);
    			append_dev(h61, t28);
    			append_dev(h61, span1);
    			/*div5_binding*/ ctx[8](div5);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*handleBack*/ ctx[6], false, false, false, false),
    					listen_dev(span0, "click", /*switchToSignUp*/ ctx[3], false, false, false, false),
    					listen_dev(form0, "submit", prevent_default(/*handleSubmission*/ ctx[5]), false, true, false, false),
    					listen_dev(button1, "click", /*handleBack*/ ctx[6], false, false, false, false),
    					listen_dev(span1, "click", /*switchToLogin*/ ctx[4], false, false, false, false),
    					listen_dev(form1, "submit", prevent_default(/*handleSubmission*/ ctx[5]), false, true, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*loginFormActive*/ 4 && title_value !== (title_value = /*loginFormActive*/ ctx[2]
    			? 'HumbleBeast Login'
    			: 'HumbleBeast Signup')) {
    				document_1.title = title_value;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			/*div2_binding*/ ctx[7](null);
    			/*div5_binding*/ ctx[8](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('UserAuthPage', slots, []);
    	let loginPage;
    	let signupPage;
    	let loginFormActive = true;
    	let errorMsg = [];
    	let loginLine = [];

    	const handleBinds = () => {
    		loginLine = document.querySelectorAll('.input-field');
    		errorMsg = document.querySelectorAll('.error-msg');
    	};

    	onMount(handleBinds);

    	//switch pages
    	const switchToSignUp = () => {
    		$$invalidate(0, loginPage.style.display = "none", loginPage);
    		$$invalidate(1, signupPage.style.display = "block", signupPage);
    		$$invalidate(2, loginFormActive = false);
    	};

    	const switchToLogin = () => {
    		$$invalidate(0, loginPage.style.display = "block", loginPage);
    		$$invalidate(1, signupPage.style.display = "none", signupPage);
    		$$invalidate(2, loginFormActive = true);
    	};

    	const handleSubmission = () => {
    		if (loginFormActive) {
    			//form validation for signin
    			if (!document.Login.Email.value.includes("@") || document.Login.Pass.value == "") {
    				handleError(0, '');
    			} else {
    				handleSignin(document.Login.Email.value, document.Login.Pass.value);
    			}
    		} else {
    			//form validation for signup
    			if (!document.Signup.Email1.value.includes("@") || !(document.Signup.Pass1.value === document.Signup.ConPass.value)) {
    				handleError(1, '');
    			} else {
    				handleSignup(document.Signup.Email1.value, document.Signup.Pass1.value);
    			} //createAccount            
    		}
    	};

    	const handleError = (elementIndex, errorMsgFromServer) => {
    		errorMsgFromServer !== ''
    		? errorMsg[elementIndex].textContent = errorMsgFromServer
    		: errorMsg[elementIndex].textContent = "Please Fill Out Credentials Correctly";

    		errorMsg[elementIndex].style.display = "block";

    		loginLine.forEach(el => {
    			el.style.borderColor = "#F77559";
    			el.style.setProperty("--g", "red");
    			el.value = "";
    		});
    	};

    	const handleSignup = (email, password) => {
    		state.set('dashboard');
    	};

    	const handleSignin = (email, password) => {
    		state.set('dashboard');
    	};

    	const handleBack = () => {
    		state.set('front-page');
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<UserAuthPage> was created with unknown prop '${key}'`);
    	});

    	function div2_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			loginPage = $$value;
    			$$invalidate(0, loginPage);
    		});
    	}

    	function div5_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			signupPage = $$value;
    			$$invalidate(1, signupPage);
    		});
    	}

    	$$self.$capture_state = () => ({
    		onMount,
    		state,
    		loginPage,
    		signupPage,
    		loginFormActive,
    		errorMsg,
    		loginLine,
    		handleBinds,
    		switchToSignUp,
    		switchToLogin,
    		handleSubmission,
    		handleError,
    		handleSignup,
    		handleSignin,
    		handleBack
    	});

    	$$self.$inject_state = $$props => {
    		if ('loginPage' in $$props) $$invalidate(0, loginPage = $$props.loginPage);
    		if ('signupPage' in $$props) $$invalidate(1, signupPage = $$props.signupPage);
    		if ('loginFormActive' in $$props) $$invalidate(2, loginFormActive = $$props.loginFormActive);
    		if ('errorMsg' in $$props) errorMsg = $$props.errorMsg;
    		if ('loginLine' in $$props) loginLine = $$props.loginLine;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		loginPage,
    		signupPage,
    		loginFormActive,
    		switchToSignUp,
    		switchToLogin,
    		handleSubmission,
    		handleBack,
    		div2_binding,
    		div5_binding
    	];
    }

    class UserAuthPage extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "UserAuthPage",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/utils/MediaQuery.svelte generated by Svelte v3.59.2 */
    const get_default_slot_changes = dirty => ({ matches: dirty & /*matches*/ 1 });
    const get_default_slot_context = ctx => ({ matches: /*matches*/ ctx[0] });

    function create_fragment$3(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], get_default_slot_context);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, matches*/ 9)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[3],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MediaQuery', slots, ['default']);
    	let { query } = $$props;
    	let mql;
    	let mqlListener;
    	let wasMounted = false;
    	let matches = false;

    	onMount(() => {
    		$$invalidate(2, wasMounted = true);

    		return () => {
    			removeActiveListener();
    		};
    	});

    	function addNewListener(query) {
    		mql = window.matchMedia(query);
    		mqlListener = v => $$invalidate(0, matches = v.matches);
    		mql.addListener(mqlListener);
    		$$invalidate(0, matches = mql.matches);
    	}

    	function removeActiveListener() {
    		if (mql && mqlListener) {
    			mql.removeListener(mqlListener);
    		}
    	}

    	$$self.$$.on_mount.push(function () {
    		if (query === undefined && !('query' in $$props || $$self.$$.bound[$$self.$$.props['query']])) {
    			console.warn("<MediaQuery> was created without expected prop 'query'");
    		}
    	});

    	const writable_props = ['query'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MediaQuery> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('query' in $$props) $$invalidate(1, query = $$props.query);
    		if ('$$scope' in $$props) $$invalidate(3, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		query,
    		mql,
    		mqlListener,
    		wasMounted,
    		matches,
    		addNewListener,
    		removeActiveListener
    	});

    	$$self.$inject_state = $$props => {
    		if ('query' in $$props) $$invalidate(1, query = $$props.query);
    		if ('mql' in $$props) mql = $$props.mql;
    		if ('mqlListener' in $$props) mqlListener = $$props.mqlListener;
    		if ('wasMounted' in $$props) $$invalidate(2, wasMounted = $$props.wasMounted);
    		if ('matches' in $$props) $$invalidate(0, matches = $$props.matches);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*wasMounted, query*/ 6) {
    			{
    				if (wasMounted) {
    					removeActiveListener();
    					addNewListener(query);
    				}
    			}
    		}
    	};

    	return [matches, query, wasMounted, $$scope, slots];
    }

    class MediaQuery extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { query: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MediaQuery",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get query() {
    		throw new Error("<MediaQuery>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set query(value) {
    		throw new Error("<MediaQuery>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const colors = {
        'mainBackground': '#242529',
        'color': 'white',
        'activeColor': '#353537',
        'checkedColor': '#242529',
        'lineColor': '#2c2d32'
    };

    /* src/dashboard-components/nav.svelte generated by Svelte v3.59.2 */
    const file$2 = "src/dashboard-components/nav.svelte";

    // (73:12) {:else}
    function create_else_block_1(ctx) {
    	let li0;
    	let a0;
    	let i0;
    	let t0;
    	let li0_class_value;
    	let t1;
    	let li1;
    	let a1;
    	let i1;
    	let t2;
    	let li1_class_value;
    	let t3;
    	let li2;
    	let a2;
    	let i2;
    	let t4;
    	let li2_class_value;
    	let t5;
    	let li3;
    	let a3;
    	let i3;
    	let t6;
    	let li3_class_value;
    	let t7;
    	let li4;
    	let a4;
    	let i4;
    	let t8;
    	let li4_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			li0 = element("li");
    			a0 = element("a");
    			i0 = element("i");
    			t0 = text("Dashboard");
    			t1 = space();
    			li1 = element("li");
    			a1 = element("a");
    			i1 = element("i");
    			t2 = text("Messages");
    			t3 = space();
    			li2 = element("li");
    			a2 = element("a");
    			i2 = element("i");
    			t4 = text("Schedule");
    			t5 = space();
    			li3 = element("li");
    			a3 = element("a");
    			i3 = element("i");
    			t6 = text("Managment");
    			t7 = space();
    			li4 = element("li");
    			a4 = element("a");
    			i4 = element("i");
    			t8 = text("Settings");
    			attr_dev(i0, "class", "fa-solid fa-grip-vertical nav-icon svelte-dc8w61");
    			add_location(i0, file$2, 73, 130, 2887);
    			attr_dev(a0, "href", "#");
    			attr_dev(a0, "class", "svelte-dc8w61");
    			add_location(a0, file$2, 73, 77, 2834);
    			attr_dev(li0, "class", li0_class_value = "list-items " + (/*current*/ ctx[1] === 'Dashboard' ? 'active' : '') + " svelte-dc8w61");
    			add_location(li0, file$2, 73, 12, 2769);
    			attr_dev(i1, "class", "fa-solid fa-envelope nav-icon svelte-dc8w61");
    			add_location(i1, file$2, 74, 128, 3084);
    			attr_dev(a1, "href", "#");
    			attr_dev(a1, "class", "svelte-dc8w61");
    			add_location(a1, file$2, 74, 76, 3032);
    			attr_dev(li1, "class", li1_class_value = "list-items " + (/*current*/ ctx[1] === 'Messages' ? 'active' : '') + " svelte-dc8w61");
    			add_location(li1, file$2, 74, 12, 2968);
    			attr_dev(i2, "class", "fa-regular fa-calendar-days nav-icon svelte-dc8w61");
    			add_location(i2, file$2, 75, 128, 3275);
    			attr_dev(a2, "href", "#");
    			attr_dev(a2, "class", "svelte-dc8w61");
    			add_location(a2, file$2, 75, 76, 3223);
    			attr_dev(li2, "class", li2_class_value = "list-items " + (/*current*/ ctx[1] === 'Schedule' ? 'active' : '') + " svelte-dc8w61");
    			add_location(li2, file$2, 75, 12, 3159);
    			attr_dev(i3, "class", "fa-solid fa-users nav-icon svelte-dc8w61");
    			add_location(i3, file$2, 76, 130, 3475);
    			attr_dev(a3, "href", "#");
    			attr_dev(a3, "class", "svelte-dc8w61");
    			add_location(a3, file$2, 76, 77, 3422);
    			attr_dev(li3, "class", li3_class_value = "list-items " + (/*current*/ ctx[1] === 'Managment' ? 'active' : '') + " svelte-dc8w61");
    			add_location(li3, file$2, 76, 12, 3357);
    			attr_dev(i4, "class", "fa-solid fa-gear nav-icon svelte-dc8w61");
    			add_location(i4, file$2, 77, 128, 3664);
    			attr_dev(a4, "href", "#");
    			attr_dev(a4, "class", "svelte-dc8w61");
    			add_location(a4, file$2, 77, 76, 3612);
    			attr_dev(li4, "class", li4_class_value = "list-items " + (/*current*/ ctx[1] === 'Settings' ? 'active' : '') + " svelte-dc8w61");
    			add_location(li4, file$2, 77, 12, 3548);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li0, anchor);
    			append_dev(li0, a0);
    			append_dev(a0, i0);
    			append_dev(a0, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, li1, anchor);
    			append_dev(li1, a1);
    			append_dev(a1, i1);
    			append_dev(a1, t2);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, li2, anchor);
    			append_dev(li2, a2);
    			append_dev(a2, i2);
    			append_dev(a2, t4);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, li3, anchor);
    			append_dev(li3, a3);
    			append_dev(a3, i3);
    			append_dev(a3, t6);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, li4, anchor);
    			append_dev(li4, a4);
    			append_dev(a4, i4);
    			append_dev(a4, t8);

    			if (!mounted) {
    				dispose = [
    					listen_dev(a0, "click", /*click_handler_5*/ ctx[12], false, false, false, false),
    					listen_dev(a1, "click", /*click_handler_6*/ ctx[13], false, false, false, false),
    					listen_dev(a2, "click", /*click_handler_7*/ ctx[14], false, false, false, false),
    					listen_dev(a3, "click", /*click_handler_8*/ ctx[15], false, false, false, false),
    					listen_dev(a4, "click", /*click_handler_9*/ ctx[16], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*current*/ 2 && li0_class_value !== (li0_class_value = "list-items " + (/*current*/ ctx[1] === 'Dashboard' ? 'active' : '') + " svelte-dc8w61")) {
    				attr_dev(li0, "class", li0_class_value);
    			}

    			if (dirty & /*current*/ 2 && li1_class_value !== (li1_class_value = "list-items " + (/*current*/ ctx[1] === 'Messages' ? 'active' : '') + " svelte-dc8w61")) {
    				attr_dev(li1, "class", li1_class_value);
    			}

    			if (dirty & /*current*/ 2 && li2_class_value !== (li2_class_value = "list-items " + (/*current*/ ctx[1] === 'Schedule' ? 'active' : '') + " svelte-dc8w61")) {
    				attr_dev(li2, "class", li2_class_value);
    			}

    			if (dirty & /*current*/ 2 && li3_class_value !== (li3_class_value = "list-items " + (/*current*/ ctx[1] === 'Managment' ? 'active' : '') + " svelte-dc8w61")) {
    				attr_dev(li3, "class", li3_class_value);
    			}

    			if (dirty & /*current*/ 2 && li4_class_value !== (li4_class_value = "list-items " + (/*current*/ ctx[1] === 'Settings' ? 'active' : '') + " svelte-dc8w61")) {
    				attr_dev(li4, "class", li4_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(li1);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(li2);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(li3);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(li4);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(73:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (67:8) {#if matches}
    function create_if_block_1$1(ctx) {
    	let li0;
    	let a0;
    	let i0;
    	let li0_class_value;
    	let t0;
    	let li1;
    	let a1;
    	let i1;
    	let li1_class_value;
    	let t1;
    	let li2;
    	let a2;
    	let i2;
    	let li2_class_value;
    	let t2;
    	let li3;
    	let a3;
    	let i3;
    	let li3_class_value;
    	let t3;
    	let li4;
    	let a4;
    	let i4;
    	let li4_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			li0 = element("li");
    			a0 = element("a");
    			i0 = element("i");
    			t0 = space();
    			li1 = element("li");
    			a1 = element("a");
    			i1 = element("i");
    			t1 = space();
    			li2 = element("li");
    			a2 = element("a");
    			i2 = element("i");
    			t2 = space();
    			li3 = element("li");
    			a3 = element("a");
    			i3 = element("i");
    			t3 = space();
    			li4 = element("li");
    			a4 = element("a");
    			i4 = element("i");
    			attr_dev(i0, "class", "fa-solid fa-grip-vertical nav-icon svelte-dc8w61");
    			add_location(i0, file$2, 67, 130, 1943);
    			attr_dev(a0, "href", "#");
    			attr_dev(a0, "class", "svelte-dc8w61");
    			add_location(a0, file$2, 67, 77, 1890);
    			attr_dev(li0, "class", li0_class_value = "list-items " + (/*current*/ ctx[1] === 'Dashboard' ? 'active' : '') + " svelte-dc8w61");
    			add_location(li0, file$2, 67, 12, 1825);
    			attr_dev(i1, "class", "fa-solid fa-envelope nav-icon svelte-dc8w61");
    			add_location(i1, file$2, 68, 128, 2131);
    			attr_dev(a1, "href", "#");
    			attr_dev(a1, "class", "svelte-dc8w61");
    			add_location(a1, file$2, 68, 76, 2079);
    			attr_dev(li1, "class", li1_class_value = "list-items " + (/*current*/ ctx[1] === 'Messages' ? 'active' : '') + " svelte-dc8w61");
    			add_location(li1, file$2, 68, 12, 2015);
    			attr_dev(i2, "class", "fa-regular fa-calendar-days nav-icon svelte-dc8w61");
    			add_location(i2, file$2, 69, 128, 2314);
    			attr_dev(a2, "href", "#");
    			attr_dev(a2, "class", "svelte-dc8w61");
    			add_location(a2, file$2, 69, 76, 2262);
    			attr_dev(li2, "class", li2_class_value = "list-items " + (/*current*/ ctx[1] === 'Schedule' ? 'active' : '') + " svelte-dc8w61");
    			add_location(li2, file$2, 69, 12, 2198);
    			attr_dev(i3, "class", "fa-solid fa-users nav-icon svelte-dc8w61");
    			add_location(i3, file$2, 70, 130, 2506);
    			attr_dev(a3, "href", "#");
    			attr_dev(a3, "class", "svelte-dc8w61");
    			add_location(a3, file$2, 70, 77, 2453);
    			attr_dev(li3, "class", li3_class_value = "list-items " + (/*current*/ ctx[1] === 'Managment' ? 'active' : '') + " svelte-dc8w61");
    			add_location(li3, file$2, 70, 12, 2388);
    			attr_dev(i4, "class", "fa-solid fa-gear nav-icon svelte-dc8w61");
    			add_location(i4, file$2, 71, 128, 2686);
    			attr_dev(a4, "href", "#");
    			attr_dev(a4, "class", "svelte-dc8w61");
    			add_location(a4, file$2, 71, 76, 2634);
    			attr_dev(li4, "class", li4_class_value = "list-items " + (/*current*/ ctx[1] === 'Settings' ? 'active' : '') + " svelte-dc8w61");
    			add_location(li4, file$2, 71, 12, 2570);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li0, anchor);
    			append_dev(li0, a0);
    			append_dev(a0, i0);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, li1, anchor);
    			append_dev(li1, a1);
    			append_dev(a1, i1);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, li2, anchor);
    			append_dev(li2, a2);
    			append_dev(a2, i2);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, li3, anchor);
    			append_dev(li3, a3);
    			append_dev(a3, i3);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, li4, anchor);
    			append_dev(li4, a4);
    			append_dev(a4, i4);

    			if (!mounted) {
    				dispose = [
    					listen_dev(a0, "click", /*click_handler*/ ctx[7], false, false, false, false),
    					listen_dev(a1, "click", /*click_handler_1*/ ctx[8], false, false, false, false),
    					listen_dev(a2, "click", /*click_handler_2*/ ctx[9], false, false, false, false),
    					listen_dev(a3, "click", /*click_handler_3*/ ctx[10], false, false, false, false),
    					listen_dev(a4, "click", /*click_handler_4*/ ctx[11], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*current*/ 2 && li0_class_value !== (li0_class_value = "list-items " + (/*current*/ ctx[1] === 'Dashboard' ? 'active' : '') + " svelte-dc8w61")) {
    				attr_dev(li0, "class", li0_class_value);
    			}

    			if (dirty & /*current*/ 2 && li1_class_value !== (li1_class_value = "list-items " + (/*current*/ ctx[1] === 'Messages' ? 'active' : '') + " svelte-dc8w61")) {
    				attr_dev(li1, "class", li1_class_value);
    			}

    			if (dirty & /*current*/ 2 && li2_class_value !== (li2_class_value = "list-items " + (/*current*/ ctx[1] === 'Schedule' ? 'active' : '') + " svelte-dc8w61")) {
    				attr_dev(li2, "class", li2_class_value);
    			}

    			if (dirty & /*current*/ 2 && li3_class_value !== (li3_class_value = "list-items " + (/*current*/ ctx[1] === 'Managment' ? 'active' : '') + " svelte-dc8w61")) {
    				attr_dev(li3, "class", li3_class_value);
    			}

    			if (dirty & /*current*/ 2 && li4_class_value !== (li4_class_value = "list-items " + (/*current*/ ctx[1] === 'Settings' ? 'active' : '') + " svelte-dc8w61")) {
    				attr_dev(li4, "class", li4_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(li1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(li2);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(li3);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(li4);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(67:8) {#if matches}",
    		ctx
    	});

    	return block;
    }

    // (66:12) <MediaQuery query="(max-width: 1500px)" let:matches>
    function create_default_slot_1(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*matches*/ ctx[19]) return create_if_block_1$1;
    		return create_else_block_1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(66:12) <MediaQuery query=\\\"(max-width: 1500px)\\\" let:matches>",
    		ctx
    	});

    	return block;
    }

    // (88:12) {:else}
    function create_else_block(ctx) {
    	let label0;
    	let t1;
    	let input;
    	let t2;
    	let label1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label0 = element("label");
    			label0.textContent = "Dark";
    			t1 = space();
    			input = element("input");
    			t2 = space();
    			label1 = element("label");
    			label1.textContent = "Light";
    			attr_dev(label0, "for", "toggle on Dark Mode");
    			attr_dev(label0, "class", "svelte-dc8w61");
    			add_location(label0, file$2, 88, 16, 4002);
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "class", "svelte-dc8w61");
    			add_location(input, file$2, 89, 16, 4064);
    			attr_dev(label1, "for", "toggle on Light Mode");
    			attr_dev(label1, "class", "svelte-dc8w61");
    			add_location(label1, file$2, 90, 16, 4129);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, input, anchor);
    			input.checked = /*lightMode*/ ctx[0];
    			insert_dev(target, t2, anchor);
    			insert_dev(target, label1, anchor);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*input_change_handler_1*/ ctx[18]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*lightMode*/ 1) {
    				input.checked = /*lightMode*/ ctx[0];
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(input);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(label1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(88:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (86:12) {#if matches}
    function create_if_block$1(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "class", "svelte-dc8w61");
    			add_location(input, file$2, 86, 16, 3917);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			input.checked = /*lightMode*/ ctx[0];

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*input_change_handler*/ ctx[17]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*lightMode*/ 1) {
    				input.checked = /*lightMode*/ ctx[0];
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(86:12) {#if matches}",
    		ctx
    	});

    	return block;
    }

    // (85:8) <MediaQuery query="(max-width: 1500px)" let:matches>
    function create_default_slot(ctx) {
    	let if_block_anchor;

    	function select_block_type_1(ctx, dirty) {
    		if (/*matches*/ ctx[19]) return create_if_block$1;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(85:8) <MediaQuery query=\\\"(max-width: 1500px)\\\" let:matches>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let script;
    	let script_src_value;
    	let t0;
    	let div7;
    	let div0;
    	let h30;
    	let t2;
    	let div4;
    	let div1;
    	let img;
    	let img_src_value;
    	let t3;
    	let div2;
    	let h31;
    	let t5;
    	let div3;
    	let button;
    	let t7;
    	let div5;
    	let ul;
    	let mediaquery0;
    	let t8;
    	let div6;
    	let mediaquery1;
    	let current;

    	mediaquery0 = new MediaQuery({
    			props: {
    				query: "(max-width: 1500px)",
    				$$slots: {
    					default: [
    						create_default_slot_1,
    						({ matches }) => ({ 19: matches }),
    						({ matches }) => matches ? 524288 : 0
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	mediaquery1 = new MediaQuery({
    			props: {
    				query: "(max-width: 1500px)",
    				$$slots: {
    					default: [
    						create_default_slot,
    						({ matches }) => ({ 19: matches }),
    						({ matches }) => matches ? 524288 : 0
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			script = element("script");
    			t0 = space();
    			div7 = element("div");
    			div0 = element("div");
    			h30 = element("h3");
    			h30.textContent = "HB";
    			t2 = space();
    			div4 = element("div");
    			div1 = element("div");
    			img = element("img");
    			t3 = space();
    			div2 = element("div");
    			h31 = element("h3");
    			h31.textContent = "Brian Kim";
    			t5 = space();
    			div3 = element("div");
    			button = element("button");
    			button.textContent = "Edit";
    			t7 = space();
    			div5 = element("div");
    			ul = element("ul");
    			create_component(mediaquery0.$$.fragment);
    			t8 = space();
    			div6 = element("div");
    			create_component(mediaquery1.$$.fragment);
    			if (!src_url_equal(script.src, script_src_value = "https://kit.fontawesome.com/db3c0028dc.js")) attr_dev(script, "src", script_src_value);
    			attr_dev(script, "crossorigin", "anonymous");
    			attr_dev(script, "class", "svelte-dc8w61");
    			add_location(script, file$2, 35, 4, 924);
    			attr_dev(h30, "class", "svelte-dc8w61");
    			add_location(h30, file$2, 46, 8, 1255);
    			attr_dev(div0, "class", "logo-container svelte-dc8w61");
    			add_location(div0, file$2, 45, 4, 1218);
    			if (!src_url_equal(img.src, img_src_value = "https://t3.ftcdn.net/jpg/05/47/85/88/360_F_547858830_cnWFvIG7SYsC2GLRDoojuZToysoUna4Y.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "user");
    			attr_dev(img, "class", "svelte-dc8w61");
    			add_location(img, file$2, 51, 12, 1363);
    			attr_dev(div1, "class", "img-container svelte-dc8w61");
    			add_location(div1, file$2, 50, 8, 1323);
    			attr_dev(h31, "class", "svelte-dc8w61");
    			add_location(h31, file$2, 54, 12, 1540);
    			attr_dev(div2, "class", "name-container svelte-dc8w61");
    			add_location(div2, file$2, 53, 8, 1499);
    			attr_dev(button, "class", "svelte-dc8w61");
    			add_location(button, file$2, 57, 12, 1630);
    			attr_dev(div3, "class", "profile-btn-container svelte-dc8w61");
    			add_location(div3, file$2, 56, 8, 1582);
    			attr_dev(div4, "class", "profile-container svelte-dc8w61");
    			add_location(div4, file$2, 49, 4, 1283);
    			attr_dev(ul, "class", "svelte-dc8w61");
    			add_location(ul, file$2, 63, 8, 1720);
    			attr_dev(div5, "class", "nav-container svelte-dc8w61");
    			add_location(div5, file$2, 62, 4, 1684);
    			attr_dev(div6, "class", "mode-container svelte-dc8w61");
    			add_location(div6, file$2, 83, 4, 3785);
    			attr_dev(div7, "class", "container svelte-dc8w61");
    			set_style(div7, "--main-background", /*mainBackground*/ ctx[2]);
    			set_style(div7, "--color", /*color*/ ctx[3]);
    			set_style(div7, "--active", /*activeColor*/ ctx[4]);
    			set_style(div7, "--checked", /*checkedColor*/ ctx[5]);
    			set_style(div7, "--line", /*lineColor*/ ctx[6]);
    			add_location(div7, file$2, 38, 0, 1030);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, script);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div7, anchor);
    			append_dev(div7, div0);
    			append_dev(div0, h30);
    			append_dev(div7, t2);
    			append_dev(div7, div4);
    			append_dev(div4, div1);
    			append_dev(div1, img);
    			append_dev(div4, t3);
    			append_dev(div4, div2);
    			append_dev(div2, h31);
    			append_dev(div4, t5);
    			append_dev(div4, div3);
    			append_dev(div3, button);
    			append_dev(div7, t7);
    			append_dev(div7, div5);
    			append_dev(div5, ul);
    			mount_component(mediaquery0, ul, null);
    			append_dev(div7, t8);
    			append_dev(div7, div6);
    			mount_component(mediaquery1, div6, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const mediaquery0_changes = {};

    			if (dirty & /*$$scope, current, matches*/ 1572866) {
    				mediaquery0_changes.$$scope = { dirty, ctx };
    			}

    			mediaquery0.$set(mediaquery0_changes);
    			const mediaquery1_changes = {};

    			if (dirty & /*$$scope, lightMode, matches*/ 1572865) {
    				mediaquery1_changes.$$scope = { dirty, ctx };
    			}

    			mediaquery1.$set(mediaquery1_changes);

    			if (!current || dirty & /*mainBackground*/ 4) {
    				set_style(div7, "--main-background", /*mainBackground*/ ctx[2]);
    			}

    			if (!current || dirty & /*color*/ 8) {
    				set_style(div7, "--color", /*color*/ ctx[3]);
    			}

    			if (!current || dirty & /*activeColor*/ 16) {
    				set_style(div7, "--active", /*activeColor*/ ctx[4]);
    			}

    			if (!current || dirty & /*checkedColor*/ 32) {
    				set_style(div7, "--checked", /*checkedColor*/ ctx[5]);
    			}

    			if (!current || dirty & /*lineColor*/ 64) {
    				set_style(div7, "--line", /*lineColor*/ ctx[6]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(mediaquery0.$$.fragment, local);
    			transition_in(mediaquery1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(mediaquery0.$$.fragment, local);
    			transition_out(mediaquery1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			detach_dev(script);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div7);
    			destroy_component(mediaquery0);
    			destroy_component(mediaquery1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Nav', slots, []);
    	let current = 'Dashboard';
    	let lightMode = false;

    	//default colors for dark mode
    	let mainBackground, color, activeColor, checkedColor, lineColor = { colors };

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Nav> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(1, current = 'Dashboard');
    	const click_handler_1 = () => $$invalidate(1, current = 'Messages');
    	const click_handler_2 = () => $$invalidate(1, current = 'Schedule');
    	const click_handler_3 = () => $$invalidate(1, current = 'Managment');
    	const click_handler_4 = () => $$invalidate(1, current = 'Settings');
    	const click_handler_5 = () => $$invalidate(1, current = 'Dashboard');
    	const click_handler_6 = () => $$invalidate(1, current = 'Messages');
    	const click_handler_7 = () => $$invalidate(1, current = 'Schedule');
    	const click_handler_8 = () => $$invalidate(1, current = 'Managment');
    	const click_handler_9 = () => $$invalidate(1, current = 'Settings');

    	function input_change_handler() {
    		lightMode = this.checked;
    		$$invalidate(0, lightMode);
    	}

    	function input_change_handler_1() {
    		lightMode = this.checked;
    		$$invalidate(0, lightMode);
    	}

    	$$self.$capture_state = () => ({
    		MediaQuery,
    		colors,
    		dashState,
    		current,
    		lightMode,
    		mainBackground,
    		color,
    		activeColor,
    		checkedColor,
    		lineColor
    	});

    	$$self.$inject_state = $$props => {
    		if ('current' in $$props) $$invalidate(1, current = $$props.current);
    		if ('lightMode' in $$props) $$invalidate(0, lightMode = $$props.lightMode);
    		if ('mainBackground' in $$props) $$invalidate(2, mainBackground = $$props.mainBackground);
    		if ('color' in $$props) $$invalidate(3, color = $$props.color);
    		if ('activeColor' in $$props) $$invalidate(4, activeColor = $$props.activeColor);
    		if ('checkedColor' in $$props) $$invalidate(5, checkedColor = $$props.checkedColor);
    		if ('lineColor' in $$props) $$invalidate(6, lineColor = $$props.lineColor);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*lightMode*/ 1) {
    			{
    				if (lightMode) {
    					$$invalidate(2, mainBackground = 'white');
    					$$invalidate(3, color = '#242529');
    					$$invalidate(4, activeColor = 'grey');
    					$$invalidate(5, checkedColor = '#242529');
    					$$invalidate(6, lineColor = '#D3D3D3');
    					dashState.set(["dash", "light-mode"]);
    				} else {
    					$$invalidate(2, mainBackground = '#242529');
    					$$invalidate(3, color = 'white');
    					$$invalidate(4, activeColor = '#353537');
    					$$invalidate(5, checkedColor = '#242529');
    					$$invalidate(6, lineColor = '#2c2d32');
    					dashState.set(["dash", "dark-mode"]);
    				}
    			}
    		}
    	};

    	return [
    		lightMode,
    		current,
    		mainBackground,
    		color,
    		activeColor,
    		checkedColor,
    		lineColor,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5,
    		click_handler_6,
    		click_handler_7,
    		click_handler_8,
    		click_handler_9,
    		input_change_handler,
    		input_change_handler_1
    	];
    }

    class Nav extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Nav",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/pages/dashboard.svelte generated by Svelte v3.59.2 */
    const file$1 = "src/pages/dashboard.svelte";

    function create_fragment$1(ctx) {
    	let body;
    	let div;
    	let nav;
    	let current;
    	nav = new Nav({ $$inline: true });

    	const block = {
    		c: function create() {
    			body = element("body");
    			div = element("div");
    			create_component(nav.$$.fragment);
    			attr_dev(div, "class", "container svelte-1cqlr2j");
    			add_location(div, file$1, 38, 4, 921);
    			set_style(body, "--main-background", /*mainBackground*/ ctx[0]);
    			set_style(body, "--color", /*color*/ ctx[1]);
    			set_style(body, "--active", /*activeColor*/ ctx[2]);
    			set_style(body, "--checked", /*checkedColor*/ ctx[3]);
    			set_style(body, "--line", /*lineColor*/ ctx[4]);
    			attr_dev(body, "class", "svelte-1cqlr2j");
    			add_location(body, file$1, 30, 0, 752);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, body, anchor);
    			append_dev(body, div);
    			mount_component(nav, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*mainBackground*/ 1) {
    				set_style(body, "--main-background", /*mainBackground*/ ctx[0]);
    			}

    			if (!current || dirty & /*color*/ 2) {
    				set_style(body, "--color", /*color*/ ctx[1]);
    			}

    			if (!current || dirty & /*activeColor*/ 4) {
    				set_style(body, "--active", /*activeColor*/ ctx[2]);
    			}

    			if (!current || dirty & /*checkedColor*/ 8) {
    				set_style(body, "--checked", /*checkedColor*/ ctx[3]);
    			}

    			if (!current || dirty & /*lineColor*/ 16) {
    				set_style(body, "--line", /*lineColor*/ ctx[4]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(nav.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(nav.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(body);
    			destroy_component(nav);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $dashState;
    	validate_store(dashState, 'dashState');
    	component_subscribe($$self, dashState, $$value => $$invalidate(6, $dashState = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Dashboard', slots, []);
    	let state;
    	let mainBackground, color, activeColor, checkedColor, lineColor = { colors };
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Dashboard> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Nav,
    		colors,
    		dashState,
    		onMount,
    		state,
    		mainBackground,
    		color,
    		activeColor,
    		checkedColor,
    		lineColor,
    		$dashState
    	});

    	$$self.$inject_state = $$props => {
    		if ('state' in $$props) $$invalidate(5, state = $$props.state);
    		if ('mainBackground' in $$props) $$invalidate(0, mainBackground = $$props.mainBackground);
    		if ('color' in $$props) $$invalidate(1, color = $$props.color);
    		if ('activeColor' in $$props) $$invalidate(2, activeColor = $$props.activeColor);
    		if ('checkedColor' in $$props) $$invalidate(3, checkedColor = $$props.checkedColor);
    		if ('lineColor' in $$props) $$invalidate(4, lineColor = $$props.lineColor);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$dashState, state*/ 96) {
    			{
    				$$invalidate(5, state = $dashState);

    				if (state[1] === 'light-mode') {
    					$$invalidate(0, mainBackground = 'white');
    					$$invalidate(1, color = '#242529');
    					$$invalidate(2, activeColor = 'grey');
    					$$invalidate(3, checkedColor = '#242529');
    					$$invalidate(4, lineColor = '#D3D3D3');
    				} else {
    					$$invalidate(0, mainBackground = '#242529');
    					$$invalidate(1, color = 'white');
    					$$invalidate(2, activeColor = '#353537');
    					$$invalidate(3, checkedColor = '#242529');
    					$$invalidate(4, lineColor = '#2c2d32');
    				}
    			}
    		}
    	};

    	return [mainBackground, color, activeColor, checkedColor, lineColor, state, $dashState];
    }

    class Dashboard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Dashboard",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.59.2 */
    const file = "src/App.svelte";

    // (31:43) 
    function create_if_block_2(ctx) {
    	let dashboard;
    	let current;
    	dashboard = new Dashboard({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(dashboard.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dashboard, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dashboard.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dashboard.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dashboard, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(31:43) ",
    		ctx
    	});

    	return block;
    }

    // (29:41) 
    function create_if_block_1(ctx) {
    	let userauthpage;
    	let current;
    	userauthpage = new UserAuthPage({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(userauthpage.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(userauthpage, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(userauthpage.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(userauthpage.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(userauthpage, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(29:41) ",
    		ctx
    	});

    	return block;
    }

    // (27:4) {#if currentState === "front-page"}
    function create_if_block(ctx) {
    	let homepage;
    	let current;
    	homepage = new HomePage({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(homepage.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(homepage, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(homepage.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(homepage.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(homepage, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(27:4) {#if currentState === \\\"front-page\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let t;
    	let body;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block, create_if_block_1, create_if_block_2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*currentState*/ ctx[0] === "front-page") return 0;
    		if (/*currentState*/ ctx[0] === "signIn") return 1;
    		if (/*currentState*/ ctx[0] === "dashboard") return 2;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			t = space();
    			body = element("body");
    			if (if_block) if_block.c();
    			document.title = "HUMBLEBEAST Coaching";
    			attr_dev(body, "class", "svelte-1ccah1n");
    			add_location(body, file, 25, 0, 503);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    			insert_dev(target, body, anchor);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(body, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index !== previous_block_index) {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					}

    					transition_in(if_block, 1);
    					if_block.m(body, null);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(body);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let currentState;

    	onMount(() => {
    		const unsubscribe = state.subscribe(value => {
    			$$invalidate(0, currentState = value);
    		});

    		return unsubscribe;
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		state,
    		onMount,
    		HomePage,
    		UserAuthPage,
    		Dashboard,
    		currentState
    	});

    	$$self.$inject_state = $$props => {
    		if ('currentState' in $$props) $$invalidate(0, currentState = $$props.currentState);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [currentState];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
