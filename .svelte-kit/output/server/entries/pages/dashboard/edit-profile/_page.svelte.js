import { c as create_ssr_component, a as subscribe, e as escape, b as add_attribute, v as validate_component } from "../../../../chunks/ssr.js";
import { d as dashState, c as colors, N as Nav } from "../../../../chunks/edit.svelte_svelte_type_style_lang.js";
const css$1 = {
  code: 'main.svelte-1epex81.svelte-1epex81{background-color:var(--main-background);display:grid;grid-template-columns:20% 70%;padding:2rem;gap:5rem;border-top-right-radius:32px;border-bottom-right-radius:32px}#first-column.svelte-1epex81.svelte-1epex81{display:flex;align-items:center;flex-direction:column}.changepfp.svelte-1epex81.svelte-1epex81{display:flex;align-items:center;flex-direction:column;color:var(--color)}.changepfp.svelte-1epex81 h1.svelte-1epex81{font-size:32px;text-align:center}.changepfp.svelte-1epex81 img.svelte-1epex81{height:10rem;border-radius:50%;padding:1rem 0}.changepfp.svelte-1epex81 input.svelte-1epex81{display:none}.change-name.svelte-1epex81.svelte-1epex81{margin-top:2rem;padding:1rem;display:flex;gap:1rem;color:var(--color);align-items:center}.change-name.svelte-1epex81 h2.svelte-1epex81{font-size:26px;margin:0}.change-name.svelte-1epex81 button.svelte-1epex81{background-color:transparent;font-size:18px;color:white;border:none;cursor:pointer;text-decoration:underline}.button.svelte-1epex81.svelte-1epex81{cursor:pointer;font-size:18px;width:10rem;padding:0.3rem;background-color:var(--active);color:white;border:none;border-radius:18px}.button.svelte-1epex81.svelte-1epex81:hover{transition:200ms ease;opacity:0.8}.local-time.svelte-1epex81.svelte-1epex81{display:flex;flex-direction:column;justify-content:flex-start;align-items:center;color:var(--color)}.local-time.svelte-1epex81 h6.svelte-1epex81{font-size:18px;margin:0}.local-time.svelte-1epex81 button.svelte-1epex81{margin-top:1rem;width:130%;height:150%}.info.svelte-1epex81.svelte-1epex81{display:flex;align-items:center;flex-direction:column;color:var(--color)}.info.svelte-1epex81 h3.svelte-1epex81{font-size:32px;margin:0;margin-top:2rem}.info.svelte-1epex81 ul.svelte-1epex81{list-style-type:decimal}.info.svelte-1epex81 ul li.svelte-1epex81{padding:0.4rem;font-size:24px;cursor:pointer}.info.svelte-1epex81 ul li.svelte-1epex81:hover{text-decoration:line-through}.info.svelte-1epex81 input.svelte-1epex81{border:none;border-radius:24px;font-size:19px;width:12rem;background-color:var(--line);color:white}.info.svelte-1epex81 input.svelte-1epex81:focus{outline:none}.info.svelte-1epex81 input.svelte-1epex81::placeholder{text-align:center}.info.svelte-1epex81 button.svelte-1epex81{margin-top:0.5rem}.slideshow-container.svelte-1epex81.svelte-1epex81{display:flex;justify-content:center;align-items:center;min-height:40rem;border:2px solid var(--active);border-radius:32px;margin-top:2rem}.img-container.svelte-1epex81.svelte-1epex81{display:flex;height:100%;width:100%;position:relative}.switch-btns.svelte-1epex81.svelte-1epex81{display:flex;justify-content:center;gap:3rem;margin-top:1rem}.slideshow-container.svelte-1epex81 img.svelte-1epex81{height:100%;width:100%;object-fit:cover;padding:1rem;border-radius:32px}.img-btn-container.svelte-1epex81.svelte-1epex81{display:flex;gap:0.5rem;position:absolute;top:30px;right:30px}.img-btn-container.svelte-1epex81 button.svelte-1epex81{cursor:pointer;font-size:32px;min-width:4rem;background-color:var(--active);border-radius:32px;border:none;padding:0.3rem;position:relative}.img-btn-container.svelte-1epex81 button.svelte-1epex81:hover{opacity:0.7}.img-btn-container.svelte-1epex81 button.svelte-1epex81:hover::after{background-color:var(--color);padding:0.3rem;font-size:12px;position:absolute;width:6rem;bottom:-1.5rem;left:-50%}.img-btn-container.svelte-1epex81 button.svelte-1epex81:hover:nth-child(1)::after{content:"Make First Image"}.img-btn-container.svelte-1epex81 button.svelte-1epex81:hover:nth-child(2)::after{content:"Delete"}.fav.svelte-1epex81.svelte-1epex81{display:none}@media screen and (max-width: 983px){main.svelte-1epex81.svelte-1epex81{display:flex;align-items:center;flex-direction:column}}',
  map: null
};
const Edit = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $dashState, $$unsubscribe_dashState;
  $$unsubscribe_dashState = subscribe(dashState, (value) => $dashState = value);
  let state;
  let mainBackground, color, activeColor, checkedColor, lineColor = { colors };
  let images = [
    "https://www.muscleandfitness.com/wp-content/uploads/2013/06/intro-ez-bar.jpg?quality=86&strip=all",
    "https://yt3.googleusercontent.com/_jCI5T_p1HCJO8JV0JZ4DMRHw6EEZ3VUnuGZsr5GQMsGR11TVXg47BIbBksQqltirrTrS_uYaQ=s900-c-k-c0x00ffffff-no-rj"
  ];
  let currentImage = [images[0]];
  let usersFavoriteImg = "";
  $$result.css.add(css$1);
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
  return `<main style="${"--main-background: " + escape(mainBackground, true) + "; --color: " + escape(color, true) + "; --active: " + escape(activeColor, true) + "; --checked: " + escape(checkedColor, true) + "; --line: " + escape(lineColor, true) + ";"}" class="svelte-1epex81"><div class="column svelte-1epex81" id="first-column"><div class="changepfp svelte-1epex81"><h1 class="svelte-1epex81" data-svelte-h="svelte-1o5ke4h">Edit Profile</h1> <img src="https://t3.ftcdn.net/jpg/05/47/85/88/360_F_547858830_cnWFvIG7SYsC2GLRDoojuZToysoUna4Y.jpg" alt="user" class="svelte-1epex81"> <input type="file" class="svelte-1epex81"> <button class="button svelte-1epex81" data-svelte-h="svelte-11dw6yp">Choose Image</button></div> <div class="change-name svelte-1epex81" data-svelte-h="svelte-1te334i"><h2 class="svelte-1epex81">Brian Kim</h2> <button class="svelte-1epex81">Edit</button></div> <div class="local-time svelte-1epex81" data-svelte-h="svelte-1y0m3yp"><h6 class="svelte-1epex81">5:21 PM local time</h6> <button class="button svelte-1epex81">Change Time Zone</button></div> <div class="info svelte-1epex81">${`<h3 class="svelte-1epex81" data-svelte-h="svelte-1nl40cx">Tags</h3> <ul class="svelte-1epex81" data-svelte-h="svelte-at8ryk"><li class="svelte-1epex81">Weight Lost</li> <li class="svelte-1epex81">Fat Lost</li> <li class="svelte-1epex81">Muscle Gain</li></ul>`} <input type="text" placeholder="${"Add new " + escape("tag", true) + "..."}" class="svelte-1epex81"> <button class="button svelte-1epex81" data-svelte-h="svelte-16oaq8m">Add</button></div></div> <div class="column" id="second-column"><div class="slideshow-container svelte-1epex81"><div class="img-container svelte-1epex81"><img${add_attribute("src", currentImage, 0)} alt="" id="img" class="svelte-1epex81"> <div class="img-btn-container svelte-1epex81"><button class="${escape(usersFavoriteImg === currentImage ? "fav" : "", true) + " icon-btn svelte-1epex81"}">⭐</button> <button class="icon-btn svelte-1epex81" data-svelte-h="svelte-18qx7cd"><i class="fa-solid fa-x" style="color: #ff0000;"></i></button></div></div></div> <div class="switch-btns svelte-1epex81"><button class="button svelte-1epex81" data-svelte-h="svelte-1tinz8u"><i class="fa-solid fa-arrow-left" style="color: #ffffff;"></i></button> <input type="file" style="display: none;"> <button class="button svelte-1epex81" data-svelte-h="svelte-hrapvd">Add Photo</button> <button class="button svelte-1epex81" data-svelte-h="svelte-fmajp0"><i class="fa-solid fa-arrow-right" style="color: #ffffff;"></i></button></div></div> </main>`;
});
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
  return `<body style="${"--main-background: " + escape(mainBackground, true) + "; --color: " + escape(color, true) + "; --active: " + escape(activeColor, true) + "; --checked: " + escape(checkedColor, true) + "; --line: " + escape(lineColor, true) + ";"}" class="svelte-fvaqgc"><div class="container svelte-fvaqgc">${validate_component(Nav, "Nav").$$render($$result, {}, {}, {})} ${validate_component(Edit, "Edit").$$render($$result, {}, {}, {})}</div> </body>`;
});
export {
  Page as default
};
