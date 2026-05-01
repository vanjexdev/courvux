(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))c(l);new MutationObserver(l=>{for(const y of l)if(y.type==="childList")for(const E of y.addedNodes)E.tagName==="LINK"&&E.rel==="modulepreload"&&c(E)}).observe(document,{childList:!0,subtree:!0});function n(l){const y={};return l.integrity&&(y.integrity=l.integrity),l.referrerPolicy&&(y.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?y.credentials="include":l.crossOrigin==="anonymous"?y.credentials="omit":y.credentials="same-origin",y}function c(l){if(l.ep)return;l.ep=!0;const y=n(l);fetch(l.href,y)}})();var gt=new Set(["push","pop","shift","unshift","splice","sort","reverse"]),at=t=>t instanceof Date||t instanceof RegExp||t instanceof Map||t instanceof Set||t instanceof WeakMap||t instanceof WeakSet||ArrayBuffer.isView(t)||t instanceof ArrayBuffer,Le=new WeakSet,ke=Symbol("raw"),Fe=t=>t===null||typeof t!="object"?t:t[ke]??t,we=0,je=new Map,fe=null;function Ie(t){const e=[],n=fe;fe=e;try{t()}finally{fe=n}return e}function bt(t){we++;try{t()}finally{if(we--,we===0){const e=[...je.values()];je.clear(),e.forEach(n=>n())}}}function it(t,e){return t===null||typeof t!="object"||Le.has(t)||at(t)?t:new Proxy(t,{get(n,c){if(c===ke)return n[ke]??n;if(typeof c=="string"&&Array.isArray(n)&&gt.has(c))return(...y)=>{const E=Array.prototype[c].apply(n,y);return e(),E};const l=n[c];return l!==null&&typeof l=="object"&&!Le.has(l)?it(l,e):l},set(n,c,l){return n[c]=l,e(),!0}})}function De(){const t={},e=Math.random().toString(36).slice(2),n=(y,E)=>(t[y]||(t[y]=new Set),t[y].add(E),()=>{var k;(k=t[y])==null||k.delete(E)}),c=y=>{we>0?je.set(`${e}:${y}`,()=>{(t[y]?[...t[y]]:[]).forEach(E=>E())}):(t[y]?[...t[y]]:[]).forEach(E=>E())},l={};return{subscribe:n,createReactiveState:y=>new Proxy(y,{get(E,k){if(k===ke)return y;typeof k=="string"&&!k.startsWith("$")&&fe&&fe.push({sub:n,key:k});const P=E[k];return typeof k=="string"&&!k.startsWith("$")&&P!==null&&typeof P=="object"&&!Le.has(P)&&!at(P)?it(P,()=>c(k)):P},set(E,k,P){if(l[k])return l[k](P),!0;const F=E[k];return E[k]=P,(F!==P||P!==null&&typeof P=="object")&&c(k),!0}}),registerSetInterceptor:(y,E)=>{l[y]=E},notifyAll:()=>{Object.keys(t).forEach(y=>c(y))}}}var _e=new WeakMap;function ve(t,e,n){var l,y;const c=e.indexOf(".");if(c>=0){const E=e.slice(0,c),k=e.slice(c+1),P=t[E];return P&&_e.has(P)?ve(P,k,n):((l=_e.get(t))==null?void 0:l(E,n))??(()=>{})}return((y=_e.get(t))==null?void 0:y(e,n))??(()=>{})}var st=(t,e)=>t.split(".").reduce((n,c)=>n==null?void 0:n[c],e),ct=(()=>{try{return new Function("return 1")(),!0}catch{return console.warn("[courvux] CSP blocks eval. Expressions limited to property access and literals."),!1}})(),Me=new Map,Re=new Map,lt=(t,e)=>{const n=t.trim();if(n==="true")return!0;if(n==="false")return!1;if(n==="null")return null;if(n!=="undefined")return/^-?\d+(\.\d+)?$/.test(n)?parseFloat(n):/^(['"`])(.*)\1$/s.test(n)?n.slice(1,-1):n.startsWith("!")?!lt(n.slice(1).trim(),e):st(n,e)},H=(t,e)=>{if(!ct)return lt(t,e);try{let n=Me.get(t);return n||(n=new Function("$data",`with($data) { return (${t}) }`),Me.set(t,n)),n(e)}catch{return st(t,e)}},ue=(t,e,n)=>t.startsWith("$store.")&&e.store?e.storeSubscribeOverride?e.storeSubscribeOverride(e.store,t.slice(7),n):ve(e.store,t.slice(7),n):e.subscribe(t,n),J=(t,e,n)=>{const c=new Set(["true","false","null","undefined","in","of","typeof","instanceof"]),l=t.match(/\$?[a-zA-Z_][\w$]*(?:\.\$?[a-zA-Z_][\w$]*)*/g)??[],y=[...new Set(l.filter(k=>!c.has(k.split(".")[0])))];if(y.length===0)return()=>{};const E=y.map(k=>ue(k,e,n));return()=>E.forEach(k=>k())},le=(t,e,n)=>{const c=t.split(".");if(c.length===1)e[c[0]]=n;else{const l=c.slice(0,-1).reduce((y,E)=>y==null?void 0:y[E],e);l&&(l[c[c.length-1]]=n)}},ze=(t,e,n,c,l)=>{const y={};return Object.keys(t).forEach(E=>y[E]=t[E]),y[n]=e,l&&(y[l]=c),y},Pe=t=>t?typeof t=="string"?t:Array.isArray(t)?t.map(Pe).filter(Boolean).join(" "):typeof t=="object"?Object.entries(t).filter(([,e])=>!!e).map(([e])=>e).join(" "):"":"",Ne=(t,e,n)=>{if(!e){t.style.cssText=n;return}typeof e=="string"?t.style.cssText=n?`${n};${e}`:e:typeof e=="object"&&(n&&(t.style.cssText=n),Object.entries(e).forEach(([c,l])=>{t.style[c]=l??""}))},He=(t,e,n)=>{if(ct)try{let c=Re.get(t);c||(c=new Function("__p__",`with(__p__){${t}}`),Re.set(t,c));const l=new Proxy({},{has:()=>!0,get:(y,E)=>E==="$event"?n:E in e?e[E]:globalThis[E],set:(y,E,k)=>(e[E]=k,!0)});c(l)}catch(c){console.warn(`[courvux] handler error "${t}":`,c)}},ie=t=>{const e=getComputedStyle(t),n=Math.max(parseFloat(e.animationDuration)||0,parseFloat(e.transitionDuration)||0)*1e3;return n<=0?Promise.resolve():new Promise(c=>{const l=()=>c();t.addEventListener("animationend",l,{once:!0}),t.addEventListener("transitionend",l,{once:!0}),setTimeout(l,n+50)})},yt=`
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
`,Ue=!1;function We(){if(Ue||typeof document>"u")return;Ue=!0;const t=document.createElement("style");t.id="cv-transitions-el",t.textContent=yt,document.head.appendChild(t)}var Be=!1;function wt(){if(Be||typeof document>"u")return;Be=!0;const t=document.createElement("style");t.id="cv-cloak-style",t.textContent="[cv-cloak]{display:none!important}",document.head.appendChild(t)}function xt(t){if(typeof window<"u"&&"Sanitizer"in window){const n=document.createElement("div");return n.setHTML(t,{sanitizer:new window.Sanitizer}),n.innerHTML}const e=new DOMParser().parseFromString(t,"text/html");return e.querySelectorAll("script,iframe,object,embed,form,meta,link,style").forEach(n=>n.remove()),e.querySelectorAll("*").forEach(n=>{Array.from(n.attributes).forEach(c=>{(c.name.startsWith("on")||c.value.trim().toLowerCase().startsWith("javascript:"))&&n.removeAttribute(c.name)})}),e.body.innerHTML}async function te(t,e,n){var y,E,k,P,F,x,V,j,N,R,_,D,$,d,a,v,S;const c=Array.from(t.childNodes);let l=0;for(;l<c.length;){const A=c[l];if(A.nodeType===3){const i=A.textContent||"",r=i.match(/\{\{([\s\S]+?)\}\}/g);if(r){const s=i,u=()=>{let m=s;r.forEach(p=>{const b=p.replace(/^\{\{\s*/,"").replace(/\s*\}\}$/,"");m=m.replace(p,H(b,e)??"")}),A.textContent=m};r.forEach(m=>{J(m.replace(/^\{\{\s*/,"").replace(/\s*\}\}$/,""),n,u)}),u()}l++;continue}if(A.nodeType!==1){l++;continue}const o=A,h=o.tagName.toLowerCase();if(o.hasAttribute("cv-pre")){o.removeAttribute("cv-pre"),l++;continue}if(o.hasAttribute("cv-once")){o.removeAttribute("cv-once"),await te(o,e,{...n,subscribe:()=>()=>{},storeSubscribeOverride:()=>()=>{}}),l++;continue}if(o.hasAttribute("cv-cloak")&&o.removeAttribute("cv-cloak"),o.hasAttribute("cv-teleport")){const i=o.getAttribute("cv-teleport");o.removeAttribute("cv-teleport");const r=document.querySelector(i)??document.body,s=document.createComment(`cv-teleport: ${i}`);o.replaceWith(s),await te(o,e,n),r.appendChild(o),l++;continue}if(o.hasAttribute("cv-memo")){const i=o.getAttribute("cv-memo");o.removeAttribute("cv-memo");const r=()=>i.split(",").map(b=>H(b.trim(),e));let s=r();const u=[],m=b=>(u.push(b),()=>{const g=u.indexOf(b);g>-1&&u.splice(g,1)});await te(o,e,{...n,subscribe:(b,g)=>m(g),storeSubscribeOverride:(b,g,w)=>m(w)});const p=J(i,n,()=>{const b=r();b.some((g,w)=>g!==s[w])&&(s=b,[...u].forEach(g=>g()))});(y=n.registerCleanup)==null||y.call(n,()=>p()),l++;continue}if(o.hasAttribute("cv-data")){const i=o.getAttribute("cv-data").trim();o.removeAttribute("cv-data");let r={},s={};if(i.startsWith("{")){const u=H(i,e)??{};Object.entries(u).forEach(([m,p])=>{typeof p=="function"?s[m]=p:r[m]=p})}else if(i){const u=(E=n.components)==null?void 0:E[i];if(u){const m=typeof u.data=="function"?u.data():u.data??{};m instanceof Promise||Object.assign(r,m),Object.assign(s,u.methods??{})}}if(n.createChildScope){const u=n.createChildScope(r,s);(k=n.registerCleanup)==null||k.call(n,u.cleanup),await te(o,u.state,{...n,subscribe:u.subscribe})}else await te(o,{...e,...r,...s},n);l++;continue}if(o.hasAttribute("cv-for")){const i=o.getAttribute("cv-for");o.removeAttribute("cv-for");const r=i.match(/^\(?(\w+)(?:,\s*(\w+))?\)?\s+in\s+(.+)$/);if(r){const[,s,u,m]=r,p=o.getAttribute(":key")??null;p&&o.removeAttribute(":key");const b=o.getAttribute("cv-transition")??null;b&&o.removeAttribute("cv-transition");const g=document.createComment(`cv-for: ${m}`);o.replaceWith(g);let w=[],L=[];const T=new Map,U=async()=>{var G;const z=H(m,e),I=z?typeof z=="number"?Array.from({length:z},(M,B)=>[B+1,B]):Array.isArray(z)?z.map((M,B)=>[M,B]):Object.entries(z).map(([M,B])=>[B,M]):[];if(p){const M=[],B=new Map,K=new Set;for(const[X,Y]of I){const oe=H(p,ze(e,X,s,Y,u));K.has(oe)&&console.warn(`[courvux] cv-for: duplicate :key "${oe}" in "${m}"`),K.add(oe),M.push(oe),B.set(oe,[X,Y])}const q=[];for(const[X,{el:Y,destroy:oe}]of T)B.has(X)||(b?(Y.classList.add(`${b}-leave`),q.push(ie(Y).then(()=>{var ae;Y.classList.remove(`${b}-leave`),oe(),(ae=Y.parentNode)==null||ae.removeChild(Y),T.delete(X)}))):(oe(),(G=Y.parentNode)==null||G.removeChild(Y),T.delete(X)));q.length&&await Promise.all(q);const W=g.parentNode,ee=[];for(const X of M){const[Y,oe]=B.get(X);if(T.has(X)){const ae=T.get(X);ae.itemRef!==Y&&(ae.reactive[s]=Y,ae.itemRef=Y),u&&(ae.reactive[u]=oe)}else{const ae=o.cloneNode(!0),Se=[],{subscribe:mt,createReactiveState:ht}=De(),Ee=ht({[s]:Y,...u?{[u]:oe}:{}}),ft=new Proxy({},{has(se,Q){return!0},get(se,Q){return typeof Q!="string"?e[Q]:Q===s||u&&Q===u?Ee[Q]:e[Q]},set(se,Q,ce){return Q===s||u&&Q===u?(Ee[Q]=ce,!0):(e[Q]=ce,!0)}}),vt={...n,subscribe:(se,Q)=>{const ce=se.split(".")[0];let de;return ce===s||u&&ce===u?de=mt(ce,Q):de=n.subscribe(se,Q),Se.push(de),de},storeSubscribeOverride:(se,Q,ce)=>{const de=ve(se,Q,ce);return Se.push(de),de}},$e=document.createDocumentFragment();$e.appendChild(ae),await te($e,ft,vt);const Ce=$e.firstChild??ae;b&&Ce.classList.add(`${b}-enter`),T.set(X,{el:Ce,reactive:Ee,itemRef:Y,destroy:()=>Se.forEach(se=>se())}),b&&ee.push(Ce)}}let Z=g.nextSibling,pe=0;for(const X of M){const{el:Y}=T.get(X);Y!==Z?pe++:Z=Y.nextSibling}if(pe>0)if(pe>M.length>>1){const X=document.createDocumentFragment();for(const Y of M)X.appendChild(T.get(Y).el);W.insertBefore(X,g.nextSibling)}else{Z=g.nextSibling;for(const X of M){const{el:Y}=T.get(X);Y!==Z?W.insertBefore(Y,Z):Z=Y.nextSibling}}w=M.map(X=>T.get(X).el),ee.length&&Promise.all(ee.map(X=>ie(X).then(()=>X.classList.remove(`${b}-enter`))))}else{if(L.forEach(q=>q()),L=[],w.forEach(q=>{var W;return(W=q.parentNode)==null?void 0:W.removeChild(q)}),w=[],!I.length)return;const M=g.parentNode,B=g.nextSibling,K={...n,subscribe:(q,W)=>{const ee=n.subscribe(q,W);return L.push(ee),ee},storeSubscribeOverride:(q,W,ee)=>{const Z=ve(q,W,ee);return L.push(Z),Z}};for(const[q,W]of I){const ee=o.cloneNode(!0),Z=document.createDocumentFragment();Z.appendChild(ee),await te(Z,ze(e,q,s,W,u),K);const pe=Z.firstChild??ee;M.insertBefore(Z,B),w.push(pe)}}};(P=n.registerCleanup)==null||P.call(n,()=>{T.forEach(({el:z,destroy:I})=>{var G;I(),(G=z.parentNode)==null||G.removeChild(z)}),T.clear(),L.forEach(z=>z()),w.forEach(z=>{var I;return(I=z.parentNode)==null?void 0:I.removeChild(z)}),w=[]}),J(m,n,U),await U()}l++;continue}if(o.hasAttribute("cv-if")){const i=[],r=o.getAttribute("cv-if");o.removeAttribute("cv-if");const s=document.createComment("cv-if");o.replaceWith(s),i.push({condition:r,template:o,anchor:s});let u=l+1;for(;u<c.length;){const w=c[u];if(w.nodeType===3&&(((F=w.textContent)==null?void 0:F.trim())??"")===""){u++;continue}if(w.nodeType!==1)break;const L=w;if(L.hasAttribute("cv-else-if")){const T=L.getAttribute("cv-else-if");L.removeAttribute("cv-else-if");const U=document.createComment("cv-else-if");L.replaceWith(U),i.push({condition:T,template:L,anchor:U}),u++;continue}if(L.hasAttribute("cv-else")){L.removeAttribute("cv-else");const T=document.createComment("cv-else");L.replaceWith(T),i.push({condition:null,template:L,anchor:T}),u++;break}break}l=u;let m=null,p=!1,b=!1;const g=async()=>{var w,L;if(p){b=!0;return}p=!0;try{do{b=!1,m&&((w=m.parentNode)==null||w.removeChild(m),m=null);for(const T of i)if(T.condition===null||H(T.condition,e)){const U=T.template.cloneNode(!0),z=document.createDocumentFragment();z.appendChild(U),await te(z,e,n);const I=z.firstChild??U;(L=T.anchor.parentNode)==null||L.insertBefore(z,T.anchor.nextSibling),m=I;break}}while(b)}finally{p=!1}};i.filter(w=>w.condition).forEach(w=>{J(w.condition,n,g)}),await g();continue}if(o.hasAttribute("cv-show")){const i=o.getAttribute("cv-show");o.removeAttribute("cv-show");const r=Array.from(o.attributes).filter(s=>s.name==="cv-transition"||s.name.startsWith("cv-transition:")||s.name.startsWith("cv-transition."));if(r.length>0){const s=I=>(o.getAttribute(I)??"").split(" ").filter(Boolean),u=s("cv-transition:enter"),m=s("cv-transition:enter-start"),p=s("cv-transition:enter-end"),b=s("cv-transition:leave"),g=s("cv-transition:leave-start"),w=s("cv-transition:leave-end"),L=o.getAttribute("cv-transition")??"",T=new Set(L.split(".").slice(1)),U=[...T].find(I=>/^\d+$/.test(I)),z=U?parseInt(U):200;if(u.length||m.length||b.length||g.length){r.forEach(q=>o.removeAttribute(q.name));const I=()=>new Promise(q=>requestAnimationFrame(()=>requestAnimationFrame(()=>q())));let G=!!H(i,e),M=!1,B=null;const K=async q=>{if(M){B=q;return}M=!0;try{q?(o.style.display="",o.classList.add(...u,...m),await I(),o.classList.remove(...m),o.classList.add(...p),await ie(o),o.classList.remove(...u,...p)):(o.classList.add(...b,...g),await I(),o.classList.remove(...g),o.classList.add(...w),await ie(o),o.classList.remove(...b,...w),o.style.display="none"),G=q}finally{if(M=!1,B!==null&&B!==G){const W=B;B=null,K(W)}else B=null}};G||(o.style.display="none"),J(i,n,()=>{const q=!!H(i,e);q!==G&&K(q)})}else{const I=[...T].find(W=>W==="scale"||/^scale$/.test(W)),G=(()=>{const W=[...T].find(ee=>/^\d+$/.test(ee)&&ee!==U);return W?parseInt(W)/100:.9})(),M=[];(!T.has("scale")||T.has("opacity"))&&M.push(`opacity ${z}ms ease`),I&&M.push(`transform ${z}ms ease`),M.length||M.push(`opacity ${z}ms ease`),o.style.transition=(o.style.transition?o.style.transition+", ":"")+M.join(", "),r.forEach(W=>o.removeAttribute(W.name));let B=!!H(i,e);const K=()=>new Promise(W=>requestAnimationFrame(()=>requestAnimationFrame(()=>W()))),q=async W=>{W?(o.style.display="",o.style.opacity="0",I&&(o.style.transform=`scale(${G})`),await K(),o.style.opacity="",I&&(o.style.transform=""),await ie(o)):(o.style.opacity="0",I&&(o.style.transform=`scale(${G})`),await ie(o),o.style.display="none",o.style.opacity="",I&&(o.style.transform="")),B=W};B||(o.style.display="none"),J(i,n,()=>{const W=!!H(i,e);W!==B&&q(W)})}}else{const s=o.getAttribute("cv-show-transition"),u=o.getAttribute(":transition");s&&o.removeAttribute("cv-show-transition"),u&&o.removeAttribute(":transition");const m=s??(u?String(H(u,e)):null);if(m){We();let p=!!H(i,e);p||(o.style.display="none");let b=!1,g=null;const w=async L=>{if(b){g=L;return}b=!0;try{L?(o.style.display="",o.classList.add(`${m}-enter`),await ie(o),o.classList.remove(`${m}-enter`)):(o.classList.add(`${m}-leave`),await ie(o),o.classList.remove(`${m}-leave`),o.style.display="none"),p=L}finally{if(b=!1,g!==null&&g!==p){const T=g;g=null,w(T)}else g=null}};J(i,n,()=>{const L=!!H(i,e);L!==p&&w(L)})}else{const p=()=>{o.style.display=H(i,e)?"":"none"};J(i,n,p),p()}}}if(o.hasAttribute("cv-focus")){const i=o.getAttribute("cv-focus")??"";if(o.removeAttribute("cv-focus"),!i)Promise.resolve().then(()=>o.focus());else{const r=()=>{H(i,e)&&Promise.resolve().then(()=>o.focus())};J(i,n,r),r()}}{const i=Array.from(o.attributes).filter(r=>r.name==="cv-intersect"||r.name.startsWith("cv-intersect:")||r.name.startsWith("cv-intersect."));if(i.length&&typeof IntersectionObserver<"u"){const r=i.find(I=>I.name==="cv-intersect"||I.name==="cv-intersect:enter"||I.name.startsWith("cv-intersect.")),s=i.find(I=>I.name==="cv-intersect:leave"),u=(r==null?void 0:r.value)??"",m=(s==null?void 0:s.value)??"",p=((r==null?void 0:r.name)??"cv-intersect").split("."),b=new Set(p.slice(1)),g=b.has("once");let w=0;if(b.has("half"))w=.5;else if(b.has("full"))w=1;else{const I=[...b].find(G=>G.startsWith("threshold-"));I&&(w=parseInt(I.replace("threshold-",""))/100)}const L=[...b].find(I=>I.startsWith("margin-")),T=L?`${L.replace("margin-","")}px`:void 0;i.forEach(I=>o.removeAttribute(I.name));const U=I=>{if(I)try{new Function("$data",`with($data){${I}}`)(e)}catch(G){console.warn(`[courvux] cv-intersect error "${I}":`,G)}},z=new IntersectionObserver(I=>{I.forEach(G=>{G.isIntersecting?(U(u),g&&z.disconnect()):U(m)})},{threshold:w,...T?{rootMargin:T}:{}});z.observe(o),(x=n.registerCleanup)==null||x.call(n,()=>z.disconnect())}}{const i=Array.from(o.attributes).find(r=>r.name==="cv-html"||r.name.startsWith("cv-html."));if(i){const r=i.value;o.removeAttribute(i.name);const s=i.name.split(".").slice(1).includes("sanitize"),u=()=>{const m=String(H(r,e)??"");o.innerHTML=s?xt(m):m};J(r,n,u),u(),l++;continue}}if(o.hasAttribute("cv-ref")&&!((V=n.components)!=null&&V[h])){const i=o.getAttribute("cv-ref");o.removeAttribute("cv-ref"),n.refs&&(n.refs[i]=o)}const f=!!((j=n.components)!=null&&j[h]),C=Array.from(o.attributes).find(i=>i.name==="cv-model"||i.name.startsWith("cv-model."));if(C&&!f){const i=C.value;o.removeAttribute(C.name);const r=new Set(C.name.split(".").slice(1)),s=o,u=(N=s.type)==null?void 0:N.toLowerCase(),m=p=>{if(r.has("number")){const b=parseFloat(p);return isNaN(b)?p:b}return r.has("trim")?p.trim():p};if(u==="checkbox"){const p=()=>{const b=H(i,e);s.checked=Array.isArray(b)?b.includes(s.value):!!b};ue(i,n,p),p(),s.addEventListener("change",()=>{const b=H(i,e);if(Array.isArray(b)){const g=[...b];if(s.checked)g.includes(s.value)||g.push(s.value);else{const w=g.indexOf(s.value);w>-1&&g.splice(w,1)}le(i,e,g)}else le(i,e,s.checked)})}else if(u==="radio"){const p=()=>{s.checked=H(i,e)===s.value};ue(i,n,p),p(),s.addEventListener("change",()=>{s.checked&&le(i,e,m(s.value))})}else if(o.hasAttribute("contenteditable")){const p=o,b=()=>{const g=String(H(i,e)??"");p.innerText!==g&&(p.innerText=g)};if(ue(i,n,b),b(),r.has("debounce")){const g=[...r].find(T=>/^\d+$/.test(T)),w=g?parseInt(g):300;let L;p.addEventListener("input",()=>{clearTimeout(L),L=setTimeout(()=>le(i,e,m(p.innerText)),w)})}else{const g=r.has("lazy")?"blur":"input";p.addEventListener(g,()=>le(i,e,m(p.innerText)))}}else{const p=()=>{s.value=H(i,e)??""};if(ue(i,n,p),p(),r.has("debounce")){const b=[...r].find(L=>/^\d+$/.test(L)),g=b?parseInt(b):300;let w;s.addEventListener("input",()=>{clearTimeout(w),w=setTimeout(()=>le(i,e,m(s.value)),g)})}else{const b=h==="select"||r.has("lazy")?"change":"input";s.addEventListener(b,()=>le(i,e,m(s.value)))}}}if(n.directives&&Array.from(o.attributes).forEach(i=>{var U,z;if(!i.name.startsWith("cv-"))return;const r=i.name.slice(3).split("."),s=r[0],u=r.slice(1),m=s.indexOf(":"),p=m>=0?s.slice(0,m):s,b=m>=0?s.slice(m+1):void 0,g=n.directives[p];if(!g)return;const w=i.value;o.removeAttribute(i.name);const L=typeof g=="function"?{onMount:g}:g,T={value:w?H(w,e):void 0,arg:b,modifiers:Object.fromEntries(u.map(I=>[I,!0]))};(U=L.onMount)==null||U.call(L,o,T),L.onUpdate&&w&&J(w,n,()=>{T.value=H(w,e),L.onUpdate(o,T)}),L.onDestroy&&((z=n.registerCleanup)==null||z.call(n,()=>L.onDestroy(o,T)))}),h==="slot"){const i=o.getAttribute("name")??"default",r=(R=n.slots)==null?void 0:R[i];if(r){const s={};Array.from(o.attributes).forEach(p=>{p.name.startsWith(":")&&(s[p.name.slice(1)]=H(p.value,e))});const u=await r(s),m=document.createDocumentFragment();u.forEach(p=>m.appendChild(p)),o.replaceWith(m)}else{const s=document.createDocumentFragment();for(;o.firstChild;)s.appendChild(o.firstChild);await te(s,e,n),o.replaceWith(s)}l++;continue}if(h==="cv-transition"){We();const i=o.getAttribute("name")??"fade",r=o.getAttribute(":show")??null;o.removeAttribute("name"),r&&o.removeAttribute(":show");const s=document.createElement("div");for(s.className="cv-t-wrap";o.firstChild;)s.appendChild(o.firstChild);if(o.replaceWith(s),await te(s,e,n),r){let u=!!H(r,e),m=!1,p=null;u||(s.style.display="none");const b=async g=>{if(m){p=g;return}m=!0;try{g?(s.style.display="",s.classList.add(`${i}-enter`),await ie(s),s.classList.remove(`${i}-enter`)):(s.classList.add(`${i}-leave`),await ie(s),s.classList.remove(`${i}-leave`),s.style.display="none"),u=g}finally{if(m=!1,p!==null&&p!==u){const w=p;p=null,b(w)}else p=null}};J(r,n,()=>{const g=!!H(r,e);g!==u&&b(g)})}l++;continue}if(h==="router-view"&&n.mountRouterView){const i=o.getAttribute("name")??void 0;o.setAttribute("aria-live","polite"),o.setAttribute("aria-atomic","true"),await n.mountRouterView(o,i),l++;continue}if(h==="router-link"){const i=o.getAttribute(":to"),r=o.getAttribute("to"),s=()=>i?String(H(i,e)??"/"):r||"/",u=document.createElement("a");u.innerHTML=o.innerHTML,Array.from(o.attributes).forEach(w=>{w.name!=="to"&&w.name!==":to"&&u.setAttribute(w.name,w.value)});const m=((_=n.router)==null?void 0:_.base)??"",p=w=>m?w===m?"/":w.startsWith(m+"/")?w.slice(m.length)||"/":w||"/":w||"/",b=()=>{var w;return((w=n.router)==null?void 0:w.mode)==="history"?p(window.location.pathname):window.location.hash.slice(1)||"/"},g=()=>{var T;const w=s(),L=b()===w;((T=n.router)==null?void 0:T.mode)==="history"?u.href=`${m}${w}`:u.href=`#${w}`,L?(u.setAttribute("aria-current","page"),u.classList.add("active")):(u.removeAttribute("aria-current"),u.classList.remove("active"))};((D=n.router)==null?void 0:D.mode)==="history"?(u.addEventListener("click",w=>{w.preventDefault(),n.router.navigate(s())}),window.addEventListener("popstate",g)):window.addEventListener("hashchange",g),i&&ue(i,n,g),g(),o.replaceWith(u),await te(u,e,n),l++;continue}if(h==="component"&&o.hasAttribute(":is")&&n.mountDynamic){const i=o.getAttribute(":is");o.removeAttribute(":is");const r=document.createComment("component:is");o.replaceWith(r),await n.mountDynamic(r,i,o,e,n),l++;continue}if(($=n.components)!=null&&$[h]&&n.mountElement){await n.mountElement(o,h,e,n),l++;continue}{const i=Array.from(o.attributes).find(r=>r.name==="cv-intersect"||r.name.startsWith("cv-intersect."));if(i&&typeof IntersectionObserver<"u"){const r=new Set(i.name.split(".").slice(1));o.removeAttribute(i.name);const s=H(i.value,e);let u,m=0,p="0px",b=r.has("once");if(typeof s=="function"?u=g=>s.call(e,g):s&&typeof s=="object"&&(typeof s.handler=="function"&&(u=g=>s.handler.call(e,g)),s.threshold!==void 0&&(m=s.threshold),s.margin&&(p=s.margin),s.once&&(b=!0)),u){const g=new IntersectionObserver(w=>{const L=w[0];u(L),b&&L.isIntersecting&&g.disconnect()},{threshold:m,rootMargin:p});g.observe(o),(d=n.registerCleanup)==null||d.call(n,()=>g.disconnect())}}}if(o.hasAttribute("cv-resize")){const i=o.getAttribute("cv-resize");if(o.removeAttribute("cv-resize"),typeof ResizeObserver<"u"){const r=H(i,e);let s,u="content-box";if(typeof r=="function"?s=m=>r.call(e,m):r&&typeof r=="object"&&(typeof r.handler=="function"&&(s=m=>r.handler.call(e,m)),r.box&&(u=r.box)),s){const m=new ResizeObserver(p=>{p[0]&&s(p[0])});m.observe(o,{box:u}),(a=n.registerCleanup)==null||a.call(n,()=>m.disconnect())}}}if(o.hasAttribute("cv-scroll")){const i=o.getAttribute("cv-scroll");o.removeAttribute("cv-scroll");const r=H(i,e);let s,u=0;if(typeof r=="function"?s=m=>r.call(e,m):r&&typeof r=="object"&&(typeof r.handler=="function"&&(s=m=>r.handler.call(e,m)),r.throttle&&(u=r.throttle)),s){let m=0;const p=()=>{const b=Date.now();u>0&&b-m<u||(m=b,s({scrollTop:o.scrollTop,scrollLeft:o.scrollLeft,scrollHeight:o.scrollHeight,scrollWidth:o.scrollWidth,clientHeight:o.clientHeight,clientWidth:o.clientWidth}))};o.addEventListener("scroll",p,{passive:!0}),(v=n.registerCleanup)==null||v.call(n,()=>o.removeEventListener("scroll",p))}}if(o.hasAttribute("cv-clickoutside")){const i=o.getAttribute("cv-clickoutside");o.removeAttribute("cv-clickoutside");const r=s=>{o.contains(s.target)||(typeof e[i]=="function"?e[i].call(e,s):He(i,e,s))};document.addEventListener("click",r,!0),(S=n.registerCleanup)==null||S.call(n,()=>document.removeEventListener("click",r,!0))}if(o.hasAttribute("cv-bind")){const i=o.getAttribute("cv-bind");o.removeAttribute("cv-bind");const r=o.getAttribute("class")??"",s=o.getAttribute("style")??"";let u=[];const m=()=>{const p=H(i,e)??{},b=Object.keys(p);for(const g of u)g in p||(g==="class"?o.className=r:g==="style"?o.style.cssText=s:o.removeAttribute(g));for(const[g,w]of Object.entries(p))g==="class"?o.className=[r,Pe(w)].filter(Boolean).join(" "):g==="style"?Ne(o,w,s):w==null||w===!1?o.removeAttribute(g):o.setAttribute(g,w===!0?"":String(w));u=b};J(i,n,m),m()}const O={enter:"Enter",esc:"Escape",escape:"Escape",space:" ",tab:"Tab",delete:"Delete",backspace:"Backspace",up:"ArrowUp",down:"ArrowDown",left:"ArrowLeft",right:"ArrowRight"};Array.from(o.attributes).forEach(i=>{if(i.name.startsWith("@")||i.name.startsWith("cv:on:")){const r=(i.name.startsWith("@")?i.name.substring(1):i.name.substring(6)).split("."),s=r[0],u=new Set(r.slice(1)),m=[...u].find(w=>w in O),p=i.value,b=w=>{u.has("prevent")&&w.preventDefault(),u.has("stop")&&w.stopPropagation(),!(u.has("self")&&w.target!==w.currentTarget)&&(m&&w.key!==O[m]||(typeof e[p]=="function"?e[p].call(e,w):He(p,e,w)))},g={};u.has("once")&&(g.once=!0),u.has("passive")&&(g.passive=!0),u.has("capture")&&(g.capture=!0),o.addEventListener(s,b,Object.keys(g).length?g:void 0)}else if(i.name.startsWith(":")){const r=i.name.slice(1),s=i.value;if(r==="class"){const u=o.getAttribute("class")??"",m=()=>{o.className=[u,Pe(H(s,e))].filter(Boolean).join(" ")};J(s,n,m),m()}else if(r==="style"){const u=o.getAttribute("style")??"",m=()=>Ne(o,H(s,e),u);J(s,n,m),m()}else if(r.includes("-")){const u=()=>{const m=H(s,e);m==null||m===!1?o.removeAttribute(r):o.setAttribute(r,m===!0?"":String(m))};J(s,n,u),u()}else{const u=()=>{o[r]=H(s,e)??""};J(s,n,u),u()}}}),A.hasChildNodes()&&await te(A,e,n),l++}}var kt=`
router-view.fade-leave{animation:cv-fade-out 0.25s forwards}
router-view.fade-enter{animation:cv-fade-in 0.25s forwards}
router-view.slide-up-leave{animation:cv-slide-up-out 0.25s forwards}
router-view.slide-up-enter{animation:cv-slide-up-in 0.25s forwards}
@keyframes cv-fade-out{to{opacity:0}}
@keyframes cv-fade-in{from{opacity:0}}
@keyframes cv-slide-up-out{to{opacity:0;transform:translateY(-12px)}}
@keyframes cv-slide-up-in{from{opacity:0;transform:translateY(12px)}}
`;function At(){if(document.getElementById("cv-transitions"))return;const t=document.createElement("style");t.id="cv-transitions",t.textContent=kt,document.head.appendChild(t)}async function ge(t,e,n){t.classList.add(`${e}-${n}`);const c=getComputedStyle(t),l=Math.max(parseFloat(c.animationDuration)||0,parseFloat(c.transitionDuration)||0)*1e3;l>0&&await new Promise(y=>{const E=()=>y();t.addEventListener("animationend",E,{once:!0}),t.addEventListener("transitionend",E,{once:!0}),setTimeout(E,l+50)}),t.classList.remove(`${e}-${n}`)}var xe=new Map;async function St(t){if(typeof t!="function")return t;if(xe.has(t))return xe.get(t);const e=await t();return xe.set(t,e.default),e.default}function qe(t,e){if(t.components)return t.components[e];if(e==="default")return t.component}function Ve(t,e){if(t==="*")return{};const n=[],c=t.replace(/:(\w+)/g,(y,E)=>(n.push(E),"([^/]+)")),l=e.match(new RegExp(`^${c}$`));return l?Object.fromEntries(n.map((y,E)=>[y,l[E+1]])):null}function Et(t,e){if(t==="/")return{params:{},remaining:e};const n=[],c=t.replace(/:(\w+)/g,(y,E)=>(n.push(E),"([^/]+)")),l=e.match(new RegExp(`^${c}(/.+)?$`));return l?{params:Object.fromEntries(n.map((y,E)=>[y,l[E+1]])),remaining:l[n.length+1]||"/"}:null}function dt(t,e=""){return t.map(n=>{var l;if(n.path==="*")return n;const c=((e.endsWith("/")?e.slice(0,-1):e)+n.path).replace(/\/+/g,"/")||"/";return(l=n.children)!=null&&l.length?{...n,path:c,children:dt(n.children,c==="/"?"":c)}:{...n,path:c}})}var me=(t,e)=>new Promise(n=>t(e,n)),Ge=(t,e)=>t!=null&&t.beforeLeave?new Promise(n=>t.beforeLeave(e,n)):Promise.resolve(void 0);function $t(t,e={}){const n=e.mode??"hash",c=Ct(e.base??"");return{routes:dt(t),mode:n,base:c,transition:e.transition,beforeEach:e.beforeEach,afterEach:e.afterEach,scrollBehavior:e.scrollBehavior,navigate(l,y){const E=Ye(l,y==null?void 0:y.query);n==="history"?(history.pushState({},"",`${c}${E}`),window.dispatchEvent(new PopStateEvent("popstate"))):window.location.hash=E},replace(l,y){const E=Ye(l,y==null?void 0:y.query);if(n==="history")history.replaceState({},"",`${c}${E}`),window.dispatchEvent(new PopStateEvent("popstate"));else{const k=window.location.href.split("#")[0];window.location.replace(`${k}#${E}`)}},back(){history.back()},forward(){history.forward()}}}function Ct(t){if(!t||t==="/")return"";let e=t.startsWith("/")?t:`/${t}`;return e.endsWith("/")&&(e=e.slice(0,-1)),e}function Ft(t,e){return e?t===e?"/":t.startsWith(e+"/")?t.slice(e.length)||"/":t||"/":t||"/"}function Ye(t,e){return!e||!Object.keys(e).length?t:`${t}?${new URLSearchParams(e).toString()}`}function Xe(t){if(!t)return{};const e=new URLSearchParams(t.startsWith("?")?t.slice(1):t),n={};return e.forEach((c,l)=>{n[l]=c}),n}function Ze(t,e,n,c="default",l){const y=e.base??"",E=()=>e.mode==="history"?Ft(window.location.pathname,y):(window.location.hash.slice(1)||"/").split("?")[0]||"/",k=()=>{if(e.mode==="history")return Xe(window.location.search);const a=window.location.hash.slice(1)||"/",v=a.indexOf("?");return v>=0?Xe(a.slice(v+1)):{}};e.transition&&At();let P=null,F=null,x=null,V=null,j=!1;const N=()=>{j||(j=!0,l==null||l())},R=new Map,_=a=>{var v;if(a!=null&&a.keepAlive&&x){(v=x.deactivate)==null||v.call(x);const S=document.createDocumentFragment();for(;t.firstChild;)S.appendChild(t.firstChild);R.set(P.path,{fragment:S,activation:x}),x=null}else x==null||x.destroy(),x=null,t.innerHTML=""},D=async(a,v,S,A,o)=>{const h=typeof v=="function"&&!xe.has(v),f=h?v.__asyncOptions:void 0,C=a.loadingTemplate??(f==null?void 0:f.loadingTemplate);h&&C&&(t.innerHTML=C);let O;try{O=await St(v)}catch(i){const r=f==null?void 0:f.errorTemplate;if(r)return t.innerHTML=r,{destroy:()=>{t.innerHTML=""}};throw i}return h&&C&&(t.innerHTML=""),n(t,O,S,A,o)},$=async()=>{var S,A,o,h,f,C,O,i;const a=E(),v=k();for(const r of e.routes){if((S=r.children)!=null&&S.length){const u=Et(r.path,a);if(u!==null)for(const m of r.children){const p=Ve(m.path,a);if(p!==null){const b={params:u.params,query:v,path:a,meta:r.meta};if(m.redirect){const T={params:p,query:v,path:a,meta:m.meta},U=typeof m.redirect=="function"?m.redirect(T):m.redirect;e.navigate(U);return}if(e.beforeEach){const T=await me(e.beforeEach,b);if(T){e.navigate(T);return}}if(r.beforeEnter){const T=await me(r.beforeEnter,b);if(T){e.navigate(T);return}}if(m.beforeEnter){const T={params:p,query:v,path:a,meta:m.meta},U=await me(m.beforeEnter,T);if(U){e.navigate(U);return}}const g=`${r.path}::${JSON.stringify(u.params)}`;if(V!==g){const T=await Ge(x,b);if(T){e.navigate(T);return}const U=r.transition??e.transition;U&&t.hasChildNodes()&&await ge(t,U,"leave"),_(F);const z=qe(r,c);if(z){const I={routes:r.children,mode:e.mode,base:e.base,transition:r.transition??e.transition,beforeEach:e.beforeEach,afterEach:e.afterEach,scrollBehavior:e.scrollBehavior,navigate:(G,M)=>e.navigate(G,M),replace:(G,M)=>e.replace(G,M),back:()=>e.back(),forward:()=>e.forward()};x=await D(r,z,b,c==="default"?r.layout:void 0,c==="default"?I:void 0),(A=x.enter)==null||A.call(x,P)}else t.innerHTML="";V=g,U&&await ge(t,U,"enter")}const w={params:{...u.params,...p},query:v,path:a,meta:m.meta??r.meta};(o=e.afterEach)==null||o.call(e,w,P);const L=(h=e.scrollBehavior)==null?void 0:h.call(e,w,P);L&&window.scrollTo(L.x??0,L.y??0),P=w,F=r,N();return}}}const s=Ve(r.path,a);if(s!==null){V=null;const u={params:s,query:v,path:a,meta:r.meta};if(r.redirect){const w=typeof r.redirect=="function"?r.redirect(u):r.redirect;e.navigate(w);return}if(e.beforeEach){const w=await me(e.beforeEach,u);if(w){e.navigate(w);return}}if(r.beforeEnter){const w=await me(r.beforeEnter,u);if(w){e.navigate(w);return}}const m=await Ge(x,u);if(m){e.navigate(m);return}const p=r.transition??e.transition;p&&t.hasChildNodes()&&await ge(t,p,"leave"),_(F);const b=qe(r,c);if(b){const w=u.path;if(r.keepAlive&&R.has(w)){const L=R.get(w);t.appendChild(L.fragment),x=L.activation,(f=x.activate)==null||f.call(x),R.delete(w)}else{const L=P;x=await D(r,b,u,c==="default"?r.layout:void 0),(C=x.enter)==null||C.call(x,L)}}else t.innerHTML="",x=null;p&&await ge(t,p,"enter"),(O=e.afterEach)==null||O.call(e,u,P);const g=(i=e.scrollBehavior)==null?void 0:i.call(e,u,P);g&&window.scrollTo(g.x??0,g.y??0),P=u,F=r,N();return}}V=null,_(F),F=null,N()},d=e.mode==="history"?"popstate":"hashchange";return window.addEventListener(d,$),$(),()=>{window.removeEventListener(d,$),x==null||x.destroy(),x=null,R.forEach(({activation:a})=>a.destroy()),R.clear()}}function _t(){if(typeof window>"u")return null;if(window.__COURVUX_DEVTOOLS__)return window.__COURVUX_DEVTOOLS__;const t=new Map,e={instances:[],stores:[],on(n,c){return t.has(n)||t.set(n,new Set),t.get(n).add(c),()=>{var l;return(l=t.get(n))==null?void 0:l.delete(c)}},_emit(n,c){var l;(l=t.get(n))==null||l.forEach(y=>{try{y(c)}catch{}})},_registerInstance(n){this.instances.push(n),this._emit("mount",n)},_unregisterInstance(n){const c=this.instances.findIndex(l=>l.id===n);if(c!==-1){const l=this.instances[c];this.instances.splice(c,1),this._emit("destroy",l)}},_registerStore(n){this.stores.push(n),n.subscribe(()=>this._emit("store-update",n))}};return window.__COURVUX_DEVTOOLS__=e,e}var Tt=0;function Ot(){return++Tt}var Lt=`
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
`;function jt(){if(document.getElementById("cvd-styles"))return;const t=document.createElement("style");t.id="cvd-styles",t.textContent=Lt,document.head.appendChild(t)}function be(t){return t===null?"null":t===void 0?"undefined":typeof t=="string"?`"${t}"`:typeof t=="object"?JSON.stringify(t):String(t)}function Je(t){try{return JSON.parse(t)}catch{return t}}function Dt(t){if(typeof document>"u")return;jt();const e=document.createElement("div");e.id="cvd",document.body.appendChild(e);let n=!1,c="components",l=new Set;const y=document.createElement("div");y.id="cvd-badge",y.innerHTML='<span class="cvd-badge-dot"></span>COURVUX',e.appendChild(y);const E=document.createElement("div");E.id="cvd-panel",E.style.display="none",e.appendChild(E),E.innerHTML=`
        <div id="cvd-head">
            <span id="cvd-title">⚡ COURVUX DEVTOOLS</span>
            <div id="cvd-tabs">
                <button class="cvd-tab active" data-tab="components">Components</button>
                <button class="cvd-tab" data-tab="store">Store</button>
            </div>
            <button id="cvd-close">✕</button>
        </div>
        <div id="cvd-body"></div>
    `;const k=E.querySelector("#cvd-body");y.addEventListener("click",()=>{n=!0,y.style.display="none",E.style.display="flex",R()}),E.querySelector("#cvd-close").addEventListener("click",()=>{n=!1,E.style.display="none",y.style.display=""}),E.querySelectorAll(".cvd-tab").forEach(_=>{_.addEventListener("click",()=>{c=_.dataset.tab,E.querySelectorAll(".cvd-tab").forEach(D=>D.classList.remove("active")),_.classList.add("active"),R()})});const P=E.querySelector("#cvd-head");let F=!1,x=0,V=0;P.addEventListener("mousedown",_=>{_.target.closest("button")||(F=!0,x=_.clientX-e.getBoundingClientRect().left,V=_.clientY-e.getBoundingClientRect().top)}),document.addEventListener("mousemove",_=>{F&&(e.style.right="auto",e.style.bottom="auto",e.style.left=`${_.clientX-x}px`,e.style.top=`${_.clientY-V}px`)}),document.addEventListener("mouseup",()=>{F=!1});function j(){const _=t.instances;if(!_.length){k.innerHTML='<div class="cvd-empty">No hay componentes montados</div>';return}k.innerHTML=_.map(D=>{const $=D.getState(),d=Object.keys($);return`
                <div class="cvd-inst${l.has(D.id)?" open":""}" data-id="${D.id}">
                    <div class="cvd-inst-head">
                        <span class="cvd-arrow">▶</span>
                        <span class="cvd-inst-name">&lt;${D.name}&gt;</span>
                        <span class="cvd-count">${d.length} keys</span>
                        <span class="cvd-inst-id">#${D.id}</span>
                    </div>
                    <div class="cvd-kv">
                        ${d.length?d.map(a=>`
                            <div class="cvd-row">
                                <span class="cvd-key">${a}</span>
                                <span class="cvd-val" data-inst="${D.id}" data-key="${a}" title="click to edit">${be($[a])}</span>
                            </div>
                        `).join(""):'<span style="color:#555">— sin datos reactivos —</span>'}
                    </div>
                </div>
            `}).join(""),k.querySelectorAll(".cvd-inst-head").forEach(D=>{D.addEventListener("click",()=>{const $=D.closest(".cvd-inst"),d=parseInt($.dataset.id);l.has(d)?l.delete(d):l.add(d),$.classList.toggle("open")})}),k.querySelectorAll(".cvd-val").forEach(D=>{D.addEventListener("click",$=>{$.stopPropagation();const d=D;if(d.querySelector("input"))return;const a=parseInt(d.dataset.inst),v=d.dataset.key,S=t.instances.find(f=>f.id===a);if(!S)return;const A=be(S.getState()[v]);d.classList.add("editing"),d.innerHTML=`<input class="cvd-edit" value='${A.replace(/'/g,"&#39;")}'>`;const o=d.querySelector("input");o.focus(),o.select();const h=()=>{S.setState(v,Je(o.value)),d.classList.remove("editing")};o.addEventListener("blur",h),o.addEventListener("keydown",f=>{f.key==="Enter"&&(f.preventDefault(),h()),f.key==="Escape"&&(d.classList.remove("editing"),R())})})})}function N(){if(!t.stores.length){k.innerHTML='<div class="cvd-empty">No hay store registrado</div>';return}k.innerHTML=t.stores.map((_,D)=>{const $=_.getState(),d=Object.keys($);return`
                <div class="cvd-inst open" data-store="${D}">
                    <div class="cvd-inst-head">
                        <span class="cvd-arrow" style="transform:rotate(90deg)">▶</span>
                        <span class="cvd-inst-name" style="color:#ffcb6b">Store</span>
                        <span class="cvd-count">${d.length} keys</span>
                    </div>
                    <div class="cvd-kv">
                        ${d.map(a=>`
                            <div class="cvd-row">
                                <span class="cvd-key cvd-store-key">${a}</span>
                                <span class="cvd-val" data-store="${D}" data-key="${a}" title="click to edit">${be($[a])}</span>
                            </div>
                        `).join("")}
                    </div>
                </div>
            `}).join(""),k.querySelectorAll(".cvd-inst-head").forEach(_=>{_.addEventListener("click",()=>_.closest(".cvd-inst").classList.toggle("open"))}),k.querySelectorAll("[data-store][data-key]").forEach(_=>{_.addEventListener("click",D=>{D.stopPropagation();const $=_;if($.querySelector("input"))return;const d=parseInt($.dataset.store),a=$.dataset.key,v=t.stores[d];if(!v)return;const S=be(v.getState()[a]);$.classList.add("editing"),$.innerHTML=`<input class="cvd-edit" value='${S.replace(/'/g,"&#39;")}'>`;const A=$.querySelector("input");A.focus(),A.select();const o=()=>{v.setState(a,Je(A.value)),$.classList.remove("editing")};A.addEventListener("blur",o),A.addEventListener("keydown",h=>{h.key==="Enter"&&(h.preventDefault(),o()),h.key==="Escape"&&($.classList.remove("editing"),R())})})})}function R(){n&&(c==="components"?j():N())}t.on("mount",()=>R()),t.on("update",()=>R()),t.on("destroy",()=>R()),t.on("store-update",()=>R())}var Pt="__COURVUX_HEAD_COLLECTOR__";function It(){return globalThis[Pt]??null}var Mt=(t,e)=>{Object.entries(e).forEach(([n,c])=>{n!=="innerHTML"&&(c==null||c===!1||t.setAttribute(n,c===!0?"":String(c)))})},Rt=t=>{const e={};return Array.from(t.attributes).forEach(n=>{e[n.name]=n.value}),e},zt=(t,e)=>{Array.from(t.attributes).forEach(n=>t.removeAttribute(n.name)),Object.entries(e).forEach(([n,c])=>t.setAttribute(n,c))},Ke=(t,e,n,c)=>{let l=n?document.head.querySelector(n):null;l?(c.push({el:l,prevAttrs:Rt(l),created:!1}),Array.from(l.attributes).forEach(y=>l.removeAttribute(y.name))):(l=document.createElement(t),document.head.appendChild(l),c.push({el:l,created:!0})),Mt(l,e)};function Nt(t){var E,k,P;const e=It();if(e!==null)return e.push(t),()=>{};if(typeof document>"u")return()=>{};const n=[];let c;const l={},y={};if(t.title!==void 0){c=document.title;const F=t.titleTemplate,x=typeof F=="function"?F(t.title):typeof F=="string"?F.replace("%s",t.title):t.title;document.title=x}return(E=t.meta)==null||E.forEach(F=>{Ke("meta",F,F.name?`meta[name="${CSS.escape(F.name)}"]`:F.property?`meta[property="${CSS.escape(F.property)}"]`:F["http-equiv"]?`meta[http-equiv="${CSS.escape(F["http-equiv"])}"]`:null,n)}),(k=t.link)==null||k.forEach(F=>{Ke("link",F,F.rel==="canonical"?'link[rel="canonical"]':F.rel&&F.href?`link[rel="${CSS.escape(F.rel)}"][href="${CSS.escape(F.href)}"]`:null,n)}),(P=t.script)==null||P.forEach(F=>{const x=document.createElement("script");Object.entries(F).forEach(([V,j])=>{V==="innerHTML"?x.textContent=String(j):j!=null&&j!==!1&&x.setAttribute(V,j===!0?"":String(j))}),document.head.appendChild(x),n.push({el:x,created:!0})}),t.htmlAttrs&&Object.entries(t.htmlAttrs).forEach(([F,x])=>{l[F]=document.documentElement.getAttribute(F),document.documentElement.setAttribute(F,x)}),t.bodyAttrs&&Object.entries(t.bodyAttrs).forEach(([F,x])=>{y[F]=document.body.getAttribute(F),document.body.setAttribute(F,x)}),function(){c!==void 0&&(document.title=c),n.forEach(({el:F,prevAttrs:x,created:V})=>{var j;V?(j=F.parentNode)==null||j.removeChild(F):x&&zt(F,x)}),Object.entries(l).forEach(([F,x])=>{x===null?document.documentElement.removeAttribute(F):document.documentElement.setAttribute(F,x)}),Object.entries(y).forEach(([F,x])=>{x===null?document.body.removeAttribute(F):document.body.setAttribute(F,x)})}}var Te="data-courvux-ssr",Ht=t=>t?Promise.resolve().then(t):Promise.resolve();function Qe(t,e){const n=t.trim();if(n.startsWith("{")){const c=n.replace(/[{}]/g,"").split(",").map(l=>l.trim()).filter(Boolean);return Object.fromEntries(c.map(l=>[l,e[l]]))}return{[n]:e}}var ye=t=>{if(t===null||typeof t!="object")return t;try{return structuredClone(t)}catch{return t}};async function ne(t,e,n){var S,A,o;const c={},{subscribe:l,createReactiveState:y,registerSetInterceptor:E,notifyAll:k}=De();let P;if(typeof e.data=="function"?(e.loadingTemplate&&(t.innerHTML=e.loadingTemplate),P=await e.data()):P=e.data??{},e.templateUrl){const h=n.baseUrl?new URL(e.templateUrl,n.baseUrl).href:e.templateUrl,f=await fetch(h);if(!f.ok)throw new Error(`Failed to load template: ${h} (${f.status})`);t.innerHTML=await f.text()}else e.template&&(t.innerHTML=e.template);t.removeAttribute(Te),(S=t.querySelector(`[${Te}]`))==null||S.removeAttribute(Te);const F={};if(e.inject&&n.provided){const h=Array.isArray(e.inject)?Object.fromEntries(e.inject.map(f=>[f,f])):e.inject;Object.entries(h).forEach(([f,C])=>{n.provided&&C in n.provided&&(F[f]=n.provided[C])})}const x=y({...n.globalProperties??{},...P,...F,...e.methods,$refs:c,$el:t,...n.slots?{$slots:Object.fromEntries(Object.keys(n.slots).map(h=>[h,!0]))}:{},...n.store?{$store:n.store}:{},...n.currentRoute?{$route:n.currentRoute}:{},...n.router?{$router:n.router}:{}});x.$watch=(h,f,C)=>{const O=(C==null?void 0:C.deep)??!1,i=(C==null?void 0:C.immediate)??!1;let r=O?ye(x[h]):x[h];const s=l(h,()=>{const u=x[h];f.call(x,u,r),r=O?ye(u):u});return i&&f.call(x,x[h],void 0),s},x.$batch=bt,x.$nextTick=h=>Ht(h),x.$dispatch=(h,f,C)=>{t.dispatchEvent(new CustomEvent(h,{bubbles:!0,composed:!0,...C??{},detail:f}))},n.magics&&Object.entries(n.magics).forEach(([h,f])=>{x[h]=f(x)}),x.$forceUpdate=()=>k();const V=[];x.$watchEffect=h=>{let f=[];const C=()=>{f.forEach(s=>s()),f=[];const i=Ie(()=>{try{h()}catch{}}),r=new Map;for(const{sub:s,key:u}of i)r.has(s)||r.set(s,new Set),!r.get(s).has(u)&&(r.get(s).add(u),f.push(s(u,C)))};C();const O=()=>{f.forEach(r=>r()),f=[];const i=V.indexOf(O);i>-1&&V.splice(i,1)};return V.push(O),O};const j=[];e.computed&&Object.entries(e.computed).forEach(([h,f])=>{const C=typeof f=="function"?f:f.get,O=typeof f!="function"?f.set:void 0;let i=[];const r=()=>{i.forEach(p=>p()),i=[];let s;const u=Ie(()=>{try{s=C.call(x)}catch(p){(e.debug??n.debug)&&console.warn("[courvux] computed error:",p)}});x[h]=s;const m=new Map;for(const{sub:p,key:b}of u)m.has(p)||m.set(p,new Set),!m.get(p).has(b)&&(m.get(p).add(b),i.push(p(b,r)))};r(),j.push(()=>i.forEach(s=>s())),O&&E(h,s=>O.call(x,s))});const N=[];e.watch&&Object.entries(e.watch).forEach(([h,f])=>{const C=typeof f=="object"&&f!==null&&"handler"in f,O=C?f.handler:f,i=C?f.immediate??!1:!1,r=C?f.deep??!1:!1;let s=r?ye(x[h]):x[h];const u=l(h,()=>{const m=x[h];O.call(x,m,s),s=r?ye(m):m});N.push(u),i&&O.call(x,x[h],void 0)});const R={...n.provided??{}};if(e.provide){const h=typeof e.provide=="function"?e.provide.call(x):e.provide;Object.assign(R,h)}const _={...n,provided:R,components:{...n.components,...e.components}};_.mountElement=Ae(_),_.createChildScope=(h,f)=>{const C=new Set(Object.keys(h)),O=new Set(Object.keys(f)),{subscribe:i,createReactiveState:r}=De(),s=r(h);let u;return u=new Proxy({},{get(m,p){return typeof p!="string"?x[p]:C.has(p)?s[p]:O.has(p)?f[p].bind(u):x[p]},set(m,p,b){return typeof p!="string"?!1:C.has(p)?(s[p]=b,!0):(x[p]=b,!0)},has(m,p){return C.has(p)||O.has(p)||p in x},ownKeys(){return[...C,...O,...Object.keys(x)]},getOwnPropertyDescriptor(m,p){return C.has(p)||O.has(p)||p in x?{configurable:!0,enumerable:!0,writable:!0}:void 0}}),{state:u,subscribe:(m,p)=>C.has(m)?i(m,p):d(m,p),cleanup:()=>{}}},_.mountDynamic=async(h,f,C,O,i)=>{let r=null,s=null;const u=C.getAttribute("loading-template")??"",m=async()=>{var z,I,G;s==null||s(),s=null,r!=null&&r.parentNode&&(r.parentNode.removeChild(r),r=null);const p=H(f,O);if(!p)return;let b;if(typeof p=="function"){if(u){const M=document.createElement("div");M.innerHTML=u,(z=h.parentNode)==null||z.insertBefore(M,h.nextSibling),r=M}b=(await p()).default,r!=null&&r.parentNode&&(r.parentNode.removeChild(r),r=null)}else typeof p=="string"?b=(I=_.components)==null?void 0:I[p]:p&&typeof p=="object"&&(b=p);if(!b)return;const g=document.createElement("div");Array.from(C.attributes).forEach(M=>g.setAttribute(M.name,M.value)),g.innerHTML=C.innerHTML;const w={},L={};Array.from(C.attributes).forEach(M=>{if(M.name.startsWith(":"))w[M.name.slice(1)]=H(M.value,O);else if(M.name.startsWith("@")||M.name.startsWith("cv:on:")){const B=M.value,K=M.name.startsWith("@")?M.name.slice(1):M.name.slice(6);L[K]=(...q)=>{typeof O[B]=="function"&&O[B].call(O,...q)}}});const T={...b,data:{...b.data,...w},methods:{...b.methods,$emit(M,...B){var K;ut(b,M,B),(K=L[M])==null||K.call(L,...B)}}},U={..._,components:{..._.components,...b.components}};U.mountElement=Ae(U),s=(await ne(g,T,U)).destroy,(G=h.parentNode)==null||G.insertBefore(g,h.nextSibling),r=g};J(f,i,m),await m()};const D=[];x.$addCleanup=h=>{D.push(h)};let $=!1;const d=(h,f)=>!e.onBeforeUpdate&&!e.onUpdated?l(h,f):l(h,()=>{var C;$||($=!0,(C=e.onBeforeUpdate)==null||C.call(x),Promise.resolve().then(()=>{var O;$=!1,(O=e.onUpdated)==null||O.call(x)})),f()});try{(A=e.onBeforeMount)==null||A.call(x),await te(t,x,{subscribe:d,refs:c,..._,registerCleanup:h=>D.push(h)}),t.removeAttribute("cv-cloak"),(o=e.onMount)==null||o.call(x)}catch(h){if(e.onError)t.removeAttribute("cv-cloak"),e.onError.call(x,h);else if(n.errorHandler)t.removeAttribute("cv-cloak"),n.errorHandler(h,x,e.name??t.tagName.toLowerCase());else throw h}const a=typeof window<"u"?window.__COURVUX_DEVTOOLS__:void 0,v=a?Ot():0;if(a){const h=x,f=new Set,C={id:v,name:e.name??t.tagName.toLowerCase(),el:t,getState:()=>{const O={};for(const i of Object.keys(h))if(!(i.startsWith("$")||typeof h[i]=="function"))try{O[i]=h[i]}catch{}return O},setState:(O,i)=>{h[O]=i},subscribe:O=>(f.add(O),()=>f.delete(O)),children:[]};Object.keys(h).filter(O=>!O.startsWith("$")&&typeof h[O]!="function").forEach(O=>{l(O,()=>{a._emit("update",C),f.forEach(i=>i())})}),a._registerInstance(C),D.push(()=>a._unregisterInstance(v))}return{state:x,destroy:()=>{var h,f;(h=e.onBeforeUnmount)==null||h.call(x),j.forEach(C=>C()),N.forEach(C=>C()),V.forEach(C=>C()),D.forEach(C=>C()),(f=e.onDestroy)==null||f.call(x)},activate:()=>{var h;(h=e.onActivated)==null||h.call(x)},deactivate:()=>{var h;(h=e.onDeactivated)==null||h.call(x)},beforeLeave:e.onBeforeRouteLeave?(h,f)=>e.onBeforeRouteLeave.call(x,h,f):void 0,enter:e.onBeforeRouteEnter?h=>e.onBeforeRouteEnter.call(x,h):void 0}}function ut(t,e,n){if(!t.emits||Array.isArray(t.emits))return;const c=t.emits[e];typeof c=="function"&&!c(...n)&&console.warn(`[courvux] emit "${e}": validator returned false`)}function Ae(t){return async(e,n,c,l)=>{const y=t.components[n],E=e.getAttribute("cv-ref");E&&e.removeAttribute("cv-ref");const k={},P=[],F={};Array.from(e.attributes).filter($=>$.name==="cv-model"||$.name.startsWith("cv-model.")||$.name.startsWith("cv-model:")).forEach($=>{e.removeAttribute($.name);const d=$.value,a=$.name.indexOf(":"),v=a>=0?$.name.slice(a+1).split(".")[0]:"modelValue",S=v==="modelValue"?"update:modelValue":`update:${v}`;k[v]=Fe(H(d,c)),P.push({propName:v,expr:d}),F[S]=A=>{le(d,c,A)}});const x={};Array.from(e.attributes).forEach($=>{const d=$.name.startsWith(":"),a=$.name.startsWith("@")||$.name.startsWith("cv:on:"),v=$.name==="cv-model"||$.name.startsWith("cv-model.")||$.name.startsWith("cv-model:"),S=$.name.startsWith("v-slot"),A=$.name==="slot";!d&&!a&&!v&&!S&&!A&&(x[$.name]=$.value)}),y.inheritAttrs===!1&&Object.keys(x).forEach($=>e.removeAttribute($)),Array.from(e.attributes).forEach($=>{if($.name.startsWith(":")){const d=$.name.slice(1),a=$.value;k[d]=Fe(H(a,c)),P.push({propName:d,expr:a})}else if($.name.startsWith("@")||$.name.startsWith("cv:on:")){const d=$.name.startsWith("@")?$.name.slice(1):$.name.slice(6),a=$.value;F[d]=(...v)=>{typeof c[a]=="function"&&c[a].call(c,...v)}}});const V=e.getAttribute("v-slot")??e.getAttribute("v-slot:default");V&&(e.removeAttribute("v-slot"),e.removeAttribute("v-slot:default"));const j=new Map,N=[];Array.from(e.childNodes).forEach($=>{const d=$.nodeType===1?$.getAttribute("slot"):null;if(d){if(!j.has(d)){const a=e.getAttribute(`v-slot:${d}`)??null;a&&e.removeAttribute(`v-slot:${d}`),j.set(d,{nodes:[],vSlot:a})}j.get(d).nodes.push($.cloneNode(!0))}else N.push($.cloneNode(!0))});const R={};N.some($=>{var d;return $.nodeType===1||$.nodeType===3&&(((d=$.textContent)==null?void 0:d.trim())??"")!==""})&&(R.default=async $=>{const d=V?{...c,...Qe(V,$)}:c,a=document.createDocumentFragment();return N.forEach(v=>a.appendChild(v.cloneNode(!0))),await te(a,d,l),Array.from(a.childNodes)});for(const[$,{nodes:d,vSlot:a}]of j)R[$]=async v=>{const S=a?{...c,...Qe(a,v)}:c,A=document.createDocumentFragment();return d.forEach(o=>A.appendChild(o.cloneNode(!0))),await te(A,S,l),Array.from(A.childNodes)};const _={...t,components:{...t.components,...y.components},slots:R};_.mountElement=Ae(_);const{state:D}=await ne(e,{...y,data:{...y.data,...k,$attrs:x,$parent:c},methods:{...y.methods,$emit($,...d){var a;ut(y,$,d),(a=F[$])==null||a.call(F,...d)}}},_);D&&(P.forEach(({propName:$,expr:d})=>{ue(d,{...l,subscribe:l.subscribe},()=>{D[$]=Fe(H(d,c))})}),E&&l.refs&&(l.refs[E]=D))}}function Ut(t){wt();const e=typeof window<"u"?_t():void 0,n=[],c={...t.directives},l={...t.components??{}},y=[],E=new Map,k={},P=new Map;if(t.debug&&e&&Dt(e),e&&t.store){const j=t.store,N=Object.keys(j).filter(R=>typeof j[R]!="function");e._registerStore({getState(){const R={};return N.forEach(_=>{try{R[_]=j[_]}catch{}}),R},setState(R,_){j[R]=_},subscribe(R){const _=N.map(D=>{try{return ve(j,D,R)}catch{return()=>{}}});return()=>_.forEach(D=>D())}})}const F={router:t.router,use(j){return n.includes(j)||(n.push(j),j.install(F)),F},directive(j,N){return c[j]=N,F},component(j,N){return l[j]=N,F},provide(j,N){return typeof j=="string"?k[j]=N:Object.assign(k,j),F},magic(j,N){return P.set(`$${j}`,N),F},mount:async j=>(await V(j),F),mountAll:async(j="[data-courvux]")=>{const N=Array.from(document.querySelectorAll(j));return await Promise.all(N.map(R=>x(R))),F},mountEl:async j=>x(j),unmount(j){if(!j)y.forEach(N=>N()),y.length=0,E.clear();else{const N=document.querySelector(j);if(N){const R=E.get(N);if(R){R(),E.delete(N);const _=y.indexOf(R);_>-1&&y.splice(_,1)}}}return F},destroy(){y.forEach(j=>j()),y.length=0,E.clear()}},x=async j=>{const N=new URL(".",document.baseURI).href,R={components:l,router:t.router,store:t.store,directives:c,baseUrl:N,provided:{...k},errorHandler:t.errorHandler,globalProperties:t.globalProperties,magics:P.size?Object.fromEntries(P):void 0};if(R.mountElement=Ae(R),t.router){const D=t.router;R.mountRouterView=async($,d)=>{await new Promise(a=>{Ze($,D,async(v,S,A,o,h)=>{const f={...R,currentRoute:A};if(h){let C=null;const O={...f,mountRouterView:async(i,r)=>{C=Ze(i,h,async(s,u,m,p)=>{const b={...f,currentRoute:m};if(p){let g=null;const w={...b,mountRouterView:async(T,U)=>{g=await ne(T,u,b)}},{destroy:L}=await ne(s,{template:p},w);return{destroy:()=>{g==null||g.destroy(),L()},activate:()=>g==null?void 0:g.activate(),deactivate:()=>g==null?void 0:g.deactivate()}}else return await ne(s,u,b)},r)}};if(o){let i=null;const r={...O,mountRouterView:async(u,m)=>{i=await ne(u,S,O)}},{destroy:s}=await ne(v,{template:o},r);return{destroy:()=>{C==null||C(),i==null||i.destroy(),s()},activate:()=>i==null?void 0:i.activate(),deactivate:()=>i==null?void 0:i.deactivate()}}else{const i=await ne(v,S,O);return{destroy:()=>{C==null||C(),i.destroy()},activate:()=>i.activate(),deactivate:()=>i.deactivate()}}}else if(o){let C=null;const O={...f,mountRouterView:async(r,s)=>{C=await ne(r,S,f)}},{destroy:i}=await ne(v,{template:o},O);return{destroy:()=>{C==null||C.destroy(),i()},activate:()=>C==null?void 0:C.activate(),deactivate:()=>C==null?void 0:C.deactivate()}}else return await ne(v,S,f)},d,a)})}}const _=await ne(j,t,R);return y.push(_.destroy),E.set(j,_.destroy),_.state},V=async j=>{const N=document.querySelector(j);if(N)return x(N)};return F}var et=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function Wt(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var Oe={exports:{}},tt;function Bt(){return tt||(tt=1,(function(t){var e=typeof window<"u"?window:typeof WorkerGlobalScope<"u"&&self instanceof WorkerGlobalScope?self:{};/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 *
 * @license MIT <https://opensource.org/licenses/MIT>
 * @author Lea Verou <https://lea.verou.me>
 * @namespace
 * @public
 */var n=(function(c){var l=/(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i,y=0,E={},k={manual:c.Prism&&c.Prism.manual,disableWorkerMessageHandler:c.Prism&&c.Prism.disableWorkerMessageHandler,util:{encode:function d(a){return a instanceof P?new P(a.type,d(a.content),a.alias):Array.isArray(a)?a.map(d):a.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/\u00a0/g," ")},type:function(d){return Object.prototype.toString.call(d).slice(8,-1)},objId:function(d){return d.__id||Object.defineProperty(d,"__id",{value:++y}),d.__id},clone:function d(a,v){v=v||{};var S,A;switch(k.util.type(a)){case"Object":if(A=k.util.objId(a),v[A])return v[A];S={},v[A]=S;for(var o in a)a.hasOwnProperty(o)&&(S[o]=d(a[o],v));return S;case"Array":return A=k.util.objId(a),v[A]?v[A]:(S=[],v[A]=S,a.forEach(function(h,f){S[f]=d(h,v)}),S);default:return a}},getLanguage:function(d){for(;d;){var a=l.exec(d.className);if(a)return a[1].toLowerCase();d=d.parentElement}return"none"},setLanguage:function(d,a){d.className=d.className.replace(RegExp(l,"gi"),""),d.classList.add("language-"+a)},currentScript:function(){if(typeof document>"u")return null;if(document.currentScript&&document.currentScript.tagName==="SCRIPT")return document.currentScript;try{throw new Error}catch(S){var d=(/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(S.stack)||[])[1];if(d){var a=document.getElementsByTagName("script");for(var v in a)if(a[v].src==d)return a[v]}return null}},isActive:function(d,a,v){for(var S="no-"+a;d;){var A=d.classList;if(A.contains(a))return!0;if(A.contains(S))return!1;d=d.parentElement}return!!v}},languages:{plain:E,plaintext:E,text:E,txt:E,extend:function(d,a){var v=k.util.clone(k.languages[d]);for(var S in a)v[S]=a[S];return v},insertBefore:function(d,a,v,S){S=S||k.languages;var A=S[d],o={};for(var h in A)if(A.hasOwnProperty(h)){if(h==a)for(var f in v)v.hasOwnProperty(f)&&(o[f]=v[f]);v.hasOwnProperty(h)||(o[h]=A[h])}var C=S[d];return S[d]=o,k.languages.DFS(k.languages,function(O,i){i===C&&O!=d&&(this[O]=o)}),o},DFS:function d(a,v,S,A){A=A||{};var o=k.util.objId;for(var h in a)if(a.hasOwnProperty(h)){v.call(a,h,a[h],S||h);var f=a[h],C=k.util.type(f);C==="Object"&&!A[o(f)]?(A[o(f)]=!0,d(f,v,null,A)):C==="Array"&&!A[o(f)]&&(A[o(f)]=!0,d(f,v,h,A))}}},plugins:{},highlightAll:function(d,a){k.highlightAllUnder(document,d,a)},highlightAllUnder:function(d,a,v){var S={callback:v,container:d,selector:'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'};k.hooks.run("before-highlightall",S),S.elements=Array.prototype.slice.apply(S.container.querySelectorAll(S.selector)),k.hooks.run("before-all-elements-highlight",S);for(var A=0,o;o=S.elements[A++];)k.highlightElement(o,a===!0,S.callback)},highlightElement:function(d,a,v){var S=k.util.getLanguage(d),A=k.languages[S];k.util.setLanguage(d,S);var o=d.parentElement;o&&o.nodeName.toLowerCase()==="pre"&&k.util.setLanguage(o,S);var h=d.textContent,f={element:d,language:S,grammar:A,code:h};function C(i){f.highlightedCode=i,k.hooks.run("before-insert",f),f.element.innerHTML=f.highlightedCode,k.hooks.run("after-highlight",f),k.hooks.run("complete",f),v&&v.call(f.element)}if(k.hooks.run("before-sanity-check",f),o=f.element.parentElement,o&&o.nodeName.toLowerCase()==="pre"&&!o.hasAttribute("tabindex")&&o.setAttribute("tabindex","0"),!f.code){k.hooks.run("complete",f),v&&v.call(f.element);return}if(k.hooks.run("before-highlight",f),!f.grammar){C(k.util.encode(f.code));return}if(a&&c.Worker){var O=new Worker(k.filename);O.onmessage=function(i){C(i.data)},O.postMessage(JSON.stringify({language:f.language,code:f.code,immediateClose:!0}))}else C(k.highlight(f.code,f.grammar,f.language))},highlight:function(d,a,v){var S={code:d,grammar:a,language:v};if(k.hooks.run("before-tokenize",S),!S.grammar)throw new Error('The language "'+S.language+'" has no grammar.');return S.tokens=k.tokenize(S.code,S.grammar),k.hooks.run("after-tokenize",S),P.stringify(k.util.encode(S.tokens),S.language)},tokenize:function(d,a){var v=a.rest;if(v){for(var S in v)a[S]=v[S];delete a.rest}var A=new V;return j(A,A.head,d),x(d,A,a,A.head,0),R(A)},hooks:{all:{},add:function(d,a){var v=k.hooks.all;v[d]=v[d]||[],v[d].push(a)},run:function(d,a){var v=k.hooks.all[d];if(!(!v||!v.length))for(var S=0,A;A=v[S++];)A(a)}},Token:P};c.Prism=k;function P(d,a,v,S){this.type=d,this.content=a,this.alias=v,this.length=(S||"").length|0}P.stringify=function d(a,v){if(typeof a=="string")return a;if(Array.isArray(a)){var S="";return a.forEach(function(C){S+=d(C,v)}),S}var A={type:a.type,content:d(a.content,v),tag:"span",classes:["token",a.type],attributes:{},language:v},o=a.alias;o&&(Array.isArray(o)?Array.prototype.push.apply(A.classes,o):A.classes.push(o)),k.hooks.run("wrap",A);var h="";for(var f in A.attributes)h+=" "+f+'="'+(A.attributes[f]||"").replace(/"/g,"&quot;")+'"';return"<"+A.tag+' class="'+A.classes.join(" ")+'"'+h+">"+A.content+"</"+A.tag+">"};function F(d,a,v,S){d.lastIndex=a;var A=d.exec(v);if(A&&S&&A[1]){var o=A[1].length;A.index+=o,A[0]=A[0].slice(o)}return A}function x(d,a,v,S,A,o){for(var h in v)if(!(!v.hasOwnProperty(h)||!v[h])){var f=v[h];f=Array.isArray(f)?f:[f];for(var C=0;C<f.length;++C){if(o&&o.cause==h+","+C)return;var O=f[C],i=O.inside,r=!!O.lookbehind,s=!!O.greedy,u=O.alias;if(s&&!O.pattern.global){var m=O.pattern.toString().match(/[imsuy]*$/)[0];O.pattern=RegExp(O.pattern.source,m+"g")}for(var p=O.pattern||O,b=S.next,g=A;b!==a.tail&&!(o&&g>=o.reach);g+=b.value.length,b=b.next){var w=b.value;if(a.length>d.length)return;if(!(w instanceof P)){var L=1,T;if(s){if(T=F(p,g,d,r),!T||T.index>=d.length)break;var G=T.index,U=T.index+T[0].length,z=g;for(z+=b.value.length;G>=z;)b=b.next,z+=b.value.length;if(z-=b.value.length,g=z,b.value instanceof P)continue;for(var I=b;I!==a.tail&&(z<U||typeof I.value=="string");I=I.next)L++,z+=I.value.length;L--,w=d.slice(g,z),T.index-=g}else if(T=F(p,0,w,r),!T)continue;var G=T.index,M=T[0],B=w.slice(0,G),K=w.slice(G+M.length),q=g+w.length;o&&q>o.reach&&(o.reach=q);var W=b.prev;B&&(W=j(a,W,B),g+=B.length),N(a,W,L);var ee=new P(h,i?k.tokenize(M,i):M,u,M);if(b=j(a,W,ee),K&&j(a,b,K),L>1){var Z={cause:h+","+C,reach:q};x(d,a,v,b.prev,g,Z),o&&Z.reach>o.reach&&(o.reach=Z.reach)}}}}}}function V(){var d={value:null,prev:null,next:null},a={value:null,prev:d,next:null};d.next=a,this.head=d,this.tail=a,this.length=0}function j(d,a,v){var S=a.next,A={value:v,prev:a,next:S};return a.next=A,S.prev=A,d.length++,A}function N(d,a,v){for(var S=a.next,A=0;A<v&&S!==d.tail;A++)S=S.next;a.next=S,S.prev=a,d.length-=A}function R(d){for(var a=[],v=d.head.next;v!==d.tail;)a.push(v.value),v=v.next;return a}if(!c.document)return c.addEventListener&&(k.disableWorkerMessageHandler||c.addEventListener("message",function(d){var a=JSON.parse(d.data),v=a.language,S=a.code,A=a.immediateClose;c.postMessage(k.highlight(S,k.languages[v],v)),A&&c.close()},!1)),k;var _=k.util.currentScript();_&&(k.filename=_.src,_.hasAttribute("data-manual")&&(k.manual=!0));function D(){k.manual||k.highlightAll()}if(!k.manual){var $=document.readyState;$==="loading"||$==="interactive"&&_&&_.defer?document.addEventListener("DOMContentLoaded",D):window.requestAnimationFrame?window.requestAnimationFrame(D):window.setTimeout(D,16)}return k})(e);t.exports&&(t.exports=n),typeof et<"u"&&(et.Prism=n),n.languages.markup={comment:{pattern:/<!--(?:(?!<!--)[\s\S])*?-->/,greedy:!0},prolog:{pattern:/<\?[\s\S]+?\?>/,greedy:!0},doctype:{pattern:/<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,greedy:!0,inside:{"internal-subset":{pattern:/(^[^\[]*\[)[\s\S]+(?=\]>$)/,lookbehind:!0,greedy:!0,inside:null},string:{pattern:/"[^"]*"|'[^']*'/,greedy:!0},punctuation:/^<!|>$|[[\]]/,"doctype-tag":/^DOCTYPE/i,name:/[^\s<>'"]+/}},cdata:{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,greedy:!0},tag:{pattern:/<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,greedy:!0,inside:{tag:{pattern:/^<\/?[^\s>\/]+/,inside:{punctuation:/^<\/?/,namespace:/^[^\s>\/:]+:/}},"special-attr":[],"attr-value":{pattern:/=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,inside:{punctuation:[{pattern:/^=/,alias:"attr-equals"},{pattern:/^(\s*)["']|["']$/,lookbehind:!0}]}},punctuation:/\/?>/,"attr-name":{pattern:/[^\s>\/]+/,inside:{namespace:/^[^\s>\/:]+:/}}}},entity:[{pattern:/&[\da-z]{1,8};/i,alias:"named-entity"},/&#x?[\da-f]{1,8};/i]},n.languages.markup.tag.inside["attr-value"].inside.entity=n.languages.markup.entity,n.languages.markup.doctype.inside["internal-subset"].inside=n.languages.markup,n.hooks.add("wrap",function(c){c.type==="entity"&&(c.attributes.title=c.content.replace(/&amp;/,"&"))}),Object.defineProperty(n.languages.markup.tag,"addInlined",{value:function(l,y){var E={};E["language-"+y]={pattern:/(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,lookbehind:!0,inside:n.languages[y]},E.cdata=/^<!\[CDATA\[|\]\]>$/i;var k={"included-cdata":{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,inside:E}};k["language-"+y]={pattern:/[\s\S]+/,inside:n.languages[y]};var P={};P[l]={pattern:RegExp(/(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(/__/g,function(){return l}),"i"),lookbehind:!0,greedy:!0,inside:k},n.languages.insertBefore("markup","cdata",P)}}),Object.defineProperty(n.languages.markup.tag,"addAttribute",{value:function(c,l){n.languages.markup.tag.inside["special-attr"].push({pattern:RegExp(/(^|["'\s])/.source+"(?:"+c+")"+/\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source,"i"),lookbehind:!0,inside:{"attr-name":/^[^\s=]+/,"attr-value":{pattern:/=[\s\S]+/,inside:{value:{pattern:/(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,lookbehind:!0,alias:[l,"language-"+l],inside:n.languages[l]},punctuation:[{pattern:/^=/,alias:"attr-equals"},/"|'/]}}}})}}),n.languages.html=n.languages.markup,n.languages.mathml=n.languages.markup,n.languages.svg=n.languages.markup,n.languages.xml=n.languages.extend("markup",{}),n.languages.ssml=n.languages.xml,n.languages.atom=n.languages.xml,n.languages.rss=n.languages.xml,(function(c){var l=/(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;c.languages.css={comment:/\/\*[\s\S]*?\*\//,atrule:{pattern:RegExp("@[\\w-](?:"+/[^;{\s"']|\s+(?!\s)/.source+"|"+l.source+")*?"+/(?:;|(?=\s*\{))/.source),inside:{rule:/^@[\w-]+/,"selector-function-argument":{pattern:/(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,lookbehind:!0,alias:"selector"},keyword:{pattern:/(^|[^\w-])(?:and|not|only|or)(?![\w-])/,lookbehind:!0}}},url:{pattern:RegExp("\\burl\\((?:"+l.source+"|"+/(?:[^\\\r\n()"']|\\[\s\S])*/.source+")\\)","i"),greedy:!0,inside:{function:/^url/i,punctuation:/^\(|\)$/,string:{pattern:RegExp("^"+l.source+"$"),alias:"url"}}},selector:{pattern:RegExp(`(^|[{}\\s])[^{}\\s](?:[^{};"'\\s]|\\s+(?![\\s{])|`+l.source+")*(?=\\s*\\{)"),lookbehind:!0},string:{pattern:l,greedy:!0},property:{pattern:/(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,lookbehind:!0},important:/!important\b/i,function:{pattern:/(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i,lookbehind:!0},punctuation:/[(){};:,]/},c.languages.css.atrule.inside.rest=c.languages.css;var y=c.languages.markup;y&&(y.tag.addInlined("style","css"),y.tag.addAttribute("style","css"))})(n),n.languages.clike={comment:[{pattern:/(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,lookbehind:!0,greedy:!0},{pattern:/(^|[^\\:])\/\/.*/,lookbehind:!0,greedy:!0}],string:{pattern:/(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,greedy:!0},"class-name":{pattern:/(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,lookbehind:!0,inside:{punctuation:/[.\\]/}},keyword:/\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,boolean:/\b(?:false|true)\b/,function:/\b\w+(?=\()/,number:/\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,operator:/[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,punctuation:/[{}[\];(),.:]/},n.languages.javascript=n.languages.extend("clike",{"class-name":[n.languages.clike["class-name"],{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,lookbehind:!0}],keyword:[{pattern:/((?:^|\})\s*)catch\b/,lookbehind:!0},{pattern:/(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,lookbehind:!0}],function:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,number:{pattern:RegExp(/(^|[^\w$])/.source+"(?:"+(/NaN|Infinity/.source+"|"+/0[bB][01]+(?:_[01]+)*n?/.source+"|"+/0[oO][0-7]+(?:_[0-7]+)*n?/.source+"|"+/0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source+"|"+/\d+(?:_\d+)*n/.source+"|"+/(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/.source)+")"+/(?![\w$])/.source),lookbehind:!0},operator:/--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/}),n.languages.javascript["class-name"][0].pattern=/(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/,n.languages.insertBefore("javascript","keyword",{regex:{pattern:RegExp(/((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)/.source+/\//.source+"(?:"+/(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}/.source+"|"+/(?:\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.)*\])*\])*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}v[dgimyus]{0,7}/.source+")"+/(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/.source),lookbehind:!0,greedy:!0,inside:{"regex-source":{pattern:/^(\/)[\s\S]+(?=\/[a-z]*$)/,lookbehind:!0,alias:"language-regex",inside:n.languages.regex},"regex-delimiter":/^\/|\/$/,"regex-flags":/^[a-z]+$/}},"function-variable":{pattern:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,alias:"function"},parameter:[{pattern:/(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,lookbehind:!0,inside:n.languages.javascript},{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,lookbehind:!0,inside:n.languages.javascript},{pattern:/(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,lookbehind:!0,inside:n.languages.javascript},{pattern:/((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,lookbehind:!0,inside:n.languages.javascript}],constant:/\b[A-Z](?:[A-Z_]|\dx?)*\b/}),n.languages.insertBefore("javascript","string",{hashbang:{pattern:/^#!.*/,greedy:!0,alias:"comment"},"template-string":{pattern:/`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,greedy:!0,inside:{"template-punctuation":{pattern:/^`|`$/,alias:"string"},interpolation:{pattern:/((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,lookbehind:!0,inside:{"interpolation-punctuation":{pattern:/^\$\{|\}$/,alias:"punctuation"},rest:n.languages.javascript}},string:/[\s\S]+/}},"string-property":{pattern:/((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,lookbehind:!0,greedy:!0,alias:"property"}}),n.languages.insertBefore("javascript","operator",{"literal-property":{pattern:/((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,lookbehind:!0,alias:"property"}}),n.languages.markup&&(n.languages.markup.tag.addInlined("script","javascript"),n.languages.markup.tag.addAttribute(/on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/.source,"javascript")),n.languages.js=n.languages.javascript,(function(){if(typeof n>"u"||typeof document>"u")return;Element.prototype.matches||(Element.prototype.matches=Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector);var c="Loading…",l=function(_,D){return"✖ Error "+_+" while fetching file: "+D},y="✖ Error: File does not exist or is empty",E={js:"javascript",py:"python",rb:"ruby",ps1:"powershell",psm1:"powershell",sh:"bash",bat:"batch",h:"c",tex:"latex"},k="data-src-status",P="loading",F="loaded",x="failed",V="pre[data-src]:not(["+k+'="'+F+'"]):not(['+k+'="'+P+'"])';function j(_,D,$){var d=new XMLHttpRequest;d.open("GET",_,!0),d.onreadystatechange=function(){d.readyState==4&&(d.status<400&&d.responseText?D(d.responseText):d.status>=400?$(l(d.status,d.statusText)):$(y))},d.send(null)}function N(_){var D=/^\s*(\d+)\s*(?:(,)\s*(?:(\d+)\s*)?)?$/.exec(_||"");if(D){var $=Number(D[1]),d=D[2],a=D[3];return d?a?[$,Number(a)]:[$,void 0]:[$,$]}}n.hooks.add("before-highlightall",function(_){_.selector+=", "+V}),n.hooks.add("before-sanity-check",function(_){var D=_.element;if(D.matches(V)){_.code="",D.setAttribute(k,P);var $=D.appendChild(document.createElement("CODE"));$.textContent=c;var d=D.getAttribute("data-src"),a=_.language;if(a==="none"){var v=(/\.(\w+)$/.exec(d)||[,"none"])[1];a=E[v]||v}n.util.setLanguage($,a),n.util.setLanguage(D,a);var S=n.plugins.autoloader;S&&S.loadLanguages(a),j(d,function(A){D.setAttribute(k,F);var o=N(D.getAttribute("data-range"));if(o){var h=A.split(/\r\n?|\n/g),f=o[0],C=o[1]==null?h.length:o[1];f<0&&(f+=h.length),f=Math.max(0,Math.min(f-1,h.length)),C<0&&(C+=h.length),C=Math.max(0,Math.min(C,h.length)),A=h.slice(f,C).join(`
`),D.hasAttribute("data-start")||D.setAttribute("data-start",String(f+1))}$.textContent=A,n.highlightElement($)},function(A){D.setAttribute(k,x),$.textContent=A})}}),n.plugins.fileHighlight={highlight:function(D){for(var $=(D||document).querySelectorAll(V),d=0,a;a=$[d++];)n.highlightElement(a)}};var R=!1;n.fileHighlight=function(){R||(console.warn("Prism.fileHighlight is deprecated. Use `Prism.plugins.fileHighlight.highlight` instead."),R=!0),n.plugins.fileHighlight.highlight.apply(this,arguments)}})()})(Oe)),Oe.exports}var qt=Bt();const Vt=Wt(qt);Prism.languages.javascript=Prism.languages.extend("clike",{"class-name":[Prism.languages.clike["class-name"],{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,lookbehind:!0}],keyword:[{pattern:/((?:^|\})\s*)catch\b/,lookbehind:!0},{pattern:/(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,lookbehind:!0}],function:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,number:{pattern:RegExp(/(^|[^\w$])/.source+"(?:"+(/NaN|Infinity/.source+"|"+/0[bB][01]+(?:_[01]+)*n?/.source+"|"+/0[oO][0-7]+(?:_[0-7]+)*n?/.source+"|"+/0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source+"|"+/\d+(?:_\d+)*n/.source+"|"+/(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/.source)+")"+/(?![\w$])/.source),lookbehind:!0},operator:/--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/});Prism.languages.javascript["class-name"][0].pattern=/(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/;Prism.languages.insertBefore("javascript","keyword",{regex:{pattern:RegExp(/((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)/.source+/\//.source+"(?:"+/(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}/.source+"|"+/(?:\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.)*\])*\])*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}v[dgimyus]{0,7}/.source+")"+/(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/.source),lookbehind:!0,greedy:!0,inside:{"regex-source":{pattern:/^(\/)[\s\S]+(?=\/[a-z]*$)/,lookbehind:!0,alias:"language-regex",inside:Prism.languages.regex},"regex-delimiter":/^\/|\/$/,"regex-flags":/^[a-z]+$/}},"function-variable":{pattern:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,alias:"function"},parameter:[{pattern:/(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,lookbehind:!0,inside:Prism.languages.javascript},{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,lookbehind:!0,inside:Prism.languages.javascript},{pattern:/(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,lookbehind:!0,inside:Prism.languages.javascript},{pattern:/((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,lookbehind:!0,inside:Prism.languages.javascript}],constant:/\b[A-Z](?:[A-Z_]|\dx?)*\b/});Prism.languages.insertBefore("javascript","string",{hashbang:{pattern:/^#!.*/,greedy:!0,alias:"comment"},"template-string":{pattern:/`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,greedy:!0,inside:{"template-punctuation":{pattern:/^`|`$/,alias:"string"},interpolation:{pattern:/((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,lookbehind:!0,inside:{"interpolation-punctuation":{pattern:/^\$\{|\}$/,alias:"punctuation"},rest:Prism.languages.javascript}},string:/[\s\S]+/}},"string-property":{pattern:/((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,lookbehind:!0,greedy:!0,alias:"property"}});Prism.languages.insertBefore("javascript","operator",{"literal-property":{pattern:/((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,lookbehind:!0,alias:"property"}});Prism.languages.markup&&(Prism.languages.markup.tag.addInlined("script","javascript"),Prism.languages.markup.tag.addAttribute(/on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/.source,"javascript"));Prism.languages.js=Prism.languages.javascript;Prism.languages.markup={comment:{pattern:/<!--(?:(?!<!--)[\s\S])*?-->/,greedy:!0},prolog:{pattern:/<\?[\s\S]+?\?>/,greedy:!0},doctype:{pattern:/<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,greedy:!0,inside:{"internal-subset":{pattern:/(^[^\[]*\[)[\s\S]+(?=\]>$)/,lookbehind:!0,greedy:!0,inside:null},string:{pattern:/"[^"]*"|'[^']*'/,greedy:!0},punctuation:/^<!|>$|[[\]]/,"doctype-tag":/^DOCTYPE/i,name:/[^\s<>'"]+/}},cdata:{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,greedy:!0},tag:{pattern:/<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,greedy:!0,inside:{tag:{pattern:/^<\/?[^\s>\/]+/,inside:{punctuation:/^<\/?/,namespace:/^[^\s>\/:]+:/}},"special-attr":[],"attr-value":{pattern:/=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,inside:{punctuation:[{pattern:/^=/,alias:"attr-equals"},{pattern:/^(\s*)["']|["']$/,lookbehind:!0}]}},punctuation:/\/?>/,"attr-name":{pattern:/[^\s>\/]+/,inside:{namespace:/^[^\s>\/:]+:/}}}},entity:[{pattern:/&[\da-z]{1,8};/i,alias:"named-entity"},/&#x?[\da-f]{1,8};/i]};Prism.languages.markup.tag.inside["attr-value"].inside.entity=Prism.languages.markup.entity;Prism.languages.markup.doctype.inside["internal-subset"].inside=Prism.languages.markup;Prism.hooks.add("wrap",function(t){t.type==="entity"&&(t.attributes.title=t.content.replace(/&amp;/,"&"))});Object.defineProperty(Prism.languages.markup.tag,"addInlined",{value:function(e,n){var c={};c["language-"+n]={pattern:/(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,lookbehind:!0,inside:Prism.languages[n]},c.cdata=/^<!\[CDATA\[|\]\]>$/i;var l={"included-cdata":{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,inside:c}};l["language-"+n]={pattern:/[\s\S]+/,inside:Prism.languages[n]};var y={};y[e]={pattern:RegExp(/(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(/__/g,function(){return e}),"i"),lookbehind:!0,greedy:!0,inside:l},Prism.languages.insertBefore("markup","cdata",y)}});Object.defineProperty(Prism.languages.markup.tag,"addAttribute",{value:function(t,e){Prism.languages.markup.tag.inside["special-attr"].push({pattern:RegExp(/(^|["'\s])/.source+"(?:"+t+")"+/\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source,"i"),lookbehind:!0,inside:{"attr-name":/^[^\s=]+/,"attr-value":{pattern:/=[\s\S]+/,inside:{value:{pattern:/(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,lookbehind:!0,alias:[e,"language-"+e],inside:Prism.languages[e]},punctuation:[{pattern:/^=/,alias:"attr-equals"},/"|'/]}}}})}});Prism.languages.html=Prism.languages.markup;Prism.languages.mathml=Prism.languages.markup;Prism.languages.svg=Prism.languages.markup;Prism.languages.xml=Prism.languages.extend("markup",{});Prism.languages.ssml=Prism.languages.xml;Prism.languages.atom=Prism.languages.xml;Prism.languages.rss=Prism.languages.xml;(function(t){var e="\\b(?:BASH|BASHOPTS|BASH_ALIASES|BASH_ARGC|BASH_ARGV|BASH_CMDS|BASH_COMPLETION_COMPAT_DIR|BASH_LINENO|BASH_REMATCH|BASH_SOURCE|BASH_VERSINFO|BASH_VERSION|COLORTERM|COLUMNS|COMP_WORDBREAKS|DBUS_SESSION_BUS_ADDRESS|DEFAULTS_PATH|DESKTOP_SESSION|DIRSTACK|DISPLAY|EUID|GDMSESSION|GDM_LANG|GNOME_KEYRING_CONTROL|GNOME_KEYRING_PID|GPG_AGENT_INFO|GROUPS|HISTCONTROL|HISTFILE|HISTFILESIZE|HISTSIZE|HOME|HOSTNAME|HOSTTYPE|IFS|INSTANCE|JOB|LANG|LANGUAGE|LC_ADDRESS|LC_ALL|LC_IDENTIFICATION|LC_MEASUREMENT|LC_MONETARY|LC_NAME|LC_NUMERIC|LC_PAPER|LC_TELEPHONE|LC_TIME|LESSCLOSE|LESSOPEN|LINES|LOGNAME|LS_COLORS|MACHTYPE|MAILCHECK|MANDATORY_PATH|NO_AT_BRIDGE|OLDPWD|OPTERR|OPTIND|ORBIT_SOCKETDIR|OSTYPE|PAPERSIZE|PATH|PIPESTATUS|PPID|PS1|PS2|PS3|PS4|PWD|RANDOM|REPLY|SECONDS|SELINUX_INIT|SESSION|SESSIONTYPE|SESSION_MANAGER|SHELL|SHELLOPTS|SHLVL|SSH_AUTH_SOCK|TERM|UID|UPSTART_EVENTS|UPSTART_INSTANCE|UPSTART_JOB|UPSTART_SESSION|USER|WINDOWID|XAUTHORITY|XDG_CONFIG_DIRS|XDG_CURRENT_DESKTOP|XDG_DATA_DIRS|XDG_GREETER_DATA_DIR|XDG_MENU_PREFIX|XDG_RUNTIME_DIR|XDG_SEAT|XDG_SEAT_PATH|XDG_SESSION_DESKTOP|XDG_SESSION_ID|XDG_SESSION_PATH|XDG_SESSION_TYPE|XDG_VTNR|XMODIFIERS)\\b",n={pattern:/(^(["']?)\w+\2)[ \t]+\S.*/,lookbehind:!0,alias:"punctuation",inside:null},c={bash:n,environment:{pattern:RegExp("\\$"+e),alias:"constant"},variable:[{pattern:/\$?\(\([\s\S]+?\)\)/,greedy:!0,inside:{variable:[{pattern:/(^\$\(\([\s\S]+)\)\)/,lookbehind:!0},/^\$\(\(/],number:/\b0x[\dA-Fa-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:[Ee]-?\d+)?/,operator:/--|\+\+|\*\*=?|<<=?|>>=?|&&|\|\||[=!+\-*/%<>^&|]=?|[?~:]/,punctuation:/\(\(?|\)\)?|,|;/}},{pattern:/\$\((?:\([^)]+\)|[^()])+\)|`[^`]+`/,greedy:!0,inside:{variable:/^\$\(|^`|\)$|`$/}},{pattern:/\$\{[^}]+\}/,greedy:!0,inside:{operator:/:[-=?+]?|[!\/]|##?|%%?|\^\^?|,,?/,punctuation:/[\[\]]/,environment:{pattern:RegExp("(\\{)"+e),lookbehind:!0,alias:"constant"}}},/\$(?:\w+|[#?*!@$])/],entity:/\\(?:[abceEfnrtv\\"]|O?[0-7]{1,3}|U[0-9a-fA-F]{8}|u[0-9a-fA-F]{4}|x[0-9a-fA-F]{1,2})/};t.languages.bash={shebang:{pattern:/^#!\s*\/.*/,alias:"important"},comment:{pattern:/(^|[^"{\\$])#.*/,lookbehind:!0},"function-name":[{pattern:/(\bfunction\s+)[\w-]+(?=(?:\s*\(?:\s*\))?\s*\{)/,lookbehind:!0,alias:"function"},{pattern:/\b[\w-]+(?=\s*\(\s*\)\s*\{)/,alias:"function"}],"for-or-select":{pattern:/(\b(?:for|select)\s+)\w+(?=\s+in\s)/,alias:"variable",lookbehind:!0},"assign-left":{pattern:/(^|[\s;|&]|[<>]\()\w+(?:\.\w+)*(?=\+?=)/,inside:{environment:{pattern:RegExp("(^|[\\s;|&]|[<>]\\()"+e),lookbehind:!0,alias:"constant"}},alias:"variable",lookbehind:!0},parameter:{pattern:/(^|\s)-{1,2}(?:\w+:[+-]?)?\w+(?:\.\w+)*(?=[=\s]|$)/,alias:"variable",lookbehind:!0},string:[{pattern:/((?:^|[^<])<<-?\s*)(\w+)\s[\s\S]*?(?:\r?\n|\r)\2/,lookbehind:!0,greedy:!0,inside:c},{pattern:/((?:^|[^<])<<-?\s*)(["'])(\w+)\2\s[\s\S]*?(?:\r?\n|\r)\3/,lookbehind:!0,greedy:!0,inside:{bash:n}},{pattern:/(^|[^\\](?:\\\\)*)"(?:\\[\s\S]|\$\([^)]+\)|\$(?!\()|`[^`]+`|[^"\\`$])*"/,lookbehind:!0,greedy:!0,inside:c},{pattern:/(^|[^$\\])'[^']*'/,lookbehind:!0,greedy:!0},{pattern:/\$'(?:[^'\\]|\\[\s\S])*'/,greedy:!0,inside:{entity:c.entity}}],environment:{pattern:RegExp("\\$?"+e),alias:"constant"},variable:c.variable,function:{pattern:/(^|[\s;|&]|[<>]\()(?:add|apropos|apt|apt-cache|apt-get|aptitude|aspell|automysqlbackup|awk|basename|bash|bc|bconsole|bg|bzip2|cal|cargo|cat|cfdisk|chgrp|chkconfig|chmod|chown|chroot|cksum|clear|cmp|column|comm|composer|cp|cron|crontab|csplit|curl|cut|date|dc|dd|ddrescue|debootstrap|df|diff|diff3|dig|dir|dircolors|dirname|dirs|dmesg|docker|docker-compose|du|egrep|eject|env|ethtool|expand|expect|expr|fdformat|fdisk|fg|fgrep|file|find|fmt|fold|format|free|fsck|ftp|fuser|gawk|git|gparted|grep|groupadd|groupdel|groupmod|groups|grub-mkconfig|gzip|halt|head|hg|history|host|hostname|htop|iconv|id|ifconfig|ifdown|ifup|import|install|ip|java|jobs|join|kill|killall|less|link|ln|locate|logname|logrotate|look|lpc|lpr|lprint|lprintd|lprintq|lprm|ls|lsof|lynx|make|man|mc|mdadm|mkconfig|mkdir|mke2fs|mkfifo|mkfs|mkisofs|mknod|mkswap|mmv|more|most|mount|mtools|mtr|mutt|mv|nano|nc|netstat|nice|nl|node|nohup|notify-send|npm|nslookup|op|open|parted|passwd|paste|pathchk|ping|pkill|pnpm|podman|podman-compose|popd|pr|printcap|printenv|ps|pushd|pv|quota|quotacheck|quotactl|ram|rar|rcp|reboot|remsync|rename|renice|rev|rm|rmdir|rpm|rsync|scp|screen|sdiff|sed|sendmail|seq|service|sftp|sh|shellcheck|shuf|shutdown|sleep|slocate|sort|split|ssh|stat|strace|su|sudo|sum|suspend|swapon|sync|sysctl|tac|tail|tar|tee|time|timeout|top|touch|tr|traceroute|tsort|tty|umount|uname|unexpand|uniq|units|unrar|unshar|unzip|update-grub|uptime|useradd|userdel|usermod|users|uudecode|uuencode|v|vcpkg|vdir|vi|vim|virsh|vmstat|wait|watch|wc|wget|whereis|which|who|whoami|write|xargs|xdg-open|yarn|yes|zenity|zip|zsh|zypper)(?=$|[)\s;|&])/,lookbehind:!0},keyword:{pattern:/(^|[\s;|&]|[<>]\()(?:case|do|done|elif|else|esac|fi|for|function|if|in|select|then|until|while)(?=$|[)\s;|&])/,lookbehind:!0},builtin:{pattern:/(^|[\s;|&]|[<>]\()(?:\.|:|alias|bind|break|builtin|caller|cd|command|continue|declare|echo|enable|eval|exec|exit|export|getopts|hash|help|let|local|logout|mapfile|printf|pwd|read|readarray|readonly|return|set|shift|shopt|source|test|times|trap|type|typeset|ulimit|umask|unalias|unset)(?=$|[)\s;|&])/,lookbehind:!0,alias:"class-name"},boolean:{pattern:/(^|[\s;|&]|[<>]\()(?:false|true)(?=$|[)\s;|&])/,lookbehind:!0},"file-descriptor":{pattern:/\B&\d\b/,alias:"important"},operator:{pattern:/\d?<>|>\||\+=|=[=~]?|!=?|<<[<-]?|[&\d]?>>|\d[<>]&?|[<>][&=]?|&[>&]?|\|[&|]?/,inside:{"file-descriptor":{pattern:/^\d/,alias:"important"}}},punctuation:/\$?\(\(?|\)\)?|\.\.|[{}[\];\\]/,number:{pattern:/(^|\s)(?:[1-9]\d*|0)(?:[.,]\d+)?\b/,lookbehind:!0}},n.inside=t.languages.bash;for(var l=["comment","function-name","for-or-select","assign-left","parameter","string","environment","function","keyword","builtin","boolean","file-descriptor","operator","punctuation","number"],y=c.variable[1].inside,E=0;E<l.length;E++)y[l[E]]=t.languages.bash[l[E]];t.languages.sh=t.languages.bash,t.languages.shell=t.languages.bash})(Prism);Prism.languages.json={property:{pattern:/(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?=\s*:)/,lookbehind:!0,greedy:!0},string:{pattern:/(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?!\s*:)/,lookbehind:!0,greedy:!0},comment:{pattern:/\/\/.*|\/\*[\s\S]*?(?:\*\/|$)/,greedy:!0},number:/-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i,punctuation:/[{}[\],]/,operator:/:/,boolean:/\b(?:false|true)\b/,null:{pattern:/\bnull\b/,alias:"keyword"}};Prism.languages.webmanifest=Prism.languages.json;var nt={},ot;function Gt(){return ot||(ot=1,(function(t){t.languages.typescript=t.languages.extend("javascript",{"class-name":{pattern:/(\b(?:class|extends|implements|instanceof|interface|new|type)\s+)(?!keyof\b)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?:\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>)?/,lookbehind:!0,greedy:!0,inside:null},builtin:/\b(?:Array|Function|Promise|any|boolean|console|never|number|string|symbol|unknown)\b/}),t.languages.typescript.keyword.push(/\b(?:abstract|declare|is|keyof|readonly|require)\b/,/\b(?:asserts|infer|interface|module|namespace|type)\b(?=\s*(?:[{_$a-zA-Z\xA0-\uFFFF]|$))/,/\btype\b(?=\s*(?:[\{*]|$))/),delete t.languages.typescript.parameter,delete t.languages.typescript["literal-property"];var e=t.languages.extend("typescript",{});delete e["class-name"],t.languages.typescript["class-name"].inside=e,t.languages.insertBefore("typescript","function",{decorator:{pattern:/@[$\w\xA0-\uFFFF]+/,inside:{at:{pattern:/^@/,alias:"operator"},function:/^[\s\S]+/}},"generic-function":{pattern:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>(?=\s*\()/,greedy:!0,inside:{function:/^#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*/,generic:{pattern:/<[\s\S]+/,alias:"class-name",inside:e}}}}),t.languages.ts=t.languages.typescript})(Prism)),nt}Gt();const Yt={js:"JavaScript",ts:"TypeScript",html:"HTML",bash:"Shell",json:"JSON"};function Xt(t){const e=t.split(`
`);for(;e.length&&!e[0].trim();)e.shift();for(;e.length&&!e[e.length-1].trim();)e.pop();const n=e.filter(c=>c.trim()).reduce((c,l)=>Math.min(c,l.match(/^(\s*)/)[1].length),1/0);return e.map(c=>c.slice(n)).join(`
`)}const Zt={data:{lang:"js",code:"",label:"",copied:!1},template:`
        <div class="code-block">
            <div class="code-header">
                <span class="code-lang">{{ label || langLabel }}</span>
                <button class="copy-btn" @click="copy()">
                    {{ copied ? '✓ Copied' : 'Copy' }}
                </button>
            </div>
            <pre class="language-placeholder"><code cv-ref="el" :class="'language-' + lang"></code></pre>
        </div>
    `,computed:{langLabel(){return Yt[this.lang]||this.lang.toUpperCase()}},methods:{copy(){var t;(t=navigator.clipboard)==null||t.writeText(this._cleanCode).then(()=>{this.copied=!0,setTimeout(()=>{this.copied=!1},1800)})}},onMount(){const t=this.$refs.el;t&&(this._cleanCode=Xt(this.code),t.textContent=this._cleanCode,Vt.highlightElement(t))}},he="Courvux",Jt="https://vanjexdev.github.io/courvux";function re({title:t,description:e,slug:n="/"}){const c=t?`${t} — ${he}`:`${he} — Lightweight reactive UI framework`,l=Jt+n;return Nt({title:t??`${he} — Lightweight reactive UI framework`,titleTemplate:t?`%s — ${he}`:void 0,meta:[{name:"description",content:e},{property:"og:title",content:c},{property:"og:description",content:e},{property:"og:type",content:"website"},{property:"og:url",content:l},{property:"og:site_name",content:he},{name:"twitter:card",content:"summary_large_image"},{name:"twitter:title",content:c},{name:"twitter:description",content:e}],link:[{rel:"canonical",href:l}]})}const Kt={data:{install:`# From GitHub
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
                    <span class="badge">v0.3.0</span>
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
    `,onMount(){re({description:"Lightweight reactive UI framework for the browser. No virtual DOM. Proxy-based reactivity. ~10 KB gzip.",slug:"/"})}},Qt={data:{s1:`npm install github:vanjexdev/courvux
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
<\/script>`},onMount(){re({title:"Installation",description:"Install Courvux via npm, GitHub, or import map. Vite plugin for templateUrl inlining and CDN setup with jsDelivr.",slug:"/installation"});const t=this.$refs.pen;if(!t)return;const e=document.createElement("iframe");e.src="https://codepen.io/jesusuzcategui-the-bold/embed/VYmZNgZ?default-tab=html%2Cresult&theme-id=dark",e.height="420",e.style.cssText="width:100%; border:0; border-radius:8px; display:block; margin-bottom:1rem;",e.scrolling="no",e.setAttribute("frameborder","no"),e.setAttribute("allowtransparency","true"),e.allowFullscreen=!0,e.title="Courvux CDN demo on CodePen",t.replaceWith(e)},template:`
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
    `},en={data:{s1:`import { createApp } from 'courvux';

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
    `,onMount(){re({title:"Quick Start",description:"Build your first reactive Courvux app — counter example, methods, computed properties.",slug:"/quick-start"})}},tn={data:{s_interp:`<!-- Text interpolation -->
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
    `,onMount(){re({title:"Template Syntax",description:"Courvux directives and bindings: cv-if, cv-for, cv-model, cv-show, :class, :style, @event.",slug:"/template"})}},nn={data:{s_define:`createApp({
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
    `,onMount(){re({title:"Components",description:"Define, register, and compose Courvux components with props, slots, emits, and scoped slots.",slug:"/components"})}},on={data:{s_computed:`{
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
    `,onMount(){re({title:"Reactivity",description:"Proxy-based reactive state, computed properties, watchers, and refs in Courvux.",slug:"/reactivity"})}},rn={data:{s1:`{
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
    `,onMount(){re({title:"Lifecycle Hooks",description:"onMount, onBeforeUnmount, onDestroy, error boundaries, and async data in Courvux.",slug:"/lifecycle"})}},an={data:{s_setup:`import { createApp, createRouter } from 'courvux';

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
    `,onMount(){re({title:"Router",description:"SPA routing in Courvux: dynamic params, nested routes, navigation guards, transitions.",slug:"/router"})}},sn={data:{s1:`import { createStore } from 'courvux';

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
    `,onMount(){re({title:"Store",description:"Global reactive state in Courvux with createStore, modules, and namespaced actions.",slug:"/store"})}},cn={data:{s_dir:`// Full definition
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
    `,onMount(){re({title:"Advanced",description:"Custom directives, plugins, transitions, and the cv-data inline scope in Courvux.",slug:"/advanced"})}},pt="courvux-demo-todos",ln=`const STORAGE_KEY = 'courvux-demo-todos';

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
};`,dn=`<!-- Input -->
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
<button cv-show="todos.some(t => t.done)" @click="clearCompleted()">Clear completed</button>`;function un(){try{return JSON.parse(localStorage.getItem(pt))||[]}catch{return[]}}function pn(t){localStorage.setItem(pt,JSON.stringify(t))}const mn={data:{todos:un(),newTodo:"",filter:"all",editingId:null,editText:"",_nextId:Date.now(),srcJs:ln,srcHtml:dn,srcTab:"js"},computed:{filteredTodos(){return this.filter==="active"?this.todos.filter(t=>!t.done):this.filter==="completed"?this.todos.filter(t=>t.done):this.todos},remaining(){return this.todos.filter(t=>!t.done).length},allDone(){return this.todos.length>0&&this.todos.every(t=>t.done)}},watch:{todos:{deep:!0,handler(t){pn(t)}}},methods:{add(){const t=this.newTodo.trim();t&&(this.todos=[...this.todos,{id:this._nextId++,text:t,done:!1}],this.newTodo="")},toggle(t){this.todos=this.todos.map(e=>e.id===t?{...e,done:!e.done}:e)},remove(t){this.todos=this.todos.filter(e=>e.id!==t)},clearCompleted(){this.todos=this.todos.filter(t=>!t.done)},toggleAll(){const t=this.allDone;this.todos=this.todos.map(e=>({...e,done:!t}))},startEdit(t){this.editingId=t.id,this.editText=t.text,this.$nextTick(()=>{var e;return(e=this.$refs["edit_"+t.id])==null?void 0:e.focus()})},commitEdit(t){const e=this.editText.trim();e?this.todos=this.todos.map(n=>n.id===t?{...n,text:e}:n):this.remove(t),this.editingId=null,this.editText=""},cancelEdit(){this.editingId=null,this.editText=""},setFilter(t){this.filter=t}},template:`
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
    `,onMount(){re({title:"Demo — TODO App",description:"Interactive TODO app built with Courvux. Live demo with full source code (JS + HTML).",slug:"/demo"})}},hn=[{path:"/",component:Kt},{path:"/installation",component:Qt},{path:"/quick-start",component:en},{path:"/template",component:tn},{path:"/components",component:nn},{path:"/reactivity",component:on},{path:"/lifecycle",component:rn},{path:"/router",component:an},{path:"/store",component:sn},{path:"/advanced",component:cn},{path:"/demo",component:mn}],fn={template:`
        <div style="text-align:center; padding:4rem 0;">
            <p style="font-size:3rem; margin-bottom:1rem;">404</p>
            <p style="color:#666; font-size:14px; margin-bottom:1.5rem;">Page not found.</p>
            <router-link to="/" style="font-size:13px; color:#111;">← Back to home</router-link>
        </div>
    `},vn=$t([...hn,{path:"*",component:fn}],{mode:"history",base:"/courvux"}),rt=[{key:"start",label:"Getting Started",items:[{to:"/",label:"Introduction"},{to:"/installation",label:"Installation"},{to:"/quick-start",label:"Quick Start"}]},{key:"template",label:"Template Syntax",items:[{to:"/template",label:"Directives & Bindings"}]},{key:"components",label:"Components",items:[{to:"/components",label:"Components"},{to:"/reactivity",label:"Reactivity"},{to:"/lifecycle",label:"Lifecycle"}]},{key:"router",label:"Router & Store",items:[{to:"/router",label:"Router"},{to:"/store",label:"Store"}]},{key:"advanced",label:"Advanced",items:[{to:"/advanced",label:"Directives & Plugins"}]},{key:"demo",label:"Demo",items:[{to:"/demo",label:"⚡ TODO App"}]}];Ut({router:vn,components:{"code-block":Zt},data:{nav:rt,open:rt.reduce((t,e)=>(t[e.key]=!0,t),{})},methods:{toggle(t){this.open={...this.open,[t]:!this.open[t]}}},template:`
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
                        <span style="font-size:10px; color:#999; margin-left:2px;">v0.3.0</span>
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
                        <a href="https://ko-fi.com/vanjexdev"
                           target="_blank"
                           style="color:#888; text-decoration:none;"
                           @mouseover="$event.target.style.color='#111'"
                           @mouseout="$event.target.style.color='#888'"
                        >♥ Buy me a coffee</a>
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
