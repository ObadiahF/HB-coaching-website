import { c as create_ssr_component, a as subscribe, e as escape, v as validate_component, b as add_attribute } from "./ssr.js";
import { w as writable } from "./index.js";
const dashState = writable(["dash", "dark-mode"]);
const MediaQuery = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { query } = $$props;
  let matches = false;
  if ($$props.query === void 0 && $$bindings.query && query !== void 0)
    $$bindings.query(query);
  return `${slots.default ? slots.default({ matches }) : ``}`;
});
const colors = {
  "mainBackground": "#242529",
  "color": "white",
  "activeColor": "#353537",
  "checkedColor": "#242529",
  "lineColor": "#2c2d32"
};
const nav_svelte_svelte_type_style_lang = "";
const css = {
  code: '.svelte-121e1a8.svelte-121e1a8{margin:0;padding:0;box-sizing:border-box}.container.svelte-121e1a8.svelte-121e1a8{background-color:var(--main-background);height:100%;border-top-left-radius:32px;border-bottom-left-radius:32px;padding:3rem;display:flex;align-items:center;flex-direction:column;border-right:2px solid var(--line)}.logo-container.svelte-121e1a8.svelte-121e1a8{margin-bottom:2rem;color:var(--color);font-size:24px}.profile-container.svelte-121e1a8.svelte-121e1a8{display:flex;align-items:center;flex-direction:column;gap:0.5rem;margin-bottom:3rem}.profile-container.svelte-121e1a8 .img-container.svelte-121e1a8{border-radius:50%;height:5rem}.profile-container.svelte-121e1a8 .img-container img.svelte-121e1a8{height:100%;border-radius:inherit}.profile-container.svelte-121e1a8 .name-container.svelte-121e1a8{width:100%;text-align:center;flex-wrap:wrap;height:fit-content;overflow:hidden;text-overflow:ellipsis;color:var(--color)}.profile-container.svelte-121e1a8 .profile-btn-container button.svelte-121e1a8{font-size:16px;padding:0.1rem;width:4rem;border-radius:30px;border:1px solid var(--color);background-color:inherit;color:var(--color);cursor:pointer;transition:200ms ease-in}.profile-container.svelte-121e1a8 .profile-btn-container button.svelte-121e1a8:hover{opacity:0.7}.nav-container.svelte-121e1a8.svelte-121e1a8{width:200%}.nav-container.svelte-121e1a8 ul.svelte-121e1a8{list-style-type:none;text-decoration:none;display:flex;flex-direction:column;align-items:center;gap:.5rem}.list-items.svelte-121e1a8.svelte-121e1a8{padding:1rem;width:9rem;text-align:left;border-radius:12px;background-color:inherit}.list-items.svelte-121e1a8 a.svelte-121e1a8{color:var(--color);text-decoration:none}.list-items.svelte-121e1a8 a.svelte-121e1a8:hover{transition:200ms ease;opacity:0.8}.active.svelte-121e1a8.svelte-121e1a8{background-color:var(--active);box-shadow:rgba(0, 0, 0, 0.16) 0px 1px 4px;color:white}.nav-icon.svelte-121e1a8.svelte-121e1a8{margin-right:0.5rem}.mode-container.svelte-121e1a8.svelte-121e1a8{margin-top:auto;display:flex;align-items:center}.mode-container.svelte-121e1a8 label.svelte-121e1a8{color:var(--color);padding:0.2rem}input[type="checkbox"].svelte-121e1a8.svelte-121e1a8{position:relative;width:80px;height:40px;-webkit-appearance:none;appearance:none;background:grey;outline:none;border-radius:2rem;cursor:pointer;box-shadow:inset 0 0 5px rgb(0 0 0 / 50%);scale:.8;border:2px solid var(--color)}input[type="checkbox"].svelte-121e1a8.svelte-121e1a8::before{content:"";width:35px;height:35px;border-radius:50%;background:var(--color);position:absolute;top:0;left:0;transition:0.5s}input[type="checkbox"].svelte-121e1a8.svelte-121e1a8:checked::before{transform:translateX(100%);background:white}input[type="checkbox"].svelte-121e1a8.svelte-121e1a8:checked{background:var(--active)}@media screen and (max-width: 1650px){.container.svelte-121e1a8.svelte-121e1a8{border-radius:0}}@media screen and (max-width: 1500px){.list-items.svelte-121e1a8.svelte-121e1a8{text-align:center;width:4.5rem}.nav-icon.svelte-121e1a8.svelte-121e1a8{font-size:32px;margin:0}}',
  map: null
};
const Nav = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_dashState;
  $$unsubscribe_dashState = subscribe(dashState, (value) => value);
  let lightMode = false;
  let mainBackground, color, activeColor, checkedColor, lineColor = { colors };
  $$result.css.add(css);
  {
    {
      {
        mainBackground = "#242529";
        color = "white";
        activeColor = "#353537";
        checkedColor = "#242529";
        lineColor = "#2c2d32";
        dashState.set(["dash", "dark-mode"]);
      }
    }
  }
  $$unsubscribe_dashState();
  return `${$$result.head += `<!-- HEAD_svelte-1u7c4wr_START --><script src="https://kit.fontawesome.com/db3c0028dc.js" crossorigin="anonymous" class="svelte-121e1a8" data-svelte-h="svelte-n7a8b2"><\/script><!-- HEAD_svelte-1u7c4wr_END -->`, ""} <div class="container svelte-121e1a8" style="${"--main-background: " + escape(mainBackground, true) + "; --color: " + escape(color, true) + "; --active: " + escape(activeColor, true) + "; --checked: " + escape(checkedColor, true) + "; --line: " + escape(lineColor, true) + ";"}"><div class="logo-container svelte-121e1a8" data-svelte-h="svelte-ff120r"><h3 class="svelte-121e1a8">HB</h3></div> <div class="profile-container svelte-121e1a8"><div class="img-container svelte-121e1a8" data-svelte-h="svelte-10qgpec"><img src="https://t3.ftcdn.net/jpg/05/47/85/88/360_F_547858830_cnWFvIG7SYsC2GLRDoojuZToysoUna4Y.jpg" alt="user" class="svelte-121e1a8"></div> <div class="name-container svelte-121e1a8" data-svelte-h="svelte-1x7evak"><h3 class="svelte-121e1a8">Brian Kim</h3></div> <div class="profile-btn-container svelte-121e1a8"><button class="svelte-121e1a8" data-svelte-h="svelte-18pj98t">Edit</button></div></div> <div class="nav-container svelte-121e1a8"><ul class="svelte-121e1a8">${validate_component(MediaQuery, "MediaQuery").$$render($$result, { query: "(max-width: 1500px)" }, {}, {
    default: ({ matches }) => {
      return `${matches ? `<li class="${"list-items " + escape("active", true) + " svelte-121e1a8"}"><a href="/dashboard" class="svelte-121e1a8" data-svelte-h="svelte-1s5mgtr"><i class="fa-solid fa-grip-vertical nav-icon svelte-121e1a8"></i></a></li> <li class="${"list-items " + escape("", true) + " svelte-121e1a8"}"><a href="/dashboard/messages" class="svelte-121e1a8" data-svelte-h="svelte-19tew71"><i class="fa-solid fa-envelope nav-icon svelte-121e1a8"></i></a></li> <li class="${"list-items " + escape("", true) + " svelte-121e1a8"}"><a href="/dashboard/schedule" class="svelte-121e1a8" data-svelte-h="svelte-1gzkneg"><i class="fa-regular fa-calendar-days nav-icon svelte-121e1a8"></i></a></li> <li class="${"list-items " + escape("", true) + " svelte-121e1a8"}"><a href="/dashboard/manage" class="svelte-121e1a8" data-svelte-h="svelte-s9lssa"><i class="fa-solid fa-users nav-icon svelte-121e1a8"></i></a></li> <li class="${"list-items " + escape("", true) + " svelte-121e1a8"}"><a href="/dashboard/settings" class="svelte-121e1a8" data-svelte-h="svelte-1qzc53a"><i class="fa-solid fa-gear nav-icon svelte-121e1a8"></i></a></li>` : `<li class="${"list-items " + escape("active", true) + " svelte-121e1a8"}"><a href="/dashboard" class="svelte-121e1a8" data-svelte-h="svelte-f1oo91"><i class="fa-solid fa-grip-vertical nav-icon svelte-121e1a8"></i>Dashboard</a></li> <li class="${"list-items " + escape("", true) + " svelte-121e1a8"}"><a href="/dashboard/messages" class="svelte-121e1a8" data-svelte-h="svelte-12ww0zp"><i class="fa-solid fa-envelope nav-icon svelte-121e1a8"></i>Messages</a></li> <li class="${"list-items " + escape("", true) + " svelte-121e1a8"}"><a href="/dashboard/schedule" class="svelte-121e1a8" data-svelte-h="svelte-1gld9j5"><i class="fa-regular fa-calendar-days nav-icon svelte-121e1a8"></i>Schedule</a></li> <li class="${"list-items " + escape("", true) + " svelte-121e1a8"}"><a href="/dashboard/manage" class="svelte-121e1a8" data-svelte-h="svelte-1eravog"><i class="fa-solid fa-users nav-icon svelte-121e1a8"></i>Managment</a></li> <li class="${"list-items " + escape("", true) + " svelte-121e1a8"}"><a href="/dashboard/settings" class="svelte-121e1a8" data-svelte-h="svelte-rhabex"><i class="fa-solid fa-gear nav-icon svelte-121e1a8"></i>Settings</a></li>`}`;
    }
  })}</ul></div> <div class="mode-container svelte-121e1a8">${validate_component(MediaQuery, "MediaQuery").$$render($$result, { query: "(max-width: 1500px)" }, {}, {
    default: ({ matches }) => {
      return `${matches ? `<input type="checkbox" class="svelte-121e1a8"${add_attribute("checked", lightMode, 1)}>` : `<label for="toggle on Dark Mode" class="svelte-121e1a8" data-svelte-h="svelte-352evc">Dark</label> <input type="checkbox" class="svelte-121e1a8"${add_attribute("checked", lightMode, 1)}> <label for="toggle on Light Mode" class="svelte-121e1a8" data-svelte-h="svelte-zubejm">Light</label>`}`;
    }
  })}</div> </div>`;
});
const edit_svelte_svelte_type_style_lang = "";
export {
  Nav as N,
  colors as c,
  dashState as d
};
