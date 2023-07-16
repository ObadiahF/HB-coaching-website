
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
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
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
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

    const scrollIntoView = (componentId) => {
        const component = document.getElementById(componentId);
        component.scrollIntoView({ behavior: 'smooth' });
    };

    /* src/components/nav-bar.svelte generated by Svelte v3.59.2 */
    const file$8 = "src/components/nav-bar.svelte";

    // (54:12) {:else}
    function create_else_block(ctx) {
    	let i;

    	const block = {
    		c: function create() {
    			i = element("i");
    			attr_dev(i, "class", "fa-solid fa-bars svelte-htf06f");
    			set_style(i, "color", "#ffffff");
    			add_location(i, file$8, 54, 16, 1568);
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
    		id: create_else_block.name,
    		type: "else",
    		source: "(54:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (52:12) {#if open}
    function create_if_block$1(ctx) {
    	let i;

    	const block = {
    		c: function create() {
    			i = element("i");
    			attr_dev(i, "class", "fa-solid fa-x svelte-htf06f");
    			set_style(i, "color", "#ffffff");
    			add_location(i, file$8, 52, 16, 1478);
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
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(52:12) {#if open}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
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
    		if (/*open*/ ctx[0]) return create_if_block$1;
    		return create_else_block;
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
    			add_location(script, file$8, 1, 4, 18);
    			attr_dev(h1, "class", "svelte-htf06f");
    			add_location(h1, file$8, 41, 8, 925);
    			attr_dev(a0, "class", "svelte-htf06f");
    			add_location(a0, file$8, 43, 16, 1027);
    			attr_dev(a1, "class", "svelte-htf06f");
    			add_location(a1, file$8, 44, 16, 1089);
    			attr_dev(a2, "class", "svelte-htf06f");
    			add_location(a2, file$8, 45, 16, 1157);
    			attr_dev(a3, "class", "svelte-htf06f");
    			add_location(a3, file$8, 46, 16, 1229);
    			attr_dev(button0, "id", "signIn");
    			attr_dev(button0, "class", "svelte-htf06f");
    			add_location(button0, file$8, 47, 16, 1297);
    			attr_dev(ul, "class", ul_class_value = "" + (null_to_empty(/*open*/ ctx[0] === false ? 'nav-items' : 'mobile') + " svelte-htf06f"));
    			add_location(ul, file$8, 42, 12, 958);
    			attr_dev(button1, "id", "mobile");
    			attr_dev(button1, "class", "svelte-htf06f");
    			add_location(button1, file$8, 50, 8, 1390);
    			attr_dev(div, "class", "nav-bar svelte-htf06f");
    			add_location(div, file$8, 40, 0, 895);
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
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Nav_bar",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src/components/hero.svelte generated by Svelte v3.59.2 */
    const file$7 = "src/components/hero.svelte";

    function create_fragment$7(ctx) {
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
    			add_location(h1, file$7, 13, 20, 354);
    			attr_dev(div0, "class", "hero-title-container svelte-17sdxeu");
    			add_location(div0, file$7, 12, 16, 299);
    			attr_dev(p, "class", "svelte-17sdxeu");
    			add_location(p, file$7, 16, 20, 481);
    			attr_dev(div1, "class", "paragraph-container svelte-17sdxeu");
    			add_location(div1, file$7, 15, 16, 427);
    			attr_dev(button0, "id", "meet");
    			attr_dev(button0, "class", "hero-btn svelte-17sdxeu");
    			add_location(button0, file$7, 19, 20, 775);
    			attr_dev(button1, "id", "pricing");
    			attr_dev(button1, "class", "hero-btn svelte-17sdxeu");
    			add_location(button1, file$7, 20, 20, 856);
    			attr_dev(div2, "class", "btn-container svelte-17sdxeu");
    			add_location(div2, file$7, 18, 16, 727);
    			attr_dev(div3, "class", "hero-container svelte-17sdxeu");
    			add_location(div3, file$7, 11, 12, 254);
    			attr_dev(div4, "class", "gradient svelte-17sdxeu");
    			add_location(div4, file$7, 10, 8, 219);
    			attr_dev(div5, "class", "black-column svelte-17sdxeu");
    			add_location(div5, file$7, 9, 4, 184);
    			if (!src_url_equal(img.src, img_src_value = "pictures/brian.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Brians a cool guy");
    			attr_dev(img, "height", "248px");
    			attr_dev(img, "width", "341");
    			attr_dev(img, "class", "svelte-17sdxeu");
    			add_location(img, file$7, 26, 8, 1055);
    			attr_dev(div6, "class", "picture-container svelte-17sdxeu");
    			add_location(div6, file$7, 25, 4, 1015);
    			attr_dev(div7, "class", "container svelte-17sdxeu");
    			add_location(div7, file$7, 8, 0, 156);
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
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Hero",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src/components/pricing.svelte generated by Svelte v3.59.2 */

    const file$6 = "src/components/pricing.svelte";

    function create_fragment$6(ctx) {
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
    			add_location(script, file$6, 5, 0, 35);
    			attr_dev(h10, "class", "svelte-1en6bye");
    			add_location(h10, file$6, 10, 8, 197);
    			attr_dev(div0, "class", "title svelte-1en6bye");
    			add_location(div0, file$6, 9, 4, 169);
    			attr_dev(h60, "class", "svelte-1en6bye");
    			add_location(h60, file$6, 16, 12, 305);
    			attr_dev(h11, "class", "svelte-1en6bye");
    			add_location(h11, file$6, 17, 12, 335);
    			attr_dev(i0, "class", "fa-solid fa-check svelte-1en6bye");
    			set_style(i0, "color", "#ffffff");
    			add_location(i0, file$6, 19, 20, 405);
    			attr_dev(li0, "class", "svelte-1en6bye");
    			add_location(li0, file$6, 19, 16, 401);
    			attr_dev(i1, "class", "fa-solid fa-check svelte-1en6bye");
    			set_style(i1, "color", "#ffffff");
    			add_location(i1, file$6, 20, 20, 506);
    			attr_dev(li1, "class", "svelte-1en6bye");
    			add_location(li1, file$6, 20, 16, 502);
    			attr_dev(i2, "class", "fa-solid fa-check svelte-1en6bye");
    			set_style(i2, "color", "#ffffff");
    			add_location(i2, file$6, 21, 20, 610);
    			attr_dev(li2, "class", "svelte-1en6bye");
    			add_location(li2, file$6, 21, 16, 606);
    			attr_dev(i3, "class", "fa-solid fa-check svelte-1en6bye");
    			set_style(i3, "color", "#ffffff");
    			add_location(i3, file$6, 22, 20, 715);
    			attr_dev(li3, "class", "svelte-1en6bye");
    			add_location(li3, file$6, 22, 16, 711);
    			attr_dev(ul0, "class", "parts svelte-1en6bye");
    			add_location(ul0, file$6, 18, 12, 366);
    			attr_dev(button0, "class", "call-to-action svelte-1en6bye");
    			add_location(button0, file$6, 24, 12, 824);
    			attr_dev(div1, "class", "options svelte-1en6bye");
    			add_location(div1, file$6, 15, 8, 271);
    			attr_dev(h61, "class", "svelte-1en6bye");
    			add_location(h61, file$6, 28, 12, 938);
    			attr_dev(h12, "class", "svelte-1en6bye");
    			add_location(h12, file$6, 29, 12, 967);
    			attr_dev(i4, "class", "fa-solid fa-check svelte-1en6bye");
    			set_style(i4, "color", "#ffffff");
    			add_location(i4, file$6, 31, 20, 1037);
    			attr_dev(li4, "class", "svelte-1en6bye");
    			add_location(li4, file$6, 31, 16, 1033);
    			attr_dev(i5, "class", "fa-solid fa-check svelte-1en6bye");
    			set_style(i5, "color", "#ffffff");
    			add_location(i5, file$6, 32, 20, 1135);
    			attr_dev(li5, "class", "svelte-1en6bye");
    			add_location(li5, file$6, 32, 16, 1131);
    			attr_dev(i6, "class", "fa-solid fa-check svelte-1en6bye");
    			set_style(i6, "color", "#ffffff");
    			add_location(i6, file$6, 33, 20, 1238);
    			attr_dev(li6, "class", "svelte-1en6bye");
    			add_location(li6, file$6, 33, 16, 1234);
    			attr_dev(i7, "class", "fa-solid fa-check svelte-1en6bye");
    			set_style(i7, "color", "#ffffff");
    			add_location(i7, file$6, 34, 20, 1340);
    			attr_dev(li7, "class", "svelte-1en6bye");
    			add_location(li7, file$6, 34, 16, 1336);
    			attr_dev(ul1, "class", "parts svelte-1en6bye");
    			add_location(ul1, file$6, 30, 12, 998);
    			attr_dev(button1, "class", "call-to-action svelte-1en6bye");
    			add_location(button1, file$6, 36, 12, 1452);
    			attr_dev(div2, "class", "options svelte-1en6bye");
    			add_location(div2, file$6, 27, 8, 904);
    			attr_dev(h62, "class", "svelte-1en6bye");
    			add_location(h62, file$6, 40, 12, 1565);
    			attr_dev(h13, "class", "svelte-1en6bye");
    			add_location(h13, file$6, 41, 12, 1592);
    			attr_dev(i8, "class", "fa-solid fa-check svelte-1en6bye");
    			set_style(i8, "color", "#ffffff");
    			add_location(i8, file$6, 43, 20, 1662);
    			attr_dev(li8, "class", "svelte-1en6bye");
    			add_location(li8, file$6, 43, 16, 1658);
    			attr_dev(i9, "class", "fa-solid fa-check svelte-1en6bye");
    			set_style(i9, "color", "#ffffff");
    			add_location(i9, file$6, 44, 20, 1759);
    			attr_dev(li9, "class", "svelte-1en6bye");
    			add_location(li9, file$6, 44, 16, 1755);
    			attr_dev(i10, "class", "fa-solid fa-check svelte-1en6bye");
    			set_style(i10, "color", "#ffffff");
    			add_location(i10, file$6, 45, 20, 1862);
    			attr_dev(li10, "class", "svelte-1en6bye");
    			add_location(li10, file$6, 45, 16, 1858);
    			attr_dev(i11, "class", "fa-solid fa-check svelte-1en6bye");
    			set_style(i11, "color", "#ffffff");
    			add_location(i11, file$6, 46, 20, 1964);
    			attr_dev(li11, "class", "svelte-1en6bye");
    			add_location(li11, file$6, 46, 16, 1960);
    			attr_dev(ul2, "class", "parts svelte-1en6bye");
    			add_location(ul2, file$6, 42, 12, 1623);
    			attr_dev(button2, "class", "call-to-action svelte-1en6bye");
    			add_location(button2, file$6, 48, 12, 2076);
    			attr_dev(div3, "class", "options svelte-1en6bye");
    			add_location(div3, file$6, 39, 8, 1531);
    			attr_dev(div4, "class", "options-container svelte-1en6bye");
    			add_location(div4, file$6, 13, 4, 230);
    			attr_dev(div5, "class", "container svelte-1en6bye");
    			add_location(div5, file$6, 8, 0, 141);
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
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props) {
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
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Pricing",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src/components/resources.svelte generated by Svelte v3.59.2 */

    const file$5 = "src/components/resources.svelte";

    function create_fragment$5(ctx) {
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
    			add_location(h1, file$5, 6, 8, 77);
    			attr_dev(div0, "class", "title svelte-1vhp63q");
    			add_location(div0, file$5, 5, 4, 49);
    			attr_dev(iframe0, "width", "560");
    			attr_dev(iframe0, "height", "315");
    			if (!src_url_equal(iframe0.src, iframe0_src_value = "https://www.youtube-nocookie.com/embed/q3EItdmyf2A")) attr_dev(iframe0, "src", iframe0_src_value);
    			attr_dev(iframe0, "title", "YouTube video player");
    			attr_dev(iframe0, "frameborder", "0");
    			attr_dev(iframe0, "allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share");
    			iframe0.allowFullscreen = true;
    			attr_dev(iframe0, "class", "svelte-1vhp63q");
    			add_location(iframe0, file$5, 9, 8, 150);
    			attr_dev(iframe1, "width", "560");
    			attr_dev(iframe1, "height", "315");
    			if (!src_url_equal(iframe1.src, iframe1_src_value = "https://www.youtube-nocookie.com/embed/jLg9kdVUwoE")) attr_dev(iframe1, "src", iframe1_src_value);
    			attr_dev(iframe1, "title", "YouTube video player");
    			attr_dev(iframe1, "frameborder", "0");
    			attr_dev(iframe1, "allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share");
    			iframe1.allowFullscreen = true;
    			attr_dev(iframe1, "class", "svelte-1vhp63q");
    			add_location(iframe1, file$5, 10, 8, 427);
    			attr_dev(iframe2, "width", "560");
    			attr_dev(iframe2, "height", "315");
    			if (!src_url_equal(iframe2.src, iframe2_src_value = "https://www.youtube-nocookie.com/embed/d1z_-Kc6DS4")) attr_dev(iframe2, "src", iframe2_src_value);
    			attr_dev(iframe2, "title", "YouTube video player");
    			attr_dev(iframe2, "frameborder", "0");
    			attr_dev(iframe2, "allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share");
    			iframe2.allowFullscreen = true;
    			attr_dev(iframe2, "class", "svelte-1vhp63q");
    			add_location(iframe2, file$5, 11, 8, 708);
    			attr_dev(div1, "class", "videos-container svelte-1vhp63q");
    			add_location(div1, file$5, 8, 4, 111);
    			attr_dev(div2, "class", "container");
    			add_location(div2, file$5, 4, 0, 21);
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
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props) {
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
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Resources",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/components/contact.svelte generated by Svelte v3.59.2 */

    const file$4 = "src/components/contact.svelte";

    function create_fragment$4(ctx) {
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
    	let t6;
    	let li1;
    	let div1;
    	let input0;
    	let t7;
    	let input1;
    	let t8;
    	let li2;
    	let textarea;
    	let t9;
    	let div3;
    	let div2;
    	let t11;
    	let button0;
    	let span0;
    	let t13;
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
    			option3.textContent = "Other";
    			t6 = space();
    			li1 = element("li");
    			div1 = element("div");
    			input0 = element("input");
    			t7 = space();
    			input1 = element("input");
    			t8 = space();
    			li2 = element("li");
    			textarea = element("textarea");
    			t9 = space();
    			div3 = element("div");
    			div2 = element("div");
    			div2.textContent = "REQUIRED FIELDS";
    			t11 = space();
    			button0 = element("button");
    			span0 = element("span");
    			span0.textContent = "SUBMIT";
    			t13 = space();
    			button1 = element("button");
    			span1 = element("span");
    			span1.textContent = "RESET";
    			attr_dev(h1, "class", "svelte-k7gngf");
    			add_location(h1, file$4, 6, 8, 85);
    			attr_dev(div0, "class", "title svelte-k7gngf");
    			add_location(div0, file$4, 5, 4, 57);
    			option0.selected = true;
    			option0.disabled = true;
    			option0.__value = "-- Please choose an option --";
    			option0.value = option0.__value;
    			attr_dev(option0, "class", "svelte-k7gngf");
    			add_location(option0, file$4, 16, 10, 302);
    			option1.__value = "Ask Question";
    			option1.value = option1.__value;
    			attr_dev(option1, "class", "svelte-k7gngf");
    			add_location(option1, file$4, 17, 10, 377);
    			option2.__value = "Send Resume To Become A Coach";
    			option2.value = option2.__value;
    			attr_dev(option2, "class", "svelte-k7gngf");
    			add_location(option2, file$4, 18, 10, 417);
    			option3.__value = "Other";
    			option3.value = option3.__value;
    			attr_dev(option3, "class", "svelte-k7gngf");
    			add_location(option3, file$4, 19, 10, 474);
    			attr_dev(select, "class", "svelte-k7gngf");
    			add_location(select, file$4, 15, 8, 283);
    			attr_dev(li0, "class", "svelte-k7gngf");
    			add_location(li0, file$4, 14, 6, 270);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "placeholder", "Name");
    			input0.required = true;
    			attr_dev(input0, "class", "svelte-k7gngf");
    			add_location(input0, file$4, 24, 10, 588);
    			attr_dev(input1, "type", "email");
    			attr_dev(input1, "placeholder", "Email");
    			input1.required = true;
    			attr_dev(input1, "class", "svelte-k7gngf");
    			add_location(input1, file$4, 25, 10, 646);
    			attr_dev(div1, "class", "grid grid-2 svelte-k7gngf");
    			add_location(div1, file$4, 23, 8, 552);
    			attr_dev(li1, "class", "svelte-k7gngf");
    			add_location(li1, file$4, 22, 6, 539);
    			attr_dev(textarea, "placeholder", "Message");
    			attr_dev(textarea, "class", "svelte-k7gngf");
    			add_location(textarea, file$4, 29, 8, 745);
    			attr_dev(li2, "class", "svelte-k7gngf");
    			add_location(li2, file$4, 28, 6, 732);
    			attr_dev(div2, "class", "required-msg svelte-k7gngf");
    			add_location(div2, file$4, 32, 10, 848);
    			attr_dev(span0, "class", "front svelte-k7gngf");
    			add_location(span0, file$4, 34, 12, 958);
    			attr_dev(button0, "class", "btn-grid svelte-k7gngf");
    			attr_dev(button0, "type", "submit");
    			add_location(button0, file$4, 33, 10, 906);
    			attr_dev(span1, "class", "front svelte-k7gngf");
    			add_location(span1, file$4, 37, 12, 1073);
    			attr_dev(button1, "class", "btn-grid svelte-k7gngf");
    			attr_dev(button1, "type", "reset");
    			add_location(button1, file$4, 36, 10, 1022);
    			attr_dev(div3, "class", "grid grid-3 svelte-k7gngf");
    			add_location(div3, file$4, 31, 8, 812);
    			attr_dev(ul, "class", "svelte-k7gngf");
    			add_location(ul, file$4, 13, 4, 259);
    			attr_dev(div4, "class", "container svelte-k7gngf");
    			add_location(div4, file$4, 12, 2, 231);
    			attr_dev(form, "class", "my-form svelte-k7gngf");
    			add_location(form, file$4, 11, 8, 206);
    			attr_dev(div5, "class", "content-container svelte-k7gngf");
    			add_location(div5, file$4, 10, 8, 166);
    			attr_dev(div6, "class", "contact-content-container svelte-k7gngf");
    			add_location(div6, file$4, 9, 4, 118);
    			attr_dev(div7, "class", "contact-container svelte-k7gngf");
    			add_location(div7, file$4, 4, 0, 21);
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
    			append_dev(ul, t6);
    			append_dev(ul, li1);
    			append_dev(li1, div1);
    			append_dev(div1, input0);
    			append_dev(div1, t7);
    			append_dev(div1, input1);
    			append_dev(ul, t8);
    			append_dev(ul, li2);
    			append_dev(li2, textarea);
    			append_dev(ul, t9);
    			append_dev(ul, div3);
    			append_dev(div3, div2);
    			append_dev(div3, t11);
    			append_dev(div3, button0);
    			append_dev(button0, span0);
    			append_dev(div3, t13);
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
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props) {
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
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Contact",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/components/footer.svelte generated by Svelte v3.59.2 */

    const file$3 = "src/components/footer.svelte";

    function create_fragment$3(ctx) {
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
    			add_location(i0, file$3, 4, 19, 170);
    			attr_dev(a0, "href", "");
    			attr_dev(a0, "class", "svelte-3aetk7");
    			add_location(a0, file$3, 4, 8, 159);
    			attr_dev(i1, "class", "fa-brands fa-twitter");
    			set_style(i1, "color", "#ffffff");
    			add_location(i1, file$3, 5, 19, 256);
    			attr_dev(a1, "href", "");
    			attr_dev(a1, "class", "svelte-3aetk7");
    			add_location(a1, file$3, 5, 8, 245);
    			attr_dev(i2, "class", "fa-brands fa-facebook");
    			set_style(i2, "color", "#ffffff");
    			add_location(i2, file$3, 6, 19, 340);
    			attr_dev(a2, "href", "");
    			attr_dev(a2, "class", "svelte-3aetk7");
    			add_location(a2, file$3, 6, 8, 329);
    			attr_dev(i3, "class", "fa-brands fa-youtube");
    			set_style(i3, "color", "#ffffff");
    			add_location(i3, file$3, 7, 19, 425);
    			attr_dev(a3, "href", "");
    			attr_dev(a3, "class", "svelte-3aetk7");
    			add_location(a3, file$3, 7, 8, 414);
    			attr_dev(div0, "class", "socials-container svelte-3aetk7");
    			add_location(div0, file$3, 3, 4, 119);
    			attr_dev(h6, "class", "svelte-3aetk7");
    			add_location(h6, file$3, 10, 8, 529);
    			attr_dev(div1, "class", "C svelte-3aetk7");
    			add_location(div1, file$3, 9, 4, 505);
    			attr_dev(div2, "class", "container svelte-3aetk7");
    			add_location(div2, file$3, 2, 0, 91);
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
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props) {
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
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/pages/homePage.svelte generated by Svelte v3.59.2 */
    const file$2 = "src/pages/homePage.svelte";

    function create_fragment$2(ctx) {
    	let body;
    	let section0;
    	let navbar;
    	let t0;
    	let section1;
    	let hero;
    	let t1;
    	let section2;
    	let pricing;
    	let t2;
    	let section3;
    	let resources;
    	let t3;
    	let section4;
    	let contact;
    	let t4;
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
    			body = element("body");
    			section0 = element("section");
    			create_component(navbar.$$.fragment);
    			t0 = space();
    			section1 = element("section");
    			create_component(hero.$$.fragment);
    			t1 = space();
    			section2 = element("section");
    			create_component(pricing.$$.fragment);
    			t2 = space();
    			section3 = element("section");
    			create_component(resources.$$.fragment);
    			t3 = space();
    			section4 = element("section");
    			create_component(contact.$$.fragment);
    			t4 = space();
    			section5 = element("section");
    			create_component(footer.$$.fragment);
    			attr_dev(section0, "id", "nav");
    			attr_dev(section0, "class", "svelte-blzzfp");
    			add_location(section0, file$2, 10, 4, 362);
    			attr_dev(section1, "id", "hero");
    			attr_dev(section1, "class", "svelte-blzzfp");
    			add_location(section1, file$2, 14, 4, 422);
    			attr_dev(section2, "id", "price");
    			attr_dev(section2, "class", "svelte-blzzfp");
    			add_location(section2, file$2, 18, 4, 481);
    			attr_dev(section3, "id", "resources");
    			attr_dev(section3, "class", "svelte-blzzfp");
    			add_location(section3, file$2, 22, 4, 544);
    			attr_dev(section4, "id", "contact");
    			attr_dev(section4, "class", "svelte-blzzfp");
    			add_location(section4, file$2, 26, 4, 613);
    			attr_dev(section5, "id", "footer");
    			attr_dev(section5, "class", "svelte-blzzfp");
    			add_location(section5, file$2, 30, 4, 675);
    			attr_dev(body, "class", "svelte-blzzfp");
    			add_location(body, file$2, 9, 0, 351);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, body, anchor);
    			append_dev(body, section0);
    			mount_component(navbar, section0, null);
    			append_dev(body, t0);
    			append_dev(body, section1);
    			mount_component(hero, section1, null);
    			append_dev(body, t1);
    			append_dev(body, section2);
    			mount_component(pricing, section2, null);
    			append_dev(body, t2);
    			append_dev(body, section3);
    			mount_component(resources, section3, null);
    			append_dev(body, t3);
    			append_dev(body, section4);
    			mount_component(contact, section4, null);
    			append_dev(body, t4);
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
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "HomePage",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/pages/userAuthPage.svelte generated by Svelte v3.59.2 */
    const file$1 = "src/pages/userAuthPage.svelte";

    function create_fragment$1(ctx) {
    	let main;
    	let div7;
    	let div6;
    	let div2;
    	let h10;
    	let t1;
    	let div0;
    	let h11;
    	let t3;
    	let form0;
    	let input0;
    	let t4;
    	let br0;
    	let br1;
    	let t5;
    	let input1;
    	let t6;
    	let br2;
    	let br3;
    	let t7;
    	let div1;
    	let input2;
    	let t8;
    	let button0;
    	let t10;
    	let h60;
    	let t11;
    	let span0;
    	let t13;
    	let div5;
    	let h12;
    	let t15;
    	let div3;
    	let h13;
    	let t17;
    	let form1;
    	let input3;
    	let t18;
    	let br4;
    	let br5;
    	let t19;
    	let input4;
    	let t20;
    	let br6;
    	let br7;
    	let t21;
    	let input5;
    	let t22;
    	let br8;
    	let br9;
    	let t23;
    	let div4;
    	let input6;
    	let t24;
    	let button1;
    	let t26;
    	let h61;
    	let t27;
    	let span1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			main = element("main");
    			div7 = element("div");
    			div6 = element("div");
    			div2 = element("div");
    			h10 = element("h1");
    			h10.textContent = "Login";
    			t1 = space();
    			div0 = element("div");
    			h11 = element("h1");
    			h11.textContent = "Error";
    			t3 = space();
    			form0 = element("form");
    			input0 = element("input");
    			t4 = space();
    			br0 = element("br");
    			br1 = element("br");
    			t5 = space();
    			input1 = element("input");
    			t6 = space();
    			br2 = element("br");
    			br3 = element("br");
    			t7 = space();
    			div1 = element("div");
    			input2 = element("input");
    			t8 = space();
    			button0 = element("button");
    			button0.textContent = "Back";
    			t10 = space();
    			h60 = element("h6");
    			t11 = text("Not a member? ");
    			span0 = element("span");
    			span0.textContent = "Signup";
    			t13 = space();
    			div5 = element("div");
    			h12 = element("h1");
    			h12.textContent = "Signup";
    			t15 = space();
    			div3 = element("div");
    			h13 = element("h1");
    			h13.textContent = "Error";
    			t17 = space();
    			form1 = element("form");
    			input3 = element("input");
    			t18 = space();
    			br4 = element("br");
    			br5 = element("br");
    			t19 = space();
    			input4 = element("input");
    			t20 = space();
    			br6 = element("br");
    			br7 = element("br");
    			t21 = space();
    			input5 = element("input");
    			t22 = space();
    			br8 = element("br");
    			br9 = element("br");
    			t23 = space();
    			div4 = element("div");
    			input6 = element("input");
    			t24 = space();
    			button1 = element("button");
    			button1.textContent = "Back";
    			t26 = space();
    			h61 = element("h6");
    			t27 = text("Already a member? ");
    			span1 = element("span");
    			span1.textContent = "Login";
    			attr_dev(h10, "class", "title svelte-pybn9g");
    			add_location(h10, file$1, 80, 16, 2310);
    			attr_dev(h11, "class", "svelte-pybn9g");
    			add_location(h11, file$1, 82, 20, 2399);
    			attr_dev(div0, "class", "error-msg svelte-pybn9g");
    			add_location(div0, file$1, 81, 16, 2355);
    			attr_dev(input0, "name", "Email");
    			attr_dev(input0, "placeholder", "Email");
    			attr_dev(input0, "class", "input-field svelte-pybn9g");
    			attr_dev(input0, "autocomplete", "off");
    			add_location(input0, file$1, 85, 17, 2560);
    			attr_dev(br0, "class", "svelte-pybn9g");
    			add_location(br0, file$1, 86, 17, 2657);
    			attr_dev(br1, "class", "svelte-pybn9g");
    			add_location(br1, file$1, 86, 21, 2661);
    			attr_dev(input1, "type", "password");
    			attr_dev(input1, "name", "Pass");
    			attr_dev(input1, "placeholder", "Password");
    			attr_dev(input1, "class", "input-field svelte-pybn9g");
    			attr_dev(input1, "autocomplete", "off");
    			add_location(input1, file$1, 87, 17, 2683);
    			attr_dev(br2, "class", "svelte-pybn9g");
    			add_location(br2, file$1, 88, 17, 2798);
    			attr_dev(br3, "class", "svelte-pybn9g");
    			add_location(br3, file$1, 88, 21, 2802);
    			attr_dev(input2, "type", "submit");
    			input2.value = "Login";
    			attr_dev(input2, "class", "login svelte-pybn9g");
    			attr_dev(input2, "id", "Login-submit");
    			add_location(input2, file$1, 90, 20, 2873);
    			attr_dev(button0, "class", "login svelte-pybn9g");
    			add_location(button0, file$1, 91, 20, 2961);
    			attr_dev(div1, "class", "btns-container svelte-pybn9g");
    			add_location(div1, file$1, 89, 17, 2824);
    			attr_dev(span0, "class", "little-msg svelte-pybn9g");
    			add_location(span0, file$1, 93, 53, 3095);
    			attr_dev(h60, "class", "sign-text svelte-pybn9g");
    			add_location(h60, file$1, 93, 17, 3059);
    			attr_dev(form0, "action", "");
    			attr_dev(form0, "name", "Login");
    			attr_dev(form0, "id", "Login-form");
    			attr_dev(form0, "class", "svelte-pybn9g");
    			add_location(form0, file$1, 84, 16, 2453);
    			attr_dev(div2, "class", "login-container svelte-pybn9g");
    			add_location(div2, file$1, 79, 12, 2242);
    			attr_dev(h12, "class", "title svelte-pybn9g");
    			add_location(h12, file$1, 97, 16, 3291);
    			attr_dev(h13, "class", "svelte-pybn9g");
    			add_location(h13, file$1, 99, 20, 3381);
    			attr_dev(div3, "class", "error-msg svelte-pybn9g");
    			add_location(div3, file$1, 98, 16, 3337);
    			attr_dev(input3, "type", "email");
    			attr_dev(input3, "name", "Email1");
    			attr_dev(input3, "placeholder", "Email");
    			attr_dev(input3, "class", "input-field svelte-pybn9g");
    			attr_dev(input3, "autocomplete", "off");
    			add_location(input3, file$1, 102, 17, 3539);
    			attr_dev(br4, "class", "svelte-pybn9g");
    			add_location(br4, file$1, 103, 17, 3650);
    			attr_dev(br5, "class", "svelte-pybn9g");
    			add_location(br5, file$1, 103, 21, 3654);
    			attr_dev(input4, "type", "password");
    			attr_dev(input4, "name", "Pass1");
    			attr_dev(input4, "placeholder", "Password");
    			attr_dev(input4, "class", "input-field svelte-pybn9g");
    			attr_dev(input4, "autocomplete", "off");
    			add_location(input4, file$1, 104, 17, 3676);
    			attr_dev(br6, "class", "svelte-pybn9g");
    			add_location(br6, file$1, 105, 17, 3792);
    			attr_dev(br7, "class", "svelte-pybn9g");
    			add_location(br7, file$1, 105, 21, 3796);
    			attr_dev(input5, "type", "password");
    			attr_dev(input5, "name", "ConPass");
    			attr_dev(input5, "placeholder", "Confirm Password");
    			attr_dev(input5, "class", "input-field svelte-pybn9g");
    			attr_dev(input5, "autocomplete", "off");
    			add_location(input5, file$1, 106, 17, 3818);
    			attr_dev(br8, "class", "svelte-pybn9g");
    			add_location(br8, file$1, 107, 17, 3944);
    			attr_dev(br9, "class", "svelte-pybn9g");
    			add_location(br9, file$1, 107, 21, 3948);
    			attr_dev(input6, "type", "submit");
    			input6.value = "Signup";
    			attr_dev(input6, "class", "login svelte-pybn9g");
    			attr_dev(input6, "id", "Signup-Submit");
    			add_location(input6, file$1, 109, 21, 4020);
    			attr_dev(button1, "class", "login svelte-pybn9g");
    			add_location(button1, file$1, 110, 21, 4111);
    			attr_dev(div4, "class", "btns-container svelte-pybn9g");
    			add_location(div4, file$1, 108, 17, 3970);
    			attr_dev(span1, "class", "little-msg svelte-pybn9g");
    			add_location(span1, file$1, 112, 57, 4250);
    			attr_dev(h61, "class", "sign-text svelte-pybn9g");
    			add_location(h61, file$1, 112, 17, 4210);
    			attr_dev(form1, "action", "");
    			attr_dev(form1, "id", "Signup");
    			attr_dev(form1, "name", "Signup");
    			attr_dev(form1, "class", "svelte-pybn9g");
    			add_location(form1, file$1, 101, 16, 3435);
    			attr_dev(div5, "class", "signup-container svelte-pybn9g");
    			add_location(div5, file$1, 96, 12, 3221);
    			attr_dev(div6, "class", "form-container svelte-pybn9g");
    			add_location(div6, file$1, 78, 8, 2201);
    			attr_dev(div7, "class", "container svelte-pybn9g");
    			add_location(div7, file$1, 77, 4, 2169);
    			attr_dev(main, "class", "svelte-pybn9g");
    			add_location(main, file$1, 76, 0, 2158);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div7);
    			append_dev(div7, div6);
    			append_dev(div6, div2);
    			append_dev(div2, h10);
    			append_dev(div2, t1);
    			append_dev(div2, div0);
    			append_dev(div0, h11);
    			append_dev(div2, t3);
    			append_dev(div2, form0);
    			append_dev(form0, input0);
    			append_dev(form0, t4);
    			append_dev(form0, br0);
    			append_dev(form0, br1);
    			append_dev(form0, t5);
    			append_dev(form0, input1);
    			append_dev(form0, t6);
    			append_dev(form0, br2);
    			append_dev(form0, br3);
    			append_dev(form0, t7);
    			append_dev(form0, div1);
    			append_dev(div1, input2);
    			append_dev(div1, t8);
    			append_dev(div1, button0);
    			append_dev(form0, t10);
    			append_dev(form0, h60);
    			append_dev(h60, t11);
    			append_dev(h60, span0);
    			/*div2_binding*/ ctx[6](div2);
    			append_dev(div6, t13);
    			append_dev(div6, div5);
    			append_dev(div5, h12);
    			append_dev(div5, t15);
    			append_dev(div5, div3);
    			append_dev(div3, h13);
    			append_dev(div5, t17);
    			append_dev(div5, form1);
    			append_dev(form1, input3);
    			append_dev(form1, t18);
    			append_dev(form1, br4);
    			append_dev(form1, br5);
    			append_dev(form1, t19);
    			append_dev(form1, input4);
    			append_dev(form1, t20);
    			append_dev(form1, br6);
    			append_dev(form1, br7);
    			append_dev(form1, t21);
    			append_dev(form1, input5);
    			append_dev(form1, t22);
    			append_dev(form1, br8);
    			append_dev(form1, br9);
    			append_dev(form1, t23);
    			append_dev(form1, div4);
    			append_dev(div4, input6);
    			append_dev(div4, t24);
    			append_dev(div4, button1);
    			append_dev(form1, t26);
    			append_dev(form1, h61);
    			append_dev(h61, t27);
    			append_dev(h61, span1);
    			/*div5_binding*/ ctx[7](div5);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*handleBack*/ ctx[5], false, false, false, false),
    					listen_dev(span0, "click", /*switchToSignUp*/ ctx[2], false, false, false, false),
    					listen_dev(form0, "submit", prevent_default(/*handleSubmission*/ ctx[4]), false, true, false, false),
    					listen_dev(button1, "click", /*handleBack*/ ctx[5], false, false, false, false),
    					listen_dev(span1, "click", /*switchToLogin*/ ctx[3], false, false, false, false),
    					listen_dev(form1, "submit", prevent_default(/*handleSubmission*/ ctx[4]), false, true, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			/*div2_binding*/ ctx[6](null);
    			/*div5_binding*/ ctx[7](null);
    			mounted = false;
    			run_all(dispose);
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
    		loginFormActive = false;
    	};

    	const switchToLogin = () => {
    		$$invalidate(0, loginPage.style.display = "block", loginPage);
    		$$invalidate(1, signupPage.style.display = "none", signupPage);
    		loginFormActive = true;
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
    		
    	};

    	const handleSignin = (email, password) => {
    		
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
    		if ('loginFormActive' in $$props) loginFormActive = $$props.loginFormActive;
    		if ('errorMsg' in $$props) errorMsg = $$props.errorMsg;
    		if ('loginLine' in $$props) loginLine = $$props.loginLine;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		loginPage,
    		signupPage,
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
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "UserAuthPage",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.59.2 */
    const file = "src/App.svelte";

    // (27:41) 
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
    		source: "(27:41) ",
    		ctx
    	});

    	return block;
    }

    // (25:4) {#if currentState === "front-page"}
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
    		source: "(25:4) {#if currentState === \\\"front-page\\\"}",
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
    	const if_block_creators = [create_if_block, create_if_block_1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*currentState*/ ctx[0] === "front-page") return 0;
    		if (/*currentState*/ ctx[0] === "signIn") return 1;
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
    			add_location(body, file, 23, 0, 448);
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
    		onMount,
    		state,
    		HomePage,
    		UserAuthPage,
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
    		name: 'world'
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
