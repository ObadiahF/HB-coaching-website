
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

    /* src/components/hero.svelte generated by Svelte v3.59.2 */

    const file$7 = "src/components/hero.svelte";

    function create_fragment$7(ctx) {
    	let div6;
    	let div4;
    	let div3;
    	let div2;
    	let div0;
    	let h1;
    	let t1;
    	let div1;
    	let p;
    	let t3;
    	let div5;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			div6 = element("div");
    			div4 = element("div");
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Unleash your inner beast";
    			t1 = space();
    			div1 = element("div");
    			p = element("p");
    			p.textContent = "At HumbleBeast Coaching, we specialize in weightlifting, fat loss, and muscle building. Let our expert coach guide your transformation with personalized workout programs and tailored nutrition plans.";
    			t3 = space();
    			div5 = element("div");
    			img = element("img");
    			attr_dev(h1, "class", "svelte-1d8mcm");
    			add_location(h1, file$7, 9, 20, 219);
    			attr_dev(div0, "class", "hero-title-container svelte-1d8mcm");
    			add_location(div0, file$7, 8, 16, 164);
    			attr_dev(p, "class", "svelte-1d8mcm");
    			add_location(p, file$7, 12, 20, 346);
    			attr_dev(div1, "class", "paragraph-container svelte-1d8mcm");
    			add_location(div1, file$7, 11, 16, 292);
    			attr_dev(div2, "class", "hero-container svelte-1d8mcm");
    			add_location(div2, file$7, 7, 12, 119);
    			attr_dev(div3, "class", "gradient svelte-1d8mcm");
    			add_location(div3, file$7, 6, 8, 84);
    			attr_dev(div4, "class", "black-column svelte-1d8mcm");
    			add_location(div4, file$7, 5, 4, 49);
    			if (!src_url_equal(img.src, img_src_value = "pictures/brian.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Brians a cool guy");
    			attr_dev(img, "height", "248px");
    			attr_dev(img, "width", "341");
    			attr_dev(img, "class", "svelte-1d8mcm");
    			add_location(img, file$7, 18, 8, 665);
    			attr_dev(div5, "class", "picture-container svelte-1d8mcm");
    			add_location(div5, file$7, 17, 4, 625);
    			attr_dev(div6, "class", "container svelte-1d8mcm");
    			add_location(div6, file$7, 4, 0, 21);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div6, anchor);
    			append_dev(div6, div4);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div0, h1);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, p);
    			append_dev(div6, t3);
    			append_dev(div6, div5);
    			append_dev(div5, img);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div6);
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
    	validate_slots('Hero', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Hero> was created with unknown prop '${key}'`);
    	});

    	return [];
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

    /* src/components/nav-bar.svelte generated by Svelte v3.59.2 */
    const file$6 = "src/components/nav-bar.svelte";

    function create_fragment$6(ctx) {
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
    	let ul_class_value;
    	let t10;
    	let button;
    	let i;
    	let i_class_value;
    	let mounted;
    	let dispose;

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
    			button = element("button");
    			i = element("i");
    			if (!src_url_equal(script.src, script_src_value = "https://kit.fontawesome.com/db3c0028dc.js")) attr_dev(script, "src", script_src_value);
    			attr_dev(script, "crossorigin", "anonymous");
    			attr_dev(script, "class", "svelte-1mmczxe");
    			add_location(script, file$6, 1, 4, 18);
    			attr_dev(h1, "class", "svelte-1mmczxe");
    			add_location(h1, file$6, 10, 8, 234);
    			attr_dev(a0, "href", "/");
    			attr_dev(a0, "class", "svelte-1mmczxe");
    			add_location(a0, file$6, 12, 16, 336);
    			attr_dev(a1, "href", "/");
    			attr_dev(a1, "class", "svelte-1mmczxe");
    			add_location(a1, file$6, 13, 16, 373);
    			attr_dev(a2, "href", "/");
    			attr_dev(a2, "class", "svelte-1mmczxe");
    			add_location(a2, file$6, 14, 16, 413);
    			attr_dev(a3, "href", "/");
    			attr_dev(a3, "class", "svelte-1mmczxe");
    			add_location(a3, file$6, 15, 16, 455);
    			attr_dev(ul, "class", ul_class_value = "" + (null_to_empty(/*open*/ ctx[0] === false ? 'nav-items' : 'mobile') + " svelte-1mmczxe"));
    			add_location(ul, file$6, 11, 12, 267);
    			attr_dev(i, "class", i_class_value = "fa-solid " + (/*open*/ ctx[0] ? 'fa-x' : 'fa-bars') + " svelte-1mmczxe");
    			set_style(i, "color", "#ffffff");
    			add_location(i, file$6, 18, 58, 563);
    			attr_dev(button, "id", "mobile");
    			attr_dev(button, "class", "svelte-1mmczxe");
    			add_location(button, file$6, 18, 8, 513);
    			attr_dev(div, "class", "nav-bar svelte-1mmczxe");
    			add_location(div, file$6, 9, 0, 204);
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
    			append_dev(div, t10);
    			append_dev(div, button);
    			append_dev(button, i);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[1], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*open*/ 1 && ul_class_value !== (ul_class_value = "" + (null_to_empty(/*open*/ ctx[0] === false ? 'nav-items' : 'mobile') + " svelte-1mmczxe"))) {
    				attr_dev(ul, "class", ul_class_value);
    			}

    			if (dirty & /*open*/ 1 && i_class_value !== (i_class_value = "fa-solid " + (/*open*/ ctx[0] ? 'fa-x' : 'fa-bars') + " svelte-1mmczxe")) {
    				attr_dev(i, "class", i_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			detach_dev(script);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
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

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Nav_bar', slots, []);
    	let open = false;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Nav_bar> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(0, open = !open);
    	$$self.$capture_state = () => ({ Hero, open });

    	$$self.$inject_state = $$props => {
    		if ('open' in $$props) $$invalidate(0, open = $$props.open);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [open, click_handler];
    }

    class Nav_bar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Nav_bar",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src/components/pricing.svelte generated by Svelte v3.59.2 */

    const file$5 = "src/components/pricing.svelte";

    function create_fragment$5(ctx) {
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
    			attr_dev(script, "class", "svelte-1pyy8lu");
    			add_location(script, file$5, 5, 0, 35);
    			attr_dev(h10, "class", "svelte-1pyy8lu");
    			add_location(h10, file$5, 10, 8, 197);
    			attr_dev(div0, "class", "title svelte-1pyy8lu");
    			add_location(div0, file$5, 9, 4, 169);
    			attr_dev(h60, "class", "svelte-1pyy8lu");
    			add_location(h60, file$5, 16, 12, 305);
    			attr_dev(h11, "class", "svelte-1pyy8lu");
    			add_location(h11, file$5, 17, 12, 335);
    			attr_dev(i0, "class", "fa-solid fa-check svelte-1pyy8lu");
    			set_style(i0, "color", "#ffffff");
    			add_location(i0, file$5, 19, 20, 405);
    			attr_dev(li0, "class", "svelte-1pyy8lu");
    			add_location(li0, file$5, 19, 16, 401);
    			attr_dev(i1, "class", "fa-solid fa-check svelte-1pyy8lu");
    			set_style(i1, "color", "#ffffff");
    			add_location(i1, file$5, 20, 20, 506);
    			attr_dev(li1, "class", "svelte-1pyy8lu");
    			add_location(li1, file$5, 20, 16, 502);
    			attr_dev(i2, "class", "fa-solid fa-check svelte-1pyy8lu");
    			set_style(i2, "color", "#ffffff");
    			add_location(i2, file$5, 21, 20, 610);
    			attr_dev(li2, "class", "svelte-1pyy8lu");
    			add_location(li2, file$5, 21, 16, 606);
    			attr_dev(i3, "class", "fa-solid fa-check svelte-1pyy8lu");
    			set_style(i3, "color", "#ffffff");
    			add_location(i3, file$5, 22, 20, 715);
    			attr_dev(li3, "class", "svelte-1pyy8lu");
    			add_location(li3, file$5, 22, 16, 711);
    			attr_dev(ul0, "class", "parts svelte-1pyy8lu");
    			add_location(ul0, file$5, 18, 12, 366);
    			attr_dev(button0, "class", "call-to-action svelte-1pyy8lu");
    			add_location(button0, file$5, 24, 12, 824);
    			attr_dev(div1, "class", "options svelte-1pyy8lu");
    			add_location(div1, file$5, 15, 8, 271);
    			attr_dev(h61, "class", "svelte-1pyy8lu");
    			add_location(h61, file$5, 28, 12, 938);
    			attr_dev(h12, "class", "svelte-1pyy8lu");
    			add_location(h12, file$5, 29, 12, 967);
    			attr_dev(i4, "class", "fa-solid fa-check svelte-1pyy8lu");
    			set_style(i4, "color", "#ffffff");
    			add_location(i4, file$5, 31, 20, 1037);
    			attr_dev(li4, "class", "svelte-1pyy8lu");
    			add_location(li4, file$5, 31, 16, 1033);
    			attr_dev(i5, "class", "fa-solid fa-check svelte-1pyy8lu");
    			set_style(i5, "color", "#ffffff");
    			add_location(i5, file$5, 32, 20, 1135);
    			attr_dev(li5, "class", "svelte-1pyy8lu");
    			add_location(li5, file$5, 32, 16, 1131);
    			attr_dev(i6, "class", "fa-solid fa-check svelte-1pyy8lu");
    			set_style(i6, "color", "#ffffff");
    			add_location(i6, file$5, 33, 20, 1238);
    			attr_dev(li6, "class", "svelte-1pyy8lu");
    			add_location(li6, file$5, 33, 16, 1234);
    			attr_dev(i7, "class", "fa-solid fa-check svelte-1pyy8lu");
    			set_style(i7, "color", "#ffffff");
    			add_location(i7, file$5, 34, 20, 1340);
    			attr_dev(li7, "class", "svelte-1pyy8lu");
    			add_location(li7, file$5, 34, 16, 1336);
    			attr_dev(ul1, "class", "parts svelte-1pyy8lu");
    			add_location(ul1, file$5, 30, 12, 998);
    			attr_dev(button1, "class", "call-to-action svelte-1pyy8lu");
    			add_location(button1, file$5, 36, 12, 1452);
    			attr_dev(div2, "class", "options svelte-1pyy8lu");
    			add_location(div2, file$5, 27, 8, 904);
    			attr_dev(h62, "class", "svelte-1pyy8lu");
    			add_location(h62, file$5, 40, 12, 1565);
    			attr_dev(h13, "class", "svelte-1pyy8lu");
    			add_location(h13, file$5, 41, 12, 1592);
    			attr_dev(i8, "class", "fa-solid fa-check svelte-1pyy8lu");
    			set_style(i8, "color", "#ffffff");
    			add_location(i8, file$5, 43, 20, 1662);
    			attr_dev(li8, "class", "svelte-1pyy8lu");
    			add_location(li8, file$5, 43, 16, 1658);
    			attr_dev(i9, "class", "fa-solid fa-check svelte-1pyy8lu");
    			set_style(i9, "color", "#ffffff");
    			add_location(i9, file$5, 44, 20, 1759);
    			attr_dev(li9, "class", "svelte-1pyy8lu");
    			add_location(li9, file$5, 44, 16, 1755);
    			attr_dev(i10, "class", "fa-solid fa-check svelte-1pyy8lu");
    			set_style(i10, "color", "#ffffff");
    			add_location(i10, file$5, 45, 20, 1862);
    			attr_dev(li10, "class", "svelte-1pyy8lu");
    			add_location(li10, file$5, 45, 16, 1858);
    			attr_dev(i11, "class", "fa-solid fa-check svelte-1pyy8lu");
    			set_style(i11, "color", "#ffffff");
    			add_location(i11, file$5, 46, 20, 1964);
    			attr_dev(li11, "class", "svelte-1pyy8lu");
    			add_location(li11, file$5, 46, 16, 1960);
    			attr_dev(ul2, "class", "parts svelte-1pyy8lu");
    			add_location(ul2, file$5, 42, 12, 1623);
    			attr_dev(button2, "class", "call-to-action svelte-1pyy8lu");
    			add_location(button2, file$5, 48, 12, 2076);
    			attr_dev(div3, "class", "options svelte-1pyy8lu");
    			add_location(div3, file$5, 39, 8, 1531);
    			attr_dev(div4, "class", "options-container svelte-1pyy8lu");
    			add_location(div4, file$5, 13, 4, 230);
    			attr_dev(div5, "class", "container svelte-1pyy8lu");
    			add_location(div5, file$5, 8, 0, 141);
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
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props) {
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
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Pricing",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/components/resources.svelte generated by Svelte v3.59.2 */

    const file$4 = "src/components/resources.svelte";

    function create_fragment$4(ctx) {
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
    			h1.textContent = "Free Resources";
    			t1 = space();
    			div1 = element("div");
    			iframe0 = element("iframe");
    			t2 = space();
    			iframe1 = element("iframe");
    			t3 = space();
    			iframe2 = element("iframe");
    			attr_dev(h1, "class", "svelte-14lf6rv");
    			add_location(h1, file$4, 6, 8, 77);
    			attr_dev(div0, "class", "title svelte-14lf6rv");
    			add_location(div0, file$4, 5, 4, 49);
    			attr_dev(iframe0, "width", "560");
    			attr_dev(iframe0, "height", "315");
    			if (!src_url_equal(iframe0.src, iframe0_src_value = "https://www.youtube.com/embed/d1z_-Kc6DS4")) attr_dev(iframe0, "src", iframe0_src_value);
    			attr_dev(iframe0, "title", "YouTube video player");
    			attr_dev(iframe0, "frameborder", "0");
    			attr_dev(iframe0, "allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share");
    			iframe0.allowFullscreen = true;
    			attr_dev(iframe0, "class", "svelte-14lf6rv");
    			add_location(iframe0, file$4, 9, 8, 155);
    			attr_dev(iframe1, "width", "560");
    			attr_dev(iframe1, "height", "315");
    			if (!src_url_equal(iframe1.src, iframe1_src_value = "https://www.youtube.com/embed/jLg9kdVUwoE")) attr_dev(iframe1, "src", iframe1_src_value);
    			attr_dev(iframe1, "title", "YouTube video player");
    			attr_dev(iframe1, "frameborder", "0");
    			attr_dev(iframe1, "allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share");
    			iframe1.allowFullscreen = true;
    			attr_dev(iframe1, "class", "svelte-14lf6rv");
    			add_location(iframe1, file$4, 10, 8, 423);
    			attr_dev(iframe2, "width", "560");
    			attr_dev(iframe2, "height", "315");
    			if (!src_url_equal(iframe2.src, iframe2_src_value = "https://www.youtube.com/embed/q3EItdmyf2A")) attr_dev(iframe2, "src", iframe2_src_value);
    			attr_dev(iframe2, "title", "YouTube video player");
    			attr_dev(iframe2, "frameborder", "0");
    			attr_dev(iframe2, "allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share");
    			iframe2.allowFullscreen = true;
    			attr_dev(iframe2, "class", "svelte-14lf6rv");
    			add_location(iframe2, file$4, 11, 8, 691);
    			attr_dev(div1, "class", "videos-container svelte-14lf6rv");
    			add_location(div1, file$4, 8, 4, 116);
    			attr_dev(div2, "class", "container svelte-14lf6rv");
    			add_location(div2, file$4, 4, 0, 21);
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
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props) {
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
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Resources",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/components/contact.svelte generated by Svelte v3.59.2 */

    const file$3 = "src/components/contact.svelte";

    function create_fragment$3(ctx) {
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
    			attr_dev(h1, "class", "svelte-95bhhx");
    			add_location(h1, file$3, 6, 8, 85);
    			attr_dev(div0, "class", "title svelte-95bhhx");
    			add_location(div0, file$3, 5, 4, 57);
    			option0.selected = true;
    			option0.disabled = true;
    			option0.__value = "-- Please choose an option --";
    			option0.value = option0.__value;
    			attr_dev(option0, "class", "svelte-95bhhx");
    			add_location(option0, file$3, 16, 10, 302);
    			option1.__value = "Ask Question";
    			option1.value = option1.__value;
    			attr_dev(option1, "class", "svelte-95bhhx");
    			add_location(option1, file$3, 17, 10, 377);
    			option2.__value = "Send Resume To Become A Coach";
    			option2.value = option2.__value;
    			attr_dev(option2, "class", "svelte-95bhhx");
    			add_location(option2, file$3, 18, 10, 417);
    			option3.__value = "Other";
    			option3.value = option3.__value;
    			attr_dev(option3, "class", "svelte-95bhhx");
    			add_location(option3, file$3, 19, 10, 474);
    			attr_dev(select, "class", "svelte-95bhhx");
    			add_location(select, file$3, 15, 8, 283);
    			attr_dev(li0, "class", "svelte-95bhhx");
    			add_location(li0, file$3, 14, 6, 270);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "placeholder", "Name");
    			input0.required = true;
    			attr_dev(input0, "class", "svelte-95bhhx");
    			add_location(input0, file$3, 24, 10, 588);
    			attr_dev(input1, "type", "email");
    			attr_dev(input1, "placeholder", "Email");
    			input1.required = true;
    			attr_dev(input1, "class", "svelte-95bhhx");
    			add_location(input1, file$3, 25, 10, 646);
    			attr_dev(div1, "class", "grid grid-2 svelte-95bhhx");
    			add_location(div1, file$3, 23, 8, 552);
    			attr_dev(li1, "class", "svelte-95bhhx");
    			add_location(li1, file$3, 22, 6, 539);
    			attr_dev(textarea, "placeholder", "Message");
    			attr_dev(textarea, "class", "svelte-95bhhx");
    			add_location(textarea, file$3, 29, 8, 745);
    			attr_dev(li2, "class", "svelte-95bhhx");
    			add_location(li2, file$3, 28, 6, 732);
    			attr_dev(div2, "class", "required-msg svelte-95bhhx");
    			add_location(div2, file$3, 32, 10, 848);
    			attr_dev(span0, "class", "front svelte-95bhhx");
    			add_location(span0, file$3, 34, 12, 958);
    			attr_dev(button0, "class", "btn-grid svelte-95bhhx");
    			attr_dev(button0, "type", "submit");
    			add_location(button0, file$3, 33, 10, 906);
    			attr_dev(span1, "class", "front svelte-95bhhx");
    			add_location(span1, file$3, 37, 12, 1073);
    			attr_dev(button1, "class", "btn-grid svelte-95bhhx");
    			attr_dev(button1, "type", "reset");
    			add_location(button1, file$3, 36, 10, 1022);
    			attr_dev(div3, "class", "grid grid-3 svelte-95bhhx");
    			add_location(div3, file$3, 31, 8, 812);
    			attr_dev(ul, "class", "svelte-95bhhx");
    			add_location(ul, file$3, 13, 4, 259);
    			attr_dev(div4, "class", "container svelte-95bhhx");
    			add_location(div4, file$3, 12, 2, 231);
    			attr_dev(form, "class", "my-form svelte-95bhhx");
    			add_location(form, file$3, 11, 8, 206);
    			attr_dev(div5, "class", "content-container svelte-95bhhx");
    			add_location(div5, file$3, 10, 8, 166);
    			attr_dev(div6, "class", "contact-content-container svelte-95bhhx");
    			add_location(div6, file$3, 9, 4, 118);
    			attr_dev(div7, "class", "contact-container svelte-95bhhx");
    			add_location(div7, file$3, 4, 0, 21);
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
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props) {
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
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Contact",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/components/footer.svelte generated by Svelte v3.59.2 */

    const file$2 = "src/components/footer.svelte";

    function create_fragment$2(ctx) {
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
    			add_location(i0, file$2, 4, 19, 170);
    			attr_dev(a0, "href", "");
    			attr_dev(a0, "class", "svelte-j4iwv");
    			add_location(a0, file$2, 4, 8, 159);
    			attr_dev(i1, "class", "fa-brands fa-twitter");
    			set_style(i1, "color", "#ffffff");
    			add_location(i1, file$2, 5, 19, 256);
    			attr_dev(a1, "href", "");
    			attr_dev(a1, "class", "svelte-j4iwv");
    			add_location(a1, file$2, 5, 8, 245);
    			attr_dev(i2, "class", "fa-brands fa-facebook");
    			set_style(i2, "color", "#ffffff");
    			add_location(i2, file$2, 6, 19, 340);
    			attr_dev(a2, "href", "");
    			attr_dev(a2, "class", "svelte-j4iwv");
    			add_location(a2, file$2, 6, 8, 329);
    			attr_dev(i3, "class", "fa-brands fa-youtube");
    			set_style(i3, "color", "#ffffff");
    			add_location(i3, file$2, 7, 19, 425);
    			attr_dev(a3, "href", "");
    			attr_dev(a3, "class", "svelte-j4iwv");
    			add_location(a3, file$2, 7, 8, 414);
    			attr_dev(div0, "class", "socials-container svelte-j4iwv");
    			add_location(div0, file$2, 3, 4, 119);
    			attr_dev(h6, "class", "svelte-j4iwv");
    			add_location(h6, file$2, 10, 8, 529);
    			attr_dev(div1, "class", "C svelte-j4iwv");
    			add_location(div1, file$2, 9, 4, 505);
    			attr_dev(div2, "class", "container svelte-j4iwv");
    			add_location(div2, file$2, 2, 0, 91);
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
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props) {
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
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/pages/homePage.svelte generated by Svelte v3.59.2 */
    const file$1 = "src/pages/homePage.svelte";

    function create_fragment$1(ctx) {
    	let body;
    	let navbar;
    	let t0;
    	let hero;
    	let t1;
    	let pricing;
    	let t2;
    	let resources;
    	let t3;
    	let contact;
    	let t4;
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
    			create_component(navbar.$$.fragment);
    			t0 = space();
    			create_component(hero.$$.fragment);
    			t1 = space();
    			create_component(pricing.$$.fragment);
    			t2 = space();
    			create_component(resources.$$.fragment);
    			t3 = space();
    			create_component(contact.$$.fragment);
    			t4 = space();
    			create_component(footer.$$.fragment);
    			attr_dev(body, "class", "svelte-7v0bez");
    			add_location(body, file$1, 9, 0, 351);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, body, anchor);
    			mount_component(navbar, body, null);
    			append_dev(body, t0);
    			mount_component(hero, body, null);
    			append_dev(body, t1);
    			mount_component(pricing, body, null);
    			append_dev(body, t2);
    			mount_component(resources, body, null);
    			append_dev(body, t3);
    			mount_component(contact, body, null);
    			append_dev(body, t4);
    			mount_component(footer, body, null);
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
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "HomePage",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.59.2 */
    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let t;
    	let body;
    	let homepage;
    	let current;
    	homepage = new HomePage({ $$inline: true });

    	const block = {
    		c: function create() {
    			t = space();
    			body = element("body");
    			create_component(homepage.$$.fragment);
    			document.title = "HUMBLEBEAST Coaching";
    			attr_dev(body, "class", "svelte-1ccah1n");
    			add_location(body, file, 8, 0, 138);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    			insert_dev(target, body, anchor);
    			mount_component(homepage, body, null);
    			current = true;
    		},
    		p: noop,
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
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(body);
    			destroy_component(homepage);
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
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ HomePage });
    	return [];
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
