(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))c(l);new MutationObserver(l=>{for(const y of l)if(y.type==="childList")for(const E of y.addedNodes)E.tagName==="LINK"&&E.rel==="modulepreload"&&c(E)}).observe(document,{childList:!0,subtree:!0});function o(l){const y={};return l.integrity&&(y.integrity=l.integrity),l.referrerPolicy&&(y.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?y.credentials="include":l.crossOrigin==="anonymous"?y.credentials="omit":y.credentials="same-origin",y}function c(l){if(l.ep)return;l.ep=!0;const y=o(l);fetch(l.href,y)}})();var bt=new Set(["push","pop","shift","unshift","splice","sort","reverse"]),it=e=>e instanceof Date||e instanceof RegExp||e instanceof Map||e instanceof Set||e instanceof WeakMap||e instanceof WeakSet||ArrayBuffer.isView(e)||e instanceof ArrayBuffer,je=new WeakSet,we=Symbol("raw"),$e=e=>e===null||typeof e!="object"?e:e[we]??e,xe=0,Le=new Map,fe=null;function Ie(e){const t=[],o=fe;fe=t;try{e()}finally{fe=o}return t}function yt(e){xe++;try{e()}finally{if(xe--,xe===0){const t=[...Le.values()];Le.clear(),t.forEach(o=>o())}}}function st(e,t){return e===null||typeof e!="object"||je.has(e)||it(e)?e:new Proxy(e,{get(o,c){if(c===we)return o[we]??o;if(typeof c=="string"&&Array.isArray(o)&&bt.has(c))return(...y)=>{const E=Array.prototype[c].apply(o,y);return t(),E};const l=o[c];return l!==null&&typeof l=="object"&&!je.has(l)?st(l,t):l},set(o,c,l){return o[c]=l,t(),!0}})}function Pe(){const e={},t=Math.random().toString(36).slice(2),o=(y,E)=>(e[y]||(e[y]=new Set),e[y].add(E),()=>{var x;(x=e[y])==null||x.delete(E)}),c=y=>{xe>0?Le.set(`${t}:${y}`,()=>{(e[y]?[...e[y]]:[]).forEach(E=>E())}):(e[y]?[...e[y]]:[]).forEach(E=>E())},l={};return{subscribe:o,createReactiveState:y=>new Proxy(y,{get(E,x){if(x===we)return y;typeof x=="string"&&!x.startsWith("$")&&fe&&fe.push({sub:o,key:x});const L=E[x];return typeof x=="string"&&!x.startsWith("$")&&L!==null&&typeof L=="object"&&!je.has(L)&&!it(L)?st(L,()=>c(x)):L},set(E,x,L){if(l[x])return l[x](L),!0;const C=E[x];return E[x]=L,(C!==L||L!==null&&typeof L=="object")&&c(x),!0}}),registerSetInterceptor:(y,E)=>{l[y]=E},notifyAll:()=>{Object.keys(e).forEach(y=>c(y))}}}var Ce=new WeakMap;function ve(e,t,o){var l,y;const c=t.indexOf(".");if(c>=0){const E=t.slice(0,c),x=t.slice(c+1),L=e[E];return L&&Ce.has(L)?ve(L,x,o):((l=Ce.get(e))==null?void 0:l(E,o))??(()=>{})}return((y=Ce.get(e))==null?void 0:y(t,o))??(()=>{})}var ct=(e,t)=>e.split(".").reduce((o,c)=>o==null?void 0:o[c],t),lt=(()=>{try{return new Function("return 1")(),!0}catch{return console.warn("[courvux] CSP blocks eval. Expressions limited to property access and literals."),!1}})(),Re=new Map,ze=new Map,dt=(e,t)=>{const o=e.trim();if(o==="true")return!0;if(o==="false")return!1;if(o==="null")return null;if(o!=="undefined")return/^-?\d+(\.\d+)?$/.test(o)?parseFloat(o):/^(['"`])(.*)\1$/s.test(o)?o.slice(1,-1):o.startsWith("!")?!dt(o.slice(1).trim(),t):ct(o,t)},H=(e,t)=>{if(!lt)return dt(e,t);try{let o=Re.get(e);return o||(o=new Function("$data",`with($data) { return (${e}) }`),Re.set(e,o)),o(t)}catch{return ct(e,t)}},ue=(e,t,o)=>e.startsWith("$store.")&&t.store?t.storeSubscribeOverride?t.storeSubscribeOverride(t.store,e.slice(7),o):ve(t.store,e.slice(7),o):t.subscribe(e,o),K=(e,t,o)=>{const c=new Set(["true","false","null","undefined","in","of","typeof","instanceof"]),l=e.match(/\$?[a-zA-Z_][\w$]*(?:\.\$?[a-zA-Z_][\w$]*)*/g)??[],y=[...new Set(l.map(x=>x.startsWith("$store.")?x:x.split(".")[0]).filter(x=>!c.has(x)))];if(y.length===0)return()=>{};const E=y.map(x=>ue(x,t,o));return()=>E.forEach(x=>x())},le=(e,t,o)=>{const c=e.split(".");if(c.length===1)t[c[0]]=o;else{const l=c.slice(0,-1).reduce((y,E)=>y==null?void 0:y[E],t);l&&(l[c[c.length-1]]=o)}},Ne=(e,t,o,c,l)=>{const y={};return Object.keys(e).forEach(E=>y[E]=e[E]),y[o]=t,l&&(y[l]=c),y},De=e=>e?typeof e=="string"?e:Array.isArray(e)?e.map(De).filter(Boolean).join(" "):typeof e=="object"?Object.entries(e).filter(([,t])=>!!t).map(([t])=>t).join(" "):"":"",He=(e,t,o)=>{if(!t){e.style.cssText=o;return}typeof t=="string"?e.style.cssText=o?`${o};${t}`:t:typeof t=="object"&&(o&&(e.style.cssText=o),Object.entries(t).forEach(([c,l])=>{e.style[c]=l??""}))},We=(e,t,o)=>{if(lt)try{let c=ze.get(e);c||(c=new Function("__p__",`with(__p__){${e}}`),ze.set(e,c));const l=new Proxy({},{has:()=>!0,get:(y,E)=>E==="$event"?o:E in t?t[E]:globalThis[E],set:(y,E,x)=>(t[E]=x,!0)});c(l)}catch(c){console.warn(`[courvux] handler error "${e}":`,c)}},ie=e=>{const t=getComputedStyle(e),o=Math.max(parseFloat(t.animationDuration)||0,parseFloat(t.transitionDuration)||0)*1e3;return o<=0?Promise.resolve():new Promise(c=>{const l=()=>c();e.addEventListener("animationend",l,{once:!0}),e.addEventListener("transitionend",l,{once:!0}),setTimeout(l,o+50)})},xt=`
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
`,Ue=!1;function Be(){if(Ue||typeof document>"u")return;Ue=!0;const e=document.createElement("style");e.id="cv-transitions-el",e.textContent=xt,document.head.appendChild(e)}var qe=!1;function kt(){if(qe||typeof document>"u")return;qe=!0;const e=document.createElement("style");e.id="cv-cloak-style",e.textContent="[cv-cloak]{display:none!important}",document.head.appendChild(e)}function wt(e){if(typeof window<"u"&&"Sanitizer"in window){const o=document.createElement("div");return o.setHTML(e,{sanitizer:new window.Sanitizer}),o.innerHTML}const t=new DOMParser().parseFromString(e,"text/html");return t.querySelectorAll("script,iframe,object,embed,form,meta,link,style").forEach(o=>o.remove()),t.querySelectorAll("*").forEach(o=>{Array.from(o.attributes).forEach(c=>{(c.name.startsWith("on")||c.value.trim().toLowerCase().startsWith("javascript:"))&&o.removeAttribute(c.name)})}),t.body.innerHTML}async function oe(e,t,o){var y,E,x,L,C,w,W,$,M,D,F,I,T,d,r,h,A;const c=Array.from(e.childNodes);let l=0;for(;l<c.length;){const S=c[l];if(S.nodeType===3){const i=S.textContent||"",a=i.match(/\{\{([\s\S]+?)\}\}/g);if(a){const s=i,u=()=>{let m=s;a.forEach(p=>{const b=p.replace(/^\{\{\s*/,"").replace(/\s*\}\}$/,"");m=m.replace(p,H(b,t)??"")}),S.textContent=m};a.forEach(m=>{K(m.replace(/^\{\{\s*/,"").replace(/\s*\}\}$/,""),o,u)}),u()}l++;continue}if(S.nodeType!==1){l++;continue}const n=S,f=n.tagName.toLowerCase();if(n.hasAttribute("cv-pre")){n.removeAttribute("cv-pre"),l++;continue}if(n.hasAttribute("cv-once")){n.removeAttribute("cv-once"),await oe(n,t,{...o,subscribe:()=>()=>{},storeSubscribeOverride:()=>()=>{}}),l++;continue}if(n.hasAttribute("cv-cloak")&&n.removeAttribute("cv-cloak"),n.hasAttribute("cv-teleport")){const i=n.getAttribute("cv-teleport");n.removeAttribute("cv-teleport");const a=document.querySelector(i)??document.body,s=document.createComment(`cv-teleport: ${i}`);n.replaceWith(s),await oe(n,t,o),a.appendChild(n),l++;continue}if(n.hasAttribute("cv-memo")){const i=n.getAttribute("cv-memo");n.removeAttribute("cv-memo");const a=()=>i.split(",").map(b=>H(b.trim(),t));let s=a();const u=[],m=b=>(u.push(b),()=>{const v=u.indexOf(b);v>-1&&u.splice(v,1)});await oe(n,t,{...o,subscribe:(b,v)=>m(v),storeSubscribeOverride:(b,v,k)=>m(k)});const p=K(i,o,()=>{const b=a();b.some((v,k)=>v!==s[k])&&(s=b,[...u].forEach(v=>v()))});(y=o.registerCleanup)==null||y.call(o,()=>p()),l++;continue}if(n.hasAttribute("cv-data")){const i=n.getAttribute("cv-data").trim();n.removeAttribute("cv-data");let a={},s={};if(i.startsWith("{")){const u=H(i,t)??{};Object.entries(u).forEach(([m,p])=>{typeof p=="function"?s[m]=p:a[m]=p})}else if(i){const u=(E=o.components)==null?void 0:E[i];if(u){const m=typeof u.data=="function"?u.data():u.data??{};m instanceof Promise||Object.assign(a,m),Object.assign(s,u.methods??{})}}if(o.createChildScope){const u=o.createChildScope(a,s);(x=o.registerCleanup)==null||x.call(o,u.cleanup),await oe(n,u.state,{...o,subscribe:u.subscribe})}else await oe(n,{...t,...a,...s},o);l++;continue}if(n.hasAttribute("cv-for")){const i=n.getAttribute("cv-for");n.removeAttribute("cv-for");const a=i.match(/^\(?(\w+)(?:,\s*(\w+))?\)?\s+in\s+(.+)$/);if(a){const[,s,u,m]=a,p=n.getAttribute(":key")??null;p&&n.removeAttribute(":key");const b=n.getAttribute("cv-transition")??null;b&&n.removeAttribute("cv-transition");const v=document.createComment(`cv-for: ${m}`);n.replaceWith(v);let k=[],P=[];const O=new Map,U=async()=>{var G;const N=H(m,t),R=N?typeof N=="number"?Array.from({length:N},(z,q)=>[q+1,q]):Array.isArray(N)?N.map((z,q)=>[z,q]):Object.entries(N).map(([z,q])=>[q,z]):[];if(p){const z=[],q=new Map,Q=new Set;for(const[Y,X]of R){const ae=H(p,Ne(t,Y,s,X,u));Q.has(ae)&&console.warn(`[courvux] cv-for: duplicate :key "${ae}" in "${m}"`),Q.add(ae),z.push(ae),q.set(ae,[Y,X])}const V=[];for(const[Y,{el:X,destroy:ae}]of O)q.has(Y)||(b?(X.classList.add(`${b}-leave`),V.push(ie(X).then(()=>{var re;X.classList.remove(`${b}-leave`),ae(),(re=X.parentNode)==null||re.removeChild(X),O.delete(Y)}))):(ae(),(G=X.parentNode)==null||G.removeChild(X),O.delete(Y)));V.length&&await Promise.all(V);const B=v.parentNode,te=[];for(const Y of z){const[X,ae]=q.get(Y);if(O.has(Y)){const re=O.get(Y);re.itemRef!==X&&(re.reactive[s]=X,re.itemRef=X),u&&(re.reactive[u]=ae)}else{const re=n.cloneNode(!0),Se=[],{subscribe:ht,createReactiveState:ft}=Pe(),Ee=ft({[s]:X,...u?{[u]:ae}:{}}),vt=new Proxy({},{has(se,ee){return!0},get(se,ee){return typeof ee!="string"?t[ee]:ee===s||u&&ee===u?Ee[ee]:t[ee]},set(se,ee,ce){return ee===s||u&&ee===u?(Ee[ee]=ce,!0):(t[ee]=ce,!0)}}),gt={...o,subscribe:(se,ee)=>{const ce=se.split(".")[0];let de;return ce===s||u&&ce===u?de=ht(ce,ee):de=o.subscribe(se,ee),Se.push(de),de},storeSubscribeOverride:(se,ee,ce)=>{const de=ve(se,ee,ce);return Se.push(de),de}},_e=document.createDocumentFragment();_e.appendChild(re),await oe(_e,vt,gt);const Te=_e.firstChild??re;b&&Te.classList.add(`${b}-enter`),O.set(Y,{el:Te,reactive:Ee,itemRef:X,destroy:()=>Se.forEach(se=>se())}),b&&te.push(Te)}}let J=v.nextSibling,pe=0;for(const Y of z){const{el:X}=O.get(Y);X!==J?pe++:J=X.nextSibling}if(pe>0)if(pe>z.length>>1){const Y=document.createDocumentFragment();for(const X of z)Y.appendChild(O.get(X).el);B.insertBefore(Y,v.nextSibling)}else{J=v.nextSibling;for(const Y of z){const{el:X}=O.get(Y);X!==J?B.insertBefore(X,J):J=X.nextSibling}}k=z.map(Y=>O.get(Y).el),te.length&&Promise.all(te.map(Y=>ie(Y).then(()=>Y.classList.remove(`${b}-enter`))))}else{if(P.forEach(V=>V()),P=[],k.forEach(V=>{var B;return(B=V.parentNode)==null?void 0:B.removeChild(V)}),k=[],!R.length)return;const z=v.parentNode,q=v.nextSibling,Q={...o,subscribe:(V,B)=>{const te=o.subscribe(V,B);return P.push(te),te},storeSubscribeOverride:(V,B,te)=>{const J=ve(V,B,te);return P.push(J),J}};for(const[V,B]of R){const te=n.cloneNode(!0),J=document.createDocumentFragment();J.appendChild(te),await oe(J,Ne(t,V,s,B,u),Q);const pe=J.firstChild??te;z.insertBefore(J,q),k.push(pe)}}};(L=o.registerCleanup)==null||L.call(o,()=>{O.forEach(({el:N,destroy:R})=>{var G;R(),(G=N.parentNode)==null||G.removeChild(N)}),O.clear(),P.forEach(N=>N()),k.forEach(N=>{var R;return(R=N.parentNode)==null?void 0:R.removeChild(N)}),k=[]}),K(m,o,U),await U()}l++;continue}if(n.hasAttribute("cv-if")){const i=[],a=n.getAttribute("cv-if");n.removeAttribute("cv-if");const s=document.createComment("cv-if");n.replaceWith(s),i.push({condition:a,template:n,anchor:s});let u=l+1;for(;u<c.length;){const k=c[u];if(k.nodeType===3&&(((C=k.textContent)==null?void 0:C.trim())??"")===""){u++;continue}if(k.nodeType!==1)break;const P=k;if(P.hasAttribute("cv-else-if")){const O=P.getAttribute("cv-else-if");P.removeAttribute("cv-else-if");const U=document.createComment("cv-else-if");P.replaceWith(U),i.push({condition:O,template:P,anchor:U}),u++;continue}if(P.hasAttribute("cv-else")){P.removeAttribute("cv-else");const O=document.createComment("cv-else");P.replaceWith(O),i.push({condition:null,template:P,anchor:O}),u++;break}break}l=u;let m=null,p=!1,b=!1;const v=async()=>{var k,P;if(p){b=!0;return}p=!0;try{do{b=!1,m&&((k=m.parentNode)==null||k.removeChild(m),m=null);for(const O of i)if(O.condition===null||H(O.condition,t)){const U=O.template.cloneNode(!0),N=document.createDocumentFragment();N.appendChild(U),await oe(N,t,o);const R=N.firstChild??U;(P=O.anchor.parentNode)==null||P.insertBefore(N,O.anchor.nextSibling),m=R;break}}while(b)}finally{p=!1}};i.filter(k=>k.condition).forEach(k=>{K(k.condition,o,v)}),await v();continue}if(n.hasAttribute("cv-show")){const i=n.getAttribute("cv-show");n.removeAttribute("cv-show");const a=Array.from(n.attributes).filter(s=>s.name==="cv-transition"||s.name.startsWith("cv-transition:")||s.name.startsWith("cv-transition."));if(a.length>0){const s=R=>(n.getAttribute(R)??"").split(" ").filter(Boolean),u=s("cv-transition:enter"),m=s("cv-transition:enter-start"),p=s("cv-transition:enter-end"),b=s("cv-transition:leave"),v=s("cv-transition:leave-start"),k=s("cv-transition:leave-end"),P=n.getAttribute("cv-transition")??"",O=new Set(P.split(".").slice(1)),U=[...O].find(R=>/^\d+$/.test(R)),N=U?parseInt(U):200;if(u.length||m.length||b.length||v.length){a.forEach(V=>n.removeAttribute(V.name));const R=()=>new Promise(V=>requestAnimationFrame(()=>requestAnimationFrame(()=>V())));let G=!!H(i,t),z=!1,q=null;const Q=async V=>{if(z){q=V;return}z=!0;try{V?(n.style.display="",n.classList.add(...u,...m),await R(),n.classList.remove(...m),n.classList.add(...p),await ie(n),n.classList.remove(...u,...p)):(n.classList.add(...b,...v),await R(),n.classList.remove(...v),n.classList.add(...k),await ie(n),n.classList.remove(...b,...k),n.style.display="none"),G=V}finally{if(z=!1,q!==null&&q!==G){const B=q;q=null,Q(B)}else q=null}};G||(n.style.display="none"),K(i,o,()=>{const V=!!H(i,t);V!==G&&Q(V)})}else{const R=[...O].find(B=>B==="scale"||/^scale$/.test(B)),G=(()=>{const B=[...O].find(te=>/^\d+$/.test(te)&&te!==U);return B?parseInt(B)/100:.9})(),z=[];(!O.has("scale")||O.has("opacity"))&&z.push(`opacity ${N}ms ease`),R&&z.push(`transform ${N}ms ease`),z.length||z.push(`opacity ${N}ms ease`),n.style.transition=(n.style.transition?n.style.transition+", ":"")+z.join(", "),a.forEach(B=>n.removeAttribute(B.name));let q=!!H(i,t);const Q=()=>new Promise(B=>requestAnimationFrame(()=>requestAnimationFrame(()=>B()))),V=async B=>{B?(n.style.display="",n.style.opacity="0",R&&(n.style.transform=`scale(${G})`),await Q(),n.style.opacity="",R&&(n.style.transform=""),await ie(n)):(n.style.opacity="0",R&&(n.style.transform=`scale(${G})`),await ie(n),n.style.display="none",n.style.opacity="",R&&(n.style.transform="")),q=B};q||(n.style.display="none"),K(i,o,()=>{const B=!!H(i,t);B!==q&&V(B)})}}else{const s=n.getAttribute("cv-show-transition"),u=n.getAttribute(":transition");s&&n.removeAttribute("cv-show-transition"),u&&n.removeAttribute(":transition");const m=s??(u?String(H(u,t)):null);if(m){Be();let p=!!H(i,t);p||(n.style.display="none");let b=!1,v=null;const k=async P=>{if(b){v=P;return}b=!0;try{P?(n.style.display="",n.classList.add(`${m}-enter`),await ie(n),n.classList.remove(`${m}-enter`)):(n.classList.add(`${m}-leave`),await ie(n),n.classList.remove(`${m}-leave`),n.style.display="none"),p=P}finally{if(b=!1,v!==null&&v!==p){const O=v;v=null,k(O)}else v=null}};K(i,o,()=>{const P=!!H(i,t);P!==p&&k(P)})}else{const p=()=>{n.style.display=H(i,t)?"":"none"};K(i,o,p),p()}}}if(n.hasAttribute("cv-focus")){const i=n.getAttribute("cv-focus")??"";if(n.removeAttribute("cv-focus"),!i)Promise.resolve().then(()=>n.focus());else{const a=()=>{H(i,t)&&Promise.resolve().then(()=>n.focus())};K(i,o,a),a()}}{const i=Array.from(n.attributes).filter(a=>a.name==="cv-intersect"||a.name.startsWith("cv-intersect:")||a.name.startsWith("cv-intersect."));if(i.length&&typeof IntersectionObserver<"u"){const a=i.find(R=>R.name==="cv-intersect"||R.name==="cv-intersect:enter"||R.name.startsWith("cv-intersect.")),s=i.find(R=>R.name==="cv-intersect:leave"),u=(a==null?void 0:a.value)??"",m=(s==null?void 0:s.value)??"",p=((a==null?void 0:a.name)??"cv-intersect").split("."),b=new Set(p.slice(1)),v=b.has("once");let k=0;if(b.has("half"))k=.5;else if(b.has("full"))k=1;else{const R=[...b].find(G=>G.startsWith("threshold-"));R&&(k=parseInt(R.replace("threshold-",""))/100)}const P=[...b].find(R=>R.startsWith("margin-")),O=P?`${P.replace("margin-","")}px`:void 0;i.forEach(R=>n.removeAttribute(R.name));const U=R=>{if(R)try{new Function("$data",`with($data){${R}}`)(t)}catch(G){console.warn(`[courvux] cv-intersect error "${R}":`,G)}},N=new IntersectionObserver(R=>{R.forEach(G=>{G.isIntersecting?(U(u),v&&N.disconnect()):U(m)})},{threshold:k,...O?{rootMargin:O}:{}});N.observe(n),(w=o.registerCleanup)==null||w.call(o,()=>N.disconnect())}}{const i=Array.from(n.attributes).find(a=>a.name==="cv-html"||a.name.startsWith("cv-html."));if(i){const a=i.value;n.removeAttribute(i.name);const s=i.name.split(".").slice(1).includes("sanitize"),u=()=>{const m=String(H(a,t)??"");n.innerHTML=s?wt(m):m};K(a,o,u),u(),l++;continue}}if(n.hasAttribute("cv-ref")&&!((W=o.components)!=null&&W[f])){const i=n.getAttribute("cv-ref");n.removeAttribute("cv-ref"),o.refs&&(o.refs[i]=n)}const g=!!(($=o.components)!=null&&$[f]),_=Array.from(n.attributes).find(i=>i.name==="cv-model"||i.name.startsWith("cv-model."));if(_&&!g){const i=_.value;n.removeAttribute(_.name);const a=new Set(_.name.split(".").slice(1)),s=n,u=(M=s.type)==null?void 0:M.toLowerCase(),m=p=>{if(a.has("number")){const b=parseFloat(p);return isNaN(b)?p:b}return a.has("trim")?p.trim():p};if(u==="checkbox"){const p=()=>{const b=H(i,t);s.checked=Array.isArray(b)?b.includes(s.value):!!b};ue(i,o,p),p(),s.addEventListener("change",()=>{const b=H(i,t);if(Array.isArray(b)){const v=[...b];if(s.checked)v.includes(s.value)||v.push(s.value);else{const k=v.indexOf(s.value);k>-1&&v.splice(k,1)}le(i,t,v)}else le(i,t,s.checked)})}else if(u==="radio"){const p=()=>{s.checked=H(i,t)===s.value};ue(i,o,p),p(),s.addEventListener("change",()=>{s.checked&&le(i,t,m(s.value))})}else if(n.hasAttribute("contenteditable")){const p=n,b=()=>{const v=String(H(i,t)??"");p.innerText!==v&&(p.innerText=v)};if(ue(i,o,b),b(),a.has("debounce")){const v=[...a].find(O=>/^\d+$/.test(O)),k=v?parseInt(v):300;let P;p.addEventListener("input",()=>{clearTimeout(P),P=setTimeout(()=>le(i,t,m(p.innerText)),k)})}else{const v=a.has("lazy")?"blur":"input";p.addEventListener(v,()=>le(i,t,m(p.innerText)))}}else{const p=()=>{s.value=H(i,t)??""};if(ue(i,o,p),p(),a.has("debounce")){const b=[...a].find(P=>/^\d+$/.test(P)),v=b?parseInt(b):300;let k;s.addEventListener("input",()=>{clearTimeout(k),k=setTimeout(()=>le(i,t,m(s.value)),v)})}else{const b=f==="select"||a.has("lazy")?"change":"input";s.addEventListener(b,()=>le(i,t,m(s.value)))}}}if(o.directives&&Array.from(n.attributes).forEach(i=>{var U,N;if(!i.name.startsWith("cv-"))return;const a=i.name.slice(3).split("."),s=a[0],u=a.slice(1),m=s.indexOf(":"),p=m>=0?s.slice(0,m):s,b=m>=0?s.slice(m+1):void 0,v=o.directives[p];if(!v)return;const k=i.value;n.removeAttribute(i.name);const P=typeof v=="function"?{onMount:v}:v,O={value:k?H(k,t):void 0,arg:b,modifiers:Object.fromEntries(u.map(R=>[R,!0]))};(U=P.onMount)==null||U.call(P,n,O),P.onUpdate&&k&&K(k,o,()=>{O.value=H(k,t),P.onUpdate(n,O)}),P.onDestroy&&((N=o.registerCleanup)==null||N.call(o,()=>P.onDestroy(n,O)))}),f==="slot"){const i=n.getAttribute("name")??"default",a=(D=o.slots)==null?void 0:D[i];if(a){const s={};Array.from(n.attributes).forEach(p=>{p.name.startsWith(":")&&(s[p.name.slice(1)]=H(p.value,t))});const u=await a(s),m=document.createDocumentFragment();u.forEach(p=>m.appendChild(p)),n.replaceWith(m)}else{const s=document.createDocumentFragment();for(;n.firstChild;)s.appendChild(n.firstChild);await oe(s,t,o),n.replaceWith(s)}l++;continue}if(f==="cv-transition"){Be();const i=n.getAttribute("name")??"fade",a=n.getAttribute(":show")??null;n.removeAttribute("name"),a&&n.removeAttribute(":show");const s=document.createElement("div");for(s.className="cv-t-wrap";n.firstChild;)s.appendChild(n.firstChild);if(n.replaceWith(s),await oe(s,t,o),a){let u=!!H(a,t),m=!1,p=null;u||(s.style.display="none");const b=async v=>{if(m){p=v;return}m=!0;try{v?(s.style.display="",s.classList.add(`${i}-enter`),await ie(s),s.classList.remove(`${i}-enter`)):(s.classList.add(`${i}-leave`),await ie(s),s.classList.remove(`${i}-leave`),s.style.display="none"),u=v}finally{if(m=!1,p!==null&&p!==u){const k=p;p=null,b(k)}else p=null}};K(a,o,()=>{const v=!!H(a,t);v!==u&&b(v)})}l++;continue}if(f==="router-view"&&o.mountRouterView){const i=n.getAttribute("name")??void 0;n.setAttribute("aria-live","polite"),n.setAttribute("aria-atomic","true"),await o.mountRouterView(n,i),l++;continue}if(f==="router-link"){const i=n.getAttribute(":to"),a=n.getAttribute("to"),s=()=>i?String(H(i,t)??"/"):a||"/",u=document.createElement("a");u.innerHTML=n.innerHTML,Array.from(n.attributes).forEach(k=>{k.name!=="to"&&k.name!==":to"&&u.setAttribute(k.name,k.value)});const m=((F=o.router)==null?void 0:F.base)??"",p=k=>m?k===m?"/":k.startsWith(m+"/")?k.slice(m.length)||"/":k||"/":k||"/",b=()=>{var k;return((k=o.router)==null?void 0:k.mode)==="history"?p(window.location.pathname):window.location.hash.slice(1)||"/"},v=()=>{var O;const k=s(),P=b()===k;((O=o.router)==null?void 0:O.mode)==="history"?u.href=`${m}${k}`:u.href=`#${k}`,P?(u.setAttribute("aria-current","page"),u.classList.add("active")):(u.removeAttribute("aria-current"),u.classList.remove("active"))};((I=o.router)==null?void 0:I.mode)==="history"?(u.addEventListener("click",k=>{k.preventDefault(),o.router.navigate(s())}),window.addEventListener("popstate",v)):window.addEventListener("hashchange",v),i&&ue(i,o,v),v(),n.replaceWith(u),await oe(u,t,o),l++;continue}if(f==="component"&&n.hasAttribute(":is")&&o.mountDynamic){const i=n.getAttribute(":is");n.removeAttribute(":is");const a=document.createComment("component:is");n.replaceWith(a),await o.mountDynamic(a,i,n,t,o),l++;continue}if((T=o.components)!=null&&T[f]&&o.mountElement){await o.mountElement(n,f,t,o),l++;continue}{const i=Array.from(n.attributes).find(a=>a.name==="cv-intersect"||a.name.startsWith("cv-intersect."));if(i&&typeof IntersectionObserver<"u"){const a=new Set(i.name.split(".").slice(1));n.removeAttribute(i.name);const s=H(i.value,t);let u,m=0,p="0px",b=a.has("once");if(typeof s=="function"?u=v=>s.call(t,v):s&&typeof s=="object"&&(typeof s.handler=="function"&&(u=v=>s.handler.call(t,v)),s.threshold!==void 0&&(m=s.threshold),s.margin&&(p=s.margin),s.once&&(b=!0)),u){const v=new IntersectionObserver(k=>{const P=k[0];u(P),b&&P.isIntersecting&&v.disconnect()},{threshold:m,rootMargin:p});v.observe(n),(d=o.registerCleanup)==null||d.call(o,()=>v.disconnect())}}}if(n.hasAttribute("cv-resize")){const i=n.getAttribute("cv-resize");if(n.removeAttribute("cv-resize"),typeof ResizeObserver<"u"){const a=H(i,t);let s,u="content-box";if(typeof a=="function"?s=m=>a.call(t,m):a&&typeof a=="object"&&(typeof a.handler=="function"&&(s=m=>a.handler.call(t,m)),a.box&&(u=a.box)),s){const m=new ResizeObserver(p=>{p[0]&&s(p[0])});m.observe(n,{box:u}),(r=o.registerCleanup)==null||r.call(o,()=>m.disconnect())}}}if(n.hasAttribute("cv-scroll")){const i=n.getAttribute("cv-scroll");n.removeAttribute("cv-scroll");const a=H(i,t);let s,u=0;if(typeof a=="function"?s=m=>a.call(t,m):a&&typeof a=="object"&&(typeof a.handler=="function"&&(s=m=>a.handler.call(t,m)),a.throttle&&(u=a.throttle)),s){let m=0;const p=()=>{const b=Date.now();u>0&&b-m<u||(m=b,s({scrollTop:n.scrollTop,scrollLeft:n.scrollLeft,scrollHeight:n.scrollHeight,scrollWidth:n.scrollWidth,clientHeight:n.clientHeight,clientWidth:n.clientWidth}))};n.addEventListener("scroll",p,{passive:!0}),(h=o.registerCleanup)==null||h.call(o,()=>n.removeEventListener("scroll",p))}}if(n.hasAttribute("cv-clickoutside")){const i=n.getAttribute("cv-clickoutside");n.removeAttribute("cv-clickoutside");const a=s=>{n.contains(s.target)||(typeof t[i]=="function"?t[i].call(t,s):We(i,t,s))};document.addEventListener("click",a,!0),(A=o.registerCleanup)==null||A.call(o,()=>document.removeEventListener("click",a,!0))}if(n.hasAttribute("cv-bind")){const i=n.getAttribute("cv-bind");n.removeAttribute("cv-bind");const a=n.getAttribute("class")??"",s=n.getAttribute("style")??"";let u=[];const m=()=>{const p=H(i,t)??{},b=Object.keys(p);for(const v of u)v in p||(v==="class"?n.className=a:v==="style"?n.style.cssText=s:n.removeAttribute(v));for(const[v,k]of Object.entries(p))v==="class"?n.className=[a,De(k)].filter(Boolean).join(" "):v==="style"?He(n,k,s):k==null||k===!1?n.removeAttribute(v):n.setAttribute(v,k===!0?"":String(k));u=b};K(i,o,m),m()}const j={enter:"Enter",esc:"Escape",escape:"Escape",space:" ",tab:"Tab",delete:"Delete",backspace:"Backspace",up:"ArrowUp",down:"ArrowDown",left:"ArrowLeft",right:"ArrowRight"};Array.from(n.attributes).forEach(i=>{if(i.name.startsWith("@")||i.name.startsWith("cv:on:")){const a=(i.name.startsWith("@")?i.name.substring(1):i.name.substring(6)).split("."),s=a[0],u=new Set(a.slice(1)),m=[...u].find(k=>k in j),p=i.value,b=k=>{u.has("prevent")&&k.preventDefault(),u.has("stop")&&k.stopPropagation(),!(u.has("self")&&k.target!==k.currentTarget)&&(m&&k.key!==j[m]||(typeof t[p]=="function"?t[p].call(t,k):We(p,t,k)))},v={};u.has("once")&&(v.once=!0),u.has("passive")&&(v.passive=!0),u.has("capture")&&(v.capture=!0),n.addEventListener(s,b,Object.keys(v).length?v:void 0)}else if(i.name.startsWith(":")){const a=i.name.slice(1),s=i.value;if(a==="class"){const u=n.getAttribute("class")??"",m=()=>{n.className=[u,De(H(s,t))].filter(Boolean).join(" ")};K(s,o,m),m()}else if(a==="style"){const u=n.getAttribute("style")??"",m=()=>He(n,H(s,t),u);K(s,o,m),m()}else if(a.includes("-")){const u=()=>{const m=H(s,t);m==null||m===!1?n.removeAttribute(a):n.setAttribute(a,m===!0?"":String(m))};K(s,o,u),u()}else{const u=()=>{n[a]=H(s,t)??""};K(s,o,u),u()}}}),S.hasChildNodes()&&await oe(S,t,o),l++}}var At=`
router-view.fade-leave{animation:cv-fade-out 0.25s forwards}
router-view.fade-enter{animation:cv-fade-in 0.25s forwards}
router-view.slide-up-leave{animation:cv-slide-up-out 0.25s forwards}
router-view.slide-up-enter{animation:cv-slide-up-in 0.25s forwards}
@keyframes cv-fade-out{to{opacity:0}}
@keyframes cv-fade-in{from{opacity:0}}
@keyframes cv-slide-up-out{to{opacity:0;transform:translateY(-12px)}}
@keyframes cv-slide-up-in{from{opacity:0;transform:translateY(12px)}}
`;function St(){if(document.getElementById("cv-transitions"))return;const e=document.createElement("style");e.id="cv-transitions",e.textContent=At,document.head.appendChild(e)}async function ge(e,t,o){e.classList.add(`${t}-${o}`);const c=getComputedStyle(e),l=Math.max(parseFloat(c.animationDuration)||0,parseFloat(c.transitionDuration)||0)*1e3;l>0&&await new Promise(y=>{const E=()=>y();e.addEventListener("animationend",E,{once:!0}),e.addEventListener("transitionend",E,{once:!0}),setTimeout(E,l+50)}),e.classList.remove(`${t}-${o}`)}var ke=new Map;async function Et(e){if(typeof e!="function")return e;if(ke.has(e))return ke.get(e);const t=await e();return ke.set(e,t.default),t.default}function Ve(e,t){if(e.components)return e.components[t];if(t==="default")return e.component}function Ge(e,t){if(e==="*")return{};const o=[],c=e.replace(/:(\w+)/g,(y,E)=>(o.push(E),"([^/]+)")),l=t.match(new RegExp(`^${c}$`));return l?Object.fromEntries(o.map((y,E)=>[y,l[E+1]])):null}function _t(e,t){if(e==="/")return{params:{},remaining:t};const o=[],c=e.replace(/:(\w+)/g,(y,E)=>(o.push(E),"([^/]+)")),l=t.match(new RegExp(`^${c}(/.+)?$`));return l?{params:Object.fromEntries(o.map((y,E)=>[y,l[E+1]])),remaining:l[o.length+1]||"/"}:null}function ut(e,t=""){return e.map(o=>{var l;if(o.path==="*")return o;const c=((t.endsWith("/")?t.slice(0,-1):t)+o.path).replace(/\/+/g,"/")||"/";return(l=o.children)!=null&&l.length?{...o,path:c,children:ut(o.children,c==="/"?"":c)}:{...o,path:c}})}var me=(e,t)=>new Promise(o=>e(t,o)),Xe=(e,t)=>e!=null&&e.beforeLeave?new Promise(o=>e.beforeLeave(t,o)):Promise.resolve(void 0);function Tt(e,t={}){const o=t.mode??"hash",c=$t(t.base??"");return{routes:ut(e),mode:o,base:c,transition:t.transition,beforeEach:t.beforeEach,afterEach:t.afterEach,scrollBehavior:t.scrollBehavior,navigate(l,y){const E=Ye(l,y==null?void 0:y.query);o==="history"?(history.pushState({},"",`${c}${E}`),window.dispatchEvent(new PopStateEvent("popstate"))):window.location.hash=E},replace(l,y){const E=Ye(l,y==null?void 0:y.query);if(o==="history")history.replaceState({},"",`${c}${E}`),window.dispatchEvent(new PopStateEvent("popstate"));else{const x=window.location.href.split("#")[0];window.location.replace(`${x}#${E}`)}},back(){history.back()},forward(){history.forward()}}}function $t(e){if(!e||e==="/")return"";let t=e.startsWith("/")?e:`/${e}`;return t.endsWith("/")&&(t=t.slice(0,-1)),t}function Ct(e,t){return t?e===t?"/":e.startsWith(t+"/")?e.slice(t.length)||"/":e||"/":e||"/"}function Ye(e,t){return!t||!Object.keys(t).length?e:`${e}?${new URLSearchParams(t).toString()}`}function Ze(e){if(!e)return{};const t=new URLSearchParams(e.startsWith("?")?e.slice(1):e),o={};return t.forEach((c,l)=>{o[l]=c}),o}function Je(e,t,o,c="default",l){const y=t.base??"",E=()=>t.mode==="history"?Ct(window.location.pathname,y):(window.location.hash.slice(1)||"/").split("?")[0]||"/",x=()=>{if(t.mode==="history")return Ze(window.location.search);const r=window.location.hash.slice(1)||"/",h=r.indexOf("?");return h>=0?Ze(r.slice(h+1)):{}};t.transition&&St();let L=null,C=null,w=null,W=null,$=!1;const M=()=>{$||($=!0,l==null||l())},D=new Map,F=r=>{var h;if(r!=null&&r.keepAlive&&w){(h=w.deactivate)==null||h.call(w);const A=document.createDocumentFragment();for(;e.firstChild;)A.appendChild(e.firstChild);D.set(L.path,{fragment:A,activation:w}),w=null}else w==null||w.destroy(),w=null,e.innerHTML=""},I=async(r,h,A,S,n)=>{const f=typeof h=="function"&&!ke.has(h),g=f?h.__asyncOptions:void 0,_=r.loadingTemplate??(g==null?void 0:g.loadingTemplate);f&&_&&(e.innerHTML=_);let j;try{j=await Et(h)}catch(i){const a=g==null?void 0:g.errorTemplate;if(a)return e.innerHTML=a,{destroy:()=>{e.innerHTML=""}};throw i}return f&&_&&(e.innerHTML=""),o(e,j,A,S,n)},T=async()=>{var A,S,n,f,g,_,j,i;const r=E(),h=x();for(const a of t.routes){if((A=a.children)!=null&&A.length){const u=_t(a.path,r);if(u!==null)for(const m of a.children){const p=Ge(m.path,r);if(p!==null){const b={params:u.params,query:h,path:r,meta:a.meta};if(m.redirect){const O={params:p,query:h,path:r,meta:m.meta},U=typeof m.redirect=="function"?m.redirect(O):m.redirect;t.navigate(U);return}if(t.beforeEach){const O=await me(t.beforeEach,b);if(O){t.navigate(O);return}}if(a.beforeEnter){const O=await me(a.beforeEnter,b);if(O){t.navigate(O);return}}if(m.beforeEnter){const O={params:p,query:h,path:r,meta:m.meta},U=await me(m.beforeEnter,O);if(U){t.navigate(U);return}}const v=`${a.path}::${JSON.stringify(u.params)}`;if(W!==v){const O=await Xe(w,b);if(O){t.navigate(O);return}const U=a.transition??t.transition;U&&e.hasChildNodes()&&await ge(e,U,"leave"),F(C);const N=Ve(a,c);if(N){const R={routes:a.children,mode:t.mode,base:t.base,transition:a.transition??t.transition,beforeEach:t.beforeEach,afterEach:t.afterEach,scrollBehavior:t.scrollBehavior,navigate:(G,z)=>t.navigate(G,z),replace:(G,z)=>t.replace(G,z),back:()=>t.back(),forward:()=>t.forward()};w=await I(a,N,b,c==="default"?a.layout:void 0,c==="default"?R:void 0),(S=w.enter)==null||S.call(w,L)}else e.innerHTML="";W=v,U&&await ge(e,U,"enter")}const k={params:{...u.params,...p},query:h,path:r,meta:m.meta??a.meta};(n=t.afterEach)==null||n.call(t,k,L);const P=(f=t.scrollBehavior)==null?void 0:f.call(t,k,L);P&&window.scrollTo(P.x??0,P.y??0),L=k,C=a,M();return}}}const s=Ge(a.path,r);if(s!==null){W=null;const u={params:s,query:h,path:r,meta:a.meta};if(a.redirect){const k=typeof a.redirect=="function"?a.redirect(u):a.redirect;t.navigate(k);return}if(t.beforeEach){const k=await me(t.beforeEach,u);if(k){t.navigate(k);return}}if(a.beforeEnter){const k=await me(a.beforeEnter,u);if(k){t.navigate(k);return}}const m=await Xe(w,u);if(m){t.navigate(m);return}const p=a.transition??t.transition;p&&e.hasChildNodes()&&await ge(e,p,"leave"),F(C);const b=Ve(a,c);if(b){const k=u.path;if(a.keepAlive&&D.has(k)){const P=D.get(k);e.appendChild(P.fragment),w=P.activation,(g=w.activate)==null||g.call(w),D.delete(k)}else{const P=L;w=await I(a,b,u,c==="default"?a.layout:void 0),(_=w.enter)==null||_.call(w,P)}}else e.innerHTML="",w=null;p&&await ge(e,p,"enter"),(j=t.afterEach)==null||j.call(t,u,L);const v=(i=t.scrollBehavior)==null?void 0:i.call(t,u,L);v&&window.scrollTo(v.x??0,v.y??0),L=u,C=a,M();return}}W=null,F(C),C=null,M()},d=t.mode==="history"?"popstate":"hashchange";return window.addEventListener(d,T),T(),()=>{window.removeEventListener(d,T),w==null||w.destroy(),w=null,D.forEach(({activation:r})=>r.destroy()),D.clear()}}function Ft(){if(typeof window>"u")return null;if(window.__COURVUX_DEVTOOLS__)return window.__COURVUX_DEVTOOLS__;const e=new Map,t={instances:[],stores:[],on(o,c){return e.has(o)||e.set(o,new Set),e.get(o).add(c),()=>{var l;return(l=e.get(o))==null?void 0:l.delete(c)}},_emit(o,c){var l;(l=e.get(o))==null||l.forEach(y=>{try{y(c)}catch{}})},_registerInstance(o){this.instances.push(o),this._emit("mount",o)},_unregisterInstance(o){const c=this.instances.findIndex(l=>l.id===o);if(c!==-1){const l=this.instances[c];this.instances.splice(c,1),this._emit("destroy",l)}},_registerStore(o){this.stores.push(o),o.subscribe(()=>this._emit("store-update",o))}};return window.__COURVUX_DEVTOOLS__=t,t}var Ot=0;function jt(){return++Ot}var Lt=`
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
`;function Pt(){if(document.getElementById("cvd-styles"))return;const e=document.createElement("style");e.id="cvd-styles",e.textContent=Lt,document.head.appendChild(e)}function be(e){return e===null?"null":e===void 0?"undefined":typeof e=="string"?`"${e}"`:typeof e=="object"?JSON.stringify(e):String(e)}function Ke(e){try{return JSON.parse(e)}catch{return e}}function Dt(e){if(typeof document>"u")return;Pt();const t=document.createElement("div");t.id="cvd",document.body.appendChild(t);let o=!1,c="components",l=new Set;const y=document.createElement("div");y.id="cvd-badge",y.innerHTML='<span class="cvd-badge-dot"></span>COURVUX',t.appendChild(y);const E=document.createElement("div");E.id="cvd-panel",E.style.display="none",t.appendChild(E),E.innerHTML=`
        <div id="cvd-head">
            <span id="cvd-title">⚡ COURVUX DEVTOOLS</span>
            <div id="cvd-tabs">
                <button class="cvd-tab active" data-tab="components">Components</button>
                <button class="cvd-tab" data-tab="store">Store</button>
            </div>
            <button id="cvd-close">✕</button>
        </div>
        <div id="cvd-body"></div>
    `;const x=E.querySelector("#cvd-body");y.addEventListener("click",()=>{o=!0,y.style.display="none",E.style.display="flex",W()}),E.querySelector("#cvd-close").addEventListener("click",()=>{o=!1,E.style.display="none",y.style.display=""}),E.querySelectorAll(".cvd-tab").forEach($=>{$.addEventListener("click",()=>{c=$.dataset.tab,E.querySelectorAll(".cvd-tab").forEach(M=>M.classList.remove("active")),$.classList.add("active"),W()})});const L=E.querySelector("#cvd-head");L.addEventListener("pointerdown",$=>{if($.target.closest("button"))return;L.setPointerCapture($.pointerId);const M=$.clientX,D=$.clientY,F=t.offsetLeft,I=t.offsetTop,T=r=>{t.style.right="auto",t.style.bottom="auto",t.style.left=`${F+(r.clientX-M)}px`,t.style.top=`${I+(r.clientY-D)}px`},d=r=>{L.releasePointerCapture(r.pointerId),L.removeEventListener("pointermove",T),L.removeEventListener("pointerup",d),L.removeEventListener("pointercancel",d)};L.addEventListener("pointermove",T),L.addEventListener("pointerup",d),L.addEventListener("pointercancel",d)});function C(){const $=e.instances;if(!$.length){x.innerHTML='<div class="cvd-empty">No hay componentes montados</div>';return}x.innerHTML=$.map(M=>{const D=M.getState(),F=Object.keys(D);return`
                <div class="cvd-inst${l.has(M.id)?" open":""}" data-id="${M.id}">
                    <div class="cvd-inst-head">
                        <span class="cvd-arrow">▶</span>
                        <span class="cvd-inst-name">&lt;${M.name}&gt;</span>
                        <span class="cvd-count">${F.length} keys</span>
                        <span class="cvd-inst-id">#${M.id}</span>
                    </div>
                    <div class="cvd-kv">
                        ${F.length?F.map(I=>`
                            <div class="cvd-row">
                                <span class="cvd-key">${I}</span>
                                <span class="cvd-val" data-inst="${M.id}" data-key="${I}" title="click to edit">${be(D[I])}</span>
                            </div>
                        `).join(""):'<span style="color:#555">— sin datos reactivos —</span>'}
                    </div>
                </div>
            `}).join(""),x.querySelectorAll(".cvd-inst-head").forEach(M=>{M.addEventListener("click",()=>{const D=M.closest(".cvd-inst"),F=parseInt(D.dataset.id);l.has(F)?l.delete(F):l.add(F),D.classList.toggle("open")})}),x.querySelectorAll(".cvd-val").forEach(M=>{M.addEventListener("click",D=>{D.stopPropagation();const F=M;if(F.querySelector("input"))return;const I=parseInt(F.dataset.inst),T=F.dataset.key,d=e.instances.find(S=>S.id===I);if(!d)return;const r=be(d.getState()[T]);F.classList.add("editing"),F.innerHTML=`<input class="cvd-edit" value='${r.replace(/'/g,"&#39;")}'>`;const h=F.querySelector("input");h.focus(),h.select();const A=()=>{d.setState(T,Ke(h.value)),F.classList.remove("editing")};h.addEventListener("blur",A),h.addEventListener("keydown",S=>{S.key==="Enter"&&(S.preventDefault(),A()),S.key==="Escape"&&(F.classList.remove("editing"),W())})})})}function w(){if(!e.stores.length){x.innerHTML='<div class="cvd-empty">No hay store registrado</div>';return}x.innerHTML=e.stores.map(($,M)=>{const D=$.getState(),F=Object.keys(D);return`
                <div class="cvd-inst open" data-store="${M}">
                    <div class="cvd-inst-head">
                        <span class="cvd-arrow" style="transform:rotate(90deg)">▶</span>
                        <span class="cvd-inst-name" style="color:#ffcb6b">Store</span>
                        <span class="cvd-count">${F.length} keys</span>
                    </div>
                    <div class="cvd-kv">
                        ${F.map(I=>`
                            <div class="cvd-row">
                                <span class="cvd-key cvd-store-key">${I}</span>
                                <span class="cvd-val" data-store="${M}" data-key="${I}" title="click to edit">${be(D[I])}</span>
                            </div>
                        `).join("")}
                    </div>
                </div>
            `}).join(""),x.querySelectorAll(".cvd-inst-head").forEach($=>{$.addEventListener("click",()=>$.closest(".cvd-inst").classList.toggle("open"))}),x.querySelectorAll("[data-store][data-key]").forEach($=>{$.addEventListener("click",M=>{M.stopPropagation();const D=$;if(D.querySelector("input"))return;const F=parseInt(D.dataset.store),I=D.dataset.key,T=e.stores[F];if(!T)return;const d=be(T.getState()[I]);D.classList.add("editing"),D.innerHTML=`<input class="cvd-edit" value='${d.replace(/'/g,"&#39;")}'>`;const r=D.querySelector("input");r.focus(),r.select();const h=()=>{T.setState(I,Ke(r.value)),D.classList.remove("editing")};r.addEventListener("blur",h),r.addEventListener("keydown",A=>{A.key==="Enter"&&(A.preventDefault(),h()),A.key==="Escape"&&(D.classList.remove("editing"),W())})})})}function W(){o&&(c==="components"?C():w())}e.on("mount",()=>W()),e.on("update",()=>W()),e.on("destroy",()=>W()),e.on("store-update",()=>W())}var Mt="__COURVUX_HEAD_COLLECTOR__";function It(){return globalThis[Mt]??null}var Rt=(e,t)=>{Object.entries(t).forEach(([o,c])=>{o!=="innerHTML"&&(c==null||c===!1||e.setAttribute(o,c===!0?"":String(c)))})},zt=e=>{const t={};return Array.from(e.attributes).forEach(o=>{t[o.name]=o.value}),t},Nt=(e,t)=>{Array.from(e.attributes).forEach(o=>e.removeAttribute(o.name)),Object.entries(t).forEach(([o,c])=>e.setAttribute(o,c))},Qe=(e,t,o,c)=>{let l=o?document.head.querySelector(o):null;l?(c.push({el:l,prevAttrs:zt(l),created:!1}),Array.from(l.attributes).forEach(y=>l.removeAttribute(y.name))):(l=document.createElement(e),document.head.appendChild(l),c.push({el:l,created:!0})),Rt(l,t)};function Ht(e){var E,x,L;const t=It();if(t!==null)return t.push(e),()=>{};if(typeof document>"u")return()=>{};const o=[];let c;const l={},y={};if(e.title!==void 0){c=document.title;const C=e.titleTemplate,w=typeof C=="function"?C(e.title):typeof C=="string"?C.replace("%s",e.title):e.title;document.title=w}return(E=e.meta)==null||E.forEach(C=>{Qe("meta",C,C.name?`meta[name="${CSS.escape(C.name)}"]`:C.property?`meta[property="${CSS.escape(C.property)}"]`:C["http-equiv"]?`meta[http-equiv="${CSS.escape(C["http-equiv"])}"]`:null,o)}),(x=e.link)==null||x.forEach(C=>{Qe("link",C,C.rel==="canonical"?'link[rel="canonical"]':C.rel&&C.href?`link[rel="${CSS.escape(C.rel)}"][href="${CSS.escape(C.href)}"]`:null,o)}),(L=e.script)==null||L.forEach(C=>{const w=document.createElement("script");Object.entries(C).forEach(([W,$])=>{W==="innerHTML"?w.textContent=String($):$!=null&&$!==!1&&w.setAttribute(W,$===!0?"":String($))}),document.head.appendChild(w),o.push({el:w,created:!0})}),e.htmlAttrs&&Object.entries(e.htmlAttrs).forEach(([C,w])=>{l[C]=document.documentElement.getAttribute(C),document.documentElement.setAttribute(C,w)}),e.bodyAttrs&&Object.entries(e.bodyAttrs).forEach(([C,w])=>{y[C]=document.body.getAttribute(C),document.body.setAttribute(C,w)}),function(){c!==void 0&&(document.title=c),o.forEach(({el:C,prevAttrs:w,created:W})=>{var $;W?($=C.parentNode)==null||$.removeChild(C):w&&Nt(C,w)}),Object.entries(l).forEach(([C,w])=>{w===null?document.documentElement.removeAttribute(C):document.documentElement.setAttribute(C,w)}),Object.entries(y).forEach(([C,w])=>{w===null?document.body.removeAttribute(C):document.body.setAttribute(C,w)})}}var Fe="data-courvux-ssr",Wt=e=>e?Promise.resolve().then(e):Promise.resolve();function et(e,t){const o=e.trim();if(o.startsWith("{")){const c=o.replace(/[{}]/g,"").split(",").map(l=>l.trim()).filter(Boolean);return Object.fromEntries(c.map(l=>[l,t[l]]))}return{[o]:t}}var ye=e=>{if(e===null||typeof e!="object")return e;try{return structuredClone(e)}catch{return e}};async function ne(e,t,o){var A,S,n;const c={},{subscribe:l,createReactiveState:y,registerSetInterceptor:E,notifyAll:x}=Pe();let L;if(typeof t.data=="function"?(t.loadingTemplate&&(e.innerHTML=t.loadingTemplate),L=await t.data()):L=t.data??{},t.templateUrl){const f=o.baseUrl?new URL(t.templateUrl,o.baseUrl).href:t.templateUrl,g=await fetch(f);if(!g.ok)throw new Error(`Failed to load template: ${f} (${g.status})`);e.innerHTML=await g.text()}else t.template&&(e.innerHTML=t.template);e.removeAttribute(Fe),(A=e.querySelector(`[${Fe}]`))==null||A.removeAttribute(Fe);const C={};if(t.inject&&o.provided){const f=Array.isArray(t.inject)?Object.fromEntries(t.inject.map(g=>[g,g])):t.inject;Object.entries(f).forEach(([g,_])=>{o.provided&&_ in o.provided&&(C[g]=o.provided[_])})}const w=y({...o.globalProperties??{},...L,...C,...t.methods,$refs:c,$el:e,...o.slots?{$slots:Object.fromEntries(Object.keys(o.slots).map(f=>[f,!0]))}:{},...o.store?{$store:o.store}:{},...o.currentRoute?{$route:o.currentRoute}:{},...o.router?{$router:o.router}:{}});w.$watch=(f,g,_)=>{const j=(_==null?void 0:_.deep)??!1,i=(_==null?void 0:_.immediate)??!1;let a=j?ye(w[f]):w[f];const s=l(f,()=>{const u=w[f];g.call(w,u,a),a=j?ye(u):u});return i&&g.call(w,w[f],void 0),s},w.$batch=yt,w.$nextTick=f=>Wt(f),w.$dispatch=(f,g,_)=>{e.dispatchEvent(new CustomEvent(f,{bubbles:!0,composed:!0,..._??{},detail:g}))},o.magics&&Object.entries(o.magics).forEach(([f,g])=>{w[f]=g(w)}),w.$forceUpdate=()=>x();const W=[];w.$watchEffect=f=>{let g=[];const _=()=>{g.forEach(s=>s()),g=[];const i=Ie(()=>{try{f()}catch{}}),a=new Map;for(const{sub:s,key:u}of i)a.has(s)||a.set(s,new Set),!a.get(s).has(u)&&(a.get(s).add(u),g.push(s(u,_)))};_();const j=()=>{g.forEach(a=>a()),g=[];const i=W.indexOf(j);i>-1&&W.splice(i,1)};return W.push(j),j};const $=[];t.computed&&Object.entries(t.computed).forEach(([f,g])=>{const _=typeof g=="function"?g:g.get,j=typeof g!="function"?g.set:void 0;let i=[];const a=()=>{i.forEach(p=>p()),i=[];let s;const u=Ie(()=>{try{s=_.call(w)}catch(p){(t.debug??o.debug)&&console.warn("[courvux] computed error:",p)}});w[f]=s;const m=new Map;for(const{sub:p,key:b}of u)m.has(p)||m.set(p,new Set),!m.get(p).has(b)&&(m.get(p).add(b),i.push(p(b,a)))};a(),$.push(()=>i.forEach(s=>s())),j&&E(f,s=>j.call(w,s))});const M=[];t.watch&&Object.entries(t.watch).forEach(([f,g])=>{const _=typeof g=="object"&&g!==null&&"handler"in g,j=_?g.handler:g,i=_?g.immediate??!1:!1,a=_?g.deep??!1:!1;let s=a?ye(w[f]):w[f];const u=l(f,()=>{const m=w[f];j.call(w,m,s),s=a?ye(m):m});M.push(u),i&&j.call(w,w[f],void 0)});const D={...o.provided??{}};if(t.provide){const f=typeof t.provide=="function"?t.provide.call(w):t.provide;Object.assign(D,f)}const F={...o,provided:D,components:{...o.components,...t.components}};F.mountElement=Ae(F),F.createChildScope=(f,g)=>{const _=new Set(Object.keys(f)),j=new Set(Object.keys(g)),{subscribe:i,createReactiveState:a}=Pe(),s=a(f);let u;return u=new Proxy({},{get(m,p){return typeof p!="string"?w[p]:_.has(p)?s[p]:j.has(p)?g[p].bind(u):w[p]},set(m,p,b){return typeof p!="string"?!1:_.has(p)?(s[p]=b,!0):(w[p]=b,!0)},has(m,p){return _.has(p)||j.has(p)||p in w},ownKeys(){return[..._,...j,...Object.keys(w)]},getOwnPropertyDescriptor(m,p){return _.has(p)||j.has(p)||p in w?{configurable:!0,enumerable:!0,writable:!0}:void 0}}),{state:u,subscribe:(m,p)=>_.has(m)?i(m,p):d(m,p),cleanup:()=>{}}},F.mountDynamic=async(f,g,_,j,i)=>{let a=null,s=null;const u=_.getAttribute("loading-template")??"",m=async()=>{var N,R,G;s==null||s(),s=null,a!=null&&a.parentNode&&(a.parentNode.removeChild(a),a=null);const p=H(g,j);if(!p)return;let b;if(typeof p=="function"){if(u){const z=document.createElement("div");z.innerHTML=u,(N=f.parentNode)==null||N.insertBefore(z,f.nextSibling),a=z}b=(await p()).default,a!=null&&a.parentNode&&(a.parentNode.removeChild(a),a=null)}else typeof p=="string"?b=(R=F.components)==null?void 0:R[p]:p&&typeof p=="object"&&(b=p);if(!b)return;const v=document.createElement("div");Array.from(_.attributes).forEach(z=>v.setAttribute(z.name,z.value)),v.innerHTML=_.innerHTML;const k={},P={};Array.from(_.attributes).forEach(z=>{if(z.name.startsWith(":"))k[z.name.slice(1)]=H(z.value,j);else if(z.name.startsWith("@")||z.name.startsWith("cv:on:")){const q=z.value,Q=z.name.startsWith("@")?z.name.slice(1):z.name.slice(6);P[Q]=(...V)=>{typeof j[q]=="function"&&j[q].call(j,...V)}}});const O={...b,data:{...b.data,...k},methods:{...b.methods,$emit(z,...q){var Q;pt(b,z,q),(Q=P[z])==null||Q.call(P,...q)}}},U={...F,components:{...F.components,...b.components}};U.mountElement=Ae(U),s=(await ne(v,O,U)).destroy,(G=f.parentNode)==null||G.insertBefore(v,f.nextSibling),a=v};K(g,i,m),await m()};const I=[];w.$addCleanup=f=>{I.push(f)};let T=!1;const d=(f,g)=>!t.onBeforeUpdate&&!t.onUpdated?l(f,g):l(f,()=>{var _;T||(T=!0,(_=t.onBeforeUpdate)==null||_.call(w),Promise.resolve().then(()=>{var j;T=!1,(j=t.onUpdated)==null||j.call(w)})),g()});try{(S=t.onBeforeMount)==null||S.call(w),await oe(e,w,{subscribe:d,refs:c,...F,registerCleanup:f=>I.push(f)}),e.removeAttribute("cv-cloak"),(n=t.onMount)==null||n.call(w)}catch(f){if(t.onError)e.removeAttribute("cv-cloak"),t.onError.call(w,f);else if(o.errorHandler)e.removeAttribute("cv-cloak"),o.errorHandler(f,w,t.name??e.tagName.toLowerCase());else throw f}const r=typeof window<"u"?window.__COURVUX_DEVTOOLS__:void 0,h=r?jt():0;if(r){const f=w,g=new Set,_={id:h,name:t.name??e.tagName.toLowerCase(),el:e,getState:()=>{const j={};for(const i of Object.keys(f))if(!(i.startsWith("$")||typeof f[i]=="function"))try{j[i]=f[i]}catch{}return j},setState:(j,i)=>{f[j]=i},subscribe:j=>(g.add(j),()=>g.delete(j)),children:[]};Object.keys(f).filter(j=>!j.startsWith("$")&&typeof f[j]!="function").forEach(j=>{l(j,()=>{r._emit("update",_),g.forEach(i=>i())})}),r._registerInstance(_),I.push(()=>r._unregisterInstance(h))}return{state:w,destroy:()=>{var f,g;(f=t.onBeforeUnmount)==null||f.call(w),$.forEach(_=>_()),M.forEach(_=>_()),W.forEach(_=>_()),I.forEach(_=>_()),(g=t.onDestroy)==null||g.call(w)},activate:()=>{var f;(f=t.onActivated)==null||f.call(w)},deactivate:()=>{var f;(f=t.onDeactivated)==null||f.call(w)},beforeLeave:t.onBeforeRouteLeave?(f,g)=>t.onBeforeRouteLeave.call(w,f,g):void 0,enter:t.onBeforeRouteEnter?f=>t.onBeforeRouteEnter.call(w,f):void 0}}function pt(e,t,o){if(!e.emits||Array.isArray(e.emits))return;const c=e.emits[t];typeof c=="function"&&!c(...o)&&console.warn(`[courvux] emit "${t}": validator returned false`)}function Ae(e){return async(t,o,c,l)=>{const y=e.components[o],E=t.getAttribute("cv-ref");E&&t.removeAttribute("cv-ref");const x={},L=[],C={};Array.from(t.attributes).filter(T=>T.name==="cv-model"||T.name.startsWith("cv-model.")||T.name.startsWith("cv-model:")).forEach(T=>{t.removeAttribute(T.name);const d=T.value,r=T.name.indexOf(":"),h=r>=0?T.name.slice(r+1).split(".")[0]:"modelValue",A=h==="modelValue"?"update:modelValue":`update:${h}`;x[h]=$e(H(d,c)),L.push({propName:h,expr:d}),C[A]=S=>{le(d,c,S)}});const w={};Array.from(t.attributes).forEach(T=>{const d=T.name.startsWith(":"),r=T.name.startsWith("@")||T.name.startsWith("cv:on:"),h=T.name==="cv-model"||T.name.startsWith("cv-model.")||T.name.startsWith("cv-model:"),A=T.name.startsWith("v-slot"),S=T.name==="slot";!d&&!r&&!h&&!A&&!S&&(w[T.name]=T.value)}),y.inheritAttrs===!1&&Object.keys(w).forEach(T=>t.removeAttribute(T)),Array.from(t.attributes).forEach(T=>{if(T.name.startsWith(":")){const d=T.name.slice(1),r=T.value;x[d]=$e(H(r,c)),L.push({propName:d,expr:r})}else if(T.name.startsWith("@")||T.name.startsWith("cv:on:")){const d=T.name.startsWith("@")?T.name.slice(1):T.name.slice(6),r=T.value;C[d]=(...h)=>{typeof c[r]=="function"&&c[r].call(c,...h)}}});const W=t.getAttribute("v-slot")??t.getAttribute("v-slot:default");W&&(t.removeAttribute("v-slot"),t.removeAttribute("v-slot:default"));const $=new Map,M=[];Array.from(t.childNodes).forEach(T=>{const d=T.nodeType===1?T.getAttribute("slot"):null;if(d){if(!$.has(d)){const r=t.getAttribute(`v-slot:${d}`)??null;r&&t.removeAttribute(`v-slot:${d}`),$.set(d,{nodes:[],vSlot:r})}$.get(d).nodes.push(T.cloneNode(!0))}else M.push(T.cloneNode(!0))});const D={};M.some(T=>{var d;return T.nodeType===1||T.nodeType===3&&(((d=T.textContent)==null?void 0:d.trim())??"")!==""})&&(D.default=async T=>{const d=W?{...c,...et(W,T)}:c,r=document.createDocumentFragment();return M.forEach(h=>r.appendChild(h.cloneNode(!0))),await oe(r,d,l),Array.from(r.childNodes)});for(const[T,{nodes:d,vSlot:r}]of $)D[T]=async h=>{const A=r?{...c,...et(r,h)}:c,S=document.createDocumentFragment();return d.forEach(n=>S.appendChild(n.cloneNode(!0))),await oe(S,A,l),Array.from(S.childNodes)};const F={...e,components:{...e.components,...y.components},slots:D};F.mountElement=Ae(F);const{state:I}=await ne(t,{...y,data:{...y.data,...x,$attrs:w,$parent:c},methods:{...y.methods,$emit(T,...d){var r;pt(y,T,d),(r=C[T])==null||r.call(C,...d)}}},F);I&&(L.forEach(({propName:T,expr:d})=>{ue(d,{...l,subscribe:l.subscribe},()=>{I[T]=$e(H(d,c))})}),E&&l.refs&&(l.refs[E]=I))}}function Ut(e){kt();const t=typeof window<"u"?Ft():void 0,o=[],c={...e.directives},l={...e.components??{}},y=[],E=new Map,x={},L=new Map;if(e.debug&&t&&Dt(t),t&&e.store){const $=e.store,M=Object.keys($).filter(D=>typeof $[D]!="function");t._registerStore({getState(){const D={};return M.forEach(F=>{try{D[F]=$[F]}catch{}}),D},setState(D,F){$[D]=F},subscribe(D){const F=M.map(I=>{try{return ve($,I,D)}catch{return()=>{}}});return()=>F.forEach(I=>I())}})}const C={router:e.router,use($){return o.includes($)||(o.push($),$.install(C)),C},directive($,M){return c[$]=M,C},component($,M){return l[$]=M,C},provide($,M){return typeof $=="string"?x[$]=M:Object.assign(x,$),C},magic($,M){return L.set(`$${$}`,M),C},mount:async $=>(await W($),C),mountAll:async($="[data-courvux]")=>{const M=Array.from(document.querySelectorAll($));return await Promise.all(M.map(D=>w(D))),C},mountEl:async $=>w($),unmount($){if(!$)y.forEach(M=>M()),y.length=0,E.clear();else{const M=document.querySelector($);if(M){const D=E.get(M);if(D){D(),E.delete(M);const F=y.indexOf(D);F>-1&&y.splice(F,1)}}}return C},destroy(){y.forEach($=>$()),y.length=0,E.clear()}},w=async $=>{const M=new URL(".",document.baseURI).href,D={components:l,router:e.router,store:e.store,directives:c,baseUrl:M,provided:{...x},errorHandler:e.errorHandler,globalProperties:e.globalProperties,magics:L.size?Object.fromEntries(L):void 0};if(D.mountElement=Ae(D),e.router){const I=e.router;D.mountRouterView=async(T,d)=>{await new Promise(r=>{Je(T,I,async(h,A,S,n,f)=>{const g={...D,currentRoute:S};if(f){let _=null;const j={...g,mountRouterView:async(i,a)=>{_=Je(i,f,async(s,u,m,p)=>{const b={...g,currentRoute:m};if(p){let v=null;const k={...b,mountRouterView:async(O,U)=>{v=await ne(O,u,b)}},{destroy:P}=await ne(s,{template:p},k);return{destroy:()=>{v==null||v.destroy(),P()},activate:()=>v==null?void 0:v.activate(),deactivate:()=>v==null?void 0:v.deactivate()}}else return await ne(s,u,b)},a)}};if(n){let i=null;const a={...j,mountRouterView:async(u,m)=>{i=await ne(u,A,j)}},{destroy:s}=await ne(h,{template:n},a);return{destroy:()=>{_==null||_(),i==null||i.destroy(),s()},activate:()=>i==null?void 0:i.activate(),deactivate:()=>i==null?void 0:i.deactivate()}}else{const i=await ne(h,A,j);return{destroy:()=>{_==null||_(),i.destroy()},activate:()=>i.activate(),deactivate:()=>i.deactivate()}}}else if(n){let _=null;const j={...g,mountRouterView:async(a,s)=>{_=await ne(a,A,g)}},{destroy:i}=await ne(h,{template:n},j);return{destroy:()=>{_==null||_.destroy(),i()},activate:()=>_==null?void 0:_.activate(),deactivate:()=>_==null?void 0:_.deactivate()}}else return await ne(h,A,g)},d,r)})}}const F=await ne($,e,D);return y.push(F.destroy),E.set($,F.destroy),F.state},W=async $=>{const M=document.querySelector($);if(M)return w(M)};return C}var tt=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function Bt(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var Oe={exports:{}},ot;function qt(){return ot||(ot=1,(function(e){var t=typeof window<"u"?window:typeof WorkerGlobalScope<"u"&&self instanceof WorkerGlobalScope?self:{};/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 *
 * @license MIT <https://opensource.org/licenses/MIT>
 * @author Lea Verou <https://lea.verou.me>
 * @namespace
 * @public
 */var o=(function(c){var l=/(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i,y=0,E={},x={manual:c.Prism&&c.Prism.manual,disableWorkerMessageHandler:c.Prism&&c.Prism.disableWorkerMessageHandler,util:{encode:function d(r){return r instanceof L?new L(r.type,d(r.content),r.alias):Array.isArray(r)?r.map(d):r.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/\u00a0/g," ")},type:function(d){return Object.prototype.toString.call(d).slice(8,-1)},objId:function(d){return d.__id||Object.defineProperty(d,"__id",{value:++y}),d.__id},clone:function d(r,h){h=h||{};var A,S;switch(x.util.type(r)){case"Object":if(S=x.util.objId(r),h[S])return h[S];A={},h[S]=A;for(var n in r)r.hasOwnProperty(n)&&(A[n]=d(r[n],h));return A;case"Array":return S=x.util.objId(r),h[S]?h[S]:(A=[],h[S]=A,r.forEach(function(f,g){A[g]=d(f,h)}),A);default:return r}},getLanguage:function(d){for(;d;){var r=l.exec(d.className);if(r)return r[1].toLowerCase();d=d.parentElement}return"none"},setLanguage:function(d,r){d.className=d.className.replace(RegExp(l,"gi"),""),d.classList.add("language-"+r)},currentScript:function(){if(typeof document>"u")return null;if(document.currentScript&&document.currentScript.tagName==="SCRIPT")return document.currentScript;try{throw new Error}catch(A){var d=(/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(A.stack)||[])[1];if(d){var r=document.getElementsByTagName("script");for(var h in r)if(r[h].src==d)return r[h]}return null}},isActive:function(d,r,h){for(var A="no-"+r;d;){var S=d.classList;if(S.contains(r))return!0;if(S.contains(A))return!1;d=d.parentElement}return!!h}},languages:{plain:E,plaintext:E,text:E,txt:E,extend:function(d,r){var h=x.util.clone(x.languages[d]);for(var A in r)h[A]=r[A];return h},insertBefore:function(d,r,h,A){A=A||x.languages;var S=A[d],n={};for(var f in S)if(S.hasOwnProperty(f)){if(f==r)for(var g in h)h.hasOwnProperty(g)&&(n[g]=h[g]);h.hasOwnProperty(f)||(n[f]=S[f])}var _=A[d];return A[d]=n,x.languages.DFS(x.languages,function(j,i){i===_&&j!=d&&(this[j]=n)}),n},DFS:function d(r,h,A,S){S=S||{};var n=x.util.objId;for(var f in r)if(r.hasOwnProperty(f)){h.call(r,f,r[f],A||f);var g=r[f],_=x.util.type(g);_==="Object"&&!S[n(g)]?(S[n(g)]=!0,d(g,h,null,S)):_==="Array"&&!S[n(g)]&&(S[n(g)]=!0,d(g,h,f,S))}}},plugins:{},highlightAll:function(d,r){x.highlightAllUnder(document,d,r)},highlightAllUnder:function(d,r,h){var A={callback:h,container:d,selector:'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'};x.hooks.run("before-highlightall",A),A.elements=Array.prototype.slice.apply(A.container.querySelectorAll(A.selector)),x.hooks.run("before-all-elements-highlight",A);for(var S=0,n;n=A.elements[S++];)x.highlightElement(n,r===!0,A.callback)},highlightElement:function(d,r,h){var A=x.util.getLanguage(d),S=x.languages[A];x.util.setLanguage(d,A);var n=d.parentElement;n&&n.nodeName.toLowerCase()==="pre"&&x.util.setLanguage(n,A);var f=d.textContent,g={element:d,language:A,grammar:S,code:f};function _(i){g.highlightedCode=i,x.hooks.run("before-insert",g),g.element.innerHTML=g.highlightedCode,x.hooks.run("after-highlight",g),x.hooks.run("complete",g),h&&h.call(g.element)}if(x.hooks.run("before-sanity-check",g),n=g.element.parentElement,n&&n.nodeName.toLowerCase()==="pre"&&!n.hasAttribute("tabindex")&&n.setAttribute("tabindex","0"),!g.code){x.hooks.run("complete",g),h&&h.call(g.element);return}if(x.hooks.run("before-highlight",g),!g.grammar){_(x.util.encode(g.code));return}if(r&&c.Worker){var j=new Worker(x.filename);j.onmessage=function(i){_(i.data)},j.postMessage(JSON.stringify({language:g.language,code:g.code,immediateClose:!0}))}else _(x.highlight(g.code,g.grammar,g.language))},highlight:function(d,r,h){var A={code:d,grammar:r,language:h};if(x.hooks.run("before-tokenize",A),!A.grammar)throw new Error('The language "'+A.language+'" has no grammar.');return A.tokens=x.tokenize(A.code,A.grammar),x.hooks.run("after-tokenize",A),L.stringify(x.util.encode(A.tokens),A.language)},tokenize:function(d,r){var h=r.rest;if(h){for(var A in h)r[A]=h[A];delete r.rest}var S=new W;return $(S,S.head,d),w(d,S,r,S.head,0),D(S)},hooks:{all:{},add:function(d,r){var h=x.hooks.all;h[d]=h[d]||[],h[d].push(r)},run:function(d,r){var h=x.hooks.all[d];if(!(!h||!h.length))for(var A=0,S;S=h[A++];)S(r)}},Token:L};c.Prism=x;function L(d,r,h,A){this.type=d,this.content=r,this.alias=h,this.length=(A||"").length|0}L.stringify=function d(r,h){if(typeof r=="string")return r;if(Array.isArray(r)){var A="";return r.forEach(function(_){A+=d(_,h)}),A}var S={type:r.type,content:d(r.content,h),tag:"span",classes:["token",r.type],attributes:{},language:h},n=r.alias;n&&(Array.isArray(n)?Array.prototype.push.apply(S.classes,n):S.classes.push(n)),x.hooks.run("wrap",S);var f="";for(var g in S.attributes)f+=" "+g+'="'+(S.attributes[g]||"").replace(/"/g,"&quot;")+'"';return"<"+S.tag+' class="'+S.classes.join(" ")+'"'+f+">"+S.content+"</"+S.tag+">"};function C(d,r,h,A){d.lastIndex=r;var S=d.exec(h);if(S&&A&&S[1]){var n=S[1].length;S.index+=n,S[0]=S[0].slice(n)}return S}function w(d,r,h,A,S,n){for(var f in h)if(!(!h.hasOwnProperty(f)||!h[f])){var g=h[f];g=Array.isArray(g)?g:[g];for(var _=0;_<g.length;++_){if(n&&n.cause==f+","+_)return;var j=g[_],i=j.inside,a=!!j.lookbehind,s=!!j.greedy,u=j.alias;if(s&&!j.pattern.global){var m=j.pattern.toString().match(/[imsuy]*$/)[0];j.pattern=RegExp(j.pattern.source,m+"g")}for(var p=j.pattern||j,b=A.next,v=S;b!==r.tail&&!(n&&v>=n.reach);v+=b.value.length,b=b.next){var k=b.value;if(r.length>d.length)return;if(!(k instanceof L)){var P=1,O;if(s){if(O=C(p,v,d,a),!O||O.index>=d.length)break;var G=O.index,U=O.index+O[0].length,N=v;for(N+=b.value.length;G>=N;)b=b.next,N+=b.value.length;if(N-=b.value.length,v=N,b.value instanceof L)continue;for(var R=b;R!==r.tail&&(N<U||typeof R.value=="string");R=R.next)P++,N+=R.value.length;P--,k=d.slice(v,N),O.index-=v}else if(O=C(p,0,k,a),!O)continue;var G=O.index,z=O[0],q=k.slice(0,G),Q=k.slice(G+z.length),V=v+k.length;n&&V>n.reach&&(n.reach=V);var B=b.prev;q&&(B=$(r,B,q),v+=q.length),M(r,B,P);var te=new L(f,i?x.tokenize(z,i):z,u,z);if(b=$(r,B,te),Q&&$(r,b,Q),P>1){var J={cause:f+","+_,reach:V};w(d,r,h,b.prev,v,J),n&&J.reach>n.reach&&(n.reach=J.reach)}}}}}}function W(){var d={value:null,prev:null,next:null},r={value:null,prev:d,next:null};d.next=r,this.head=d,this.tail=r,this.length=0}function $(d,r,h){var A=r.next,S={value:h,prev:r,next:A};return r.next=S,A.prev=S,d.length++,S}function M(d,r,h){for(var A=r.next,S=0;S<h&&A!==d.tail;S++)A=A.next;r.next=A,A.prev=r,d.length-=S}function D(d){for(var r=[],h=d.head.next;h!==d.tail;)r.push(h.value),h=h.next;return r}if(!c.document)return c.addEventListener&&(x.disableWorkerMessageHandler||c.addEventListener("message",function(d){var r=JSON.parse(d.data),h=r.language,A=r.code,S=r.immediateClose;c.postMessage(x.highlight(A,x.languages[h],h)),S&&c.close()},!1)),x;var F=x.util.currentScript();F&&(x.filename=F.src,F.hasAttribute("data-manual")&&(x.manual=!0));function I(){x.manual||x.highlightAll()}if(!x.manual){var T=document.readyState;T==="loading"||T==="interactive"&&F&&F.defer?document.addEventListener("DOMContentLoaded",I):window.requestAnimationFrame?window.requestAnimationFrame(I):window.setTimeout(I,16)}return x})(t);e.exports&&(e.exports=o),typeof tt<"u"&&(tt.Prism=o),o.languages.markup={comment:{pattern:/<!--(?:(?!<!--)[\s\S])*?-->/,greedy:!0},prolog:{pattern:/<\?[\s\S]+?\?>/,greedy:!0},doctype:{pattern:/<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,greedy:!0,inside:{"internal-subset":{pattern:/(^[^\[]*\[)[\s\S]+(?=\]>$)/,lookbehind:!0,greedy:!0,inside:null},string:{pattern:/"[^"]*"|'[^']*'/,greedy:!0},punctuation:/^<!|>$|[[\]]/,"doctype-tag":/^DOCTYPE/i,name:/[^\s<>'"]+/}},cdata:{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,greedy:!0},tag:{pattern:/<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,greedy:!0,inside:{tag:{pattern:/^<\/?[^\s>\/]+/,inside:{punctuation:/^<\/?/,namespace:/^[^\s>\/:]+:/}},"special-attr":[],"attr-value":{pattern:/=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,inside:{punctuation:[{pattern:/^=/,alias:"attr-equals"},{pattern:/^(\s*)["']|["']$/,lookbehind:!0}]}},punctuation:/\/?>/,"attr-name":{pattern:/[^\s>\/]+/,inside:{namespace:/^[^\s>\/:]+:/}}}},entity:[{pattern:/&[\da-z]{1,8};/i,alias:"named-entity"},/&#x?[\da-f]{1,8};/i]},o.languages.markup.tag.inside["attr-value"].inside.entity=o.languages.markup.entity,o.languages.markup.doctype.inside["internal-subset"].inside=o.languages.markup,o.hooks.add("wrap",function(c){c.type==="entity"&&(c.attributes.title=c.content.replace(/&amp;/,"&"))}),Object.defineProperty(o.languages.markup.tag,"addInlined",{value:function(l,y){var E={};E["language-"+y]={pattern:/(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,lookbehind:!0,inside:o.languages[y]},E.cdata=/^<!\[CDATA\[|\]\]>$/i;var x={"included-cdata":{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,inside:E}};x["language-"+y]={pattern:/[\s\S]+/,inside:o.languages[y]};var L={};L[l]={pattern:RegExp(/(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(/__/g,function(){return l}),"i"),lookbehind:!0,greedy:!0,inside:x},o.languages.insertBefore("markup","cdata",L)}}),Object.defineProperty(o.languages.markup.tag,"addAttribute",{value:function(c,l){o.languages.markup.tag.inside["special-attr"].push({pattern:RegExp(/(^|["'\s])/.source+"(?:"+c+")"+/\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source,"i"),lookbehind:!0,inside:{"attr-name":/^[^\s=]+/,"attr-value":{pattern:/=[\s\S]+/,inside:{value:{pattern:/(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,lookbehind:!0,alias:[l,"language-"+l],inside:o.languages[l]},punctuation:[{pattern:/^=/,alias:"attr-equals"},/"|'/]}}}})}}),o.languages.html=o.languages.markup,o.languages.mathml=o.languages.markup,o.languages.svg=o.languages.markup,o.languages.xml=o.languages.extend("markup",{}),o.languages.ssml=o.languages.xml,o.languages.atom=o.languages.xml,o.languages.rss=o.languages.xml,(function(c){var l=/(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;c.languages.css={comment:/\/\*[\s\S]*?\*\//,atrule:{pattern:RegExp("@[\\w-](?:"+/[^;{\s"']|\s+(?!\s)/.source+"|"+l.source+")*?"+/(?:;|(?=\s*\{))/.source),inside:{rule:/^@[\w-]+/,"selector-function-argument":{pattern:/(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,lookbehind:!0,alias:"selector"},keyword:{pattern:/(^|[^\w-])(?:and|not|only|or)(?![\w-])/,lookbehind:!0}}},url:{pattern:RegExp("\\burl\\((?:"+l.source+"|"+/(?:[^\\\r\n()"']|\\[\s\S])*/.source+")\\)","i"),greedy:!0,inside:{function:/^url/i,punctuation:/^\(|\)$/,string:{pattern:RegExp("^"+l.source+"$"),alias:"url"}}},selector:{pattern:RegExp(`(^|[{}\\s])[^{}\\s](?:[^{};"'\\s]|\\s+(?![\\s{])|`+l.source+")*(?=\\s*\\{)"),lookbehind:!0},string:{pattern:l,greedy:!0},property:{pattern:/(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,lookbehind:!0},important:/!important\b/i,function:{pattern:/(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i,lookbehind:!0},punctuation:/[(){};:,]/},c.languages.css.atrule.inside.rest=c.languages.css;var y=c.languages.markup;y&&(y.tag.addInlined("style","css"),y.tag.addAttribute("style","css"))})(o),o.languages.clike={comment:[{pattern:/(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,lookbehind:!0,greedy:!0},{pattern:/(^|[^\\:])\/\/.*/,lookbehind:!0,greedy:!0}],string:{pattern:/(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,greedy:!0},"class-name":{pattern:/(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,lookbehind:!0,inside:{punctuation:/[.\\]/}},keyword:/\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,boolean:/\b(?:false|true)\b/,function:/\b\w+(?=\()/,number:/\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,operator:/[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,punctuation:/[{}[\];(),.:]/},o.languages.javascript=o.languages.extend("clike",{"class-name":[o.languages.clike["class-name"],{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,lookbehind:!0}],keyword:[{pattern:/((?:^|\})\s*)catch\b/,lookbehind:!0},{pattern:/(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,lookbehind:!0}],function:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,number:{pattern:RegExp(/(^|[^\w$])/.source+"(?:"+(/NaN|Infinity/.source+"|"+/0[bB][01]+(?:_[01]+)*n?/.source+"|"+/0[oO][0-7]+(?:_[0-7]+)*n?/.source+"|"+/0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source+"|"+/\d+(?:_\d+)*n/.source+"|"+/(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/.source)+")"+/(?![\w$])/.source),lookbehind:!0},operator:/--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/}),o.languages.javascript["class-name"][0].pattern=/(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/,o.languages.insertBefore("javascript","keyword",{regex:{pattern:RegExp(/((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)/.source+/\//.source+"(?:"+/(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}/.source+"|"+/(?:\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.)*\])*\])*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}v[dgimyus]{0,7}/.source+")"+/(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/.source),lookbehind:!0,greedy:!0,inside:{"regex-source":{pattern:/^(\/)[\s\S]+(?=\/[a-z]*$)/,lookbehind:!0,alias:"language-regex",inside:o.languages.regex},"regex-delimiter":/^\/|\/$/,"regex-flags":/^[a-z]+$/}},"function-variable":{pattern:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,alias:"function"},parameter:[{pattern:/(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,lookbehind:!0,inside:o.languages.javascript},{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,lookbehind:!0,inside:o.languages.javascript},{pattern:/(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,lookbehind:!0,inside:o.languages.javascript},{pattern:/((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,lookbehind:!0,inside:o.languages.javascript}],constant:/\b[A-Z](?:[A-Z_]|\dx?)*\b/}),o.languages.insertBefore("javascript","string",{hashbang:{pattern:/^#!.*/,greedy:!0,alias:"comment"},"template-string":{pattern:/`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,greedy:!0,inside:{"template-punctuation":{pattern:/^`|`$/,alias:"string"},interpolation:{pattern:/((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,lookbehind:!0,inside:{"interpolation-punctuation":{pattern:/^\$\{|\}$/,alias:"punctuation"},rest:o.languages.javascript}},string:/[\s\S]+/}},"string-property":{pattern:/((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,lookbehind:!0,greedy:!0,alias:"property"}}),o.languages.insertBefore("javascript","operator",{"literal-property":{pattern:/((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,lookbehind:!0,alias:"property"}}),o.languages.markup&&(o.languages.markup.tag.addInlined("script","javascript"),o.languages.markup.tag.addAttribute(/on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/.source,"javascript")),o.languages.js=o.languages.javascript,(function(){if(typeof o>"u"||typeof document>"u")return;Element.prototype.matches||(Element.prototype.matches=Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector);var c="Loading…",l=function(F,I){return"✖ Error "+F+" while fetching file: "+I},y="✖ Error: File does not exist or is empty",E={js:"javascript",py:"python",rb:"ruby",ps1:"powershell",psm1:"powershell",sh:"bash",bat:"batch",h:"c",tex:"latex"},x="data-src-status",L="loading",C="loaded",w="failed",W="pre[data-src]:not(["+x+'="'+C+'"]):not(['+x+'="'+L+'"])';function $(F,I,T){var d=new XMLHttpRequest;d.open("GET",F,!0),d.onreadystatechange=function(){d.readyState==4&&(d.status<400&&d.responseText?I(d.responseText):d.status>=400?T(l(d.status,d.statusText)):T(y))},d.send(null)}function M(F){var I=/^\s*(\d+)\s*(?:(,)\s*(?:(\d+)\s*)?)?$/.exec(F||"");if(I){var T=Number(I[1]),d=I[2],r=I[3];return d?r?[T,Number(r)]:[T,void 0]:[T,T]}}o.hooks.add("before-highlightall",function(F){F.selector+=", "+W}),o.hooks.add("before-sanity-check",function(F){var I=F.element;if(I.matches(W)){F.code="",I.setAttribute(x,L);var T=I.appendChild(document.createElement("CODE"));T.textContent=c;var d=I.getAttribute("data-src"),r=F.language;if(r==="none"){var h=(/\.(\w+)$/.exec(d)||[,"none"])[1];r=E[h]||h}o.util.setLanguage(T,r),o.util.setLanguage(I,r);var A=o.plugins.autoloader;A&&A.loadLanguages(r),$(d,function(S){I.setAttribute(x,C);var n=M(I.getAttribute("data-range"));if(n){var f=S.split(/\r\n?|\n/g),g=n[0],_=n[1]==null?f.length:n[1];g<0&&(g+=f.length),g=Math.max(0,Math.min(g-1,f.length)),_<0&&(_+=f.length),_=Math.max(0,Math.min(_,f.length)),S=f.slice(g,_).join(`
`),I.hasAttribute("data-start")||I.setAttribute("data-start",String(g+1))}T.textContent=S,o.highlightElement(T)},function(S){I.setAttribute(x,w),T.textContent=S})}}),o.plugins.fileHighlight={highlight:function(I){for(var T=(I||document).querySelectorAll(W),d=0,r;r=T[d++];)o.highlightElement(r)}};var D=!1;o.fileHighlight=function(){D||(console.warn("Prism.fileHighlight is deprecated. Use `Prism.plugins.fileHighlight.highlight` instead."),D=!0),o.plugins.fileHighlight.highlight.apply(this,arguments)}})()})(Oe)),Oe.exports}var Vt=qt();const Gt=Bt(Vt);Prism.languages.javascript=Prism.languages.extend("clike",{"class-name":[Prism.languages.clike["class-name"],{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,lookbehind:!0}],keyword:[{pattern:/((?:^|\})\s*)catch\b/,lookbehind:!0},{pattern:/(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,lookbehind:!0}],function:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,number:{pattern:RegExp(/(^|[^\w$])/.source+"(?:"+(/NaN|Infinity/.source+"|"+/0[bB][01]+(?:_[01]+)*n?/.source+"|"+/0[oO][0-7]+(?:_[0-7]+)*n?/.source+"|"+/0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source+"|"+/\d+(?:_\d+)*n/.source+"|"+/(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/.source)+")"+/(?![\w$])/.source),lookbehind:!0},operator:/--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/});Prism.languages.javascript["class-name"][0].pattern=/(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/;Prism.languages.insertBefore("javascript","keyword",{regex:{pattern:RegExp(/((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)/.source+/\//.source+"(?:"+/(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}/.source+"|"+/(?:\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.)*\])*\])*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}v[dgimyus]{0,7}/.source+")"+/(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/.source),lookbehind:!0,greedy:!0,inside:{"regex-source":{pattern:/^(\/)[\s\S]+(?=\/[a-z]*$)/,lookbehind:!0,alias:"language-regex",inside:Prism.languages.regex},"regex-delimiter":/^\/|\/$/,"regex-flags":/^[a-z]+$/}},"function-variable":{pattern:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,alias:"function"},parameter:[{pattern:/(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,lookbehind:!0,inside:Prism.languages.javascript},{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,lookbehind:!0,inside:Prism.languages.javascript},{pattern:/(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,lookbehind:!0,inside:Prism.languages.javascript},{pattern:/((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,lookbehind:!0,inside:Prism.languages.javascript}],constant:/\b[A-Z](?:[A-Z_]|\dx?)*\b/});Prism.languages.insertBefore("javascript","string",{hashbang:{pattern:/^#!.*/,greedy:!0,alias:"comment"},"template-string":{pattern:/`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,greedy:!0,inside:{"template-punctuation":{pattern:/^`|`$/,alias:"string"},interpolation:{pattern:/((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,lookbehind:!0,inside:{"interpolation-punctuation":{pattern:/^\$\{|\}$/,alias:"punctuation"},rest:Prism.languages.javascript}},string:/[\s\S]+/}},"string-property":{pattern:/((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,lookbehind:!0,greedy:!0,alias:"property"}});Prism.languages.insertBefore("javascript","operator",{"literal-property":{pattern:/((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,lookbehind:!0,alias:"property"}});Prism.languages.markup&&(Prism.languages.markup.tag.addInlined("script","javascript"),Prism.languages.markup.tag.addAttribute(/on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/.source,"javascript"));Prism.languages.js=Prism.languages.javascript;Prism.languages.markup={comment:{pattern:/<!--(?:(?!<!--)[\s\S])*?-->/,greedy:!0},prolog:{pattern:/<\?[\s\S]+?\?>/,greedy:!0},doctype:{pattern:/<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,greedy:!0,inside:{"internal-subset":{pattern:/(^[^\[]*\[)[\s\S]+(?=\]>$)/,lookbehind:!0,greedy:!0,inside:null},string:{pattern:/"[^"]*"|'[^']*'/,greedy:!0},punctuation:/^<!|>$|[[\]]/,"doctype-tag":/^DOCTYPE/i,name:/[^\s<>'"]+/}},cdata:{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,greedy:!0},tag:{pattern:/<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,greedy:!0,inside:{tag:{pattern:/^<\/?[^\s>\/]+/,inside:{punctuation:/^<\/?/,namespace:/^[^\s>\/:]+:/}},"special-attr":[],"attr-value":{pattern:/=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,inside:{punctuation:[{pattern:/^=/,alias:"attr-equals"},{pattern:/^(\s*)["']|["']$/,lookbehind:!0}]}},punctuation:/\/?>/,"attr-name":{pattern:/[^\s>\/]+/,inside:{namespace:/^[^\s>\/:]+:/}}}},entity:[{pattern:/&[\da-z]{1,8};/i,alias:"named-entity"},/&#x?[\da-f]{1,8};/i]};Prism.languages.markup.tag.inside["attr-value"].inside.entity=Prism.languages.markup.entity;Prism.languages.markup.doctype.inside["internal-subset"].inside=Prism.languages.markup;Prism.hooks.add("wrap",function(e){e.type==="entity"&&(e.attributes.title=e.content.replace(/&amp;/,"&"))});Object.defineProperty(Prism.languages.markup.tag,"addInlined",{value:function(t,o){var c={};c["language-"+o]={pattern:/(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,lookbehind:!0,inside:Prism.languages[o]},c.cdata=/^<!\[CDATA\[|\]\]>$/i;var l={"included-cdata":{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,inside:c}};l["language-"+o]={pattern:/[\s\S]+/,inside:Prism.languages[o]};var y={};y[t]={pattern:RegExp(/(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(/__/g,function(){return t}),"i"),lookbehind:!0,greedy:!0,inside:l},Prism.languages.insertBefore("markup","cdata",y)}});Object.defineProperty(Prism.languages.markup.tag,"addAttribute",{value:function(e,t){Prism.languages.markup.tag.inside["special-attr"].push({pattern:RegExp(/(^|["'\s])/.source+"(?:"+e+")"+/\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source,"i"),lookbehind:!0,inside:{"attr-name":/^[^\s=]+/,"attr-value":{pattern:/=[\s\S]+/,inside:{value:{pattern:/(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,lookbehind:!0,alias:[t,"language-"+t],inside:Prism.languages[t]},punctuation:[{pattern:/^=/,alias:"attr-equals"},/"|'/]}}}})}});Prism.languages.html=Prism.languages.markup;Prism.languages.mathml=Prism.languages.markup;Prism.languages.svg=Prism.languages.markup;Prism.languages.xml=Prism.languages.extend("markup",{});Prism.languages.ssml=Prism.languages.xml;Prism.languages.atom=Prism.languages.xml;Prism.languages.rss=Prism.languages.xml;(function(e){var t="\\b(?:BASH|BASHOPTS|BASH_ALIASES|BASH_ARGC|BASH_ARGV|BASH_CMDS|BASH_COMPLETION_COMPAT_DIR|BASH_LINENO|BASH_REMATCH|BASH_SOURCE|BASH_VERSINFO|BASH_VERSION|COLORTERM|COLUMNS|COMP_WORDBREAKS|DBUS_SESSION_BUS_ADDRESS|DEFAULTS_PATH|DESKTOP_SESSION|DIRSTACK|DISPLAY|EUID|GDMSESSION|GDM_LANG|GNOME_KEYRING_CONTROL|GNOME_KEYRING_PID|GPG_AGENT_INFO|GROUPS|HISTCONTROL|HISTFILE|HISTFILESIZE|HISTSIZE|HOME|HOSTNAME|HOSTTYPE|IFS|INSTANCE|JOB|LANG|LANGUAGE|LC_ADDRESS|LC_ALL|LC_IDENTIFICATION|LC_MEASUREMENT|LC_MONETARY|LC_NAME|LC_NUMERIC|LC_PAPER|LC_TELEPHONE|LC_TIME|LESSCLOSE|LESSOPEN|LINES|LOGNAME|LS_COLORS|MACHTYPE|MAILCHECK|MANDATORY_PATH|NO_AT_BRIDGE|OLDPWD|OPTERR|OPTIND|ORBIT_SOCKETDIR|OSTYPE|PAPERSIZE|PATH|PIPESTATUS|PPID|PS1|PS2|PS3|PS4|PWD|RANDOM|REPLY|SECONDS|SELINUX_INIT|SESSION|SESSIONTYPE|SESSION_MANAGER|SHELL|SHELLOPTS|SHLVL|SSH_AUTH_SOCK|TERM|UID|UPSTART_EVENTS|UPSTART_INSTANCE|UPSTART_JOB|UPSTART_SESSION|USER|WINDOWID|XAUTHORITY|XDG_CONFIG_DIRS|XDG_CURRENT_DESKTOP|XDG_DATA_DIRS|XDG_GREETER_DATA_DIR|XDG_MENU_PREFIX|XDG_RUNTIME_DIR|XDG_SEAT|XDG_SEAT_PATH|XDG_SESSION_DESKTOP|XDG_SESSION_ID|XDG_SESSION_PATH|XDG_SESSION_TYPE|XDG_VTNR|XMODIFIERS)\\b",o={pattern:/(^(["']?)\w+\2)[ \t]+\S.*/,lookbehind:!0,alias:"punctuation",inside:null},c={bash:o,environment:{pattern:RegExp("\\$"+t),alias:"constant"},variable:[{pattern:/\$?\(\([\s\S]+?\)\)/,greedy:!0,inside:{variable:[{pattern:/(^\$\(\([\s\S]+)\)\)/,lookbehind:!0},/^\$\(\(/],number:/\b0x[\dA-Fa-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:[Ee]-?\d+)?/,operator:/--|\+\+|\*\*=?|<<=?|>>=?|&&|\|\||[=!+\-*/%<>^&|]=?|[?~:]/,punctuation:/\(\(?|\)\)?|,|;/}},{pattern:/\$\((?:\([^)]+\)|[^()])+\)|`[^`]+`/,greedy:!0,inside:{variable:/^\$\(|^`|\)$|`$/}},{pattern:/\$\{[^}]+\}/,greedy:!0,inside:{operator:/:[-=?+]?|[!\/]|##?|%%?|\^\^?|,,?/,punctuation:/[\[\]]/,environment:{pattern:RegExp("(\\{)"+t),lookbehind:!0,alias:"constant"}}},/\$(?:\w+|[#?*!@$])/],entity:/\\(?:[abceEfnrtv\\"]|O?[0-7]{1,3}|U[0-9a-fA-F]{8}|u[0-9a-fA-F]{4}|x[0-9a-fA-F]{1,2})/};e.languages.bash={shebang:{pattern:/^#!\s*\/.*/,alias:"important"},comment:{pattern:/(^|[^"{\\$])#.*/,lookbehind:!0},"function-name":[{pattern:/(\bfunction\s+)[\w-]+(?=(?:\s*\(?:\s*\))?\s*\{)/,lookbehind:!0,alias:"function"},{pattern:/\b[\w-]+(?=\s*\(\s*\)\s*\{)/,alias:"function"}],"for-or-select":{pattern:/(\b(?:for|select)\s+)\w+(?=\s+in\s)/,alias:"variable",lookbehind:!0},"assign-left":{pattern:/(^|[\s;|&]|[<>]\()\w+(?:\.\w+)*(?=\+?=)/,inside:{environment:{pattern:RegExp("(^|[\\s;|&]|[<>]\\()"+t),lookbehind:!0,alias:"constant"}},alias:"variable",lookbehind:!0},parameter:{pattern:/(^|\s)-{1,2}(?:\w+:[+-]?)?\w+(?:\.\w+)*(?=[=\s]|$)/,alias:"variable",lookbehind:!0},string:[{pattern:/((?:^|[^<])<<-?\s*)(\w+)\s[\s\S]*?(?:\r?\n|\r)\2/,lookbehind:!0,greedy:!0,inside:c},{pattern:/((?:^|[^<])<<-?\s*)(["'])(\w+)\2\s[\s\S]*?(?:\r?\n|\r)\3/,lookbehind:!0,greedy:!0,inside:{bash:o}},{pattern:/(^|[^\\](?:\\\\)*)"(?:\\[\s\S]|\$\([^)]+\)|\$(?!\()|`[^`]+`|[^"\\`$])*"/,lookbehind:!0,greedy:!0,inside:c},{pattern:/(^|[^$\\])'[^']*'/,lookbehind:!0,greedy:!0},{pattern:/\$'(?:[^'\\]|\\[\s\S])*'/,greedy:!0,inside:{entity:c.entity}}],environment:{pattern:RegExp("\\$?"+t),alias:"constant"},variable:c.variable,function:{pattern:/(^|[\s;|&]|[<>]\()(?:add|apropos|apt|apt-cache|apt-get|aptitude|aspell|automysqlbackup|awk|basename|bash|bc|bconsole|bg|bzip2|cal|cargo|cat|cfdisk|chgrp|chkconfig|chmod|chown|chroot|cksum|clear|cmp|column|comm|composer|cp|cron|crontab|csplit|curl|cut|date|dc|dd|ddrescue|debootstrap|df|diff|diff3|dig|dir|dircolors|dirname|dirs|dmesg|docker|docker-compose|du|egrep|eject|env|ethtool|expand|expect|expr|fdformat|fdisk|fg|fgrep|file|find|fmt|fold|format|free|fsck|ftp|fuser|gawk|git|gparted|grep|groupadd|groupdel|groupmod|groups|grub-mkconfig|gzip|halt|head|hg|history|host|hostname|htop|iconv|id|ifconfig|ifdown|ifup|import|install|ip|java|jobs|join|kill|killall|less|link|ln|locate|logname|logrotate|look|lpc|lpr|lprint|lprintd|lprintq|lprm|ls|lsof|lynx|make|man|mc|mdadm|mkconfig|mkdir|mke2fs|mkfifo|mkfs|mkisofs|mknod|mkswap|mmv|more|most|mount|mtools|mtr|mutt|mv|nano|nc|netstat|nice|nl|node|nohup|notify-send|npm|nslookup|op|open|parted|passwd|paste|pathchk|ping|pkill|pnpm|podman|podman-compose|popd|pr|printcap|printenv|ps|pushd|pv|quota|quotacheck|quotactl|ram|rar|rcp|reboot|remsync|rename|renice|rev|rm|rmdir|rpm|rsync|scp|screen|sdiff|sed|sendmail|seq|service|sftp|sh|shellcheck|shuf|shutdown|sleep|slocate|sort|split|ssh|stat|strace|su|sudo|sum|suspend|swapon|sync|sysctl|tac|tail|tar|tee|time|timeout|top|touch|tr|traceroute|tsort|tty|umount|uname|unexpand|uniq|units|unrar|unshar|unzip|update-grub|uptime|useradd|userdel|usermod|users|uudecode|uuencode|v|vcpkg|vdir|vi|vim|virsh|vmstat|wait|watch|wc|wget|whereis|which|who|whoami|write|xargs|xdg-open|yarn|yes|zenity|zip|zsh|zypper)(?=$|[)\s;|&])/,lookbehind:!0},keyword:{pattern:/(^|[\s;|&]|[<>]\()(?:case|do|done|elif|else|esac|fi|for|function|if|in|select|then|until|while)(?=$|[)\s;|&])/,lookbehind:!0},builtin:{pattern:/(^|[\s;|&]|[<>]\()(?:\.|:|alias|bind|break|builtin|caller|cd|command|continue|declare|echo|enable|eval|exec|exit|export|getopts|hash|help|let|local|logout|mapfile|printf|pwd|read|readarray|readonly|return|set|shift|shopt|source|test|times|trap|type|typeset|ulimit|umask|unalias|unset)(?=$|[)\s;|&])/,lookbehind:!0,alias:"class-name"},boolean:{pattern:/(^|[\s;|&]|[<>]\()(?:false|true)(?=$|[)\s;|&])/,lookbehind:!0},"file-descriptor":{pattern:/\B&\d\b/,alias:"important"},operator:{pattern:/\d?<>|>\||\+=|=[=~]?|!=?|<<[<-]?|[&\d]?>>|\d[<>]&?|[<>][&=]?|&[>&]?|\|[&|]?/,inside:{"file-descriptor":{pattern:/^\d/,alias:"important"}}},punctuation:/\$?\(\(?|\)\)?|\.\.|[{}[\];\\]/,number:{pattern:/(^|\s)(?:[1-9]\d*|0)(?:[.,]\d+)?\b/,lookbehind:!0}},o.inside=e.languages.bash;for(var l=["comment","function-name","for-or-select","assign-left","parameter","string","environment","function","keyword","builtin","boolean","file-descriptor","operator","punctuation","number"],y=c.variable[1].inside,E=0;E<l.length;E++)y[l[E]]=e.languages.bash[l[E]];e.languages.sh=e.languages.bash,e.languages.shell=e.languages.bash})(Prism);Prism.languages.json={property:{pattern:/(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?=\s*:)/,lookbehind:!0,greedy:!0},string:{pattern:/(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?!\s*:)/,lookbehind:!0,greedy:!0},comment:{pattern:/\/\/.*|\/\*[\s\S]*?(?:\*\/|$)/,greedy:!0},number:/-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i,punctuation:/[{}[\],]/,operator:/:/,boolean:/\b(?:false|true)\b/,null:{pattern:/\bnull\b/,alias:"keyword"}};Prism.languages.webmanifest=Prism.languages.json;var nt={},at;function Xt(){return at||(at=1,(function(e){e.languages.typescript=e.languages.extend("javascript",{"class-name":{pattern:/(\b(?:class|extends|implements|instanceof|interface|new|type)\s+)(?!keyof\b)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?:\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>)?/,lookbehind:!0,greedy:!0,inside:null},builtin:/\b(?:Array|Function|Promise|any|boolean|console|never|number|string|symbol|unknown)\b/}),e.languages.typescript.keyword.push(/\b(?:abstract|declare|is|keyof|readonly|require)\b/,/\b(?:asserts|infer|interface|module|namespace|type)\b(?=\s*(?:[{_$a-zA-Z\xA0-\uFFFF]|$))/,/\btype\b(?=\s*(?:[\{*]|$))/),delete e.languages.typescript.parameter,delete e.languages.typescript["literal-property"];var t=e.languages.extend("typescript",{});delete t["class-name"],e.languages.typescript["class-name"].inside=t,e.languages.insertBefore("typescript","function",{decorator:{pattern:/@[$\w\xA0-\uFFFF]+/,inside:{at:{pattern:/^@/,alias:"operator"},function:/^[\s\S]+/}},"generic-function":{pattern:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>(?=\s*\()/,greedy:!0,inside:{function:/^#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*/,generic:{pattern:/<[\s\S]+/,alias:"class-name",inside:t}}}}),e.languages.ts=e.languages.typescript})(Prism)),nt}Xt();const Yt={js:"JavaScript",ts:"TypeScript",html:"HTML",bash:"Shell",json:"JSON"};function Zt(e){const t=e.split(`
`);for(;t.length&&!t[0].trim();)t.shift();for(;t.length&&!t[t.length-1].trim();)t.pop();const o=t.filter(c=>c.trim()).reduce((c,l)=>Math.min(c,l.match(/^(\s*)/)[1].length),1/0);return t.map(c=>c.slice(o)).join(`
`)}const Jt={data:{lang:"js",code:"",label:"",copied:!1},template:`
        <div class="code-block">
            <div class="code-header">
                <span class="code-lang">{{ label || langLabel }}</span>
                <button class="copy-btn" @click="copy()">
                    {{ copied ? '✓ Copied' : 'Copy' }}
                </button>
            </div>
            <pre class="language-placeholder"><code cv-ref="el" :class="'language-' + lang"></code></pre>
        </div>
    `,computed:{langLabel(){return Yt[this.lang]||this.lang.toUpperCase()}},methods:{copy(){var e;(e=navigator.clipboard)==null||e.writeText(this._cleanCode).then(()=>{this.copied=!0,setTimeout(()=>{this.copied=!1},1800)})}},onMount(){const e=this.$refs.el;e&&(this._cleanCode=Zt(this.code),e.textContent=this._cleanCode,Gt.highlightElement(e))}},he="Courvux",Kt="https://vanjexdev.github.io/courvux";function Z({title:e,description:t,slug:o="/"}){const c=e?`${e} — ${he}`:`${he} — Lightweight reactive UI framework`,l=Kt+o;return Ht({title:e??`${he} — Lightweight reactive UI framework`,titleTemplate:e?`%s — ${he}`:void 0,meta:[{name:"description",content:t},{property:"og:title",content:c},{property:"og:description",content:t},{property:"og:type",content:"website"},{property:"og:url",content:l},{property:"og:site_name",content:he},{name:"twitter:card",content:"summary_large_image"},{name:"twitter:title",content:c},{name:"twitter:description",content:t}],link:[{rel:"canonical",href:l}]})}const Qt={data:{install:`# From GitHub — pin a tag for stable installs
pnpm add github:vanjexdev/courvux#v0.4.3

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
                    <span style="font-size:2rem;">⚡</span>
                    <h1 style="font-size:2rem; font-weight:700; margin:0;">Courvux</h1>
                    <span class="badge">v0.4.3</span>
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
    `,onMount(){Z({description:"Lightweight reactive UI framework for the browser. No virtual DOM. Proxy-based reactivity. ~20 KB gzip with everything (router, store, devtools, composables, useHead, SSR).",slug:"/"})}},eo={data:{s1:`# Latest commit on main (rolling)
pnpm add github:vanjexdev/courvux

# Pin to a tagged release (recommended for production)
pnpm add github:vanjexdev/courvux#v0.4.3`,s2:`<script type="importmap">
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
    "courvux": "https://cdn.jsdelivr.net/gh/vanjexdev/courvux@v0.4.3/dist/index.js"
  }
}
<\/script>

<script type="module">
  import { createApp, createStore, createRouter } from 'courvux';
<\/script>`},onMount(){Z({title:"Installation",description:"Install Courvux from GitHub or via import map / CDN. Vite plugin for templateUrl inlining and jsDelivr CDN setup.",slug:"/installation"});const e=this.$refs.pen;if(!e)return;const t=document.createElement("iframe");t.src="https://codepen.io/jesusuzcategui-the-bold/embed/VYmZNgZ?default-tab=html%2Cresult&theme-id=dark",t.height="420",t.style.cssText="width:100%; border:0; border-radius:8px; display:block; margin-bottom:1rem;",t.scrolling="no",t.setAttribute("frameborder","no"),t.setAttribute("allowtransparency","true"),t.allowFullscreen=!0,t.title="Courvux CDN demo on CodePen",e.replaceWith(t)},template:`
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

            <div style="margin-top:2rem; display:flex; gap:12px;">
                <router-link to="/" style="font-size:13px; color:#555;">← Home</router-link>
                <router-link to="/quick-start" style="font-size:13px; color:#111; font-weight:600;">Quick Start →</router-link>
            </div>
        </div>
    `},to={data:{s1:`import { createApp } from 'courvux';

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
    `,onMount(){Z({title:"Quick Start",description:"Build your first reactive Courvux app — counter example, methods, computed properties.",slug:"/quick-start"})}},oo={data:{s_interp:`<!-- Text interpolation -->
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
    `,onMount(){Z({title:"Template Syntax",description:"Courvux directives and bindings: cv-if, cv-for, cv-model, cv-show, :class, :style, @event.",slug:"/template"})}},no={data:{s_define:`createApp({
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
    `,onMount(){Z({title:"Components",description:"Define, register, and compose Courvux components with props, slots, emits, and scoped slots.",slug:"/components"})}},ao={data:{s_computed:`{
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

            <div style="margin-top:2rem; display:flex; gap:12px;">
                <router-link to="/components" style="font-size:13px; color:#555;">← Components</router-link>
                <router-link to="/lifecycle" style="font-size:13px; color:#111; font-weight:600;">Lifecycle →</router-link>
            </div>
        </div>
    `,onMount(){Z({title:"Reactivity",description:"Proxy-based reactive state, computed properties, watchers, and refs in Courvux.",slug:"/reactivity"})}},ro={data:{s1:`{
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
    `,onMount(){Z({title:"Lifecycle Hooks",description:"onMount, onBeforeUnmount, onDestroy, error boundaries, and async data in Courvux.",slug:"/lifecycle"})}},io={data:{s_storage:`import { cvStorage } from 'courvux';

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
}`},template:`
        <div class="prose">
            <h1>Composables</h1>
            <p>Courvux ships a small set of composables that cover common app needs without third-party deps. All preserve <code>this</code> binding, are SSR-safe, and integrate with <code>$addCleanup</code> for automatic teardown.</p>

            <table>
                <thead>
                    <tr><th>Composable</th><th>Purpose</th></tr>
                </thead>
                <tbody>
                    <tr><td><code>cvStorage(key, defaults)</code></td><td>Reactive object backed by <code>localStorage</code></td></tr>
                    <tr><td><code>cvFetch(url, callback, options)</code></td><td>Reactive HTTP fetch with <code>{ data, loading, error }</code></td></tr>
                    <tr><td><code>cvDebounce(fn, ms)</code></td><td>Debounced function preserving <code>this</code></td></tr>
                    <tr><td><code>cvThrottle(fn, ms)</code></td><td>Throttled function preserving <code>this</code></td></tr>
                    <tr><td><code>cvMediaQuery(query, callback)</code></td><td>matchMedia with reactive callback</td></tr>
                    <tr><td><code>cvListener(target, event, handler)</code></td><td>addEventListener returning a cleanup fn</td></tr>
                </tbody>
            </table>

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
    `,onMount(){Z({title:"Composables",description:"Reactive composables in Courvux: cvStorage, cvFetch, cvDebounce, cvThrottle, cvMediaQuery, cvListener.",slug:"/composables"})}},so={data:{s_basic:`import { createEventBus } from 'courvux';

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
    `,onMount(){Z({title:"Event Bus",description:"Typed cross-component event bus in Courvux: on, off, emit, once, clear, and provide/inject patterns.",slug:"/event-bus"})}},co={data:{s_setup:`import { createApp, createRouter } from 'courvux';

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
    `,onMount(){Z({title:"Router",description:"SPA routing in Courvux: dynamic params, nested routes, navigation guards, transitions.",slug:"/router"})}},lo={data:{s1:`import { createStore } from 'courvux';

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
    `,onMount(){Z({title:"Store",description:"Global reactive state in Courvux with createStore, modules, and namespaced actions.",slug:"/store"})}},uo={data:{s_basic:`import { useHead } from 'courvux';

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
    `,onMount(){Z({title:"useHead — SEO and metadata",description:"Per-component head management with useHead in Courvux: title, meta tags, Open Graph, JSON-LD, htmlAttrs.",slug:"/head"})}},po={data:{s_vite:`// vite.config.js
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
    `,onMount(){Z({title:"Static Site Generation",description:"Pre-render every route to static HTML at build time with the courvux/plugin/ssg Vite plugin.",slug:"/ssg"})}},mo={data:{s_setup:`import { createApp, setupDevTools, mountDevOverlay } from 'courvux';

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
    `,onMount(){Z({title:"DevTools",description:"In-app DevTools overlay for Courvux: live component state inspection and inline editing, no browser extension needed.",slug:"/devtools"})}},ho={data:{s_basic:`import { mount } from 'courvux/test-utils';
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
    `,onMount(){Z({title:"Testing",description:"Vitest-compatible test utility for Courvux. Mount components, drive state, query the DOM with happy-dom.",slug:"/testing"})}},fo={data:{s_manifest:`{
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
    `,onMount(){Z({title:"Progressive Web App",description:"Make any Courvux app installable and offline-capable: manifest, vite-plugin-pwa, install prompt utility.",slug:"/pwa"})}},vo={data:{s_dir:`// Full definition
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
    `,onMount(){Z({title:"Advanced",description:"Custom directives, plugins, transitions, and the cv-data inline scope in Courvux.",slug:"/advanced"})}},mt="courvux-demo-todos",go=`const STORAGE_KEY = 'courvux-demo-todos';

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
};`,bo=`<!-- Input -->
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
<button cv-show="todos.some(t => t.done)" @click="clearCompleted()">Clear completed</button>`;function yo(){try{return JSON.parse(localStorage.getItem(mt))||[]}catch{return[]}}function xo(e){localStorage.setItem(mt,JSON.stringify(e))}const ko={data:{todos:yo(),newTodo:"",filter:"all",editingId:null,editText:"",_nextId:Date.now(),srcJs:go,srcHtml:bo,srcTab:"js"},computed:{filteredTodos(){return this.filter==="active"?this.todos.filter(e=>!e.done):this.filter==="completed"?this.todos.filter(e=>e.done):this.todos},remaining(){return this.todos.filter(e=>!e.done).length},allDone(){return this.todos.length>0&&this.todos.every(e=>e.done)}},watch:{todos:{deep:!0,handler(e){xo(e)}}},methods:{add(){const e=this.newTodo.trim();e&&(this.todos=[...this.todos,{id:this._nextId++,text:e,done:!1}],this.newTodo="")},toggle(e){this.todos=this.todos.map(t=>t.id===e?{...t,done:!t.done}:t)},remove(e){this.todos=this.todos.filter(t=>t.id!==e)},clearCompleted(){this.todos=this.todos.filter(e=>!e.done)},toggleAll(){const e=this.allDone;this.todos=this.todos.map(t=>({...t,done:!e}))},startEdit(e){this.editingId=e.id,this.editText=e.text,this.$nextTick(()=>{var t;return(t=this.$refs["edit_"+e.id])==null?void 0:t.focus()})},commitEdit(e){const t=this.editText.trim();t?this.todos=this.todos.map(o=>o.id===e?{...o,text:t}:o):this.remove(e),this.editingId=null,this.editText=""},cancelEdit(){this.editingId=null,this.editText=""},setFilter(e){this.filter=e}},template:`
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
    `,onMount(){Z({title:"Demo — TODO App",description:"Interactive TODO app built with Courvux. Live demo with full source code (JS + HTML).",slug:"/demo"})}},wo=[{path:"/",component:Qt},{path:"/installation",component:eo},{path:"/quick-start",component:to},{path:"/template",component:oo},{path:"/components",component:no},{path:"/reactivity",component:ao},{path:"/lifecycle",component:ro},{path:"/composables",component:io},{path:"/event-bus",component:so},{path:"/router",component:co},{path:"/store",component:lo},{path:"/head",component:uo},{path:"/ssg",component:po},{path:"/devtools",component:mo},{path:"/testing",component:ho},{path:"/pwa",component:fo},{path:"/advanced",component:vo},{path:"/demo",component:ko}],Ao={methods:{goBack(){window.history.back()}},template:`
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
    `,onMount(){Z({title:"404 — Page not found",description:"The page you are looking for does not exist on Courvux docs.",slug:"/404"})}};let Me=null;function So(e){Me=e}const Eo=Tt([...wo,{path:"*",component:Ao}],{mode:"history",base:"/courvux",afterEach(){Me&&Me()},scrollBehavior:()=>{var e;return(e=document.querySelector("main"))==null||e.scrollTo({top:0,behavior:"instant"}),{x:0,y:0}}}),rt=[{key:"start",label:"Getting Started",items:[{to:"/",label:"Introduction"},{to:"/installation",label:"Installation"},{to:"/quick-start",label:"Quick Start"}]},{key:"template",label:"Template Syntax",items:[{to:"/template",label:"Directives & Bindings"}]},{key:"components",label:"Components",items:[{to:"/components",label:"Components"},{to:"/reactivity",label:"Reactivity"},{to:"/lifecycle",label:"Lifecycle"},{to:"/composables",label:"Composables"},{to:"/event-bus",label:"Event Bus"}]},{key:"router",label:"Router & Store",items:[{to:"/router",label:"Router"},{to:"/store",label:"Store"}]},{key:"seo",label:"SEO & SSG",items:[{to:"/head",label:"useHead"},{to:"/ssg",label:"Static Generation"}]},{key:"tooling",label:"Tooling",items:[{to:"/devtools",label:"DevTools"},{to:"/testing",label:"Testing"},{to:"/pwa",label:"PWA"}]},{key:"advanced",label:"Advanced",items:[{to:"/advanced",label:"Directives & Plugins"}]},{key:"demo",label:"Demo",items:[{to:"/demo",label:"⚡ TODO App"}]}];Ut({router:Eo,components:{"code-block":Jt},data:{nav:rt,open:rt.reduce((e,t)=>(e[t.key]=!0,e),{}),sidebarOpen:!1},methods:{toggle(e){this.open={...this.open,[e]:!this.open[e]}},toggleSidebar(){if(this.sidebarOpen=!this.sidebarOpen,this.sidebarOpen)document.body.style.overflow="hidden",this.$nextTick(()=>{const e=document.querySelector(".sidebar");e&&(e.style.transform="translateX(0)")});else{document.body.style.overflow="";const e=document.querySelector(".sidebar");e&&(e.style.transform="translateX(-100%)")}},closeSidebar(){if(window.innerWidth<=1024){this.sidebarOpen=!1,document.body.style.overflow="";const e=document.querySelector(".sidebar");e&&(e.style.transform="translateX(-100%)")}}},onMount(){So(()=>{this.closeSidebar()})},onBeforeMount(){typeof window<"u"&&window.addEventListener("resize",()=>{if(window.innerWidth>1024&&this.sidebarOpen){this.sidebarOpen=!1,document.body.style.overflow="";const e=document.querySelector(".sidebar");e&&(e.style.transform="")}})},template:`
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
                    <router-link to="/" @click="closeSidebar()" style="text-decoration:none; display:flex; align-items:center; gap:8px;" aria-label="Courvux v0.4.3 home">
                        <span style="font-size:1.3rem;" aria-hidden="true">⚡</span>
                        <span style="font-weight:700; font-size:15px; color:#111;">Courvux</span>
                        <span style="font-size:10px; color:#666; margin-left:2px;">v0.4.3</span>
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
                    <router-view />
                </div>
            </main>
        </div>
    `}).mount("#app");
