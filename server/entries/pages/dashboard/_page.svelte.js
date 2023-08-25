import { c as create_ssr_component, a as subscribe, e as escape, v as validate_component } from "../../../chunks/ssr.js";
import { d as dashState, N as Nav, c as colors } from "../../../chunks/edit.svelte_svelte_type_style_lang.js";
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: "body.svelte-fvaqgc{background-color:#5E6872;height:100vh;padding:4.5rem 4rem;display:flex;justify-content:center;align-items:center}.svelte-fvaqgc{margin:0;padding:0;box-sizing:border-box}.container.svelte-fvaqgc{height:100%;background-color:var(--main-background);border-radius:32px;display:grid;grid-template-columns:10% 90%;width:90vw}@media screen and (max-width: 1650px){body.svelte-fvaqgc{padding:0}.container.svelte-fvaqgc{border-radius:0}}@media screen and (max-width: 1630px){.container.svelte-fvaqgc{width:100vw}}@media screen and (max-width: 983px){.container.svelte-fvaqgc{grid-template-columns:20% 80%;width:100vw}}@media screen and (max-width: 511px){.container.svelte-fvaqgc{grid-template-columns:30% 70%}}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $dashState, $$unsubscribe_dashState;
  $$unsubscribe_dashState = subscribe(dashState, (value) => $dashState = value);
  let state;
  let mainBackground, color, activeColor, checkedColor, lineColor = { colors };
  $$result.css.add(css);
  {
    {
      state = $dashState;
      if (state[1] === "light-mode") {
        mainBackground = "white";
        color = "#242529";
        activeColor = "grey";
        checkedColor = "#242529";
        lineColor = "#D3D3D3";
      } else {
        mainBackground = "#242529";
        color = "white";
        activeColor = "#353537";
        checkedColor = "#242529";
        lineColor = "#2c2d32";
      }
    }
  }
  $$unsubscribe_dashState();
  return `<body style="${"--main-background: " + escape(mainBackground, true) + "; --color: " + escape(color, true) + "; --active: " + escape(activeColor, true) + "; --checked: " + escape(checkedColor, true) + "; --line: " + escape(lineColor, true) + ";"}" class="svelte-fvaqgc"><div class="container svelte-fvaqgc">${validate_component(Nav, "Nav").$$render($$result, {}, {}, {})}</div> </body>`;
});
export {
  Page as default
};
