import{s as Ke,n as Oe,r as Qe,o as We,b as Fe}from"../chunks/scheduler.1f6706a1.js";import{S as Xe,i as Ye,s as o,g as s,m as je,y as Ze,f as m,c as r,h as l,j as _,z as R,n as ze,k as e,a as Ge,x as t,A as Q,C as Je}from"../chunks/index.6dfe87dd.js";import{s as ke}from"../chunks/store.059aa0f5.js";const $e=typeof window<"u"?window:typeof globalThis<"u"?globalThis:global;const{document:Ie}=$e;function et(b){let U,x,c,p,h,u,y,ce="Login",W,C,Z='<h1 class="svelte-1x0nbx">Error</h1>',j,a,P,X,z,G,d,f,q,$,ee,de,S,A,pe,B,Ne="Back",ve,D,me,T,He="Signup",be,g,M,Re="Signup",xe,V,Ue='<h1 class="svelte-1x0nbx">Error</h1>',he,n,L,fe,te,se,ge,w,_e,le,ne,ye,k,Ce,ae,oe,Pe,I,O,Ee,N,qe="Back",Se,F,Be,H,Ae="Login",Te,De;return Ie.title=U=b[2]?"HumbleBeast Login":"HumbleBeast Signup",{c(){x=o(),c=s("main"),p=s("div"),h=s("div"),u=s("div"),y=s("h1"),y.textContent=ce,W=o(),C=s("div"),C.innerHTML=Z,j=o(),a=s("form"),P=s("input"),X=o(),z=s("br"),G=s("br"),d=o(),f=s("input"),q=o(),$=s("br"),ee=s("br"),de=o(),S=s("div"),A=s("input"),pe=o(),B=s("button"),B.textContent=Ne,ve=o(),D=s("h6"),me=je("Not a member? "),T=s("span"),T.textContent=He,be=o(),g=s("div"),M=s("h1"),M.textContent=Re,xe=o(),V=s("div"),V.innerHTML=Ue,he=o(),n=s("form"),L=s("input"),fe=o(),te=s("br"),se=s("br"),ge=o(),w=s("input"),_e=o(),le=s("br"),ne=s("br"),ye=o(),k=s("input"),Ce=o(),ae=s("br"),oe=s("br"),Pe=o(),I=s("div"),O=s("input"),Ee=o(),N=s("button"),N.textContent=qe,Se=o(),F=s("h6"),Be=je("Already a member? "),H=s("span"),H.textContent=Ae,this.h()},l(E){Ze("svelte-1v066jg",Ie.head).forEach(m),x=r(E),c=l(E,"MAIN",{class:!0});var Me=_(c);p=l(Me,"DIV",{class:!0});var Ve=_(p);h=l(Ve,"DIV",{class:!0});var re=_(h);u=l(re,"DIV",{class:!0});var J=_(u);y=l(J,"H1",{class:!0,"data-svelte-h":!0}),R(y)!=="svelte-x3hgi0"&&(y.textContent=ce),W=r(J),C=l(J,"DIV",{class:!0,"data-svelte-h":!0}),R(C)!=="svelte-ccqfe"&&(C.innerHTML=Z),j=r(J),a=l(J,"FORM",{action:!0,name:!0,id:!0,class:!0});var v=_(a);P=l(v,"INPUT",{name:!0,placeholder:!0,class:!0,autocomplete:!0}),X=r(v),z=l(v,"BR",{class:!0}),G=l(v,"BR",{class:!0}),d=r(v),f=l(v,"INPUT",{type:!0,name:!0,placeholder:!0,class:!0,autocomplete:!0}),q=r(v),$=l(v,"BR",{class:!0}),ee=l(v,"BR",{class:!0}),de=r(v),S=l(v,"DIV",{class:!0});var ie=_(S);A=l(ie,"INPUT",{type:!0,class:!0,id:!0}),pe=r(ie),B=l(ie,"BUTTON",{class:!0,"data-svelte-h":!0}),R(B)!=="svelte-1s35skw"&&(B.textContent=Ne),ie.forEach(m),ve=r(v),D=l(v,"H6",{class:!0});var Le=_(D);me=ze(Le,"Not a member? "),T=l(Le,"SPAN",{class:!0,"data-svelte-h":!0}),R(T)!=="svelte-1iinj3w"&&(T.textContent=He),Le.forEach(m),v.forEach(m),J.forEach(m),be=r(re),g=l(re,"DIV",{class:!0});var K=_(g);M=l(K,"H1",{class:!0,"data-svelte-h":!0}),R(M)!=="svelte-dt4qq9"&&(M.textContent=Re),xe=r(K),V=l(K,"DIV",{class:!0,"data-svelte-h":!0}),R(V)!=="svelte-ccqfe"&&(V.innerHTML=Ue),he=r(K),n=l(K,"FORM",{action:!0,id:!0,name:!0,class:!0});var i=_(n);L=l(i,"INPUT",{type:!0,name:!0,placeholder:!0,class:!0,autocomplete:!0}),fe=r(i),te=l(i,"BR",{class:!0}),se=l(i,"BR",{class:!0}),ge=r(i),w=l(i,"INPUT",{type:!0,name:!0,placeholder:!0,class:!0,autocomplete:!0}),_e=r(i),le=l(i,"BR",{class:!0}),ne=l(i,"BR",{class:!0}),ye=r(i),k=l(i,"INPUT",{type:!0,name:!0,placeholder:!0,class:!0,autocomplete:!0}),Ce=r(i),ae=l(i,"BR",{class:!0}),oe=l(i,"BR",{class:!0}),Pe=r(i),I=l(i,"DIV",{class:!0});var ue=_(I);O=l(ue,"INPUT",{type:!0,class:!0,id:!0}),Ee=r(ue),N=l(ue,"BUTTON",{class:!0,"data-svelte-h":!0}),R(N)!=="svelte-1s35skw"&&(N.textContent=qe),ue.forEach(m),Se=r(i),F=l(i,"H6",{class:!0});var we=_(F);Be=ze(we,"Already a member? "),H=l(we,"SPAN",{class:!0,"data-svelte-h":!0}),R(H)!=="svelte-q42frq"&&(H.textContent=Ae),we.forEach(m),i.forEach(m),K.forEach(m),re.forEach(m),Ve.forEach(m),Me.forEach(m),this.h()},h(){e(y,"class","title svelte-1x0nbx"),e(C,"class","error-msg svelte-1x0nbx"),e(P,"name","Email"),e(P,"placeholder","Email"),e(P,"class","input-field svelte-1x0nbx"),e(P,"autocomplete","off"),e(z,"class","svelte-1x0nbx"),e(G,"class","svelte-1x0nbx"),e(f,"type","password"),e(f,"name","Pass"),e(f,"placeholder","Password"),e(f,"class","input-field svelte-1x0nbx"),e(f,"autocomplete","off"),e($,"class","svelte-1x0nbx"),e(ee,"class","svelte-1x0nbx"),e(A,"type","submit"),A.value="Login",e(A,"class","login svelte-1x0nbx"),e(A,"id","Login-submit"),e(B,"class","login svelte-1x0nbx"),e(S,"class","btns-container svelte-1x0nbx"),e(T,"class","little-msg svelte-1x0nbx"),e(D,"class","sign-text svelte-1x0nbx"),e(a,"action",""),e(a,"name","Login"),e(a,"id","Login-form"),e(a,"class","svelte-1x0nbx"),e(u,"class","login-container svelte-1x0nbx"),e(M,"class","title svelte-1x0nbx"),e(V,"class","error-msg svelte-1x0nbx"),e(L,"type","email"),e(L,"name","Email1"),e(L,"placeholder","Email"),e(L,"class","input-field svelte-1x0nbx"),e(L,"autocomplete","off"),e(te,"class","svelte-1x0nbx"),e(se,"class","svelte-1x0nbx"),e(w,"type","password"),e(w,"name","Pass1"),e(w,"placeholder","Password"),e(w,"class","input-field svelte-1x0nbx"),e(w,"autocomplete","off"),e(le,"class","svelte-1x0nbx"),e(ne,"class","svelte-1x0nbx"),e(k,"type","password"),e(k,"name","ConPass"),e(k,"placeholder","Confirm Password"),e(k,"class","input-field svelte-1x0nbx"),e(k,"autocomplete","off"),e(ae,"class","svelte-1x0nbx"),e(oe,"class","svelte-1x0nbx"),e(O,"type","submit"),O.value="Signup",e(O,"class","login svelte-1x0nbx"),e(O,"id","Signup-Submit"),e(N,"class","login svelte-1x0nbx"),e(I,"class","btns-container svelte-1x0nbx"),e(H,"class","little-msg svelte-1x0nbx"),e(F,"class","sign-text svelte-1x0nbx"),e(n,"action",""),e(n,"id","Signup"),e(n,"name","Signup"),e(n,"class","svelte-1x0nbx"),e(g,"class","signup-container svelte-1x0nbx"),e(h,"class","form-container svelte-1x0nbx"),e(p,"class","container svelte-1x0nbx"),e(c,"class","svelte-1x0nbx")},m(E,Y){Ge(E,x,Y),Ge(E,c,Y),t(c,p),t(p,h),t(h,u),t(u,y),t(u,W),t(u,C),t(u,j),t(u,a),t(a,P),t(a,X),t(a,z),t(a,G),t(a,d),t(a,f),t(a,q),t(a,$),t(a,ee),t(a,de),t(a,S),t(S,A),t(S,pe),t(S,B),t(a,ve),t(a,D),t(D,me),t(D,T),b[7](u),t(h,be),t(h,g),t(g,M),t(g,xe),t(g,V),t(g,he),t(g,n),t(n,L),t(n,fe),t(n,te),t(n,se),t(n,ge),t(n,w),t(n,_e),t(n,le),t(n,ne),t(n,ye),t(n,k),t(n,Ce),t(n,ae),t(n,oe),t(n,Pe),t(n,I),t(I,O),t(I,Ee),t(I,N),t(n,Se),t(n,F),t(F,Be),t(F,H),b[8](g),Te||(De=[Q(B,"click",b[6]),Q(T,"click",b[3]),Q(a,"submit",Je(b[5])),Q(N,"click",b[6]),Q(H,"click",b[4]),Q(n,"submit",Je(b[5]))],Te=!0)},p(E,[Y]){Y&4&&U!==(U=E[2]?"HumbleBeast Login":"HumbleBeast Signup")&&(Ie.title=U)},i:Oe,o:Oe,d(E){E&&(m(x),m(c)),b[7](null),b[8](null),Te=!1,Qe(De)}}}function tt(b,U,x){let c,p,h=!0,u=[],y=[];We(()=>{y=document.querySelectorAll(".input-field"),u=document.querySelectorAll(".error-msg")});const W=()=>{x(0,c.style.display="none",c),x(1,p.style.display="block",p),x(2,h=!1)},C=()=>{x(0,c.style.display="block",c),x(1,p.style.display="none",p),x(2,h=!0)},Z=()=>{h?!document.Login.Email.value.includes("@")||document.Login.Pass.value==""?j(0,""):P(document.Login.Email.value,document.Login.Pass.value):!document.Signup.Email1.value.includes("@")||document.Signup.Pass1.value!==document.Signup.ConPass.value?j(1,""):a(document.Signup.Email1.value,document.Signup.Pass1.value)},j=(d,f)=>{f!==""?u[d].textContent=f:u[d].textContent="Please Fill Out Credentials Correctly",u[d].style.display="block",y.forEach(q=>{q.style.borderColor="#F77559",q.style.setProperty("--g","red"),q.value=""})},a=(d,f)=>{ke.set("dashboard")},P=(d,f)=>{ke.set("dashboard")},X=()=>{ke.set("front-page")};function z(d){Fe[d?"unshift":"push"](()=>{c=d,x(0,c)})}function G(d){Fe[d?"unshift":"push"](()=>{p=d,x(1,p)})}return[c,p,h,W,C,Z,X,z,G]}class at extends Xe{constructor(U){super(),Ye(this,U,tt,et,Ke,{})}}export{at as component};