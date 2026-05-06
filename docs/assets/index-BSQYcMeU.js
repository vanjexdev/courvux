(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const u of s)if(u.type==="childList")for(const k of u.addedNodes)k.tagName==="LINK"&&k.rel==="modulepreload"&&i(k)}).observe(document,{childList:!0,subtree:!0});function o(s){const u={};return s.integrity&&(u.integrity=s.integrity),s.referrerPolicy&&(u.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?u.credentials="include":s.crossOrigin==="anonymous"?u.credentials="omit":u.credentials="same-origin",u}function i(s){if(s.ep)return;s.ep=!0;const u=o(s);fetch(s.href,u)}})();var $t=new Set(["push","pop","shift","unshift","splice","sort","reverse"]),gt=e=>e instanceof Date||e instanceof RegExp||e instanceof Map||e instanceof Set||e instanceof WeakMap||e instanceof WeakSet||ArrayBuffer.isView(e)||e instanceof ArrayBuffer,Le=new WeakSet,Te=Symbol("raw"),Fe=e=>e===null||typeof e!="object"?e:e[Te]??e,_e=0,Re=new Map,be=null;function Be(e){const t=[],o=be;be=t;try{e()}finally{be=o}return t}function Et(e){_e++;try{e()}finally{if(_e--,_e===0){const t=[...Re.values()];Re.clear(),t.forEach(o=>o())}}}function vt(e,t){return e===null||typeof e!="object"||Le.has(e)||gt(e)?e:new Proxy(e,{get(o,i){if(i===Te)return o[Te]??o;if(typeof i=="string"&&Array.isArray(o)&&$t.has(i))return(...u)=>{const k=Array.prototype[i].apply(o,u);return t(),k};const s=o[i];return s!==null&&typeof s=="object"&&!Le.has(s)?vt(s,t):s},set(o,i,s){return o[i]=s,t(),!0}})}function ze(){const e={},t=Math.random().toString(36).slice(2),o=(u,k)=>(e[u]||(e[u]=new Set),e[u].add(k),()=>{var g;(g=e[u])==null||g.delete(k)}),i=u=>{_e>0?Re.set(`${t}:${u}`,()=>{(e[u]?[...e[u]]:[]).forEach(k=>k())}):(e[u]?[...e[u]]:[]).forEach(k=>k())},s={};return{subscribe:o,createReactiveState:u=>new Proxy(u,{get(k,g){if(g===Te)return u;typeof g=="string"&&!g.startsWith("$")&&be&&be.push({sub:o,key:g});const D=k[g];return typeof g=="string"&&!g.startsWith("$")&&D!==null&&typeof D=="object"&&!Le.has(D)&&!gt(D)?vt(D,()=>i(g)):D},set(k,g,D){if(s[g])return s[g](D),!0;const $=k[g];return k[g]=D,($!==D||D!==null&&typeof D=="object")&&i(g),!0}}),registerSetInterceptor:(u,k)=>{s[u]=k},notifyAll:()=>{Object.keys(e).forEach(u=>i(u))}}}var De=new WeakMap;function ye(e,t,o){var s,u;const i=t.indexOf(".");if(i>=0){const k=t.slice(0,i),g=t.slice(i+1),D=e[k];return D&&De.has(D)?ye(D,g,o):((s=De.get(e))==null?void 0:s(k,o))??(()=>{})}return((u=De.get(e))==null?void 0:u(t,o))??(()=>{})}var bt=(e,t)=>e.split(".").reduce((o,i)=>o==null?void 0:o[i],t),Ue=!1,xe=!1,We=()=>{if(Ue)return xe;Ue=!0;try{new Function("return 1")(),xe=!0}catch{console.warn("[courvux] CSP blocks eval. Falling back to a limited evaluator that handles property access and literals only. Add `vite-plugin-courvux-precompile` to your build for full template support under strict CSP."),xe=!1}return xe},Ve=new Map,Ge=new Map,he=new WeakMap,jt=(e,t)=>{const o=he.get(e);o?Object.assign(o,t):he.set(e,{...t})},Ae=(e,t)=>{const o=he.get(t);o&&he.set(e,o)},yt=(e,t)=>{const o=e.trim();if(o==="true")return!0;if(o==="false")return!1;if(o==="null")return null;if(o!=="undefined")return/^-?\d+(\.\d+)?$/.test(o)?parseFloat(o):/^(['"`])(.*)\1$/s.test(o)?o.slice(1,-1):o.startsWith("!")?!yt(o.slice(1).trim(),t):bt(o,t)},q=(e,t)=>{var i;const o=(i=he.get(t))==null?void 0:i[e];if(o)try{return o(t)}catch{}if(!We())return yt(e,t);try{let s=Ve.get(e);return s||(s=new Function("$data",`with($data) { return (${e}) }`),Ve.set(e,s)),s(t)}catch{return bt(e,t)}},xt=(e,t,o)=>e.startsWith("$store.")&&t.store?t.storeSubscribeOverride?t.storeSubscribeOverride(t.store,e.slice(7),o):ye(t.store,e.slice(7),o):t.subscribe(e,o),Z=(e,t,o)=>{const i=new Set(["true","false","null","undefined","in","of","typeof","instanceof"]),s=e.match(/\$?[a-zA-Z_][\w$]*(?:\.\$?[a-zA-Z_][\w$]*)*/g)??[],u=[...new Set(s.map(g=>g.startsWith("$store.")?g:g.split(".")[0]).filter(g=>!i.has(g)))];if(u.length===0)return()=>{};const k=u.map(g=>xt(g,t,o));return()=>k.forEach(g=>g())},Ye=new Map,Pt=e=>{const t=Ye.get(e);if(t)return t;const o=e.trim();let i=0,s=-1,u=null;for(let g=0;g<o.length;g++){const D=o[g];D==="["?(i===0&&(s=g,u="bracket"),i++):D==="]"?i--:D==="."&&i===0&&(s=g,u="dot")}let k;if(s<0)k={parent:"",keyExpr:JSON.stringify(o)};else if(u==="dot")k={parent:o.slice(0,s),keyExpr:JSON.stringify(o.slice(s+1))};else{const g=o.lastIndexOf("]");k=g>s?{parent:o.slice(0,s),keyExpr:o.slice(s+1,g)}:{parent:"",keyExpr:JSON.stringify(o)}}return Ye.set(e,k),k},ue=(e,t,o)=>{if(We())try{const{parent:s,keyExpr:u}=Pt(e),k=s?q(s,t):t,g=q(u,t);if(k==null)return;k[g]=o;return}catch(s){console.warn(`[courvux] setStateValue: write failed for "${e}":`,s);return}const i=e.split(".");if(i.length===1)t[i[0]]=o;else{const s=i.slice(0,-1).reduce((u,k)=>u==null?void 0:u[k],t);s&&(s[i[i.length-1]]=o)}},Je=(e,t,o,i,s)=>{const u={};return Object.keys(e).forEach(k=>u[k]=e[k]),u[o]=t,s&&(u[s]=i),Ae(u,e),u},Ne=e=>e?typeof e=="string"?e:Array.isArray(e)?e.map(Ne).filter(Boolean).join(" "):typeof e=="object"?Object.entries(e).filter(([,t])=>!!t).map(([t])=>t).join(" "):"":"",Xe=(e,t,o)=>{if(!t){e.style.cssText=o;return}typeof t=="string"?e.style.cssText=o?`${o};${t}`:t:typeof t=="object"&&(o&&(e.style.cssText=o),Object.entries(t).forEach(([i,s])=>{e.style[i]=s??""}))},Ze=(e,t,o)=>{var s;const i=(s=he.get(t))==null?void 0:s[e];if(i)try{i(new Proxy(t,{get(u,k){return k==="$event"?o:u[k]},set(u,k,g){return u[k]=g,!0},has(u,k){return!0}}));return}catch(u){console.warn(`[courvux] handler error "${e}":`,u);return}if(We())try{let u=Ge.get(e);u||(u=new Function("__p__",`with(__p__){${e}}`),Ge.set(e,u));const k=new Proxy({},{has:()=>!0,get:(g,D)=>D==="$event"?o:D in t?t[D]:globalThis[D],set:(g,D,$)=>(t[D]=$,!0)});u(k)}catch(u){console.warn(`[courvux] handler error "${e}":`,u)}},ce=e=>{const t=getComputedStyle(e),o=Math.max(parseFloat(t.animationDuration)||0,parseFloat(t.transitionDuration)||0)*1e3;return o<=0?Promise.resolve():new Promise(i=>{const s=()=>i();e.addEventListener("animationend",s,{once:!0}),e.addEventListener("transitionend",s,{once:!0}),setTimeout(s,o+50)})},Ot=`
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
`,Ke=!1;function Qe(){if(Ke||typeof document>"u")return;Ke=!0;const e=document.createElement("style");e.id="cv-transitions-el",e.textContent=Ot,document.head.appendChild(e)}var et=!1;function Ft(){if(et||typeof document>"u")return;et=!0;const e=document.createElement("style");e.id="cv-cloak-style",e.textContent="[cv-cloak]{display:none!important}",document.head.appendChild(e)}function Dt(e){if(typeof window<"u"&&"Sanitizer"in window){const o=document.createElement("div");return o.setHTML(e,{sanitizer:new window.Sanitizer}),o.innerHTML}const t=new DOMParser().parseFromString(e,"text/html");return t.querySelectorAll("script,iframe,object,embed,form,meta,link,style").forEach(o=>o.remove()),t.querySelectorAll("*").forEach(o=>{Array.from(o.attributes).forEach(i=>{(i.name.startsWith("on")||i.value.trim().toLowerCase().startsWith("javascript:"))&&o.removeAttribute(i.name)})}),t.body.innerHTML}async function te(e,t,o){var u,k,g,D,$,A,M,T,L,z,E,R,C,c,d,h,w;const i=Array.from(e.childNodes);let s=0;for(;s<i.length;){const S=i[s];if(S.nodeType===3){const a=S.textContent||"",l=a.match(/\{\{([\s\S]+?)\}\}/g);if(l){const r=a,f=()=>{let m=r;l.forEach(p=>{const v=p.replace(/^\{\{\s*/,"").replace(/\s*\}\}$/,"");m=m.replace(p,q(v,t)??"")}),S.textContent=m};l.forEach(m=>{Z(m.replace(/^\{\{\s*/,"").replace(/\s*\}\}$/,""),o,f)}),f()}s++;continue}if(S.nodeType!==1){s++;continue}const n=S,y=n.tagName.toLowerCase();if(n.hasAttribute("cv-pre")){n.removeAttribute("cv-pre"),s++;continue}if(n.hasAttribute("cv-once")){n.removeAttribute("cv-once"),await te(n,t,{...o,subscribe:()=>()=>{},storeSubscribeOverride:()=>()=>{}}),s++;continue}if(n.hasAttribute("cv-cloak")&&n.removeAttribute("cv-cloak"),n.hasAttribute("cv-teleport")){const a=n.getAttribute("cv-teleport");n.removeAttribute("cv-teleport");const l=document.querySelector(a)??document.body,r=document.createComment(`cv-teleport: ${a}`);n.replaceWith(r),await te(n,t,o),l.appendChild(n),s++;continue}if(n.hasAttribute("cv-memo")){const a=n.getAttribute("cv-memo");n.removeAttribute("cv-memo");const l=()=>a.split(",").map(v=>q(v.trim(),t));let r=l();const f=[],m=v=>(f.push(v),()=>{const b=f.indexOf(v);b>-1&&f.splice(b,1)});await te(n,t,{...o,subscribe:(v,b)=>m(b),storeSubscribeOverride:(v,b,j)=>m(j)});const p=Z(a,o,()=>{const v=l();v.some((b,j)=>b!==r[j])&&(r=v,[...f].forEach(b=>b()))});(u=o.registerCleanup)==null||u.call(o,()=>p()),s++;continue}if(n.hasAttribute("cv-data")){const a=n.getAttribute("cv-data").trim();n.removeAttribute("cv-data");let l={},r={};if(a.startsWith("{")){const f=q(a,t)??{};Object.entries(f).forEach(([m,p])=>{typeof p=="function"?r[m]=p:l[m]=p})}else if(a){const f=(k=o.components)==null?void 0:k[a];if(f){const m=typeof f.data=="function"?f.data():f.data??{};m instanceof Promise||Object.assign(l,m),Object.assign(r,f.methods??{})}}if(o.createChildScope){const f=o.createChildScope(l,r);(g=o.registerCleanup)==null||g.call(o,f.cleanup),Ae(f.state,t),await te(n,f.state,{...o,subscribe:f.subscribe})}else{const f={...t,...l,...r};Ae(f,t),await te(n,f,o)}s++;continue}if(n.hasAttribute("cv-for")){const a=n.getAttribute("cv-for");n.removeAttribute("cv-for");const l=a.match(/^\(?(\w+)(?:,\s*(\w+))?\)?\s+in\s+(.+)$/);if(l){const[,r,f,m]=l,p=n.getAttribute(":key")??null;p&&n.removeAttribute(":key");const v=n.getAttribute("cv-transition")??null;v&&n.removeAttribute("cv-transition");const b=document.createComment(`cv-for: ${m}`);n.replaceWith(b);let j=[],O=[];const P=new Map;let H=!1,W=!1;const F=async()=>{var K;const B=q(m,t),N=B?typeof B=="number"?Array.from({length:B},(V,U)=>[U+1,U]):Array.isArray(B)?B.map((V,U)=>[V,U]):Object.entries(B).map(([V,U])=>[U,V]):[];if(p){const V=[],U=new Map,de=new Set;for(const[X,Y]of N){const ae=q(p,Je(t,X,r,Y,f));de.has(ae)&&console.warn(`[courvux] cv-for: duplicate :key "${ae}" in "${m}"`),de.add(ae),V.push(ae),U.set(ae,[X,Y])}const Q=[];for(const[X,{el:Y,destroy:ae}]of P)U.has(X)||(v?(Y.classList.add(`${v}-leave`),Q.push(ce(Y).then(()=>{var ie;Y.classList.remove(`${v}-leave`),ae(),(ie=Y.parentNode)==null||ie.removeChild(Y),P.delete(X)}))):(ae(),(K=Y.parentNode)==null||K.removeChild(Y),P.delete(X)));Q.length&&await Promise.all(Q);const re=b.parentNode,se=[];for(const X of V){const[Y,ae]=U.get(X);if(P.has(X)){const ie=P.get(X);ie.itemRef!==Y&&(ie.reactive[r]=Y,ie.itemRef=Y),f&&(ie.reactive[f]=ae)}else{const ie=n.cloneNode(!0),Ee=[],{subscribe:At,createReactiveState:Ct}=ze(),je=Ct({[r]:Y,...f?{[f]:ae}:{}}),qe=new Proxy({},{has(le,ee){return!0},get(le,ee){return typeof ee!="string"?t[ee]:ee===r||f&&ee===f?je[ee]:t[ee]},set(le,ee,pe){return ee===r||f&&ee===f?(je[ee]=pe,!0):(t[ee]=pe,!0)}});Ae(qe,t);const Tt={...o,subscribe:(le,ee)=>{const pe=le.split(".")[0];let me;return pe===r||f&&pe===f?me=At(pe,ee):me=o.subscribe(le,ee),Ee.push(me),me},storeSubscribeOverride:(le,ee,pe)=>{const me=ye(le,ee,pe);return Ee.push(me),me}},Pe=document.createDocumentFragment();Pe.appendChild(ie),await te(Pe,qe,Tt);const Oe=Pe.firstChild??ie;v&&Oe.classList.add(`${v}-enter`),P.set(X,{el:Oe,reactive:je,itemRef:Y,destroy:()=>Ee.forEach(le=>le())}),v&&se.push(Oe)}}let oe=b.nextSibling,fe=0;for(const X of V){const{el:Y}=P.get(X);Y!==oe?fe++:oe=Y.nextSibling}if(fe>0)if(fe>V.length>>1){const X=document.createDocumentFragment();for(const Y of V)X.appendChild(P.get(Y).el);re.insertBefore(X,b.nextSibling)}else{oe=b.nextSibling;for(const X of V){const{el:Y}=P.get(X);Y!==oe?re.insertBefore(Y,oe):oe=Y.nextSibling}}j=V.map(X=>P.get(X).el),se.length&&Promise.all(se.map(X=>ce(X).then(()=>X.classList.remove(`${v}-enter`))))}else{if(O.forEach(Q=>Q()),O=[],j.forEach(Q=>{var re;return(re=Q.parentNode)==null?void 0:re.removeChild(Q)}),j=[],!N.length)return;const V=b.parentNode,U=b.nextSibling,de={...o,subscribe:(Q,re)=>{const se=o.subscribe(Q,re);return O.push(se),se},storeSubscribeOverride:(Q,re,se)=>{const oe=ye(Q,re,se);return O.push(oe),oe}};for(const[Q,re]of N){const se=n.cloneNode(!0),oe=document.createDocumentFragment();oe.appendChild(se),await te(oe,Je(t,Q,r,re,f),de);const fe=oe.firstChild??se;V.insertBefore(oe,U),j.push(fe)}}},G=async()=>{if(H){W=!0;return}H=!0;try{for(await F();W;)W=!1,await F()}finally{H=!1}};(D=o.registerCleanup)==null||D.call(o,()=>{P.forEach(({el:B,destroy:N})=>{var K;N(),(K=B.parentNode)==null||K.removeChild(B)}),P.clear(),O.forEach(B=>B()),j.forEach(B=>{var N;return(N=B.parentNode)==null?void 0:N.removeChild(B)}),j=[]}),Z(m,o,G),await G()}s++;continue}if(n.hasAttribute("cv-if")){const a=[],l=n.getAttribute("cv-if");n.removeAttribute("cv-if");const r=document.createComment("cv-if");n.replaceWith(r),a.push({condition:l,template:n,anchor:r});let f=s+1;for(;f<i.length;){const O=i[f];if(O.nodeType===3&&((($=O.textContent)==null?void 0:$.trim())??"")===""){f++;continue}if(O.nodeType!==1)break;const P=O;if(P.hasAttribute("cv-else-if")){const H=P.getAttribute("cv-else-if");P.removeAttribute("cv-else-if");const W=document.createComment("cv-else-if");P.replaceWith(W),a.push({condition:H,template:P,anchor:W}),f++;continue}if(P.hasAttribute("cv-else")){P.removeAttribute("cv-else");const H=document.createComment("cv-else");P.replaceWith(H),a.push({condition:null,template:P,anchor:H}),f++;break}break}s=f;let m=null,p=-1,v=!1,b=!1;const j=async()=>{var O,P;if(v){b=!0;return}v=!0;try{do{b=!1;let H=-1;for(let N=0;N<a.length;N++){const K=a[N];if(K.condition===null||q(K.condition,t)){H=N;break}}if(H===p&&m||(m&&((O=m.parentNode)==null||O.removeChild(m),m=null),p=H,H<0))continue;const W=a[H],F=W.template.cloneNode(!0),G=document.createDocumentFragment();G.appendChild(F),await te(G,t,o);const B=G.firstChild??F;(P=W.anchor.parentNode)==null||P.insertBefore(G,W.anchor.nextSibling),m=B}while(b)}finally{v=!1}};a.filter(O=>O.condition).forEach(O=>{Z(O.condition,o,j)}),await j();continue}if(n.hasAttribute("cv-show")){const a=n.getAttribute("cv-show");n.removeAttribute("cv-show");const l=Array.from(n.attributes).filter(r=>r.name==="cv-transition"||r.name.startsWith("cv-transition:")||r.name.startsWith("cv-transition."));if(l.length>0){const r=F=>(n.getAttribute(F)??"").split(" ").filter(Boolean),f=r("cv-transition:enter"),m=r("cv-transition:enter-start"),p=r("cv-transition:enter-end"),v=r("cv-transition:leave"),b=r("cv-transition:leave-start"),j=r("cv-transition:leave-end"),O=n.getAttribute("cv-transition")??"",P=new Set(O.split(".").slice(1)),H=[...P].find(F=>/^\d+$/.test(F)),W=H?parseInt(H):200;if(f.length||m.length||v.length||b.length){l.forEach(V=>n.removeAttribute(V.name));const F=()=>new Promise(V=>requestAnimationFrame(()=>requestAnimationFrame(()=>V())));let G=!!q(a,t),B=!1,N=null;const K=async V=>{if(B){N=V;return}B=!0;try{V?(n.style.display="",n.classList.add(...f,...m),await F(),n.classList.remove(...m),n.classList.add(...p),await ce(n),n.classList.remove(...f,...p)):(n.classList.add(...v,...b),await F(),n.classList.remove(...b),n.classList.add(...j),await ce(n),n.classList.remove(...v,...j),n.style.display="none"),G=V}finally{if(B=!1,N!==null&&N!==G){const U=N;N=null,K(U)}else N=null}};G||(n.style.display="none"),Z(a,o,()=>{const V=!!q(a,t);V!==G&&K(V)})}else{const F=[...P].find(U=>U==="scale"||/^scale$/.test(U)),G=(()=>{const U=[...P].find(de=>/^\d+$/.test(de)&&de!==H);return U?parseInt(U)/100:.9})(),B=[];(!P.has("scale")||P.has("opacity"))&&B.push(`opacity ${W}ms ease`),F&&B.push(`transform ${W}ms ease`),B.length||B.push(`opacity ${W}ms ease`),n.style.transition=(n.style.transition?n.style.transition+", ":"")+B.join(", "),l.forEach(U=>n.removeAttribute(U.name));let N=!!q(a,t);const K=()=>new Promise(U=>requestAnimationFrame(()=>requestAnimationFrame(()=>U()))),V=async U=>{U?(n.style.display="",n.style.opacity="0",F&&(n.style.transform=`scale(${G})`),await K(),n.style.opacity="",F&&(n.style.transform=""),await ce(n)):(n.style.opacity="0",F&&(n.style.transform=`scale(${G})`),await ce(n),n.style.display="none",n.style.opacity="",F&&(n.style.transform="")),N=U};N||(n.style.display="none"),Z(a,o,()=>{const U=!!q(a,t);U!==N&&V(U)})}}else{const r=n.getAttribute("cv-show-transition"),f=n.getAttribute(":transition");r&&n.removeAttribute("cv-show-transition"),f&&n.removeAttribute(":transition");const m=r??(f?String(q(f,t)):null);if(m){Qe();let p=!!q(a,t);p||(n.style.display="none");let v=!1,b=null;const j=async O=>{if(v){b=O;return}v=!0;try{O?(n.style.display="",n.classList.add(`${m}-enter`),await ce(n),n.classList.remove(`${m}-enter`)):(n.classList.add(`${m}-leave`),await ce(n),n.classList.remove(`${m}-leave`),n.style.display="none"),p=O}finally{if(v=!1,b!==null&&b!==p){const P=b;b=null,j(P)}else b=null}};Z(a,o,()=>{const O=!!q(a,t);O!==p&&j(O)})}else{const p=()=>{n.style.display=q(a,t)?"":"none"};Z(a,o,p),p()}}}if(n.hasAttribute("cv-focus")){const a=n.getAttribute("cv-focus")??"";if(n.removeAttribute("cv-focus"),!a)Promise.resolve().then(()=>n.focus());else{const l=()=>{q(a,t)&&Promise.resolve().then(()=>n.focus())};Z(a,o,l),l()}}{const a=Array.from(n.attributes).filter(l=>l.name==="cv-intersect"||l.name.startsWith("cv-intersect:")||l.name.startsWith("cv-intersect."));if(a.length&&typeof IntersectionObserver<"u"){const l=a.find(F=>F.name==="cv-intersect"||F.name==="cv-intersect:enter"||F.name.startsWith("cv-intersect.")),r=a.find(F=>F.name==="cv-intersect:leave"),f=(l==null?void 0:l.value)??"",m=(r==null?void 0:r.value)??"",p=((l==null?void 0:l.name)??"cv-intersect").split("."),v=new Set(p.slice(1)),b=v.has("once");let j=0;if(v.has("half"))j=.5;else if(v.has("full"))j=1;else{const F=[...v].find(G=>G.startsWith("threshold-"));F&&(j=parseInt(F.replace("threshold-",""))/100)}const O=[...v].find(F=>F.startsWith("margin-")),P=O?`${O.replace("margin-","")}px`:void 0;a.forEach(F=>n.removeAttribute(F.name));const H=F=>{if(F)try{new Function("$data",`with($data){${F}}`)(t)}catch(G){console.warn(`[courvux] cv-intersect error "${F}":`,G)}},W=new IntersectionObserver(F=>{F.forEach(G=>{G.isIntersecting?(H(f),b&&W.disconnect()):H(m)})},{threshold:j,...P?{rootMargin:P}:{}});W.observe(n),(A=o.registerCleanup)==null||A.call(o,()=>W.disconnect())}}{const a=Array.from(n.attributes).find(l=>l.name==="cv-html"||l.name.startsWith("cv-html."));if(a){const l=a.value;n.removeAttribute(a.name);const r=!a.name.split(".").slice(1).includes("raw"),f=()=>{const m=String(q(l,t)??"");n.innerHTML=r?Dt(m):m};Z(l,o,f),f(),s++;continue}}if(n.hasAttribute("cv-ref")&&!((M=o.components)!=null&&M[y])){const a=n.getAttribute("cv-ref");n.removeAttribute("cv-ref"),o.refs&&(o.refs[a]=n)}const x=!!((T=o.components)!=null&&T[y]),_=Array.from(n.attributes).find(a=>a.name==="cv-model"||a.name.startsWith("cv-model."));if(_&&!x){const a=_.value;n.removeAttribute(_.name);const l=new Set(_.name.split(".").slice(1)),r=n,f=(L=r.type)==null?void 0:L.toLowerCase(),m=p=>{if(l.has("number")){const v=parseFloat(p);return isNaN(v)?p:v}return l.has("trim")?p.trim():p};if(f==="checkbox"){const p=()=>{const v=q(a,t);r.checked=Array.isArray(v)?v.includes(r.value):!!v};Z(a,o,p),p(),r.addEventListener("change",()=>{const v=q(a,t);if(Array.isArray(v)){const b=[...v];if(r.checked)b.includes(r.value)||b.push(r.value);else{const j=b.indexOf(r.value);j>-1&&b.splice(j,1)}ue(a,t,b)}else ue(a,t,r.checked)})}else if(f==="radio"){const p=()=>{r.checked=q(a,t)===r.value};Z(a,o,p),p(),r.addEventListener("change",()=>{r.checked&&ue(a,t,m(r.value))})}else if(n.hasAttribute("contenteditable")){const p=n,v=()=>{const b=String(q(a,t)??"");p.innerText!==b&&(p.innerText=b)};if(Z(a,o,v),v(),l.has("debounce")){const b=[...l].find(P=>/^\d+$/.test(P)),j=b?parseInt(b):300;let O;p.addEventListener("input",()=>{clearTimeout(O),O=setTimeout(()=>ue(a,t,m(p.innerText)),j)})}else{const b=l.has("lazy")?"blur":"input";p.addEventListener(b,()=>ue(a,t,m(p.innerText)))}}else{const p=()=>{r.value=q(a,t)??""};if(Z(a,o,p),p(),l.has("debounce")){const v=[...l].find(O=>/^\d+$/.test(O)),b=v?parseInt(v):300;let j;r.addEventListener("input",()=>{clearTimeout(j),j=setTimeout(()=>ue(a,t,m(r.value)),b)})}else{const v=y==="select"||l.has("lazy")?"change":"input";r.addEventListener(v,()=>ue(a,t,m(r.value)))}}}if(o.directives&&Array.from(n.attributes).forEach(a=>{var H,W;if(!a.name.startsWith("cv-"))return;const l=a.name.slice(3).split("."),r=l[0],f=l.slice(1),m=r.indexOf(":"),p=m>=0?r.slice(0,m):r,v=m>=0?r.slice(m+1):void 0,b=o.directives[p];if(!b)return;const j=a.value;n.removeAttribute(a.name);const O=typeof b=="function"?{onMount:b}:b,P={value:j?q(j,t):void 0,arg:v,modifiers:Object.fromEntries(f.map(F=>[F,!0]))};(H=O.onMount)==null||H.call(O,n,P),O.onUpdate&&j&&Z(j,o,()=>{P.value=q(j,t),O.onUpdate(n,P)}),O.onDestroy&&((W=o.registerCleanup)==null||W.call(o,()=>O.onDestroy(n,P)))}),y==="slot"){const a=n.getAttribute("name")??"default",l=(z=o.slots)==null?void 0:z[a];if(l){const r={};Array.from(n.attributes).forEach(p=>{p.name.startsWith(":")&&(r[p.name.slice(1)]=q(p.value,t))});const f=await l(r),m=document.createDocumentFragment();f.forEach(p=>m.appendChild(p)),n.replaceWith(m)}else{const r=document.createDocumentFragment();for(;n.firstChild;)r.appendChild(n.firstChild);await te(r,t,o),n.replaceWith(r)}s++;continue}if(y==="cv-transition"){Qe();const a=n.getAttribute("name")??"fade",l=n.getAttribute(":show")??null;n.removeAttribute("name"),l&&n.removeAttribute(":show");const r=document.createElement("div");for(r.className="cv-t-wrap";n.firstChild;)r.appendChild(n.firstChild);if(n.replaceWith(r),await te(r,t,o),l){let f=!!q(l,t),m=!1,p=null;f||(r.style.display="none");const v=async b=>{if(m){p=b;return}m=!0;try{b?(r.style.display="",r.classList.add(`${a}-enter`),await ce(r),r.classList.remove(`${a}-enter`)):(r.classList.add(`${a}-leave`),await ce(r),r.classList.remove(`${a}-leave`),r.style.display="none"),f=b}finally{if(m=!1,p!==null&&p!==f){const j=p;p=null,v(j)}else p=null}};Z(l,o,()=>{const b=!!q(l,t);b!==f&&v(b)})}s++;continue}if(y==="router-view"&&o.mountRouterView){const a=n.getAttribute("name")??void 0;n.setAttribute("aria-live","polite"),n.setAttribute("aria-atomic","true"),await o.mountRouterView(n,a),s++;continue}if(y==="router-link"){const a=n.getAttribute(":to"),l=n.getAttribute("to"),r=()=>a?String(q(a,t)??"/"):l||"/",f=F=>String(F).replace(/[&"<>]/g,G=>({"&":"&amp;",'"':"&quot;","<":"&lt;",">":"&gt;"})[G]);let m="";Array.from(n.attributes).forEach(F=>{F.name==="to"||F.name===":to"||(m+=` ${F.name}="${f(F.value)}"`)});const p=document.createElement("div");p.innerHTML=`<a${m}></a>`;const v=p.firstElementChild;for(;n.firstChild;)v.appendChild(n.firstChild);const b=((E=o.router)==null?void 0:E.base)??"",j=F=>b?F===b?"/":F.startsWith(b+"/")?F.slice(b.length)||"/":F||"/":F||"/",O=()=>{var F;return((F=o.router)==null?void 0:F.mode)==="history"?j(window.location.pathname):window.location.hash.slice(1)||"/"},P=()=>{var B;const F=r(),G=O()===F;((B=o.router)==null?void 0:B.mode)==="history"?v.href=`${b}${F}`:v.href=`#${F}`,G?(v.setAttribute("aria-current","page"),v.classList.add("active")):(v.removeAttribute("aria-current"),v.classList.remove("active"))};((R=o.router)==null?void 0:R.mode)==="history"?(v.addEventListener("click",F=>{F.preventDefault(),o.router.navigate(r())}),window.addEventListener("popstate",P)):window.addEventListener("hashchange",P),a&&Z(a,o,P),P();const H=document.createDocumentFragment();H.appendChild(v),await te(H,t,o);const W=H.firstChild??v;n.replaceWith(W),s++;continue}if(y==="component"&&n.hasAttribute(":is")&&o.mountDynamic){const a=n.getAttribute(":is");n.removeAttribute(":is");const l=document.createComment("component:is");n.replaceWith(l),await o.mountDynamic(l,a,n,t,o),s++;continue}if((C=o.components)!=null&&C[y]&&o.mountElement){await o.mountElement(n,y,t,o),s++;continue}{const a=Array.from(n.attributes).find(l=>l.name==="cv-intersect"||l.name.startsWith("cv-intersect."));if(a&&typeof IntersectionObserver<"u"){const l=new Set(a.name.split(".").slice(1));n.removeAttribute(a.name);const r=q(a.value,t);let f,m=0,p="0px",v=l.has("once");if(typeof r=="function"?f=b=>r.call(t,b):r&&typeof r=="object"&&(typeof r.handler=="function"&&(f=b=>r.handler.call(t,b)),r.threshold!==void 0&&(m=r.threshold),r.margin&&(p=r.margin),r.once&&(v=!0)),f){const b=new IntersectionObserver(j=>{const O=j[0];f(O),v&&O.isIntersecting&&b.disconnect()},{threshold:m,rootMargin:p});b.observe(n),(c=o.registerCleanup)==null||c.call(o,()=>b.disconnect())}}}if(n.hasAttribute("cv-resize")){const a=n.getAttribute("cv-resize");if(n.removeAttribute("cv-resize"),typeof ResizeObserver<"u"){const l=q(a,t);let r,f="content-box";if(typeof l=="function"?r=m=>l.call(t,m):l&&typeof l=="object"&&(typeof l.handler=="function"&&(r=m=>l.handler.call(t,m)),l.box&&(f=l.box)),r){const m=new ResizeObserver(p=>{p[0]&&r(p[0])});m.observe(n,{box:f}),(d=o.registerCleanup)==null||d.call(o,()=>m.disconnect())}}}if(n.hasAttribute("cv-scroll")){const a=n.getAttribute("cv-scroll");n.removeAttribute("cv-scroll");const l=q(a,t);let r,f=0;if(typeof l=="function"?r=m=>l.call(t,m):l&&typeof l=="object"&&(typeof l.handler=="function"&&(r=m=>l.handler.call(t,m)),l.throttle&&(f=l.throttle)),r){let m=0;const p=()=>{const v=Date.now();f>0&&v-m<f||(m=v,r({scrollTop:n.scrollTop,scrollLeft:n.scrollLeft,scrollHeight:n.scrollHeight,scrollWidth:n.scrollWidth,clientHeight:n.clientHeight,clientWidth:n.clientWidth}))};n.addEventListener("scroll",p,{passive:!0}),(h=o.registerCleanup)==null||h.call(o,()=>n.removeEventListener("scroll",p))}}if(n.hasAttribute("cv-clickoutside")){const a=n.getAttribute("cv-clickoutside");n.removeAttribute("cv-clickoutside");const l=r=>{n.contains(r.target)||(typeof t[a]=="function"?t[a].call(t,r):Ze(a,t,r))};document.addEventListener("click",l,!0),(w=o.registerCleanup)==null||w.call(o,()=>document.removeEventListener("click",l,!0))}if(n.hasAttribute("cv-bind")){const a=n.getAttribute("cv-bind");n.removeAttribute("cv-bind");const l=n.getAttribute("class")??"",r=n.getAttribute("style")??"";let f=[];const m=()=>{const p=q(a,t)??{},v=Object.keys(p);for(const b of f)b in p||(b==="class"?n.className=l:b==="style"?n.style.cssText=r:n.removeAttribute(b));for(const[b,j]of Object.entries(p))if(b==="class")n.className=[l,Ne(j)].filter(Boolean).join(" ");else if(b==="style")Xe(n,j,r);else if(j==null||j===!1)try{n.removeAttribute(b)}catch{}else try{n.setAttribute(b,j===!0?"":String(j))}catch(O){console.warn(`[courvux] cv-bind: skipping invalid attribute name "${b}":`,O)}f=v};Z(a,o,m),m()}const I={enter:"Enter",esc:"Escape",escape:"Escape",space:" ",tab:"Tab",delete:"Delete",backspace:"Backspace",up:"ArrowUp",down:"ArrowDown",left:"ArrowLeft",right:"ArrowRight"};Array.from(n.attributes).forEach(a=>{if(a.name.startsWith("@")||a.name.startsWith("cv:on:")){const l=(a.name.startsWith("@")?a.name.substring(1):a.name.substring(6)).split("."),r=l[0],f=new Set(l.slice(1)),m=[...f].find(j=>j in I),p=a.value,v=j=>{f.has("prevent")&&j.preventDefault(),f.has("stop")&&j.stopPropagation(),!(f.has("self")&&j.target!==j.currentTarget)&&(m&&j.key!==I[m]||(typeof t[p]=="function"?t[p].call(t,j):Ze(p,t,j)))},b={};f.has("once")&&(b.once=!0),f.has("passive")&&(b.passive=!0),f.has("capture")&&(b.capture=!0),n.addEventListener(r,v,Object.keys(b).length?b:void 0)}else if(a.name.startsWith(":")){const l=a.name.slice(1),r=a.value;if(l==="class"){const f=n.getAttribute("class")??"",m=()=>{n.className=[f,Ne(q(r,t))].filter(Boolean).join(" ")};Z(r,o,m),m()}else if(l==="style"){const f=n.getAttribute("style")??"",m=()=>Xe(n,q(r,t),f);Z(r,o,m),m()}else if(l.includes("-")){const f=()=>{const m=q(r,t);m==null||m===!1?n.removeAttribute(l):n.setAttribute(l,m===!0?"":String(m))};Z(r,o,f),f()}else{const f=()=>{n[l]=q(r,t)??""};Z(r,o,f),f()}}}),S.hasChildNodes()&&await te(S,t,o),s++}}var It=`
router-view.fade-leave{animation:cv-fade-out 0.25s forwards}
router-view.fade-enter{animation:cv-fade-in 0.25s forwards}
router-view.slide-up-leave{animation:cv-slide-up-out 0.25s forwards}
router-view.slide-up-enter{animation:cv-slide-up-in 0.25s forwards}
@keyframes cv-fade-out{to{opacity:0}}
@keyframes cv-fade-in{from{opacity:0}}
@keyframes cv-slide-up-out{to{opacity:0;transform:translateY(-12px)}}
@keyframes cv-slide-up-in{from{opacity:0;transform:translateY(12px)}}
`;function Mt(){if(document.getElementById("cv-transitions"))return;const e=document.createElement("style");e.id="cv-transitions",e.textContent=It,document.head.appendChild(e)}async function we(e,t,o){e.classList.add(`${t}-${o}`);const i=getComputedStyle(e),s=Math.max(parseFloat(i.animationDuration)||0,parseFloat(i.transitionDuration)||0)*1e3;s>0&&await new Promise(u=>{const k=()=>u();e.addEventListener("animationend",k,{once:!0}),e.addEventListener("transitionend",k,{once:!0}),setTimeout(k,s+50)}),e.classList.remove(`${t}-${o}`)}var Ce=new Map;async function Lt(e){if(typeof e!="function")return e;if(Ce.has(e))return Ce.get(e);const t=await e();return Ce.set(e,t.default),t.default}function tt(e,t){if(e.components)return e.components[t];if(t==="default")return e.component}function ot(e,t){if(e==="*")return{};const o=[],i=e.replace(/:(\w+)/g,(u,k)=>(o.push(k),"([^/]+)")),s=t.match(new RegExp(`^${i}$`));return s?Object.fromEntries(o.map((u,k)=>[u,s[k+1]])):null}function Rt(e,t){if(e==="/")return{params:{},remaining:t};const o=[],i=e.replace(/:(\w+)/g,(u,k)=>(o.push(k),"([^/]+)")),s=t.match(new RegExp(`^${i}(/.+)?$`));return s?{params:Object.fromEntries(o.map((u,k)=>[u,s[k+1]])),remaining:s[o.length+1]||"/"}:null}function wt(e,t=""){return e.map(o=>{var s;if(o.path==="*")return o;const i=((t.endsWith("/")?t.slice(0,-1):t)+o.path).replace(/\/+/g,"/")||"/";return(s=o.children)!=null&&s.length?{...o,path:i,children:wt(o.children,i==="/"?"":i)}:{...o,path:i}})}var ge=(e,t)=>new Promise(o=>e(t,o)),nt=(e,t)=>e!=null&&e.beforeLeave?new Promise(o=>e.beforeLeave(t,o)):Promise.resolve(void 0);function zt(e,t={}){const o=t.mode??"hash",i=Nt(t.base??"");return{routes:wt(e),mode:o,base:i,transition:t.transition,beforeEach:t.beforeEach,afterEach:t.afterEach,scrollBehavior:t.scrollBehavior,navigate(s,u){const k=rt(s,u==null?void 0:u.query);o==="history"?(history.pushState({},"",`${i}${k}`),window.dispatchEvent(new PopStateEvent("popstate"))):window.location.hash=k},replace(s,u){const k=rt(s,u==null?void 0:u.query);if(o==="history")history.replaceState({},"",`${i}${k}`),window.dispatchEvent(new PopStateEvent("popstate"));else{const g=window.location.href.split("#")[0];window.location.replace(`${g}#${k}`)}},back(){history.back()},forward(){history.forward()}}}function Nt(e){if(!e||e==="/")return"";let t=e.startsWith("/")?e:`/${e}`;return t.endsWith("/")&&(t=t.slice(0,-1)),t}function Ht(e,t){return t?e===t?"/":e.startsWith(t+"/")?e.slice(t.length)||"/":e||"/":e||"/"}function rt(e,t){return!t||!Object.keys(t).length?e:`${e}?${new URLSearchParams(t).toString()}`}function st(e){if(!e)return{};const t=new URLSearchParams(e.startsWith("?")?e.slice(1):e),o={};return t.forEach((i,s)=>{o[s]=i}),o}function at(e,t,o,i="default",s){const u=t.base??"",k=h=>h.length>1&&h.endsWith("/")?h.slice(0,-1):h,g=()=>t.mode==="history"?k(Ht(window.location.pathname,u)):k((window.location.hash.slice(1)||"/").split("?")[0]||"/"),D=()=>{if(t.mode==="history")return st(window.location.search);const h=window.location.hash.slice(1)||"/",w=h.indexOf("?");return w>=0?st(h.slice(w+1)):{}};t.transition&&Mt();let $=null,A=null,M=null,T=null,L=!1;const z=()=>{L||(L=!0,s==null||s())},E=new Map,R=h=>{var w;if(h!=null&&h.keepAlive&&M){(w=M.deactivate)==null||w.call(M);const S=document.createDocumentFragment();for(;e.firstChild;)S.appendChild(e.firstChild);E.set($.path,{fragment:S,activation:M}),M=null}else M==null||M.destroy(),M=null,e.innerHTML=""},C=async(h,w,S,n,y)=>{const x=typeof w=="function"&&!Ce.has(w),_=x?w.__asyncOptions:void 0,I=h.loadingTemplate??(_==null?void 0:_.loadingTemplate);x&&I&&(e.innerHTML=I);let a;try{a=await Lt(w)}catch(l){const r=_==null?void 0:_.errorTemplate;if(r)return e.innerHTML=r,{destroy:()=>{e.innerHTML=""}};throw l}return x&&I&&(e.innerHTML=""),o(e,a,S,n,y)},c=async()=>{var S,n,y,x,_,I,a,l;const h=g(),w=D();for(const r of t.routes){if((S=r.children)!=null&&S.length){const m=Rt(r.path,h);if(m!==null)for(const p of r.children){const v=ot(p.path,h);if(v!==null){const b={params:m.params,query:w,path:h,meta:r.meta};if(p.redirect){const H={params:v,query:w,path:h,meta:p.meta},W=typeof p.redirect=="function"?p.redirect(H):p.redirect;t.navigate(W);return}if(t.beforeEach){const H=await ge(t.beforeEach,b);if(H){t.navigate(H);return}}if(r.beforeEnter){const H=await ge(r.beforeEnter,b);if(H){t.navigate(H);return}}if(p.beforeEnter){const H={params:v,query:w,path:h,meta:p.meta},W=await ge(p.beforeEnter,H);if(W){t.navigate(W);return}}const j=`${r.path}::${JSON.stringify(m.params)}`;if(T!==j){const H=await nt(M,b);if(H){t.navigate(H);return}const W=r.transition??t.transition;W&&e.hasChildNodes()&&await we(e,W,"leave"),R(A);const F=tt(r,i);if(F){const G={routes:r.children,mode:t.mode,base:t.base,transition:r.transition??t.transition,beforeEach:t.beforeEach,afterEach:t.afterEach,scrollBehavior:t.scrollBehavior,navigate:(B,N)=>t.navigate(B,N),replace:(B,N)=>t.replace(B,N),back:()=>t.back(),forward:()=>t.forward()};M=await C(r,F,b,i==="default"?r.layout:void 0,i==="default"?G:void 0),(n=M.enter)==null||n.call(M,$)}else e.innerHTML="";T=j,W&&await we(e,W,"enter")}const O={params:{...m.params,...v},query:w,path:h,meta:p.meta??r.meta};(y=t.afterEach)==null||y.call(t,O,$);const P=(x=t.scrollBehavior)==null?void 0:x.call(t,O,$);P&&window.scrollTo(P.x??0,P.y??0),$=O,A=r,z();return}}}const f=ot(r.path,h);if(f!==null){T=null;const m={params:f,query:w,path:h,meta:r.meta};if(r.redirect){const O=typeof r.redirect=="function"?r.redirect(m):r.redirect;t.navigate(O);return}if(t.beforeEach){const O=await ge(t.beforeEach,m);if(O){t.navigate(O);return}}if(r.beforeEnter){const O=await ge(r.beforeEnter,m);if(O){t.navigate(O);return}}const p=await nt(M,m);if(p){t.navigate(p);return}const v=r.transition??t.transition;v&&e.hasChildNodes()&&await we(e,v,"leave"),R(A);const b=tt(r,i);if(b){const O=m.path;if(r.keepAlive&&E.has(O)){const P=E.get(O);e.appendChild(P.fragment),M=P.activation,(_=M.activate)==null||_.call(M),E.delete(O)}else{const P=$;M=await C(r,b,m,i==="default"?r.layout:void 0),(I=M.enter)==null||I.call(M,P)}}else e.innerHTML="",M=null;v&&await we(e,v,"enter"),(a=t.afterEach)==null||a.call(t,m,$);const j=(l=t.scrollBehavior)==null?void 0:l.call(t,m,$);j&&window.scrollTo(j.x??0,j.y??0),$=m,A=r,z();return}}T=null,R(A),A=null,z()},d=t.mode==="history"?"popstate":"hashchange";return window.addEventListener(d,c),c(),()=>{window.removeEventListener(d,c),M==null||M.destroy(),M=null,E.forEach(({activation:h})=>h.destroy()),E.clear()}}function Wt(){if(typeof window>"u")return null;if(window.__COURVUX_DEVTOOLS__)return window.__COURVUX_DEVTOOLS__;const e=new Map,t={instances:[],stores:[],on(o,i){return e.has(o)||e.set(o,new Set),e.get(o).add(i),()=>{var s;return(s=e.get(o))==null?void 0:s.delete(i)}},_emit(o,i){var s;(s=e.get(o))==null||s.forEach(u=>{try{u(i)}catch{}})},_registerInstance(o){this.instances.push(o),this._emit("mount",o)},_unregisterInstance(o){const i=this.instances.findIndex(s=>s.id===o);if(i!==-1){const s=this.instances[i];this.instances.splice(i,1),this._emit("destroy",s)}},_registerStore(o){this.stores.push(o),o.subscribe(()=>this._emit("store-update",o))}};return window.__COURVUX_DEVTOOLS__=t,t}var qt=0;function Bt(){return++qt}var Ut=`
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
`;function Vt(){if(document.getElementById("cvd-styles"))return;const e=document.createElement("style");e.id="cvd-styles",e.textContent=Ut,document.head.appendChild(e)}function ke(e){return e===null?"null":e===void 0?"undefined":typeof e=="string"?`"${e}"`:typeof e=="object"?JSON.stringify(e):String(e)}function it(e){try{return JSON.parse(e)}catch{return e}}function Gt(e){if(typeof document>"u")return;Vt();const t=document.createElement("div");t.id="cvd",document.body.appendChild(t);let o=!1,i="components",s=new Set;const u=document.createElement("div");u.id="cvd-badge",u.innerHTML='<span class="cvd-badge-dot"></span>COURVUX',t.appendChild(u);const k=document.createElement("div");k.id="cvd-panel",k.style.display="none",t.appendChild(k),k.innerHTML=`
        <div id="cvd-head">
            <span id="cvd-title">⚡ COURVUX DEVTOOLS</span>
            <div id="cvd-tabs">
                <button class="cvd-tab active" data-tab="components">Components</button>
                <button class="cvd-tab" data-tab="store">Store</button>
            </div>
            <button id="cvd-close">✕</button>
        </div>
        <div id="cvd-body"></div>
    `;const g=k.querySelector("#cvd-body");u.addEventListener("click",()=>{o=!0,u.style.display="none",k.style.display="flex",M()}),k.querySelector("#cvd-close").addEventListener("click",()=>{o=!1,k.style.display="none",u.style.display=""}),k.querySelectorAll(".cvd-tab").forEach(T=>{T.addEventListener("click",()=>{i=T.dataset.tab,k.querySelectorAll(".cvd-tab").forEach(L=>L.classList.remove("active")),T.classList.add("active"),M()})});const D=k.querySelector("#cvd-head");D.addEventListener("pointerdown",T=>{if(T.target.closest("button"))return;D.setPointerCapture(T.pointerId);const L=T.clientX,z=T.clientY,E=t.offsetLeft,R=t.offsetTop,C=d=>{t.style.right="auto",t.style.bottom="auto",t.style.left=`${E+(d.clientX-L)}px`,t.style.top=`${R+(d.clientY-z)}px`},c=d=>{D.releasePointerCapture(d.pointerId),D.removeEventListener("pointermove",C),D.removeEventListener("pointerup",c),D.removeEventListener("pointercancel",c)};D.addEventListener("pointermove",C),D.addEventListener("pointerup",c),D.addEventListener("pointercancel",c)});function $(){const T=e.instances;if(!T.length){g.innerHTML='<div class="cvd-empty">No hay componentes montados</div>';return}g.innerHTML=T.map(L=>{const z=L.getState(),E=Object.keys(z);return`
                <div class="cvd-inst${s.has(L.id)?" open":""}" data-id="${L.id}">
                    <div class="cvd-inst-head">
                        <span class="cvd-arrow">▶</span>
                        <span class="cvd-inst-name">&lt;${L.name}&gt;</span>
                        <span class="cvd-count">${E.length} keys</span>
                        <span class="cvd-inst-id">#${L.id}</span>
                    </div>
                    <div class="cvd-kv">
                        ${E.length?E.map(R=>`
                            <div class="cvd-row">
                                <span class="cvd-key">${R}</span>
                                <span class="cvd-val" data-inst="${L.id}" data-key="${R}" title="click to edit">${ke(z[R])}</span>
                            </div>
                        `).join(""):'<span style="color:#555">— sin datos reactivos —</span>'}
                    </div>
                </div>
            `}).join(""),g.querySelectorAll(".cvd-inst-head").forEach(L=>{L.addEventListener("click",()=>{const z=L.closest(".cvd-inst"),E=parseInt(z.dataset.id);s.has(E)?s.delete(E):s.add(E),z.classList.toggle("open")})}),g.querySelectorAll(".cvd-val").forEach(L=>{L.addEventListener("click",z=>{z.stopPropagation();const E=L;if(E.querySelector("input"))return;const R=parseInt(E.dataset.inst),C=E.dataset.key,c=e.instances.find(S=>S.id===R);if(!c)return;const d=ke(c.getState()[C]);E.classList.add("editing"),E.innerHTML=`<input class="cvd-edit" value='${d.replace(/'/g,"&#39;")}'>`;const h=E.querySelector("input");h.focus(),h.select();const w=()=>{c.setState(C,it(h.value)),E.classList.remove("editing")};h.addEventListener("blur",w),h.addEventListener("keydown",S=>{S.key==="Enter"&&(S.preventDefault(),w()),S.key==="Escape"&&(E.classList.remove("editing"),M())})})})}function A(){if(!e.stores.length){g.innerHTML='<div class="cvd-empty">No hay store registrado</div>';return}g.innerHTML=e.stores.map((T,L)=>{const z=T.getState(),E=Object.keys(z);return`
                <div class="cvd-inst open" data-store="${L}">
                    <div class="cvd-inst-head">
                        <span class="cvd-arrow" style="transform:rotate(90deg)">▶</span>
                        <span class="cvd-inst-name" style="color:#ffcb6b">Store</span>
                        <span class="cvd-count">${E.length} keys</span>
                    </div>
                    <div class="cvd-kv">
                        ${E.map(R=>`
                            <div class="cvd-row">
                                <span class="cvd-key cvd-store-key">${R}</span>
                                <span class="cvd-val" data-store="${L}" data-key="${R}" title="click to edit">${ke(z[R])}</span>
                            </div>
                        `).join("")}
                    </div>
                </div>
            `}).join(""),g.querySelectorAll(".cvd-inst-head").forEach(T=>{T.addEventListener("click",()=>T.closest(".cvd-inst").classList.toggle("open"))}),g.querySelectorAll("[data-store][data-key]").forEach(T=>{T.addEventListener("click",L=>{L.stopPropagation();const z=T;if(z.querySelector("input"))return;const E=parseInt(z.dataset.store),R=z.dataset.key,C=e.stores[E];if(!C)return;const c=ke(C.getState()[R]);z.classList.add("editing"),z.innerHTML=`<input class="cvd-edit" value='${c.replace(/'/g,"&#39;")}'>`;const d=z.querySelector("input");d.focus(),d.select();const h=()=>{C.setState(R,it(d.value)),z.classList.remove("editing")};d.addEventListener("blur",h),d.addEventListener("keydown",w=>{w.key==="Enter"&&(w.preventDefault(),h()),w.key==="Escape"&&(z.classList.remove("editing"),M())})})})}function M(){o&&(i==="components"?$():A())}e.on("mount",()=>M()),e.on("update",()=>M()),e.on("destroy",()=>M()),e.on("store-update",()=>M())}var Yt="__COURVUX_HEAD_COLLECTOR__";function Jt(){return globalThis[Yt]??null}var Xt=(e,t)=>{Object.entries(t).forEach(([o,i])=>{o!=="innerHTML"&&(i==null||i===!1||e.setAttribute(o,i===!0?"":String(i)))})},Zt=e=>{const t={};return Array.from(e.attributes).forEach(o=>{t[o.name]=o.value}),t},Kt=(e,t)=>{Array.from(e.attributes).forEach(o=>e.removeAttribute(o.name)),Object.entries(t).forEach(([o,i])=>e.setAttribute(o,i))},ct=(e,t,o,i)=>{let s=o?document.head.querySelector(o):null;s?(i.push({el:s,prevAttrs:Zt(s),created:!1}),Array.from(s.attributes).forEach(u=>s.removeAttribute(u.name))):(s=document.createElement(e),document.head.appendChild(s),i.push({el:s,created:!0})),Xt(s,t)};function Qt(e){var k,g,D;const t=Jt();if(t!==null)return t.push(e),()=>{};if(typeof document>"u")return()=>{};const o=[];let i;const s={},u={};if(e.title!==void 0){i=document.title;const $=e.titleTemplate,A=typeof $=="function"?$(e.title):typeof $=="string"?$.replace("%s",e.title):e.title;document.title=A}return(k=e.meta)==null||k.forEach($=>{ct("meta",$,$.name?`meta[name="${CSS.escape($.name)}"]`:$.property?`meta[property="${CSS.escape($.property)}"]`:$["http-equiv"]?`meta[http-equiv="${CSS.escape($["http-equiv"])}"]`:null,o)}),(g=e.link)==null||g.forEach($=>{ct("link",$,$.rel==="canonical"?'link[rel="canonical"]':$.rel&&$.href?`link[rel="${CSS.escape($.rel)}"][href="${CSS.escape($.href)}"]`:null,o)}),(D=e.script)==null||D.forEach($=>{const A=document.createElement("script");Object.entries($).forEach(([M,T])=>{M==="innerHTML"?A.textContent=String(T):T!=null&&T!==!1&&A.setAttribute(M,T===!0?"":String(T))}),document.head.appendChild(A),o.push({el:A,created:!0})}),e.htmlAttrs&&Object.entries(e.htmlAttrs).forEach(([$,A])=>{s[$]=document.documentElement.getAttribute($),document.documentElement.setAttribute($,A)}),e.bodyAttrs&&Object.entries(e.bodyAttrs).forEach(([$,A])=>{u[$]=document.body.getAttribute($),document.body.setAttribute($,A)}),function(){i!==void 0&&(document.title=i),o.forEach(({el:$,prevAttrs:A,created:M})=>{var T;M?(T=$.parentNode)==null||T.removeChild($):A&&Kt($,A)}),Object.entries(s).forEach(([$,A])=>{A===null?document.documentElement.removeAttribute($):document.documentElement.setAttribute($,A)}),Object.entries(u).forEach(([$,A])=>{A===null?document.body.removeAttribute($):document.body.setAttribute($,A)})}}var Ie="data-courvux-ssr",eo=e=>e?Promise.resolve().then(e):Promise.resolve();function dt(e,t){const o=e.trim();if(o.startsWith("{")){const i=o.replace(/[{}]/g,"").split(",").map(s=>s.trim()).filter(Boolean);return Object.fromEntries(i.map(s=>[s,t[s]]))}return{[o]:t}}var Se=e=>{if(e===null||typeof e!="object")return e;try{return structuredClone(e)}catch{return e}};async function ne(e,t,o){var w,S,n;const i={},{subscribe:s,createReactiveState:u,registerSetInterceptor:k,notifyAll:g}=ze();let D;if(typeof t.data=="function"?(t.loadingTemplate&&(e.innerHTML=t.loadingTemplate),D=await t.data()):D=t.data??{},t.templateUrl){const y=o.baseUrl?new URL(t.templateUrl,o.baseUrl).href:t.templateUrl,x=await fetch(y);if(!x.ok)throw new Error(`Failed to load template: ${y} (${x.status})`);e.innerHTML=await x.text()}else t.template&&(e.innerHTML=t.template);e.removeAttribute(Ie),(w=e.querySelector(`[${Ie}]`))==null||w.removeAttribute(Ie);const $={};if(t.inject&&o.provided){const y=Array.isArray(t.inject)?Object.fromEntries(t.inject.map(x=>[x,x])):t.inject;Object.entries(y).forEach(([x,_])=>{o.provided&&_ in o.provided&&($[x]=o.provided[_])})}const A=u({...o.globalProperties??{},...D,...$,...t.methods,$refs:i,$el:e,...o.slots?{$slots:Object.fromEntries(Object.keys(o.slots).map(y=>[y,!0]))}:{},...o.store?{$store:o.store}:{},...o.currentRoute?{$route:o.currentRoute}:{},...o.router?{$router:o.router}:{}});t.exprs&&typeof t.exprs=="object"&&jt(A,t.exprs),A.$watch=(y,x,_)=>{const I=(_==null?void 0:_.deep)??!1,a=(_==null?void 0:_.immediate)??!1;let l=I?Se(A[y]):A[y];const r=s(y,()=>{const f=A[y];x.call(A,f,l),l=I?Se(f):f});return a&&x.call(A,A[y],void 0),r},A.$batch=Et,A.$nextTick=y=>eo(y),A.$dispatch=(y,x,_)=>{e.dispatchEvent(new CustomEvent(y,{bubbles:!0,composed:!0,..._??{},detail:x}))},o.magics&&Object.entries(o.magics).forEach(([y,x])=>{A[y]=x(A)}),A.$forceUpdate=()=>g();const M=[];A.$watchEffect=y=>{let x=[];const _=()=>{x.forEach(r=>r()),x=[];const a=Be(()=>{try{y()}catch{}}),l=new Map;for(const{sub:r,key:f}of a)l.has(r)||l.set(r,new Set),!l.get(r).has(f)&&(l.get(r).add(f),x.push(r(f,_)))};_();const I=()=>{x.forEach(l=>l()),x=[];const a=M.indexOf(I);a>-1&&M.splice(a,1)};return M.push(I),I};const T=[];t.computed&&Object.entries(t.computed).forEach(([y,x])=>{const _=typeof x=="function"?x:x.get,I=typeof x!="function"?x.set:void 0;let a=[];const l=()=>{a.forEach(p=>p()),a=[];let r;const f=Be(()=>{try{r=_.call(A)}catch(p){(t.debug??o.debug)&&console.warn("[courvux] computed error:",p)}});A[y]=r;const m=new Map;for(const{sub:p,key:v}of f)m.has(p)||m.set(p,new Set),!m.get(p).has(v)&&(m.get(p).add(v),a.push(p(v,l)))};l(),T.push(()=>a.forEach(r=>r())),I&&k(y,r=>I.call(A,r))});const L=[];t.watch&&Object.entries(t.watch).forEach(([y,x])=>{const _=typeof x=="object"&&x!==null&&"handler"in x,I=_?x.handler:x,a=_?x.immediate??!1:!1,l=_?x.deep??!1:!1;let r=l?Se(A[y]):A[y];const f=s(y,()=>{const m=A[y];I.call(A,m,r),r=l?Se(m):m});L.push(f),a&&I.call(A,A[y],void 0)});const z={...o.provided??{}};if(t.provide){const y=typeof t.provide=="function"?t.provide.call(A):t.provide;Object.assign(z,y)}const E={...o,provided:z,components:{...o.components,...t.components}};E.mountElement=$e(E),E.createChildScope=(y,x)=>{const _=new Set(Object.keys(y)),I=new Set(Object.keys(x)),{subscribe:a,createReactiveState:l}=ze(),r=l(y);let f;return f=new Proxy({},{get(m,p){return typeof p!="string"?A[p]:_.has(p)?r[p]:I.has(p)?x[p].bind(f):A[p]},set(m,p,v){return typeof p!="string"?!1:_.has(p)?(r[p]=v,!0):(A[p]=v,!0)},has(m,p){return _.has(p)||I.has(p)||p in A},ownKeys(){return[..._,...I,...Object.keys(A)]},getOwnPropertyDescriptor(m,p){return _.has(p)||I.has(p)||p in A?{configurable:!0,enumerable:!0,writable:!0}:void 0}}),{state:f,subscribe:(m,p)=>_.has(m)?a(m,p):c(m,p),cleanup:()=>{}}},E.mountDynamic=async(y,x,_,I,a)=>{let l=null,r=null;const f=_.getAttribute("loading-template")??"",m=async()=>{var F,G,B;r==null||r(),r=null,l!=null&&l.parentNode&&(l.parentNode.removeChild(l),l=null);const p=q(x,I);if(!p)return;let v;if(typeof p=="function"){if(f){const N=document.createElement("div");N.innerHTML=f,(F=y.parentNode)==null||F.insertBefore(N,y.nextSibling),l=N}v=(await p()).default,l!=null&&l.parentNode&&(l.parentNode.removeChild(l),l=null)}else typeof p=="string"?v=(G=E.components)==null?void 0:G[p]:p&&typeof p=="object"&&(v=p);if(!v)return;const b=document.createElement("div"),j=N=>N.startsWith("@")||N.startsWith("cv:on:")||N.startsWith(":")||N.startsWith("cv-")||N.startsWith("v-slot");Array.from(_.attributes).forEach(N=>{j(N.name)||b.setAttribute(N.name,N.value)}),b.innerHTML=_.innerHTML;const O={},P={};Array.from(_.attributes).forEach(N=>{if(N.name.startsWith(":"))O[N.name.slice(1)]=q(N.value,I);else if(N.name.startsWith("@")||N.name.startsWith("cv:on:")){const K=N.value,V=N.name.startsWith("@")?N.name.slice(1):N.name.slice(6);P[V]=(...U)=>{typeof I[K]=="function"&&I[K].call(I,...U)}}});const H={...v,data:{...v.data,...O},methods:{...v.methods,$emit(N,...K){var V;kt(v,N,K),(V=P[N])==null||V.call(P,...K)}}},W={...E,components:{...E.components,...v.components}};W.mountElement=$e(W),r=(await ne(b,H,W)).destroy,(B=y.parentNode)==null||B.insertBefore(b,y.nextSibling),l=b};Z(x,a,m),await m()};const R=[];A.$addCleanup=y=>{R.push(y)};let C=!1;const c=(y,x)=>!t.onBeforeUpdate&&!t.onUpdated?s(y,x):s(y,()=>{var _;C||(C=!0,(_=t.onBeforeUpdate)==null||_.call(A),Promise.resolve().then(()=>{var I;C=!1,(I=t.onUpdated)==null||I.call(A)})),x()});try{(S=t.onBeforeMount)==null||S.call(A),await te(e,A,{subscribe:c,refs:i,...E,registerCleanup:y=>R.push(y)}),e.removeAttribute("cv-cloak"),(n=t.onMount)==null||n.call(A)}catch(y){if(t.onError)e.removeAttribute("cv-cloak"),t.onError.call(A,y);else if(o.errorHandler)e.removeAttribute("cv-cloak"),o.errorHandler(y,A,t.name??e.tagName.toLowerCase());else throw y}const d=typeof window<"u"?window.__COURVUX_DEVTOOLS__:void 0,h=d?Bt():0;if(d){const y=A,x=new Set,_={id:h,name:t.name??e.tagName.toLowerCase(),el:e,getState:()=>{const I={};for(const a of Object.keys(y))if(!(a.startsWith("$")||typeof y[a]=="function"))try{I[a]=y[a]}catch{}return I},setState:(I,a)=>{y[I]=a},subscribe:I=>(x.add(I),()=>x.delete(I)),children:[]};Object.keys(y).filter(I=>!I.startsWith("$")&&typeof y[I]!="function").forEach(I=>{s(I,()=>{d._emit("update",_),x.forEach(a=>a())})}),d._registerInstance(_),R.push(()=>d._unregisterInstance(h))}return{state:A,destroy:()=>{var y,x;(y=t.onBeforeUnmount)==null||y.call(A),T.forEach(_=>_()),L.forEach(_=>_()),M.forEach(_=>_()),R.forEach(_=>_()),(x=t.onDestroy)==null||x.call(A)},activate:()=>{var y;(y=t.onActivated)==null||y.call(A)},deactivate:()=>{var y;(y=t.onDeactivated)==null||y.call(A)},beforeLeave:t.onBeforeRouteLeave?(y,x)=>t.onBeforeRouteLeave.call(A,y,x):void 0,enter:t.onBeforeRouteEnter?y=>t.onBeforeRouteEnter.call(A,y):void 0}}function kt(e,t,o){if(!e.emits||Array.isArray(e.emits))return;const i=e.emits[t];typeof i=="function"&&!i(...o)&&console.warn(`[courvux] emit "${t}": validator returned false`)}function $e(e){return async(t,o,i,s)=>{const u=e.components[o],k=t.getAttribute("cv-ref");k&&t.removeAttribute("cv-ref");const g={},D=[],$={};Array.from(t.attributes).filter(C=>C.name==="cv-model"||C.name.startsWith("cv-model.")||C.name.startsWith("cv-model:")).forEach(C=>{t.removeAttribute(C.name);const c=C.value,d=C.name.indexOf(":"),h=d>=0?C.name.slice(d+1).split(".")[0]:"modelValue",w=h==="modelValue"?"update:modelValue":`update:${h}`;g[h]=Fe(q(c,i)),D.push({propName:h,expr:c}),$[w]=S=>{ue(c,i,S)}});const A={};Array.from(t.attributes).forEach(C=>{const c=C.name.startsWith(":"),d=C.name.startsWith("@")||C.name.startsWith("cv:on:"),h=C.name==="cv-model"||C.name.startsWith("cv-model.")||C.name.startsWith("cv-model:"),w=C.name.startsWith("v-slot"),S=C.name==="slot";!c&&!d&&!h&&!w&&!S&&(A[C.name]=C.value)}),u.inheritAttrs===!1&&Object.keys(A).forEach(C=>t.removeAttribute(C)),Array.from(t.attributes).forEach(C=>{if(C.name.startsWith(":")){const c=C.name.slice(1),d=C.value;g[c]=Fe(q(d,i)),D.push({propName:c,expr:d})}else if(C.name.startsWith("@")||C.name.startsWith("cv:on:")){const c=C.name.startsWith("@")?C.name.slice(1):C.name.slice(6),d=C.value;$[c]=(...h)=>{typeof i[d]=="function"&&i[d].call(i,...h)}}});const M=t.getAttribute("v-slot")??t.getAttribute("v-slot:default");M&&(t.removeAttribute("v-slot"),t.removeAttribute("v-slot:default"));const T=new Map,L=[];Array.from(t.childNodes).forEach(C=>{const c=C.nodeType===1?C.getAttribute("slot"):null;if(c){if(!T.has(c)){const d=t.getAttribute(`v-slot:${c}`)??null;d&&t.removeAttribute(`v-slot:${c}`),T.set(c,{nodes:[],vSlot:d})}T.get(c).nodes.push(C.cloneNode(!0))}else L.push(C.cloneNode(!0))});const z={};L.some(C=>{var c;return C.nodeType===1||C.nodeType===3&&(((c=C.textContent)==null?void 0:c.trim())??"")!==""})&&(z.default=async C=>{const c=M?{...i,...dt(M,C)}:i,d=document.createDocumentFragment();return L.forEach(h=>d.appendChild(h.cloneNode(!0))),await te(d,c,s),Array.from(d.childNodes)});for(const[C,{nodes:c,vSlot:d}]of T)z[C]=async h=>{const w=d?{...i,...dt(d,h)}:i,S=document.createDocumentFragment();return c.forEach(n=>S.appendChild(n.cloneNode(!0))),await te(S,w,s),Array.from(S.childNodes)};const E={...e,components:{...e.components,...u.components},slots:z};E.mountElement=$e(E);const{state:R}=await ne(t,{...u,data:{...u.data,...g,$attrs:A,$parent:i},methods:{...u.methods,$emit(C,...c){var d;kt(u,C,c),(d=$[C])==null||d.call($,...c)}}},E);R&&(D.forEach(({propName:C,expr:c})=>{xt(c,{...s,subscribe:s.subscribe},()=>{R[C]=Fe(q(c,i))})}),k&&s.refs&&(s.refs[k]=R))}}function to(e){Ft();const t=typeof window<"u"?Wt():void 0,o=[],i={...e.directives},s={...e.components??{}},u=[],k=new Map,g={},D=new Map;if(e.debug&&t&&Gt(t),t&&e.store){const T=e.store,L=Object.keys(T).filter(z=>typeof T[z]!="function");t._registerStore({getState(){const z={};return L.forEach(E=>{try{z[E]=T[E]}catch{}}),z},setState(z,E){T[z]=E},subscribe(z){const E=L.map(R=>{try{return ye(T,R,z)}catch{return()=>{}}});return()=>E.forEach(R=>R())}})}const $={router:e.router,use(T){return o.includes(T)||(o.push(T),T.install($)),$},directive(T,L){return i[T]=L,$},component(T,L){return s[T]=L,$},provide(T,L){return typeof T=="string"?g[T]=L:Object.assign(g,T),$},magic(T,L){return D.set(`$${T}`,L),$},mount:async T=>(await M(T),$),mountAll:async(T="[data-courvux]")=>{const L=Array.from(document.querySelectorAll(T));return await Promise.all(L.map(z=>A(z))),$},mountEl:async T=>A(T),unmount(T){if(!T)u.forEach(L=>L()),u.length=0,k.clear();else{const L=document.querySelector(T);if(L){const z=k.get(L);if(z){z(),k.delete(L);const E=u.indexOf(z);E>-1&&u.splice(E,1)}}}return $},destroy(){u.forEach(T=>T()),u.length=0,k.clear()}},A=async T=>{const L=new URL(".",document.baseURI).href,z={components:s,router:e.router,store:e.store,directives:i,baseUrl:L,provided:{...g},errorHandler:e.errorHandler,globalProperties:e.globalProperties,magics:D.size?Object.fromEntries(D):void 0};if(z.mountElement=$e(z),e.router){const R=e.router;z.mountRouterView=async(C,c)=>{await new Promise(d=>{at(C,R,async(h,w,S,n,y)=>{const x={...z,currentRoute:S};if(y){let _=null;const I={...x,mountRouterView:async(a,l)=>{_=at(a,y,async(r,f,m,p)=>{const v={...x,currentRoute:m};if(p){let b=null;const j={...v,mountRouterView:async(P,H)=>{b=await ne(P,f,v)}},{destroy:O}=await ne(r,{template:p},j);return{destroy:()=>{b==null||b.destroy(),O()},activate:()=>b==null?void 0:b.activate(),deactivate:()=>b==null?void 0:b.deactivate()}}else return await ne(r,f,v)},l)}};if(n){let a=null;const l={...I,mountRouterView:async(f,m)=>{a=await ne(f,w,I)}},{destroy:r}=await ne(h,{template:n},l);return{destroy:()=>{_==null||_(),a==null||a.destroy(),r()},activate:()=>a==null?void 0:a.activate(),deactivate:()=>a==null?void 0:a.deactivate()}}else{const a=await ne(h,w,I);return{destroy:()=>{_==null||_(),a.destroy()},activate:()=>a.activate(),deactivate:()=>a.deactivate()}}}else if(n){let _=null;const I={...x,mountRouterView:async(l,r)=>{_=await ne(l,w,x)}},{destroy:a}=await ne(h,{template:n},I);return{destroy:()=>{_==null||_.destroy(),a()},activate:()=>_==null?void 0:_.activate(),deactivate:()=>_==null?void 0:_.deactivate()}}else return await ne(h,w,x)},c,d)})}}const E=await ne(T,e,z);return u.push(E.destroy),k.set(T,E.destroy),E.state},M=async T=>{const L=document.querySelector(T);if(L)return A(L)};return $}var lt=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function oo(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var Me={exports:{}},pt;function no(){return pt||(pt=1,(function(e){var t=typeof window<"u"?window:typeof WorkerGlobalScope<"u"&&self instanceof WorkerGlobalScope?self:{};/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 *
 * @license MIT <https://opensource.org/licenses/MIT>
 * @author Lea Verou <https://lea.verou.me>
 * @namespace
 * @public
 */var o=(function(i){var s=/(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i,u=0,k={},g={manual:i.Prism&&i.Prism.manual,disableWorkerMessageHandler:i.Prism&&i.Prism.disableWorkerMessageHandler,util:{encode:function c(d){return d instanceof D?new D(d.type,c(d.content),d.alias):Array.isArray(d)?d.map(c):d.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/\u00a0/g," ")},type:function(c){return Object.prototype.toString.call(c).slice(8,-1)},objId:function(c){return c.__id||Object.defineProperty(c,"__id",{value:++u}),c.__id},clone:function c(d,h){h=h||{};var w,S;switch(g.util.type(d)){case"Object":if(S=g.util.objId(d),h[S])return h[S];w={},h[S]=w;for(var n in d)d.hasOwnProperty(n)&&(w[n]=c(d[n],h));return w;case"Array":return S=g.util.objId(d),h[S]?h[S]:(w=[],h[S]=w,d.forEach(function(y,x){w[x]=c(y,h)}),w);default:return d}},getLanguage:function(c){for(;c;){var d=s.exec(c.className);if(d)return d[1].toLowerCase();c=c.parentElement}return"none"},setLanguage:function(c,d){c.className=c.className.replace(RegExp(s,"gi"),""),c.classList.add("language-"+d)},currentScript:function(){if(typeof document>"u")return null;if(document.currentScript&&document.currentScript.tagName==="SCRIPT")return document.currentScript;try{throw new Error}catch(w){var c=(/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(w.stack)||[])[1];if(c){var d=document.getElementsByTagName("script");for(var h in d)if(d[h].src==c)return d[h]}return null}},isActive:function(c,d,h){for(var w="no-"+d;c;){var S=c.classList;if(S.contains(d))return!0;if(S.contains(w))return!1;c=c.parentElement}return!!h}},languages:{plain:k,plaintext:k,text:k,txt:k,extend:function(c,d){var h=g.util.clone(g.languages[c]);for(var w in d)h[w]=d[w];return h},insertBefore:function(c,d,h,w){w=w||g.languages;var S=w[c],n={};for(var y in S)if(S.hasOwnProperty(y)){if(y==d)for(var x in h)h.hasOwnProperty(x)&&(n[x]=h[x]);h.hasOwnProperty(y)||(n[y]=S[y])}var _=w[c];return w[c]=n,g.languages.DFS(g.languages,function(I,a){a===_&&I!=c&&(this[I]=n)}),n},DFS:function c(d,h,w,S){S=S||{};var n=g.util.objId;for(var y in d)if(d.hasOwnProperty(y)){h.call(d,y,d[y],w||y);var x=d[y],_=g.util.type(x);_==="Object"&&!S[n(x)]?(S[n(x)]=!0,c(x,h,null,S)):_==="Array"&&!S[n(x)]&&(S[n(x)]=!0,c(x,h,y,S))}}},plugins:{},highlightAll:function(c,d){g.highlightAllUnder(document,c,d)},highlightAllUnder:function(c,d,h){var w={callback:h,container:c,selector:'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'};g.hooks.run("before-highlightall",w),w.elements=Array.prototype.slice.apply(w.container.querySelectorAll(w.selector)),g.hooks.run("before-all-elements-highlight",w);for(var S=0,n;n=w.elements[S++];)g.highlightElement(n,d===!0,w.callback)},highlightElement:function(c,d,h){var w=g.util.getLanguage(c),S=g.languages[w];g.util.setLanguage(c,w);var n=c.parentElement;n&&n.nodeName.toLowerCase()==="pre"&&g.util.setLanguage(n,w);var y=c.textContent,x={element:c,language:w,grammar:S,code:y};function _(a){x.highlightedCode=a,g.hooks.run("before-insert",x),x.element.innerHTML=x.highlightedCode,g.hooks.run("after-highlight",x),g.hooks.run("complete",x),h&&h.call(x.element)}if(g.hooks.run("before-sanity-check",x),n=x.element.parentElement,n&&n.nodeName.toLowerCase()==="pre"&&!n.hasAttribute("tabindex")&&n.setAttribute("tabindex","0"),!x.code){g.hooks.run("complete",x),h&&h.call(x.element);return}if(g.hooks.run("before-highlight",x),!x.grammar){_(g.util.encode(x.code));return}if(d&&i.Worker){var I=new Worker(g.filename);I.onmessage=function(a){_(a.data)},I.postMessage(JSON.stringify({language:x.language,code:x.code,immediateClose:!0}))}else _(g.highlight(x.code,x.grammar,x.language))},highlight:function(c,d,h){var w={code:c,grammar:d,language:h};if(g.hooks.run("before-tokenize",w),!w.grammar)throw new Error('The language "'+w.language+'" has no grammar.');return w.tokens=g.tokenize(w.code,w.grammar),g.hooks.run("after-tokenize",w),D.stringify(g.util.encode(w.tokens),w.language)},tokenize:function(c,d){var h=d.rest;if(h){for(var w in h)d[w]=h[w];delete d.rest}var S=new M;return T(S,S.head,c),A(c,S,d,S.head,0),z(S)},hooks:{all:{},add:function(c,d){var h=g.hooks.all;h[c]=h[c]||[],h[c].push(d)},run:function(c,d){var h=g.hooks.all[c];if(!(!h||!h.length))for(var w=0,S;S=h[w++];)S(d)}},Token:D};i.Prism=g;function D(c,d,h,w){this.type=c,this.content=d,this.alias=h,this.length=(w||"").length|0}D.stringify=function c(d,h){if(typeof d=="string")return d;if(Array.isArray(d)){var w="";return d.forEach(function(_){w+=c(_,h)}),w}var S={type:d.type,content:c(d.content,h),tag:"span",classes:["token",d.type],attributes:{},language:h},n=d.alias;n&&(Array.isArray(n)?Array.prototype.push.apply(S.classes,n):S.classes.push(n)),g.hooks.run("wrap",S);var y="";for(var x in S.attributes)y+=" "+x+'="'+(S.attributes[x]||"").replace(/"/g,"&quot;")+'"';return"<"+S.tag+' class="'+S.classes.join(" ")+'"'+y+">"+S.content+"</"+S.tag+">"};function $(c,d,h,w){c.lastIndex=d;var S=c.exec(h);if(S&&w&&S[1]){var n=S[1].length;S.index+=n,S[0]=S[0].slice(n)}return S}function A(c,d,h,w,S,n){for(var y in h)if(!(!h.hasOwnProperty(y)||!h[y])){var x=h[y];x=Array.isArray(x)?x:[x];for(var _=0;_<x.length;++_){if(n&&n.cause==y+","+_)return;var I=x[_],a=I.inside,l=!!I.lookbehind,r=!!I.greedy,f=I.alias;if(r&&!I.pattern.global){var m=I.pattern.toString().match(/[imsuy]*$/)[0];I.pattern=RegExp(I.pattern.source,m+"g")}for(var p=I.pattern||I,v=w.next,b=S;v!==d.tail&&!(n&&b>=n.reach);b+=v.value.length,v=v.next){var j=v.value;if(d.length>c.length)return;if(!(j instanceof D)){var O=1,P;if(r){if(P=$(p,b,c,l),!P||P.index>=c.length)break;var G=P.index,H=P.index+P[0].length,W=b;for(W+=v.value.length;G>=W;)v=v.next,W+=v.value.length;if(W-=v.value.length,b=W,v.value instanceof D)continue;for(var F=v;F!==d.tail&&(W<H||typeof F.value=="string");F=F.next)O++,W+=F.value.length;O--,j=c.slice(b,W),P.index-=b}else if(P=$(p,0,j,l),!P)continue;var G=P.index,B=P[0],N=j.slice(0,G),K=j.slice(G+B.length),V=b+j.length;n&&V>n.reach&&(n.reach=V);var U=v.prev;N&&(U=T(d,U,N),b+=N.length),L(d,U,O);var de=new D(y,a?g.tokenize(B,a):B,f,B);if(v=T(d,U,de),K&&T(d,v,K),O>1){var Q={cause:y+","+_,reach:V};A(c,d,h,v.prev,b,Q),n&&Q.reach>n.reach&&(n.reach=Q.reach)}}}}}}function M(){var c={value:null,prev:null,next:null},d={value:null,prev:c,next:null};c.next=d,this.head=c,this.tail=d,this.length=0}function T(c,d,h){var w=d.next,S={value:h,prev:d,next:w};return d.next=S,w.prev=S,c.length++,S}function L(c,d,h){for(var w=d.next,S=0;S<h&&w!==c.tail;S++)w=w.next;d.next=w,w.prev=d,c.length-=S}function z(c){for(var d=[],h=c.head.next;h!==c.tail;)d.push(h.value),h=h.next;return d}if(!i.document)return i.addEventListener&&(g.disableWorkerMessageHandler||i.addEventListener("message",function(c){var d=JSON.parse(c.data),h=d.language,w=d.code,S=d.immediateClose;i.postMessage(g.highlight(w,g.languages[h],h)),S&&i.close()},!1)),g;var E=g.util.currentScript();E&&(g.filename=E.src,E.hasAttribute("data-manual")&&(g.manual=!0));function R(){g.manual||g.highlightAll()}if(!g.manual){var C=document.readyState;C==="loading"||C==="interactive"&&E&&E.defer?document.addEventListener("DOMContentLoaded",R):window.requestAnimationFrame?window.requestAnimationFrame(R):window.setTimeout(R,16)}return g})(t);e.exports&&(e.exports=o),typeof lt<"u"&&(lt.Prism=o),o.languages.markup={comment:{pattern:/<!--(?:(?!<!--)[\s\S])*?-->/,greedy:!0},prolog:{pattern:/<\?[\s\S]+?\?>/,greedy:!0},doctype:{pattern:/<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,greedy:!0,inside:{"internal-subset":{pattern:/(^[^\[]*\[)[\s\S]+(?=\]>$)/,lookbehind:!0,greedy:!0,inside:null},string:{pattern:/"[^"]*"|'[^']*'/,greedy:!0},punctuation:/^<!|>$|[[\]]/,"doctype-tag":/^DOCTYPE/i,name:/[^\s<>'"]+/}},cdata:{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,greedy:!0},tag:{pattern:/<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,greedy:!0,inside:{tag:{pattern:/^<\/?[^\s>\/]+/,inside:{punctuation:/^<\/?/,namespace:/^[^\s>\/:]+:/}},"special-attr":[],"attr-value":{pattern:/=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,inside:{punctuation:[{pattern:/^=/,alias:"attr-equals"},{pattern:/^(\s*)["']|["']$/,lookbehind:!0}]}},punctuation:/\/?>/,"attr-name":{pattern:/[^\s>\/]+/,inside:{namespace:/^[^\s>\/:]+:/}}}},entity:[{pattern:/&[\da-z]{1,8};/i,alias:"named-entity"},/&#x?[\da-f]{1,8};/i]},o.languages.markup.tag.inside["attr-value"].inside.entity=o.languages.markup.entity,o.languages.markup.doctype.inside["internal-subset"].inside=o.languages.markup,o.hooks.add("wrap",function(i){i.type==="entity"&&(i.attributes.title=i.content.replace(/&amp;/,"&"))}),Object.defineProperty(o.languages.markup.tag,"addInlined",{value:function(s,u){var k={};k["language-"+u]={pattern:/(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,lookbehind:!0,inside:o.languages[u]},k.cdata=/^<!\[CDATA\[|\]\]>$/i;var g={"included-cdata":{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,inside:k}};g["language-"+u]={pattern:/[\s\S]+/,inside:o.languages[u]};var D={};D[s]={pattern:RegExp(/(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(/__/g,function(){return s}),"i"),lookbehind:!0,greedy:!0,inside:g},o.languages.insertBefore("markup","cdata",D)}}),Object.defineProperty(o.languages.markup.tag,"addAttribute",{value:function(i,s){o.languages.markup.tag.inside["special-attr"].push({pattern:RegExp(/(^|["'\s])/.source+"(?:"+i+")"+/\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source,"i"),lookbehind:!0,inside:{"attr-name":/^[^\s=]+/,"attr-value":{pattern:/=[\s\S]+/,inside:{value:{pattern:/(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,lookbehind:!0,alias:[s,"language-"+s],inside:o.languages[s]},punctuation:[{pattern:/^=/,alias:"attr-equals"},/"|'/]}}}})}}),o.languages.html=o.languages.markup,o.languages.mathml=o.languages.markup,o.languages.svg=o.languages.markup,o.languages.xml=o.languages.extend("markup",{}),o.languages.ssml=o.languages.xml,o.languages.atom=o.languages.xml,o.languages.rss=o.languages.xml,(function(i){var s=/(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;i.languages.css={comment:/\/\*[\s\S]*?\*\//,atrule:{pattern:RegExp("@[\\w-](?:"+/[^;{\s"']|\s+(?!\s)/.source+"|"+s.source+")*?"+/(?:;|(?=\s*\{))/.source),inside:{rule:/^@[\w-]+/,"selector-function-argument":{pattern:/(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,lookbehind:!0,alias:"selector"},keyword:{pattern:/(^|[^\w-])(?:and|not|only|or)(?![\w-])/,lookbehind:!0}}},url:{pattern:RegExp("\\burl\\((?:"+s.source+"|"+/(?:[^\\\r\n()"']|\\[\s\S])*/.source+")\\)","i"),greedy:!0,inside:{function:/^url/i,punctuation:/^\(|\)$/,string:{pattern:RegExp("^"+s.source+"$"),alias:"url"}}},selector:{pattern:RegExp(`(^|[{}\\s])[^{}\\s](?:[^{};"'\\s]|\\s+(?![\\s{])|`+s.source+")*(?=\\s*\\{)"),lookbehind:!0},string:{pattern:s,greedy:!0},property:{pattern:/(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,lookbehind:!0},important:/!important\b/i,function:{pattern:/(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i,lookbehind:!0},punctuation:/[(){};:,]/},i.languages.css.atrule.inside.rest=i.languages.css;var u=i.languages.markup;u&&(u.tag.addInlined("style","css"),u.tag.addAttribute("style","css"))})(o),o.languages.clike={comment:[{pattern:/(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,lookbehind:!0,greedy:!0},{pattern:/(^|[^\\:])\/\/.*/,lookbehind:!0,greedy:!0}],string:{pattern:/(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,greedy:!0},"class-name":{pattern:/(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,lookbehind:!0,inside:{punctuation:/[.\\]/}},keyword:/\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,boolean:/\b(?:false|true)\b/,function:/\b\w+(?=\()/,number:/\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,operator:/[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,punctuation:/[{}[\];(),.:]/},o.languages.javascript=o.languages.extend("clike",{"class-name":[o.languages.clike["class-name"],{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,lookbehind:!0}],keyword:[{pattern:/((?:^|\})\s*)catch\b/,lookbehind:!0},{pattern:/(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,lookbehind:!0}],function:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,number:{pattern:RegExp(/(^|[^\w$])/.source+"(?:"+(/NaN|Infinity/.source+"|"+/0[bB][01]+(?:_[01]+)*n?/.source+"|"+/0[oO][0-7]+(?:_[0-7]+)*n?/.source+"|"+/0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source+"|"+/\d+(?:_\d+)*n/.source+"|"+/(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/.source)+")"+/(?![\w$])/.source),lookbehind:!0},operator:/--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/}),o.languages.javascript["class-name"][0].pattern=/(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/,o.languages.insertBefore("javascript","keyword",{regex:{pattern:RegExp(/((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)/.source+/\//.source+"(?:"+/(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}/.source+"|"+/(?:\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.)*\])*\])*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}v[dgimyus]{0,7}/.source+")"+/(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/.source),lookbehind:!0,greedy:!0,inside:{"regex-source":{pattern:/^(\/)[\s\S]+(?=\/[a-z]*$)/,lookbehind:!0,alias:"language-regex",inside:o.languages.regex},"regex-delimiter":/^\/|\/$/,"regex-flags":/^[a-z]+$/}},"function-variable":{pattern:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,alias:"function"},parameter:[{pattern:/(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,lookbehind:!0,inside:o.languages.javascript},{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,lookbehind:!0,inside:o.languages.javascript},{pattern:/(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,lookbehind:!0,inside:o.languages.javascript},{pattern:/((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,lookbehind:!0,inside:o.languages.javascript}],constant:/\b[A-Z](?:[A-Z_]|\dx?)*\b/}),o.languages.insertBefore("javascript","string",{hashbang:{pattern:/^#!.*/,greedy:!0,alias:"comment"},"template-string":{pattern:/`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,greedy:!0,inside:{"template-punctuation":{pattern:/^`|`$/,alias:"string"},interpolation:{pattern:/((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,lookbehind:!0,inside:{"interpolation-punctuation":{pattern:/^\$\{|\}$/,alias:"punctuation"},rest:o.languages.javascript}},string:/[\s\S]+/}},"string-property":{pattern:/((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,lookbehind:!0,greedy:!0,alias:"property"}}),o.languages.insertBefore("javascript","operator",{"literal-property":{pattern:/((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,lookbehind:!0,alias:"property"}}),o.languages.markup&&(o.languages.markup.tag.addInlined("script","javascript"),o.languages.markup.tag.addAttribute(/on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/.source,"javascript")),o.languages.js=o.languages.javascript,(function(){if(typeof o>"u"||typeof document>"u")return;Element.prototype.matches||(Element.prototype.matches=Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector);var i="Loading…",s=function(E,R){return"✖ Error "+E+" while fetching file: "+R},u="✖ Error: File does not exist or is empty",k={js:"javascript",py:"python",rb:"ruby",ps1:"powershell",psm1:"powershell",sh:"bash",bat:"batch",h:"c",tex:"latex"},g="data-src-status",D="loading",$="loaded",A="failed",M="pre[data-src]:not(["+g+'="'+$+'"]):not(['+g+'="'+D+'"])';function T(E,R,C){var c=new XMLHttpRequest;c.open("GET",E,!0),c.onreadystatechange=function(){c.readyState==4&&(c.status<400&&c.responseText?R(c.responseText):c.status>=400?C(s(c.status,c.statusText)):C(u))},c.send(null)}function L(E){var R=/^\s*(\d+)\s*(?:(,)\s*(?:(\d+)\s*)?)?$/.exec(E||"");if(R){var C=Number(R[1]),c=R[2],d=R[3];return c?d?[C,Number(d)]:[C,void 0]:[C,C]}}o.hooks.add("before-highlightall",function(E){E.selector+=", "+M}),o.hooks.add("before-sanity-check",function(E){var R=E.element;if(R.matches(M)){E.code="",R.setAttribute(g,D);var C=R.appendChild(document.createElement("CODE"));C.textContent=i;var c=R.getAttribute("data-src"),d=E.language;if(d==="none"){var h=(/\.(\w+)$/.exec(c)||[,"none"])[1];d=k[h]||h}o.util.setLanguage(C,d),o.util.setLanguage(R,d);var w=o.plugins.autoloader;w&&w.loadLanguages(d),T(c,function(S){R.setAttribute(g,$);var n=L(R.getAttribute("data-range"));if(n){var y=S.split(/\r\n?|\n/g),x=n[0],_=n[1]==null?y.length:n[1];x<0&&(x+=y.length),x=Math.max(0,Math.min(x-1,y.length)),_<0&&(_+=y.length),_=Math.max(0,Math.min(_,y.length)),S=y.slice(x,_).join(`
`),R.hasAttribute("data-start")||R.setAttribute("data-start",String(x+1))}C.textContent=S,o.highlightElement(C)},function(S){R.setAttribute(g,A),C.textContent=S})}}),o.plugins.fileHighlight={highlight:function(R){for(var C=(R||document).querySelectorAll(M),c=0,d;d=C[c++];)o.highlightElement(d)}};var z=!1;o.fileHighlight=function(){z||(console.warn("Prism.fileHighlight is deprecated. Use `Prism.plugins.fileHighlight.highlight` instead."),z=!0),o.plugins.fileHighlight.highlight.apply(this,arguments)}})()})(Me)),Me.exports}var ro=no();const so=oo(ro);Prism.languages.javascript=Prism.languages.extend("clike",{"class-name":[Prism.languages.clike["class-name"],{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,lookbehind:!0}],keyword:[{pattern:/((?:^|\})\s*)catch\b/,lookbehind:!0},{pattern:/(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,lookbehind:!0}],function:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,number:{pattern:RegExp(/(^|[^\w$])/.source+"(?:"+(/NaN|Infinity/.source+"|"+/0[bB][01]+(?:_[01]+)*n?/.source+"|"+/0[oO][0-7]+(?:_[0-7]+)*n?/.source+"|"+/0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source+"|"+/\d+(?:_\d+)*n/.source+"|"+/(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/.source)+")"+/(?![\w$])/.source),lookbehind:!0},operator:/--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/});Prism.languages.javascript["class-name"][0].pattern=/(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/;Prism.languages.insertBefore("javascript","keyword",{regex:{pattern:RegExp(/((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)/.source+/\//.source+"(?:"+/(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}/.source+"|"+/(?:\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.)*\])*\])*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}v[dgimyus]{0,7}/.source+")"+/(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/.source),lookbehind:!0,greedy:!0,inside:{"regex-source":{pattern:/^(\/)[\s\S]+(?=\/[a-z]*$)/,lookbehind:!0,alias:"language-regex",inside:Prism.languages.regex},"regex-delimiter":/^\/|\/$/,"regex-flags":/^[a-z]+$/}},"function-variable":{pattern:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,alias:"function"},parameter:[{pattern:/(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,lookbehind:!0,inside:Prism.languages.javascript},{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,lookbehind:!0,inside:Prism.languages.javascript},{pattern:/(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,lookbehind:!0,inside:Prism.languages.javascript},{pattern:/((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,lookbehind:!0,inside:Prism.languages.javascript}],constant:/\b[A-Z](?:[A-Z_]|\dx?)*\b/});Prism.languages.insertBefore("javascript","string",{hashbang:{pattern:/^#!.*/,greedy:!0,alias:"comment"},"template-string":{pattern:/`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,greedy:!0,inside:{"template-punctuation":{pattern:/^`|`$/,alias:"string"},interpolation:{pattern:/((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,lookbehind:!0,inside:{"interpolation-punctuation":{pattern:/^\$\{|\}$/,alias:"punctuation"},rest:Prism.languages.javascript}},string:/[\s\S]+/}},"string-property":{pattern:/((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,lookbehind:!0,greedy:!0,alias:"property"}});Prism.languages.insertBefore("javascript","operator",{"literal-property":{pattern:/((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,lookbehind:!0,alias:"property"}});Prism.languages.markup&&(Prism.languages.markup.tag.addInlined("script","javascript"),Prism.languages.markup.tag.addAttribute(/on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/.source,"javascript"));Prism.languages.js=Prism.languages.javascript;Prism.languages.markup={comment:{pattern:/<!--(?:(?!<!--)[\s\S])*?-->/,greedy:!0},prolog:{pattern:/<\?[\s\S]+?\?>/,greedy:!0},doctype:{pattern:/<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,greedy:!0,inside:{"internal-subset":{pattern:/(^[^\[]*\[)[\s\S]+(?=\]>$)/,lookbehind:!0,greedy:!0,inside:null},string:{pattern:/"[^"]*"|'[^']*'/,greedy:!0},punctuation:/^<!|>$|[[\]]/,"doctype-tag":/^DOCTYPE/i,name:/[^\s<>'"]+/}},cdata:{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,greedy:!0},tag:{pattern:/<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,greedy:!0,inside:{tag:{pattern:/^<\/?[^\s>\/]+/,inside:{punctuation:/^<\/?/,namespace:/^[^\s>\/:]+:/}},"special-attr":[],"attr-value":{pattern:/=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,inside:{punctuation:[{pattern:/^=/,alias:"attr-equals"},{pattern:/^(\s*)["']|["']$/,lookbehind:!0}]}},punctuation:/\/?>/,"attr-name":{pattern:/[^\s>\/]+/,inside:{namespace:/^[^\s>\/:]+:/}}}},entity:[{pattern:/&[\da-z]{1,8};/i,alias:"named-entity"},/&#x?[\da-f]{1,8};/i]};Prism.languages.markup.tag.inside["attr-value"].inside.entity=Prism.languages.markup.entity;Prism.languages.markup.doctype.inside["internal-subset"].inside=Prism.languages.markup;Prism.hooks.add("wrap",function(e){e.type==="entity"&&(e.attributes.title=e.content.replace(/&amp;/,"&"))});Object.defineProperty(Prism.languages.markup.tag,"addInlined",{value:function(t,o){var i={};i["language-"+o]={pattern:/(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,lookbehind:!0,inside:Prism.languages[o]},i.cdata=/^<!\[CDATA\[|\]\]>$/i;var s={"included-cdata":{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,inside:i}};s["language-"+o]={pattern:/[\s\S]+/,inside:Prism.languages[o]};var u={};u[t]={pattern:RegExp(/(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(/__/g,function(){return t}),"i"),lookbehind:!0,greedy:!0,inside:s},Prism.languages.insertBefore("markup","cdata",u)}});Object.defineProperty(Prism.languages.markup.tag,"addAttribute",{value:function(e,t){Prism.languages.markup.tag.inside["special-attr"].push({pattern:RegExp(/(^|["'\s])/.source+"(?:"+e+")"+/\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source,"i"),lookbehind:!0,inside:{"attr-name":/^[^\s=]+/,"attr-value":{pattern:/=[\s\S]+/,inside:{value:{pattern:/(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,lookbehind:!0,alias:[t,"language-"+t],inside:Prism.languages[t]},punctuation:[{pattern:/^=/,alias:"attr-equals"},/"|'/]}}}})}});Prism.languages.html=Prism.languages.markup;Prism.languages.mathml=Prism.languages.markup;Prism.languages.svg=Prism.languages.markup;Prism.languages.xml=Prism.languages.extend("markup",{});Prism.languages.ssml=Prism.languages.xml;Prism.languages.atom=Prism.languages.xml;Prism.languages.rss=Prism.languages.xml;(function(e){var t="\\b(?:BASH|BASHOPTS|BASH_ALIASES|BASH_ARGC|BASH_ARGV|BASH_CMDS|BASH_COMPLETION_COMPAT_DIR|BASH_LINENO|BASH_REMATCH|BASH_SOURCE|BASH_VERSINFO|BASH_VERSION|COLORTERM|COLUMNS|COMP_WORDBREAKS|DBUS_SESSION_BUS_ADDRESS|DEFAULTS_PATH|DESKTOP_SESSION|DIRSTACK|DISPLAY|EUID|GDMSESSION|GDM_LANG|GNOME_KEYRING_CONTROL|GNOME_KEYRING_PID|GPG_AGENT_INFO|GROUPS|HISTCONTROL|HISTFILE|HISTFILESIZE|HISTSIZE|HOME|HOSTNAME|HOSTTYPE|IFS|INSTANCE|JOB|LANG|LANGUAGE|LC_ADDRESS|LC_ALL|LC_IDENTIFICATION|LC_MEASUREMENT|LC_MONETARY|LC_NAME|LC_NUMERIC|LC_PAPER|LC_TELEPHONE|LC_TIME|LESSCLOSE|LESSOPEN|LINES|LOGNAME|LS_COLORS|MACHTYPE|MAILCHECK|MANDATORY_PATH|NO_AT_BRIDGE|OLDPWD|OPTERR|OPTIND|ORBIT_SOCKETDIR|OSTYPE|PAPERSIZE|PATH|PIPESTATUS|PPID|PS1|PS2|PS3|PS4|PWD|RANDOM|REPLY|SECONDS|SELINUX_INIT|SESSION|SESSIONTYPE|SESSION_MANAGER|SHELL|SHELLOPTS|SHLVL|SSH_AUTH_SOCK|TERM|UID|UPSTART_EVENTS|UPSTART_INSTANCE|UPSTART_JOB|UPSTART_SESSION|USER|WINDOWID|XAUTHORITY|XDG_CONFIG_DIRS|XDG_CURRENT_DESKTOP|XDG_DATA_DIRS|XDG_GREETER_DATA_DIR|XDG_MENU_PREFIX|XDG_RUNTIME_DIR|XDG_SEAT|XDG_SEAT_PATH|XDG_SESSION_DESKTOP|XDG_SESSION_ID|XDG_SESSION_PATH|XDG_SESSION_TYPE|XDG_VTNR|XMODIFIERS)\\b",o={pattern:/(^(["']?)\w+\2)[ \t]+\S.*/,lookbehind:!0,alias:"punctuation",inside:null},i={bash:o,environment:{pattern:RegExp("\\$"+t),alias:"constant"},variable:[{pattern:/\$?\(\([\s\S]+?\)\)/,greedy:!0,inside:{variable:[{pattern:/(^\$\(\([\s\S]+)\)\)/,lookbehind:!0},/^\$\(\(/],number:/\b0x[\dA-Fa-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:[Ee]-?\d+)?/,operator:/--|\+\+|\*\*=?|<<=?|>>=?|&&|\|\||[=!+\-*/%<>^&|]=?|[?~:]/,punctuation:/\(\(?|\)\)?|,|;/}},{pattern:/\$\((?:\([^)]+\)|[^()])+\)|`[^`]+`/,greedy:!0,inside:{variable:/^\$\(|^`|\)$|`$/}},{pattern:/\$\{[^}]+\}/,greedy:!0,inside:{operator:/:[-=?+]?|[!\/]|##?|%%?|\^\^?|,,?/,punctuation:/[\[\]]/,environment:{pattern:RegExp("(\\{)"+t),lookbehind:!0,alias:"constant"}}},/\$(?:\w+|[#?*!@$])/],entity:/\\(?:[abceEfnrtv\\"]|O?[0-7]{1,3}|U[0-9a-fA-F]{8}|u[0-9a-fA-F]{4}|x[0-9a-fA-F]{1,2})/};e.languages.bash={shebang:{pattern:/^#!\s*\/.*/,alias:"important"},comment:{pattern:/(^|[^"{\\$])#.*/,lookbehind:!0},"function-name":[{pattern:/(\bfunction\s+)[\w-]+(?=(?:\s*\(?:\s*\))?\s*\{)/,lookbehind:!0,alias:"function"},{pattern:/\b[\w-]+(?=\s*\(\s*\)\s*\{)/,alias:"function"}],"for-or-select":{pattern:/(\b(?:for|select)\s+)\w+(?=\s+in\s)/,alias:"variable",lookbehind:!0},"assign-left":{pattern:/(^|[\s;|&]|[<>]\()\w+(?:\.\w+)*(?=\+?=)/,inside:{environment:{pattern:RegExp("(^|[\\s;|&]|[<>]\\()"+t),lookbehind:!0,alias:"constant"}},alias:"variable",lookbehind:!0},parameter:{pattern:/(^|\s)-{1,2}(?:\w+:[+-]?)?\w+(?:\.\w+)*(?=[=\s]|$)/,alias:"variable",lookbehind:!0},string:[{pattern:/((?:^|[^<])<<-?\s*)(\w+)\s[\s\S]*?(?:\r?\n|\r)\2/,lookbehind:!0,greedy:!0,inside:i},{pattern:/((?:^|[^<])<<-?\s*)(["'])(\w+)\2\s[\s\S]*?(?:\r?\n|\r)\3/,lookbehind:!0,greedy:!0,inside:{bash:o}},{pattern:/(^|[^\\](?:\\\\)*)"(?:\\[\s\S]|\$\([^)]+\)|\$(?!\()|`[^`]+`|[^"\\`$])*"/,lookbehind:!0,greedy:!0,inside:i},{pattern:/(^|[^$\\])'[^']*'/,lookbehind:!0,greedy:!0},{pattern:/\$'(?:[^'\\]|\\[\s\S])*'/,greedy:!0,inside:{entity:i.entity}}],environment:{pattern:RegExp("\\$?"+t),alias:"constant"},variable:i.variable,function:{pattern:/(^|[\s;|&]|[<>]\()(?:add|apropos|apt|apt-cache|apt-get|aptitude|aspell|automysqlbackup|awk|basename|bash|bc|bconsole|bg|bzip2|cal|cargo|cat|cfdisk|chgrp|chkconfig|chmod|chown|chroot|cksum|clear|cmp|column|comm|composer|cp|cron|crontab|csplit|curl|cut|date|dc|dd|ddrescue|debootstrap|df|diff|diff3|dig|dir|dircolors|dirname|dirs|dmesg|docker|docker-compose|du|egrep|eject|env|ethtool|expand|expect|expr|fdformat|fdisk|fg|fgrep|file|find|fmt|fold|format|free|fsck|ftp|fuser|gawk|git|gparted|grep|groupadd|groupdel|groupmod|groups|grub-mkconfig|gzip|halt|head|hg|history|host|hostname|htop|iconv|id|ifconfig|ifdown|ifup|import|install|ip|java|jobs|join|kill|killall|less|link|ln|locate|logname|logrotate|look|lpc|lpr|lprint|lprintd|lprintq|lprm|ls|lsof|lynx|make|man|mc|mdadm|mkconfig|mkdir|mke2fs|mkfifo|mkfs|mkisofs|mknod|mkswap|mmv|more|most|mount|mtools|mtr|mutt|mv|nano|nc|netstat|nice|nl|node|nohup|notify-send|npm|nslookup|op|open|parted|passwd|paste|pathchk|ping|pkill|pnpm|podman|podman-compose|popd|pr|printcap|printenv|ps|pushd|pv|quota|quotacheck|quotactl|ram|rar|rcp|reboot|remsync|rename|renice|rev|rm|rmdir|rpm|rsync|scp|screen|sdiff|sed|sendmail|seq|service|sftp|sh|shellcheck|shuf|shutdown|sleep|slocate|sort|split|ssh|stat|strace|su|sudo|sum|suspend|swapon|sync|sysctl|tac|tail|tar|tee|time|timeout|top|touch|tr|traceroute|tsort|tty|umount|uname|unexpand|uniq|units|unrar|unshar|unzip|update-grub|uptime|useradd|userdel|usermod|users|uudecode|uuencode|v|vcpkg|vdir|vi|vim|virsh|vmstat|wait|watch|wc|wget|whereis|which|who|whoami|write|xargs|xdg-open|yarn|yes|zenity|zip|zsh|zypper)(?=$|[)\s;|&])/,lookbehind:!0},keyword:{pattern:/(^|[\s;|&]|[<>]\()(?:case|do|done|elif|else|esac|fi|for|function|if|in|select|then|until|while)(?=$|[)\s;|&])/,lookbehind:!0},builtin:{pattern:/(^|[\s;|&]|[<>]\()(?:\.|:|alias|bind|break|builtin|caller|cd|command|continue|declare|echo|enable|eval|exec|exit|export|getopts|hash|help|let|local|logout|mapfile|printf|pwd|read|readarray|readonly|return|set|shift|shopt|source|test|times|trap|type|typeset|ulimit|umask|unalias|unset)(?=$|[)\s;|&])/,lookbehind:!0,alias:"class-name"},boolean:{pattern:/(^|[\s;|&]|[<>]\()(?:false|true)(?=$|[)\s;|&])/,lookbehind:!0},"file-descriptor":{pattern:/\B&\d\b/,alias:"important"},operator:{pattern:/\d?<>|>\||\+=|=[=~]?|!=?|<<[<-]?|[&\d]?>>|\d[<>]&?|[<>][&=]?|&[>&]?|\|[&|]?/,inside:{"file-descriptor":{pattern:/^\d/,alias:"important"}}},punctuation:/\$?\(\(?|\)\)?|\.\.|[{}[\];\\]/,number:{pattern:/(^|\s)(?:[1-9]\d*|0)(?:[.,]\d+)?\b/,lookbehind:!0}},o.inside=e.languages.bash;for(var s=["comment","function-name","for-or-select","assign-left","parameter","string","environment","function","keyword","builtin","boolean","file-descriptor","operator","punctuation","number"],u=i.variable[1].inside,k=0;k<s.length;k++)u[s[k]]=e.languages.bash[s[k]];e.languages.sh=e.languages.bash,e.languages.shell=e.languages.bash})(Prism);Prism.languages.json={property:{pattern:/(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?=\s*:)/,lookbehind:!0,greedy:!0},string:{pattern:/(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?!\s*:)/,lookbehind:!0,greedy:!0},comment:{pattern:/\/\/.*|\/\*[\s\S]*?(?:\*\/|$)/,greedy:!0},number:/-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i,punctuation:/[{}[\],]/,operator:/:/,boolean:/\b(?:false|true)\b/,null:{pattern:/\bnull\b/,alias:"keyword"}};Prism.languages.webmanifest=Prism.languages.json;var ut={},mt;function ao(){return mt||(mt=1,(function(e){e.languages.typescript=e.languages.extend("javascript",{"class-name":{pattern:/(\b(?:class|extends|implements|instanceof|interface|new|type)\s+)(?!keyof\b)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?:\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>)?/,lookbehind:!0,greedy:!0,inside:null},builtin:/\b(?:Array|Function|Promise|any|boolean|console|never|number|string|symbol|unknown)\b/}),e.languages.typescript.keyword.push(/\b(?:abstract|declare|is|keyof|readonly|require)\b/,/\b(?:asserts|infer|interface|module|namespace|type)\b(?=\s*(?:[{_$a-zA-Z\xA0-\uFFFF]|$))/,/\btype\b(?=\s*(?:[\{*]|$))/),delete e.languages.typescript.parameter,delete e.languages.typescript["literal-property"];var t=e.languages.extend("typescript",{});delete t["class-name"],e.languages.typescript["class-name"].inside=t,e.languages.insertBefore("typescript","function",{decorator:{pattern:/@[$\w\xA0-\uFFFF]+/,inside:{at:{pattern:/^@/,alias:"operator"},function:/^[\s\S]+/}},"generic-function":{pattern:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>(?=\s*\()/,greedy:!0,inside:{function:/^#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*/,generic:{pattern:/<[\s\S]+/,alias:"class-name",inside:t}}}}),e.languages.ts=e.languages.typescript})(Prism)),ut}ao();const io={js:"JavaScript",ts:"TypeScript",html:"HTML",bash:"Shell",json:"JSON"};function co(e){const t=e.split(`
`);for(;t.length&&!t[0].trim();)t.shift();for(;t.length&&!t[t.length-1].trim();)t.pop();const o=t.filter(i=>i.trim()).reduce((i,s)=>Math.min(i,s.match(/^(\s*)/)[1].length),1/0);return t.map(i=>i.slice(o)).join(`
`)}const lo={data:{lang:"js",code:"",label:"",copied:!1},template:`
        <div class="code-block">
            <div class="code-header">
                <span class="code-lang">{{ label || langLabel }}</span>
                <button class="copy-btn" @click="copy()">
                    {{ copied ? '✓ Copied' : 'Copy' }}
                </button>
            </div>
            <pre class="language-placeholder"><code cv-ref="el" :class="'language-' + lang"></code></pre>
        </div>
    `,exprs:{"label || langLabel":(e=>e.label||e.langLabel),"copied ? '✓ Copied' : 'Copy'":(e=>e.copied?"â Copied":"Copy"),"copy()":(e=>e.copy()),"'language-' + lang":(e=>"language-"+e.lang)},computed:{langLabel(){return io[this.lang]||this.lang.toUpperCase()}},methods:{copy(){var e;(e=navigator.clipboard)==null||e.writeText(this._cleanCode).then(()=>{this.copied=!0,setTimeout(()=>{this.copied=!1},1800)})}},onMount(){const e=this.$refs.el;e&&(this._cleanCode=co(this.code),e.textContent=this._cleanCode,so.highlightElement(e))}},ve="Courvux",St="https://vanjexdev.github.io/courvux",ht=`${St}/og-image.png`;function J({title:e,description:t,slug:o="/"}){const i=e?`${e} — ${ve}`:`${ve} — Lightweight reactive UI framework`,s=St+o;return Qt({title:e??`${ve} — Lightweight reactive UI framework`,titleTemplate:e?`%s — ${ve}`:void 0,meta:[{name:"description",content:t},{property:"og:title",content:i},{property:"og:description",content:t},{property:"og:type",content:"website"},{property:"og:url",content:s},{property:"og:site_name",content:ve},{property:"og:image",content:ht},{property:"og:image:width",content:"1200"},{property:"og:image:height",content:"630"},{name:"twitter:card",content:"summary_large_image"},{name:"twitter:title",content:i},{name:"twitter:description",content:t},{name:"twitter:image",content:ht}],link:[{rel:"canonical",href:s}]})}const po={data:{install:`# From GitHub — pin a tag for stable installs
pnpm add github:vanjexdev/courvux#v0.7.1

# or rolling main
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
                    <img src="/courvux/logo.png" alt="Courvux" width="48" height="48" style="display:block;" />
                    <h1 style="font-size:2rem; font-weight:700; margin:0;">Courvux</h1>
                    <span class="badge">v0.7.1</span>
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
                    <div style="font-size:13px; font-weight:600; margin-bottom:4px;">~20 kB gzip</div>
                    <div style="font-size:12px; color:#666;">Single ES module with router, store, devtools, composables, useHead, SSR.</div>
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
    `,exprs:{"'bash'":(e=>"bash"),install:(e=>e.install),"'terminal'":(e=>"terminal"),"'js'":(e=>"js"),counter:(e=>e.counter),"'main.js'":(e=>"main.js")},onMount(){J({description:"Lightweight reactive UI framework for the browser. No virtual DOM. Proxy-based reactivity. ~20 KB gzip with everything (router, store, devtools, composables, useHead, SSR).",slug:"/"})}},uo={data:{s1:`# Latest commit on main (rolling)
pnpm add github:vanjexdev/courvux

# Pin to a tagged release (recommended for production)
pnpm add github:vanjexdev/courvux#v0.7.1`,s2:`<script type="importmap">
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
    "courvux": "https://cdn.jsdelivr.net/gh/vanjexdev/courvux@v0.7.1/dist/index.js"
  }
}
<\/script>

<script type="module">
  import { createApp, createStore, createRouter } from 'courvux';
<\/script>`},onMount(){J({title:"Installation",description:"Install Courvux from GitHub or via import map / CDN. Vite plugin for templateUrl inlining and jsDelivr CDN setup.",slug:"/installation"});const e=this.$refs.pen;if(!e)return;const t=document.createElement("iframe");t.src="https://codepen.io/jesusuzcategui-the-bold/embed/VYmZNgZ?default-tab=html%2Cresult&theme-id=dark",t.height="420",t.style.cssText="width:100%; border:0; border-radius:8px; display:block; margin-bottom:1rem;",t.scrolling="no",t.setAttribute("frameborder","no"),t.setAttribute("allowtransparency","true"),t.allowFullscreen=!0,t.title="Courvux CDN demo on CodePen",e.replaceWith(t)},template:`
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
            <p>Install directly from the GitHub repository — pin a tag for stable installs:</p>
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

            <h2>Browser support</h2>
            <p>Courvux targets <strong>the last two major versions</strong> of each modern browser. Older versions may work but are not validated.</p>
            <table>
                <thead>
                    <tr><th>Browser</th><th>Minimum version</th><th>Status</th></tr>
                </thead>
                <tbody>
                    <tr><td>Chrome</td><td>90+</td><td>✅</td></tr>
                    <tr><td>Edge</td><td>90+</td><td>✅</td></tr>
                    <tr><td>Firefox</td><td>88+</td><td>✅</td></tr>
                    <tr><td>Safari (macOS / iOS)</td><td>15+</td><td>✅ (verified since 0.4.4 on iOS Safari)</td></tr>
                    <tr><td>Samsung Internet</td><td>18+</td><td>✅ (verified since 0.4.4)</td></tr>
                    <tr><td>iOS WebView</td><td>iOS 15+</td><td>✅</td></tr>
                    <tr><td>Android WebView</td><td>Chrome 90+</td><td>✅</td></tr>
                </tbody>
            </table>
            <p style="font-size:13px; color:#555;">
                Every release runs unit tests + SSR / SSG self-tests + a Playwright E2E suite on Chromium and Firefox. WebKit-class browsers (Safari, Samsung Internet, iOS WebView) are validated on real devices for each release. CI integration is on the roadmap.
            </p>
            <p style="font-size:13px; color:#555;">
                Hit a bug on a supported browser? <a href="https://github.com/vanjexdev/courvux/issues" target="_blank" rel="noopener">Open an issue</a> — same first-priority class as the 0.4.4 / 0.4.5 / 0.4.6 patches.
            </p>

            <div style="margin-top:2rem; display:flex; gap:12px;">
                <router-link to="/" style="font-size:13px; color:#555;">← Home</router-link>
                <router-link to="/quick-start" style="font-size:13px; color:#111; font-weight:600;">Quick Start →</router-link>
            </div>
        </div>
    `,exprs:{"'html'":(e=>"html"),sCdn:(e=>e.sCdn),"'index.html'":(e=>"index.html"),sCdnMap:(e=>e.sCdnMap),"'bash'":(e=>"bash"),s1:(e=>e.s1),"'terminal'":(e=>"terminal"),s2:(e=>e.s2),"'js'":(e=>"js"),s3:(e=>e.s3),"'main.js'":(e=>"main.js"),s4:(e=>e.s4),"'vite.config.js'":(e=>"vite.config.js"),"'json'":(e=>"json"),s5:(e=>e.s5),"'tsconfig.json'":(e=>"tsconfig.json")}},mo={data:{s1:`import { createApp } from 'courvux';

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
    `,exprs:{"'js'":(e=>"js"),s1:(e=>e.s1),"'main.js'":(e=>"main.js"),s2:(e=>e.s2),s3:(e=>e.s3),s4:(e=>e.s4)},onMount(){J({title:"Quick Start",description:"Build your first reactive Courvux app — counter example, methods, computed properties.",slug:"/quick-start"})}},ho={data:{s_interp:`<!-- Text interpolation -->
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
<input cv-model.debounce.500="search" />    <!-- custom delay -->`,s_cvhtml:`<!-- Sanitized by default — strips <script>, on*= handlers, javascript: URLs.
     Safe for user-submitted content. -->
<div cv-html="userContent"></div>

<!-- Opt out of sanitization with .raw — only for content YOU authored
     (Markdown rendered server-side, hand-curated HTML, etc.) -->
<div cv-html.raw="myTrustedContent"></div>`,s_cvdata:`<!-- Inline reactive scope — no component registration needed -->
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
            <p>Sets <code>innerHTML</code>. Sanitized by default — strips <code>&lt;script&gt;</code>, <code>on*=</code> handlers, and <code>javascript:</code> URLs so user-submitted content is safe to render. Add <code>.raw</code> to opt out when the markup is something you authored (Markdown rendered server-side, hand-curated copy).</p>
            <code-block :lang="'html'" :code="s_cvhtml"></code-block>
            <div class="callout warning">
                <strong>Breaking change in 0.6.0:</strong> the default flipped from raw to sanitized. The pre-0.6 <code>cv-html.sanitize</code> still works (it's now a no-op). To restore the old raw behavior on a binding you control, switch <code>cv-html</code> → <code>cv-html.raw</code>.
            </div>

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
    `,exprs:{"'html'":(e=>"html"),s_interp:(e=>e.s_interp),s_bind:(e=>e.s_bind),s_events:(e=>e.s_events),s_cvfor:(e=>e.s_cvfor),s_cvif:(e=>e.s_cvif),s_cvshow:(e=>e.s_cvshow),s_cvmodel:(e=>e.s_cvmodel),s_cvhtml:(e=>e.s_cvhtml),s_cvdata:(e=>e.s_cvdata),s_misc:(e=>e.s_misc)},onMount(){J({title:"Template Syntax",description:"Courvux directives and bindings: cv-if, cv-for, cv-model, cv-show, :class, :style, @event.",slug:"/template"})}},fo={data:{s_define:`createApp({
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
    `,exprs:{"'js'":(e=>"js"),s_define:(e=>e.s_define),s_props:(e=>e.s_props),s_emit:(e=>e.s_emit),s_dispatch:(e=>e.s_dispatch),"'html'":(e=>"html"),s_slots:(e=>e.s_slots),s_dynamic:(e=>e.s_dynamic),s_refs:(e=>e.s_refs),s_model:(e=>e.s_model)},onMount(){J({title:"Components",description:"Define, register, and compose Courvux components with props, slots, emits, and scoped slots.",slug:"/components"})}},go={data:{s_computed:`{
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
}`,s_escape:"import { markRaw, toRaw, readonly } from 'courvux';",s_markraw:`// Skip Proxy wrapping for third-party class instances whose internal
// slots break under Proxy (Chart.js, xterm.js, Map, Set, etc.)
{
    data: {
        chart: markRaw(new Chart(canvas, opts)),  // not made reactive
    }
}`,s_toraw:`// Get the underlying non-Proxy object — useful for serialization,
// JSON.stringify, deep equality, or passing to non-reactive APIs.
const snapshot = toRaw(this.user);
console.log(JSON.stringify(snapshot));`,s_readonly:`// Wrap so writes are silently ignored (with a warning).
// Use for provide values that descendants must not mutate.
provide() {
    return {
        config: readonly(this.appConfig),
    };
}`,s_proxyId:`// ❌ Pitfall — proxy identity is per-access
const card = this.cards.find(c => c.id === this.dragId);
const idx  = this.cards.indexOf(card);   // -1 — different proxy wrapper!
this.cards.splice(idx, 1);                // splice(-1, 1) deletes the LAST row

// ✅ Always look items up by primitive id, never by proxy reference
const idx = this.cards.findIndex(c => c.id === this.dragId);
this.cards.splice(idx, 1);

// ✅ Or unwrap with toRaw if you really need identity
import { toRaw } from 'courvux';
const raw = toRaw(card);
this.cards.indexOf(raw);   // works, but findIndex is usually clearer`,s_batchHot:`// Three rapid mutations to the same array key — drop handler in a kanban
// board, swap rows in a table, etc. Each one schedules its own re-render.
// Wrap in $batch so cv-for re-renders once with the final state instead of
// three times.
this.$batch(() => {
    this.rows[fromIdx].col = toCol;
    const [moved] = this.rows.splice(fromIdx, 1);
    this.rows.push(moved);
});`},template:`
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

            <h2>Escape hatches</h2>
            <p>Three helpers let you opt out of reactivity selectively:</p>
            <code-block :lang="'js'" :code="s_escape"></code-block>

            <table>
                <thead><tr><th>Helper</th><th>Use case</th></tr></thead>
                <tbody>
                    <tr><td><code>markRaw(obj)</code></td><td>Skip Proxy wrapping (third-party class instances like Chart.js or xterm.js controllers)</td></tr>
                    <tr><td><code>toRaw(reactive)</code></td><td>Get the underlying non-Proxy object (serialization, <code>JSON.stringify</code>, deep equality)</td></tr>
                    <tr><td><code>readonly(obj)</code></td><td>Wrap so writes are silently ignored (use for <code>provide</code> values that shouldn't mutate downstream)</td></tr>
                </tbody>
            </table>

            <h3>markRaw</h3>
            <code-block :lang="'js'" :code="s_markraw"></code-block>

            <h3>toRaw</h3>
            <code-block :lang="'js'" :code="s_toraw"></code-block>

            <h3>readonly</h3>
            <code-block :lang="'js'" :code="s_readonly"></code-block>

            <div class="callout info">
                Native built-ins like <code>Date</code>, <code>Map</code>, <code>Set</code>, <code>RegExp</code>, and typed arrays are automatically skipped from Proxy wrapping — you don't need <code>markRaw</code> for them.
            </div>

            <h2>Common gotchas</h2>

            <h3>Proxy identity — prefer <code>findIndex</code> over <code>indexOf</code></h3>
            <p>Courvux wraps each property access in a fresh Proxy, so the object you get from <code>.find()</code> is not <code>===</code> to the same row when read again from the array. <code>indexOf(proxy)</code> returns <code>-1</code>, and <code>splice(-1, 1)</code> silently deletes the last row instead of the one you meant. Look items up by their primitive id with <code>findIndex</code>:</p>
            <code-block :lang="'js'" :code="s_proxyId"></code-block>

            <h3>Hot-path mutations — wrap in <code>$batch</code></h3>
            <p>If you do three or more rapid mutations to the same array (drag-and-drop, bulk edits, etc.), each one schedules its own re-render. Wrapping the sequence in <code>$batch</code> coalesces them into a single render with the final state — usually a noticeable speedup, and it sidesteps any chance of intermediate states being painted.</p>
            <code-block :lang="'js'" :code="s_batchHot"></code-block>
            <div class="callout info">
                Since 0.5.1, <code>cv-for</code> with <code>:key</code> serializes overlapping renders internally, so even without <code>$batch</code> the DOM stays correct. <code>$batch</code> is now a pure performance lever for these patterns, not a correctness requirement.
            </div>

            <div style="margin-top:2rem; display:flex; gap:12px;">
                <router-link to="/components" style="font-size:13px; color:#555;">← Components</router-link>
                <router-link to="/lifecycle" style="font-size:13px; color:#111; font-weight:600;">Lifecycle →</router-link>
            </div>
        </div>
    `,exprs:{"'js'":(e=>"js"),s_computed:(e=>e.s_computed),s_computed_set:(e=>e.s_computed_set),s_watch:(e=>e.s_watch),s_watch_prog:(e=>e.s_watch_prog),s_batch:(e=>e.s_batch),s_nexttick:(e=>e.s_nexttick),s_watcheffect:(e=>e.s_watcheffect),s_escape:(e=>e.s_escape),s_markraw:(e=>e.s_markraw),s_toraw:(e=>e.s_toraw),s_readonly:(e=>e.s_readonly),s_proxyId:(e=>e.s_proxyId),s_batchHot:(e=>e.s_batchHot)},onMount(){J({title:"Reactivity",description:"Proxy-based reactive state, computed properties, watchers, and refs in Courvux.",slug:"/reactivity"})}},vo={data:{s1:`{
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
    `,exprs:{"'js'":(e=>"js"),s1:(e=>e.s1),s2:(e=>e.s2),s3:(e=>e.s3)},onMount(){J({title:"Lifecycle Hooks",description:"onMount, onBeforeUnmount, onDestroy, error boundaries, and async data in Courvux.",slug:"/lifecycle"})}},bo={data:{s_storage:`import { cvStorage } from 'courvux';

const settings = cvStorage('app-settings', {
    theme: 'light',
    sidebar: true,
});

settings.theme = 'dark';   // automatically persisted to localStorage
settings.$clear();          // reset to defaults + remove from storage`,s_fetch:`import { cvFetch } from 'courvux';

export default {
    data: { users: [], loading: false, error: null },
    onMount() {
        const { execute, abort } = cvFetch('/api/users', ({ data, loading, error }) => {
            this.users   = data ?? [];
            this.loading = loading;
            this.error   = error;
        });
        this.$addCleanup(abort);
    }
};`,s_fetch_opts:`cvFetch('/api/posts', cb, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    { title: 'Hello' },
    immediate: false,                    // don't fire until execute() is called
    transform: raw => raw.data ?? raw,   // map response payload
});`,s_debounce:`import { cvDebounce } from 'courvux';

export default {
    data: { query: '', results: [] },
    methods: {
        // 300ms after the last keystroke, fire a single request
        search: cvDebounce(function(q) {
            return fetch(\`/search?q=\${q}\`)
                .then(r => r.json())
                .then(r => this.results = r);
        }, 300),
    }
};`,s_throttle:`import { cvThrottle } from 'courvux';

onMount() {
    // Fire at most once every 100ms while scrolling
    window.addEventListener('scroll', cvThrottle(() => {
        this.scrollY = window.scrollY;
    }, 100));
}`,s_media:`import { cvMediaQuery } from 'courvux';

onMount() {
    cvMediaQuery('(max-width: 768px)', matches => {
        this.isMobile = matches;
    });
}`,s_listener:`import { cvListener } from 'courvux';

onMount() {
    const off = cvListener(window, 'keydown', e => {
        if (e.key === 'Escape') this.close();
    });
    this.$addCleanup(off);
}`,s_define:`import { defineComposable } from 'courvux';

// A composable is a factory that returns a partial component config:
// data, methods, computed, watch, and lifecycle hooks. Spread the result
// into a component to share the logic.
export const useCounter = defineComposable((initial = 0) => ({
    data: { count: initial },
    methods: {
        inc() { this.count++; },
        reset() { this.count = initial; },
    },
}));

// Use it:
export default {
    ...useCounter(10),
    template: \`<button @click="inc()">{{ count }}</button>\`,
};`,s_useMany:`import { useComposables } from 'courvux';
import { useCounter } from './composables/useCounter.js';
import { useFlag }    from './composables/useFlag.js';

export default {
    // Merges data, methods, computed, watch, and hooks from all the
    // composables into one config. First-writer wins on key collisions
    // (and a console warning is logged). Hooks run in insertion order.
    ...useComposables(
        useCounter(0),
        useFlag(),
        // A plain config object also works — useful to add component-only
        // pieces alongside composables:
        {
            methods: {
                logBoth() { console.log(this.count, this.flag); }
            }
        }
    ),
    template: \`
        <div>
            <p>{{ count }} — {{ flag }}</p>
            <button @click="inc()">+1</button>
            <button @click="toggle()">toggle</button>
        </div>
    \`,
};`,s_nested:`import { defineComposable, useComposables } from 'courvux';

const useLogger = defineComposable((label) => ({
    data: { lastLog: '' },
    methods: { log(msg) { this.lastLog = \`\${label}:\${msg}\`; } },
}));

// Composables can call other composables. Combine via useComposables and
// return the merged config — the outer composable is just a normal factory.
export const useCounter = defineComposable((initial = 0) => useComposables(
    useLogger('counter'),
    {
        data: { count: initial },
        methods: {
            inc() { this.count++; this.log(\`now=\${this.count}\`); },
        },
    }
));`},template:`
        <div class="prose">
            <h1>Composables</h1>
            <p>Courvux ships a small set of composables that cover common app needs without third-party deps. All preserve <code>this</code> binding, are SSR-safe, and integrate with <code>$addCleanup</code> for automatic teardown.</p>

            <table>
                <thead>
                    <tr><th>Composable</th><th>Purpose</th></tr>
                </thead>
                <tbody>
                    <tr><td><code>defineComposable(factory)</code></td><td>Author a reusable bundle of data, methods, computed, watch, and hooks</td></tr>
                    <tr><td><code>useComposables(...composables)</code></td><td>Merge multiple composables into one spreadable config</td></tr>
                    <tr><td><code>cvStorage(key, defaults)</code></td><td>Reactive object backed by <code>localStorage</code></td></tr>
                    <tr><td><code>cvFetch(url, callback, options)</code></td><td>Reactive HTTP fetch with <code>{ data, loading, error }</code></td></tr>
                    <tr><td><code>cvDebounce(fn, ms)</code></td><td>Debounced function preserving <code>this</code></td></tr>
                    <tr><td><code>cvThrottle(fn, ms)</code></td><td>Throttled function preserving <code>this</code></td></tr>
                    <tr><td><code>cvMediaQuery(query, callback)</code></td><td>matchMedia with reactive callback</td></tr>
                    <tr><td><code>cvListener(target, event, handler)</code></td><td>addEventListener returning a cleanup fn</td></tr>
                </tbody>
            </table>

            <h2>defineComposable — author your own</h2>
            <p>A composable is a factory that returns a partial component config (<code>data</code>, <code>methods</code>, <code>computed</code>, <code>watch</code>, lifecycle hooks). Spread the result into a component to share the logic without coupling to the global store.</p>
            <code-block :lang="'js'" :code="s_define"></code-block>
            <p><code>defineComposable</code> is the identity helper used to mark intent and improve TypeScript inference — at runtime it returns the factory unchanged.</p>

            <h2>useComposables — combine several</h2>
            <p>To use more than one composable in the same component, wrap them with <code>useComposables(...)</code>. Data, methods, computed, watch, and hooks from every composable are merged into a single config you can spread.</p>
            <code-block :lang="'js'" :code="s_useMany"></code-block>
            <div class="callout">
                <strong>Collision rule:</strong> first writer wins for <code>data</code>, <code>methods</code>, <code>computed</code>, and <code>watch</code> keys. Duplicates log a <code>console.warn</code>. Lifecycle hooks (<code>onMount</code>, <code>onBeforeUnmount</code>, …) all run, in insertion order.
            </div>

            <h3>Nested composables</h3>
            <p>Composables are normal functions, so they can call other composables. Combine the results with <code>useComposables</code> and return the merged config:</p>
            <code-block :lang="'js'" :code="s_nested"></code-block>

            <h2>cvStorage — persistent reactive state</h2>
            <p>Every mutation is auto-persisted to <code>localStorage</code>. Survives page reloads.</p>
            <code-block :lang="'js'" :code="s_storage"></code-block>

            <h2>cvFetch — reactive data fetching</h2>
            <p>Calls the callback with <code>{ data, loading, error }</code> across the request lifecycle. Returns <code>{ execute, abort }</code> for manual control.</p>
            <code-block :lang="'js'" :code="s_fetch"></code-block>

            <h3>Options</h3>
            <code-block :lang="'js'" :code="s_fetch_opts"></code-block>

            <h2>cvDebounce — coalesce rapid calls</h2>
            <p>Returns a debounced version of the function. Wraps it preserving <code>this</code> so it works as a method.</p>
            <code-block :lang="'js'" :code="s_debounce"></code-block>

            <h2>cvThrottle — rate limit</h2>
            <p>Fires immediately, then drops calls inside the window and schedules a single trailing call.</p>
            <code-block :lang="'js'" :code="s_throttle"></code-block>

            <h2>cvMediaQuery — reactive matchMedia</h2>
            <p>Fires the callback with the initial value, then on every change.</p>
            <code-block :lang="'js'" :code="s_media"></code-block>

            <h2>cvListener — event listener with cleanup</h2>
            <p>Adds an event listener and returns a function that removes it. Pair with <code>$addCleanup</code> for automatic teardown on destroy.</p>
            <code-block :lang="'js'" :code="s_listener"></code-block>

            <div style="margin-top:2rem; display:flex; gap:12px;">
                <router-link to="/lifecycle" style="font-size:13px; color:#555;">← Lifecycle</router-link>
                <router-link to="/event-bus" style="font-size:13px; color:#111; font-weight:600;">Event Bus →</router-link>
            </div>
        </div>
    `,exprs:{"'js'":(e=>"js"),s_define:(e=>e.s_define),s_useMany:(e=>e.s_useMany),s_nested:(e=>e.s_nested),s_storage:(e=>e.s_storage),s_fetch:(e=>e.s_fetch),s_fetch_opts:(e=>e.s_fetch_opts),s_debounce:(e=>e.s_debounce),s_throttle:(e=>e.s_throttle),s_media:(e=>e.s_media),s_listener:(e=>e.s_listener)},onMount(){J({title:"Composables",description:"Author and reuse logic in Courvux with defineComposable + useComposables, plus the built-in cvStorage, cvFetch, cvDebounce, cvThrottle, cvMediaQuery, cvListener helpers.",slug:"/composables"})}},yo={data:{s_basic:`import { createEventBus } from 'courvux';

const bus = createEventBus();

const off = bus.on('user:login', payload => {
    console.log('logged in:', payload);
});

bus.emit('user:login', { id: '1', name: 'Alice' });

off();                          // unsubscribe one handler
bus.clear('user:login');        // remove all handlers for this event
bus.clear();                    // remove all handlers for every event`,s_typed:`import { createEventBus, type EventBus } from 'courvux';

interface AppEvents {
    'user:login':  { id: string; name: string };
    'cart:update': { count: number };
}

const bus: EventBus<AppEvents> = createEventBus<AppEvents>();

bus.on('user:login', p => p.name);          // p typed as { id, name }
bus.emit('cart:update', { count: 3 });       // payload type-checked
bus.emit('user:login', { count: 0 });        // ❌ type error`,s_provide:`// app root
import { createApp, createEventBus } from 'courvux';

const bus = createEventBus();

createApp({
    provide: { bus },
    // ...
}).mount('#app');`,s_inject:`// any descendant component
export default {
    inject: ['bus'],
    onMount() {
        this.bus.on('cart:update', payload => {
            this.cartCount = payload.count;
        });
    }
};`,s_once:`bus.once('toast:show', msg => {
    showToast(msg);  // fires exactly once, then unsubscribes
});

bus.emit('toast:show', 'Saved');
bus.emit('toast:show', 'Saved again');  // handler does NOT run`},template:`
        <div class="prose">
            <h1>Event Bus</h1>
            <p>For cross-component signals that don't belong in the store (analytics, IPC bridges, plugin hooks), Courvux exports a small typed event bus.</p>

            <h2>Basic usage</h2>
            <code-block :lang="'js'" :code="s_basic"></code-block>

            <h2>Typed events (TypeScript)</h2>
            <p>Pass an event-map type as a generic to <code>createEventBus</code>. Both handler payloads and <code>emit</code> arguments are checked at compile time.</p>
            <code-block :lang="'ts'" :code="s_typed"></code-block>

            <h2>once — fire-and-forget</h2>
            <code-block :lang="'js'" :code="s_once"></code-block>

            <h2>Provide / inject the bus across the tree</h2>
            <p>Avoid passing the bus through props. Provide it on the root and inject in any descendant.</p>
            <code-block :lang="'js'" :code="s_provide"></code-block>
            <code-block :lang="'js'" :code="s_inject"></code-block>

            <h2>API</h2>
            <table>
                <thead><tr><th>Method</th><th>Description</th></tr></thead>
                <tbody>
                    <tr><td><code>on(event, handler)</code></td><td>Subscribe. Returns an unsubscribe function.</td></tr>
                    <tr><td><code>once(event, handler)</code></td><td>Subscribe; auto-unsubscribes after the first emit.</td></tr>
                    <tr><td><code>off(event, handler)</code></td><td>Remove a specific handler.</td></tr>
                    <tr><td><code>emit(event, payload?)</code></td><td>Notify all subscribers in registration order.</td></tr>
                    <tr><td><code>clear(event?)</code></td><td>Remove all handlers for an event, or every event when called with no args.</td></tr>
                </tbody>
            </table>

            <div class="callout info">
                Unsubscribing a handler during an emit does not affect the current dispatch — handlers added or removed mid-emit take effect on the next call.
            </div>

            <div style="margin-top:2rem; display:flex; gap:12px;">
                <router-link to="/composables" style="font-size:13px; color:#555;">← Composables</router-link>
                <router-link to="/router" style="font-size:13px; color:#111; font-weight:600;">Router →</router-link>
            </div>
        </div>
    `,exprs:{"'js'":(e=>"js"),s_basic:(e=>e.s_basic),"'ts'":(e=>"ts"),s_typed:(e=>e.s_typed),s_once:(e=>e.s_once),s_provide:(e=>e.s_provide),s_inject:(e=>e.s_inject)},onMount(){J({title:"Event Bus",description:"Typed cross-component event bus in Courvux: on, off, emit, once, clear, and provide/inject patterns.",slug:"/event-bus"})}},xo={data:{s_setup:`import { createApp, createRouter } from 'courvux';

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
    `,exprs:{"'js'":(e=>"js"),s_setup:(e=>e.s_setup),s_route:(e=>e.s_route),s_params:(e=>e.s_params),s_lazy:(e=>e.s_lazy),s_navigate:(e=>e.s_navigate),s_nested:(e=>e.s_nested)},onMount(){J({title:"Router",description:"SPA routing in Courvux: dynamic params, nested routes, navigation guards, transitions.",slug:"/router"})}},wo={data:{s1:`import { createStore } from 'courvux';

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
    `,exprs:{"'js'":(e=>"js"),s1:(e=>e.s1),"'html'":(e=>"html"),s2:(e=>e.s2),s3:(e=>e.s3),s4:(e=>e.s4),s5:(e=>e.s5),s6:(e=>e.s6)},onMount(){J({title:"Store",description:"Global reactive state in Courvux with createStore, modules, and namespaced actions.",slug:"/store"})}},ko={data:{s_basic:`import { useHead } from 'courvux';

export default {
    onMount() {
        const cleanup = useHead({
            title: 'Installation',
            titleTemplate: '%s — Courvux',
            meta: [
                { name: 'description', content: 'Get started with Courvux in under 60 seconds.' },
                { property: 'og:title',       content: 'Installation — Courvux' },
                { property: 'og:description', content: 'Get started with Courvux in under 60 seconds.' },
                { property: 'og:image',       content: '/og/installation.png' },
                { name: 'twitter:card',       content: 'summary_large_image' },
            ],
            link: [
                { rel: 'canonical', href: 'https://courvux.dev/installation' },
            ],
        });
        this.$addCleanup(cleanup);
    }
};`,s_jsonld:`useHead({
    script: [{
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type':    'SoftwareApplication',
            name:        'Courvux',
            applicationCategory: 'DeveloperApplication',
            operatingSystem:     'Any',
            offers: { '@type': 'Offer', price: '0' },
        }),
    }],
});`,s_html_attrs:`useHead({
    htmlAttrs: { lang: 'es', class: 'theme-dark' },
    bodyAttrs: { 'data-route': 'installation' },
});`,s_title_tpl:`// String form — %s is replaced
useHead({ title: 'Install', titleTemplate: '%s — Courvux' });
// → <title>Install — Courvux</title>

// Function form
useHead({ title: 'Install', titleTemplate: t => \`\${t} | site\` });
// → <title>Install | site</title>`},template:`
        <div class="prose">
            <h1>useHead — SEO and metadata</h1>
            <p><code>useHead</code> is the per-component head management composable. It updates <code>document.title</code>, upserts <code>&lt;meta&gt;</code> and <code>&lt;link&gt;</code> tags, and lets each route declare its own metadata. Tags are reverted on cleanup so navigating away from a route restores the previous head exactly.</p>

            <h2>Basic usage</h2>
            <code-block :lang="'js'" :code="s_basic"></code-block>

            <h2>Title templates</h2>
            <code-block :lang="'js'" :code="s_title_tpl"></code-block>

            <h2>Config shape</h2>
            <table>
                <thead><tr><th>Field</th><th>Notes</th></tr></thead>
                <tbody>
                    <tr><td><code>title</code></td><td>Replaces <code>document.title</code>. Restored on cleanup.</td></tr>
                    <tr><td><code>titleTemplate</code></td><td>String with <code>%s</code> placeholder, or function form.</td></tr>
                    <tr><td><code>meta</code></td><td>Each entry becomes a <code>&lt;meta&gt;</code> tag. Dedupe by <code>name</code>, then <code>property</code>, then <code>http-equiv</code>.</td></tr>
                    <tr><td><code>link</code></td><td>Each entry becomes a <code>&lt;link&gt;</code> tag. <code>rel="canonical"</code> is unique. Other links dedupe by <code>rel + href</code>.</td></tr>
                    <tr><td><code>script</code></td><td>Each entry becomes a <code>&lt;script&gt;</code> tag. Use <code>innerHTML</code> for inline content. Always inserted fresh.</td></tr>
                    <tr><td><code>htmlAttrs</code></td><td>Sets attributes on <code>&lt;html&gt;</code> (e.g. <code>lang</code>, <code>class</code>). Restored on cleanup.</td></tr>
                    <tr><td><code>bodyAttrs</code></td><td>Sets attributes on <code>&lt;body&gt;</code>. Restored on cleanup.</td></tr>
                </tbody>
            </table>

            <h2>JSON-LD structured data</h2>
            <p>Inject Schema.org structured data via the <code>script</code> field. Improves SERP appearance and Knowledge Graph eligibility.</p>
            <code-block :lang="'js'" :code="s_jsonld"></code-block>

            <h2>html / body attrs</h2>
            <code-block :lang="'js'" :code="s_html_attrs"></code-block>

            <h2>SSR safety</h2>
            <p><code>useHead</code> is a no-op when <code>document</code> is unavailable, so it's safe to call during SSR. During <a href="/courvux/ssg/" class="link">static generation</a>, calls are buffered and inlined into the emitted page's <code>&lt;head&gt;</code> automatically.</p>

            <div class="callout info">
                Pair <code>useHead</code> with <code>mode: 'history'</code> in the router so each route has a real URL the crawler can fetch. Hash routing (<code>#/path</code>) prevents servers and crawlers from seeing per-route content.
            </div>

            <div style="margin-top:2rem; display:flex; gap:12px;">
                <router-link to="/store" style="font-size:13px; color:#555;">← Store</router-link>
                <router-link to="/ssg" style="font-size:13px; color:#111; font-weight:600;">Static Generation →</router-link>
            </div>
        </div>
    `,exprs:{"'js'":(e=>"js"),s_basic:(e=>e.s_basic),s_title_tpl:(e=>e.s_title_tpl),s_jsonld:(e=>e.s_jsonld),s_html_attrs:(e=>e.s_html_attrs)},onMount(){J({title:"useHead — SEO and metadata",description:"Per-component head management with useHead in Courvux: title, meta tags, Open Graph, JSON-LD, htmlAttrs.",slug:"/head"})}},So={data:{s_vite:`// vite.config.js
import { defineConfig } from 'vite';
import courvuxSsg from 'courvux/plugin/ssg';

export default defineConfig({
    plugins: [
        courvuxSsg({
            // Required — async function returning the route list.
            routes: async () => (await import('./src/routes-data.js')).default,

            // Required for sitemap.xml + robots.txt
            baseUrl: 'https://courvux.dev',

            // Optional — page shell (HTML string or path). Defaults to the
            // Vite-emitted index.html with %head% / %app% placeholders.
            // template: '<!doctype html>...',

            // Optional — id of the mount root in the shell. Default: 'app'.
            // mountId: 'app',

            // Optional — also emit sitemap.xml + robots.txt. Default: true.
            // sitemap: true,
        }),
    ],
});`,s_routes:`const routes = [
    {
        path: '/',
        component: HomePage,
        head: { title: 'Home — Courvux' },     // fallback if useHead not called
    },
    {
        path: '/installation',
        component: InstallationPage,            // calls useHead in onMount
    },
    {
        // Dynamic route — list paths to emit
        path: '/blog/:slug',
        component: BlogPost,
        prerender: async () => {
            const posts = await fetch('https://api.example.com/posts').then(r => r.json());
            return posts.map(p => \`/blog/\${p.slug}\`);
        },
    },
];`,s_output:`dist/
├── index.html                  ← /
├── installation/index.html     ← /installation
├── quick-start/index.html      ← /quick-start
├── blog/
│   ├── intro/index.html        ← /blog/intro (from prerender)
│   └── faq/index.html          ← /blog/faq
├── sitemap.xml
└── robots.txt`,s_programmatic:`import { renderPage, renderHeadToString } from 'courvux';

const { html, head } = await renderPage(componentConfig);
const headHtml = renderHeadToString(head);

// → embed headHtml in your shell, then html in the mount root`},template:`
        <div class="prose">
            <h1>Static Site Generation (SSG)</h1>
            <p>The <code>courvux/plugin/ssg</code> Vite plugin pre-renders every route to its own <code>index.html</code> at build time. Crawlers, Open Graph previewers, and static hosts (GitHub Pages, Netlify, Cloudflare Pages) see real per-route HTML — not an empty SPA shell.</p>

            <p>The plugin captures <code>useHead</code> calls during render, so each emitted page has its correct <code>&lt;title&gt;</code>, meta tags, canonical link, and JSON-LD inlined into <code>&lt;head&gt;</code>. A <code>sitemap.xml</code> and <code>robots.txt</code> are emitted alongside.</p>

            <h2>Vite config</h2>
            <code-block :lang="'js'" :code="s_vite"></code-block>

            <h2>Per-route options</h2>
            <code-block :lang="'js'" :code="s_routes"></code-block>

            <h2>Output structure</h2>
            <p>Each route gets its own folder so static hosts serve real HTML at every URL — no <code>404.html</code> trick needed.</p>
            <code-block :lang="'text'" :code="s_output"></code-block>

            <h2>How head capture works</h2>
            <p>During SSG, <code>useHead</code> calls are buffered instead of mutating the document. The plugin merges them per route, applies dedupe rules, and inlines them into the <code>&lt;head&gt;</code> of the emitted HTML. If a component does not call <code>useHead</code>, the route-level <code>head</code> field is used as a fallback.</p>

            <p><code>onMount</code> is invoked during SSG so the standard <code>useHead</code> pattern works as-is. Errors thrown from <code>onMount</code> (e.g. for client-only APIs like <code>IntersectionObserver</code>) are caught and logged — guard SSR-incompatible code with <code>typeof window === 'undefined'</code>.</p>

            <h2>Programmatic API</h2>
            <p>If you don't use Vite, the same primitives are exported:</p>
            <code-block :lang="'js'" :code="s_programmatic"></code-block>

            <h2>Subpath deployments — router base</h2>
            <p>If your site lives under a subpath (e.g. GitHub Pages at <code>/&lt;repo&gt;/</code>), pass <code>base</code> to the router so internal route paths stay clean (<code>/about</code>) but URLs and links are prefixed correctly:</p>
            <code-block :lang="'js'" :code="\`createRouter(routes, {\\n    mode: 'history',\\n    base: '/courvux',\\n});\`"></code-block>

            <div style="margin-top:2rem; display:flex; gap:12px;">
                <router-link to="/head" style="font-size:13px; color:#555;">← useHead</router-link>
                <router-link to="/devtools" style="font-size:13px; color:#111; font-weight:600;">DevTools →</router-link>
            </div>
        </div>
    `,exprs:{"'js'":(e=>"js"),s_vite:(e=>e.s_vite),s_routes:(e=>e.s_routes),"'text'":(e=>"text"),s_output:(e=>e.s_output),s_programmatic:(e=>e.s_programmatic),"`createRouter(routes, {\\n    mode: 'history',\\n    base: '/courvux',\\n});`":(e=>`createRouter(routes, {
    mode: 'history',
    base: '/courvux',
});`)},onMount(){J({title:"Static Site Generation",description:"Pre-render every route to static HTML at build time with the courvux/plugin/ssg Vite plugin.",slug:"/ssg"})}},_o={data:{s_setup:`import { createApp, setupDevTools, mountDevOverlay } from 'courvux';

const app = createApp(config);

if (import.meta.env.DEV) {
    const hook = setupDevTools();
    mountDevOverlay(hook);
}

await app.mount('#app');`,s_hook:`interface DevToolsHook {
    instances: DevToolsComponentInstance[];
    stores:    DevToolsStoreEntry[];
    on(event: 'mount' | 'update' | 'destroy' | 'store-update', cb: Function): () => void;
}

interface DevToolsComponentInstance {
    id:       string;
    name:     string;
    getState(): Record<string, any>;
    setState(key: string, value: any): void;
    subscribe(cb: () => void): () => void;
}`,s_external:`// The hook is also exposed for external tooling
const hook = window.__COURVUX_DEVTOOLS__;

hook.on('mount', instance => {
    console.log('mounted:', instance.name);
});

// Reactively edit a component's state from the console:
const inst = hook.instances.find(i => i.name === 'todo-list');
inst.setState('filter', 'completed');`},template:`
        <div class="prose">
            <h1>DevTools</h1>
            <p>Courvux ships an in-app DevTools panel — no browser extension required. It mounts a draggable badge in the corner of the page that opens a panel showing all mounted components, their reactive state, and the global store, with <strong>inline live editing</strong>: click any value to edit it, press Enter to commit.</p>

            <h2>Setup</h2>
            <code-block :lang="'js'" :code="s_setup"></code-block>

            <h2>What it shows</h2>
            <table>
                <thead><tr><th>Tab</th><th>Content</th></tr></thead>
                <tbody>
                    <tr><td>Components</td><td>Tree of all mounted components with their reactive state. Click a key to edit its value live.</td></tr>
                    <tr><td>Store</td><td>Global store snapshot. Modules nested. Same inline editing as Components.</td></tr>
                    <tr><td>Events</td><td>Recent <code>$emit</code> / <code>$dispatch</code> activity for tracing communication between components.</td></tr>
                </tbody>
            </table>

            <h2>External integration</h2>
            <p>The hook is exposed at <code>window.__COURVUX_DEVTOOLS__</code> for use by external tooling — a Chrome extension is on the roadmap.</p>
            <code-block :lang="'js'" :code="s_external"></code-block>

            <h2>Hook API</h2>
            <code-block :lang="'ts'" :code="s_hook"></code-block>

            <div class="callout info">
                Wrap the setup in <code>import.meta.env.DEV</code> (Vite) or equivalent to keep the overlay out of production bundles. The runtime cost in dev is small — observers attach lazily per component.
            </div>

            <div style="margin-top:2rem; display:flex; gap:12px;">
                <router-link to="/ssg" style="font-size:13px; color:#555;">← Static Generation</router-link>
                <router-link to="/testing" style="font-size:13px; color:#111; font-weight:600;">Testing →</router-link>
            </div>
        </div>
    `,exprs:{"'js'":(e=>"js"),s_setup:(e=>e.s_setup),s_external:(e=>e.s_external),"'ts'":(e=>"ts"),s_hook:(e=>e.s_hook)},onMount(){J({title:"DevTools",description:"In-app DevTools overlay for Courvux: live component state inspection and inline editing, no browser extension needed.",slug:"/devtools"})}},Ao={data:{s_basic:`import { mount } from 'courvux/test-utils';
import { describe, it, expect } from 'vitest';

describe('counter', () => {
    it('increments on click', async () => {
        const w = await mount({
            template: '<button @click="count++">{{ count }}</button>',
            data:     { count: 0 }
        });

        w.find('button').click();
        await w.nextTick();
        expect(w.find('button').textContent).toBe('1');

        w.destroy();
    });
});`,s_config:`// vitest.config.js
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'happy-dom',
        globals:     true,
    }
});`,s_state:`// Drive state directly — bypass DOM events
const w = await mount({
    template: '<p>{{ count * 2 }}</p>',
    data: { count: 5 }
});

w.state.count = 10;
await w.nextTick();
expect(w.find('p').textContent).toBe('20');`,s_global:`// Inject store / router / components for the mount under test
const w = await mount(
    { template: '<p>{{ $store.user.name }}</p>' },
    {
        global: {
            store: createStore({ state: { user: { name: 'Alice' } } }),
        }
    }
);
expect(w.text()).toBe('Alice');`,s_async:`it('waits for async data', async () => {
    const w = await mount({
        template: '<p>{{ users.length }} users</p>',
        data:     { users: [] },
        async onMount() {
            this.users = await fetch('/api/users').then(r => r.json());
        }
    });

    await w.nextTick();
    expect(w.text()).toMatch(/\\d+ users/);
});`},template:`
        <div class="prose">
            <h1>Testing</h1>
            <p>Courvux exports a Vitest-compatible test utility from <code>'courvux/test-utils'</code>.</p>

            <h2>Setup</h2>
            <code-block :lang="'js'" :code="s_config"></code-block>

            <h2>First test</h2>
            <code-block :lang="'js'" :code="s_basic"></code-block>

            <h2>Wrapper API</h2>
            <table>
                <thead><tr><th>Method / property</th><th>Description</th></tr></thead>
                <tbody>
                    <tr><td><code>el</code></td><td>Root <code>HTMLElement</code> of the mounted component.</td></tr>
                    <tr><td><code>state</code></td><td>The mounted reactive state — set keys to drive updates without DOM events.</td></tr>
                    <tr><td><code>html()</code></td><td><code>innerHTML</code> of the root.</td></tr>
                    <tr><td><code>text()</code></td><td>Trimmed <code>textContent</code> of the root.</td></tr>
                    <tr><td><code>find(sel)</code></td><td>First matching element inside the mount.</td></tr>
                    <tr><td><code>findAll(sel)</code></td><td>All matching elements.</td></tr>
                    <tr><td><code>trigger(target, event)</code></td><td>Dispatch a DOM event and wait one tick.</td></tr>
                    <tr><td><code>nextTick()</code></td><td>Wait for pending reactive updates to flush.</td></tr>
                    <tr><td><code>destroy()</code></td><td>Tear down the mount.</td></tr>
                </tbody>
            </table>

            <h2>Driving state directly</h2>
            <p>Skip DOM events and mutate the reactive state. Useful for testing computed/watchers.</p>
            <code-block :lang="'js'" :code="s_state"></code-block>

            <h2>Globals — store, router, components</h2>
            <p>Pass <code>global</code> to inject app-level dependencies for the mount.</p>
            <code-block :lang="'js'" :code="s_global"></code-block>

            <h2>Async data</h2>
            <code-block :lang="'js'" :code="s_async"></code-block>

            <div style="margin-top:2rem; display:flex; gap:12px;">
                <router-link to="/devtools" style="font-size:13px; color:#555;">← DevTools</router-link>
                <router-link to="/pwa" style="font-size:13px; color:#111; font-weight:600;">PWA →</router-link>
            </div>
        </div>
    `,exprs:{"'js'":(e=>"js"),s_config:(e=>e.s_config),s_basic:(e=>e.s_basic),s_state:(e=>e.s_state),s_global:(e=>e.s_global),s_async:(e=>e.s_async)},onMount(){J({title:"Testing",description:"Vitest-compatible test utility for Courvux. Mount components, drive state, query the DOM with happy-dom.",slug:"/testing"})}},Co={data:{s_manifest:`{
  "name":             "My App",
  "short_name":       "MyApp",
  "description":      "A Courvux application",
  "start_url":        "/",
  "display":          "standalone",
  "background_color": "#ffffff",
  "theme_color":      "#3b82f6",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}`,s_link:`<link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="#3b82f6" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />`,s_workbox:`import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        VitePWA({
            registerType: 'autoUpdate',
            manifest: false,                              // use your own public/manifest.json
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
                runtimeCaching: [{
                    urlPattern: /^https:\\/\\/api\\.yourapp\\.com\\//,
                    handler: 'NetworkFirst',
                    options: {
                        cacheName: 'api-cache',
                        networkTimeoutSeconds: 5,
                        expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 },
                    },
                }],
            },
        }),
    ],
});`,s_pwa:`// src/pwa.ts
export interface PWAState {
    installable: boolean;
    installed:   boolean;
    online:      boolean;
    prompt:      (() => Promise<void>) | null;
}

export function createPWA(): PWAState {
    const state: PWAState = {
        installable: false,
        installed:   window.matchMedia('(display-mode: standalone)').matches,
        online:      navigator.onLine,
        prompt:      null,
    };

    let deferredPrompt: any = null;

    window.addEventListener('beforeinstallprompt', (e: any) => {
        e.preventDefault();
        deferredPrompt = e;
        state.installable = true;
        state.prompt = async () => {
            if (!deferredPrompt) return;
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                state.installed   = true;
                state.installable = false;
            }
            deferredPrompt = null;
            state.prompt   = null;
        };
    });

    window.addEventListener('appinstalled', () => {
        state.installed   = true;
        state.installable = false;
        deferredPrompt    = null;
    });

    window.addEventListener('online',  () => { state.online = true; });
    window.addEventListener('offline', () => { state.online = false; });

    return state;
}`,s_use:`import { createApp } from 'courvux';
import { createPWA } from './pwa';

const pwa = createPWA();

createApp({
    data: { pwa },
    template: \`<router-view></router-view>\`,
    // ...
}).mount('#app');`,s_template:`<!-- Offline banner -->
<div cv-if="!pwa.online" class="offline-banner">
    Sin conexión — usando datos en caché
</div>

<!-- Install button -->
<button cv-if="pwa.installable && !pwa.installed" @click="pwa.prompt()">
    Instalar aplicación
</button>`},template:`
        <div class="prose">
            <h1>Progressive Web App (PWA)</h1>
            <p>Courvux does not bundle PWA tooling — the manifest and service worker strategy are always app-specific. This page covers the minimal setup to make any Courvux app installable and offline-capable.</p>

            <h2>Web App Manifest</h2>
            <p>Create <code>public/manifest.json</code>:</p>
            <code-block :lang="'json'" :code="s_manifest"></code-block>

            <p>Link it in <code>index.html</code>:</p>
            <code-block :lang="'html'" :code="s_link"></code-block>

            <h2>Service Worker with Workbox</h2>
            <p>Use <code>vite-plugin-pwa</code> to generate a service worker. Configure runtime caching strategies for your API endpoints.</p>
            <code-block :lang="'js'" :code="s_workbox"></code-block>

            <h3>Cache strategies at a glance</h3>
            <table>
                <thead><tr><th>Strategy</th><th>Best for</th></tr></thead>
                <tbody>
                    <tr><td><code>CacheFirst</code></td><td>Static assets (fonts, images, icons)</td></tr>
                    <tr><td><code>NetworkFirst</code></td><td>API calls — fresh when online, fallback when offline</td></tr>
                    <tr><td><code>StaleWhileRevalidate</code></td><td>Non-critical data — instant from cache, updates in background</td></tr>
                </tbody>
            </table>

            <h2>Install prompt utility</h2>
            <p>The browser fires <code>beforeinstallprompt</code> when the app is installable, but only once. Capture it early — before any user interaction — and surface it at the right moment.</p>
            <code-block :lang="'ts'" :code="s_pwa"></code-block>

            <p>Use it in your app:</p>
            <code-block :lang="'js'" :code="s_use"></code-block>
            <p>Then in any template:</p>
            <code-block :lang="'html'" :code="s_template"></code-block>

            <div class="callout info">
                <strong>Safari / iOS:</strong> The install prompt API is not supported. Users must add to home screen manually via the share button. Detect iOS with <code>navigator.userAgent.includes('iPhone')</code> and show a custom instruction.
            </div>

            <div style="margin-top:2rem; display:flex; gap:12px;">
                <router-link to="/testing" style="font-size:13px; color:#555;">← Testing</router-link>
                <router-link to="/advanced" style="font-size:13px; color:#111; font-weight:600;">Advanced →</router-link>
            </div>
        </div>
    `,exprs:{"'json'":(e=>"json"),s_manifest:(e=>e.s_manifest),"'html'":(e=>"html"),s_link:(e=>e.s_link),"'js'":(e=>"js"),s_workbox:(e=>e.s_workbox),"'ts'":(e=>"ts"),s_pwa:(e=>e.s_pwa),s_use:(e=>e.s_use),s_template:(e=>e.s_template)},onMount(){J({title:"Progressive Web App",description:"Make any Courvux app installable and offline-capable: manifest, vite-plugin-pwa, install prompt utility.",slug:"/pwa"})}},To={data:{s_install:"pnpm add courvux-precompiler@github:vanjexdev/courvux-precompiler",s_vite:`// vite.config.js
import { defineConfig } from 'vite';
import courvux           from 'courvux/plugin';            // existing templateUrl inliner
import courvuxPrecompile from 'courvux/plugin/precompile'; // new in 0.7.0

export default defineConfig({
    plugins: [
        courvux(),
        courvuxPrecompile(),
    ],
});`,s_csp:`<!-- index.html — strict CSP, no unsafe-eval -->
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self';
               script-src 'self';
               style-src 'self' 'unsafe-inline';
               img-src 'self' data:;
               font-src 'self';
               connect-src 'self';
               object-src 'none';
               base-uri 'self';
               form-action 'self'" />`,s_inline:`// Component file (.js / .ts) — plugin recognizes static templates
export default {
    template: \`
        <button @click="count++">{{ count }}</button>
    \`,
    data: { count: 0 },
};`,s_html:`// HTML file with ?courvux suffix — plugin handles the import
import compiled from './my-component.html?courvux';

export default {
    ...compiled,                // spreads { template, exprs }
    data: { count: 0 },
};`,s_report:`[courvux-precompile] using courvux-precompiler v0.1.0
[courvux-precompile] processed 25 file(s), 258 expression(s) precompiled, 0 template(s) fell back to runtime new Function.`,s_skip:"[courvux-precompile] templates not precompiled (CSP `unsafe-eval` required for these):\n  - src/pages/Dynamic.js:42 — `template` value is Identifier, not a static literal\n  - src/pages/Cards.js:12  — `template` value is ConditionalExpression, not a static literal"},template:`
        <div class="prose">
            <h1>Strict CSP &amp; the precompiler</h1>
            <p>By default Courvux compiles every template expression at runtime via <code>new Function('with(state){ return (expr) }')</code>. That requires the page's <code>Content-Security-Policy</code> to allow <code>script-src 'unsafe-eval'</code>. For most apps that's fine — Courvux is small, the runtime evaluator is the same one Alpine and Vue 2 use, and 'unsafe-eval' is widely accepted.</p>
            <p>For apps that <strong>cannot</strong> ship <code>'unsafe-eval'</code> — Tauri / Electron shells with strict default policies, embeds inside untrusted pages, anything graded by automated security tooling — version <strong>0.7.0</strong> introduces a Vite plugin that moves expression compilation to <em>build</em> time. Apps that go through the plugin can ship with <code>script-src 'self'</code>, full stop.</p>

            <div class="callout info">
                The plugin is <strong>opt-in and additive</strong>. Apps without it work exactly as before — same expressions, same evaluator, same CSP requirements. CDN-loaded apps (drop a <code>&lt;script type="module"&gt;</code> with an importmap, no build) keep using the runtime path.
            </div>

            <h2>How it works</h2>
            <p>The plugin is paired with a Rust crate compiled to WebAssembly (<code>courvux-precompiler</code>) that turns each template expression into a JavaScript arrow function:</p>
            <table>
                <thead><tr><th>You write</th><th>Plugin emits</th></tr></thead>
                <tbody>
                    <tr><td><code>{{ count + 1 }}</code></td><td><code>($s) => ($s.count + 1)</code></td></tr>
                    <tr><td><code>:disabled="loading"</code></td><td><code>($s) => $s.loading</code></td></tr>
                    <tr><td><code>@click="todos.push(draft)"</code></td><td><code>($s) => $s.todos.push($s.draft)</code></td></tr>
                    <tr><td><code>cv-model="form.email"</code></td><td><code>($s) => $s.form.email</code></td></tr>
                    <tr><td><code>todos.filter(t =&gt; !t.done).length</code></td><td><code>($s) => $s.todos.filter(t =&gt; !t.done).length</code></td></tr>
                </tbody>
            </table>
            <p>The compiled function lives in a per-component <code>exprs</code> map keyed by the original expression string. The runtime checks this map before falling back to <code>new Function</code>, so apps fully covered by the plugin never trigger the runtime evaluator and never need <code>'unsafe-eval'</code>.</p>

            <h2>Setup</h2>
            <ol>
                <li>
                    <p>Install the WASM precompiler crate:</p>
                    <code-block :lang="'bash'" :code="s_install"></code-block>
                </li>
                <li>
                    <p>Add the Vite plugin alongside the existing Courvux plugin:</p>
                    <code-block :lang="'js'" :code="s_vite"></code-block>
                </li>
                <li>
                    <p>Set a strict CSP in your HTML shell:</p>
                    <code-block :lang="'html'" :code="s_csp"></code-block>
                </li>
            </ol>

            <h2>What gets precompiled</h2>
            <p>Two opt-in entry points, both backed by the same compiler:</p>

            <h3>1. Inline string templates inside <code>.js</code> / <code>.ts</code></h3>
            <p>If the <code>template:</code> value is a static string literal or template literal with no <code>\${...}</code> interpolations, the plugin walks the template, extracts every expression, and inserts a sibling <code>exprs:</code> property — no source change required:</p>
            <code-block :lang="'js'" :code="s_inline"></code-block>

            <h3>2. HTML files imported with <code>?courvux</code></h3>
            <p>For external templates, append <code>?courvux</code> to the import. The plugin compiles the file at build time and resolves it as a module that already exports <code>{ template, exprs }</code>:</p>
            <code-block :lang="'js'" :code="s_html"></code-block>

            <h2>What falls back</h2>
            <p>Templates whose value isn't a static literal — <code>template: someVar</code>, <code>template: cond ? a : b</code>, <code>template: makeTemplate('btn')</code>, tagged template literals, and so on — are skipped silently. The runtime <code>new Function</code> path handles them, just at the cost of needing <code>'unsafe-eval'</code> for those specific components.</p>
            <p>The plugin's build-end report tells you exactly which templates fell back, so you know what to refactor for full CSP compliance:</p>
            <code-block :lang="'text'" :code="s_skip"></code-block>

            <h2>Build-end report</h2>
            <p>Every build prints a one-shot summary so the precompile coverage is visible at a glance:</p>
            <code-block :lang="'text'" :code="s_report"></code-block>
            <p>Apps that need strict CSP want zero templates in the fallback bucket. Apps that don't care can ignore the report — fallbacks are not errors.</p>

            <h2>Supported expression subset</h2>
            <p>The compiler accepts what a normal Courvux template uses. Anything off-grammar fails at build time with a precise location, so you find out at <code>vite build</code> instead of in the browser console:</p>
            <ul>
                <li>Literals: numbers, strings (<code>'</code>, <code>"</code>), template literals, <code>true</code>, <code>false</code>, <code>null</code>, <code>undefined</code></li>
                <li>Identifiers + dot / bracket / optional access (<code>?.</code>)</li>
                <li>Function calls — including methods on identifiers and member chains</li>
                <li>Arithmetic <code>+ - * / %</code></li>
                <li>Comparison <code>&lt; &lt;= &gt; &gt;= == != === !==</code> (<code>==</code> and <code>!=</code> compile to <code>===</code> / <code>!==</code> for parity with Courvux runtime semantics)</li>
                <li>Logical <code>&amp;&amp; || ??</code></li>
                <li>Ternary</li>
                <li>Assignment <code>= += -= *= /= %=</code></li>
                <li>Pre- and post-increment / decrement</li>
                <li>Object and array literals (with shorthand, computed keys, spread)</li>
                <li>Comma- or semicolon-separated multi-statement event handlers</li>
                <li>Arrow functions (single expression body): <code>t =&gt; !t.done</code>, <code>(a, b) =&gt; a + b</code></li>
            </ul>

            <h3>Out of scope</h3>
            <p>Rejected at build time so the failure mode stays loud:</p>
            <ul>
                <li><code>function</code> / <code>class</code> declarations</li>
                <li><code>async</code> / <code>await</code> / generator syntax</li>
                <li>Regex literals</li>
                <li>Destructuring assignment</li>
                <li>Block-body arrow functions (<code>=&gt; { ... }</code>)</li>
            </ul>
            <p>If your template needs any of these, move the logic into a method on the component (where it's normal JS, type-checked by your editor, and not bound by the template-expression subset).</p>

            <h2>Performance</h2>
            <p>The compiler is a Rust crate compiled to WebAssembly (~104 KB uncompressed, loaded once per build session). For a typical 50-component project it adds 200-500 ms to the cold build and 5-20 ms per HMR change. Faster than the Vue compiler running on the same set of templates because the parser is purpose-built for the Courvux subset, not full ECMAScript.</p>
            <p>At runtime, precompiled expressions are roughly 2-3× faster than the <code>new Function('with(state){...}')</code> path because they're plain arrow function calls — no scope resolution, no <code>with</code> binding, no per-call compilation cache lookup.</p>

            <h2>Source maps</h2>
            <p>Both the inline-template and <code>?courvux</code> paths emit Vite-compatible source maps. Console errors and stack traces point at the original <code>.js</code> / <code>.html</code> file, not the rewritten module. The position information is precise to the line where the <code>template:</code> property starts.</p>

            <div style="margin-top:2rem; display:flex; gap:12px;">
                <router-link to="/installation" style="font-size:13px; color:#555;">← Installation</router-link>
                <router-link to="/template" style="font-size:13px; color:#111; font-weight:600;">Template Syntax →</router-link>
            </div>
        </div>
    `,exprs:{"count + 1":(e=>e.count+1),loading:(e=>e.loading),"todos.push(draft)":(e=>e.todos.push(e.draft)),"form.email":(e=>e.form.email),"'bash'":(e=>"bash"),s_install:(e=>e.s_install),"'js'":(e=>"js"),s_vite:(e=>e.s_vite),"'html'":(e=>"html"),s_csp:(e=>e.s_csp),s_inline:(e=>e.s_inline),s_html:(e=>e.s_html),"'text'":(e=>"text"),s_skip:(e=>e.s_skip),s_report:(e=>e.s_report)},onMount(){J({title:"Strict CSP & the precompiler",description:"Drop `script-src 'unsafe-eval'` from your CSP by precompiling Courvux template expressions at build time with the Rust → WASM precompiler and its Vite plugin.",slug:"/csp"})}},$o={data:{s_dir:`// Full definition
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
    `,exprs:{"'js'":(e=>"js"),s_dir:(e=>e.s_dir),"'html'":(e=>"html"),s_dir_use:(e=>e.s_dir_use),s_transition:(e=>e.s_transition),s_intersect:(e=>e.s_intersect),s_plugins:(e=>e.s_plugins),s_magic:(e=>e.s_magic),s_autoinit:(e=>e.s_autoinit)},onMount(){J({title:"Advanced",description:"Custom directives, plugins, transitions, and the cv-data inline scope in Courvux.",slug:"/advanced"})}},Eo={template:`
        <div class="prose">
            <h1>Design decisions</h1>
            <p>The choices below shape what Courvux is — and isn't. Each one has a contextual reason and an alternative we explicitly rejected. The goal of this page is two-fold:</p>
            <ul>
                <li>Save you from re-asking the same questions when you evaluate the framework.</li>
                <li>Save us from re-defending the same trade-offs in every Twitter thread.</li>
            </ul>
            <p>If a decision starts feeling wrong as the framework grows, the "When to reconsider" line in each section is the trigger to revisit it.</p>

            <h2>Proxy reactivity, not signals</h2>
            <p><strong>Decision:</strong> reactive state is built on <code>Proxy</code> traps, with deep wrapping for nested objects and arrays. No signals (<code>ref()</code> / <code>$state</code>).</p>
            <p><strong>Alternative rejected:</strong> signals (Solid, Preact Signals, Svelte 5 runes).</p>
            <p><strong>Why:</strong> Proxy lets users write <code>this.count++</code> in methods and <code>{{ count }}</code> in templates with no boilerplate. Signals require <code>count.value++</code> or wrappers everywhere, which is ergonomically heavier for the Vue-like Options API style we wanted. We pay a small runtime cost (Proxy traps are not free) but the developer experience win is real and immediate.</p>
            <p><strong>Trade-off accepted:</strong> deep equality and structural-clone scenarios are slightly slower than signal-based counterparts. Doesn't matter for typical UI work; matters for animation-heavy or data-grid-heavy apps where you'd switch to a more specialized tool anyway.</p>
            <p><strong>When to reconsider:</strong> if benchmarks (Fase 4 of the roadmap) show Courvux losing badly in re-render-heavy scenarios, signals could become an opt-in alternative for hot paths — never replacing the default.</p>

            <h2>Options API, not Composition API</h2>
            <p><strong>Decision:</strong> components are plain objects with <code>data</code>, <code>methods</code>, <code>computed</code>, <code>watch</code>, lifecycle hooks. <code>this</code> inside each is the reactive state.</p>
            <p><strong>Alternative rejected:</strong> Composition API (Vue 3's <code>setup()</code>, React Hooks-style).</p>
            <p><strong>Why:</strong> Options API is what people who haven't touched JS frameworks since Vue 2 immediately recognize. The cost of "learn this new mental model" is zero. Composition API is more powerful for code reuse but requires understanding closures + lifecycles + tracking + manual cleanup — too much friction for a framework whose first promise is "drop into any HTML".</p>
            <p><strong>Trade-off accepted:</strong> code reuse is harder. <code>defineComposable</code> (roadmap Fase 3) closes that gap with the same Options API ergonomics — no Composition API runtime needed.</p>
            <p><strong>When to reconsider:</strong> if real-world apps repeatedly hit reuse problems even with <code>defineComposable</code>, a Composition-style API could be added as a second option. Not before.</p>

            <h2>No Virtual DOM</h2>
            <p><strong>Decision:</strong> the framework walks the DOM once at mount, attaches reactive subscriptions to nodes that bind state, and updates only those nodes when state changes.</p>
            <p><strong>Alternative rejected:</strong> Virtual DOM diffing (React, Vue 3, Preact).</p>
            <p><strong>Why:</strong> Most UI updates touch one or two nodes. Diffing a tree to discover that is wasted work. Direct DOM updates are simpler to reason about, faster on hot paths, and produce smaller bundle sizes. The tradeoff is real for cases the diff was good at — like swapping entire subtrees — but for those we have keyed <code>cv-for</code> with explicit reconciliation, which gives equivalent behavior without the perma-cost of a vDOM.</p>
            <p><strong>Trade-off accepted:</strong> rendering deeply nested templates that depend on dynamic conditions (<code>cv-if</code> chains, dynamic components) sometimes requires more careful template structure than vDOM diffing would forgive.</p>
            <p><strong>When to reconsider:</strong> never as the default. Could justify an optional vDOM-backed component type for very large interactive surfaces (visual editors, IDE-like UIs) — but that's plugin territory, not core.</p>

            <h2>DevTools embedded, not browser extension</h2>
            <p><strong>Decision:</strong> <code>setupDevTools()</code> + <code>mountDevOverlay()</code> ship in the framework bundle. They render a draggable panel into the page itself.</p>
            <p><strong>Alternative rejected:</strong> a separate browser extension (Vue DevTools / React DevTools pattern).</p>
            <p><strong>Why:</strong> Browser extensions are friction. Per-browser install, per-user install, often blocked in corporate environments, never available on mobile. Embedded devtools are immediate: gate behind <code>import.meta.env.DEV</code> and they're visible the moment a developer opens a dev build, on any browser, on any device.</p>
            <p><strong>Trade-off accepted:</strong> embedded devtools cost runtime weight. They also can't introspect frames / iframes / shadow roots the way an extension would. We mitigate the weight by code-splitting (the call site is dynamic-imported behind the env flag) and accept the introspection limit.</p>
            <p><strong>When to reconsider:</strong> if the community really wants a Chrome extension, the embedded hook (<code>window.__COURVUX_DEVTOOLS__</code>) already exposes everything an extension would need. The extension would be additive, not a replacement.</p>

            <h2><code>templateUrl</code> alongside <code>template</code></h2>
            <p><strong>Decision:</strong> components can declare templates inline (<code>template: '...'</code>) or as external HTML files (<code>templateUrl: './foo.html'</code>). The Vite plugin (<code>courvux/plugin</code>) inlines templateUrl references at build time.</p>
            <p><strong>Alternative rejected:</strong> single-file components with custom syntax (<code>.vue</code> / <code>.svelte</code>).</p>
            <p><strong>Why:</strong> SFC syntax requires a parser, IDE integration (Volar-style), and compiler plumbing. We're optimizing for "drop into any project". Plain <code>.html</code> + <code>.js</code> works in every editor, every linter, every formatter, with zero plugin setup. The Vite plugin is a quality-of-life improvement, not a requirement.</p>
            <p><strong>Trade-off accepted:</strong> co-locating template + script + style in a single file (the SFC value-prop) is harder. Some users will miss it.</p>
            <p><strong>When to reconsider:</strong> never as a replacement — the parser cost is fundamentally at odds with our "small framework" promise. Could appear as an optional separate compiler package for users who really want it.</p>

            <h2><code>cv-</code> prefix, not <code>x-</code> or <code>v-</code></h2>
            <p><strong>Decision:</strong> directives use <code>cv-</code> as the prefix (<code>cv-for</code>, <code>cv-if</code>, <code>cv-show</code>, etc.). Bindings use <code>:prop</code> and events use <code>@event</code> or <code>cv:on:event</code>.</p>
            <p><strong>Alternative rejected:</strong> <code>x-</code> (Alpine), <code>v-</code> (Vue), or no prefix at all.</p>
            <p><strong>Why:</strong> A unique prefix avoids conflicts with HTML / CSS authors who already use <code>x-</code> in their own conventions, and makes templates greppable ("where do we use <code>cv-show</code>?" returns Courvux usage only). <code>:</code> and <code>@</code> are kept identical to Vue / Alpine because muscle memory is real and the cost of changing them is zero.</p>
            <p><strong>Trade-off accepted:</strong> people copy-pasting Alpine examples need to swap <code>x-</code> for <code>cv-</code>. The migration guide (<a href="/courvux/migrating-from-alpine/" class="link">Migrating from Alpine</a>) lists every mapping.</p>
            <p><strong>When to reconsider:</strong> never. Renaming directives post-1.0 is a breaking change for every user.</p>

            <h2>SSG over per-request SSR</h2>
            <p><strong>Decision:</strong> the supported SSR story is <strong>static site generation</strong> via <code>courvux/plugin/ssg</code>. <code>renderToString</code> exists for custom server setups, but isn't optimized for high-throughput per-request rendering.</p>
            <p><strong>Alternative rejected:</strong> a Next.js / Nuxt-style streaming SSR runtime.</p>
            <p><strong>Why:</strong> SSG covers the SEO / OG / first-paint use cases that 90% of "I need SSR" actually means, with no server to operate. Per-request SSR adds operational complexity (Node servers, cache layers, memory ceilings) that's hard to justify when SSG + client-side hydration solves the same problem for static-content sites.</p>
            <p><strong>Trade-off accepted:</strong> truly dynamic per-request server rendering (per-user dashboards, auth-gated content) needs to be done by your own backend. <code>renderToString</code> works there, but you'll write the integration glue.</p>
            <p><strong>When to reconsider:</strong> if a real user case demands streaming SSR and we can implement it in &lt;500 lines without bloating the core, it could land as a peer-dep package (<code>courvux/server</code>). Not before.</p>

            <div style="margin-top:2rem; display:flex; gap:12px;">
                <router-link to="/" style="font-size:13px; color:#555;">← Home</router-link>
                <router-link to="/faq" style="font-size:13px; color:#111; font-weight:600;">FAQ →</router-link>
            </div>
        </div>
    `,exprs:{count:(e=>e.count)},onMount(){J({title:"Design decisions",description:"Why Courvux uses Proxy over signals, Options API over Composition, no Virtual DOM, embedded DevTools, cv- prefix, and SSG over per-request SSR. Trade-offs documented.",slug:"/design-decisions"})}},jo={data:{s_keyed:`<!-- Without :key, every state change rebuilds the whole list -->
<li cv-for="todo in todos">{{ todo.text }}</li>

<!-- With :key, only changed nodes are touched -->
<li cv-for="todo in todos" :key="todo.id">{{ todo.text }}</li>`,s_csp:`// Strict CSP rejects expressions evaluated via new Function():
//   <input cv-model.trim="user.name" />          ← still works
//   {{ count }}                                  ← still works
//   {{ count > 0 ? 'on' : 'off' }}               ← falls back to safe eval (no inline ternary)
//   :class="{ active: count > 0 && open }"       ← falls back

// Mitigations:
//   1. Move complex expressions into a computed and reference its name.
//   2. Move event-handler logic into a method.
//   3. Allow 'unsafe-eval' in CSP (loses the protection point).`,s_ts:`// 1. Component config files: declare with defineComponent for inference
import { defineComponent } from 'courvux';

export default defineComponent({
    data: { name: '' as string, count: 0 as number },
    methods: {
        inc(this) { this.count++; }   // 'this' typed against the data shape
    }
});

// 2. tsconfig.json — add Courvux to types
{
    "compilerOptions": {
        "types": ["courvux"]
    }
}

// 3. Templates outside SFC syntax don't get type-checked. Trade-off
//    accepted with the "no parser" decision.`,s_lazy:`// Lazy-load a component for code-splitting
{
    path: '/heavy',
    component: () => import('./pages/HeavyPage.js'),
    loadingTemplate: '<p>Loading...</p>'      // optional placeholder
}

// Or with defineAsyncComponent for finer control
import { defineAsyncComponent } from 'courvux';
const HeavyChart = defineAsyncComponent({
    loader: () => import('./HeavyChart.js'),
    loadingTemplate: '<div class="skeleton"></div>',
    errorTemplate: '<p>Failed to load chart</p>',
    delay: 200,
    timeout: 5000,
});`,s_vite:`// vite.config.js — recommended setup
import { defineConfig } from 'vite';
import courvux from 'courvux/plugin';        // inline templateUrl
import courvuxSsg from 'courvux/plugin/ssg'; // optional, for SSG

export default defineConfig({
    plugins: [
        courvux(),
        courvuxSsg({ /* see SSG docs */ }),
    ],
});`,s_tauri:`// 1. Build your Courvux app as a normal SPA (or SSG it).
// 2. Point Tauri's frontendDist at the build output.
// tauri.conf.json:
{
    "build": {
        "frontendDist": "../docs"        // or wherever your build lands
    }
}

// 3. Inside Courvux methods, call Tauri commands like any async fn:
methods: {
    async greet() {
        const { invoke } = window.__TAURI__.core;
        this.message = await invoke('greet', { name: this.name });
    }
}`,s_test:`// 1. Use the test-utils mount helper + happy-dom
// vitest.config.js
import { defineConfig } from 'vitest/config';
export default defineConfig({
    test: { environment: 'happy-dom' }
});

// 2. Write the test
import { mount } from 'courvux/test-utils';
import { describe, it, expect } from 'vitest';

it('counter increments on click', async () => {
    const w = await mount({
        template: '<button @click="count++">{{ count }}</button>',
        data: { count: 0 }
    });
    w.find('button').click();
    await w.nextTick();
    expect(w.find('button').textContent).toBe('1');
    w.destroy();
});`,s_proxyId_faq:`// ❌ Bug — find() and indexOf() return different proxy wrappers
const card = this.cards.find(c => c.id === id);
const idx  = this.cards.indexOf(card);   // -1
this.cards.splice(idx, 1);                // splice(-1, 1) deletes the last row

// ✅ Find positions by primitive id
const idx = this.cards.findIndex(c => c.id === id);
this.cards.splice(idx, 1);`},template:`
        <div class="prose">
            <h1>FAQ &amp; troubleshooting</h1>
            <p>Common questions, in roughly the order they tend to come up. If your question isn't here, <a href="https://github.com/vanjexdev/courvux/issues" target="_blank" rel="noopener">open an issue</a> — answers here are usually distilled from real issues.</p>

            <h2>My <code>cv-for</code> isn't updating after I change the array</h2>
            <p>You're almost certainly missing <code>:key</code>. Without it, the framework destroys and recreates every node on each change — and if your update is a mutation that points to the same array reference, the surrounding reactivity may not re-render at all.</p>
            <code-block :lang="'html'" :code="s_keyed"></code-block>
            <p>Always pass <code>:key="item.id"</code> (or any stable unique identifier per item). See <router-link to="/template" class="link">Template Syntax → cv-for</router-link>.</p>

            <h2>Strict CSP breaks my app</h2>
            <p>Courvux uses <code>new Function()</code> to evaluate expressions in templates and inline event handlers. Strict Content Security Policies (no <code>unsafe-eval</code>) reject this. The framework falls back to a safe evaluator that handles property access and literals only, so you'll lose inline expressions but the app still mounts.</p>
            <code-block :lang="'js'" :code="s_csp"></code-block>
            <p>Trade-off documented at <router-link to="/design-decisions" class="link">Design Decisions</router-link>.</p>

            <h2>How do I integrate with TypeScript?</h2>
            <p>Three things: use <code>defineComponent</code> for component config inference, add Courvux to <code>tsconfig.json#types</code>, and accept that templates outside an SFC compiler aren't type-checked.</p>
            <code-block :lang="'ts'" :code="s_ts"></code-block>

            <h2>How do I lazy-load components?</h2>
            <p>Two ways: route-level (only loads when the route is visited) or component-level (more control, with <code>loadingTemplate</code> / <code>errorTemplate</code> / <code>timeout</code>).</p>
            <code-block :lang="'js'" :code="s_lazy"></code-block>

            <h2>Does it work with Vite / Webpack / Rollup?</h2>
            <p>Yes to Vite (recommended — there's a first-party plugin). Yes to Webpack and Rollup if you treat Courvux as a regular ES module dependency — but you'll lose the build-time <code>templateUrl</code> inlining and the SSG plugin (those are Vite-specific).</p>
            <code-block :lang="'js'" :code="s_vite"></code-block>

            <h2>Does it work with Tauri / Electron / Capacitor?</h2>
            <p>Yes. Courvux makes no assumptions about being inside a browser tab — it just needs a DOM. Build the app as a SPA (or SSG it for the splash / first-paint advantage), point the native shell at the build output.</p>
            <code-block :lang="'js'" :code="s_tauri"></code-block>
            <p>See <router-link to="/installation" class="link">Installation</router-link> and the <a href="https://github.com/vanjexdev/courvux/tree/main/examples/02-counter" target="_blank" rel="noopener">02-counter example</a>.</p>

            <h2>How do I write tests?</h2>
            <p>Use the <code>'courvux/test-utils'</code> subpath with Vitest + happy-dom. The wrapper exposes <code>state</code>, <code>find</code>, <code>nextTick</code>, <code>destroy</code> and friends — the docs at <router-link to="/testing" class="link">Testing</router-link> have the full API.</p>
            <code-block :lang="'js'" :code="s_test"></code-block>

            <h2>How do I migrate from Vue or Alpine?</h2>
            <p>Short answer: most templates and lifecycle hooks port nearly 1:1. The differences are surgical — directive prefix, where reactive state lives, how events / props flow.</p>
            <p>See the dedicated mapping tables: <router-link to="/migrating-from-vue" class="link">Migrating from Vue</router-link> and <router-link to="/migrating-from-alpine" class="link">Migrating from Alpine</router-link>.</p>

            <h2>The framework crashed on Safari / Samsung Internet — what now?</h2>
            <p>Three releases (0.4.4 / 0.4.5 / 0.4.6) shipped fixes for this exact class of bug — strict <code>setAttribute</code> validation in WebKit-class browsers rejecting framework directive names. If you hit a new instance: <a href="https://github.com/vanjexdev/courvux/issues" target="_blank" rel="noopener">open an issue with the page URL and Safari version</a>. These are first-priority fixes.</p>

            <h2>Can I use it without a build step?</h2>
            <p>Yes. Courvux is a single ES module. Drop an importmap and a <code>&lt;script type="module"&gt;</code> into any HTML file and you're done. See <router-link to="/installation" class="link">Installation → Without a bundler</router-link>.</p>

            <h2>Why does my drag-and-drop / array-mutation code delete the wrong row?</h2>
            <p>This is the proxy-identity pitfall. Courvux wraps each property access in a fresh Proxy, so the object you grab with <code>find()</code> is not <code>===</code> to the same row when read again from the array — <code>indexOf(card)</code> returns <code>-1</code>, and <code>splice(-1, 1)</code> silently deletes the LAST row instead of the one you meant. The dragged row is then re-added by <code>push()</code> and you see what looks like a duplicate.</p>
            <code-block :lang="'js'" :code="s_proxyId_faq"></code-block>
            <p>Always look items up by primitive id with <code>findIndex</code>, or unwrap with <code>toRaw</code> if you really need identity. The full discussion lives at <router-link to="/reactivity" class="link">Reactivity → Common gotchas</router-link>.</p>

            <div style="margin-top:2rem; display:flex; gap:12px;">
                <router-link to="/design-decisions" style="font-size:13px; color:#555;">← Design Decisions</router-link>
                <router-link to="/migrating-from-vue" style="font-size:13px; color:#111; font-weight:600;">Migrating from Vue →</router-link>
            </div>
        </div>
    `,exprs:{"'html'":(e=>"html"),s_keyed:(e=>e.s_keyed),"item.id":(e=>e.item.id),"'js'":(e=>"js"),s_csp:(e=>e.s_csp),"'ts'":(e=>"ts"),s_ts:(e=>e.s_ts),s_lazy:(e=>e.s_lazy),s_vite:(e=>e.s_vite),s_tauri:(e=>e.s_tauri),s_test:(e=>e.s_test),s_proxyId_faq:(e=>e.s_proxyId_faq)},onMount(){J({title:"FAQ",description:"Frequently asked questions and troubleshooting for Courvux: cv-for keys, strict CSP, TypeScript, lazy loading, Vite/Tauri integration, testing, migration.",slug:"/faq"})}},Po={data:{s_component_vue:`// Vue 3 — Options API
export default {
    data() { return { count: 0 } },
    computed: { double() { return this.count * 2 } },
    methods: { inc() { this.count++ } },
    mounted() { console.log('mounted') }
}`,s_component_courvux:`// Courvux — same shape, minor renames
export default {
    data: { count: 0 },                 // object literal, not a fn
    computed: { double() { return this.count * 2 } },
    methods: { inc() { this.count++ } },
    onMount() { console.log('mounted') } // mounted → onMount
};`,s_setup_warn:`// Vue 3 Composition API has no Courvux equivalent today.
// If your component looks like:
import { ref, computed, onMounted } from 'vue';
export default {
    setup() {
        const count = ref(0);
        const double = computed(() => count.value * 2);
        onMounted(() => console.log('mounted'));
        return { count, double };
    }
}

// Port to Options API:
export default {
    data: { count: 0 },
    computed: { double() { return this.count * 2 } },
    onMount() { console.log('mounted') }
};

// 'count++' instead of 'count.value++' — no .value anywhere.`,s_props:`// Vue
defineProps(['title', 'count'])
defineEmits(['change'])

// Courvux
{
    data: { title: '', count: 0 },     // props are just data with default values
    emits: ['change'],
    methods: {
        send() { this.$emit('change', this.count) }
    }
}`,s_router:`// Vue (vue-router 4)
import { useRoute, useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();
router.push('/about');

// Courvux — built-in, available on every component instance
this.$route.params.id;
this.$router.navigate('/about');`,s_store:`// Vue (Pinia)
import { defineStore } from 'pinia';
export const useCart = defineStore('cart', {
    state: () => ({ items: [] }),
    actions: { add(item) { this.items.push(item) } }
});
// In a component:
const cart = useCart();
cart.add(product);

// Courvux — single createStore at app root
import { createStore } from 'courvux';
const store = createStore({
    state: { cart: { items: [] } },
    actions: {
        addToCart(item) { this.cart.items.push(item) }
    }
});
createApp({ store, ... }).mount('#app');
// In a component:
this.$store.addToCart(product);`},template:`
        <div class="prose">
            <h1>Migrating from Vue</h1>
            <p>Most Vue (Options API) code ports to Courvux with surgical changes — directive names are mostly identical, lifecycle hooks rename, and reactive state lives in <code>data</code> as a plain object instead of a function. This page is a mapping reference, not an exhaustive guide.</p>

            <h2>Template syntax — mostly identical</h2>
            <table>
                <thead><tr><th>Vue</th><th>Courvux</th></tr></thead>
                <tbody>
                    <tr><td><code>v-for="item in items"</code></td><td><code>cv-for="item in items"</code></td></tr>
                    <tr><td><code>v-for + :key</code></td><td><code>cv-for + :key</code></td></tr>
                    <tr><td><code>v-if</code> / <code>v-else-if</code> / <code>v-else</code></td><td><code>cv-if</code> / <code>cv-else-if</code> / <code>cv-else</code></td></tr>
                    <tr><td><code>v-show</code></td><td><code>cv-show</code></td></tr>
                    <tr><td><code>v-model</code></td><td><code>cv-model</code></td></tr>
                    <tr><td><code>v-model.lazy</code> / <code>.trim</code> / <code>.number</code></td><td><code>cv-model.lazy</code> / <code>.trim</code> / <code>.number</code> (same)</td></tr>
                    <tr><td><code>v-html</code></td><td><code>cv-html.raw</code> for trusted markup; bare <code>cv-html</code> sanitizes by default (safer than Vue's default)</td></tr>
                    <tr><td><code>v-once</code></td><td><code>cv-once</code></td></tr>
                    <tr><td><code>:prop</code></td><td><code>:prop</code> (identical)</td></tr>
                    <tr><td><code>@click</code> / <code>@event.modifier</code></td><td><code>@click</code> / <code>@event.modifier</code> (identical)</td></tr>
                    <tr><td><code>{{ expression }}</code></td><td><code>{{ expression }}</code> (identical)</td></tr>
                    <tr><td><code>&lt;component :is&gt;</code></td><td><code>&lt;component :is&gt;</code> (identical)</td></tr>
                    <tr><td><code>&lt;Transition&gt;</code></td><td><code>&lt;cv-transition&gt;</code> + <code>cv-transition</code> directive</td></tr>
                </tbody>
            </table>

            <h2>Component config — minor renames</h2>
            <code-block :lang="'js'" :code="s_component_vue"></code-block>
            <p>becomes:</p>
            <code-block :lang="'js'" :code="s_component_courvux"></code-block>
            <table>
                <thead><tr><th>Vue option</th><th>Courvux equivalent</th></tr></thead>
                <tbody>
                    <tr><td><code>data() { return {} }</code></td><td><code>data: {}</code> (object literal)</td></tr>
                    <tr><td><code>beforeCreate</code> / <code>created</code></td><td>not separate — use <code>data</code> initialization or <code>onBeforeMount</code></td></tr>
                    <tr><td><code>beforeMount</code> / <code>mounted</code></td><td><code>onBeforeMount</code> / <code>onMount</code></td></tr>
                    <tr><td><code>beforeUpdate</code> / <code>updated</code></td><td><code>onBeforeUpdate</code> / <code>onUpdated</code></td></tr>
                    <tr><td><code>beforeUnmount</code> / <code>unmounted</code></td><td><code>onBeforeUnmount</code> / <code>onDestroy</code></td></tr>
                    <tr><td><code>activated</code> / <code>deactivated</code></td><td><code>onActivated</code> / <code>onDeactivated</code> (with <code>keepAlive</code> route)</td></tr>
                    <tr><td><code>errorCaptured</code></td><td><code>onError</code> (semantic equivalent for descendant errors)</td></tr>
                </tbody>
            </table>

            <h2>Composition API — port to Options</h2>
            <p>Courvux does not have <code>setup()</code> / <code>ref()</code> / <code>reactive()</code>. The Composition API equivalent is the Options API itself. See <router-link to="/design-decisions" class="link">Design Decisions</router-link> for the rationale.</p>
            <code-block :lang="'js'" :code="s_setup_warn"></code-block>
            <p>For shared logic (the original use case for Composition API), use <code>defineComposable</code> when it lands in 0.5.x. Roadmap Fase 3.</p>

            <h2>Props &amp; emits</h2>
            <code-block :lang="'js'" :code="s_props"></code-block>
            <p>Props in Courvux are just <code>data</code> entries with their default values. The parent's <code>:title="x"</code> binding overrides the default. The component declares <code>emits</code> the same way Vue does (validated when emitted).</p>

            <h2>Router</h2>
            <code-block :lang="'js'" :code="s_router"></code-block>
            <p>The router is built-in (no external <code>vue-router</code>). The instance is on every component as <code>this.$router</code>; the current route on <code>this.$route</code>. Same shape as Vue Router for the common cases. See <router-link to="/router" class="link">Router</router-link>.</p>

            <h2>Store / Pinia</h2>
            <code-block :lang="'js'" :code="s_store"></code-block>
            <p>One global store at the app level (no per-store factory functions). Modules are supported via the <code>modules:</code> field for namespacing. See <router-link to="/store" class="link">Store</router-link>.</p>

            <h2>What doesn't have an equivalent</h2>
            <ul>
                <li><strong>Single-file components (<code>.vue</code> files)</strong> — Courvux uses plain <code>.js</code> + <code>.html</code> with the <code>templateUrl</code> pattern. Trade-off documented at <router-link to="/design-decisions" class="link">Design Decisions</router-link>.</li>
                <li><strong>Pinia plugin ecosystem</strong> — the store is simpler and integrated; advanced patterns (persistence, undo/redo) are user-implemented today.</li>
                <li><strong>Server Components / Suspense</strong> — out of scope for now. SSG covers most "I want server-rendered HTML" cases.</li>
                <li><strong>Provide/inject as a Composition API tree-bypass tool</strong> — Courvux supports the Options API form (<code>provide</code> / <code>inject</code>) without the Composition API integration.</li>
            </ul>

            <div style="margin-top:2rem; display:flex; gap:12px;">
                <router-link to="/faq" style="font-size:13px; color:#555;">← FAQ</router-link>
                <router-link to="/migrating-from-alpine" style="font-size:13px; color:#111; font-weight:600;">Migrating from Alpine →</router-link>
            </div>
        </div>
    `,exprs:{expression:(e=>e.expression),items:(e=>e.items),"'js'":(e=>"js"),s_component_vue:(e=>e.s_component_vue),s_component_courvux:(e=>e.s_component_courvux),s_setup_warn:(e=>e.s_setup_warn),s_props:(e=>e.s_props),x:(e=>e.x),s_router:(e=>e.s_router),s_store:(e=>e.s_store)},onMount(){J({title:"Migrating from Vue",description:"Mapping table from Vue 3 Options API to Courvux: directives, lifecycle hooks, props, emits, router, Pinia store. Surgical migration, mostly identical syntax.",slug:"/migrating-from-vue"})}},Oo={data:{s_xdata:`<!-- Alpine -->
<div x-data="{ open: false }">
    <button @click="open = !open">{{ open ? '−' : '+' }}</button>
    <div x-show="open">Panel content</div>
</div>

<!-- Courvux — almost identical, just cv- prefix -->
<div cv-data="{ open: false }">
    <button @click="open = !open">{{ open ? '−' : '+' }}</button>
    <div cv-show="open">Panel content</div>
</div>`,s_init:`<!-- Alpine — auto-discovers x-data on DOMContentLoaded -->
<script src="//unpkg.com/alpinejs" defer><\/script>
<div x-data="{ count: 0 }">
    <button @click="count++">{{ count }}</button>
</div>

<!-- Courvux — same pattern via autoInit() -->
<script type="module">
    import { autoInit } from 'courvux';
    autoInit();
<\/script>
<div cv-data="{ count: 0 }">
    <button @click="count++">{{ count }}</button>
</div>`,s_components:`// Alpine — Alpine.data() registers a named composable
document.addEventListener('alpine:init', () => {
    Alpine.data('counter', () => ({
        count: 0,
        inc() { this.count++ }
    }));
});
// Used in HTML:
// <div x-data="counter">...</div>

// Courvux — same idea via autoInit({ components })
import { autoInit } from 'courvux';
autoInit({
    components: {
        counter: {
            data: { count: 0 },
            methods: { inc() { this.count++ } }
        }
    }
});
// Used in HTML:
// <div cv-data="counter">...</div>`,s_store:`// Alpine — Alpine.store() for global state
document.addEventListener('alpine:init', () => {
    Alpine.store('cart', { count: 0, add() { this.count++ } });
});
// Used in HTML: $store.cart.count

// Courvux — createStore + provide on autoInit
import { autoInit, createStore } from 'courvux';
const store = createStore({
    state: { cart: { count: 0 } },
    actions: {
        addToCart() { this.cart.count++ }
    }
});
autoInit({ globalProperties: { $store: store } });
// Used in HTML: $store.cart.count`},template:`
        <div class="prose">
            <h1>Migrating from Alpine</h1>
            <p>Courvux's island-mode (<code>autoInit</code> + <code>cv-data</code>) is intentionally aligned with Alpine — the muscle memory transfers almost completely. The differences are: directive prefix (<code>cv-</code> vs <code>x-</code>), how named "components" are registered, and a few extra capabilities Courvux adds (router, store, devtools, SSG).</p>

            <h2>Template syntax — directive prefix swap</h2>
            <table>
                <thead><tr><th>Alpine</th><th>Courvux</th></tr></thead>
                <tbody>
                    <tr><td><code>x-data="{ open: false }"</code></td><td><code>cv-data="{ open: false }"</code></td></tr>
                    <tr><td><code>x-show="open"</code></td><td><code>cv-show="open"</code></td></tr>
                    <tr><td><code>x-if</code> / <code>x-else</code> (template only)</td><td><code>cv-if</code> / <code>cv-else-if</code> / <code>cv-else</code> (any element)</td></tr>
                    <tr><td><code>x-for="item in items"</code></td><td><code>cv-for="item in items"</code></td></tr>
                    <tr><td><code>x-for + :key</code></td><td><code>cv-for + :key</code> (same)</td></tr>
                    <tr><td><code>x-model</code></td><td><code>cv-model</code></td></tr>
                    <tr><td><code>x-model.lazy</code> / <code>.number</code></td><td><code>cv-model.lazy</code> / <code>.number</code> / <code>.trim</code> / <code>.debounce</code></td></tr>
                    <tr><td><code>x-html="..."</code></td><td><code>cv-html.raw</code> for trusted markup; bare <code>cv-html</code> sanitizes by default (safer than Alpine's default)</td></tr>
                    <tr><td><code>x-ref="el"</code></td><td><code>cv-ref="el"</code> (plus dynamic <code>:cv-ref="'foo_'+id"</code>)</td></tr>
                    <tr><td><code>x-cloak</code></td><td><code>cv-cloak</code> (auto-injects the hide CSS for you)</td></tr>
                    <tr><td><code>x-on:click</code> / <code>@click</code></td><td><code>cv:on:click</code> / <code>@click</code></td></tr>
                    <tr><td><code>:bind</code> / <code>x-bind:foo</code></td><td><code>:foo</code> (identical)</td></tr>
                    <tr><td><code>x-transition</code></td><td><code>cv-transition</code> (Alpine class semantics supported)</td></tr>
                    <tr><td><code>x-intersect</code></td><td><code>cv-intersect</code> (with <code>.once</code> / <code>.half</code> / <code>.threshold-N</code> / <code>.margin-N</code>)</td></tr>
                </tbody>
            </table>

            <h2>Inline scope (<code>x-data</code> → <code>cv-data</code>)</h2>
            <code-block :lang="'html'" :code="s_xdata"></code-block>
            <p>Same model: an inline reactive scope, methods can be defined inline, nested scopes inherit the parent. The only delta is the prefix.</p>

            <h2>Auto-init</h2>
            <code-block :lang="'html'" :code="s_init"></code-block>
            <p>Alpine auto-discovers <code>x-data</code> on script load. Courvux requires an explicit <code>autoInit()</code> call, but the behavior from there is identical — it walks all top-level <code>[cv-data]</code> elements and upgrades them.</p>

            <h2>Named components (<code>Alpine.data()</code>)</h2>
            <code-block :lang="'js'" :code="s_components"></code-block>
            <p>Alpine registers reusable scopes via the <code>alpine:init</code> event. Courvux registers them through the <code>autoInit({ components })</code> option. Both end up referencing them by name in <code>cv-data="counter"</code> / <code>x-data="counter"</code>.</p>

            <h2>Stores</h2>
            <code-block :lang="'js'" :code="s_store"></code-block>
            <p>Alpine.store + Courvux <code>createStore</code> serve the same purpose; Courvux's store integrates with the router and devtools and supports <code>modules:</code> for namespacing. See <router-link to="/store" class="link">Store</router-link>.</p>

            <h2>What Courvux adds beyond Alpine</h2>
            <ul>
                <li><strong>Built-in router with <code>:param</code>, nested routes, transitions, <code>keepAlive</code></strong> — Alpine has no router (use a third-party).</li>
                <li><strong>Components (real, not just inline scopes)</strong> — Courvux supports separate <code>.js</code> + <code>.html</code> files, props, emits, slots (default + named + scoped), <code>cv-model</code> on components.</li>
                <li><strong>SSR / SSG</strong> — pre-render every route at build time with <code>courvux/plugin/ssg</code>. Alpine is browser-only.</li>
                <li><strong><code>useHead</code></strong> for per-route SEO metadata, captured during SSG.</li>
                <li><strong>DevTools</strong> built-in. No browser extension.</li>
                <li><strong><code>defineComposable</code></strong> (landing in 0.5.x) — first-class shared logic between components.</li>
            </ul>

            <h2>What Courvux deliberately doesn't add</h2>
            <ul>
                <li>Magic helpers in templates (<code>$el</code> / <code>$refs</code> / <code>$watch</code> exist but are framework primitives, not Alpine "magics" with their own syntax).</li>
                <li>An explicit <code>x-data</code>-only mode — Courvux components are opt-in upgrades from islands; you can mix freely with <code>autoInit</code>.</li>
            </ul>

            <h2>Quick mental model swap</h2>
            <p>If your Alpine app is single-file with a few <code>x-data</code> islands:</p>
            <ol>
                <li>Replace every <code>x-</code> with <code>cv-</code> in your template.</li>
                <li>Add <code>&lt;script type="module"&gt;import { autoInit } from 'courvux'; autoInit();&lt;/script&gt;</code>.</li>
                <li>Replace the Alpine CDN script with the Courvux importmap (see <router-link to="/installation" class="link">Installation → CDN</router-link>).</li>
                <li>Done. The site behaves the same.</li>
            </ol>
            <p>From there, the Courvux extras (router, store, components, SSG) are optional — adopt them when you outgrow inline scopes.</p>

            <div style="margin-top:2rem; display:flex; gap:12px;">
                <router-link to="/migrating-from-vue" style="font-size:13px; color:#555;">← Migrating from Vue</router-link>
                <router-link to="/" style="font-size:13px; color:#111; font-weight:600;">Home →</router-link>
            </div>
        </div>
    `,exprs:{"{ open: false }":(e=>({open:!1})),open:(e=>e.open),items:(e=>e.items),"'foo_'+id":(e=>"foo_"+e.id),"'html'":(e=>"html"),s_xdata:(e=>e.s_xdata),s_init:(e=>e.s_init),"'js'":(e=>"js"),s_components:(e=>e.s_components),counter:(e=>e.counter),s_store:(e=>e.s_store)},onMount(){J({title:"Migrating from Alpine",description:"Mapping table from Alpine.js to Courvux: x-data → cv-data, directives, named components, stores. Mostly identical syntax with a prefix swap.",slug:"/migrating-from-alpine"})}},_t="courvux-demo-todos",Fo=`const STORAGE_KEY = 'courvux-demo-todos';

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
};`,Do=`<!-- Input -->
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
<button cv-show="todos.some(t => t.done)" @click="clearCompleted()">Clear completed</button>`;function Io(){try{return JSON.parse(localStorage.getItem(_t))||[]}catch{return[]}}function Mo(e){localStorage.setItem(_t,JSON.stringify(e))}const Lo={data:{todos:Io(),newTodo:"",filter:"all",editingId:null,editText:"",_nextId:Date.now(),srcJs:Fo,srcHtml:Do,srcTab:"js"},computed:{filteredTodos(){return this.filter==="active"?this.todos.filter(e=>!e.done):this.filter==="completed"?this.todos.filter(e=>e.done):this.todos},remaining(){return this.todos.filter(e=>!e.done).length},allDone(){return this.todos.length>0&&this.todos.every(e=>e.done)}},watch:{todos:{deep:!0,handler(e){Mo(e)}}},methods:{add(){const e=this.newTodo.trim();e&&(this.todos=[...this.todos,{id:this._nextId++,text:e,done:!1}],this.newTodo="")},toggle(e){this.todos=this.todos.map(t=>t.id===e?{...t,done:!t.done}:t)},remove(e){this.todos=this.todos.filter(t=>t.id!==e)},clearCompleted(){this.todos=this.todos.filter(e=>!e.done)},toggleAll(){const e=this.allDone;this.todos=this.todos.map(t=>({...t,done:!e}))},startEdit(e){this.editingId=e.id,this.editText=e.text,this.$nextTick(()=>{var t;return(t=this.$refs["edit_"+e.id])==null?void 0:t.focus()})},commitEdit(e){const t=this.editText.trim();t?this.todos=this.todos.map(o=>o.id===e?{...o,text:t}:o):this.remove(e),this.editingId=null,this.editText=""},cancelEdit(){this.editingId=null,this.editText=""},setFilter(e){this.filter=e}},template:`
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
    `,exprs:{remaining:(e=>e.remaining),"remaining === 1 ? '' : 's'":(e=>e.remaining===1?"":"s"),"filter === 'completed' ? 'No completed tasks.' : filter === 'active' ? 'All done!' : 'Add a task above.'":(e=>e.filter==="completed"?"No completed tasks.":e.filter==="active"?"All done!":"Add a task above."),"todo.text":(e=>e.todo.text),newTodo:(e=>e.newTodo),"add()":(e=>e.add()),"$event.target.style.borderColor='#111'":(e=>e.$event.target.style.borderColor="#111"),"$event.target.style.borderColor='#ddd'":(e=>e.$event.target.style.borderColor="#ddd"),"todos.length > 0":(e=>e.todos.length>0),allDone:(e=>e.allDone),"toggleAll()":(e=>e.toggleAll()),"filteredTodos.length === 0":(e=>e.filteredTodos.length===0),filteredTodos:(e=>e.filteredTodos),"todo.id":(e=>e.todo.id),"{ done: todo.done }":(e=>({done:e.todo.done})),"editingId !== todo.id":(e=>e.editingId!==e.todo.id),"todo.done":(e=>e.todo.done),"toggle(todo.id)":(e=>e.toggle(e.todo.id)),"startEdit(todo)":(e=>e.startEdit(e.todo)),"'Double-click to edit'":(e=>"Double-click to edit"),"remove(todo.id)":(e=>e.remove(e.todo.id)),"$event.target.style.color='#111'":(e=>e.$event.target.style.color="#111"),"$event.target.style.color='#ccc'":(e=>e.$event.target.style.color="#ccc"),"editingId === todo.id":(e=>e.editingId===e.todo.id),"'edit_' + todo.id":(e=>"edit_"+e.todo.id),editText:(e=>e.editText),"commitEdit(todo.id)":(e=>e.commitEdit(e.todo.id)),"cancelEdit()":(e=>e.cancelEdit()),"{ active: filter === 'all' }":(e=>({active:e.filter==="all"})),"setFilter('all')":(e=>e.setFilter("all")),"{ active: filter === 'active' }":(e=>({active:e.filter==="active"})),"setFilter('active')":(e=>e.setFilter("active")),"{ active: filter === 'completed' }":(e=>({active:e.filter==="completed"})),"setFilter('completed')":(e=>e.setFilter("completed")),"todos.some(t => t.done)":(e=>e.todos.some((t=>t.done))),"clearCompleted()":(e=>e.clearCompleted()),"$event.target.style.color='#999'":(e=>e.$event.target.style.color="#999"),"srcTab === 'js' ? 'src-tab active' : 'src-tab'":(e=>e.srcTab==="js"?"src-tab active":"src-tab"),"srcTab = 'js'":(e=>e.srcTab="js"),"srcTab === 'html' ? 'src-tab active' : 'src-tab'":(e=>e.srcTab==="html"?"src-tab active":"src-tab"),"srcTab = 'html'":(e=>e.srcTab="html"),"srcTab === 'js'":(e=>e.srcTab==="js"),"'js'":(e=>"js"),srcJs:(e=>e.srcJs),"srcTab === 'html'":(e=>e.srcTab==="html"),"'html'":(e=>"html"),srcHtml:(e=>e.srcHtml)},onMount(){J({title:"Demo — TODO App",description:"Interactive TODO app built with Courvux. Live demo with full source code (JS + HTML).",slug:"/demo"})}},Ro={data:{s_install:`# Clone + run from source (any platform)
git clone https://github.com/vanjexdev/courvux-tauri-example.git
cd courvux-tauri-example
pnpm install
pnpm tauri:dev

# Build a release binary for your host
pnpm tauri:build
# Linux Fedora 40+: prepend NO_STRIP=true (linuxdeploy gotcha)`,s_layout:`courvux-tauri-example/
├── package.json                  # Vite + frontend deps; Tauri CLI as devDep
├── vite.config.js                # tailwindcss + courvuxPrecompile plugins
├── index.html                    # CSP meta + #app mount point
├── src/
│   ├── main.js                   # Courvux app — entire UI lives here
│   ├── style.css                 # @import "tailwindcss" + .markdown-body
│   ├── icons.js                  # Lucide → static SVG strings
│   ├── markdown.js               # marked + Prism + DOMPurify pipeline
│   └── tauri.js                  # invoke() wrappers (note IO + folder picker)
├── src-tauri/
│   ├── Cargo.toml
│   ├── tauri.conf.json           # productName, window, CSP, bundle targets
│   ├── capabilities/default.json # IPC + dialog plugin permissions
│   └── src/
│       ├── main.rs               # thin wrapper, delegates to lib
│       └── lib.rs                # commands + atomic file IO + config persist
└── README.md`,s_csp:`<meta http-equiv="Content-Security-Policy"
      content="default-src 'self';
               script-src 'self';
               style-src 'self' 'unsafe-inline';
               img-src 'self' data:;
               font-src 'self';
               connect-src 'self' ipc: http://ipc.localhost;
               object-src 'none';
               base-uri 'self';
               form-action 'self'" />`,s_storage:`# One Markdown file per note, with YAML frontmatter
~/.local/share/dev.vanjex.courvux-tauri-notepad/notes/
├── 1730812345678.md
├── 1730812400000.md
└── 1730812499000.md

# Each file:
---
title: My note
createdAt: 1730812345678
updatedAt: 1730812400000
---

# Hello

This is **markdown** with \`syntax-highlighted\` fences:

\`\`\`rust
fn main() { println!("hello tauri"); }
\`\`\``},template:`
        <div class="prose">
            <h1>Notepad — Tauri demo</h1>
            <p>
                A small desktop notepad app, built end-to-end with Courvux,
                <a href="https://tauri.app/" target="_blank" rel="noopener">Tauri 2</a>,
                <a href="https://tailwindcss.com/" target="_blank" rel="noopener">Tailwind 4</a>,
                and the
                <router-link to="/csp" class="link">courvux-precompile</router-link>
                plugin. Source lives at
                <a href="https://github.com/vanjexdev/courvux-tauri-example" target="_blank" rel="noopener">vanjexdev/courvux-tauri-example</a>.
            </p>

            <p>
                The app exists for two reasons: it's a real-world test for the
                Courvux runtime under a strict-CSP webview, and it's the answer
                to "what does a Tauri + Courvux project look like?" for anyone
                evaluating the framework.
            </p>

            <div class="callout info">
                Linux bundles (AppImage, .deb, .rpm) attached to every release —
                <a href="https://github.com/vanjexdev/courvux-tauri-example/releases" target="_blank" rel="noopener">github.com/vanjexdev/courvux-tauri-example/releases</a>.
                macOS / Windows users build from source (instructions in the README).
            </div>

            <h2>What it shows</h2>
            <ul>
                <li><strong>Markdown editor with live preview</strong> — three view modes (Edit / Split / Preview) cycled via <code>Ctrl+P</code>. Render pipeline is <a href="https://marked.js.org/" target="_blank" rel="noopener">marked</a> → <a href="https://prismjs.com/" target="_blank" rel="noopener">Prism</a> for fenced-code syntax highlighting → <a href="https://github.com/cure53/DOMPurify" target="_blank" rel="noopener">DOMPurify</a> sanitization, so a hostile paste cannot execute scripts even with strict CSP.</li>
                <li><strong>Per-note Markdown files on disk.</strong> Each note is its own <code>&lt;id&gt;.md</code> file with YAML frontmatter (<code>title</code>, <code>createdAt</code>, <code>updatedAt</code>). Sync with Dropbox / Syncthing / git — the app reads them as plain text.</li>
                <li><strong>Atomic writes</strong> via tempfile + <code>fsync</code> + rename, so a mid-write crash never leaves a corrupt note.</li>
                <li><strong>User-picked storage folder</strong> — gear icon (or <code>Ctrl+,</code>) opens a settings panel with a native folder picker (<code>@tauri-apps/plugin-dialog</code>). Choice persists in <code>config.json</code>; "Reset to default" reverts.</li>
                <li><strong>Save state machine.</strong> New notes start <code>Unsaved</code> and require <code>Ctrl+S</code> for the first commit; after that, every keystroke promotes to <code>Dirty</code> and auto-saves 600 ms later. Status bar reflects the state in real time.</li>
                <li><strong>Window-close guard.</strong> <code>beforeunload</code> blocks accidental quit while the active note has unsaved changes.</li>
                <li><strong>Collapsible + resizable sidebar.</strong> Drag the right edge to resize (180-480 px); <code>Ctrl+B</code> toggles visibility. Width and open state both persist in <code>localStorage</code>.</li>
                <li><strong>Lucide icons</strong> throughout the UI instead of ASCII / emoji glyphs.</li>
                <li><strong>Migration from older formats.</strong> The first version stored notes as a single <code>notes.json</code> blob; a 0.2.0 → 0.3.0 user opens the app and the Rust side silently migrates each entry into its own <code>.md</code> file, then deletes the legacy file.</li>
            </ul>

            <h2>Strict CSP, no <code>unsafe-eval</code></h2>
            <p>
                Tauri 2 ships with a strict CSP by default. The notepad's
                <code>tauri.conf.json</code> and the <code>&lt;meta http-equiv&gt;</code>
                in <code>index.html</code> both declare:
            </p>
            <code-block :lang="'html'" :code="s_csp"></code-block>
            <p>
                That's only possible because <code>vite-plugin-courvux-precompile</code>
                walks every Courvux template at build time and turns each expression
                — <code>{{ count }}</code>, <code>:disabled="!flag"</code>,
                <code>@click="save()"</code>, <code>cv-model="form.title"</code> —
                into a JavaScript arrow function compiled at build time. The runtime
                checks that registry before falling back to <code>new Function</code>,
                so the fallback is never reached and the page can ship without
                <code>script-src 'unsafe-eval'</code>.
            </p>
            <p>
                Build-end report on the notepad's source:
            </p>
            <pre><code>[courvux-precompile] processed 1 file(s), 57 expression(s) precompiled, 0 template(s) fell back to runtime new Function.</code></pre>
            <p>
                The full story lives at <router-link to="/csp" class="link">/csp</router-link>.
            </p>

            <h2>Storage layout</h2>
            <p>Notes live as plain Markdown files in the platform's app-data directory (or wherever the user picks via the settings panel):</p>
            <code-block :lang="'bash'" :code="s_storage"></code-block>
            <p>
                Each file is human-editable. Open one in any text editor while
                the app is closed — the next time the notepad starts it picks
                up your changes. The <code>id</code> in the filename is the
                creation timestamp; titles can be renamed without touching
                the filename so links and references stay stable.
            </p>

            <h2>Source layout</h2>
            <code-block :lang="'text'" :code="s_layout"></code-block>

            <h2>Try it</h2>
            <code-block :lang="'bash'" :code="s_install"></code-block>
            <p>
                Per-platform prerequisites and the Fedora <code>NO_STRIP=true</code>
                gotcha are documented in the
                <a href="https://github.com/vanjexdev/courvux-tauri-example/blob/main/README.md" target="_blank" rel="noopener">repo README</a>.
            </p>

            <h2>Tech stack at a glance</h2>
            <table>
                <thead>
                    <tr><th>Layer</th><th>Pick</th><th>Why</th></tr>
                </thead>
                <tbody>
                    <tr><td>UI runtime</td><td>Courvux 0.7.1</td><td>~22 KB gzip everything-included; supports the strict-CSP precompile path</td></tr>
                    <tr><td>Build / bundler</td><td>Vite 6</td><td>Plugin ecosystem (tailwind, courvux-precompile), instant HMR</td></tr>
                    <tr><td>Styling</td><td>Tailwind 4</td><td>No config file, single <code>@import</code></td></tr>
                    <tr><td>Markdown</td><td>marked + DOMPurify</td><td>Fast parser; mandatory sanitization for hostile pastes</td></tr>
                    <tr><td>Code highlighting</td><td>Prism (Tomorrow Night)</td><td>Tiny core + per-language packs; matches the dark UI</td></tr>
                    <tr><td>Icons</td><td>Lucide v1</td><td>Already a Courvux dependency; SVG strings precomputed at module load</td></tr>
                    <tr><td>Desktop shell</td><td>Tauri 2</td><td>Rust backend, system webview, ~3-5x lighter than Electron</td></tr>
                    <tr><td>Native folder picker</td><td>tauri-plugin-dialog</td><td>OS-native dialog instead of browser <code>&lt;input type="file"&gt;</code></td></tr>
                    <tr><td>Note serialization</td><td>serde_yaml + serde_json</td><td>YAML frontmatter for human-readable Markdown files; JSON for the small <code>config.json</code></td></tr>
                </tbody>
            </table>

            <div class="callout">
                <strong>Footprint reality check.</strong> A typical idle session runs at
                ~400 MB RSS (≈135 MB Rust main + ≈248 MB <code>WebKitWebProcess</code>).
                Same ballpark as VS Code, half of Slack, ~60% of an equivalent Electron
                app. Tauri's binary on disk is ~10 MB; the AppImage portable bundle is
                ~100 MB because it carries WebKit + GTK + their runtime deps.
            </div>

            <div style="margin-top:2rem; display:flex; gap:12px;">
                <router-link to="/csp" style="font-size:13px; color:#555;">← Strict CSP</router-link>
                <a href="https://github.com/vanjexdev/courvux-tauri-example" target="_blank" rel="noopener" style="font-size:13px; color:#111; font-weight:600;">View source →</a>
            </div>
        </div>
    `,exprs:{count:(e=>e.count),"'html'":(e=>"html"),s_csp:(e=>e.s_csp),"!flag":(e=>!e.flag),"save()":(e=>e.save()),"form.title":(e=>e.form.title),"'bash'":(e=>"bash"),s_storage:(e=>e.s_storage),"'text'":(e=>"text"),s_layout:(e=>e.s_layout),s_install:(e=>e.s_install)},onMount(){J({title:"Notepad — Tauri 2 demo",description:"Desktop notepad app showcasing Courvux + Tauri 2 + Tailwind 4 + the courvux-precompile plugin: Markdown editor with live preview, atomic per-note Markdown files, native folder picker, strict CSP without unsafe-eval.",slug:"/projects/notepad"})}},zo=[{path:"/",component:po},{path:"/installation",component:uo},{path:"/quick-start",component:mo},{path:"/template",component:ho},{path:"/components",component:fo},{path:"/reactivity",component:go},{path:"/lifecycle",component:vo},{path:"/composables",component:bo},{path:"/event-bus",component:yo},{path:"/router",component:xo},{path:"/store",component:wo},{path:"/head",component:ko},{path:"/ssg",component:So},{path:"/devtools",component:_o},{path:"/testing",component:Ao},{path:"/pwa",component:Co},{path:"/csp",component:To},{path:"/advanced",component:$o},{path:"/design-decisions",component:Eo},{path:"/faq",component:jo},{path:"/migrating-from-vue",component:Po},{path:"/migrating-from-alpine",component:Oo},{path:"/demo",component:Lo},{path:"/projects/notepad",component:Ro}],No={methods:{goBack(){window.history.back()}},template:`
        <div style="min-height:60vh; display:flex; align-items:center; justify-content:center; padding:4rem 1rem;">
            <div style="text-align:center; max-width:480px;">
                <p style="font-size:5rem; font-weight:700; margin:0 0 0.5rem; color:#111; line-height:1;">404</p>
                <h1 style="font-size:1.25rem; font-weight:600; margin:0 0 0.75rem; color:#111;">Page not found</h1>
                <p style="color:#666; font-size:14px; margin:0 0 2rem; line-height:1.6;">
                    The page you are looking for doesn't exist or was moved.
                    Check the URL, or use one of the options below.
                </p>
                <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap;">
                    <button
                        @click="goBack()"
                        style="
                            padding:9px 18px; font-family:inherit; font-size:13px; font-weight:500;
                            background:#fff; color:#111; border:1px solid #d4d4d4; border-radius:6px;
                            cursor:pointer; transition:all .15s;
                        "
                        @mouseover="$event.currentTarget.style.background='#f5f5f5'"
                        @mouseout="$event.currentTarget.style.background='#fff'"
                    >← Back</button>
                    <router-link
                        to="/"
                        style="
                            padding:9px 18px; font-size:13px; font-weight:500;
                            background:#111; color:#fff; border:1px solid #111; border-radius:6px;
                            text-decoration:none; transition:opacity .15s;
                        "
                        @mouseover="$event.currentTarget.style.opacity='0.85'"
                        @mouseout="$event.currentTarget.style.opacity='1'"
                    >Home →</router-link>
                </div>
            </div>
        </div>
    `,exprs:{"goBack()":(e=>e.goBack()),"$event.currentTarget.style.background='#f5f5f5'":(e=>e.$event.currentTarget.style.background="#f5f5f5"),"$event.currentTarget.style.background='#fff'":(e=>e.$event.currentTarget.style.background="#fff"),"$event.currentTarget.style.opacity='0.85'":(e=>e.$event.currentTarget.style.opacity="0.85"),"$event.currentTarget.style.opacity='1'":(e=>e.$event.currentTarget.style.opacity="1")},onMount(){J({title:"404 — Page not found",description:"The page you are looking for does not exist on Courvux docs.",slug:"/404"})}};let He=null;function Ho(e){He=e}const Wo=zt([...zo,{path:"*",component:No}],{mode:"history",base:"/courvux",afterEach(){He&&He()},scrollBehavior:()=>{var e;return(e=document.querySelector("main"))==null||e.scrollTo({top:0,behavior:"instant"}),{x:0,y:0}}}),ft=[{key:"start",label:"Getting Started",items:[{to:"/",label:"Introduction"},{to:"/installation",label:"Installation"},{to:"/quick-start",label:"Quick Start"}]},{key:"template",label:"Template Syntax",items:[{to:"/template",label:"Directives & Bindings"}]},{key:"components",label:"Components",items:[{to:"/components",label:"Components"},{to:"/reactivity",label:"Reactivity"},{to:"/lifecycle",label:"Lifecycle"},{to:"/composables",label:"Composables"},{to:"/event-bus",label:"Event Bus"}]},{key:"router",label:"Router & Store",items:[{to:"/router",label:"Router"},{to:"/store",label:"Store"}]},{key:"seo",label:"SEO & SSG",items:[{to:"/head",label:"useHead"},{to:"/ssg",label:"Static Generation"}]},{key:"tooling",label:"Tooling",items:[{to:"/devtools",label:"DevTools"},{to:"/testing",label:"Testing"},{to:"/pwa",label:"PWA"},{to:"/csp",label:"Strict CSP"}]},{key:"advanced",label:"Advanced",items:[{to:"/advanced",label:"Directives & Plugins"}]},{key:"reference",label:"Reference",items:[{to:"/design-decisions",label:"Design Decisions"},{to:"/faq",label:"FAQ & Troubleshooting"},{to:"/migrating-from-vue",label:"Migrating from Vue"},{to:"/migrating-from-alpine",label:"Migrating from Alpine"}]},{key:"demo",label:"Demo",items:[{to:"/demo",label:"⚡ TODO App"}]},{key:"projects",label:"Projects",items:[{to:"/projects/notepad",label:"📝 Notepad (Tauri)"}]}];to({router:Wo,components:{"code-block":lo},data:{nav:ft,open:ft.reduce((e,t)=>(e[t.key]=!0,e),{}),sidebarOpen:!1},methods:{toggle(e){this.open={...this.open,[e]:!this.open[e]}},toggleSidebar(){if(this.sidebarOpen=!this.sidebarOpen,this.sidebarOpen)document.body.style.overflow="hidden",this.$nextTick(()=>{const e=document.querySelector(".sidebar");e&&(e.style.transform="translateX(0)")});else{document.body.style.overflow="";const e=document.querySelector(".sidebar");e&&(e.style.transform="translateX(-100%)")}},closeSidebar(){if(window.innerWidth<=1024){this.sidebarOpen=!1,document.body.style.overflow="";const e=document.querySelector(".sidebar");e&&(e.style.transform="translateX(-100%)")}}},onMount(){Ho(()=>{this.closeSidebar()})},onBeforeMount(){typeof window<"u"&&window.addEventListener("resize",()=>{if(window.innerWidth>1024&&this.sidebarOpen){this.sidebarOpen=!1,document.body.style.overflow="";const e=document.querySelector(".sidebar");e&&(e.style.transform="")}})},template:`
        <div style="display:flex; min-height:100vh; position:relative;">

            <!-- Skip to content link (accessibility) -->
            <a href="#main-content" class="skip-link" style="position:absolute; left:-9999px; top:auto; width:1px; height:1px; overflow:hidden; z-index:9999; background:#111; color:#fff; padding:8px 16px; font-size:14px; border-radius:4px; text-decoration:none;"
               @focus="$event.target.style.left='8px'; $event.target.style.top='8px'; $event.target.style.width='auto'; $event.target.style.height='auto'; $event.target.style.overflow='visible';"
               @blur="$event.target.style.left='-9999px'; $event.target.style.top='auto'; $event.target.style.width='1px'; $event.target.style.height='1px'; $event.target.style.overflow='hidden';"
            >Skip to content</a>

            <!-- ── Sidebar overlay (mobile) ────────────────────── -->
            <div class="sidebar-overlay" cv-show="sidebarOpen" @click="closeSidebar" style="position:fixed; inset:0; background:rgba(0,0,0,0.4); z-index:40; opacity:0; transition:opacity .2s;"
                 :style="sidebarOpen ? 'opacity:1' : 'opacity:0'"></div>

            <!-- ── Sidebar ──────────────────────────────────────── -->
            <aside class="sidebar" aria-label="Sidebar navigation" style="
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
                z-index: 50;
                transition: transform .25s ease;
            ">
                <!-- Logo -->
                <div style="padding: 20px 16px 12px; border-bottom: 1px solid #f0f0f0;">
                    <router-link to="/" @click="closeSidebar()" style="text-decoration:none; display:flex; align-items:center; gap:8px;" aria-label="Courvux v0.7.1 home">
                        <img src="/courvux/logo.png" alt="" width="22" height="22" style="display:block;" aria-hidden="true" />
                        <span style="font-weight:700; font-size:15px; color:#111;">Courvux</span>
                        <span style="font-size:10px; color:#666; margin-left:2px;">v0.7.1</span>
                    </router-link>
                </div>

                <!-- Accordion nav -->
                <nav style="flex:1; padding: 12px 8px;">
                    <div cv-for="section in nav" :key="section.key" style="margin-bottom:4px;">
                        <!-- Section header -->
                        <button
                            @click="toggle(section.key)"
                            :aria-expanded="open[section.key] ? 'true' : 'false'"
                            style="
                                width:100%; display:flex; align-items:center; justify-content:space-between;
                                padding:6px 8px; background:none; border:none; cursor:pointer;
                                font-family:inherit; font-size:11px; font-weight:600;
                                text-transform:uppercase; letter-spacing:.06em; color:#666;
                                border-radius:4px;
                            "
                            @mouseover="$event.currentTarget.style.color='#111'"
                            @mouseout="$event.currentTarget.style.color='#666'"
                        >
                            <span>{{ section.label }}</span>
                            <span style="font-size:10px; transition:transform .15s;"
                                  :style="open[section.key] ? 'transform:rotate(90deg)' : 'transform:rotate(0deg)'"
                                  aria-hidden="true">▶</span>
                        </button>

                        <!-- Section items -->
                        <div cv-show="open[section.key]" style="padding-left:4px; margin-top:2px;">
                            <router-link
                                cv-for="item in section.items"
                                :key="item.to"
                                :to="item.to"
                                @click="closeSidebar()"
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
                           rel="noopener noreferrer"
                           style="color:#555; text-decoration:none; display:flex; align-items:center; gap:4px; min-height:24px; padding:2px 0;"
                           @mouseover="$event.target.style.color='#111'"
                           @mouseout="$event.target.style.color='#555'"
                        >⬡ GitHub</a>
                        <a href="https://github.com/vanjexdev/courvux/issues"
                           target="_blank"
                           rel="noopener noreferrer"
                           style="color:#555; text-decoration:none; display:flex; align-items:center; gap:4px; min-height:24px; padding:2px 0;"
                           @mouseover="$event.target.style.color='#111'"
                           @mouseout="$event.target.style.color='#555'"
                        >⬡ Issues / Support</a>
                        <a href="https://ko-fi.com/vanjexdev"
                           target="_blank"
                           rel="noopener noreferrer"
                           style="color:#555; text-decoration:none; display:flex; align-items:center; gap:4px; min-height:24px; padding:2px 0;"
                           @mouseover="$event.target.style.color='#111'"
                           @mouseout="$event.target.style.color='#555'"
                        >♥ Buy me a coffee</a>
                    </div>
                </div>
            </aside>

            <!-- ── Floating sidebar toggle (mobile) ────────────── -->
            <button class="sidebar-toggle"
                    @click="toggleSidebar()"
                    :aria-label="sidebarOpen ? 'Close navigation' : 'Open navigation'"
                    :aria-expanded="sidebarOpen ? 'true' : 'false'"
                    style="
                        display:none;
                        position:fixed;
                        bottom:20px;
                        right:20px;
                        width:48px;
                        height:48px;
                        border-radius:50%;
                        background:#111;
                        color:#fff;
                        border:none;
                        cursor:pointer;
                        font-size:20px;
                        z-index:45;
                        box-shadow:0 2px 12px rgba(0,0,0,0.25);
                        align-items:center;
                        justify-content:center;
                        transition:transform .15s;
                    "
                    @mouseover="$event.currentTarget.style.transform='scale(1.1)'"
                    @mouseout="$event.currentTarget.style.transform='scale(1)'"
            >
                <span class="sidebar-toggle-icon" aria-hidden="true"
                      style="display:inline-block; transition:transform .2s; line-height:1; font-size:22px;">{{ sidebarOpen ? '✕' : '☰' }}</span>
            </button>

            <!-- ── Content ───────────────────────────────────────── -->
            <main id="main-content" role="main" style="flex:1; overflow-y:auto; min-height:100vh;">
                <div style="max-width:780px; margin:0 auto; padding:2.5rem 2rem 4rem;">
                    <router-view></router-view>
                </div>
            </main>
        </div>
    `,exprs:{"section.label":(e=>e.section.label),"item.label":(e=>e.item.label),"sidebarOpen ? '✕' : '☰'":(e=>e.sidebarOpen?"â":"â°"),"$event.target.style.left='8px'; $event.target.style.top='8px'; $event.target.style.width='auto'; $event.target.style.height='auto'; $event.target.style.overflow='visible';":(e=>(e.$event.target.style.left="8px",e.$event.target.style.top="8px",e.$event.target.style.width="auto",e.$event.target.style.height="auto",e.$event.target.style.overflow="visible")),"$event.target.style.left='-9999px'; $event.target.style.top='auto'; $event.target.style.width='1px'; $event.target.style.height='1px'; $event.target.style.overflow='hidden';":(e=>(e.$event.target.style.left="-9999px",e.$event.target.style.top="auto",e.$event.target.style.width="1px",e.$event.target.style.height="1px",e.$event.target.style.overflow="hidden")),sidebarOpen:(e=>e.sidebarOpen),closeSidebar:(e=>e.closeSidebar),"sidebarOpen ? 'opacity:1' : 'opacity:0'":(e=>e.sidebarOpen?"opacity:1":"opacity:0"),"closeSidebar()":(e=>e.closeSidebar()),nav:(e=>e.nav),"section.key":(e=>e.section.key),"toggle(section.key)":(e=>e.toggle(e.section.key)),"open[section.key] ? 'true' : 'false'":(e=>e.open[e.section.key]?"true":"false"),"$event.currentTarget.style.color='#111'":(e=>e.$event.currentTarget.style.color="#111"),"$event.currentTarget.style.color='#666'":(e=>e.$event.currentTarget.style.color="#666"),"open[section.key] ? 'transform:rotate(90deg)' : 'transform:rotate(0deg)'":(e=>e.open[e.section.key]?"transform:rotate(90deg)":"transform:rotate(0deg)"),"open[section.key]":(e=>e.open[e.section.key]),"section.items":(e=>e.section.items),"item.to":(e=>e.item.to),"$event.target.style.color='#111'":(e=>e.$event.target.style.color="#111"),"$event.target.style.color='#555'":(e=>e.$event.target.style.color="#555"),"toggleSidebar()":(e=>e.toggleSidebar()),"sidebarOpen ? 'Close navigation' : 'Open navigation'":(e=>e.sidebarOpen?"Close navigation":"Open navigation"),"sidebarOpen ? 'true' : 'false'":(e=>e.sidebarOpen?"true":"false"),"$event.currentTarget.style.transform='scale(1.1)'":(e=>e.$event.currentTarget.style.transform="scale(1.1)"),"$event.currentTarget.style.transform='scale(1)'":(e=>e.$event.currentTarget.style.transform="scale(1)")}}).mount("#app").catch(e=>{console.error("[courvux] mount failed:",e);const t=document.getElementById("app");t&&(t.innerHTML=`
            <div style="padding:1.5rem; max-width:680px; margin:2rem auto; font-family:ui-monospace,monospace; font-size:13px; color:#111; background:#fff; border:1px solid #ddd; border-radius:8px;">
                <p style="font-weight:600; margin:0 0 8px;">App failed to mount</p>
                <pre style="white-space:pre-wrap; word-break:break-word; margin:0; color:#a33;">${(e&&e.message?e.message:String(e)).replace(/[<>&]/g,o=>({"<":"&lt;",">":"&gt;","&":"&amp;"})[o])}</pre>
                <p style="margin:12px 0 0; color:#666; font-size:12px;">Check the browser console for the full stack trace.</p>
            </div>
        `)});
