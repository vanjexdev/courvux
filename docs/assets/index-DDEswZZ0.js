(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const d of document.querySelectorAll('link[rel="modulepreload"]'))u(d);new MutationObserver(d=>{for(const w of d)if(w.type==="childList")for(const E of w.addedNodes)E.tagName==="LINK"&&E.rel==="modulepreload"&&u(E)}).observe(document,{childList:!0,subtree:!0});function t(d){const w={};return d.integrity&&(w.integrity=d.integrity),d.referrerPolicy&&(w.referrerPolicy=d.referrerPolicy),d.crossOrigin==="use-credentials"?w.credentials="include":d.crossOrigin==="anonymous"?w.credentials="omit":w.credentials="same-origin",w}function u(d){if(d.ep)return;d.ep=!0;const w=t(d);fetch(d.href,w)}})();var dt=new Set(["push","pop","shift","unshift","splice","sort","reverse"]),Fe=new WeakSet,ut=Symbol("raw"),ge=0,_e=new Map,pe=null;function Oe(n){const e=[],t=pe;pe=e;try{n()}finally{pe=t}return e}function pt(n){ge++;try{n()}finally{if(ge--,ge===0){const e=[..._e.values()];_e.clear(),e.forEach(t=>t())}}}function Qe(n,e){return n===null||typeof n!="object"||Fe.has(n)?n:new Proxy(n,{get(t,u){if(Array.isArray(t)&&dt.has(u))return(...w)=>{const E=Array.prototype[u].apply(t,w);return e(),E};const d=t[u];return d!==null&&typeof d=="object"&&!Fe.has(d)?Qe(d,e):d},set(t,u,d){return t[u]=d,e(),!0}})}function Te(){const n={},e=Math.random().toString(36).slice(2),t=(w,E)=>(n[w]||(n[w]=new Set),n[w].add(E),()=>{var b;(b=n[w])==null||b.delete(E)}),u=w=>{ge>0?_e.set(`${e}:${w}`,()=>{(n[w]?[...n[w]]:[]).forEach(E=>E())}):(n[w]?[...n[w]]:[]).forEach(E=>E())},d={};return{subscribe:t,createReactiveState:w=>new Proxy(w,{get(E,b){if(b===ut)return w;typeof b=="string"&&!b.startsWith("$")&&pe&&pe.push({sub:t,key:b});const D=E[b];return typeof b=="string"&&!b.startsWith("$")&&D!==null&&typeof D=="object"&&!Fe.has(D)?Qe(D,()=>u(b)):D},set(E,b,D){if(d[b])return d[b](D),!0;const L=E[b];return E[b]=D,(L!==D||D!==null&&typeof D=="object")&&u(b),!0}}),registerSetInterceptor:(w,E)=>{d[w]=E},notifyAll:()=>{Object.keys(n).forEach(w=>u(w))}}}var Se=new WeakMap;function me(n,e,t){var d,w;const u=e.indexOf(".");if(u>=0){const E=e.slice(0,u),b=e.slice(u+1),D=n[E];return D&&Se.has(D)?me(D,b,t):((d=Se.get(n))==null?void 0:d(E,t))??(()=>{})}return((w=Se.get(n))==null?void 0:w(e,t))??(()=>{})}var et=(n,e)=>n.split(".").reduce((t,u)=>t==null?void 0:t[u],e),tt=(()=>{try{return new Function("return 1")(),!0}catch{return console.warn("[courvux] CSP blocks eval. Expressions limited to property access and literals."),!1}})(),Le=new Map,je=new Map,nt=(n,e)=>{const t=n.trim();if(t==="true")return!0;if(t==="false")return!1;if(t==="null")return null;if(t!=="undefined")return/^-?\d+(\.\d+)?$/.test(t)?parseFloat(t):/^(['"`])(.*)\1$/s.test(t)?t.slice(1,-1):t.startsWith("!")?!nt(t.slice(1).trim(),e):et(t,e)},N=(n,e)=>{if(!tt)return nt(n,e);try{let t=Le.get(n);return t||(t=new Function("$data",`with($data) { return (${n}) }`),Le.set(n,t)),t(e)}catch{return et(n,e)}},de=(n,e,t)=>n.startsWith("$store.")&&e.store?e.storeSubscribeOverride?e.storeSubscribeOverride(e.store,n.slice(7),t):me(e.store,n.slice(7),t):e.subscribe(n,t),J=(n,e,t)=>{const u=new Set(["true","false","null","undefined","in","of","typeof","instanceof"]),d=n.match(/\$?[a-zA-Z_][\w$]*(?:\.\$?[a-zA-Z_][\w$]*)*/g)??[],w=[...new Set(d.filter(b=>!u.has(b.split(".")[0])))];if(w.length===0)return()=>{};const E=w.map(b=>de(b,e,t));return()=>E.forEach(b=>b())},ce=(n,e,t)=>{const u=n.split(".");if(u.length===1)e[u[0]]=t;else{const d=u.slice(0,-1).reduce((w,E)=>w==null?void 0:w[E],e);d&&(d[u[u.length-1]]=t)}},Pe=(n,e,t,u,d)=>{const w={};return Object.keys(n).forEach(E=>w[E]=n[E]),w[t]=e,d&&(w[d]=u),w},Ce=n=>n?typeof n=="string"?n:Array.isArray(n)?n.map(Ce).filter(Boolean).join(" "):typeof n=="object"?Object.entries(n).filter(([,e])=>!!e).map(([e])=>e).join(" "):"":"",De=(n,e,t)=>{if(!e){n.style.cssText=t;return}typeof e=="string"?n.style.cssText=t?`${t};${e}`:e:typeof e=="object"&&(t&&(n.style.cssText=t),Object.entries(e).forEach(([u,d])=>{n.style[u]=d??""}))},Ie=(n,e,t)=>{if(tt)try{let u=je.get(n);u||(u=new Function("__p__",`with(__p__){${n}}`),je.set(n,u));const d=new Proxy({},{has:()=>!0,get:(w,E)=>E==="$event"?t:E in e?e[E]:globalThis[E],set:(w,E,b)=>(e[E]=b,!0)});u(d)}catch(u){console.warn(`[courvux] handler error "${n}":`,u)}},re=n=>{const e=getComputedStyle(n),t=Math.max(parseFloat(e.animationDuration)||0,parseFloat(e.transitionDuration)||0)*1e3;return t<=0?Promise.resolve():new Promise(u=>{const d=()=>u();n.addEventListener("animationend",d,{once:!0}),n.addEventListener("transitionend",d,{once:!0}),setTimeout(d,t+50)})},mt=`
.cv-t-wrap{overflow:hidden}
.fade-enter{animation:cvt-fade-in 0.25s forwards}
.fade-leave{animation:cvt-fade-out 0.25s forwards}
.slide-down-enter{animation:cvt-slide-down-in 0.25s forwards}
.slide-down-leave{animation:cvt-slide-down-out 0.25s forwards}
.slide-up-enter{animation:cvt-slide-up-in 0.2s forwards}
.slide-up-leave{animation:cvt-slide-up-out 0.2s forwards}
@keyframes cvt-fade-in{from{opacity:0}to{opacity:1}}
@keyframes cvt-fade-out{from{opacity:1}to{opacity:0}}
@keyframes cvt-slide-down-in{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
@keyframes cvt-slide-down-out{from{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(-8px)}}
@keyframes cvt-slide-up-in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
@keyframes cvt-slide-up-out{from{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(6px)}}
`,Re=!1;function Me(){if(Re||typeof document>"u")return;Re=!0;const n=document.createElement("style");n.id="cv-transitions-el",n.textContent=mt,document.head.appendChild(n)}var ze=!1;function ht(){if(ze||typeof document>"u")return;ze=!0;const n=document.createElement("style");n.id="cv-cloak-style",n.textContent="[cv-cloak]{display:none!important}",document.head.appendChild(n)}function ft(n){if(typeof window<"u"&&"Sanitizer"in window){const t=document.createElement("div");return t.setHTML(n,{sanitizer:new window.Sanitizer}),t.innerHTML}const e=new DOMParser().parseFromString(n,"text/html");return e.querySelectorAll("script,iframe,object,embed,form,meta,link,style").forEach(t=>t.remove()),e.querySelectorAll("*").forEach(t=>{Array.from(t.attributes).forEach(u=>{(u.name.startsWith("on")||u.value.trim().toLowerCase().startsWith("javascript:"))&&t.removeAttribute(u.name)})}),e.body.innerHTML}async function ee(n,e,t){var w,E,b,D,L,_,V,j,M,I,F,T,A,a,c,y;const u=Array.from(n.childNodes);let d=0;for(;d<u.length;){const k=u[d];if(k.nodeType===3){const i=k.textContent||"",r=i.match(/\{\{([\s\S]+?)\}\}/g);if(r){const s=i,l=()=>{let m=s;r.forEach(g=>{const p=g.replace(/^\{\{\s*/,"").replace(/\s*\}\}$/,"");m=m.replace(g,N(p,e)??"")}),k.textContent=m};r.forEach(m=>{J(m.replace(/^\{\{\s*/,"").replace(/\s*\}\}$/,""),t,l)}),l()}d++;continue}if(k.nodeType!==1){d++;continue}const o=k,$=o.tagName.toLowerCase();if(o.hasAttribute("cv-pre")){o.removeAttribute("cv-pre"),d++;continue}if(o.hasAttribute("cv-once")){o.removeAttribute("cv-once"),await ee(o,e,{...t,subscribe:()=>()=>{},storeSubscribeOverride:()=>()=>{}}),d++;continue}if(o.hasAttribute("cv-cloak")&&o.removeAttribute("cv-cloak"),o.hasAttribute("cv-teleport")){const i=o.getAttribute("cv-teleport");o.removeAttribute("cv-teleport");const r=document.querySelector(i)??document.body,s=document.createComment(`cv-teleport: ${i}`);o.replaceWith(s),await ee(o,e,t),r.appendChild(o),d++;continue}if(o.hasAttribute("cv-memo")){const i=o.getAttribute("cv-memo");o.removeAttribute("cv-memo");const r=()=>i.split(",").map(p=>N(p.trim(),e));let s=r();const l=[],m=p=>(l.push(p),()=>{const h=l.indexOf(p);h>-1&&l.splice(h,1)});await ee(o,e,{...t,subscribe:(p,h)=>m(h),storeSubscribeOverride:(p,h,x)=>m(x)});const g=J(i,t,()=>{const p=r();p.some((h,x)=>h!==s[x])&&(s=p,[...l].forEach(h=>h()))});(w=t.registerCleanup)==null||w.call(t,()=>g()),d++;continue}if(o.hasAttribute("cv-data")){const i=o.getAttribute("cv-data").trim();o.removeAttribute("cv-data");let r={},s={};if(i.startsWith("{")){const l=N(i,e)??{};Object.entries(l).forEach(([m,g])=>{typeof g=="function"?s[m]=g:r[m]=g})}else if(i){const l=(E=t.components)==null?void 0:E[i];if(l){const m=typeof l.data=="function"?l.data():l.data??{};m instanceof Promise||Object.assign(r,m),Object.assign(s,l.methods??{})}}if(t.createChildScope){const l=t.createChildScope(r,s);(b=t.registerCleanup)==null||b.call(t,l.cleanup),await ee(o,l.state,{...t,subscribe:l.subscribe})}else await ee(o,{...e,...r,...s},t);d++;continue}if(o.hasAttribute("cv-for")){const i=o.getAttribute("cv-for");o.removeAttribute("cv-for");const r=i.match(/^\(?(\w+)(?:,\s*(\w+))?\)?\s+in\s+(.+)$/);if(r){const[,s,l,m]=r,g=o.getAttribute(":key")??null;g&&o.removeAttribute(":key");const p=o.getAttribute("cv-transition")??null;p&&o.removeAttribute("cv-transition");const h=document.createComment(`cv-for: ${m}`);o.replaceWith(h);let x=[],C=[];const O=new Map,z=async()=>{var q;const U=N(m,e),P=U?typeof U=="number"?Array.from({length:U},(H,R)=>[R+1,R]):Array.isArray(U)?U.map((H,R)=>[H,R]):Object.entries(U).map(([H,R])=>[R,H]):[];if(g){const H=[],R=new Map,Z=new Set;for(const[Y,G]of P){const ne=N(g,Pe(e,Y,s,G,l));Z.has(ne)&&console.warn(`[courvux] cv-for: duplicate :key "${ne}" in "${m}"`),Z.add(ne),H.push(ne),R.set(ne,[Y,G])}const W=[];for(const[Y,{el:G,destroy:ne}]of O)R.has(Y)||(p?(G.classList.add(`${p}-leave`),W.push(re(G).then(()=>{var oe;G.classList.remove(`${p}-leave`),ne(),(oe=G.parentNode)==null||oe.removeChild(G),O.delete(Y)}))):(ne(),(q=G.parentNode)==null||q.removeChild(G),O.delete(Y)));W.length&&await Promise.all(W);const B=h.parentNode,X=[];for(const Y of H){const[G,ne]=R.get(Y);if(O.has(Y)){const oe=O.get(Y);oe.itemRef!==G&&(oe.reactive[s]=G,oe.itemRef=G),l&&(oe.reactive[l]=ne)}else{const oe=o.cloneNode(!0),xe=[],{subscribe:it,createReactiveState:st}=Te(),we=st({[s]:G,...l?{[l]:ne}:{}}),ct=new Proxy({},{has(ie,K){return!0},get(ie,K){return typeof K!="string"?e[K]:K===s||l&&K===l?we[K]:e[K]},set(ie,K,se){return K===s||l&&K===l?(we[K]=se,!0):(e[K]=se,!0)}}),lt={...t,subscribe:(ie,K)=>{const se=ie.split(".")[0];let le;return se===s||l&&se===l?le=it(se,K):le=t.subscribe(ie,K),xe.push(le),le},storeSubscribeOverride:(ie,K,se)=>{const le=me(ie,K,se);return xe.push(le),le}},ke=document.createDocumentFragment();ke.appendChild(oe),await ee(ke,ct,lt);const Ae=ke.firstChild??oe;p&&Ae.classList.add(`${p}-enter`),O.set(Y,{el:Ae,reactive:we,itemRef:G,destroy:()=>xe.forEach(ie=>ie())}),p&&X.push(Ae)}}let Q=h.nextSibling,ae=0;for(const Y of H){const{el:G}=O.get(Y);G!==Q?ae++:Q=G.nextSibling}if(ae>0)if(ae>H.length>>1){const Y=document.createDocumentFragment();for(const G of H)Y.appendChild(O.get(G).el);B.insertBefore(Y,h.nextSibling)}else{Q=h.nextSibling;for(const Y of H){const{el:G}=O.get(Y);G!==Q?B.insertBefore(G,Q):Q=G.nextSibling}}x=H.map(Y=>O.get(Y).el),X.length&&Promise.all(X.map(Y=>re(Y).then(()=>Y.classList.remove(`${p}-enter`))))}else{if(C.forEach(W=>W()),C=[],x.forEach(W=>{var B;return(B=W.parentNode)==null?void 0:B.removeChild(W)}),x=[],!P.length)return;const H=h.parentNode,R=h.nextSibling,Z={...t,subscribe:(W,B)=>{const X=t.subscribe(W,B);return C.push(X),X},storeSubscribeOverride:(W,B,X)=>{const Q=me(W,B,X);return C.push(Q),Q}};for(const[W,B]of P){const X=o.cloneNode(!0),Q=document.createDocumentFragment();Q.appendChild(X),await ee(Q,Pe(e,W,s,B,l),Z);const ae=Q.firstChild??X;H.insertBefore(Q,R),x.push(ae)}}};(D=t.registerCleanup)==null||D.call(t,()=>{O.forEach(({el:U,destroy:P})=>{var q;P(),(q=U.parentNode)==null||q.removeChild(U)}),O.clear(),C.forEach(U=>U()),x.forEach(U=>{var P;return(P=U.parentNode)==null?void 0:P.removeChild(U)}),x=[]}),J(m,t,z),await z()}d++;continue}if(o.hasAttribute("cv-if")){const i=[],r=o.getAttribute("cv-if");o.removeAttribute("cv-if");const s=document.createComment("cv-if");o.replaceWith(s),i.push({condition:r,template:o,anchor:s});let l=d+1;for(;l<u.length;){const x=u[l];if(x.nodeType===3&&(((L=x.textContent)==null?void 0:L.trim())??"")===""){l++;continue}if(x.nodeType!==1)break;const C=x;if(C.hasAttribute("cv-else-if")){const O=C.getAttribute("cv-else-if");C.removeAttribute("cv-else-if");const z=document.createComment("cv-else-if");C.replaceWith(z),i.push({condition:O,template:C,anchor:z}),l++;continue}if(C.hasAttribute("cv-else")){C.removeAttribute("cv-else");const O=document.createComment("cv-else");C.replaceWith(O),i.push({condition:null,template:C,anchor:O}),l++;break}break}d=l;let m=null,g=!1,p=!1;const h=async()=>{var x,C;if(g){p=!0;return}g=!0;try{do{p=!1,m&&((x=m.parentNode)==null||x.removeChild(m),m=null);for(const O of i)if(O.condition===null||N(O.condition,e)){const z=O.template.cloneNode(!0);await ee(z,e,t),(C=O.anchor.parentNode)==null||C.insertBefore(z,O.anchor.nextSibling),m=z;break}}while(p)}finally{g=!1}};i.filter(x=>x.condition).forEach(x=>{J(x.condition,t,h)}),await h();continue}if(o.hasAttribute("cv-show")){const i=o.getAttribute("cv-show");o.removeAttribute("cv-show");const r=Array.from(o.attributes).filter(s=>s.name==="cv-transition"||s.name.startsWith("cv-transition:")||s.name.startsWith("cv-transition."));if(r.length>0){const s=P=>(o.getAttribute(P)??"").split(" ").filter(Boolean),l=s("cv-transition:enter"),m=s("cv-transition:enter-start"),g=s("cv-transition:enter-end"),p=s("cv-transition:leave"),h=s("cv-transition:leave-start"),x=s("cv-transition:leave-end"),C=o.getAttribute("cv-transition")??"",O=new Set(C.split(".").slice(1)),z=[...O].find(P=>/^\d+$/.test(P)),U=z?parseInt(z):200;if(l.length||m.length||p.length||h.length){r.forEach(W=>o.removeAttribute(W.name));const P=()=>new Promise(W=>requestAnimationFrame(()=>requestAnimationFrame(()=>W())));let q=!!N(i,e),H=!1,R=null;const Z=async W=>{if(H){R=W;return}H=!0;try{W?(o.style.display="",o.classList.add(...l,...m),await P(),o.classList.remove(...m),o.classList.add(...g),await re(o),o.classList.remove(...l,...g)):(o.classList.add(...p,...h),await P(),o.classList.remove(...h),o.classList.add(...x),await re(o),o.classList.remove(...p,...x),o.style.display="none"),q=W}finally{if(H=!1,R!==null&&R!==q){const B=R;R=null,Z(B)}else R=null}};q||(o.style.display="none"),J(i,t,()=>{const W=!!N(i,e);W!==q&&Z(W)})}else{const P=[...O].find(B=>B==="scale"||/^scale$/.test(B)),q=(()=>{const B=[...O].find(X=>/^\d+$/.test(X)&&X!==z);return B?parseInt(B)/100:.9})(),H=[];(!O.has("scale")||O.has("opacity"))&&H.push(`opacity ${U}ms ease`),P&&H.push(`transform ${U}ms ease`),H.length||H.push(`opacity ${U}ms ease`),o.style.transition=(o.style.transition?o.style.transition+", ":"")+H.join(", "),r.forEach(B=>o.removeAttribute(B.name));let R=!!N(i,e);const Z=()=>new Promise(B=>requestAnimationFrame(()=>requestAnimationFrame(()=>B()))),W=async B=>{B?(o.style.display="",o.style.opacity="0",P&&(o.style.transform=`scale(${q})`),await Z(),o.style.opacity="",P&&(o.style.transform=""),await re(o)):(o.style.opacity="0",P&&(o.style.transform=`scale(${q})`),await re(o),o.style.display="none",o.style.opacity="",P&&(o.style.transform="")),R=B};R||(o.style.display="none"),J(i,t,()=>{const B=!!N(i,e);B!==R&&W(B)})}}else{const s=o.getAttribute("cv-show-transition"),l=o.getAttribute(":transition");s&&o.removeAttribute("cv-show-transition"),l&&o.removeAttribute(":transition");const m=s??(l?String(N(l,e)):null);if(m){Me();let g=!!N(i,e);g||(o.style.display="none");let p=!1,h=null;const x=async C=>{if(p){h=C;return}p=!0;try{C?(o.style.display="",o.classList.add(`${m}-enter`),await re(o),o.classList.remove(`${m}-enter`)):(o.classList.add(`${m}-leave`),await re(o),o.classList.remove(`${m}-leave`),o.style.display="none"),g=C}finally{if(p=!1,h!==null&&h!==g){const O=h;h=null,x(O)}else h=null}};J(i,t,()=>{const C=!!N(i,e);C!==g&&x(C)})}else{const g=()=>{o.style.display=N(i,e)?"":"none"};J(i,t,g),g()}}}if(o.hasAttribute("cv-focus")){const i=o.getAttribute("cv-focus")??"";if(o.removeAttribute("cv-focus"),!i)Promise.resolve().then(()=>o.focus());else{const r=()=>{N(i,e)&&Promise.resolve().then(()=>o.focus())};J(i,t,r),r()}}{const i=Array.from(o.attributes).filter(r=>r.name==="cv-intersect"||r.name.startsWith("cv-intersect:")||r.name.startsWith("cv-intersect."));if(i.length&&typeof IntersectionObserver<"u"){const r=i.find(P=>P.name==="cv-intersect"||P.name==="cv-intersect:enter"||P.name.startsWith("cv-intersect.")),s=i.find(P=>P.name==="cv-intersect:leave"),l=(r==null?void 0:r.value)??"",m=(s==null?void 0:s.value)??"",g=((r==null?void 0:r.name)??"cv-intersect").split("."),p=new Set(g.slice(1)),h=p.has("once");let x=0;if(p.has("half"))x=.5;else if(p.has("full"))x=1;else{const P=[...p].find(q=>q.startsWith("threshold-"));P&&(x=parseInt(P.replace("threshold-",""))/100)}const C=[...p].find(P=>P.startsWith("margin-")),O=C?`${C.replace("margin-","")}px`:void 0;i.forEach(P=>o.removeAttribute(P.name));const z=P=>{if(P)try{new Function("$data",`with($data){${P}}`)(e)}catch(q){console.warn(`[courvux] cv-intersect error "${P}":`,q)}},U=new IntersectionObserver(P=>{P.forEach(q=>{q.isIntersecting?(z(l),h&&U.disconnect()):z(m)})},{threshold:x,...O?{rootMargin:O}:{}});U.observe(o),(_=t.registerCleanup)==null||_.call(t,()=>U.disconnect())}}{const i=Array.from(o.attributes).find(r=>r.name==="cv-html"||r.name.startsWith("cv-html."));if(i){const r=i.value;o.removeAttribute(i.name);const s=i.name.split(".").slice(1).includes("sanitize"),l=()=>{const m=String(N(r,e)??"");o.innerHTML=s?ft(m):m};J(r,t,l),l(),d++;continue}}if(o.hasAttribute("cv-ref")&&!((V=t.components)!=null&&V[$])){const i=o.getAttribute("cv-ref");o.removeAttribute("cv-ref"),t.refs&&(t.refs[i]=o)}const v=!!((j=t.components)!=null&&j[$]),f=Array.from(o.attributes).find(i=>i.name==="cv-model"||i.name.startsWith("cv-model."));if(f&&!v){const i=f.value;o.removeAttribute(f.name);const r=new Set(f.name.split(".").slice(1)),s=o,l=(M=s.type)==null?void 0:M.toLowerCase(),m=g=>{if(r.has("number")){const p=parseFloat(g);return isNaN(p)?g:p}return r.has("trim")?g.trim():g};if(l==="checkbox"){const g=()=>{const p=N(i,e);s.checked=Array.isArray(p)?p.includes(s.value):!!p};de(i,t,g),g(),s.addEventListener("change",()=>{const p=N(i,e);if(Array.isArray(p)){const h=[...p];if(s.checked)h.includes(s.value)||h.push(s.value);else{const x=h.indexOf(s.value);x>-1&&h.splice(x,1)}ce(i,e,h)}else ce(i,e,s.checked)})}else if(l==="radio"){const g=()=>{s.checked=N(i,e)===s.value};de(i,t,g),g(),s.addEventListener("change",()=>{s.checked&&ce(i,e,m(s.value))})}else if(o.hasAttribute("contenteditable")){const g=o,p=()=>{const h=String(N(i,e)??"");g.innerText!==h&&(g.innerText=h)};if(de(i,t,p),p(),r.has("debounce")){const h=[...r].find(O=>/^\d+$/.test(O)),x=h?parseInt(h):300;let C;g.addEventListener("input",()=>{clearTimeout(C),C=setTimeout(()=>ce(i,e,m(g.innerText)),x)})}else{const h=r.has("lazy")?"blur":"input";g.addEventListener(h,()=>ce(i,e,m(g.innerText)))}}else{const g=()=>{s.value=N(i,e)??""};if(de(i,t,g),g(),r.has("debounce")){const p=[...r].find(C=>/^\d+$/.test(C)),h=p?parseInt(p):300;let x;s.addEventListener("input",()=>{clearTimeout(x),x=setTimeout(()=>ce(i,e,m(s.value)),h)})}else{const p=$==="select"||r.has("lazy")?"change":"input";s.addEventListener(p,()=>ce(i,e,m(s.value)))}}}if(t.directives&&Array.from(o.attributes).forEach(i=>{var z,U;if(!i.name.startsWith("cv-"))return;const r=i.name.slice(3).split("."),s=r[0],l=r.slice(1),m=s.indexOf(":"),g=m>=0?s.slice(0,m):s,p=m>=0?s.slice(m+1):void 0,h=t.directives[g];if(!h)return;const x=i.value;o.removeAttribute(i.name);const C=typeof h=="function"?{onMount:h}:h,O={value:x?N(x,e):void 0,arg:p,modifiers:Object.fromEntries(l.map(P=>[P,!0]))};(z=C.onMount)==null||z.call(C,o,O),C.onUpdate&&x&&J(x,t,()=>{O.value=N(x,e),C.onUpdate(o,O)}),C.onDestroy&&((U=t.registerCleanup)==null||U.call(t,()=>C.onDestroy(o,O)))}),$==="slot"){const i=o.getAttribute("name")??"default",r=(I=t.slots)==null?void 0:I[i];if(r){const s={};Array.from(o.attributes).forEach(g=>{g.name.startsWith(":")&&(s[g.name.slice(1)]=N(g.value,e))});const l=await r(s),m=document.createDocumentFragment();l.forEach(g=>m.appendChild(g)),o.replaceWith(m)}else{const s=document.createDocumentFragment();for(;o.firstChild;)s.appendChild(o.firstChild);await ee(s,e,t),o.replaceWith(s)}d++;continue}if($==="cv-transition"){Me();const i=o.getAttribute("name")??"fade",r=o.getAttribute(":show")??null;o.removeAttribute("name"),r&&o.removeAttribute(":show");const s=document.createElement("div");for(s.className="cv-t-wrap";o.firstChild;)s.appendChild(o.firstChild);if(o.replaceWith(s),await ee(s,e,t),r){let l=!!N(r,e),m=!1,g=null;l||(s.style.display="none");const p=async h=>{if(m){g=h;return}m=!0;try{h?(s.style.display="",s.classList.add(`${i}-enter`),await re(s),s.classList.remove(`${i}-enter`)):(s.classList.add(`${i}-leave`),await re(s),s.classList.remove(`${i}-leave`),s.style.display="none"),l=h}finally{if(m=!1,g!==null&&g!==l){const x=g;g=null,p(x)}else g=null}};J(r,t,()=>{const h=!!N(r,e);h!==l&&p(h)})}d++;continue}if($==="router-view"&&t.mountRouterView){const i=o.getAttribute("name")??void 0;o.setAttribute("aria-live","polite"),o.setAttribute("aria-atomic","true"),await t.mountRouterView(o,i),d++;continue}if($==="router-link"){const i=o.getAttribute(":to"),r=o.getAttribute("to"),s=()=>i?String(N(i,e)??"/"):r||"/",l=document.createElement("a");l.innerHTML=o.innerHTML,Array.from(o.attributes).forEach(p=>{p.name!=="to"&&p.name!==":to"&&l.setAttribute(p.name,p.value)});const m=()=>{var p;return((p=t.router)==null?void 0:p.mode)==="history"?window.location.pathname:window.location.hash.slice(1)||"/"},g=()=>{var x;const p=s(),h=m()===p;((x=t.router)==null?void 0:x.mode)==="history"?l.href=p:l.href=`#${p}`,h?(l.setAttribute("aria-current","page"),l.classList.add("active")):(l.removeAttribute("aria-current"),l.classList.remove("active"))};((F=t.router)==null?void 0:F.mode)==="history"?(l.addEventListener("click",p=>{p.preventDefault(),t.router.navigate(s())}),window.addEventListener("popstate",g)):window.addEventListener("hashchange",g),i&&de(i,t,g),g(),o.replaceWith(l),await ee(l,e,t),d++;continue}if($==="component"&&o.hasAttribute(":is")&&t.mountDynamic){const i=o.getAttribute(":is");o.removeAttribute(":is");const r=document.createComment("component:is");o.replaceWith(r),await t.mountDynamic(r,i,o,e,t),d++;continue}if((T=t.components)!=null&&T[$]&&t.mountElement){await t.mountElement(o,$,e,t),d++;continue}{const i=Array.from(o.attributes).find(r=>r.name==="cv-intersect"||r.name.startsWith("cv-intersect."));if(i&&typeof IntersectionObserver<"u"){const r=new Set(i.name.split(".").slice(1));o.removeAttribute(i.name);const s=N(i.value,e);let l,m=0,g="0px",p=r.has("once");if(typeof s=="function"?l=h=>s.call(e,h):s&&typeof s=="object"&&(typeof s.handler=="function"&&(l=h=>s.handler.call(e,h)),s.threshold!==void 0&&(m=s.threshold),s.margin&&(g=s.margin),s.once&&(p=!0)),l){const h=new IntersectionObserver(x=>{const C=x[0];l(C),p&&C.isIntersecting&&h.disconnect()},{threshold:m,rootMargin:g});h.observe(o),(A=t.registerCleanup)==null||A.call(t,()=>h.disconnect())}}}if(o.hasAttribute("cv-resize")){const i=o.getAttribute("cv-resize");if(o.removeAttribute("cv-resize"),typeof ResizeObserver<"u"){const r=N(i,e);let s,l="content-box";if(typeof r=="function"?s=m=>r.call(e,m):r&&typeof r=="object"&&(typeof r.handler=="function"&&(s=m=>r.handler.call(e,m)),r.box&&(l=r.box)),s){const m=new ResizeObserver(g=>{g[0]&&s(g[0])});m.observe(o,{box:l}),(a=t.registerCleanup)==null||a.call(t,()=>m.disconnect())}}}if(o.hasAttribute("cv-scroll")){const i=o.getAttribute("cv-scroll");o.removeAttribute("cv-scroll");const r=N(i,e);let s,l=0;if(typeof r=="function"?s=m=>r.call(e,m):r&&typeof r=="object"&&(typeof r.handler=="function"&&(s=m=>r.handler.call(e,m)),r.throttle&&(l=r.throttle)),s){let m=0;const g=()=>{const p=Date.now();l>0&&p-m<l||(m=p,s({scrollTop:o.scrollTop,scrollLeft:o.scrollLeft,scrollHeight:o.scrollHeight,scrollWidth:o.scrollWidth,clientHeight:o.clientHeight,clientWidth:o.clientWidth}))};o.addEventListener("scroll",g,{passive:!0}),(c=t.registerCleanup)==null||c.call(t,()=>o.removeEventListener("scroll",g))}}if(o.hasAttribute("cv-clickoutside")){const i=o.getAttribute("cv-clickoutside");o.removeAttribute("cv-clickoutside");const r=s=>{o.contains(s.target)||(typeof e[i]=="function"?e[i].call(e,s):Ie(i,e,s))};document.addEventListener("click",r,!0),(y=t.registerCleanup)==null||y.call(t,()=>document.removeEventListener("click",r,!0))}if(o.hasAttribute("cv-bind")){const i=o.getAttribute("cv-bind");o.removeAttribute("cv-bind");const r=o.getAttribute("class")??"",s=o.getAttribute("style")??"";let l=[];const m=()=>{const g=N(i,e)??{},p=Object.keys(g);for(const h of l)h in g||(h==="class"?o.className=r:h==="style"?o.style.cssText=s:o.removeAttribute(h));for(const[h,x]of Object.entries(g))h==="class"?o.className=[r,Ce(x)].filter(Boolean).join(" "):h==="style"?De(o,x,s):x==null||x===!1?o.removeAttribute(h):o.setAttribute(h,x===!0?"":String(x));l=p};J(i,t,m),m()}const S={enter:"Enter",esc:"Escape",escape:"Escape",space:" ",tab:"Tab",delete:"Delete",backspace:"Backspace",up:"ArrowUp",down:"ArrowDown",left:"ArrowLeft",right:"ArrowRight"};Array.from(o.attributes).forEach(i=>{if(i.name.startsWith("@")||i.name.startsWith("cv:on:")){const r=(i.name.startsWith("@")?i.name.substring(1):i.name.substring(6)).split("."),s=r[0],l=new Set(r.slice(1)),m=[...l].find(x=>x in S),g=i.value,p=x=>{l.has("prevent")&&x.preventDefault(),l.has("stop")&&x.stopPropagation(),!(l.has("self")&&x.target!==x.currentTarget)&&(m&&x.key!==S[m]||(typeof e[g]=="function"?e[g].call(e,x):Ie(g,e,x)))},h={};l.has("once")&&(h.once=!0),l.has("passive")&&(h.passive=!0),l.has("capture")&&(h.capture=!0),o.addEventListener(s,p,Object.keys(h).length?h:void 0)}else if(i.name.startsWith(":")){const r=i.name.slice(1),s=i.value;if(r==="class"){const l=o.getAttribute("class")??"",m=()=>{o.className=[l,Ce(N(s,e))].filter(Boolean).join(" ")};J(s,t,m),m()}else if(r==="style"){const l=o.getAttribute("style")??"",m=()=>De(o,N(s,e),l);J(s,t,m),m()}else if(r.includes("-")){const l=()=>{const m=N(s,e);m==null||m===!1?o.removeAttribute(r):o.setAttribute(r,m===!0?"":String(m))};J(s,t,l),l()}else{const l=()=>{o[r]=N(s,e)??""};J(s,t,l),l()}}}),k.hasChildNodes()&&await ee(k,e,t),d++}}var vt=`
router-view.fade-leave{animation:cv-fade-out 0.25s forwards}
router-view.fade-enter{animation:cv-fade-in 0.25s forwards}
router-view.slide-up-leave{animation:cv-slide-up-out 0.25s forwards}
router-view.slide-up-enter{animation:cv-slide-up-in 0.25s forwards}
@keyframes cv-fade-out{to{opacity:0}}
@keyframes cv-fade-in{from{opacity:0}}
@keyframes cv-slide-up-out{to{opacity:0;transform:translateY(-12px)}}
@keyframes cv-slide-up-in{from{opacity:0;transform:translateY(12px)}}
`;function gt(){if(document.getElementById("cv-transitions"))return;const n=document.createElement("style");n.id="cv-transitions",n.textContent=vt,document.head.appendChild(n)}async function he(n,e,t){n.classList.add(`${e}-${t}`);const u=getComputedStyle(n),d=Math.max(parseFloat(u.animationDuration)||0,parseFloat(u.transitionDuration)||0)*1e3;d>0&&await new Promise(w=>{const E=()=>w();n.addEventListener("animationend",E,{once:!0}),n.addEventListener("transitionend",E,{once:!0}),setTimeout(E,d+50)}),n.classList.remove(`${e}-${t}`)}var be=new Map;async function bt(n){if(typeof n!="function")return n;if(be.has(n))return be.get(n);const e=await n();return be.set(n,e.default),e.default}function Ne(n,e){if(n.components)return n.components[e];if(e==="default")return n.component}function He(n,e){if(n==="*")return{};const t=[],u=n.replace(/:(\w+)/g,(w,E)=>(t.push(E),"([^/]+)")),d=e.match(new RegExp(`^${u}$`));return d?Object.fromEntries(t.map((w,E)=>[w,d[E+1]])):null}function yt(n,e){if(n==="/")return{params:{},remaining:e};const t=[],u=n.replace(/:(\w+)/g,(w,E)=>(t.push(E),"([^/]+)")),d=e.match(new RegExp(`^${u}(/.+)?$`));return d?{params:Object.fromEntries(t.map((w,E)=>[w,d[E+1]])),remaining:d[t.length+1]||"/"}:null}function ot(n,e=""){return n.map(t=>{var d;if(t.path==="*")return t;const u=((e.endsWith("/")?e.slice(0,-1):e)+t.path).replace(/\/+/g,"/")||"/";return(d=t.children)!=null&&d.length?{...t,path:u,children:ot(t.children,u==="/"?"":u)}:{...t,path:u}})}var ue=(n,e)=>new Promise(t=>n(e,t)),Ue=(n,e)=>n!=null&&n.beforeLeave?new Promise(t=>n.beforeLeave(e,t)):Promise.resolve(void 0);function xt(n,e={}){const t=e.mode??"hash";return{routes:ot(n),mode:t,transition:e.transition,beforeEach:e.beforeEach,afterEach:e.afterEach,scrollBehavior:e.scrollBehavior,navigate(u,d){const w=We(u,d==null?void 0:d.query);t==="history"?(history.pushState({},"",w),window.dispatchEvent(new PopStateEvent("popstate"))):window.location.hash=w},replace(u,d){const w=We(u,d==null?void 0:d.query);if(t==="history")history.replaceState({},"",w),window.dispatchEvent(new PopStateEvent("popstate"));else{const E=window.location.href.split("#")[0];window.location.replace(`${E}#${w}`)}},back(){history.back()},forward(){history.forward()}}}function We(n,e){return!e||!Object.keys(e).length?n:`${n}?${new URLSearchParams(e).toString()}`}function Be(n){if(!n)return{};const e=new URLSearchParams(n.startsWith("?")?n.slice(1):n),t={};return e.forEach((u,d)=>{t[d]=u}),t}function qe(n,e,t,u="default",d){const w=()=>e.mode==="history"?window.location.pathname:(window.location.hash.slice(1)||"/").split("?")[0]||"/",E=()=>{if(e.mode==="history")return Be(window.location.search);const a=window.location.hash.slice(1)||"/",c=a.indexOf("?");return c>=0?Be(a.slice(c+1)):{}};e.transition&&gt();let b=null,D=null,L=null,_=null,V=!1;const j=()=>{V||(V=!0,d==null||d())},M=new Map,I=a=>{var c;if(a!=null&&a.keepAlive&&L){(c=L.deactivate)==null||c.call(L);const y=document.createDocumentFragment();for(;n.firstChild;)y.appendChild(n.firstChild);M.set(b.path,{fragment:y,activation:L}),L=null}else L==null||L.destroy(),L=null,n.innerHTML=""},F=async(a,c,y,k,o)=>{const $=typeof c=="function"&&!be.has(c),v=$?c.__asyncOptions:void 0,f=a.loadingTemplate??(v==null?void 0:v.loadingTemplate);$&&f&&(n.innerHTML=f);let S;try{S=await bt(c)}catch(i){const r=v==null?void 0:v.errorTemplate;if(r)return n.innerHTML=r,{destroy:()=>{n.innerHTML=""}};throw i}return $&&f&&(n.innerHTML=""),t(n,S,y,k,o)},T=async()=>{var y,k,o,$,v,f,S,i;const a=w(),c=E();for(const r of e.routes){if((y=r.children)!=null&&y.length){const l=yt(r.path,a);if(l!==null)for(const m of r.children){const g=He(m.path,a);if(g!==null){const p={params:l.params,query:c,path:a,meta:r.meta};if(m.redirect){const O={params:g,query:c,path:a,meta:m.meta},z=typeof m.redirect=="function"?m.redirect(O):m.redirect;e.navigate(z);return}if(e.beforeEach){const O=await ue(e.beforeEach,p);if(O){e.navigate(O);return}}if(r.beforeEnter){const O=await ue(r.beforeEnter,p);if(O){e.navigate(O);return}}if(m.beforeEnter){const O={params:g,query:c,path:a,meta:m.meta},z=await ue(m.beforeEnter,O);if(z){e.navigate(z);return}}const h=`${r.path}::${JSON.stringify(l.params)}`;if(_!==h){const O=await Ue(L,p);if(O){e.navigate(O);return}const z=r.transition??e.transition;z&&n.hasChildNodes()&&await he(n,z,"leave"),I(D);const U=Ne(r,u);if(U){const P={routes:r.children,mode:e.mode,transition:r.transition??e.transition,beforeEach:e.beforeEach,afterEach:e.afterEach,scrollBehavior:e.scrollBehavior,navigate:(q,H)=>e.navigate(q,H),replace:(q,H)=>e.replace(q,H),back:()=>e.back(),forward:()=>e.forward()};L=await F(r,U,p,u==="default"?r.layout:void 0,u==="default"?P:void 0),(k=L.enter)==null||k.call(L,b)}else n.innerHTML="";_=h,z&&await he(n,z,"enter")}const x={params:{...l.params,...g},query:c,path:a,meta:m.meta??r.meta};(o=e.afterEach)==null||o.call(e,x,b);const C=($=e.scrollBehavior)==null?void 0:$.call(e,x,b);C&&window.scrollTo(C.x??0,C.y??0),b=x,D=r,j();return}}}const s=He(r.path,a);if(s!==null){_=null;const l={params:s,query:c,path:a,meta:r.meta};if(r.redirect){const x=typeof r.redirect=="function"?r.redirect(l):r.redirect;e.navigate(x);return}if(e.beforeEach){const x=await ue(e.beforeEach,l);if(x){e.navigate(x);return}}if(r.beforeEnter){const x=await ue(r.beforeEnter,l);if(x){e.navigate(x);return}}const m=await Ue(L,l);if(m){e.navigate(m);return}const g=r.transition??e.transition;g&&n.hasChildNodes()&&await he(n,g,"leave"),I(D);const p=Ne(r,u);if(p){const x=l.path;if(r.keepAlive&&M.has(x)){const C=M.get(x);n.appendChild(C.fragment),L=C.activation,(v=L.activate)==null||v.call(L),M.delete(x)}else{const C=b;L=await F(r,p,l,u==="default"?r.layout:void 0),(f=L.enter)==null||f.call(L,C)}}else n.innerHTML="",L=null;g&&await he(n,g,"enter"),(S=e.afterEach)==null||S.call(e,l,b);const h=(i=e.scrollBehavior)==null?void 0:i.call(e,l,b);h&&window.scrollTo(h.x??0,h.y??0),b=l,D=r,j();return}}_=null,I(D),D=null,j()},A=e.mode==="history"?"popstate":"hashchange";return window.addEventListener(A,T),T(),()=>{window.removeEventListener(A,T),L==null||L.destroy(),L=null,M.forEach(({activation:a})=>a.destroy()),M.clear()}}function wt(){if(typeof window>"u")return null;if(window.__COURVUX_DEVTOOLS__)return window.__COURVUX_DEVTOOLS__;const n=new Map,e={instances:[],stores:[],on(t,u){return n.has(t)||n.set(t,new Set),n.get(t).add(u),()=>{var d;return(d=n.get(t))==null?void 0:d.delete(u)}},_emit(t,u){var d;(d=n.get(t))==null||d.forEach(w=>{try{w(u)}catch{}})},_registerInstance(t){this.instances.push(t),this._emit("mount",t)},_unregisterInstance(t){const u=this.instances.findIndex(d=>d.id===t);if(u!==-1){const d=this.instances[u];this.instances.splice(u,1),this._emit("destroy",d)}},_registerStore(t){this.stores.push(t),t.subscribe(()=>this._emit("store-update",t))}};return window.__COURVUX_DEVTOOLS__=e,e}var kt=0;function At(){return++kt}var St=`
#cvd{position:fixed;bottom:16px;right:16px;z-index:2147483647;font-family:monospace;font-size:12px;line-height:1.4}
#cvd *{box-sizing:border-box;margin:0;padding:0}
#cvd-badge{background:#5b4cf5;color:#fff;padding:4px 10px;border-radius:6px;cursor:pointer;font-size:11px;font-weight:700;letter-spacing:.5px;user-select:none;box-shadow:0 2px 8px rgba(0,0,0,.4)}
#cvd-badge:hover{background:#7066f7}
#cvd-panel{background:#16161e;color:#c9c9d3;border-radius:10px;box-shadow:0 8px 32px rgba(0,0,0,.6);width:380px;max-height:70vh;display:flex;flex-direction:column;border:1px solid #2a2a3d;overflow:hidden}
#cvd-head{display:flex;align-items:center;gap:6px;padding:8px 10px;background:#1f1f30;cursor:move;border-bottom:1px solid #2a2a3d}
#cvd-title{flex:1;font-weight:700;font-size:11px;color:#7066f7;letter-spacing:.8px}
#cvd-tabs{display:flex;gap:2px}
.cvd-tab{background:none;border:none;color:#888;padding:3px 8px;border-radius:4px;cursor:pointer;font:inherit;font-size:11px}
.cvd-tab.active,.cvd-tab:hover{background:#2a2a3d;color:#c9c9d3}
#cvd-close{background:none;border:none;color:#666;cursor:pointer;font-size:14px;line-height:1;padding:0 2px}
#cvd-close:hover{color:#e06c75}
#cvd-body{overflow-y:auto;flex:1;padding:6px}
#cvd-body::-webkit-scrollbar{width:4px}
#cvd-body::-webkit-scrollbar-track{background:#1a1a28}
#cvd-body::-webkit-scrollbar-thumb{background:#3a3a52;border-radius:2px}
.cvd-inst{border:1px solid #2a2a3d;border-radius:6px;margin-bottom:6px;overflow:hidden}
.cvd-inst-head{display:flex;align-items:center;gap:6px;padding:5px 8px;background:#1f1f30;cursor:pointer}
.cvd-inst-head:hover{background:#252538}
.cvd-inst-name{font-weight:700;color:#82aaff;flex:1}
.cvd-inst-id{color:#555;font-size:10px}
.cvd-arrow{color:#555;font-size:10px;transition:transform .15s}
.cvd-inst.open .cvd-arrow{transform:rotate(90deg)}
.cvd-kv{display:none;padding:6px 8px;background:#16161e;border-top:1px solid #2a2a3d}
.cvd-inst.open .cvd-kv{display:block}
.cvd-row{display:flex;align-items:baseline;gap:6px;padding:2px 0;border-bottom:1px solid #1e1e2a}
.cvd-row:last-child{border-bottom:none}
.cvd-key{color:#c792ea;min-width:90px;flex-shrink:0}
.cvd-val{color:#c3e88d;flex:1;word-break:break-all;cursor:pointer;padding:1px 4px;border-radius:3px}
.cvd-val:hover{background:#252538}
.cvd-val.editing{background:transparent;padding:0}
.cvd-edit{background:#252538;border:1px solid #5b4cf5;color:#c3e88d;font:inherit;width:100%;border-radius:3px;padding:1px 4px;outline:none}
.cvd-store-key{color:#ffcb6b}
.cvd-empty{color:#555;text-align:center;padding:20px;font-style:italic}
.cvd-badge-dot{display:inline-block;width:6px;height:6px;background:#61d46a;border-radius:50%;margin-right:5px;animation:cvd-pulse 2s infinite}
@keyframes cvd-pulse{0%,100%{opacity:1}50%{opacity:.4}}
.cvd-count{color:#888;font-size:10px}
`;function Et(){if(document.getElementById("cvd-styles"))return;const n=document.createElement("style");n.id="cvd-styles",n.textContent=St,document.head.appendChild(n)}function fe(n){return n===null?"null":n===void 0?"undefined":typeof n=="string"?`"${n}"`:typeof n=="object"?JSON.stringify(n):String(n)}function Ve(n){try{return JSON.parse(n)}catch{return n}}function $t(n){if(typeof document>"u")return;Et();const e=document.createElement("div");e.id="cvd",document.body.appendChild(e);let t=!1,u="components",d=new Set;const w=document.createElement("div");w.id="cvd-badge",w.innerHTML='<span class="cvd-badge-dot"></span>COURVUX',e.appendChild(w);const E=document.createElement("div");E.id="cvd-panel",E.style.display="none",e.appendChild(E),E.innerHTML=`
        <div id="cvd-head">
            <span id="cvd-title">⚡ COURVUX DEVTOOLS</span>
            <div id="cvd-tabs">
                <button class="cvd-tab active" data-tab="components">Components</button>
                <button class="cvd-tab" data-tab="store">Store</button>
            </div>
            <button id="cvd-close">✕</button>
        </div>
        <div id="cvd-body"></div>
    `;const b=E.querySelector("#cvd-body");w.addEventListener("click",()=>{t=!0,w.style.display="none",E.style.display="flex",I()}),E.querySelector("#cvd-close").addEventListener("click",()=>{t=!1,E.style.display="none",w.style.display=""}),E.querySelectorAll(".cvd-tab").forEach(F=>{F.addEventListener("click",()=>{u=F.dataset.tab,E.querySelectorAll(".cvd-tab").forEach(T=>T.classList.remove("active")),F.classList.add("active"),I()})});const D=E.querySelector("#cvd-head");let L=!1,_=0,V=0;D.addEventListener("mousedown",F=>{F.target.closest("button")||(L=!0,_=F.clientX-e.getBoundingClientRect().left,V=F.clientY-e.getBoundingClientRect().top)}),document.addEventListener("mousemove",F=>{L&&(e.style.right="auto",e.style.bottom="auto",e.style.left=`${F.clientX-_}px`,e.style.top=`${F.clientY-V}px`)}),document.addEventListener("mouseup",()=>{L=!1});function j(){const F=n.instances;if(!F.length){b.innerHTML='<div class="cvd-empty">No hay componentes montados</div>';return}b.innerHTML=F.map(T=>{const A=T.getState(),a=Object.keys(A);return`
                <div class="cvd-inst${d.has(T.id)?" open":""}" data-id="${T.id}">
                    <div class="cvd-inst-head">
                        <span class="cvd-arrow">▶</span>
                        <span class="cvd-inst-name">&lt;${T.name}&gt;</span>
                        <span class="cvd-count">${a.length} keys</span>
                        <span class="cvd-inst-id">#${T.id}</span>
                    </div>
                    <div class="cvd-kv">
                        ${a.length?a.map(c=>`
                            <div class="cvd-row">
                                <span class="cvd-key">${c}</span>
                                <span class="cvd-val" data-inst="${T.id}" data-key="${c}" title="click to edit">${fe(A[c])}</span>
                            </div>
                        `).join(""):'<span style="color:#555">— sin datos reactivos —</span>'}
                    </div>
                </div>
            `}).join(""),b.querySelectorAll(".cvd-inst-head").forEach(T=>{T.addEventListener("click",()=>{const A=T.closest(".cvd-inst"),a=parseInt(A.dataset.id);d.has(a)?d.delete(a):d.add(a),A.classList.toggle("open")})}),b.querySelectorAll(".cvd-val").forEach(T=>{T.addEventListener("click",A=>{A.stopPropagation();const a=T;if(a.querySelector("input"))return;const c=parseInt(a.dataset.inst),y=a.dataset.key,k=n.instances.find(f=>f.id===c);if(!k)return;const o=fe(k.getState()[y]);a.classList.add("editing"),a.innerHTML=`<input class="cvd-edit" value='${o.replace(/'/g,"&#39;")}'>`;const $=a.querySelector("input");$.focus(),$.select();const v=()=>{k.setState(y,Ve($.value)),a.classList.remove("editing")};$.addEventListener("blur",v),$.addEventListener("keydown",f=>{f.key==="Enter"&&(f.preventDefault(),v()),f.key==="Escape"&&(a.classList.remove("editing"),I())})})})}function M(){if(!n.stores.length){b.innerHTML='<div class="cvd-empty">No hay store registrado</div>';return}b.innerHTML=n.stores.map((F,T)=>{const A=F.getState(),a=Object.keys(A);return`
                <div class="cvd-inst open" data-store="${T}">
                    <div class="cvd-inst-head">
                        <span class="cvd-arrow" style="transform:rotate(90deg)">▶</span>
                        <span class="cvd-inst-name" style="color:#ffcb6b">Store</span>
                        <span class="cvd-count">${a.length} keys</span>
                    </div>
                    <div class="cvd-kv">
                        ${a.map(c=>`
                            <div class="cvd-row">
                                <span class="cvd-key cvd-store-key">${c}</span>
                                <span class="cvd-val" data-store="${T}" data-key="${c}" title="click to edit">${fe(A[c])}</span>
                            </div>
                        `).join("")}
                    </div>
                </div>
            `}).join(""),b.querySelectorAll(".cvd-inst-head").forEach(F=>{F.addEventListener("click",()=>F.closest(".cvd-inst").classList.toggle("open"))}),b.querySelectorAll("[data-store][data-key]").forEach(F=>{F.addEventListener("click",T=>{T.stopPropagation();const A=F;if(A.querySelector("input"))return;const a=parseInt(A.dataset.store),c=A.dataset.key,y=n.stores[a];if(!y)return;const k=fe(y.getState()[c]);A.classList.add("editing"),A.innerHTML=`<input class="cvd-edit" value='${k.replace(/'/g,"&#39;")}'>`;const o=A.querySelector("input");o.focus(),o.select();const $=()=>{y.setState(c,Ve(o.value)),A.classList.remove("editing")};o.addEventListener("blur",$),o.addEventListener("keydown",v=>{v.key==="Enter"&&(v.preventDefault(),$()),v.key==="Escape"&&(A.classList.remove("editing"),I())})})})}function I(){t&&(u==="components"?j():M())}n.on("mount",()=>I()),n.on("update",()=>I()),n.on("destroy",()=>I()),n.on("store-update",()=>I())}var Ee="data-courvux-ssr",Ft=n=>n?Promise.resolve().then(n):Promise.resolve();function Ge(n,e){const t=n.trim();if(t.startsWith("{")){const u=t.replace(/[{}]/g,"").split(",").map(d=>d.trim()).filter(Boolean);return Object.fromEntries(u.map(d=>[d,e[d]]))}return{[t]:e}}var ve=n=>{if(n===null||typeof n!="object")return n;try{return structuredClone(n)}catch{return n}};async function te(n,e,t){var k,o,$;const u={},{subscribe:d,createReactiveState:w,registerSetInterceptor:E,notifyAll:b}=Te();let D;if(typeof e.data=="function"?(e.loadingTemplate&&(n.innerHTML=e.loadingTemplate),D=await e.data()):D=e.data??{},e.templateUrl){const v=t.baseUrl?new URL(e.templateUrl,t.baseUrl).href:e.templateUrl,f=await fetch(v);if(!f.ok)throw new Error(`Failed to load template: ${v} (${f.status})`);n.innerHTML=await f.text()}else e.template&&(n.innerHTML=e.template);n.removeAttribute(Ee),(k=n.querySelector(`[${Ee}]`))==null||k.removeAttribute(Ee);const L={};if(e.inject&&t.provided){const v=Array.isArray(e.inject)?Object.fromEntries(e.inject.map(f=>[f,f])):e.inject;Object.entries(v).forEach(([f,S])=>{t.provided&&S in t.provided&&(L[f]=t.provided[S])})}const _=w({...t.globalProperties??{},...D,...L,...e.methods,$refs:u,$el:n,...t.slots?{$slots:Object.fromEntries(Object.keys(t.slots).map(v=>[v,!0]))}:{},...t.store?{$store:t.store}:{},...t.currentRoute?{$route:t.currentRoute}:{},...t.router?{$router:t.router}:{}});_.$watch=(v,f,S)=>{const i=(S==null?void 0:S.deep)??!1,r=(S==null?void 0:S.immediate)??!1;let s=i?ve(_[v]):_[v];const l=d(v,()=>{const m=_[v];f.call(_,m,s),s=i?ve(m):m});return r&&f.call(_,_[v],void 0),l},_.$batch=pt,_.$nextTick=v=>Ft(v),_.$dispatch=(v,f,S)=>{n.dispatchEvent(new CustomEvent(v,{bubbles:!0,composed:!0,...S??{},detail:f}))},t.magics&&Object.entries(t.magics).forEach(([v,f])=>{_[v]=f(_)}),_.$forceUpdate=()=>b();const V=[];_.$watchEffect=v=>{let f=[];const S=()=>{f.forEach(l=>l()),f=[];const r=Oe(()=>{try{v()}catch{}}),s=new Map;for(const{sub:l,key:m}of r)s.has(l)||s.set(l,new Set),!s.get(l).has(m)&&(s.get(l).add(m),f.push(l(m,S)))};S();const i=()=>{f.forEach(s=>s()),f=[];const r=V.indexOf(i);r>-1&&V.splice(r,1)};return V.push(i),i};const j=[];e.computed&&Object.entries(e.computed).forEach(([v,f])=>{const S=typeof f=="function"?f:f.get,i=typeof f!="function"?f.set:void 0;let r=[];const s=()=>{r.forEach(p=>p()),r=[];let l;const m=Oe(()=>{try{l=S.call(_)}catch{}});_[v]=l;const g=new Map;for(const{sub:p,key:h}of m)g.has(p)||g.set(p,new Set),!g.get(p).has(h)&&(g.get(p).add(h),r.push(p(h,s)))};s(),j.push(()=>r.forEach(l=>l())),i&&E(v,l=>i.call(_,l))});const M=[];e.watch&&Object.entries(e.watch).forEach(([v,f])=>{const S=typeof f=="object"&&f!==null&&"handler"in f,i=S?f.handler:f,r=S?f.immediate??!1:!1,s=S?f.deep??!1:!1;let l=s?ve(_[v]):_[v];const m=d(v,()=>{const g=_[v];i.call(_,g,l),l=s?ve(g):g});M.push(m),r&&i.call(_,_[v],void 0)});const I={...t.provided??{}};if(e.provide){const v=typeof e.provide=="function"?e.provide.call(_):e.provide;Object.assign(I,v)}const F={...t,provided:I,components:{...t.components,...e.components}};F.mountElement=ye(F),F.createChildScope=(v,f)=>{const S=new Set(Object.keys(v)),i=new Set(Object.keys(f)),{subscribe:r,createReactiveState:s}=Te(),l=s(v);let m;return m=new Proxy({},{get(g,p){return typeof p!="string"?_[p]:S.has(p)?l[p]:i.has(p)?f[p].bind(m):_[p]},set(g,p,h){return typeof p!="string"?!1:S.has(p)?(l[p]=h,!0):(_[p]=h,!0)},has(g,p){return S.has(p)||i.has(p)||p in _},ownKeys(){return[...S,...i,...Object.keys(_)]},getOwnPropertyDescriptor(g,p){return S.has(p)||i.has(p)||p in _?{configurable:!0,enumerable:!0,writable:!0}:void 0}}),{state:m,subscribe:(g,p)=>S.has(g)?r(g,p):a(g,p),cleanup:()=>{}}},F.mountDynamic=async(v,f,S,i,r)=>{let s=null,l=null;const m=S.getAttribute("loading-template")??"",g=async()=>{var P,q,H;l==null||l(),l=null,s!=null&&s.parentNode&&(s.parentNode.removeChild(s),s=null);const p=N(f,i);if(!p)return;let h;if(typeof p=="function"){if(m){const R=document.createElement("div");R.innerHTML=m,(P=v.parentNode)==null||P.insertBefore(R,v.nextSibling),s=R}h=(await p()).default,s!=null&&s.parentNode&&(s.parentNode.removeChild(s),s=null)}else typeof p=="string"?h=(q=F.components)==null?void 0:q[p]:p&&typeof p=="object"&&(h=p);if(!h)return;const x=document.createElement("div");Array.from(S.attributes).forEach(R=>x.setAttribute(R.name,R.value)),x.innerHTML=S.innerHTML;const C={},O={};Array.from(S.attributes).forEach(R=>{if(R.name.startsWith(":"))C[R.name.slice(1)]=N(R.value,i);else if(R.name.startsWith("@")||R.name.startsWith("cv:on:")){const Z=R.value,W=R.name.startsWith("@")?R.name.slice(1):R.name.slice(6);O[W]=(...B)=>{typeof i[Z]=="function"&&i[Z].call(i,...B)}}});const z={...h,data:{...h.data,...C},methods:{...h.methods,$emit(R,...Z){var W;rt(h,R,Z),(W=O[R])==null||W.call(O,...Z)}}},U={...F,components:{...F.components,...h.components}};U.mountElement=ye(U),l=(await te(x,z,U)).destroy,(H=v.parentNode)==null||H.insertBefore(x,v.nextSibling),s=x};J(f,r,g),await g()};const T=[];_.$addCleanup=v=>{T.push(v)};let A=!1;const a=(v,f)=>!e.onBeforeUpdate&&!e.onUpdated?d(v,f):d(v,()=>{var S;A||(A=!0,(S=e.onBeforeUpdate)==null||S.call(_),Promise.resolve().then(()=>{var i;A=!1,(i=e.onUpdated)==null||i.call(_)})),f()});try{(o=e.onBeforeMount)==null||o.call(_),await ee(n,_,{subscribe:a,refs:u,...F,registerCleanup:v=>T.push(v)}),n.removeAttribute("cv-cloak"),($=e.onMount)==null||$.call(_)}catch(v){if(e.onError)n.removeAttribute("cv-cloak"),e.onError.call(_,v);else if(t.errorHandler)n.removeAttribute("cv-cloak"),t.errorHandler(v,_,e.name??n.tagName.toLowerCase());else throw v}const c=typeof window<"u"?window.__COURVUX_DEVTOOLS__:void 0,y=c?At():0;if(c){const v=_,f=new Set,S={id:y,name:e.name??n.tagName.toLowerCase(),el:n,getState:()=>{const i={};for(const r of Object.keys(v))if(!(r.startsWith("$")||typeof v[r]=="function"))try{i[r]=v[r]}catch{}return i},setState:(i,r)=>{v[i]=r},subscribe:i=>(f.add(i),()=>f.delete(i)),children:[]};Object.keys(v).filter(i=>!i.startsWith("$")&&typeof v[i]!="function").forEach(i=>{d(i,()=>{c._emit("update",S),f.forEach(r=>r())})}),c._registerInstance(S),T.push(()=>c._unregisterInstance(y))}return{state:_,destroy:()=>{var v,f;(v=e.onBeforeUnmount)==null||v.call(_),j.forEach(S=>S()),M.forEach(S=>S()),V.forEach(S=>S()),T.forEach(S=>S()),(f=e.onDestroy)==null||f.call(_)},activate:()=>{var v;(v=e.onActivated)==null||v.call(_)},deactivate:()=>{var v;(v=e.onDeactivated)==null||v.call(_)},beforeLeave:e.onBeforeRouteLeave?(v,f)=>e.onBeforeRouteLeave.call(_,v,f):void 0,enter:e.onBeforeRouteEnter?v=>e.onBeforeRouteEnter.call(_,v):void 0}}function rt(n,e,t){if(!n.emits||Array.isArray(n.emits))return;const u=n.emits[e];typeof u=="function"&&!u(...t)&&console.warn(`[courvux] emit "${e}": validator returned false`)}function ye(n){return async(e,t,u,d)=>{const w=n.components[t],E=e.getAttribute("cv-ref");E&&e.removeAttribute("cv-ref");const b={},D=[],L={};Array.from(e.attributes).filter(A=>A.name==="cv-model"||A.name.startsWith("cv-model.")||A.name.startsWith("cv-model:")).forEach(A=>{e.removeAttribute(A.name);const a=A.value,c=A.name.indexOf(":"),y=c>=0?A.name.slice(c+1).split(".")[0]:"modelValue",k=y==="modelValue"?"update:modelValue":`update:${y}`;b[y]=N(a,u),D.push({propName:y,expr:a}),L[k]=o=>{ce(a,u,o)}});const _={};Array.from(e.attributes).forEach(A=>{const a=A.name.startsWith(":"),c=A.name.startsWith("@")||A.name.startsWith("cv:on:"),y=A.name==="cv-model"||A.name.startsWith("cv-model.")||A.name.startsWith("cv-model:"),k=A.name.startsWith("v-slot"),o=A.name==="slot";!a&&!c&&!y&&!k&&!o&&(_[A.name]=A.value)}),w.inheritAttrs===!1&&Object.keys(_).forEach(A=>e.removeAttribute(A)),Array.from(e.attributes).forEach(A=>{if(A.name.startsWith(":")){const a=A.name.slice(1),c=A.value;b[a]=N(c,u),D.push({propName:a,expr:c})}else if(A.name.startsWith("@")||A.name.startsWith("cv:on:")){const a=A.name.startsWith("@")?A.name.slice(1):A.name.slice(6),c=A.value;L[a]=(...y)=>{typeof u[c]=="function"&&u[c].call(u,...y)}}});const V=e.getAttribute("v-slot")??e.getAttribute("v-slot:default");V&&(e.removeAttribute("v-slot"),e.removeAttribute("v-slot:default"));const j=new Map,M=[];Array.from(e.childNodes).forEach(A=>{const a=A.nodeType===1?A.getAttribute("slot"):null;if(a){if(!j.has(a)){const c=e.getAttribute(`v-slot:${a}`)??null;c&&e.removeAttribute(`v-slot:${a}`),j.set(a,{nodes:[],vSlot:c})}j.get(a).nodes.push(A.cloneNode(!0))}else M.push(A.cloneNode(!0))});const I={};M.some(A=>{var a;return A.nodeType===1||A.nodeType===3&&(((a=A.textContent)==null?void 0:a.trim())??"")!==""})&&(I.default=async A=>{const a=V?{...u,...Ge(V,A)}:u,c=document.createDocumentFragment();return M.forEach(y=>c.appendChild(y.cloneNode(!0))),await ee(c,a,d),Array.from(c.childNodes)});for(const[A,{nodes:a,vSlot:c}]of j)I[A]=async y=>{const k=c?{...u,...Ge(c,y)}:u,o=document.createDocumentFragment();return a.forEach($=>o.appendChild($.cloneNode(!0))),await ee(o,k,d),Array.from(o.childNodes)};const F={...n,components:{...n.components,...w.components},slots:I};F.mountElement=ye(F);const{state:T}=await te(e,{...w,data:{...w.data,...b,$attrs:_,$parent:u},methods:{...w.methods,$emit(A,...a){var c;rt(w,A,a),(c=L[A])==null||c.call(L,...a)}}},F);T&&(D.forEach(({propName:A,expr:a})=>{de(a,{...d,subscribe:d.subscribe},()=>{T[A]=N(a,u)})}),E&&d.refs&&(d.refs[E]=T))}}function _t(n){ht();const e=typeof window<"u"?wt():void 0,t=[],u={...n.directives},d={...n.components??{}},w=[],E=new Map,b={},D=new Map;if(n.debug&&e&&$t(e),e&&n.store){const j=n.store,M=Object.keys(j).filter(I=>typeof j[I]!="function");e._registerStore({getState(){const I={};return M.forEach(F=>{try{I[F]=j[F]}catch{}}),I},setState(I,F){j[I]=F},subscribe(I){const F=M.map(T=>{try{return me(j,T,I)}catch{return()=>{}}});return()=>F.forEach(T=>T())}})}const L={router:n.router,use(j){return t.includes(j)||(t.push(j),j.install(L)),L},directive(j,M){return u[j]=M,L},component(j,M){return d[j]=M,L},provide(j,M){return typeof j=="string"?b[j]=M:Object.assign(b,j),L},magic(j,M){return D.set(`$${j}`,M),L},mount:async j=>(await V(j),L),mountAll:async(j="[data-courvux]")=>{const M=Array.from(document.querySelectorAll(j));return await Promise.all(M.map(I=>_(I))),L},mountEl:async j=>_(j),unmount(j){if(!j)w.forEach(M=>M()),w.length=0,E.clear();else{const M=document.querySelector(j);if(M){const I=E.get(M);if(I){I(),E.delete(M);const F=w.indexOf(I);F>-1&&w.splice(F,1)}}}return L},destroy(){w.forEach(j=>j()),w.length=0,E.clear()}},_=async j=>{const M=new URL(".",document.baseURI).href,I={components:d,router:n.router,store:n.store,directives:u,baseUrl:M,provided:{...b},errorHandler:n.errorHandler,globalProperties:n.globalProperties,magics:D.size?Object.fromEntries(D):void 0};if(I.mountElement=ye(I),n.router){const T=n.router;I.mountRouterView=async(A,a)=>{await new Promise(c=>{qe(A,T,async(y,k,o,$,v)=>{const f={...I,currentRoute:o};if(v){let S=null;const i={...f,mountRouterView:async(r,s)=>{S=qe(r,v,async(l,m,g,p)=>{const h={...f,currentRoute:g};if(p){let x=null;const C={...h,mountRouterView:async(z,U)=>{x=await te(z,m,h)}},{destroy:O}=await te(l,{template:p},C);return{destroy:()=>{x==null||x.destroy(),O()},activate:()=>x==null?void 0:x.activate(),deactivate:()=>x==null?void 0:x.deactivate()}}else return await te(l,m,h)},s)}};if($){let r=null;const s={...i,mountRouterView:async(m,g)=>{r=await te(m,k,i)}},{destroy:l}=await te(y,{template:$},s);return{destroy:()=>{S==null||S(),r==null||r.destroy(),l()},activate:()=>r==null?void 0:r.activate(),deactivate:()=>r==null?void 0:r.deactivate()}}else{const r=await te(y,k,i);return{destroy:()=>{S==null||S(),r.destroy()},activate:()=>r.activate(),deactivate:()=>r.deactivate()}}}else if($){let S=null;const i={...f,mountRouterView:async(s,l)=>{S=await te(s,k,f)}},{destroy:r}=await te(y,{template:$},i);return{destroy:()=>{S==null||S.destroy(),r()},activate:()=>S==null?void 0:S.activate(),deactivate:()=>S==null?void 0:S.deactivate()}}else return await te(y,k,f)},a,c)})}}const F=await te(j,n,I);return w.push(F.destroy),E.set(j,F.destroy),F.state},V=async j=>{const M=document.querySelector(j);if(M)return _(M)};return L}var Ye=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function Tt(n){return n&&n.__esModule&&Object.prototype.hasOwnProperty.call(n,"default")?n.default:n}var $e={exports:{}},Ze;function Ct(){return Ze||(Ze=1,(function(n){var e=typeof window<"u"?window:typeof WorkerGlobalScope<"u"&&self instanceof WorkerGlobalScope?self:{};/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 *
 * @license MIT <https://opensource.org/licenses/MIT>
 * @author Lea Verou <https://lea.verou.me>
 * @namespace
 * @public
 */var t=(function(u){var d=/(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i,w=0,E={},b={manual:u.Prism&&u.Prism.manual,disableWorkerMessageHandler:u.Prism&&u.Prism.disableWorkerMessageHandler,util:{encode:function a(c){return c instanceof D?new D(c.type,a(c.content),c.alias):Array.isArray(c)?c.map(a):c.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/\u00a0/g," ")},type:function(a){return Object.prototype.toString.call(a).slice(8,-1)},objId:function(a){return a.__id||Object.defineProperty(a,"__id",{value:++w}),a.__id},clone:function a(c,y){y=y||{};var k,o;switch(b.util.type(c)){case"Object":if(o=b.util.objId(c),y[o])return y[o];k={},y[o]=k;for(var $ in c)c.hasOwnProperty($)&&(k[$]=a(c[$],y));return k;case"Array":return o=b.util.objId(c),y[o]?y[o]:(k=[],y[o]=k,c.forEach(function(v,f){k[f]=a(v,y)}),k);default:return c}},getLanguage:function(a){for(;a;){var c=d.exec(a.className);if(c)return c[1].toLowerCase();a=a.parentElement}return"none"},setLanguage:function(a,c){a.className=a.className.replace(RegExp(d,"gi"),""),a.classList.add("language-"+c)},currentScript:function(){if(typeof document>"u")return null;if(document.currentScript&&document.currentScript.tagName==="SCRIPT")return document.currentScript;try{throw new Error}catch(k){var a=(/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(k.stack)||[])[1];if(a){var c=document.getElementsByTagName("script");for(var y in c)if(c[y].src==a)return c[y]}return null}},isActive:function(a,c,y){for(var k="no-"+c;a;){var o=a.classList;if(o.contains(c))return!0;if(o.contains(k))return!1;a=a.parentElement}return!!y}},languages:{plain:E,plaintext:E,text:E,txt:E,extend:function(a,c){var y=b.util.clone(b.languages[a]);for(var k in c)y[k]=c[k];return y},insertBefore:function(a,c,y,k){k=k||b.languages;var o=k[a],$={};for(var v in o)if(o.hasOwnProperty(v)){if(v==c)for(var f in y)y.hasOwnProperty(f)&&($[f]=y[f]);y.hasOwnProperty(v)||($[v]=o[v])}var S=k[a];return k[a]=$,b.languages.DFS(b.languages,function(i,r){r===S&&i!=a&&(this[i]=$)}),$},DFS:function a(c,y,k,o){o=o||{};var $=b.util.objId;for(var v in c)if(c.hasOwnProperty(v)){y.call(c,v,c[v],k||v);var f=c[v],S=b.util.type(f);S==="Object"&&!o[$(f)]?(o[$(f)]=!0,a(f,y,null,o)):S==="Array"&&!o[$(f)]&&(o[$(f)]=!0,a(f,y,v,o))}}},plugins:{},highlightAll:function(a,c){b.highlightAllUnder(document,a,c)},highlightAllUnder:function(a,c,y){var k={callback:y,container:a,selector:'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'};b.hooks.run("before-highlightall",k),k.elements=Array.prototype.slice.apply(k.container.querySelectorAll(k.selector)),b.hooks.run("before-all-elements-highlight",k);for(var o=0,$;$=k.elements[o++];)b.highlightElement($,c===!0,k.callback)},highlightElement:function(a,c,y){var k=b.util.getLanguage(a),o=b.languages[k];b.util.setLanguage(a,k);var $=a.parentElement;$&&$.nodeName.toLowerCase()==="pre"&&b.util.setLanguage($,k);var v=a.textContent,f={element:a,language:k,grammar:o,code:v};function S(r){f.highlightedCode=r,b.hooks.run("before-insert",f),f.element.innerHTML=f.highlightedCode,b.hooks.run("after-highlight",f),b.hooks.run("complete",f),y&&y.call(f.element)}if(b.hooks.run("before-sanity-check",f),$=f.element.parentElement,$&&$.nodeName.toLowerCase()==="pre"&&!$.hasAttribute("tabindex")&&$.setAttribute("tabindex","0"),!f.code){b.hooks.run("complete",f),y&&y.call(f.element);return}if(b.hooks.run("before-highlight",f),!f.grammar){S(b.util.encode(f.code));return}if(c&&u.Worker){var i=new Worker(b.filename);i.onmessage=function(r){S(r.data)},i.postMessage(JSON.stringify({language:f.language,code:f.code,immediateClose:!0}))}else S(b.highlight(f.code,f.grammar,f.language))},highlight:function(a,c,y){var k={code:a,grammar:c,language:y};if(b.hooks.run("before-tokenize",k),!k.grammar)throw new Error('The language "'+k.language+'" has no grammar.');return k.tokens=b.tokenize(k.code,k.grammar),b.hooks.run("after-tokenize",k),D.stringify(b.util.encode(k.tokens),k.language)},tokenize:function(a,c){var y=c.rest;if(y){for(var k in y)c[k]=y[k];delete c.rest}var o=new V;return j(o,o.head,a),_(a,o,c,o.head,0),I(o)},hooks:{all:{},add:function(a,c){var y=b.hooks.all;y[a]=y[a]||[],y[a].push(c)},run:function(a,c){var y=b.hooks.all[a];if(!(!y||!y.length))for(var k=0,o;o=y[k++];)o(c)}},Token:D};u.Prism=b;function D(a,c,y,k){this.type=a,this.content=c,this.alias=y,this.length=(k||"").length|0}D.stringify=function a(c,y){if(typeof c=="string")return c;if(Array.isArray(c)){var k="";return c.forEach(function(S){k+=a(S,y)}),k}var o={type:c.type,content:a(c.content,y),tag:"span",classes:["token",c.type],attributes:{},language:y},$=c.alias;$&&(Array.isArray($)?Array.prototype.push.apply(o.classes,$):o.classes.push($)),b.hooks.run("wrap",o);var v="";for(var f in o.attributes)v+=" "+f+'="'+(o.attributes[f]||"").replace(/"/g,"&quot;")+'"';return"<"+o.tag+' class="'+o.classes.join(" ")+'"'+v+">"+o.content+"</"+o.tag+">"};function L(a,c,y,k){a.lastIndex=c;var o=a.exec(y);if(o&&k&&o[1]){var $=o[1].length;o.index+=$,o[0]=o[0].slice($)}return o}function _(a,c,y,k,o,$){for(var v in y)if(!(!y.hasOwnProperty(v)||!y[v])){var f=y[v];f=Array.isArray(f)?f:[f];for(var S=0;S<f.length;++S){if($&&$.cause==v+","+S)return;var i=f[S],r=i.inside,s=!!i.lookbehind,l=!!i.greedy,m=i.alias;if(l&&!i.pattern.global){var g=i.pattern.toString().match(/[imsuy]*$/)[0];i.pattern=RegExp(i.pattern.source,g+"g")}for(var p=i.pattern||i,h=k.next,x=o;h!==c.tail&&!($&&x>=$.reach);x+=h.value.length,h=h.next){var C=h.value;if(c.length>a.length)return;if(!(C instanceof D)){var O=1,z;if(l){if(z=L(p,x,a,s),!z||z.index>=a.length)break;var H=z.index,U=z.index+z[0].length,P=x;for(P+=h.value.length;H>=P;)h=h.next,P+=h.value.length;if(P-=h.value.length,x=P,h.value instanceof D)continue;for(var q=h;q!==c.tail&&(P<U||typeof q.value=="string");q=q.next)O++,P+=q.value.length;O--,C=a.slice(x,P),z.index-=x}else if(z=L(p,0,C,s),!z)continue;var H=z.index,R=z[0],Z=C.slice(0,H),W=C.slice(H+R.length),B=x+C.length;$&&B>$.reach&&($.reach=B);var X=h.prev;Z&&(X=j(c,X,Z),x+=Z.length),M(c,X,O);var Q=new D(v,r?b.tokenize(R,r):R,m,R);if(h=j(c,X,Q),W&&j(c,h,W),O>1){var ae={cause:v+","+S,reach:B};_(a,c,y,h.prev,x,ae),$&&ae.reach>$.reach&&($.reach=ae.reach)}}}}}}function V(){var a={value:null,prev:null,next:null},c={value:null,prev:a,next:null};a.next=c,this.head=a,this.tail=c,this.length=0}function j(a,c,y){var k=c.next,o={value:y,prev:c,next:k};return c.next=o,k.prev=o,a.length++,o}function M(a,c,y){for(var k=c.next,o=0;o<y&&k!==a.tail;o++)k=k.next;c.next=k,k.prev=c,a.length-=o}function I(a){for(var c=[],y=a.head.next;y!==a.tail;)c.push(y.value),y=y.next;return c}if(!u.document)return u.addEventListener&&(b.disableWorkerMessageHandler||u.addEventListener("message",function(a){var c=JSON.parse(a.data),y=c.language,k=c.code,o=c.immediateClose;u.postMessage(b.highlight(k,b.languages[y],y)),o&&u.close()},!1)),b;var F=b.util.currentScript();F&&(b.filename=F.src,F.hasAttribute("data-manual")&&(b.manual=!0));function T(){b.manual||b.highlightAll()}if(!b.manual){var A=document.readyState;A==="loading"||A==="interactive"&&F&&F.defer?document.addEventListener("DOMContentLoaded",T):window.requestAnimationFrame?window.requestAnimationFrame(T):window.setTimeout(T,16)}return b})(e);n.exports&&(n.exports=t),typeof Ye<"u"&&(Ye.Prism=t),t.languages.markup={comment:{pattern:/<!--(?:(?!<!--)[\s\S])*?-->/,greedy:!0},prolog:{pattern:/<\?[\s\S]+?\?>/,greedy:!0},doctype:{pattern:/<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,greedy:!0,inside:{"internal-subset":{pattern:/(^[^\[]*\[)[\s\S]+(?=\]>$)/,lookbehind:!0,greedy:!0,inside:null},string:{pattern:/"[^"]*"|'[^']*'/,greedy:!0},punctuation:/^<!|>$|[[\]]/,"doctype-tag":/^DOCTYPE/i,name:/[^\s<>'"]+/}},cdata:{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,greedy:!0},tag:{pattern:/<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,greedy:!0,inside:{tag:{pattern:/^<\/?[^\s>\/]+/,inside:{punctuation:/^<\/?/,namespace:/^[^\s>\/:]+:/}},"special-attr":[],"attr-value":{pattern:/=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,inside:{punctuation:[{pattern:/^=/,alias:"attr-equals"},{pattern:/^(\s*)["']|["']$/,lookbehind:!0}]}},punctuation:/\/?>/,"attr-name":{pattern:/[^\s>\/]+/,inside:{namespace:/^[^\s>\/:]+:/}}}},entity:[{pattern:/&[\da-z]{1,8};/i,alias:"named-entity"},/&#x?[\da-f]{1,8};/i]},t.languages.markup.tag.inside["attr-value"].inside.entity=t.languages.markup.entity,t.languages.markup.doctype.inside["internal-subset"].inside=t.languages.markup,t.hooks.add("wrap",function(u){u.type==="entity"&&(u.attributes.title=u.content.replace(/&amp;/,"&"))}),Object.defineProperty(t.languages.markup.tag,"addInlined",{value:function(d,w){var E={};E["language-"+w]={pattern:/(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,lookbehind:!0,inside:t.languages[w]},E.cdata=/^<!\[CDATA\[|\]\]>$/i;var b={"included-cdata":{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,inside:E}};b["language-"+w]={pattern:/[\s\S]+/,inside:t.languages[w]};var D={};D[d]={pattern:RegExp(/(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(/__/g,function(){return d}),"i"),lookbehind:!0,greedy:!0,inside:b},t.languages.insertBefore("markup","cdata",D)}}),Object.defineProperty(t.languages.markup.tag,"addAttribute",{value:function(u,d){t.languages.markup.tag.inside["special-attr"].push({pattern:RegExp(/(^|["'\s])/.source+"(?:"+u+")"+/\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source,"i"),lookbehind:!0,inside:{"attr-name":/^[^\s=]+/,"attr-value":{pattern:/=[\s\S]+/,inside:{value:{pattern:/(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,lookbehind:!0,alias:[d,"language-"+d],inside:t.languages[d]},punctuation:[{pattern:/^=/,alias:"attr-equals"},/"|'/]}}}})}}),t.languages.html=t.languages.markup,t.languages.mathml=t.languages.markup,t.languages.svg=t.languages.markup,t.languages.xml=t.languages.extend("markup",{}),t.languages.ssml=t.languages.xml,t.languages.atom=t.languages.xml,t.languages.rss=t.languages.xml,(function(u){var d=/(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;u.languages.css={comment:/\/\*[\s\S]*?\*\//,atrule:{pattern:RegExp("@[\\w-](?:"+/[^;{\s"']|\s+(?!\s)/.source+"|"+d.source+")*?"+/(?:;|(?=\s*\{))/.source),inside:{rule:/^@[\w-]+/,"selector-function-argument":{pattern:/(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,lookbehind:!0,alias:"selector"},keyword:{pattern:/(^|[^\w-])(?:and|not|only|or)(?![\w-])/,lookbehind:!0}}},url:{pattern:RegExp("\\burl\\((?:"+d.source+"|"+/(?:[^\\\r\n()"']|\\[\s\S])*/.source+")\\)","i"),greedy:!0,inside:{function:/^url/i,punctuation:/^\(|\)$/,string:{pattern:RegExp("^"+d.source+"$"),alias:"url"}}},selector:{pattern:RegExp(`(^|[{}\\s])[^{}\\s](?:[^{};"'\\s]|\\s+(?![\\s{])|`+d.source+")*(?=\\s*\\{)"),lookbehind:!0},string:{pattern:d,greedy:!0},property:{pattern:/(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,lookbehind:!0},important:/!important\b/i,function:{pattern:/(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i,lookbehind:!0},punctuation:/[(){};:,]/},u.languages.css.atrule.inside.rest=u.languages.css;var w=u.languages.markup;w&&(w.tag.addInlined("style","css"),w.tag.addAttribute("style","css"))})(t),t.languages.clike={comment:[{pattern:/(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,lookbehind:!0,greedy:!0},{pattern:/(^|[^\\:])\/\/.*/,lookbehind:!0,greedy:!0}],string:{pattern:/(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,greedy:!0},"class-name":{pattern:/(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,lookbehind:!0,inside:{punctuation:/[.\\]/}},keyword:/\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,boolean:/\b(?:false|true)\b/,function:/\b\w+(?=\()/,number:/\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,operator:/[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,punctuation:/[{}[\];(),.:]/},t.languages.javascript=t.languages.extend("clike",{"class-name":[t.languages.clike["class-name"],{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,lookbehind:!0}],keyword:[{pattern:/((?:^|\})\s*)catch\b/,lookbehind:!0},{pattern:/(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,lookbehind:!0}],function:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,number:{pattern:RegExp(/(^|[^\w$])/.source+"(?:"+(/NaN|Infinity/.source+"|"+/0[bB][01]+(?:_[01]+)*n?/.source+"|"+/0[oO][0-7]+(?:_[0-7]+)*n?/.source+"|"+/0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source+"|"+/\d+(?:_\d+)*n/.source+"|"+/(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/.source)+")"+/(?![\w$])/.source),lookbehind:!0},operator:/--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/}),t.languages.javascript["class-name"][0].pattern=/(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/,t.languages.insertBefore("javascript","keyword",{regex:{pattern:RegExp(/((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)/.source+/\//.source+"(?:"+/(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}/.source+"|"+/(?:\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.)*\])*\])*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}v[dgimyus]{0,7}/.source+")"+/(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/.source),lookbehind:!0,greedy:!0,inside:{"regex-source":{pattern:/^(\/)[\s\S]+(?=\/[a-z]*$)/,lookbehind:!0,alias:"language-regex",inside:t.languages.regex},"regex-delimiter":/^\/|\/$/,"regex-flags":/^[a-z]+$/}},"function-variable":{pattern:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,alias:"function"},parameter:[{pattern:/(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,lookbehind:!0,inside:t.languages.javascript},{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,lookbehind:!0,inside:t.languages.javascript},{pattern:/(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,lookbehind:!0,inside:t.languages.javascript},{pattern:/((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,lookbehind:!0,inside:t.languages.javascript}],constant:/\b[A-Z](?:[A-Z_]|\dx?)*\b/}),t.languages.insertBefore("javascript","string",{hashbang:{pattern:/^#!.*/,greedy:!0,alias:"comment"},"template-string":{pattern:/`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,greedy:!0,inside:{"template-punctuation":{pattern:/^`|`$/,alias:"string"},interpolation:{pattern:/((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,lookbehind:!0,inside:{"interpolation-punctuation":{pattern:/^\$\{|\}$/,alias:"punctuation"},rest:t.languages.javascript}},string:/[\s\S]+/}},"string-property":{pattern:/((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,lookbehind:!0,greedy:!0,alias:"property"}}),t.languages.insertBefore("javascript","operator",{"literal-property":{pattern:/((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,lookbehind:!0,alias:"property"}}),t.languages.markup&&(t.languages.markup.tag.addInlined("script","javascript"),t.languages.markup.tag.addAttribute(/on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/.source,"javascript")),t.languages.js=t.languages.javascript,(function(){if(typeof t>"u"||typeof document>"u")return;Element.prototype.matches||(Element.prototype.matches=Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector);var u="Loading…",d=function(F,T){return"✖ Error "+F+" while fetching file: "+T},w="✖ Error: File does not exist or is empty",E={js:"javascript",py:"python",rb:"ruby",ps1:"powershell",psm1:"powershell",sh:"bash",bat:"batch",h:"c",tex:"latex"},b="data-src-status",D="loading",L="loaded",_="failed",V="pre[data-src]:not(["+b+'="'+L+'"]):not(['+b+'="'+D+'"])';function j(F,T,A){var a=new XMLHttpRequest;a.open("GET",F,!0),a.onreadystatechange=function(){a.readyState==4&&(a.status<400&&a.responseText?T(a.responseText):a.status>=400?A(d(a.status,a.statusText)):A(w))},a.send(null)}function M(F){var T=/^\s*(\d+)\s*(?:(,)\s*(?:(\d+)\s*)?)?$/.exec(F||"");if(T){var A=Number(T[1]),a=T[2],c=T[3];return a?c?[A,Number(c)]:[A,void 0]:[A,A]}}t.hooks.add("before-highlightall",function(F){F.selector+=", "+V}),t.hooks.add("before-sanity-check",function(F){var T=F.element;if(T.matches(V)){F.code="",T.setAttribute(b,D);var A=T.appendChild(document.createElement("CODE"));A.textContent=u;var a=T.getAttribute("data-src"),c=F.language;if(c==="none"){var y=(/\.(\w+)$/.exec(a)||[,"none"])[1];c=E[y]||y}t.util.setLanguage(A,c),t.util.setLanguage(T,c);var k=t.plugins.autoloader;k&&k.loadLanguages(c),j(a,function(o){T.setAttribute(b,L);var $=M(T.getAttribute("data-range"));if($){var v=o.split(/\r\n?|\n/g),f=$[0],S=$[1]==null?v.length:$[1];f<0&&(f+=v.length),f=Math.max(0,Math.min(f-1,v.length)),S<0&&(S+=v.length),S=Math.max(0,Math.min(S,v.length)),o=v.slice(f,S).join(`
`),T.hasAttribute("data-start")||T.setAttribute("data-start",String(f+1))}A.textContent=o,t.highlightElement(A)},function(o){T.setAttribute(b,_),A.textContent=o})}}),t.plugins.fileHighlight={highlight:function(T){for(var A=(T||document).querySelectorAll(V),a=0,c;c=A[a++];)t.highlightElement(c)}};var I=!1;t.fileHighlight=function(){I||(console.warn("Prism.fileHighlight is deprecated. Use `Prism.plugins.fileHighlight.highlight` instead."),I=!0),t.plugins.fileHighlight.highlight.apply(this,arguments)}})()})($e)),$e.exports}var Ot=Ct();const Lt=Tt(Ot);Prism.languages.javascript=Prism.languages.extend("clike",{"class-name":[Prism.languages.clike["class-name"],{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,lookbehind:!0}],keyword:[{pattern:/((?:^|\})\s*)catch\b/,lookbehind:!0},{pattern:/(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,lookbehind:!0}],function:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,number:{pattern:RegExp(/(^|[^\w$])/.source+"(?:"+(/NaN|Infinity/.source+"|"+/0[bB][01]+(?:_[01]+)*n?/.source+"|"+/0[oO][0-7]+(?:_[0-7]+)*n?/.source+"|"+/0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source+"|"+/\d+(?:_\d+)*n/.source+"|"+/(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/.source)+")"+/(?![\w$])/.source),lookbehind:!0},operator:/--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/});Prism.languages.javascript["class-name"][0].pattern=/(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/;Prism.languages.insertBefore("javascript","keyword",{regex:{pattern:RegExp(/((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)/.source+/\//.source+"(?:"+/(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}/.source+"|"+/(?:\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.)*\])*\])*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}v[dgimyus]{0,7}/.source+")"+/(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/.source),lookbehind:!0,greedy:!0,inside:{"regex-source":{pattern:/^(\/)[\s\S]+(?=\/[a-z]*$)/,lookbehind:!0,alias:"language-regex",inside:Prism.languages.regex},"regex-delimiter":/^\/|\/$/,"regex-flags":/^[a-z]+$/}},"function-variable":{pattern:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,alias:"function"},parameter:[{pattern:/(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,lookbehind:!0,inside:Prism.languages.javascript},{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,lookbehind:!0,inside:Prism.languages.javascript},{pattern:/(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,lookbehind:!0,inside:Prism.languages.javascript},{pattern:/((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,lookbehind:!0,inside:Prism.languages.javascript}],constant:/\b[A-Z](?:[A-Z_]|\dx?)*\b/});Prism.languages.insertBefore("javascript","string",{hashbang:{pattern:/^#!.*/,greedy:!0,alias:"comment"},"template-string":{pattern:/`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,greedy:!0,inside:{"template-punctuation":{pattern:/^`|`$/,alias:"string"},interpolation:{pattern:/((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,lookbehind:!0,inside:{"interpolation-punctuation":{pattern:/^\$\{|\}$/,alias:"punctuation"},rest:Prism.languages.javascript}},string:/[\s\S]+/}},"string-property":{pattern:/((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,lookbehind:!0,greedy:!0,alias:"property"}});Prism.languages.insertBefore("javascript","operator",{"literal-property":{pattern:/((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,lookbehind:!0,alias:"property"}});Prism.languages.markup&&(Prism.languages.markup.tag.addInlined("script","javascript"),Prism.languages.markup.tag.addAttribute(/on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/.source,"javascript"));Prism.languages.js=Prism.languages.javascript;Prism.languages.markup={comment:{pattern:/<!--(?:(?!<!--)[\s\S])*?-->/,greedy:!0},prolog:{pattern:/<\?[\s\S]+?\?>/,greedy:!0},doctype:{pattern:/<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,greedy:!0,inside:{"internal-subset":{pattern:/(^[^\[]*\[)[\s\S]+(?=\]>$)/,lookbehind:!0,greedy:!0,inside:null},string:{pattern:/"[^"]*"|'[^']*'/,greedy:!0},punctuation:/^<!|>$|[[\]]/,"doctype-tag":/^DOCTYPE/i,name:/[^\s<>'"]+/}},cdata:{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,greedy:!0},tag:{pattern:/<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,greedy:!0,inside:{tag:{pattern:/^<\/?[^\s>\/]+/,inside:{punctuation:/^<\/?/,namespace:/^[^\s>\/:]+:/}},"special-attr":[],"attr-value":{pattern:/=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,inside:{punctuation:[{pattern:/^=/,alias:"attr-equals"},{pattern:/^(\s*)["']|["']$/,lookbehind:!0}]}},punctuation:/\/?>/,"attr-name":{pattern:/[^\s>\/]+/,inside:{namespace:/^[^\s>\/:]+:/}}}},entity:[{pattern:/&[\da-z]{1,8};/i,alias:"named-entity"},/&#x?[\da-f]{1,8};/i]};Prism.languages.markup.tag.inside["attr-value"].inside.entity=Prism.languages.markup.entity;Prism.languages.markup.doctype.inside["internal-subset"].inside=Prism.languages.markup;Prism.hooks.add("wrap",function(n){n.type==="entity"&&(n.attributes.title=n.content.replace(/&amp;/,"&"))});Object.defineProperty(Prism.languages.markup.tag,"addInlined",{value:function(e,t){var u={};u["language-"+t]={pattern:/(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,lookbehind:!0,inside:Prism.languages[t]},u.cdata=/^<!\[CDATA\[|\]\]>$/i;var d={"included-cdata":{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,inside:u}};d["language-"+t]={pattern:/[\s\S]+/,inside:Prism.languages[t]};var w={};w[e]={pattern:RegExp(/(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(/__/g,function(){return e}),"i"),lookbehind:!0,greedy:!0,inside:d},Prism.languages.insertBefore("markup","cdata",w)}});Object.defineProperty(Prism.languages.markup.tag,"addAttribute",{value:function(n,e){Prism.languages.markup.tag.inside["special-attr"].push({pattern:RegExp(/(^|["'\s])/.source+"(?:"+n+")"+/\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source,"i"),lookbehind:!0,inside:{"attr-name":/^[^\s=]+/,"attr-value":{pattern:/=[\s\S]+/,inside:{value:{pattern:/(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,lookbehind:!0,alias:[e,"language-"+e],inside:Prism.languages[e]},punctuation:[{pattern:/^=/,alias:"attr-equals"},/"|'/]}}}})}});Prism.languages.html=Prism.languages.markup;Prism.languages.mathml=Prism.languages.markup;Prism.languages.svg=Prism.languages.markup;Prism.languages.xml=Prism.languages.extend("markup",{});Prism.languages.ssml=Prism.languages.xml;Prism.languages.atom=Prism.languages.xml;Prism.languages.rss=Prism.languages.xml;(function(n){var e="\\b(?:BASH|BASHOPTS|BASH_ALIASES|BASH_ARGC|BASH_ARGV|BASH_CMDS|BASH_COMPLETION_COMPAT_DIR|BASH_LINENO|BASH_REMATCH|BASH_SOURCE|BASH_VERSINFO|BASH_VERSION|COLORTERM|COLUMNS|COMP_WORDBREAKS|DBUS_SESSION_BUS_ADDRESS|DEFAULTS_PATH|DESKTOP_SESSION|DIRSTACK|DISPLAY|EUID|GDMSESSION|GDM_LANG|GNOME_KEYRING_CONTROL|GNOME_KEYRING_PID|GPG_AGENT_INFO|GROUPS|HISTCONTROL|HISTFILE|HISTFILESIZE|HISTSIZE|HOME|HOSTNAME|HOSTTYPE|IFS|INSTANCE|JOB|LANG|LANGUAGE|LC_ADDRESS|LC_ALL|LC_IDENTIFICATION|LC_MEASUREMENT|LC_MONETARY|LC_NAME|LC_NUMERIC|LC_PAPER|LC_TELEPHONE|LC_TIME|LESSCLOSE|LESSOPEN|LINES|LOGNAME|LS_COLORS|MACHTYPE|MAILCHECK|MANDATORY_PATH|NO_AT_BRIDGE|OLDPWD|OPTERR|OPTIND|ORBIT_SOCKETDIR|OSTYPE|PAPERSIZE|PATH|PIPESTATUS|PPID|PS1|PS2|PS3|PS4|PWD|RANDOM|REPLY|SECONDS|SELINUX_INIT|SESSION|SESSIONTYPE|SESSION_MANAGER|SHELL|SHELLOPTS|SHLVL|SSH_AUTH_SOCK|TERM|UID|UPSTART_EVENTS|UPSTART_INSTANCE|UPSTART_JOB|UPSTART_SESSION|USER|WINDOWID|XAUTHORITY|XDG_CONFIG_DIRS|XDG_CURRENT_DESKTOP|XDG_DATA_DIRS|XDG_GREETER_DATA_DIR|XDG_MENU_PREFIX|XDG_RUNTIME_DIR|XDG_SEAT|XDG_SEAT_PATH|XDG_SESSION_DESKTOP|XDG_SESSION_ID|XDG_SESSION_PATH|XDG_SESSION_TYPE|XDG_VTNR|XMODIFIERS)\\b",t={pattern:/(^(["']?)\w+\2)[ \t]+\S.*/,lookbehind:!0,alias:"punctuation",inside:null},u={bash:t,environment:{pattern:RegExp("\\$"+e),alias:"constant"},variable:[{pattern:/\$?\(\([\s\S]+?\)\)/,greedy:!0,inside:{variable:[{pattern:/(^\$\(\([\s\S]+)\)\)/,lookbehind:!0},/^\$\(\(/],number:/\b0x[\dA-Fa-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:[Ee]-?\d+)?/,operator:/--|\+\+|\*\*=?|<<=?|>>=?|&&|\|\||[=!+\-*/%<>^&|]=?|[?~:]/,punctuation:/\(\(?|\)\)?|,|;/}},{pattern:/\$\((?:\([^)]+\)|[^()])+\)|`[^`]+`/,greedy:!0,inside:{variable:/^\$\(|^`|\)$|`$/}},{pattern:/\$\{[^}]+\}/,greedy:!0,inside:{operator:/:[-=?+]?|[!\/]|##?|%%?|\^\^?|,,?/,punctuation:/[\[\]]/,environment:{pattern:RegExp("(\\{)"+e),lookbehind:!0,alias:"constant"}}},/\$(?:\w+|[#?*!@$])/],entity:/\\(?:[abceEfnrtv\\"]|O?[0-7]{1,3}|U[0-9a-fA-F]{8}|u[0-9a-fA-F]{4}|x[0-9a-fA-F]{1,2})/};n.languages.bash={shebang:{pattern:/^#!\s*\/.*/,alias:"important"},comment:{pattern:/(^|[^"{\\$])#.*/,lookbehind:!0},"function-name":[{pattern:/(\bfunction\s+)[\w-]+(?=(?:\s*\(?:\s*\))?\s*\{)/,lookbehind:!0,alias:"function"},{pattern:/\b[\w-]+(?=\s*\(\s*\)\s*\{)/,alias:"function"}],"for-or-select":{pattern:/(\b(?:for|select)\s+)\w+(?=\s+in\s)/,alias:"variable",lookbehind:!0},"assign-left":{pattern:/(^|[\s;|&]|[<>]\()\w+(?:\.\w+)*(?=\+?=)/,inside:{environment:{pattern:RegExp("(^|[\\s;|&]|[<>]\\()"+e),lookbehind:!0,alias:"constant"}},alias:"variable",lookbehind:!0},parameter:{pattern:/(^|\s)-{1,2}(?:\w+:[+-]?)?\w+(?:\.\w+)*(?=[=\s]|$)/,alias:"variable",lookbehind:!0},string:[{pattern:/((?:^|[^<])<<-?\s*)(\w+)\s[\s\S]*?(?:\r?\n|\r)\2/,lookbehind:!0,greedy:!0,inside:u},{pattern:/((?:^|[^<])<<-?\s*)(["'])(\w+)\2\s[\s\S]*?(?:\r?\n|\r)\3/,lookbehind:!0,greedy:!0,inside:{bash:t}},{pattern:/(^|[^\\](?:\\\\)*)"(?:\\[\s\S]|\$\([^)]+\)|\$(?!\()|`[^`]+`|[^"\\`$])*"/,lookbehind:!0,greedy:!0,inside:u},{pattern:/(^|[^$\\])'[^']*'/,lookbehind:!0,greedy:!0},{pattern:/\$'(?:[^'\\]|\\[\s\S])*'/,greedy:!0,inside:{entity:u.entity}}],environment:{pattern:RegExp("\\$?"+e),alias:"constant"},variable:u.variable,function:{pattern:/(^|[\s;|&]|[<>]\()(?:add|apropos|apt|apt-cache|apt-get|aptitude|aspell|automysqlbackup|awk|basename|bash|bc|bconsole|bg|bzip2|cal|cargo|cat|cfdisk|chgrp|chkconfig|chmod|chown|chroot|cksum|clear|cmp|column|comm|composer|cp|cron|crontab|csplit|curl|cut|date|dc|dd|ddrescue|debootstrap|df|diff|diff3|dig|dir|dircolors|dirname|dirs|dmesg|docker|docker-compose|du|egrep|eject|env|ethtool|expand|expect|expr|fdformat|fdisk|fg|fgrep|file|find|fmt|fold|format|free|fsck|ftp|fuser|gawk|git|gparted|grep|groupadd|groupdel|groupmod|groups|grub-mkconfig|gzip|halt|head|hg|history|host|hostname|htop|iconv|id|ifconfig|ifdown|ifup|import|install|ip|java|jobs|join|kill|killall|less|link|ln|locate|logname|logrotate|look|lpc|lpr|lprint|lprintd|lprintq|lprm|ls|lsof|lynx|make|man|mc|mdadm|mkconfig|mkdir|mke2fs|mkfifo|mkfs|mkisofs|mknod|mkswap|mmv|more|most|mount|mtools|mtr|mutt|mv|nano|nc|netstat|nice|nl|node|nohup|notify-send|npm|nslookup|op|open|parted|passwd|paste|pathchk|ping|pkill|pnpm|podman|podman-compose|popd|pr|printcap|printenv|ps|pushd|pv|quota|quotacheck|quotactl|ram|rar|rcp|reboot|remsync|rename|renice|rev|rm|rmdir|rpm|rsync|scp|screen|sdiff|sed|sendmail|seq|service|sftp|sh|shellcheck|shuf|shutdown|sleep|slocate|sort|split|ssh|stat|strace|su|sudo|sum|suspend|swapon|sync|sysctl|tac|tail|tar|tee|time|timeout|top|touch|tr|traceroute|tsort|tty|umount|uname|unexpand|uniq|units|unrar|unshar|unzip|update-grub|uptime|useradd|userdel|usermod|users|uudecode|uuencode|v|vcpkg|vdir|vi|vim|virsh|vmstat|wait|watch|wc|wget|whereis|which|who|whoami|write|xargs|xdg-open|yarn|yes|zenity|zip|zsh|zypper)(?=$|[)\s;|&])/,lookbehind:!0},keyword:{pattern:/(^|[\s;|&]|[<>]\()(?:case|do|done|elif|else|esac|fi|for|function|if|in|select|then|until|while)(?=$|[)\s;|&])/,lookbehind:!0},builtin:{pattern:/(^|[\s;|&]|[<>]\()(?:\.|:|alias|bind|break|builtin|caller|cd|command|continue|declare|echo|enable|eval|exec|exit|export|getopts|hash|help|let|local|logout|mapfile|printf|pwd|read|readarray|readonly|return|set|shift|shopt|source|test|times|trap|type|typeset|ulimit|umask|unalias|unset)(?=$|[)\s;|&])/,lookbehind:!0,alias:"class-name"},boolean:{pattern:/(^|[\s;|&]|[<>]\()(?:false|true)(?=$|[)\s;|&])/,lookbehind:!0},"file-descriptor":{pattern:/\B&\d\b/,alias:"important"},operator:{pattern:/\d?<>|>\||\+=|=[=~]?|!=?|<<[<-]?|[&\d]?>>|\d[<>]&?|[<>][&=]?|&[>&]?|\|[&|]?/,inside:{"file-descriptor":{pattern:/^\d/,alias:"important"}}},punctuation:/\$?\(\(?|\)\)?|\.\.|[{}[\];\\]/,number:{pattern:/(^|\s)(?:[1-9]\d*|0)(?:[.,]\d+)?\b/,lookbehind:!0}},t.inside=n.languages.bash;for(var d=["comment","function-name","for-or-select","assign-left","parameter","string","environment","function","keyword","builtin","boolean","file-descriptor","operator","punctuation","number"],w=u.variable[1].inside,E=0;E<d.length;E++)w[d[E]]=n.languages.bash[d[E]];n.languages.sh=n.languages.bash,n.languages.shell=n.languages.bash})(Prism);Prism.languages.json={property:{pattern:/(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?=\s*:)/,lookbehind:!0,greedy:!0},string:{pattern:/(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?!\s*:)/,lookbehind:!0,greedy:!0},comment:{pattern:/\/\/.*|\/\*[\s\S]*?(?:\*\/|$)/,greedy:!0},number:/-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i,punctuation:/[{}[\],]/,operator:/:/,boolean:/\b(?:false|true)\b/,null:{pattern:/\bnull\b/,alias:"keyword"}};Prism.languages.webmanifest=Prism.languages.json;var Xe={},Je;function jt(){return Je||(Je=1,(function(n){n.languages.typescript=n.languages.extend("javascript",{"class-name":{pattern:/(\b(?:class|extends|implements|instanceof|interface|new|type)\s+)(?!keyof\b)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?:\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>)?/,lookbehind:!0,greedy:!0,inside:null},builtin:/\b(?:Array|Function|Promise|any|boolean|console|never|number|string|symbol|unknown)\b/}),n.languages.typescript.keyword.push(/\b(?:abstract|declare|is|keyof|readonly|require)\b/,/\b(?:asserts|infer|interface|module|namespace|type)\b(?=\s*(?:[{_$a-zA-Z\xA0-\uFFFF]|$))/,/\btype\b(?=\s*(?:[\{*]|$))/),delete n.languages.typescript.parameter,delete n.languages.typescript["literal-property"];var e=n.languages.extend("typescript",{});delete e["class-name"],n.languages.typescript["class-name"].inside=e,n.languages.insertBefore("typescript","function",{decorator:{pattern:/@[$\w\xA0-\uFFFF]+/,inside:{at:{pattern:/^@/,alias:"operator"},function:/^[\s\S]+/}},"generic-function":{pattern:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>(?=\s*\()/,greedy:!0,inside:{function:/^#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*/,generic:{pattern:/<[\s\S]+/,alias:"class-name",inside:e}}}}),n.languages.ts=n.languages.typescript})(Prism)),Xe}jt();const Pt={js:"JavaScript",ts:"TypeScript",html:"HTML",bash:"Shell",json:"JSON"};function Dt(n){const e=n.split(`
`);for(;e.length&&!e[0].trim();)e.shift();for(;e.length&&!e[e.length-1].trim();)e.pop();const t=e.filter(u=>u.trim()).reduce((u,d)=>Math.min(u,d.match(/^(\s*)/)[1].length),1/0);return e.map(u=>u.slice(t)).join(`
`)}const It={data:{lang:"js",code:"",label:"",copied:!1},template:`
        <div class="code-block">
            <div class="code-header">
                <span class="code-lang">{{ label || langLabel }}</span>
                <button class="copy-btn" @click="copy()">
                    {{ copied ? '✓ Copied' : 'Copy' }}
                </button>
            </div>
            <pre class="language-placeholder"><code cv-ref="el" :class="'language-' + lang"></code></pre>
        </div>
    `,computed:{langLabel(){return Pt[this.lang]||this.lang.toUpperCase()}},methods:{copy(){var n;(n=navigator.clipboard)==null||n.writeText(this._cleanCode).then(()=>{this.copied=!0,setTimeout(()=>{this.copied=!1},1800)})}},onMount(){const n=this.$refs.el;n&&(this._cleanCode=Dt(this.code),n.textContent=this._cleanCode,Lt.highlightElement(n))}},Rt={data:{install:`# From GitHub
npm install github:vanjexdev/courvux

# or via pnpm
pnpm add github:vanjexdev/courvux`,counter:`import { createApp } from 'courvux';

createApp({
    template: \`
        <h1>Count: {{ count }}</h1>
        <button @click="count++">+1</button>
        <button @click="count = 0">Reset</button>
    \`,
    data: { count: 0 }
}).mount('#app');`},template:`
        <div>
            <!-- Hero -->
            <div style="padding: 3rem 0 2rem; border-bottom: 1px solid #e8e8e8; margin-bottom: 2.5rem;">
                <div style="display:flex; align-items:center; gap:12px; margin-bottom:1rem;">
                    <span style="font-size:2rem;">⚡</span>
                    <h1 style="font-size:2rem; font-weight:700; margin:0;">Courvux</h1>
                    <span class="badge">v0.2.0</span>
                </div>
                <p style="font-size:1rem; color:#444; margin-bottom:1.5rem; max-width:560px; line-height:1.6;">
                    Lightweight reactive UI framework. No virtual DOM —
                    direct DOM updates via Proxy-based reactivity.
                    Ships as a single ES module, no build step required.
                </p>
                <div style="display:flex; gap:10px; flex-wrap:wrap;">
                    <router-link to="/installation" style="display:inline-block; padding:8px 18px; background:#111; color:#fff; border-radius:6px; text-decoration:none; font-size:13px; font-weight:600;">
                        Get Started →
                    </router-link>
                    <router-link to="/demo" style="display:inline-block; padding:8px 18px; background:#f0f0f0; color:#111; border-radius:6px; text-decoration:none; font-size:13px; border:1px solid #ddd;">
                        Live Demo
                    </router-link>
                </div>
            </div>

            <!-- Feature cards -->
            <div style="display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:16px; margin-bottom:2.5rem;">
                <div style="padding:16px; border:1px solid #e8e8e8; border-radius:8px; background:#fff;">
                    <div style="font-size:1.2rem; margin-bottom:8px;">🚀</div>
                    <div style="font-size:13px; font-weight:600; margin-bottom:4px;">~10 kB gzip</div>
                    <div style="font-size:12px; color:#666;">Single ES module. Zero runtime dependencies.</div>
                </div>
                <div style="padding:16px; border:1px solid #e8e8e8; border-radius:8px; background:#fff;">
                    <div style="font-size:1.2rem; margin-bottom:8px;">⚡</div>
                    <div style="font-size:13px; font-weight:600; margin-bottom:4px;">No virtual DOM</div>
                    <div style="font-size:12px; color:#666;">Direct DOM updates. Only changed nodes touched.</div>
                </div>
                <div style="padding:16px; border:1px solid #e8e8e8; border-radius:8px; background:#fff;">
                    <div style="font-size:1.2rem; margin-bottom:8px;">🔁</div>
                    <div style="font-size:13px; font-weight:600; margin-bottom:4px;">Proxy reactivity</div>
                    <div style="font-size:12px; color:#666;">Fine-grained subscriptions. No dirty checking.</div>
                </div>
                <div style="padding:16px; border:1px solid #e8e8e8; border-radius:8px; background:#fff;">
                    <div style="font-size:1.2rem; margin-bottom:8px;">🧩</div>
                    <div style="font-size:13px; font-weight:600; margin-bottom:4px;">Familiar syntax</div>
                    <div style="font-size:12px; color:#666;">Alpine-inspired directives. Vue-like components.</div>
                </div>
            </div>

            <!-- Install snippet -->
            <div class="prose">
                <h2>Install</h2>
                <code-block :lang="'bash'" :code="install" :label="'terminal'"></code-block>

                <h2>A counter in 10 lines</h2>
                <code-block :lang="'js'" :code="counter" :label="'main.js'"></code-block>

                <div class="callout info" style="margin-top:1.5rem;">
                    No build step required. Courvux works directly in the browser via an import map.
                    See <router-link to="/installation">Installation</router-link> for details.
                </div>
            </div>
        </div>
    `},Mt={data:{s1:`npm install github:vanjexdev/courvux
# or
pnpm add github:vanjexdev/courvux`,s2:`<script type="importmap">
{
  "imports": {
    "courvux": "./node_modules/courvux/dist/index.js"
  }
}
<\/script>
<script type="module" src="./main.js"><\/script>`,s3:"import { createApp } from 'courvux';",s4:`// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
    // Courvux resolves automatically from node_modules
});`,s5:`// tsconfig.json — add Courvux types
{
  "compilerOptions": {
    "types": ["courvux"]
  }
}`,sCdn:`<!-- Latest from main branch -->
<script type="module">
  import { createApp } from 'https://cdn.jsdelivr.net/gh/vanjexdev/courvux@main/dist/index.js';

  createApp({
    data: { count: 0 },
    template: \`<button @click="count++">Clicks: {{ count }}</button>\`
  }).mount('#app');
<\/script>`,sCdnMap:`<!-- Pin to a specific version (recommended for production) -->
<script type="importmap">
{
  "imports": {
    "courvux": "https://cdn.jsdelivr.net/gh/vanjexdev/courvux@0.2.0/dist/index.js"
  }
}
<\/script>

<script type="module">
  import { createApp, createStore, createRouter } from 'courvux';
<\/script>`},onMount(){const n=this.$refs.pen;if(!n)return;console.log(n);const e=document.createElement("iframe");e.src="https://codepen.io/jesusuzcategui-the-bold/embed/VYmZNgZ?default-tab=html%2Cresult&theme-id=dark",e.height="420",e.style.cssText="width:100%; border:0; border-radius:8px; display:block; margin-bottom:1rem;",e.scrolling="no",e.setAttribute("frameborder","no"),e.setAttribute("allowtransparency","true"),e.allowFullscreen=!0,e.title="Courvux CDN demo on CodePen",n.replaceWith(e)},template:`
        <div class="prose">
            <h1>Installation</h1>
            <p>Courvux ships as a single minified ES module with no runtime dependencies.</p>

            <h2>CDN — jsDelivr</h2>
            <p>No install, no build step. Drop a <code>&lt;script type="module"&gt;</code> anywhere:</p>
            <code-block :lang="'html'" :code="sCdn" :label="'index.html'"></code-block>
            <p>Or use an import map to keep <code>import ... from 'courvux'</code> clean across multiple files:</p>
            <code-block :lang="'html'" :code="sCdnMap" :label="'index.html'"></code-block>
            <div class="callout info">
                Pin to a tag or commit hash in production — <code>@main</code> always resolves to the latest commit and may include breaking changes.
            </div>
            
            <p style="margin-top:1.25rem; font-size:0.875rem; color:#333;">Try it live — no install required:</p>
            <p cv-ref="pen" style="margin:0 0 1rem; color:#888; font-size:12px;">Loading pen…</p>

            <h2>From GitHub</h2>
            <p>Install directly from the GitHub repository (no npm publish yet):</p>
            <code-block :lang="'bash'" :code="s1" :label="'terminal'"></code-block>

            <h2>Without a bundler — Import Map</h2>
            <p>Add an import map before your module script. No build step needed.</p>
            <code-block :lang="'html'" :code="s2" :label="'index.html'"></code-block>

            <h2>With Vite / bundler</h2>
            <p>Import directly — Courvux resolves from <code>node_modules</code> automatically:</p>
            <code-block :lang="'js'" :code="s3" :label="'main.js'"></code-block>
            <code-block :lang="'js'" :code="s4" :label="'vite.config.js'"></code-block>

            <h2>TypeScript</h2>
            <p>Type declarations are included in the package at <code>dist/index.d.ts</code>.</p>
            <code-block :lang="'json'" :code="s5" :label="'tsconfig.json'"></code-block>

            <h2>Updating</h2>
            <div class="callout">
                <code>dist/</code> is committed to the repo. Courvux does not run a build step on install.
                To update, remove and re-add the package.
            </div>

            <div style="margin-top:2rem; display:flex; gap:12px;">
                <router-link to="/" style="font-size:13px; color:#555;">← Home</router-link>
                <router-link to="/quick-start" style="font-size:13px; color:#111; font-weight:600;">Quick Start →</router-link>
            </div>
        </div>
    `},zt={data:{s1:`import { createApp } from 'courvux';

createApp({
    template: \`
        <div>
            <h1>{{ count }}</h1>
            <button @click="count++">Increment</button>
            <button @click="count = 0">Reset</button>
        </div>
    \`,
    data: { count: 0 }
}).mount('#app');`,s2:`createApp({
    template: \`
        <div>
            <input cv-model="name" placeholder="Your name" />
            <p cv-if="name">Hello, {{ name }}!</p>
            <p cv-else>Enter your name above.</p>
        </div>
    \`,
    data: { name: '' }
}).mount('#app');`,s3:`createApp({
    template: \`
        <ul>
            <li cv-for="item in items" :key="item.id">
                {{ item.text }}
                <button @click="remove(item.id)">×</button>
            </li>
        </ul>
        <input cv-model="newItem" @keydown.enter="add()" placeholder="Add item..." />
    \`,
    data: { items: [], newItem: '', _id: 0 },
    methods: {
        add() {
            if (!this.newItem.trim()) return;
            this.items = [...this.items, { id: ++this._id, text: this.newItem }];
            this.newItem = '';
        },
        remove(id) {
            this.items = this.items.filter(i => i.id !== id);
        }
    }
}).mount('#app');`,s4:`import { createApp, createRouter, createStore } from 'courvux';

const store = createStore({
    state: { user: 'guest' },
    actions: {
        login(name) { this.user = name; }
    }
});

const router = createRouter([
    { path: '/',      component: HomeComp },
    { path: '/about', component: AboutComp }
], { mode: 'hash' });

createApp({ store, router, template: '<router-view />' }).mount('#app');`},template:`
        <div class="prose">
            <h1>Quick Start</h1>
            <p>Three examples to get you productive in minutes.</p>

            <h2>1. Reactive counter</h2>
            <p>The minimal Courvux app — reactive state + event binding in a single object.</p>
            <code-block :lang="'js'" :code="s1" :label="'main.js'"></code-block>

            <h2>2. Two-way binding + conditionals</h2>
            <p><code>cv-model</code> syncs input to state. <code>cv-if</code>/<code>cv-else</code> toggle DOM nodes.</p>
            <code-block :lang="'js'" :code="s2" :label="'main.js'"></code-block>

            <h2>3. List with keyed reconciliation</h2>
            <p>
                <code>cv-for</code> with <code>:key</code> enables efficient DOM reuse —
                only added/removed/reordered nodes are touched.
            </p>
            <code-block :lang="'js'" :code="s3" :label="'main.js'"></code-block>

            <h2>Larger apps — router + store</h2>
            <p>Add a router for multi-page navigation and a store for global state:</p>
            <code-block :lang="'js'" :code="s4" :label="'main.js'"></code-block>

            <div class="callout info">
                Every API shown here is covered in depth in the sidebar sections.
                Start with <router-link to="/template">Template Syntax</router-link> or jump to
                <router-link to="/demo">the TODO demo</router-link>.
            </div>

            <div style="margin-top:2rem; display:flex; gap:12px;">
                <router-link to="/installation" style="font-size:13px; color:#555;">← Installation</router-link>
                <router-link to="/template" style="font-size:13px; color:#111; font-weight:600;">Template Syntax →</router-link>
            </div>
        </div>
    `},Nt={data:{s_interp:`<!-- Text interpolation -->
<p>{{ count }}</p>
<p>{{ price * qty }}</p>
<p>{{ active ? 'On' : 'Off' }}</p>
<p>{{ name.toUpperCase() }}</p>`,s_bind:`<!-- Property binding -->
<input :disabled="count > 10" />
<img :src="avatarUrl" :alt="user.name" />

<!-- Class binding (object | array | string) -->
<div :class="{ active: isOn, 'text-muted': !isOn }"></div>
<div :class="['base', isOn ? 'on' : 'off']"></div>

<!-- Style binding -->
<span :style="{ color: textColor, fontSize: size + 'px' }"></span>
<span :style="'color:red; font-weight:bold'"></span>`,s_events:`<!-- Method reference -->
<button @click="increment">+1</button>

<!-- Inline expression -->
<button @click="count++">+</button>
<button @click="count = 0">Reset</button>

<!-- $event — raw DOM event -->
<input @input="search = $event.target.value" />

<!-- Modifiers -->
<form @submit.prevent="onSubmit">...</form>
<button @click.stop="doThing">...</button>
<button @click.once="runOnce">...</button>

<!-- Key modifiers -->
<input @keydown.enter="submit" />
<input @keydown.esc="cancel" />

<!-- cv:on: prefix (alternative to @) -->
<button cv:on:click="increment">+1</button>`,s_cvfor:`<!-- Array -->
<li cv-for="item in items">{{ item }}</li>
<li cv-for="(item, index) in items">{{ index }}: {{ item }}</li>

<!-- Object -->
<li cv-for="(val, key) in person">{{ key }}: {{ val }}</li>

<!-- Keyed — recommended for dynamic lists -->
<li cv-for="user in users" :key="user.id">
    {{ user.name }}
</li>`,s_cvif:`<!-- Elements are added/removed from the DOM -->
<p cv-if="count > 10">High</p>
<p cv-else-if="count > 0">Low</p>
<p cv-else>Zero</p>`,s_cvshow:`<!-- Toggles display:none — stays in DOM -->
<div cv-show="isVisible">Panel content</div>

<!-- With Alpine-style transition -->
<div cv-show="open" cv-transition>Fade in/out</div>
<div cv-show="open" cv-transition.scale>Scale + fade</div>`,s_cvmodel:`<!-- Text input -->
<input type="text" cv-model="name" />

<!-- Checkbox → boolean -->
<input type="checkbox" cv-model="active" />

<!-- Select -->
<select cv-model="country">
    <option value="us">United States</option>
    <option value="mx">Mexico</option>
</select>

<!-- Modifiers -->
<input cv-model.lazy="query" />     <!-- update on blur -->
<input cv-model.trim="username" />  <!-- strip whitespace -->
<input cv-model.number="price" />   <!-- coerce to number -->
<input cv-model.debounce="search" />        <!-- 300ms debounce -->
<input cv-model.debounce.500="search" />    <!-- custom delay -->`,s_cvhtml:`<!-- Raw innerHTML — use only with trusted content -->
<div cv-html="richContent"></div>

<!-- Sanitized — strips scripts, event handlers, javascript: URLs -->
<div cv-html.sanitize="userContent"></div>`,s_cvdata:`<!-- Inline reactive scope — no component registration needed -->
<div cv-data="{ count: 0 }">
    <button @click="count--">−</button>
    <span>{{ count }}</span>
    <button @click="count++">+</button>
</div>

<!-- With methods -->
<div cv-data="{ open: false, toggle() { this.open = !this.open } }">
    <button @click="toggle()">{{ open ? 'Close' : 'Open' }}</button>
    <p cv-show="open">Content</p>
</div>

<!-- Nested scopes — child inherits parent keys -->
<div cv-data="{ user: 'Alice' }">
    <div cv-data="{ role: 'admin' }">
        {{ user }} — {{ role }}
    </div>
</div>`,s_misc:`<!-- cv-once — render once, skip future updates -->
<strong cv-once>{{ initialValue }}</strong>

<!-- cv-ref — store element reference in $refs -->
<input cv-ref="myInput" />

<!-- cv-teleport — move to another DOM node -->
<div cv-show="modal" cv-teleport="body">...</div>

<!-- cv-cloak — hide until mounted -->
<div id="app" cv-cloak></div>`},template:`
        <div class="prose">
            <h1>Template Syntax</h1>
            <p>Courvux templates are plain HTML with directives and expression bindings.
               All expressions are full JavaScript (requires no strict CSP).</p>

            <h2>Interpolation</h2>
            <p>Use <code>{{ }}</code> inside text nodes for reactive values:</p>
            <code-block :lang="'html'" :code="s_interp"></code-block>

            <h2>Property & class & style bindings</h2>
            <p>Prefix any attribute with <code>:</code> to evaluate it as a JavaScript expression:</p>
            <code-block :lang="'html'" :code="s_bind"></code-block>

            <h2>Event binding</h2>
            <p>Use <code>@event</code> or <code>cv:on:event</code>. Access the raw event via <code>$event</code>.</p>
            <code-block :lang="'html'" :code="s_events"></code-block>

            <h2>cv-for — list rendering</h2>
            <p>Add <code>:key</code> for keyed reconciliation — Courvux reuses existing DOM nodes for matching keys.</p>
            <code-block :lang="'html'" :code="s_cvfor"></code-block>

            <h2>cv-if / cv-else-if / cv-else</h2>
            <p>Nodes are inserted and removed from the DOM.</p>
            <code-block :lang="'html'" :code="s_cvif"></code-block>

            <h2>cv-show</h2>
            <p>Toggles <code>display: none</code>. Node stays in the DOM.</p>
            <code-block :lang="'html'" :code="s_cvshow"></code-block>

            <h2>cv-model — two-way binding</h2>
            <code-block :lang="'html'" :code="s_cvmodel"></code-block>

            <h2>cv-html</h2>
            <code-block :lang="'html'" :code="s_cvhtml"></code-block>

            <h2>cv-data — inline scope</h2>
            <p>Self-contained reactive scope without component registration. Lighter than components — no lifecycle, no slots, no emits.</p>
            <code-block :lang="'html'" :code="s_cvdata"></code-block>

            <h2>Misc directives</h2>
            <code-block :lang="'html'" :code="s_misc"></code-block>

            <div style="margin-top:2rem; display:flex; gap:12px;">
                <router-link to="/quick-start" style="font-size:13px; color:#555;">← Quick Start</router-link>
                <router-link to="/components" style="font-size:13px; color:#111; font-weight:600;">Components →</router-link>
            </div>
        </div>
    `},Ht={data:{s_define:`createApp({
    components: {
        'user-card': {
            template: \`<div class="card">{{ name }} — {{ role }}</div>\`,
            data: { name: '', role: '' }
        }
    },
    template: \`<user-card :name="currentUser" :role="'editor'" />\`
}).mount('#app');`,s_props:`<!-- Parent passes props with : prefix -->
<user-card :name="currentUser" :role="'editor'" />

// user-card component
{
    data: { name: '', role: '' },
    template: \`<h3>{{ name }}</h3><span>{{ role }}</span>\`
}`,s_emit:`// Child emits to parent
{
    methods: {
        close() { this.$emit('close'); },
        submit(data) { this.$emit('submit', data); }
    }
}

<!-- Parent listens -->
<modal @close="onClose" @submit="onSubmit" />`,s_dispatch:`// Child dispatches a bubbling CustomEvent from $el
methods: {
    select(item) {
        this.$dispatch('item-selected', { id: item.id });
    }
}

<!-- Any ancestor can listen -->
<div @item-selected="onSelected">
    <product-list />
</div>`,s_slots:`<!-- Default slot -->
<my-panel><p>Content from parent</p></my-panel>

<!-- my-panel template -->
<div class="panel"><slot></slot></div>

<!-- Named slots -->
<my-card>
    <span slot="header">Title</span>
    <p>Body content</p>
</my-card>

<!-- my-card template -->
<div>
    <header><slot name="header" /></header>
    <main><slot /></main>
</div>

<!-- Scoped slot — component exposes data up to parent -->
<item-list :items="products" v-slot="{ item, index }">
    {{ index }}. {{ item.name }}
</item-list>`,s_dynamic:`<!-- Mounts the component whose name matches activeView -->
<component :is="activeView" />

data: { activeView: 'tab-home' },
components: {
    'tab-home':     { template: \`<p>Home</p>\` },
    'tab-settings': { template: \`<p>Settings</p>\` }
}`,s_refs:`<!-- On a native element: stores the HTMLElement -->
<input cv-ref="myInput" />

<!-- On a component: stores the child's reactive state -->
<counter cv-ref="counter" />
<button @click="$refs.counter.reset()">Reset</button>`,s_model:`<!-- cv-model on a component -->
<mi-input cv-model="search" />

// Expands to: :modelValue="search" @update:modelValue="search = $event"
// Child emits:
methods: {
    onInput(e) { this.$emit('update:modelValue', e.target.value); }
}

<!-- Multiple cv-model bindings -->
<editor cv-model:title="docTitle" cv-model:body="docBody" />`},template:`
        <div class="prose">
            <h1>Components</h1>
            <p>Components encapsulate template, data, methods, and lifecycle into reusable units.</p>

            <h2>Defining & registering</h2>
            <p>Register in <code>components</code> on the root app or any parent component. Children are available in that component's template and all its descendants.</p>
            <code-block :lang="'js'" :code="s_define"></code-block>

            <h2>Props</h2>
            <p>Pass reactive data from parent to child via <code>:propName</code>. Parent changes flow down automatically.</p>
            <code-block :lang="'js'" :code="s_props"></code-block>

            <h2>Emitting events — $emit</h2>
            <p>Child notifies parent without direct coupling.</p>
            <code-block :lang="'js'" :code="s_emit"></code-block>

            <h2>$dispatch — bubbling CustomEvent</h2>
            <p>Alternative to emit — fires a native <code>CustomEvent</code> that bubbles up the DOM. Any ancestor element can catch it with <code>@event</code>.</p>
            <code-block :lang="'js'" :code="s_dispatch"></code-block>

            <h2>Slots</h2>
            <p>Default slot, named slots, and scoped slots (parent reads component-exposed data via <code>v-slot</code>).</p>
            <code-block :lang="'html'" :code="s_slots"></code-block>

            <h2>Dynamic component</h2>
            <p>Destroys and mounts a new component when the value changes.</p>
            <code-block :lang="'html'" :code="s_dynamic"></code-block>

            <h2>$refs</h2>
            <code-block :lang="'html'" :code="s_refs"></code-block>

            <h2>cv-model on components</h2>
            <code-block :lang="'js'" :code="s_model"></code-block>

            <h2>Other instance properties</h2>
            <table>
                <tr><th>Property</th><th>Description</th></tr>
                <tr><td><code>$el</code></td><td>Root DOM element</td></tr>
                <tr><td><code>$attrs</code></td><td>Non-prop, non-event attributes. Set <code>inheritAttrs: false</code> to opt out of auto-inheritance.</td></tr>
                <tr><td><code>$parent</code></td><td>Parent component's reactive state. Prefer props + emit when possible.</td></tr>
                <tr><td><code>$slots</code></td><td>Object with <code>true</code> for each provided slot name. Use for conditional slot rendering.</td></tr>
            </table>

            <div style="margin-top:2rem; display:flex; gap:12px;">
                <router-link to="/template" style="font-size:13px; color:#555;">← Template Syntax</router-link>
                <router-link to="/reactivity" style="font-size:13px; color:#111; font-weight:600;">Reactivity →</router-link>
            </div>
        </div>
    `},Ut={data:{s_computed:`{
    data: { price: 10, qty: 3 },
    computed: {
        total() { return this.price * this.qty; }
    },
    template: \`<p>Total: {{ total }}</p>\`
}`,s_computed_set:`computed: {
    fullName: {
        get() { return \`\${this.first} \${this.last}\`.trim(); },
        set(val) {
            const [f, ...rest] = val.split(' ');
            this.first = f ?? '';
            this.last  = rest.join(' ');
        }
    }
}`,s_watch:`watch: {
    // Simple watcher
    search(newVal, oldVal) {
        if (newVal) this.fetchResults(newVal);
    },

    // With options
    count: {
        immediate: true,   // run once on mount with current value
        handler(newVal, oldVal) {
            this.log.push(\`\${oldVal ?? 'init'} → \${newVal}\`);
        }
    },

    // Deep — detects nested mutations inside objects/arrays
    user: {
        deep: true,
        handler(newVal) { console.log('user changed:', newVal); }
    }
}`,s_watch_prog:`onMount() {
    // Returns an unsubscribe function
    const stop = this.$watch('count', (newVal, oldVal) => {
        console.log(oldVal, '→', newVal);
    }, { immediate: true });

    // Stop later:
    // stop();
}`,s_batch:`methods: {
    updateAll() {
        // One DOM flush instead of three
        this.$batch(() => {
            this.a++;
            this.b++;
            this.c = 'new';
        });
    }
}

// Named export — useful outside components
import { batchUpdate } from 'courvux';
batchUpdate(() => {
    store.counter.n = 10;
    store.user.role = 'admin';
});`,s_nexttick:`methods: {
    addItem() {
        this.items.push({ id: Date.now(), text: 'New' });
        // DOM not yet updated — wait for next flush
        this.$nextTick(() => {
            this.$refs.list.lastElementChild?.scrollIntoView();
        });
    },

    // Also returns a Promise
    async save() {
        this.saved = true;
        await this.$nextTick();
        console.log('DOM updated, badge is visible');
    }
}`,s_watcheffect:`onMount() {
    // Auto-tracked: re-runs when any accessed reactive key changes
    this.$watchEffect(() => {
        document.title = \`\${this.count} items — MyApp\`;
    });
    // Stopped automatically on component destroy
}`},template:`
        <div class="prose">
            <h1>Reactivity</h1>
            <p>Courvux uses Proxy-based reactivity. Every key in <code>data</code> is observable — reading it creates a subscription, writing it notifies subscribers.</p>

            <h2>Computed properties</h2>
            <p>Automatically recalculate when their dependencies change. Dependencies are detected by parsing <code>this.key</code> references in the getter source.</p>
            <code-block :lang="'js'" :code="s_computed"></code-block>

            <h3>Computed setter</h3>
            <code-block :lang="'js'" :code="s_computed_set"></code-block>

            <h2>Watchers</h2>
            <p>React to state changes. Receives <code>(newVal, oldVal)</code> with <code>this</code> bound to component state.</p>
            <code-block :lang="'js'" :code="s_watch"></code-block>

            <h3>Programmatic watcher — $watch</h3>
            <code-block :lang="'js'" :code="s_watch_prog"></code-block>

            <h2>$batch — group mutations</h2>
            <p>Multiple state changes inside <code>$batch</code> trigger only one DOM update cycle.</p>
            <code-block :lang="'js'" :code="s_batch"></code-block>

            <h2>$nextTick — after DOM update</h2>
            <p>Runs a callback after the next reactive flush. Also returns a <code>Promise</code>.</p>
            <code-block :lang="'js'" :code="s_nexttick"></code-block>

            <h2>$watchEffect — auto-tracked effect</h2>
            <p>Runs immediately and re-runs when any reactive key accessed inside it changes. Stopped automatically on component destroy.</p>
            <code-block :lang="'js'" :code="s_watcheffect"></code-block>

            <div style="margin-top:2rem; display:flex; gap:12px;">
                <router-link to="/components" style="font-size:13px; color:#555;">← Components</router-link>
                <router-link to="/lifecycle" style="font-size:13px; color:#111; font-weight:600;">Lifecycle →</router-link>
            </div>
        </div>
    `},Wt={data:{s1:`{
    data: { ticks: 0 },

    onBeforeMount() {
        // DOM not yet walked — no $el, no $refs
        console.log('before mount');
    },

    onMount() {
        // DOM ready — $el and $refs are available
        this._timer = setInterval(() => this.ticks++, 1000);
        console.log('root element:', this.$el.tagName);
    },

    onBeforeUnmount() {
        // Cleanup before destroy
        clearInterval(this._timer);
    },

    onDestroy() {
        console.log('component destroyed');
    }
}`,s2:`// keepAlive lifecycle
{
    onActivated() {
        // Restored from cache — re-subscribe to live data
        this.startPolling();
    },
    onDeactivated() {
        // Stored in cache — pause background work
        this.stopPolling();
    }
}`,s3:`// Error boundary — catches errors from descendant onMount
{
    data: { hasError: false, errorMsg: '' },
    onError(err) {
        this.hasError = true;
        this.errorMsg = err.message;
    },
    template: \`
        <p cv-if="hasError">Error: {{ errorMsg }}</p>
        <risky-widget cv-if="!hasError" />
    \`
}`},template:`
        <div class="prose">
            <h1>Lifecycle Hooks</h1>
            <p>All hooks have <code>this</code> bound to the reactive component state.</p>

            <table>
                <tr><th>Hook</th><th>When it fires</th></tr>
                <tr><td><code>onBeforeMount</code></td><td>Before the DOM walk begins — <code>$el</code> not yet set</td></tr>
                <tr><td><code>onMount</code></td><td>After mounting — DOM ready, <code>$el</code> and <code>$refs</code> available</td></tr>
                <tr><td><code>onBeforeUnmount</code></td><td>Before destroy — cleanup event listeners, timers here</td></tr>
                <tr><td><code>onDestroy</code></td><td>After the component is destroyed</td></tr>
                <tr><td><code>onActivated</code></td><td>When a <code>keepAlive</code> component is restored from cache</td></tr>
                <tr><td><code>onDeactivated</code></td><td>When a <code>keepAlive</code> component is stored in cache</td></tr>
                <tr><td><code>onError</code></td><td>Catches errors thrown by descendant <code>onMount</code> hooks</td></tr>
            </table>

            <h2>Example — timer with cleanup</h2>
            <code-block :lang="'js'" :code="s1"></code-block>

            <h2>keepAlive hooks</h2>
            <p>Set <code>keepAlive: true</code> on a route to cache the component's DOM and state between navigations.</p>
            <code-block :lang="'js'" :code="s2"></code-block>

            <h2>Error boundary — onError</h2>
            <p>An <code>onError</code> hook catches errors thrown by any descendant component's <code>onMount</code>. The error does not propagate further.</p>
            <code-block :lang="'js'" :code="s3"></code-block>

            <div class="callout">
                On the root <code>createApp</code> config, <code>onMount</code> fires after the first route is fully rendered — safe for third-party DOM libraries.
            </div>

            <div style="margin-top:2rem; display:flex; gap:12px;">
                <router-link to="/reactivity" style="font-size:13px; color:#555;">← Reactivity</router-link>
                <router-link to="/router" style="font-size:13px; color:#111; font-weight:600;">Router →</router-link>
            </div>
        </div>
    `},Bt={data:{s_setup:`import { createApp, createRouter } from 'courvux';

const router = createRouter([
    { path: '/',       component: HomeComp },
    { path: '/about',  component: AboutComp },
    { path: '/user/:id', component: UserComp },
    { path: '*',       component: NotFoundComp }   // catch-all
], {
    mode: 'hash',          // 'hash' (default) | 'history'
    transition: 'fade',    // global page transition
    beforeEach(to, next) {
        if (!isLoggedIn() && to.path !== '/login') next('/login');
        else next();
    },
    scrollBehavior(_to, _from) { return { x: 0, y: 0 }; }
});

createApp({
    router,
    template: \`
        <nav>
            <router-link to="/">Home</router-link>
            <router-link to="/about">About</router-link>
        </nav>
        <router-view />
    \`
}).mount('#app');`,s_route:`// Route options
{
    path: '/dashboard',
    component: DashboardComp,       // single view
    components: { default: Main, panel: Sidebar }, // named views
    redirect: '/home',              // static redirect
    redirect: (route) => \`/new/\${route.params.id}\`, // dynamic
    layout: \`<aside>{{ $store.user }}</aside><router-view />\`,
    transition: 'slide-up',         // per-route override
    keepAlive: true,                // cache DOM + state
    meta: { requiresAuth: true },
    loadingTemplate: '<p>Loading...</p>',
    beforeEnter(to, next) { next(); },  // per-route guard
    children: [...]
}`,s_params:`// Route definition
{ path: '/user/:id', component: UserComp }

// In UserComp template
<p>ID: {{ $route.params.id }}</p>
<p>Query: {{ $route.query.tab }}</p>
<p>Meta: {{ $route.meta.section }}</p>`,s_lazy:`// Dynamic import — loaded on first visit
{ path: '/dashboard', component: () => import('./dashboard.js') }

// dashboard.js
export default {
    template: \`<h1>Dashboard</h1>\`,
    data: { /* ... */ }
};

// With Vite and .html templates
import template from './dashboard.html?raw';
export default { template, data: {} };`,s_navigate:`// Programmatic navigation
methods: {
    goHome()         { this.$router.navigate('/'); },
    goToUser(id)     { this.$router.navigate(\`/user/\${id}\`); },
    goBack()         { this.$router.back(); },
    search(term) {
        this.$router.navigate('/results', { query: { q: term } });
    },
    redirect(path) {
        this.$router.replace(path);  // no history entry
    }
}`,s_nested:`{
    path: '/panel',
    component: {
        template: \`
            <nav>
                <router-link to="/panel/stats">Stats</router-link>
                <router-link to="/panel/config">Config</router-link>
            </nav>
            <router-view />   <!-- child renders here -->
        \`
    },
    children: [
        { path: '/stats',  component: StatsComp },
        { path: '/config', component: ConfigComp }
    ]
}`},template:`
        <div class="prose">
            <h1>Router</h1>
            <p>Client-side routing with hash or history mode, transitions, guards, lazy loading, and nested routes.</p>

            <h2>Setup</h2>
            <code-block :lang="'js'" :code="s_setup"></code-block>

            <h2>Route options</h2>
            <code-block :lang="'js'" :code="s_route"></code-block>

            <h2>Dynamic params & $route</h2>
            <code-block :lang="'js'" :code="s_params"></code-block>
            <table>
                <tr><th>Property</th><th>Description</th></tr>
                <tr><td><code>$route.path</code></td><td>Current pathname, e.g. <code>/user/42</code></td></tr>
                <tr><td><code>$route.params</code></td><td>Path params — <code>{ id: '42' }</code></td></tr>
                <tr><td><code>$route.query</code></td><td>Query string as object — <code>{ page: '2' }</code></td></tr>
                <tr><td><code>$route.meta</code></td><td>Route-level metadata object</td></tr>
            </table>

            <h2>Lazy loading</h2>
            <code-block :lang="'js'" :code="s_lazy"></code-block>

            <h2>Programmatic navigation — $router</h2>
            <code-block :lang="'js'" :code="s_navigate"></code-block>

            <h2>Nested routes</h2>
            <p>The parent component must contain a <code>&lt;router-view /&gt;</code>. Child paths are relative to the parent.</p>
            <code-block :lang="'js'" :code="s_nested"></code-block>

            <div style="margin-top:2rem; display:flex; gap:12px;">
                <router-link to="/lifecycle" style="font-size:13px; color:#555;">← Lifecycle</router-link>
                <router-link to="/store" style="font-size:13px; color:#111; font-weight:600;">Store →</router-link>
            </div>
        </div>
    `},qt={data:{s1:`import { createStore } from 'courvux';

const store = createStore({
    state: { user: 'guest', count: 0 },
    actions: {
        setUser(name) { this.user = name; },
        increment()   { this.count++; },
        reset()       { this.count = 0; }
    }
});

createApp({ store, template: '...' }).mount('#app');`,s2:`<!-- Access in any template -->
<p>{{ $store.user }}</p>
<p>{{ $store.count }}</p>

<!-- Two-way binding directly on store -->
<input cv-model="$store.user" />

<!-- Call actions -->
<button @click="$store.increment()">+</button>
<button @click="$store.setUser('Alice')">Login</button>`,s3:`const store = createStore({
    state: { theme: 'light' },
    actions: {
        toggleTheme() {
            this.theme = this.theme === 'light' ? 'dark' : 'light';
        }
    },
    modules: {
        counter: {
            state: { n: 0 },
            actions: {
                inc()   { this.n++; },
                dec()   { this.n--; },
                reset() { this.n = 0; }
            }
        },
        user: {
            state: { name: 'guest', role: 'viewer' },
            actions: {
                login(name, role) { this.name = name; this.role = role; }
            }
        }
    }
});`,s4:`<!-- Module state and actions -->
<p>Count: {{ $store.counter.n }}</p>
<p>Role:  {{ $store.user.role }}</p>

<button @click="$store.counter.inc()">+</button>
<button @click="$store.user.login('Alice', 'admin')">Login</button>`,s5:`// Named export — use outside components
import { batchUpdate } from 'courvux';

batchUpdate(() => {
    store.counter.n  = 0;
    store.user.role  = 'viewer';
});`,s6:`// Provide / Inject — pass data deep without threading props

// Root app
createApp({
    provide: {
        theme: 'dark',
        apiUrl: 'https://api.example.com'
    }
})

// Or as a function for reactive values
{
    provide() {
        return { currentUser: this.user };
    }
}

// Any descendant
{ inject: ['theme', 'apiUrl'] }

// Object form — rename on injection
{ inject: { localTheme: 'theme', endpoint: 'apiUrl' } }`},template:`
        <div class="prose">
            <h1>Store</h1>
            <p>A global reactive state container. Access via <code>$store</code> in any template or component.</p>

            <h2>createStore</h2>
            <code-block :lang="'js'" :code="s1"></code-block>

            <h2>Accessing store in templates</h2>
            <code-block :lang="'html'" :code="s2"></code-block>

            <h2>Store modules</h2>
            <p>Organize into namespaced sub-stores. Each module is a full standalone store. State and action names in each module must be distinct.</p>
            <code-block :lang="'js'" :code="s3"></code-block>
            <code-block :lang="'html'" :code="s4"></code-block>

            <h2>batchUpdate — bulk mutations</h2>
            <code-block :lang="'js'" :code="s5"></code-block>

            <h2>Provide / Inject</h2>
            <p>Alternative to the store for passing values deep into the tree without threading props through every level.</p>
            <code-block :lang="'js'" :code="s6"></code-block>

            <div style="margin-top:2rem; display:flex; gap:12px;">
                <router-link to="/router" style="font-size:13px; color:#555;">← Router</router-link>
                <router-link to="/advanced" style="font-size:13px; color:#111; font-weight:600;">Advanced →</router-link>
            </div>
        </div>
    `},Vt={data:{s_dir:`// Full definition
app.directive('focus', {
    onMount(el, binding) { el.focus(); },
    onUpdate(el, binding) { /* reactive update */ },
    onDestroy(el, binding) { /* cleanup */ }
});

// Shorthand — mount only
app.directive('highlight', (el, binding) => {
    el.style.background = binding.value ?? 'yellow';
});

// Per-component directives
{
    directives: {
        tooltip: { onMount(el, b) { ... }, onDestroy(el) { ... } }
    }
}`,s_dir_use:`<!-- Plain -->
<input cv-focus />

<!-- With value (reactive) -->
<p cv-highlight="activeColor">Text</p>

<!-- With argument and modifiers -->
<div cv-pin:top.once="offset"></div>`,s_transition:`<!-- Bare cv-transition — fade (built-in) -->
<div cv-show="open" cv-transition>Panel</div>

<!-- Fade + scale -->
<div cv-show="open" cv-transition.scale>Panel</div>

<!-- Scale origin + duration -->
<div cv-show="open" cv-transition.scale.90.duration.400>Panel</div>

<!-- Class-based (Alpine-compatible) — any CSS framework -->
<div
    cv-show="open"
    cv-transition:enter="transition ease-out duration-300"
    cv-transition:enter-start="opacity-0 scale-95"
    cv-transition:enter-end="opacity-100 scale-100"
    cv-transition:leave="transition ease-in duration-200"
    cv-transition:leave-start="opacity-100 scale-100"
    cv-transition:leave-end="opacity-0 scale-95"
>Panel</div>

<!-- <cv-transition> component (built-in named animations) -->
<cv-transition name="fade" :show="open">
    <div>Animated content</div>
</cv-transition>`,s_intersect:`<!-- Fire when element enters viewport -->
<div cv-intersect="loadMore()">...</div>

<!-- Separate enter / leave handlers -->
<div
    cv-intersect:enter="onEnter()"
    cv-intersect:leave="onLeave()"
>...</div>

<!-- Modifiers -->
<div cv-intersect.once="trackImpression()">...</div>
<div cv-intersect.half="handler()">...</div>     <!-- 50% visible -->
<div cv-intersect.threshold-75="handler()">...</div>
<div cv-intersect.margin-200="prefetch()">...</div>`,s_plugins:`const analyticsPlugin = {
    install(app) {
        if (app.router) {
            const prev = app.router.afterEach;
            app.router.afterEach = (to, from) => {
                prev?.(to, from);
                analytics.track(to.path);
            };
        }
    }
};

createApp(config)
    .use(analyticsPlugin)
    .mount('#app');`,s_magic:`// Register a global $name property available in every component
createApp(config)
    .magic('fmt', () => ({
        currency: (val) => new Intl.NumberFormat('en-US', {
            style: 'currency', currency: 'USD'
        }).format(val),
        date: (val) => new Date(val).toLocaleDateString(),
    }))
    .magic('http', () => axios)
    .mount('#app');

// In any template:
// <p>{{ $fmt.currency(price) }}</p>
// <button @click="$http.post('/api/save', data)">Save</button>`,s_autoinit:`import { autoInit } from 'courvux';

// Scans [cv-data] elements on DOMContentLoaded
autoInit({
    components: { dropdown: DropdownDef },
    directives: { tooltip: myDirective },
    globalProperties: { appName: 'My Site' }
});`},template:`
        <div class="prose">
            <h1>Advanced</h1>

            <h2>Custom Directives</h2>
            <p>Register globally via <code>app.directive()</code> or per-component via <code>directives</code>.</p>
            <code-block :lang="'js'" :code="s_dir"></code-block>
            <code-block :lang="'html'" :code="s_dir_use"></code-block>
            <table>
                <tr><th>Binding property</th><th>Description</th></tr>
                <tr><td><code>value</code></td><td>Evaluated expression (reactive in <code>onUpdate</code>)</td></tr>
                <tr><td><code>arg</code></td><td>Argument after <code>:</code> — <code>cv-pin:top</code> → <code>'top'</code></td></tr>
                <tr><td><code>modifiers</code></td><td>Flags — <code>cv-pin.once</code> → <code>{ once: true }</code></td></tr>
            </table>

            <h2>Transitions — cv-transition</h2>
            <p>Animate elements entering and leaving. Works on any element with <code>cv-show</code>.</p>
            <code-block :lang="'html'" :code="s_transition"></code-block>

            <h2>cv-intersect — Intersection Observer</h2>
            <code-block :lang="'html'" :code="s_intersect"></code-block>

            <h2>Plugin System</h2>
            <p>A plugin is an object with an <code>install(app)</code> method. Install before mounting. Duplicate installs are silently ignored.</p>
            <code-block :lang="'js'" :code="s_plugins"></code-block>

            <h2>app.magic() — global properties</h2>
            <p>Register a <code>$name</code> property available in every component template.</p>
            <code-block :lang="'js'" :code="s_magic"></code-block>

            <h2>autoInit()</h2>
            <p>Initialize <code>cv-data</code> elements automatically — no <code>createApp()</code> required. Ideal for server-rendered HTML.</p>
            <code-block :lang="'js'" :code="s_autoinit"></code-block>

            <div style="margin-top:2rem; display:flex; gap:12px;">
                <router-link to="/store" style="font-size:13px; color:#555;">← Store</router-link>
                <router-link to="/demo" style="font-size:13px; color:#111; font-weight:600;">TODO Demo →</router-link>
            </div>
        </div>
    `},at="courvux-demo-todos",Gt=`const STORAGE_KEY = 'courvux-demo-todos';

export default {
  data: {
    todos: JSON.parse(localStorage.getItem(STORAGE_KEY)) || [],
    newTodo: '',
    filter: 'all',   // 'all' | 'active' | 'completed'
    editingId: null,
    editText: '',
    _nextId: Date.now(),
  },
  computed: {
    filteredTodos() {
      if (this.filter === 'active')    return this.todos.filter(t => !t.done);
      if (this.filter === 'completed') return this.todos.filter(t => t.done);
      return this.todos;
    },
    remaining() { return this.todos.filter(t => !t.done).length; },
    allDone()   { return this.todos.length > 0 && this.todos.every(t => t.done); },
  },
  watch: {
    todos: { deep: true, handler(val) { localStorage.setItem(STORAGE_KEY, JSON.stringify(val)); } }
  },
  methods: {
    add() {
      const text = this.newTodo.trim();
      if (!text) return;
      this.todos = [...this.todos, { id: this._nextId++, text, done: false }];
      this.newTodo = '';
    },
    toggle(id)   { this.todos = this.todos.map(t => t.id === id ? { ...t, done: !t.done } : t); },
    remove(id)   { this.todos = this.todos.filter(t => t.id !== id); },
    toggleAll()  { const d = this.allDone; this.todos = this.todos.map(t => ({ ...t, done: !d })); },
    clearCompleted() { this.todos = this.todos.filter(t => !t.done); },
    startEdit(todo) {
      this.editingId = todo.id;
      this.editText  = todo.text;
      this.$nextTick(() => this.$refs['edit_' + todo.id]?.focus());
    },
    commitEdit(id) {
      const text = this.editText.trim();
      if (text) this.todos = this.todos.map(t => t.id === id ? { ...t, text } : t);
      else      this.remove(id);
      this.editingId = null;
      this.editText  = '';
    },
    cancelEdit() { this.editingId = null; this.editText = ''; },
    setFilter(f) { this.filter = f; },
  },
  template: \`...\`,   // see HTML tab
};`,Yt=`<!-- Input -->
<input cv-model.trim="newTodo" @keydown.enter="add()"
       placeholder="What needs to be done?" />
<button @click="add()">Add</button>

<!-- Bulk toggle + counter -->
<input type="checkbox" :checked="allDone" @change="toggleAll()" />
<span>{{ remaining }} item{{ remaining === 1 ? '' : 's' }} left</span>

<!-- List -->
<div cv-for="todo in filteredTodos" :key="todo.id"
     :class="{ done: todo.done }">

  <!-- view mode -->
  <div cv-if="editingId !== todo.id">
    <input type="checkbox" :checked="todo.done" @change="toggle(todo.id)" />
    <label @dblclick="startEdit(todo)">{{ todo.text }}</label>
    <button @click="remove(todo.id)">×</button>
  </div>

  <!-- edit mode -->
  <input cv-if="editingId === todo.id"
         :cv-ref="'edit_' + todo.id"
         cv-model="editText"
         @keydown.enter="commitEdit(todo.id)"
         @keydown.esc="cancelEdit()"
         @blur="commitEdit(todo.id)" />
</div>

<!-- Filters -->
<button :class="{ active: filter === 'all' }"       @click="setFilter('all')">All</button>
<button :class="{ active: filter === 'active' }"    @click="setFilter('active')">Active</button>
<button :class="{ active: filter === 'completed' }" @click="setFilter('completed')">Completed</button>
<button cv-show="todos.some(t => t.done)" @click="clearCompleted()">Clear completed</button>`;function Zt(){try{return JSON.parse(localStorage.getItem(at))||[]}catch{return[]}}function Xt(n){localStorage.setItem(at,JSON.stringify(n))}const Jt={data:{todos:Zt(),newTodo:"",filter:"all",editingId:null,editText:"",_nextId:Date.now(),srcJs:Gt,srcHtml:Yt,srcTab:"js"},computed:{filteredTodos(){return this.filter==="active"?this.todos.filter(n=>!n.done):this.filter==="completed"?this.todos.filter(n=>n.done):this.todos},remaining(){return this.todos.filter(n=>!n.done).length},allDone(){return this.todos.length>0&&this.todos.every(n=>n.done)}},watch:{todos:{deep:!0,handler(n){Xt(n)}}},methods:{add(){const n=this.newTodo.trim();n&&(this.todos=[...this.todos,{id:this._nextId++,text:n,done:!1}],this.newTodo="")},toggle(n){this.todos=this.todos.map(e=>e.id===n?{...e,done:!e.done}:e)},remove(n){this.todos=this.todos.filter(e=>e.id!==n)},clearCompleted(){this.todos=this.todos.filter(n=>!n.done)},toggleAll(){const n=this.allDone;this.todos=this.todos.map(e=>({...e,done:!n}))},startEdit(n){this.editingId=n.id,this.editText=n.text,this.$nextTick(()=>{var e;return(e=this.$refs["edit_"+n.id])==null?void 0:e.focus()})},commitEdit(n){const e=this.editText.trim();e?this.todos=this.todos.map(t=>t.id===n?{...t,text:e}:t):this.remove(n),this.editingId=null,this.editText=""},cancelEdit(){this.editingId=null,this.editText=""},setFilter(n){this.filter=n}},template:`
        <div style="max-width: 600px;">
            <!-- Header -->
            <div style="margin-bottom: 2rem;">
                <h1 style="font-size:1.6rem; font-weight:700; margin:0 0 6px;">TODO Demo</h1>
                <p style="font-size:13px; color:#666; margin:0;">
                    Powered by Courvux — reactivity, computed, watchers, and localStorage persistence.
                </p>
            </div>

            <!-- Input -->
            <div style="display:flex; gap:8px; margin-bottom:16px;">
                <input
                    cv-model.trim="newTodo"
                    @keydown.enter="add()"
                    placeholder="What needs to be done?"
                    style="flex:1; padding:10px 14px; border:1px solid #ddd; border-radius:6px; font-family:inherit; font-size:13px; outline:none;"
                    @focus="$event.target.style.borderColor='#111'"
                    @blur="$event.target.style.borderColor='#ddd'"
                />
                <button
                    @click="add()"
                    style="padding:10px 18px; background:#111; color:#fff; border:none; border-radius:6px; font-family:inherit; font-size:13px; cursor:pointer;"
                >Add</button>
            </div>

            <!-- Bulk actions row -->
            <div cv-if="todos.length > 0"
                 style="display:flex; align-items:center; justify-content:space-between; margin-bottom:4px; padding:0 4px;">
                <label style="display:flex; align-items:center; gap:6px; font-size:12px; color:#666; cursor:pointer;">
                    <input type="checkbox" :checked="allDone" @change="toggleAll()" />
                    Mark all done
                </label>
                <span style="font-size:12px; color:#999;">
                    {{ remaining }} item{{ remaining === 1 ? '' : 's' }} left
                </span>
            </div>

            <!-- List -->
            <div style="border:1px solid #e8e8e8; border-radius:8px; background:#fff; overflow:hidden; margin-bottom:12px;">
                <div cv-if="filteredTodos.length === 0"
                     style="padding:24px; text-align:center; color:#bbb; font-size:13px;">
                    {{ filter === 'completed' ? 'No completed tasks.' : filter === 'active' ? 'All done!' : 'Add a task above.' }}
                </div>

                <div cv-for="todo in filteredTodos" :key="todo.id"
                     class="todo-item"
                     :class="{ done: todo.done }">

                    <!-- View mode -->
                    <div cv-if="editingId !== todo.id"
                         style="display:flex; align-items:center; gap:10px; flex:1; min-width:0;">
                        <input type="checkbox"
                               :checked="todo.done"
                               @change="toggle(todo.id)"
                               style="flex-shrink:0; width:16px; height:16px; cursor:pointer;" />
                        <label
                            @dblclick="startEdit(todo)"
                            style="flex:1; font-size:13px; cursor:text; user-select:none; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;"
                            :title="'Double-click to edit'"
                        >{{ todo.text }}</label>
                        <button
                            @click="remove(todo.id)"
                            style="flex-shrink:0; background:none; border:none; color:#ccc; font-size:16px; cursor:pointer; padding:0 4px; line-height:1;"
                            @mouseover="$event.target.style.color='#111'"
                            @mouseout="$event.target.style.color='#ccc'"
                        >×</button>
                    </div>

                    <!-- Edit mode -->
                    <div cv-if="editingId === todo.id" style="flex:1;">
                        <input
                            :cv-ref="'edit_' + todo.id"
                            cv-model="editText"
                            @keydown.enter="commitEdit(todo.id)"
                            @keydown.esc="cancelEdit()"
                            @blur="commitEdit(todo.id)"
                            style="width:100%; box-sizing:border-box; padding:4px 8px; border:1px solid #111; border-radius:4px; font-family:inherit; font-size:13px; outline:none;"
                        />
                    </div>
                </div>
            </div>

            <!-- Filter + clear row -->
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
                <div style="display:flex; gap:4px;">
                    <button class="filter-btn" :class="{ active: filter === 'all' }"       @click="setFilter('all')">All</button>
                    <button class="filter-btn" :class="{ active: filter === 'active' }"    @click="setFilter('active')">Active</button>
                    <button class="filter-btn" :class="{ active: filter === 'completed' }" @click="setFilter('completed')">Completed</button>
                </div>
                <button
                    cv-show="todos.some(t => t.done)"
                    @click="clearCompleted()"
                    style="background:none; border:none; font-size:12px; color:#999; cursor:pointer; font-family:inherit; padding:4px 8px;"
                    @mouseover="$event.target.style.color='#111'"
                    @mouseout="$event.target.style.color='#999'"
                >Clear completed</button>
            </div>

            <!-- Persistence note -->
            <p style="margin-top:20px; font-size:11px; color:#bbb; text-align:center;">
                Tasks are saved to <code style="font-size:10px;">localStorage</code> automatically. Reload the page — they persist.
            </p>

            <!-- Source code -->
            <div style="margin-top:2.5rem;">
                <h2 style="font-size:1rem; font-weight:600; color:#111; margin:0 0 1rem; padding-bottom:0.4rem; border-bottom:1px solid #e8e8e8;">
                    Source Code
                </h2>
                <p style="font-size:13px; color:#666; margin:0 0 1rem;">
                    The full implementation — reactivity, computed, deep watcher, inline editing, and localStorage in one file.
                </p>

                <!-- Tab switcher -->
                <div style="display:flex; gap:4px; margin-bottom:-1px; position:relative; z-index:1;">
                    <button
                        :class="srcTab === 'js' ? 'src-tab active' : 'src-tab'"
                        @click="srcTab = 'js'"
                    >JavaScript</button>
                    <button
                        :class="srcTab === 'html' ? 'src-tab active' : 'src-tab'"
                        @click="srcTab = 'html'"
                    >Template</button>
                </div>

                <div cv-show="srcTab === 'js'">
                    <code-block :lang="'js'" :code="srcJs"></code-block>
                </div>
                <div cv-show="srcTab === 'html'">
                    <code-block :lang="'html'" :code="srcHtml"></code-block>
                </div>
            </div>
        </div>
    `},Kt=xt([{path:"/",component:Rt},{path:"/installation",component:Mt},{path:"/quick-start",component:zt},{path:"/template",component:Nt},{path:"/components",component:Ht},{path:"/reactivity",component:Ut},{path:"/lifecycle",component:Wt},{path:"/router",component:Bt},{path:"/store",component:qt},{path:"/advanced",component:Vt},{path:"/demo",component:Jt},{path:"*",component:{template:`
                <div style="text-align:center; padding:4rem 0;">
                    <p style="font-size:3rem; margin-bottom:1rem;">404</p>
                    <p style="color:#666; font-size:14px; margin-bottom:1.5rem;">Page not found.</p>
                    <router-link to="/" style="font-size:13px; color:#111;">← Back to home</router-link>
                </div>
            `}}],{mode:"hash"}),Ke=[{key:"start",label:"Getting Started",items:[{to:"/",label:"Introduction"},{to:"/installation",label:"Installation"},{to:"/quick-start",label:"Quick Start"}]},{key:"template",label:"Template Syntax",items:[{to:"/template",label:"Directives & Bindings"}]},{key:"components",label:"Components",items:[{to:"/components",label:"Components"},{to:"/reactivity",label:"Reactivity"},{to:"/lifecycle",label:"Lifecycle"}]},{key:"router",label:"Router & Store",items:[{to:"/router",label:"Router"},{to:"/store",label:"Store"}]},{key:"advanced",label:"Advanced",items:[{to:"/advanced",label:"Directives & Plugins"}]},{key:"demo",label:"Demo",items:[{to:"/demo",label:"⚡ TODO App"}]}];_t({router:Kt,components:{"code-block":It},data:{nav:Ke,open:Ke.reduce((n,e)=>(n[e.key]=!0,n),{})},methods:{toggle(n){this.open={...this.open,[n]:!this.open[n]}}},template:`
        <div style="display:flex; min-height:100vh;">

            <!-- ── Sidebar ──────────────────────────────────────── -->
            <aside style="
                width: 240px;
                min-width: 240px;
                background: #fff;
                border-right: 1px solid #e8e8e8;
                display: flex;
                flex-direction: column;
                height: 100vh;
                position: sticky;
                top: 0;
                overflow-y: auto;
            ">
                <!-- Logo -->
                <div style="padding: 20px 16px 12px; border-bottom: 1px solid #f0f0f0;">
                    <router-link to="/" style="text-decoration:none; display:flex; align-items:center; gap:8px;">
                        <span style="font-size:1.3rem;">⚡</span>
                        <span style="font-weight:700; font-size:15px; color:#111;">Courvux</span>
                        <span style="font-size:10px; color:#999; margin-left:2px;">v0.2.0</span>
                    </router-link>
                </div>

                <!-- Accordion nav -->
                <nav style="flex:1; padding: 12px 8px;">
                    <div cv-for="section in nav" :key="section.key" style="margin-bottom:4px;">
                        <!-- Section header -->
                        <button
                            @click="toggle(section.key)"
                            style="
                                width:100%; display:flex; align-items:center; justify-content:space-between;
                                padding:6px 8px; background:none; border:none; cursor:pointer;
                                font-family:inherit; font-size:11px; font-weight:600;
                                text-transform:uppercase; letter-spacing:.06em; color:#999;
                                border-radius:4px;
                            "
                            @mouseover="$event.currentTarget.style.color='#111'"
                            @mouseout="$event.currentTarget.style.color='#999'"
                        >
                            <span>{{ section.label }}</span>
                            <span style="font-size:10px; transition:transform .15s;"
                                  :style="open[section.key] ? 'transform:rotate(90deg)' : 'transform:rotate(0deg)'">▶</span>
                        </button>

                        <!-- Section items -->
                        <div cv-show="open[section.key]" style="padding-left:4px; margin-top:2px;">
                            <router-link
                                cv-for="item in section.items"
                                :key="item.to"
                                :to="item.to"
                                class="nav-link"
                            >{{ item.label }}</router-link>
                        </div>
                    </div>
                </nav>

                <!-- Footer -->
                <div style="padding: 14px 16px; border-top: 1px solid #f0f0f0; font-size:11px; color:#aaa; line-height:1.6;">
                    <div style="margin-bottom:8px;">
                        <span style="font-weight:600; color:#555;">Vanjex</span>
                        <span> · MIT License</span>
                    </div>
                    <div style="display:flex; flex-direction:column; gap:4px;">
                        <a href="https://github.com/vanjexdev/courvux"
                           target="_blank"
                           style="color:#888; text-decoration:none; display:flex; align-items:center; gap:4px;"
                           @mouseover="$event.target.style.color='#111'"
                           @mouseout="$event.target.style.color='#888'"
                        >⬡ GitHub</a>
                        <a href="https://github.com/vanjexdev/courvux/issues"
                           target="_blank"
                           style="color:#888; text-decoration:none;"
                           @mouseover="$event.target.style.color='#111'"
                           @mouseout="$event.target.style.color='#888'"
                        >⬡ Issues / Support</a>
                        <a href="https://github.com/sponsors/vanjexdev"
                           target="_blank"
                           style="color:#888; text-decoration:none;"
                           @mouseover="$event.target.style.color='#111'"
                           @mouseout="$event.target.style.color='#888'"
                        >♥ Sponsor</a>
                    </div>
                </div>
            </aside>

            <!-- ── Content ───────────────────────────────────────── -->
            <main style="flex:1; overflow-y:auto; min-height:100vh;">
                <div style="max-width:780px; margin:0 auto; padding:2.5rem 2rem 4rem;">
                    <router-view />
                </div>
            </main>
        </div>
    `}).mount("#app");
