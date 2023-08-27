import { c as create_ssr_component, e as escape, b as add_attribute } from "../../../chunks/ssr.js";
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: `@import url('https://fonts.googleapis.com/css2?family=Raleway&display=swap');.svelte-1x0nbx{box-sizing:border-box;margin:0;padding:0;font-family:"Raleway", sans-serif}main.svelte-1x0nbx{background-image:linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%);margin:0;padding:0}.container.svelte-1x0nbx{height:100vh;width:100%;display:flex;justify-content:center;align-items:center}.title.svelte-1x0nbx{font-size:48px;text-align:center;margin-top:30px}.form-container.svelte-1x0nbx{background-color:antiquewhite;display:flex;justify-content:center;flex-wrap:wrap;height:450px;min-width:30%;border-radius:8px;transition:500ms ease-in;scale:1.5;height:fit-content;padding:1rem}form.svelte-1x0nbx{margin-top:3rem}.input-field.svelte-1x0nbx{height:40px;width:300px;outline:0;background-color:inherit;border-width:0 0 1px;border-color:grey}.sign-text.svelte-1x0nbx{text-align:center;margin-top:30px;font-size:14px}.login.svelte-1x0nbx{margin-top:1rem;height:40px;width:300px;border-radius:8px;background-color:#4158D0;color:white;border:none;cursor:pointer}.login.svelte-1x0nbx:hover{background-color:#6678d1;transition:200ms ease}.little-msg.svelte-1x0nbx{font-size:14px;color:#344c84;cursor:pointer}.little-msg.svelte-1x0nbx:hover{color:#4a629b}.login-container.svelte-1x0nbx{display:block}.signup-container.svelte-1x0nbx{display:none}.svelte-1x0nbx::placeholder{color:var(--g, "grey");opacity:1}.error-msg.svelte-1x0nbx{position:absolute;font-size:14px;margin:0 auto;margin-top:20px;color:red;border-radius:4px;transition:500ms ease-in;display:none;width:100%;left:0;text-align:center;font-weight:bold;flex-wrap:wrap}.btns-container.svelte-1x0nbx{display:flex;justify-content:center;flex-direction:column;margin-top:1rem}@media screen and (max-width: 555px){.form-container.svelte-1x0nbx{scale:1}}`,
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let loginPage;
  let signupPage;
  $$result.css.add(css);
  return `${$$result.head += `<!-- HEAD_svelte-1v066jg_START -->${$$result.title = `<title>${escape(
    "HumbleBeast Login"
  )}</title>`, ""}<!-- HEAD_svelte-1v066jg_END -->`, ""}  <main class="svelte-1x0nbx"><div class="container svelte-1x0nbx"><div class="form-container svelte-1x0nbx"><div class="login-container svelte-1x0nbx"${add_attribute("this", loginPage, 0)}><h1 class="title svelte-1x0nbx" data-svelte-h="svelte-x3hgi0">Login</h1> <div class="error-msg svelte-1x0nbx" data-svelte-h="svelte-ccqfe"><h1 class="svelte-1x0nbx">Error</h1></div> <form action="" name="Login" id="Login-form" class="svelte-1x0nbx"><input name="Email" placeholder="Email" class="input-field svelte-1x0nbx" autocomplete="off"> <br class="svelte-1x0nbx"><br class="svelte-1x0nbx"> <input type="password" name="Pass" placeholder="Password" class="input-field svelte-1x0nbx" autocomplete="off"> <br class="svelte-1x0nbx"><br class="svelte-1x0nbx"> <div class="btns-container svelte-1x0nbx"><input type="submit" value="Login" class="login svelte-1x0nbx" id="Login-submit"> <button class="login svelte-1x0nbx" data-svelte-h="svelte-1s35skw">Back</button></div> <h6 class="sign-text svelte-1x0nbx">Not a member? <span class="little-msg svelte-1x0nbx" data-svelte-h="svelte-1iinj3w">Signup</span></h6></form></div> <div class="signup-container svelte-1x0nbx"${add_attribute("this", signupPage, 0)}><h1 class="title svelte-1x0nbx" data-svelte-h="svelte-dt4qq9">Signup</h1> <div class="error-msg svelte-1x0nbx" data-svelte-h="svelte-ccqfe"><h1 class="svelte-1x0nbx">Error</h1></div> <form action="" id="Signup" name="Signup" class="svelte-1x0nbx"><input type="email" name="Email1" placeholder="Email" class="input-field svelte-1x0nbx" autocomplete="off"> <br class="svelte-1x0nbx"><br class="svelte-1x0nbx"> <input type="password" name="Pass1" placeholder="Password" class="input-field svelte-1x0nbx" autocomplete="off"> <br class="svelte-1x0nbx"><br class="svelte-1x0nbx"> <input type="password" name="ConPass" placeholder="Confirm Password" class="input-field svelte-1x0nbx" autocomplete="off"> <br class="svelte-1x0nbx"><br class="svelte-1x0nbx"> <div class="btns-container svelte-1x0nbx"><input type="submit" value="Signup" class="login svelte-1x0nbx" id="Signup-Submit"> <button class="login svelte-1x0nbx" data-svelte-h="svelte-1s35skw">Back</button></div> <h6 class="sign-text svelte-1x0nbx">Already a member? <span class="little-msg svelte-1x0nbx" data-svelte-h="svelte-q42frq">Login</span></h6></form></div></div></div> </main>`;
});
export {
  Page as default
};
