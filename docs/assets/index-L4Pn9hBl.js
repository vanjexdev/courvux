(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const y of s)if(y.type==="childList")for(const A of y.addedNodes)A.tagName==="LINK"&&A.rel==="modulepreload"&&i(A)}).observe(document,{childList:!0,subtree:!0});function o(s){const y={};return s.integrity&&(y.integrity=s.integrity),s.referrerPolicy&&(y.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?y.credentials="include":s.crossOrigin==="anonymous"?y.credentials="omit":y.credentials="same-origin",y}function i(s){if(s.ep)return;s.ep=!0;const y=o(s);fetch(s.href,y)}})();var bt=new Set(["push","pop","shift","unshift","splice","sort","reverse"]),it=e=>e instanceof Date||e instanceof RegExp||e instanceof Map||e instanceof Set||e instanceof WeakMap||e instanceof WeakSet||ArrayBuffer.isView(e)||e instanceof ArrayBuffer,je=new WeakSet,ke=Symbol("raw"),Ce=e=>e===null||typeof e!="object"?e:e[ke]??e,xe=0,Pe=new Map,fe=null;function Ie(e){const t=[],o=fe;fe=t;try{e()}finally{fe=o}return t}function yt(e){xe++;try{e()}finally{if(xe--,xe===0){const t=[...Pe.values()];Pe.clear(),t.forEach(o=>o())}}}function st(e,t){return e===null||typeof e!="object"||je.has(e)||it(e)?e:new Proxy(e,{get(o,i){if(i===ke)return o[ke]??o;if(typeof i=="string"&&Array.isArray(o)&&bt.has(i))return(...y)=>{const A=Array.prototype[i].apply(o,y);return t(),A};const s=o[i];return s!==null&&typeof s=="object"&&!je.has(s)?st(s,t):s},set(o,i,s){return o[i]=s,t(),!0}})}function Le(){const e={},t=Math.random().toString(36).slice(2),o=(y,A)=>(e[y]||(e[y]=new Set),e[y].add(A),()=>{var x;(x=e[y])==null||x.delete(A)}),i=y=>{xe>0?Pe.set(`${t}:${y}`,()=>{(e[y]?[...e[y]]:[]).forEach(A=>A())}):(e[y]?[...e[y]]:[]).forEach(A=>A())},s={};return{subscribe:o,createReactiveState:y=>new Proxy(y,{get(A,x){if(x===ke)return y;typeof x=="string"&&!x.startsWith("$")&&fe&&fe.push({sub:o,key:x});const R=A[x];return typeof x=="string"&&!x.startsWith("$")&&R!==null&&typeof R=="object"&&!je.has(R)&&!it(R)?st(R,()=>i(x)):R},set(A,x,R){if(s[x])return s[x](R),!0;const T=A[x];return A[x]=R,(T!==R||R!==null&&typeof R=="object")&&i(x),!0}}),registerSetInterceptor:(y,A)=>{s[y]=A},notifyAll:()=>{Object.keys(e).forEach(y=>i(y))}}}var Te=new WeakMap;function ve(e,t,o){var s,y;const i=t.indexOf(".");if(i>=0){const A=t.slice(0,i),x=t.slice(i+1),R=e[A];return R&&Te.has(R)?ve(R,x,o):((s=Te.get(e))==null?void 0:s(A,o))??(()=>{})}return((y=Te.get(e))==null?void 0:y(t,o))??(()=>{})}var ct=(e,t)=>e.split(".").reduce((o,i)=>o==null?void 0:o[i],t),lt=(()=>{try{return new Function("return 1")(),!0}catch{return console.warn("[courvux] CSP blocks eval. Expressions limited to property access and literals."),!1}})(),Re=new Map,ze=new Map,dt=(e,t)=>{const o=e.trim();if(o==="true")return!0;if(o==="false")return!1;if(o==="null")return null;if(o!=="undefined")return/^-?\d+(\.\d+)?$/.test(o)?parseFloat(o):/^(['"`])(.*)\1$/s.test(o)?o.slice(1,-1):o.startsWith("!")?!dt(o.slice(1).trim(),t):ct(o,t)},U=(e,t)=>{if(!lt)return dt(e,t);try{let o=Re.get(e);return o||(o=new Function("$data",`with($data) { return (${e}) }`),Re.set(e,o)),o(t)}catch{return ct(e,t)}},ue=(e,t,o)=>e.startsWith("$store.")&&t.store?t.storeSubscribeOverride?t.storeSubscribeOverride(t.store,e.slice(7),o):ve(t.store,e.slice(7),o):t.subscribe(e,o),Q=(e,t,o)=>{const i=new Set(["true","false","null","undefined","in","of","typeof","instanceof"]),s=e.match(/\$?[a-zA-Z_][\w$]*(?:\.\$?[a-zA-Z_][\w$]*)*/g)??[],y=[...new Set(s.map(x=>x.startsWith("$store.")?x:x.split(".")[0]).filter(x=>!i.has(x)))];if(y.length===0)return()=>{};const A=y.map(x=>ue(x,t,o));return()=>A.forEach(x=>x())},le=(e,t,o)=>{const i=e.split(".");if(i.length===1)t[i[0]]=o;else{const s=i.slice(0,-1).reduce((y,A)=>y==null?void 0:y[A],t);s&&(s[i[i.length-1]]=o)}},He=(e,t,o,i,s)=>{const y={};return Object.keys(e).forEach(A=>y[A]=e[A]),y[o]=t,s&&(y[s]=i),y},De=e=>e?typeof e=="string"?e:Array.isArray(e)?e.map(De).filter(Boolean).join(" "):typeof e=="object"?Object.entries(e).filter(([,t])=>!!t).map(([t])=>t).join(" "):"":"",Ne=(e,t,o)=>{if(!t){e.style.cssText=o;return}typeof t=="string"?e.style.cssText=o?`${o};${t}`:t:typeof t=="object"&&(o&&(e.style.cssText=o),Object.entries(t).forEach(([i,s])=>{e.style[i]=s??""}))},We=(e,t,o)=>{if(lt)try{let i=ze.get(e);i||(i=new Function("__p__",`with(__p__){${e}}`),ze.set(e,i));const s=new Proxy({},{has:()=>!0,get:(y,A)=>A==="$event"?o:A in t?t[A]:globalThis[A],set:(y,A,x)=>(t[A]=x,!0)});i(s)}catch(i){console.warn(`[courvux] handler error "${e}":`,i)}},ie=e=>{const t=getComputedStyle(e),o=Math.max(parseFloat(t.animationDuration)||0,parseFloat(t.transitionDuration)||0)*1e3;return o<=0?Promise.resolve():new Promise(i=>{const s=()=>i();e.addEventListener("animationend",s,{once:!0}),e.addEventListener("transitionend",s,{once:!0}),setTimeout(s,o+50)})},xt=`
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
`,Ue=!1;function Be(){if(Ue||typeof document>"u")return;Ue=!0;const e=document.createElement("style");e.id="cv-transitions-el",e.textContent=xt,document.head.appendChild(e)}var qe=!1;function wt(){if(qe||typeof document>"u")return;qe=!0;const e=document.createElement("style");e.id="cv-cloak-style",e.textContent="[cv-cloak]{display:none!important}",document.head.appendChild(e)}function kt(e){if(typeof window<"u"&&"Sanitizer"in window){const o=document.createElement("div");return o.setHTML(e,{sanitizer:new window.Sanitizer}),o.innerHTML}const t=new DOMParser().parseFromString(e,"text/html");return t.querySelectorAll("script,iframe,object,embed,form,meta,link,style").forEach(o=>o.remove()),t.querySelectorAll("*").forEach(o=>{Array.from(o.attributes).forEach(i=>{(i.name.startsWith("on")||i.value.trim().toLowerCase().startsWith("javascript:"))&&o.removeAttribute(i.name)})}),t.body.innerHTML}async function oe(e,t,o){var y,A,x,R,T,E,D,C,M,z,F,I,_,c,l,p,w;const i=Array.from(e.childNodes);let s=0;for(;s<i.length;){const k=i[s];if(k.nodeType===3){const r=k.textContent||"",d=r.match(/\{\{([\s\S]+?)\}\}/g);if(d){const a=r,f=()=>{let m=a;d.forEach(u=>{const h=u.replace(/^\{\{\s*/,"").replace(/\s*\}\}$/,"");m=m.replace(u,U(h,t)??"")}),k.textContent=m};d.forEach(m=>{Q(m.replace(/^\{\{\s*/,"").replace(/\s*\}\}$/,""),o,f)}),f()}s++;continue}if(k.nodeType!==1){s++;continue}const n=k,g=n.tagName.toLowerCase();if(n.hasAttribute("cv-pre")){n.removeAttribute("cv-pre"),s++;continue}if(n.hasAttribute("cv-once")){n.removeAttribute("cv-once"),await oe(n,t,{...o,subscribe:()=>()=>{},storeSubscribeOverride:()=>()=>{}}),s++;continue}if(n.hasAttribute("cv-cloak")&&n.removeAttribute("cv-cloak"),n.hasAttribute("cv-teleport")){const r=n.getAttribute("cv-teleport");n.removeAttribute("cv-teleport");const d=document.querySelector(r)??document.body,a=document.createComment(`cv-teleport: ${r}`);n.replaceWith(a),await oe(n,t,o),d.appendChild(n),s++;continue}if(n.hasAttribute("cv-memo")){const r=n.getAttribute("cv-memo");n.removeAttribute("cv-memo");const d=()=>r.split(",").map(h=>U(h.trim(),t));let a=d();const f=[],m=h=>(f.push(h),()=>{const v=f.indexOf(h);v>-1&&f.splice(v,1)});await oe(n,t,{...o,subscribe:(h,v)=>m(v),storeSubscribeOverride:(h,v,$)=>m($)});const u=Q(r,o,()=>{const h=d();h.some((v,$)=>v!==a[$])&&(a=h,[...f].forEach(v=>v()))});(y=o.registerCleanup)==null||y.call(o,()=>u()),s++;continue}if(n.hasAttribute("cv-data")){const r=n.getAttribute("cv-data").trim();n.removeAttribute("cv-data");let d={},a={};if(r.startsWith("{")){const f=U(r,t)??{};Object.entries(f).forEach(([m,u])=>{typeof u=="function"?a[m]=u:d[m]=u})}else if(r){const f=(A=o.components)==null?void 0:A[r];if(f){const m=typeof f.data=="function"?f.data():f.data??{};m instanceof Promise||Object.assign(d,m),Object.assign(a,f.methods??{})}}if(o.createChildScope){const f=o.createChildScope(d,a);(x=o.registerCleanup)==null||x.call(o,f.cleanup),await oe(n,f.state,{...o,subscribe:f.subscribe})}else await oe(n,{...t,...d,...a},o);s++;continue}if(n.hasAttribute("cv-for")){const r=n.getAttribute("cv-for");n.removeAttribute("cv-for");const d=r.match(/^\(?(\w+)(?:,\s*(\w+))?\)?\s+in\s+(.+)$/);if(d){const[,a,f,m]=d,u=n.getAttribute(":key")??null;u&&n.removeAttribute(":key");const h=n.getAttribute("cv-transition")??null;h&&n.removeAttribute("cv-transition");const v=document.createComment(`cv-for: ${m}`);n.replaceWith(v);let $=[],j=[];const P=new Map,W=async()=>{var G;const N=U(m,t),O=N?typeof N=="number"?Array.from({length:N},(B,H)=>[H+1,H]):Array.isArray(N)?N.map((B,H)=>[B,H]):Object.entries(N).map(([B,H])=>[H,B]):[];if(u){const B=[],H=new Map,J=new Set;for(const[X,Y]of O){const ae=U(u,He(t,X,a,Y,f));J.has(ae)&&console.warn(`[courvux] cv-for: duplicate :key "${ae}" in "${m}"`),J.add(ae),B.push(ae),H.set(ae,[X,Y])}const q=[];for(const[X,{el:Y,destroy:ae}]of P)H.has(X)||(h?(Y.classList.add(`${h}-leave`),q.push(ie(Y).then(()=>{var re;Y.classList.remove(`${h}-leave`),ae(),(re=Y.parentNode)==null||re.removeChild(Y),P.delete(X)}))):(ae(),(G=Y.parentNode)==null||G.removeChild(Y),P.delete(X)));q.length&&await Promise.all(q);const V=v.parentNode,te=[];for(const X of B){const[Y,ae]=H.get(X);if(P.has(X)){const re=P.get(X);re.itemRef!==Y&&(re.reactive[a]=Y,re.itemRef=Y),f&&(re.reactive[f]=ae)}else{const re=n.cloneNode(!0),Se=[],{subscribe:ht,createReactiveState:ft}=Le(),Ee=ft({[a]:Y,...f?{[f]:ae}:{}}),vt=new Proxy({},{has(se,ee){return!0},get(se,ee){return typeof ee!="string"?t[ee]:ee===a||f&&ee===f?Ee[ee]:t[ee]},set(se,ee,ce){return ee===a||f&&ee===f?(Ee[ee]=ce,!0):(t[ee]=ce,!0)}}),gt={...o,subscribe:(se,ee)=>{const ce=se.split(".")[0];let de;return ce===a||f&&ce===f?de=ht(ce,ee):de=o.subscribe(se,ee),Se.push(de),de},storeSubscribeOverride:(se,ee,ce)=>{const de=ve(se,ee,ce);return Se.push(de),de}},_e=document.createDocumentFragment();_e.appendChild(re),await oe(_e,vt,gt);const $e=_e.firstChild??re;h&&$e.classList.add(`${h}-enter`),P.set(X,{el:$e,reactive:Ee,itemRef:Y,destroy:()=>Se.forEach(se=>se())}),h&&te.push($e)}}let K=v.nextSibling,pe=0;for(const X of B){const{el:Y}=P.get(X);Y!==K?pe++:K=Y.nextSibling}if(pe>0)if(pe>B.length>>1){const X=document.createDocumentFragment();for(const Y of B)X.appendChild(P.get(Y).el);V.insertBefore(X,v.nextSibling)}else{K=v.nextSibling;for(const X of B){const{el:Y}=P.get(X);Y!==K?V.insertBefore(Y,K):K=Y.nextSibling}}$=B.map(X=>P.get(X).el),te.length&&Promise.all(te.map(X=>ie(X).then(()=>X.classList.remove(`${h}-enter`))))}else{if(j.forEach(q=>q()),j=[],$.forEach(q=>{var V;return(V=q.parentNode)==null?void 0:V.removeChild(q)}),$=[],!O.length)return;const B=v.parentNode,H=v.nextSibling,J={...o,subscribe:(q,V)=>{const te=o.subscribe(q,V);return j.push(te),te},storeSubscribeOverride:(q,V,te)=>{const K=ve(q,V,te);return j.push(K),K}};for(const[q,V]of O){const te=n.cloneNode(!0),K=document.createDocumentFragment();K.appendChild(te),await oe(K,He(t,q,a,V,f),J);const pe=K.firstChild??te;B.insertBefore(K,H),$.push(pe)}}};(R=o.registerCleanup)==null||R.call(o,()=>{P.forEach(({el:N,destroy:O})=>{var G;O(),(G=N.parentNode)==null||G.removeChild(N)}),P.clear(),j.forEach(N=>N()),$.forEach(N=>{var O;return(O=N.parentNode)==null?void 0:O.removeChild(N)}),$=[]}),Q(m,o,W),await W()}s++;continue}if(n.hasAttribute("cv-if")){const r=[],d=n.getAttribute("cv-if");n.removeAttribute("cv-if");const a=document.createComment("cv-if");n.replaceWith(a),r.push({condition:d,template:n,anchor:a});let f=s+1;for(;f<i.length;){const $=i[f];if($.nodeType===3&&(((T=$.textContent)==null?void 0:T.trim())??"")===""){f++;continue}if($.nodeType!==1)break;const j=$;if(j.hasAttribute("cv-else-if")){const P=j.getAttribute("cv-else-if");j.removeAttribute("cv-else-if");const W=document.createComment("cv-else-if");j.replaceWith(W),r.push({condition:P,template:j,anchor:W}),f++;continue}if(j.hasAttribute("cv-else")){j.removeAttribute("cv-else");const P=document.createComment("cv-else");j.replaceWith(P),r.push({condition:null,template:j,anchor:P}),f++;break}break}s=f;let m=null,u=!1,h=!1;const v=async()=>{var $,j;if(u){h=!0;return}u=!0;try{do{h=!1,m&&(($=m.parentNode)==null||$.removeChild(m),m=null);for(const P of r)if(P.condition===null||U(P.condition,t)){const W=P.template.cloneNode(!0),N=document.createDocumentFragment();N.appendChild(W),await oe(N,t,o);const O=N.firstChild??W;(j=P.anchor.parentNode)==null||j.insertBefore(N,P.anchor.nextSibling),m=O;break}}while(h)}finally{u=!1}};r.filter($=>$.condition).forEach($=>{Q($.condition,o,v)}),await v();continue}if(n.hasAttribute("cv-show")){const r=n.getAttribute("cv-show");n.removeAttribute("cv-show");const d=Array.from(n.attributes).filter(a=>a.name==="cv-transition"||a.name.startsWith("cv-transition:")||a.name.startsWith("cv-transition."));if(d.length>0){const a=O=>(n.getAttribute(O)??"").split(" ").filter(Boolean),f=a("cv-transition:enter"),m=a("cv-transition:enter-start"),u=a("cv-transition:enter-end"),h=a("cv-transition:leave"),v=a("cv-transition:leave-start"),$=a("cv-transition:leave-end"),j=n.getAttribute("cv-transition")??"",P=new Set(j.split(".").slice(1)),W=[...P].find(O=>/^\d+$/.test(O)),N=W?parseInt(W):200;if(f.length||m.length||h.length||v.length){d.forEach(q=>n.removeAttribute(q.name));const O=()=>new Promise(q=>requestAnimationFrame(()=>requestAnimationFrame(()=>q())));let G=!!U(r,t),B=!1,H=null;const J=async q=>{if(B){H=q;return}B=!0;try{q?(n.style.display="",n.classList.add(...f,...m),await O(),n.classList.remove(...m),n.classList.add(...u),await ie(n),n.classList.remove(...f,...u)):(n.classList.add(...h,...v),await O(),n.classList.remove(...v),n.classList.add(...$),await ie(n),n.classList.remove(...h,...$),n.style.display="none"),G=q}finally{if(B=!1,H!==null&&H!==G){const V=H;H=null,J(V)}else H=null}};G||(n.style.display="none"),Q(r,o,()=>{const q=!!U(r,t);q!==G&&J(q)})}else{const O=[...P].find(V=>V==="scale"||/^scale$/.test(V)),G=(()=>{const V=[...P].find(te=>/^\d+$/.test(te)&&te!==W);return V?parseInt(V)/100:.9})(),B=[];(!P.has("scale")||P.has("opacity"))&&B.push(`opacity ${N}ms ease`),O&&B.push(`transform ${N}ms ease`),B.length||B.push(`opacity ${N}ms ease`),n.style.transition=(n.style.transition?n.style.transition+", ":"")+B.join(", "),d.forEach(V=>n.removeAttribute(V.name));let H=!!U(r,t);const J=()=>new Promise(V=>requestAnimationFrame(()=>requestAnimationFrame(()=>V()))),q=async V=>{V?(n.style.display="",n.style.opacity="0",O&&(n.style.transform=`scale(${G})`),await J(),n.style.opacity="",O&&(n.style.transform=""),await ie(n)):(n.style.opacity="0",O&&(n.style.transform=`scale(${G})`),await ie(n),n.style.display="none",n.style.opacity="",O&&(n.style.transform="")),H=V};H||(n.style.display="none"),Q(r,o,()=>{const V=!!U(r,t);V!==H&&q(V)})}}else{const a=n.getAttribute("cv-show-transition"),f=n.getAttribute(":transition");a&&n.removeAttribute("cv-show-transition"),f&&n.removeAttribute(":transition");const m=a??(f?String(U(f,t)):null);if(m){Be();let u=!!U(r,t);u||(n.style.display="none");let h=!1,v=null;const $=async j=>{if(h){v=j;return}h=!0;try{j?(n.style.display="",n.classList.add(`${m}-enter`),await ie(n),n.classList.remove(`${m}-enter`)):(n.classList.add(`${m}-leave`),await ie(n),n.classList.remove(`${m}-leave`),n.style.display="none"),u=j}finally{if(h=!1,v!==null&&v!==u){const P=v;v=null,$(P)}else v=null}};Q(r,o,()=>{const j=!!U(r,t);j!==u&&$(j)})}else{const u=()=>{n.style.display=U(r,t)?"":"none"};Q(r,o,u),u()}}}if(n.hasAttribute("cv-focus")){const r=n.getAttribute("cv-focus")??"";if(n.removeAttribute("cv-focus"),!r)Promise.resolve().then(()=>n.focus());else{const d=()=>{U(r,t)&&Promise.resolve().then(()=>n.focus())};Q(r,o,d),d()}}{const r=Array.from(n.attributes).filter(d=>d.name==="cv-intersect"||d.name.startsWith("cv-intersect:")||d.name.startsWith("cv-intersect."));if(r.length&&typeof IntersectionObserver<"u"){const d=r.find(O=>O.name==="cv-intersect"||O.name==="cv-intersect:enter"||O.name.startsWith("cv-intersect.")),a=r.find(O=>O.name==="cv-intersect:leave"),f=(d==null?void 0:d.value)??"",m=(a==null?void 0:a.value)??"",u=((d==null?void 0:d.name)??"cv-intersect").split("."),h=new Set(u.slice(1)),v=h.has("once");let $=0;if(h.has("half"))$=.5;else if(h.has("full"))$=1;else{const O=[...h].find(G=>G.startsWith("threshold-"));O&&($=parseInt(O.replace("threshold-",""))/100)}const j=[...h].find(O=>O.startsWith("margin-")),P=j?`${j.replace("margin-","")}px`:void 0;r.forEach(O=>n.removeAttribute(O.name));const W=O=>{if(O)try{new Function("$data",`with($data){${O}}`)(t)}catch(G){console.warn(`[courvux] cv-intersect error "${O}":`,G)}},N=new IntersectionObserver(O=>{O.forEach(G=>{G.isIntersecting?(W(f),v&&N.disconnect()):W(m)})},{threshold:$,...P?{rootMargin:P}:{}});N.observe(n),(E=o.registerCleanup)==null||E.call(o,()=>N.disconnect())}}{const r=Array.from(n.attributes).find(d=>d.name==="cv-html"||d.name.startsWith("cv-html."));if(r){const d=r.value;n.removeAttribute(r.name);const a=r.name.split(".").slice(1).includes("sanitize"),f=()=>{const m=String(U(d,t)??"");n.innerHTML=a?kt(m):m};Q(d,o,f),f(),s++;continue}}if(n.hasAttribute("cv-ref")&&!((D=o.components)!=null&&D[g])){const r=n.getAttribute("cv-ref");n.removeAttribute("cv-ref"),o.refs&&(o.refs[r]=n)}const b=!!((C=o.components)!=null&&C[g]),S=Array.from(n.attributes).find(r=>r.name==="cv-model"||r.name.startsWith("cv-model."));if(S&&!b){const r=S.value;n.removeAttribute(S.name);const d=new Set(S.name.split(".").slice(1)),a=n,f=(M=a.type)==null?void 0:M.toLowerCase(),m=u=>{if(d.has("number")){const h=parseFloat(u);return isNaN(h)?u:h}return d.has("trim")?u.trim():u};if(f==="checkbox"){const u=()=>{const h=U(r,t);a.checked=Array.isArray(h)?h.includes(a.value):!!h};ue(r,o,u),u(),a.addEventListener("change",()=>{const h=U(r,t);if(Array.isArray(h)){const v=[...h];if(a.checked)v.includes(a.value)||v.push(a.value);else{const $=v.indexOf(a.value);$>-1&&v.splice($,1)}le(r,t,v)}else le(r,t,a.checked)})}else if(f==="radio"){const u=()=>{a.checked=U(r,t)===a.value};ue(r,o,u),u(),a.addEventListener("change",()=>{a.checked&&le(r,t,m(a.value))})}else if(n.hasAttribute("contenteditable")){const u=n,h=()=>{const v=String(U(r,t)??"");u.innerText!==v&&(u.innerText=v)};if(ue(r,o,h),h(),d.has("debounce")){const v=[...d].find(P=>/^\d+$/.test(P)),$=v?parseInt(v):300;let j;u.addEventListener("input",()=>{clearTimeout(j),j=setTimeout(()=>le(r,t,m(u.innerText)),$)})}else{const v=d.has("lazy")?"blur":"input";u.addEventListener(v,()=>le(r,t,m(u.innerText)))}}else{const u=()=>{a.value=U(r,t)??""};if(ue(r,o,u),u(),d.has("debounce")){const h=[...d].find(j=>/^\d+$/.test(j)),v=h?parseInt(h):300;let $;a.addEventListener("input",()=>{clearTimeout($),$=setTimeout(()=>le(r,t,m(a.value)),v)})}else{const h=g==="select"||d.has("lazy")?"change":"input";a.addEventListener(h,()=>le(r,t,m(a.value)))}}}if(o.directives&&Array.from(n.attributes).forEach(r=>{var W,N;if(!r.name.startsWith("cv-"))return;const d=r.name.slice(3).split("."),a=d[0],f=d.slice(1),m=a.indexOf(":"),u=m>=0?a.slice(0,m):a,h=m>=0?a.slice(m+1):void 0,v=o.directives[u];if(!v)return;const $=r.value;n.removeAttribute(r.name);const j=typeof v=="function"?{onMount:v}:v,P={value:$?U($,t):void 0,arg:h,modifiers:Object.fromEntries(f.map(O=>[O,!0]))};(W=j.onMount)==null||W.call(j,n,P),j.onUpdate&&$&&Q($,o,()=>{P.value=U($,t),j.onUpdate(n,P)}),j.onDestroy&&((N=o.registerCleanup)==null||N.call(o,()=>j.onDestroy(n,P)))}),g==="slot"){const r=n.getAttribute("name")??"default",d=(z=o.slots)==null?void 0:z[r];if(d){const a={};Array.from(n.attributes).forEach(u=>{u.name.startsWith(":")&&(a[u.name.slice(1)]=U(u.value,t))});const f=await d(a),m=document.createDocumentFragment();f.forEach(u=>m.appendChild(u)),n.replaceWith(m)}else{const a=document.createDocumentFragment();for(;n.firstChild;)a.appendChild(n.firstChild);await oe(a,t,o),n.replaceWith(a)}s++;continue}if(g==="cv-transition"){Be();const r=n.getAttribute("name")??"fade",d=n.getAttribute(":show")??null;n.removeAttribute("name"),d&&n.removeAttribute(":show");const a=document.createElement("div");for(a.className="cv-t-wrap";n.firstChild;)a.appendChild(n.firstChild);if(n.replaceWith(a),await oe(a,t,o),d){let f=!!U(d,t),m=!1,u=null;f||(a.style.display="none");const h=async v=>{if(m){u=v;return}m=!0;try{v?(a.style.display="",a.classList.add(`${r}-enter`),await ie(a),a.classList.remove(`${r}-enter`)):(a.classList.add(`${r}-leave`),await ie(a),a.classList.remove(`${r}-leave`),a.style.display="none"),f=v}finally{if(m=!1,u!==null&&u!==f){const $=u;u=null,h($)}else u=null}};Q(d,o,()=>{const v=!!U(d,t);v!==f&&h(v)})}s++;continue}if(g==="router-view"&&o.mountRouterView){const r=n.getAttribute("name")??void 0;n.setAttribute("aria-live","polite"),n.setAttribute("aria-atomic","true"),await o.mountRouterView(n,r),s++;continue}if(g==="router-link"){const r=n.getAttribute(":to"),d=n.getAttribute("to"),a=()=>r?String(U(r,t)??"/"):d||"/",f=O=>String(O).replace(/[&"<>]/g,G=>({"&":"&amp;",'"':"&quot;","<":"&lt;",">":"&gt;"})[G]);let m="";Array.from(n.attributes).forEach(O=>{O.name==="to"||O.name===":to"||(m+=` ${O.name}="${f(O.value)}"`)});const u=document.createElement("div");u.innerHTML=`<a${m}></a>`;const h=u.firstElementChild;for(;n.firstChild;)h.appendChild(n.firstChild);const v=((F=o.router)==null?void 0:F.base)??"",$=O=>v?O===v?"/":O.startsWith(v+"/")?O.slice(v.length)||"/":O||"/":O||"/",j=()=>{var O;return((O=o.router)==null?void 0:O.mode)==="history"?$(window.location.pathname):window.location.hash.slice(1)||"/"},P=()=>{var B;const O=a(),G=j()===O;((B=o.router)==null?void 0:B.mode)==="history"?h.href=`${v}${O}`:h.href=`#${O}`,G?(h.setAttribute("aria-current","page"),h.classList.add("active")):(h.removeAttribute("aria-current"),h.classList.remove("active"))};((I=o.router)==null?void 0:I.mode)==="history"?(h.addEventListener("click",O=>{O.preventDefault(),o.router.navigate(a())}),window.addEventListener("popstate",P)):window.addEventListener("hashchange",P),r&&ue(r,o,P),P();const W=document.createDocumentFragment();W.appendChild(h),await oe(W,t,o);const N=W.firstChild??h;n.replaceWith(N),s++;continue}if(g==="component"&&n.hasAttribute(":is")&&o.mountDynamic){const r=n.getAttribute(":is");n.removeAttribute(":is");const d=document.createComment("component:is");n.replaceWith(d),await o.mountDynamic(d,r,n,t,o),s++;continue}if((_=o.components)!=null&&_[g]&&o.mountElement){await o.mountElement(n,g,t,o),s++;continue}{const r=Array.from(n.attributes).find(d=>d.name==="cv-intersect"||d.name.startsWith("cv-intersect."));if(r&&typeof IntersectionObserver<"u"){const d=new Set(r.name.split(".").slice(1));n.removeAttribute(r.name);const a=U(r.value,t);let f,m=0,u="0px",h=d.has("once");if(typeof a=="function"?f=v=>a.call(t,v):a&&typeof a=="object"&&(typeof a.handler=="function"&&(f=v=>a.handler.call(t,v)),a.threshold!==void 0&&(m=a.threshold),a.margin&&(u=a.margin),a.once&&(h=!0)),f){const v=new IntersectionObserver($=>{const j=$[0];f(j),h&&j.isIntersecting&&v.disconnect()},{threshold:m,rootMargin:u});v.observe(n),(c=o.registerCleanup)==null||c.call(o,()=>v.disconnect())}}}if(n.hasAttribute("cv-resize")){const r=n.getAttribute("cv-resize");if(n.removeAttribute("cv-resize"),typeof ResizeObserver<"u"){const d=U(r,t);let a,f="content-box";if(typeof d=="function"?a=m=>d.call(t,m):d&&typeof d=="object"&&(typeof d.handler=="function"&&(a=m=>d.handler.call(t,m)),d.box&&(f=d.box)),a){const m=new ResizeObserver(u=>{u[0]&&a(u[0])});m.observe(n,{box:f}),(l=o.registerCleanup)==null||l.call(o,()=>m.disconnect())}}}if(n.hasAttribute("cv-scroll")){const r=n.getAttribute("cv-scroll");n.removeAttribute("cv-scroll");const d=U(r,t);let a,f=0;if(typeof d=="function"?a=m=>d.call(t,m):d&&typeof d=="object"&&(typeof d.handler=="function"&&(a=m=>d.handler.call(t,m)),d.throttle&&(f=d.throttle)),a){let m=0;const u=()=>{const h=Date.now();f>0&&h-m<f||(m=h,a({scrollTop:n.scrollTop,scrollLeft:n.scrollLeft,scrollHeight:n.scrollHeight,scrollWidth:n.scrollWidth,clientHeight:n.clientHeight,clientWidth:n.clientWidth}))};n.addEventListener("scroll",u,{passive:!0}),(p=o.registerCleanup)==null||p.call(o,()=>n.removeEventListener("scroll",u))}}if(n.hasAttribute("cv-clickoutside")){const r=n.getAttribute("cv-clickoutside");n.removeAttribute("cv-clickoutside");const d=a=>{n.contains(a.target)||(typeof t[r]=="function"?t[r].call(t,a):We(r,t,a))};document.addEventListener("click",d,!0),(w=o.registerCleanup)==null||w.call(o,()=>document.removeEventListener("click",d,!0))}if(n.hasAttribute("cv-bind")){const r=n.getAttribute("cv-bind");n.removeAttribute("cv-bind");const d=n.getAttribute("class")??"",a=n.getAttribute("style")??"";let f=[];const m=()=>{const u=U(r,t)??{},h=Object.keys(u);for(const v of f)v in u||(v==="class"?n.className=d:v==="style"?n.style.cssText=a:n.removeAttribute(v));for(const[v,$]of Object.entries(u))if(v==="class")n.className=[d,De($)].filter(Boolean).join(" ");else if(v==="style")Ne(n,$,a);else if($==null||$===!1)try{n.removeAttribute(v)}catch{}else try{n.setAttribute(v,$===!0?"":String($))}catch(j){console.warn(`[courvux] cv-bind: skipping invalid attribute name "${v}":`,j)}f=h};Q(r,o,m),m()}const L={enter:"Enter",esc:"Escape",escape:"Escape",space:" ",tab:"Tab",delete:"Delete",backspace:"Backspace",up:"ArrowUp",down:"ArrowDown",left:"ArrowLeft",right:"ArrowRight"};Array.from(n.attributes).forEach(r=>{if(r.name.startsWith("@")||r.name.startsWith("cv:on:")){const d=(r.name.startsWith("@")?r.name.substring(1):r.name.substring(6)).split("."),a=d[0],f=new Set(d.slice(1)),m=[...f].find($=>$ in L),u=r.value,h=$=>{f.has("prevent")&&$.preventDefault(),f.has("stop")&&$.stopPropagation(),!(f.has("self")&&$.target!==$.currentTarget)&&(m&&$.key!==L[m]||(typeof t[u]=="function"?t[u].call(t,$):We(u,t,$)))},v={};f.has("once")&&(v.once=!0),f.has("passive")&&(v.passive=!0),f.has("capture")&&(v.capture=!0),n.addEventListener(a,h,Object.keys(v).length?v:void 0)}else if(r.name.startsWith(":")){const d=r.name.slice(1),a=r.value;if(d==="class"){const f=n.getAttribute("class")??"",m=()=>{n.className=[f,De(U(a,t))].filter(Boolean).join(" ")};Q(a,o,m),m()}else if(d==="style"){const f=n.getAttribute("style")??"",m=()=>Ne(n,U(a,t),f);Q(a,o,m),m()}else if(d.includes("-")){const f=()=>{const m=U(a,t);m==null||m===!1?n.removeAttribute(d):n.setAttribute(d,m===!0?"":String(m))};Q(a,o,f),f()}else{const f=()=>{n[d]=U(a,t)??""};Q(a,o,f),f()}}}),k.hasChildNodes()&&await oe(k,t,o),s++}}var At=`
router-view.fade-leave{animation:cv-fade-out 0.25s forwards}
router-view.fade-enter{animation:cv-fade-in 0.25s forwards}
router-view.slide-up-leave{animation:cv-slide-up-out 0.25s forwards}
router-view.slide-up-enter{animation:cv-slide-up-in 0.25s forwards}
@keyframes cv-fade-out{to{opacity:0}}
@keyframes cv-fade-in{from{opacity:0}}
@keyframes cv-slide-up-out{to{opacity:0;transform:translateY(-12px)}}
@keyframes cv-slide-up-in{from{opacity:0;transform:translateY(12px)}}
`;function St(){if(document.getElementById("cv-transitions"))return;const e=document.createElement("style");e.id="cv-transitions",e.textContent=At,document.head.appendChild(e)}async function ge(e,t,o){e.classList.add(`${t}-${o}`);const i=getComputedStyle(e),s=Math.max(parseFloat(i.animationDuration)||0,parseFloat(i.transitionDuration)||0)*1e3;s>0&&await new Promise(y=>{const A=()=>y();e.addEventListener("animationend",A,{once:!0}),e.addEventListener("transitionend",A,{once:!0}),setTimeout(A,s+50)}),e.classList.remove(`${t}-${o}`)}var we=new Map;async function Et(e){if(typeof e!="function")return e;if(we.has(e))return we.get(e);const t=await e();return we.set(e,t.default),t.default}function Ve(e,t){if(e.components)return e.components[t];if(t==="default")return e.component}function Ge(e,t){if(e==="*")return{};const o=[],i=e.replace(/:(\w+)/g,(y,A)=>(o.push(A),"([^/]+)")),s=t.match(new RegExp(`^${i}$`));return s?Object.fromEntries(o.map((y,A)=>[y,s[A+1]])):null}function _t(e,t){if(e==="/")return{params:{},remaining:t};const o=[],i=e.replace(/:(\w+)/g,(y,A)=>(o.push(A),"([^/]+)")),s=t.match(new RegExp(`^${i}(/.+)?$`));return s?{params:Object.fromEntries(o.map((y,A)=>[y,s[A+1]])),remaining:s[o.length+1]||"/"}:null}function ut(e,t=""){return e.map(o=>{var s;if(o.path==="*")return o;const i=((t.endsWith("/")?t.slice(0,-1):t)+o.path).replace(/\/+/g,"/")||"/";return(s=o.children)!=null&&s.length?{...o,path:i,children:ut(o.children,i==="/"?"":i)}:{...o,path:i}})}var me=(e,t)=>new Promise(o=>e(t,o)),Ye=(e,t)=>e!=null&&e.beforeLeave?new Promise(o=>e.beforeLeave(t,o)):Promise.resolve(void 0);function $t(e,t={}){const o=t.mode??"hash",i=Ct(t.base??"");return{routes:ut(e),mode:o,base:i,transition:t.transition,beforeEach:t.beforeEach,afterEach:t.afterEach,scrollBehavior:t.scrollBehavior,navigate(s,y){const A=Xe(s,y==null?void 0:y.query);o==="history"?(history.pushState({},"",`${i}${A}`),window.dispatchEvent(new PopStateEvent("popstate"))):window.location.hash=A},replace(s,y){const A=Xe(s,y==null?void 0:y.query);if(o==="history")history.replaceState({},"",`${i}${A}`),window.dispatchEvent(new PopStateEvent("popstate"));else{const x=window.location.href.split("#")[0];window.location.replace(`${x}#${A}`)}},back(){history.back()},forward(){history.forward()}}}function Ct(e){if(!e||e==="/")return"";let t=e.startsWith("/")?e:`/${e}`;return t.endsWith("/")&&(t=t.slice(0,-1)),t}function Tt(e,t){return t?e===t?"/":e.startsWith(t+"/")?e.slice(t.length)||"/":e||"/":e||"/"}function Xe(e,t){return!t||!Object.keys(t).length?e:`${e}?${new URLSearchParams(t).toString()}`}function Ze(e){if(!e)return{};const t=new URLSearchParams(e.startsWith("?")?e.slice(1):e),o={};return t.forEach((i,s)=>{o[s]=i}),o}function Je(e,t,o,i="default",s){const y=t.base??"",A=p=>p.length>1&&p.endsWith("/")?p.slice(0,-1):p,x=()=>t.mode==="history"?A(Tt(window.location.pathname,y)):A((window.location.hash.slice(1)||"/").split("?")[0]||"/"),R=()=>{if(t.mode==="history")return Ze(window.location.search);const p=window.location.hash.slice(1)||"/",w=p.indexOf("?");return w>=0?Ze(p.slice(w+1)):{}};t.transition&&St();let T=null,E=null,D=null,C=null,M=!1;const z=()=>{M||(M=!0,s==null||s())},F=new Map,I=p=>{var w;if(p!=null&&p.keepAlive&&D){(w=D.deactivate)==null||w.call(D);const k=document.createDocumentFragment();for(;e.firstChild;)k.appendChild(e.firstChild);F.set(T.path,{fragment:k,activation:D}),D=null}else D==null||D.destroy(),D=null,e.innerHTML=""},_=async(p,w,k,n,g)=>{const b=typeof w=="function"&&!we.has(w),S=b?w.__asyncOptions:void 0,L=p.loadingTemplate??(S==null?void 0:S.loadingTemplate);b&&L&&(e.innerHTML=L);let r;try{r=await Et(w)}catch(d){const a=S==null?void 0:S.errorTemplate;if(a)return e.innerHTML=a,{destroy:()=>{e.innerHTML=""}};throw d}return b&&L&&(e.innerHTML=""),o(e,r,k,n,g)},c=async()=>{var k,n,g,b,S,L,r,d;const p=x(),w=R();for(const a of t.routes){if((k=a.children)!=null&&k.length){const m=_t(a.path,p);if(m!==null)for(const u of a.children){const h=Ge(u.path,p);if(h!==null){const v={params:m.params,query:w,path:p,meta:a.meta};if(u.redirect){const W={params:h,query:w,path:p,meta:u.meta},N=typeof u.redirect=="function"?u.redirect(W):u.redirect;t.navigate(N);return}if(t.beforeEach){const W=await me(t.beforeEach,v);if(W){t.navigate(W);return}}if(a.beforeEnter){const W=await me(a.beforeEnter,v);if(W){t.navigate(W);return}}if(u.beforeEnter){const W={params:h,query:w,path:p,meta:u.meta},N=await me(u.beforeEnter,W);if(N){t.navigate(N);return}}const $=`${a.path}::${JSON.stringify(m.params)}`;if(C!==$){const W=await Ye(D,v);if(W){t.navigate(W);return}const N=a.transition??t.transition;N&&e.hasChildNodes()&&await ge(e,N,"leave"),I(E);const O=Ve(a,i);if(O){const G={routes:a.children,mode:t.mode,base:t.base,transition:a.transition??t.transition,beforeEach:t.beforeEach,afterEach:t.afterEach,scrollBehavior:t.scrollBehavior,navigate:(B,H)=>t.navigate(B,H),replace:(B,H)=>t.replace(B,H),back:()=>t.back(),forward:()=>t.forward()};D=await _(a,O,v,i==="default"?a.layout:void 0,i==="default"?G:void 0),(n=D.enter)==null||n.call(D,T)}else e.innerHTML="";C=$,N&&await ge(e,N,"enter")}const j={params:{...m.params,...h},query:w,path:p,meta:u.meta??a.meta};(g=t.afterEach)==null||g.call(t,j,T);const P=(b=t.scrollBehavior)==null?void 0:b.call(t,j,T);P&&window.scrollTo(P.x??0,P.y??0),T=j,E=a,z();return}}}const f=Ge(a.path,p);if(f!==null){C=null;const m={params:f,query:w,path:p,meta:a.meta};if(a.redirect){const j=typeof a.redirect=="function"?a.redirect(m):a.redirect;t.navigate(j);return}if(t.beforeEach){const j=await me(t.beforeEach,m);if(j){t.navigate(j);return}}if(a.beforeEnter){const j=await me(a.beforeEnter,m);if(j){t.navigate(j);return}}const u=await Ye(D,m);if(u){t.navigate(u);return}const h=a.transition??t.transition;h&&e.hasChildNodes()&&await ge(e,h,"leave"),I(E);const v=Ve(a,i);if(v){const j=m.path;if(a.keepAlive&&F.has(j)){const P=F.get(j);e.appendChild(P.fragment),D=P.activation,(S=D.activate)==null||S.call(D),F.delete(j)}else{const P=T;D=await _(a,v,m,i==="default"?a.layout:void 0),(L=D.enter)==null||L.call(D,P)}}else e.innerHTML="",D=null;h&&await ge(e,h,"enter"),(r=t.afterEach)==null||r.call(t,m,T);const $=(d=t.scrollBehavior)==null?void 0:d.call(t,m,T);$&&window.scrollTo($.x??0,$.y??0),T=m,E=a,z();return}}C=null,I(E),E=null,z()},l=t.mode==="history"?"popstate":"hashchange";return window.addEventListener(l,c),c(),()=>{window.removeEventListener(l,c),D==null||D.destroy(),D=null,F.forEach(({activation:p})=>p.destroy()),F.clear()}}function Ft(){if(typeof window>"u")return null;if(window.__COURVUX_DEVTOOLS__)return window.__COURVUX_DEVTOOLS__;const e=new Map,t={instances:[],stores:[],on(o,i){return e.has(o)||e.set(o,new Set),e.get(o).add(i),()=>{var s;return(s=e.get(o))==null?void 0:s.delete(i)}},_emit(o,i){var s;(s=e.get(o))==null||s.forEach(y=>{try{y(i)}catch{}})},_registerInstance(o){this.instances.push(o),this._emit("mount",o)},_unregisterInstance(o){const i=this.instances.findIndex(s=>s.id===o);if(i!==-1){const s=this.instances[i];this.instances.splice(i,1),this._emit("destroy",s)}},_registerStore(o){this.stores.push(o),o.subscribe(()=>this._emit("store-update",o))}};return window.__COURVUX_DEVTOOLS__=t,t}var Ot=0;function jt(){return++Ot}var Pt=`
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
`;function Lt(){if(document.getElementById("cvd-styles"))return;const e=document.createElement("style");e.id="cvd-styles",e.textContent=Pt,document.head.appendChild(e)}function be(e){return e===null?"null":e===void 0?"undefined":typeof e=="string"?`"${e}"`:typeof e=="object"?JSON.stringify(e):String(e)}function Ke(e){try{return JSON.parse(e)}catch{return e}}function Dt(e){if(typeof document>"u")return;Lt();const t=document.createElement("div");t.id="cvd",document.body.appendChild(t);let o=!1,i="components",s=new Set;const y=document.createElement("div");y.id="cvd-badge",y.innerHTML='<span class="cvd-badge-dot"></span>COURVUX',t.appendChild(y);const A=document.createElement("div");A.id="cvd-panel",A.style.display="none",t.appendChild(A),A.innerHTML=`
        <div id="cvd-head">
            <span id="cvd-title">⚡ COURVUX DEVTOOLS</span>
            <div id="cvd-tabs">
                <button class="cvd-tab active" data-tab="components">Components</button>
                <button class="cvd-tab" data-tab="store">Store</button>
            </div>
            <button id="cvd-close">✕</button>
        </div>
        <div id="cvd-body"></div>
    `;const x=A.querySelector("#cvd-body");y.addEventListener("click",()=>{o=!0,y.style.display="none",A.style.display="flex",D()}),A.querySelector("#cvd-close").addEventListener("click",()=>{o=!1,A.style.display="none",y.style.display=""}),A.querySelectorAll(".cvd-tab").forEach(C=>{C.addEventListener("click",()=>{i=C.dataset.tab,A.querySelectorAll(".cvd-tab").forEach(M=>M.classList.remove("active")),C.classList.add("active"),D()})});const R=A.querySelector("#cvd-head");R.addEventListener("pointerdown",C=>{if(C.target.closest("button"))return;R.setPointerCapture(C.pointerId);const M=C.clientX,z=C.clientY,F=t.offsetLeft,I=t.offsetTop,_=l=>{t.style.right="auto",t.style.bottom="auto",t.style.left=`${F+(l.clientX-M)}px`,t.style.top=`${I+(l.clientY-z)}px`},c=l=>{R.releasePointerCapture(l.pointerId),R.removeEventListener("pointermove",_),R.removeEventListener("pointerup",c),R.removeEventListener("pointercancel",c)};R.addEventListener("pointermove",_),R.addEventListener("pointerup",c),R.addEventListener("pointercancel",c)});function T(){const C=e.instances;if(!C.length){x.innerHTML='<div class="cvd-empty">No hay componentes montados</div>';return}x.innerHTML=C.map(M=>{const z=M.getState(),F=Object.keys(z);return`
                <div class="cvd-inst${s.has(M.id)?" open":""}" data-id="${M.id}">
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
                                <span class="cvd-val" data-inst="${M.id}" data-key="${I}" title="click to edit">${be(z[I])}</span>
                            </div>
                        `).join(""):'<span style="color:#555">— sin datos reactivos —</span>'}
                    </div>
                </div>
            `}).join(""),x.querySelectorAll(".cvd-inst-head").forEach(M=>{M.addEventListener("click",()=>{const z=M.closest(".cvd-inst"),F=parseInt(z.dataset.id);s.has(F)?s.delete(F):s.add(F),z.classList.toggle("open")})}),x.querySelectorAll(".cvd-val").forEach(M=>{M.addEventListener("click",z=>{z.stopPropagation();const F=M;if(F.querySelector("input"))return;const I=parseInt(F.dataset.inst),_=F.dataset.key,c=e.instances.find(k=>k.id===I);if(!c)return;const l=be(c.getState()[_]);F.classList.add("editing"),F.innerHTML=`<input class="cvd-edit" value='${l.replace(/'/g,"&#39;")}'>`;const p=F.querySelector("input");p.focus(),p.select();const w=()=>{c.setState(_,Ke(p.value)),F.classList.remove("editing")};p.addEventListener("blur",w),p.addEventListener("keydown",k=>{k.key==="Enter"&&(k.preventDefault(),w()),k.key==="Escape"&&(F.classList.remove("editing"),D())})})})}function E(){if(!e.stores.length){x.innerHTML='<div class="cvd-empty">No hay store registrado</div>';return}x.innerHTML=e.stores.map((C,M)=>{const z=C.getState(),F=Object.keys(z);return`
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
                                <span class="cvd-val" data-store="${M}" data-key="${I}" title="click to edit">${be(z[I])}</span>
                            </div>
                        `).join("")}
                    </div>
                </div>
            `}).join(""),x.querySelectorAll(".cvd-inst-head").forEach(C=>{C.addEventListener("click",()=>C.closest(".cvd-inst").classList.toggle("open"))}),x.querySelectorAll("[data-store][data-key]").forEach(C=>{C.addEventListener("click",M=>{M.stopPropagation();const z=C;if(z.querySelector("input"))return;const F=parseInt(z.dataset.store),I=z.dataset.key,_=e.stores[F];if(!_)return;const c=be(_.getState()[I]);z.classList.add("editing"),z.innerHTML=`<input class="cvd-edit" value='${c.replace(/'/g,"&#39;")}'>`;const l=z.querySelector("input");l.focus(),l.select();const p=()=>{_.setState(I,Ke(l.value)),z.classList.remove("editing")};l.addEventListener("blur",p),l.addEventListener("keydown",w=>{w.key==="Enter"&&(w.preventDefault(),p()),w.key==="Escape"&&(z.classList.remove("editing"),D())})})})}function D(){o&&(i==="components"?T():E())}e.on("mount",()=>D()),e.on("update",()=>D()),e.on("destroy",()=>D()),e.on("store-update",()=>D())}var Mt="__COURVUX_HEAD_COLLECTOR__";function It(){return globalThis[Mt]??null}var Rt=(e,t)=>{Object.entries(t).forEach(([o,i])=>{o!=="innerHTML"&&(i==null||i===!1||e.setAttribute(o,i===!0?"":String(i)))})},zt=e=>{const t={};return Array.from(e.attributes).forEach(o=>{t[o.name]=o.value}),t},Ht=(e,t)=>{Array.from(e.attributes).forEach(o=>e.removeAttribute(o.name)),Object.entries(t).forEach(([o,i])=>e.setAttribute(o,i))},Qe=(e,t,o,i)=>{let s=o?document.head.querySelector(o):null;s?(i.push({el:s,prevAttrs:zt(s),created:!1}),Array.from(s.attributes).forEach(y=>s.removeAttribute(y.name))):(s=document.createElement(e),document.head.appendChild(s),i.push({el:s,created:!0})),Rt(s,t)};function Nt(e){var A,x,R;const t=It();if(t!==null)return t.push(e),()=>{};if(typeof document>"u")return()=>{};const o=[];let i;const s={},y={};if(e.title!==void 0){i=document.title;const T=e.titleTemplate,E=typeof T=="function"?T(e.title):typeof T=="string"?T.replace("%s",e.title):e.title;document.title=E}return(A=e.meta)==null||A.forEach(T=>{Qe("meta",T,T.name?`meta[name="${CSS.escape(T.name)}"]`:T.property?`meta[property="${CSS.escape(T.property)}"]`:T["http-equiv"]?`meta[http-equiv="${CSS.escape(T["http-equiv"])}"]`:null,o)}),(x=e.link)==null||x.forEach(T=>{Qe("link",T,T.rel==="canonical"?'link[rel="canonical"]':T.rel&&T.href?`link[rel="${CSS.escape(T.rel)}"][href="${CSS.escape(T.href)}"]`:null,o)}),(R=e.script)==null||R.forEach(T=>{const E=document.createElement("script");Object.entries(T).forEach(([D,C])=>{D==="innerHTML"?E.textContent=String(C):C!=null&&C!==!1&&E.setAttribute(D,C===!0?"":String(C))}),document.head.appendChild(E),o.push({el:E,created:!0})}),e.htmlAttrs&&Object.entries(e.htmlAttrs).forEach(([T,E])=>{s[T]=document.documentElement.getAttribute(T),document.documentElement.setAttribute(T,E)}),e.bodyAttrs&&Object.entries(e.bodyAttrs).forEach(([T,E])=>{y[T]=document.body.getAttribute(T),document.body.setAttribute(T,E)}),function(){i!==void 0&&(document.title=i),o.forEach(({el:T,prevAttrs:E,created:D})=>{var C;D?(C=T.parentNode)==null||C.removeChild(T):E&&Ht(T,E)}),Object.entries(s).forEach(([T,E])=>{E===null?document.documentElement.removeAttribute(T):document.documentElement.setAttribute(T,E)}),Object.entries(y).forEach(([T,E])=>{E===null?document.body.removeAttribute(T):document.body.setAttribute(T,E)})}}var Fe="data-courvux-ssr",Wt=e=>e?Promise.resolve().then(e):Promise.resolve();function et(e,t){const o=e.trim();if(o.startsWith("{")){const i=o.replace(/[{}]/g,"").split(",").map(s=>s.trim()).filter(Boolean);return Object.fromEntries(i.map(s=>[s,t[s]]))}return{[o]:t}}var ye=e=>{if(e===null||typeof e!="object")return e;try{return structuredClone(e)}catch{return e}};async function ne(e,t,o){var w,k,n;const i={},{subscribe:s,createReactiveState:y,registerSetInterceptor:A,notifyAll:x}=Le();let R;if(typeof t.data=="function"?(t.loadingTemplate&&(e.innerHTML=t.loadingTemplate),R=await t.data()):R=t.data??{},t.templateUrl){const g=o.baseUrl?new URL(t.templateUrl,o.baseUrl).href:t.templateUrl,b=await fetch(g);if(!b.ok)throw new Error(`Failed to load template: ${g} (${b.status})`);e.innerHTML=await b.text()}else t.template&&(e.innerHTML=t.template);e.removeAttribute(Fe),(w=e.querySelector(`[${Fe}]`))==null||w.removeAttribute(Fe);const T={};if(t.inject&&o.provided){const g=Array.isArray(t.inject)?Object.fromEntries(t.inject.map(b=>[b,b])):t.inject;Object.entries(g).forEach(([b,S])=>{o.provided&&S in o.provided&&(T[b]=o.provided[S])})}const E=y({...o.globalProperties??{},...R,...T,...t.methods,$refs:i,$el:e,...o.slots?{$slots:Object.fromEntries(Object.keys(o.slots).map(g=>[g,!0]))}:{},...o.store?{$store:o.store}:{},...o.currentRoute?{$route:o.currentRoute}:{},...o.router?{$router:o.router}:{}});E.$watch=(g,b,S)=>{const L=(S==null?void 0:S.deep)??!1,r=(S==null?void 0:S.immediate)??!1;let d=L?ye(E[g]):E[g];const a=s(g,()=>{const f=E[g];b.call(E,f,d),d=L?ye(f):f});return r&&b.call(E,E[g],void 0),a},E.$batch=yt,E.$nextTick=g=>Wt(g),E.$dispatch=(g,b,S)=>{e.dispatchEvent(new CustomEvent(g,{bubbles:!0,composed:!0,...S??{},detail:b}))},o.magics&&Object.entries(o.magics).forEach(([g,b])=>{E[g]=b(E)}),E.$forceUpdate=()=>x();const D=[];E.$watchEffect=g=>{let b=[];const S=()=>{b.forEach(a=>a()),b=[];const r=Ie(()=>{try{g()}catch{}}),d=new Map;for(const{sub:a,key:f}of r)d.has(a)||d.set(a,new Set),!d.get(a).has(f)&&(d.get(a).add(f),b.push(a(f,S)))};S();const L=()=>{b.forEach(d=>d()),b=[];const r=D.indexOf(L);r>-1&&D.splice(r,1)};return D.push(L),L};const C=[];t.computed&&Object.entries(t.computed).forEach(([g,b])=>{const S=typeof b=="function"?b:b.get,L=typeof b!="function"?b.set:void 0;let r=[];const d=()=>{r.forEach(u=>u()),r=[];let a;const f=Ie(()=>{try{a=S.call(E)}catch(u){(t.debug??o.debug)&&console.warn("[courvux] computed error:",u)}});E[g]=a;const m=new Map;for(const{sub:u,key:h}of f)m.has(u)||m.set(u,new Set),!m.get(u).has(h)&&(m.get(u).add(h),r.push(u(h,d)))};d(),C.push(()=>r.forEach(a=>a())),L&&A(g,a=>L.call(E,a))});const M=[];t.watch&&Object.entries(t.watch).forEach(([g,b])=>{const S=typeof b=="object"&&b!==null&&"handler"in b,L=S?b.handler:b,r=S?b.immediate??!1:!1,d=S?b.deep??!1:!1;let a=d?ye(E[g]):E[g];const f=s(g,()=>{const m=E[g];L.call(E,m,a),a=d?ye(m):m});M.push(f),r&&L.call(E,E[g],void 0)});const z={...o.provided??{}};if(t.provide){const g=typeof t.provide=="function"?t.provide.call(E):t.provide;Object.assign(z,g)}const F={...o,provided:z,components:{...o.components,...t.components}};F.mountElement=Ae(F),F.createChildScope=(g,b)=>{const S=new Set(Object.keys(g)),L=new Set(Object.keys(b)),{subscribe:r,createReactiveState:d}=Le(),a=d(g);let f;return f=new Proxy({},{get(m,u){return typeof u!="string"?E[u]:S.has(u)?a[u]:L.has(u)?b[u].bind(f):E[u]},set(m,u,h){return typeof u!="string"?!1:S.has(u)?(a[u]=h,!0):(E[u]=h,!0)},has(m,u){return S.has(u)||L.has(u)||u in E},ownKeys(){return[...S,...L,...Object.keys(E)]},getOwnPropertyDescriptor(m,u){return S.has(u)||L.has(u)||u in E?{configurable:!0,enumerable:!0,writable:!0}:void 0}}),{state:f,subscribe:(m,u)=>S.has(m)?r(m,u):c(m,u),cleanup:()=>{}}},F.mountDynamic=async(g,b,S,L,r)=>{let d=null,a=null;const f=S.getAttribute("loading-template")??"",m=async()=>{var O,G,B;a==null||a(),a=null,d!=null&&d.parentNode&&(d.parentNode.removeChild(d),d=null);const u=U(b,L);if(!u)return;let h;if(typeof u=="function"){if(f){const H=document.createElement("div");H.innerHTML=f,(O=g.parentNode)==null||O.insertBefore(H,g.nextSibling),d=H}h=(await u()).default,d!=null&&d.parentNode&&(d.parentNode.removeChild(d),d=null)}else typeof u=="string"?h=(G=F.components)==null?void 0:G[u]:u&&typeof u=="object"&&(h=u);if(!h)return;const v=document.createElement("div"),$=H=>H.startsWith("@")||H.startsWith("cv:on:")||H.startsWith(":")||H.startsWith("cv-")||H.startsWith("v-slot");Array.from(S.attributes).forEach(H=>{$(H.name)||v.setAttribute(H.name,H.value)}),v.innerHTML=S.innerHTML;const j={},P={};Array.from(S.attributes).forEach(H=>{if(H.name.startsWith(":"))j[H.name.slice(1)]=U(H.value,L);else if(H.name.startsWith("@")||H.name.startsWith("cv:on:")){const J=H.value,q=H.name.startsWith("@")?H.name.slice(1):H.name.slice(6);P[q]=(...V)=>{typeof L[J]=="function"&&L[J].call(L,...V)}}});const W={...h,data:{...h.data,...j},methods:{...h.methods,$emit(H,...J){var q;pt(h,H,J),(q=P[H])==null||q.call(P,...J)}}},N={...F,components:{...F.components,...h.components}};N.mountElement=Ae(N),a=(await ne(v,W,N)).destroy,(B=g.parentNode)==null||B.insertBefore(v,g.nextSibling),d=v};Q(b,r,m),await m()};const I=[];E.$addCleanup=g=>{I.push(g)};let _=!1;const c=(g,b)=>!t.onBeforeUpdate&&!t.onUpdated?s(g,b):s(g,()=>{var S;_||(_=!0,(S=t.onBeforeUpdate)==null||S.call(E),Promise.resolve().then(()=>{var L;_=!1,(L=t.onUpdated)==null||L.call(E)})),b()});try{(k=t.onBeforeMount)==null||k.call(E),await oe(e,E,{subscribe:c,refs:i,...F,registerCleanup:g=>I.push(g)}),e.removeAttribute("cv-cloak"),(n=t.onMount)==null||n.call(E)}catch(g){if(t.onError)e.removeAttribute("cv-cloak"),t.onError.call(E,g);else if(o.errorHandler)e.removeAttribute("cv-cloak"),o.errorHandler(g,E,t.name??e.tagName.toLowerCase());else throw g}const l=typeof window<"u"?window.__COURVUX_DEVTOOLS__:void 0,p=l?jt():0;if(l){const g=E,b=new Set,S={id:p,name:t.name??e.tagName.toLowerCase(),el:e,getState:()=>{const L={};for(const r of Object.keys(g))if(!(r.startsWith("$")||typeof g[r]=="function"))try{L[r]=g[r]}catch{}return L},setState:(L,r)=>{g[L]=r},subscribe:L=>(b.add(L),()=>b.delete(L)),children:[]};Object.keys(g).filter(L=>!L.startsWith("$")&&typeof g[L]!="function").forEach(L=>{s(L,()=>{l._emit("update",S),b.forEach(r=>r())})}),l._registerInstance(S),I.push(()=>l._unregisterInstance(p))}return{state:E,destroy:()=>{var g,b;(g=t.onBeforeUnmount)==null||g.call(E),C.forEach(S=>S()),M.forEach(S=>S()),D.forEach(S=>S()),I.forEach(S=>S()),(b=t.onDestroy)==null||b.call(E)},activate:()=>{var g;(g=t.onActivated)==null||g.call(E)},deactivate:()=>{var g;(g=t.onDeactivated)==null||g.call(E)},beforeLeave:t.onBeforeRouteLeave?(g,b)=>t.onBeforeRouteLeave.call(E,g,b):void 0,enter:t.onBeforeRouteEnter?g=>t.onBeforeRouteEnter.call(E,g):void 0}}function pt(e,t,o){if(!e.emits||Array.isArray(e.emits))return;const i=e.emits[t];typeof i=="function"&&!i(...o)&&console.warn(`[courvux] emit "${t}": validator returned false`)}function Ae(e){return async(t,o,i,s)=>{const y=e.components[o],A=t.getAttribute("cv-ref");A&&t.removeAttribute("cv-ref");const x={},R=[],T={};Array.from(t.attributes).filter(_=>_.name==="cv-model"||_.name.startsWith("cv-model.")||_.name.startsWith("cv-model:")).forEach(_=>{t.removeAttribute(_.name);const c=_.value,l=_.name.indexOf(":"),p=l>=0?_.name.slice(l+1).split(".")[0]:"modelValue",w=p==="modelValue"?"update:modelValue":`update:${p}`;x[p]=Ce(U(c,i)),R.push({propName:p,expr:c}),T[w]=k=>{le(c,i,k)}});const E={};Array.from(t.attributes).forEach(_=>{const c=_.name.startsWith(":"),l=_.name.startsWith("@")||_.name.startsWith("cv:on:"),p=_.name==="cv-model"||_.name.startsWith("cv-model.")||_.name.startsWith("cv-model:"),w=_.name.startsWith("v-slot"),k=_.name==="slot";!c&&!l&&!p&&!w&&!k&&(E[_.name]=_.value)}),y.inheritAttrs===!1&&Object.keys(E).forEach(_=>t.removeAttribute(_)),Array.from(t.attributes).forEach(_=>{if(_.name.startsWith(":")){const c=_.name.slice(1),l=_.value;x[c]=Ce(U(l,i)),R.push({propName:c,expr:l})}else if(_.name.startsWith("@")||_.name.startsWith("cv:on:")){const c=_.name.startsWith("@")?_.name.slice(1):_.name.slice(6),l=_.value;T[c]=(...p)=>{typeof i[l]=="function"&&i[l].call(i,...p)}}});const D=t.getAttribute("v-slot")??t.getAttribute("v-slot:default");D&&(t.removeAttribute("v-slot"),t.removeAttribute("v-slot:default"));const C=new Map,M=[];Array.from(t.childNodes).forEach(_=>{const c=_.nodeType===1?_.getAttribute("slot"):null;if(c){if(!C.has(c)){const l=t.getAttribute(`v-slot:${c}`)??null;l&&t.removeAttribute(`v-slot:${c}`),C.set(c,{nodes:[],vSlot:l})}C.get(c).nodes.push(_.cloneNode(!0))}else M.push(_.cloneNode(!0))});const z={};M.some(_=>{var c;return _.nodeType===1||_.nodeType===3&&(((c=_.textContent)==null?void 0:c.trim())??"")!==""})&&(z.default=async _=>{const c=D?{...i,...et(D,_)}:i,l=document.createDocumentFragment();return M.forEach(p=>l.appendChild(p.cloneNode(!0))),await oe(l,c,s),Array.from(l.childNodes)});for(const[_,{nodes:c,vSlot:l}]of C)z[_]=async p=>{const w=l?{...i,...et(l,p)}:i,k=document.createDocumentFragment();return c.forEach(n=>k.appendChild(n.cloneNode(!0))),await oe(k,w,s),Array.from(k.childNodes)};const F={...e,components:{...e.components,...y.components},slots:z};F.mountElement=Ae(F);const{state:I}=await ne(t,{...y,data:{...y.data,...x,$attrs:E,$parent:i},methods:{...y.methods,$emit(_,...c){var l;pt(y,_,c),(l=T[_])==null||l.call(T,...c)}}},F);I&&(R.forEach(({propName:_,expr:c})=>{ue(c,{...s,subscribe:s.subscribe},()=>{I[_]=Ce(U(c,i))})}),A&&s.refs&&(s.refs[A]=I))}}function Ut(e){wt();const t=typeof window<"u"?Ft():void 0,o=[],i={...e.directives},s={...e.components??{}},y=[],A=new Map,x={},R=new Map;if(e.debug&&t&&Dt(t),t&&e.store){const C=e.store,M=Object.keys(C).filter(z=>typeof C[z]!="function");t._registerStore({getState(){const z={};return M.forEach(F=>{try{z[F]=C[F]}catch{}}),z},setState(z,F){C[z]=F},subscribe(z){const F=M.map(I=>{try{return ve(C,I,z)}catch{return()=>{}}});return()=>F.forEach(I=>I())}})}const T={router:e.router,use(C){return o.includes(C)||(o.push(C),C.install(T)),T},directive(C,M){return i[C]=M,T},component(C,M){return s[C]=M,T},provide(C,M){return typeof C=="string"?x[C]=M:Object.assign(x,C),T},magic(C,M){return R.set(`$${C}`,M),T},mount:async C=>(await D(C),T),mountAll:async(C="[data-courvux]")=>{const M=Array.from(document.querySelectorAll(C));return await Promise.all(M.map(z=>E(z))),T},mountEl:async C=>E(C),unmount(C){if(!C)y.forEach(M=>M()),y.length=0,A.clear();else{const M=document.querySelector(C);if(M){const z=A.get(M);if(z){z(),A.delete(M);const F=y.indexOf(z);F>-1&&y.splice(F,1)}}}return T},destroy(){y.forEach(C=>C()),y.length=0,A.clear()}},E=async C=>{const M=new URL(".",document.baseURI).href,z={components:s,router:e.router,store:e.store,directives:i,baseUrl:M,provided:{...x},errorHandler:e.errorHandler,globalProperties:e.globalProperties,magics:R.size?Object.fromEntries(R):void 0};if(z.mountElement=Ae(z),e.router){const I=e.router;z.mountRouterView=async(_,c)=>{await new Promise(l=>{Je(_,I,async(p,w,k,n,g)=>{const b={...z,currentRoute:k};if(g){let S=null;const L={...b,mountRouterView:async(r,d)=>{S=Je(r,g,async(a,f,m,u)=>{const h={...b,currentRoute:m};if(u){let v=null;const $={...h,mountRouterView:async(P,W)=>{v=await ne(P,f,h)}},{destroy:j}=await ne(a,{template:u},$);return{destroy:()=>{v==null||v.destroy(),j()},activate:()=>v==null?void 0:v.activate(),deactivate:()=>v==null?void 0:v.deactivate()}}else return await ne(a,f,h)},d)}};if(n){let r=null;const d={...L,mountRouterView:async(f,m)=>{r=await ne(f,w,L)}},{destroy:a}=await ne(p,{template:n},d);return{destroy:()=>{S==null||S(),r==null||r.destroy(),a()},activate:()=>r==null?void 0:r.activate(),deactivate:()=>r==null?void 0:r.deactivate()}}else{const r=await ne(p,w,L);return{destroy:()=>{S==null||S(),r.destroy()},activate:()=>r.activate(),deactivate:()=>r.deactivate()}}}else if(n){let S=null;const L={...b,mountRouterView:async(d,a)=>{S=await ne(d,w,b)}},{destroy:r}=await ne(p,{template:n},L);return{destroy:()=>{S==null||S.destroy(),r()},activate:()=>S==null?void 0:S.activate(),deactivate:()=>S==null?void 0:S.deactivate()}}else return await ne(p,w,b)},c,l)})}}const F=await ne(C,e,z);return y.push(F.destroy),A.set(C,F.destroy),F.state},D=async C=>{const M=document.querySelector(C);if(M)return E(M)};return T}var tt=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function Bt(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var Oe={exports:{}},ot;function qt(){return ot||(ot=1,(function(e){var t=typeof window<"u"?window:typeof WorkerGlobalScope<"u"&&self instanceof WorkerGlobalScope?self:{};/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 *
 * @license MIT <https://opensource.org/licenses/MIT>
 * @author Lea Verou <https://lea.verou.me>
 * @namespace
 * @public
 */var o=(function(i){var s=/(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i,y=0,A={},x={manual:i.Prism&&i.Prism.manual,disableWorkerMessageHandler:i.Prism&&i.Prism.disableWorkerMessageHandler,util:{encode:function c(l){return l instanceof R?new R(l.type,c(l.content),l.alias):Array.isArray(l)?l.map(c):l.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/\u00a0/g," ")},type:function(c){return Object.prototype.toString.call(c).slice(8,-1)},objId:function(c){return c.__id||Object.defineProperty(c,"__id",{value:++y}),c.__id},clone:function c(l,p){p=p||{};var w,k;switch(x.util.type(l)){case"Object":if(k=x.util.objId(l),p[k])return p[k];w={},p[k]=w;for(var n in l)l.hasOwnProperty(n)&&(w[n]=c(l[n],p));return w;case"Array":return k=x.util.objId(l),p[k]?p[k]:(w=[],p[k]=w,l.forEach(function(g,b){w[b]=c(g,p)}),w);default:return l}},getLanguage:function(c){for(;c;){var l=s.exec(c.className);if(l)return l[1].toLowerCase();c=c.parentElement}return"none"},setLanguage:function(c,l){c.className=c.className.replace(RegExp(s,"gi"),""),c.classList.add("language-"+l)},currentScript:function(){if(typeof document>"u")return null;if(document.currentScript&&document.currentScript.tagName==="SCRIPT")return document.currentScript;try{throw new Error}catch(w){var c=(/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(w.stack)||[])[1];if(c){var l=document.getElementsByTagName("script");for(var p in l)if(l[p].src==c)return l[p]}return null}},isActive:function(c,l,p){for(var w="no-"+l;c;){var k=c.classList;if(k.contains(l))return!0;if(k.contains(w))return!1;c=c.parentElement}return!!p}},languages:{plain:A,plaintext:A,text:A,txt:A,extend:function(c,l){var p=x.util.clone(x.languages[c]);for(var w in l)p[w]=l[w];return p},insertBefore:function(c,l,p,w){w=w||x.languages;var k=w[c],n={};for(var g in k)if(k.hasOwnProperty(g)){if(g==l)for(var b in p)p.hasOwnProperty(b)&&(n[b]=p[b]);p.hasOwnProperty(g)||(n[g]=k[g])}var S=w[c];return w[c]=n,x.languages.DFS(x.languages,function(L,r){r===S&&L!=c&&(this[L]=n)}),n},DFS:function c(l,p,w,k){k=k||{};var n=x.util.objId;for(var g in l)if(l.hasOwnProperty(g)){p.call(l,g,l[g],w||g);var b=l[g],S=x.util.type(b);S==="Object"&&!k[n(b)]?(k[n(b)]=!0,c(b,p,null,k)):S==="Array"&&!k[n(b)]&&(k[n(b)]=!0,c(b,p,g,k))}}},plugins:{},highlightAll:function(c,l){x.highlightAllUnder(document,c,l)},highlightAllUnder:function(c,l,p){var w={callback:p,container:c,selector:'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'};x.hooks.run("before-highlightall",w),w.elements=Array.prototype.slice.apply(w.container.querySelectorAll(w.selector)),x.hooks.run("before-all-elements-highlight",w);for(var k=0,n;n=w.elements[k++];)x.highlightElement(n,l===!0,w.callback)},highlightElement:function(c,l,p){var w=x.util.getLanguage(c),k=x.languages[w];x.util.setLanguage(c,w);var n=c.parentElement;n&&n.nodeName.toLowerCase()==="pre"&&x.util.setLanguage(n,w);var g=c.textContent,b={element:c,language:w,grammar:k,code:g};function S(r){b.highlightedCode=r,x.hooks.run("before-insert",b),b.element.innerHTML=b.highlightedCode,x.hooks.run("after-highlight",b),x.hooks.run("complete",b),p&&p.call(b.element)}if(x.hooks.run("before-sanity-check",b),n=b.element.parentElement,n&&n.nodeName.toLowerCase()==="pre"&&!n.hasAttribute("tabindex")&&n.setAttribute("tabindex","0"),!b.code){x.hooks.run("complete",b),p&&p.call(b.element);return}if(x.hooks.run("before-highlight",b),!b.grammar){S(x.util.encode(b.code));return}if(l&&i.Worker){var L=new Worker(x.filename);L.onmessage=function(r){S(r.data)},L.postMessage(JSON.stringify({language:b.language,code:b.code,immediateClose:!0}))}else S(x.highlight(b.code,b.grammar,b.language))},highlight:function(c,l,p){var w={code:c,grammar:l,language:p};if(x.hooks.run("before-tokenize",w),!w.grammar)throw new Error('The language "'+w.language+'" has no grammar.');return w.tokens=x.tokenize(w.code,w.grammar),x.hooks.run("after-tokenize",w),R.stringify(x.util.encode(w.tokens),w.language)},tokenize:function(c,l){var p=l.rest;if(p){for(var w in p)l[w]=p[w];delete l.rest}var k=new D;return C(k,k.head,c),E(c,k,l,k.head,0),z(k)},hooks:{all:{},add:function(c,l){var p=x.hooks.all;p[c]=p[c]||[],p[c].push(l)},run:function(c,l){var p=x.hooks.all[c];if(!(!p||!p.length))for(var w=0,k;k=p[w++];)k(l)}},Token:R};i.Prism=x;function R(c,l,p,w){this.type=c,this.content=l,this.alias=p,this.length=(w||"").length|0}R.stringify=function c(l,p){if(typeof l=="string")return l;if(Array.isArray(l)){var w="";return l.forEach(function(S){w+=c(S,p)}),w}var k={type:l.type,content:c(l.content,p),tag:"span",classes:["token",l.type],attributes:{},language:p},n=l.alias;n&&(Array.isArray(n)?Array.prototype.push.apply(k.classes,n):k.classes.push(n)),x.hooks.run("wrap",k);var g="";for(var b in k.attributes)g+=" "+b+'="'+(k.attributes[b]||"").replace(/"/g,"&quot;")+'"';return"<"+k.tag+' class="'+k.classes.join(" ")+'"'+g+">"+k.content+"</"+k.tag+">"};function T(c,l,p,w){c.lastIndex=l;var k=c.exec(p);if(k&&w&&k[1]){var n=k[1].length;k.index+=n,k[0]=k[0].slice(n)}return k}function E(c,l,p,w,k,n){for(var g in p)if(!(!p.hasOwnProperty(g)||!p[g])){var b=p[g];b=Array.isArray(b)?b:[b];for(var S=0;S<b.length;++S){if(n&&n.cause==g+","+S)return;var L=b[S],r=L.inside,d=!!L.lookbehind,a=!!L.greedy,f=L.alias;if(a&&!L.pattern.global){var m=L.pattern.toString().match(/[imsuy]*$/)[0];L.pattern=RegExp(L.pattern.source,m+"g")}for(var u=L.pattern||L,h=w.next,v=k;h!==l.tail&&!(n&&v>=n.reach);v+=h.value.length,h=h.next){var $=h.value;if(l.length>c.length)return;if(!($ instanceof R)){var j=1,P;if(a){if(P=T(u,v,c,d),!P||P.index>=c.length)break;var G=P.index,W=P.index+P[0].length,N=v;for(N+=h.value.length;G>=N;)h=h.next,N+=h.value.length;if(N-=h.value.length,v=N,h.value instanceof R)continue;for(var O=h;O!==l.tail&&(N<W||typeof O.value=="string");O=O.next)j++,N+=O.value.length;j--,$=c.slice(v,N),P.index-=v}else if(P=T(u,0,$,d),!P)continue;var G=P.index,B=P[0],H=$.slice(0,G),J=$.slice(G+B.length),q=v+$.length;n&&q>n.reach&&(n.reach=q);var V=h.prev;H&&(V=C(l,V,H),v+=H.length),M(l,V,j);var te=new R(g,r?x.tokenize(B,r):B,f,B);if(h=C(l,V,te),J&&C(l,h,J),j>1){var K={cause:g+","+S,reach:q};E(c,l,p,h.prev,v,K),n&&K.reach>n.reach&&(n.reach=K.reach)}}}}}}function D(){var c={value:null,prev:null,next:null},l={value:null,prev:c,next:null};c.next=l,this.head=c,this.tail=l,this.length=0}function C(c,l,p){var w=l.next,k={value:p,prev:l,next:w};return l.next=k,w.prev=k,c.length++,k}function M(c,l,p){for(var w=l.next,k=0;k<p&&w!==c.tail;k++)w=w.next;l.next=w,w.prev=l,c.length-=k}function z(c){for(var l=[],p=c.head.next;p!==c.tail;)l.push(p.value),p=p.next;return l}if(!i.document)return i.addEventListener&&(x.disableWorkerMessageHandler||i.addEventListener("message",function(c){var l=JSON.parse(c.data),p=l.language,w=l.code,k=l.immediateClose;i.postMessage(x.highlight(w,x.languages[p],p)),k&&i.close()},!1)),x;var F=x.util.currentScript();F&&(x.filename=F.src,F.hasAttribute("data-manual")&&(x.manual=!0));function I(){x.manual||x.highlightAll()}if(!x.manual){var _=document.readyState;_==="loading"||_==="interactive"&&F&&F.defer?document.addEventListener("DOMContentLoaded",I):window.requestAnimationFrame?window.requestAnimationFrame(I):window.setTimeout(I,16)}return x})(t);e.exports&&(e.exports=o),typeof tt<"u"&&(tt.Prism=o),o.languages.markup={comment:{pattern:/<!--(?:(?!<!--)[\s\S])*?-->/,greedy:!0},prolog:{pattern:/<\?[\s\S]+?\?>/,greedy:!0},doctype:{pattern:/<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,greedy:!0,inside:{"internal-subset":{pattern:/(^[^\[]*\[)[\s\S]+(?=\]>$)/,lookbehind:!0,greedy:!0,inside:null},string:{pattern:/"[^"]*"|'[^']*'/,greedy:!0},punctuation:/^<!|>$|[[\]]/,"doctype-tag":/^DOCTYPE/i,name:/[^\s<>'"]+/}},cdata:{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,greedy:!0},tag:{pattern:/<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,greedy:!0,inside:{tag:{pattern:/^<\/?[^\s>\/]+/,inside:{punctuation:/^<\/?/,namespace:/^[^\s>\/:]+:/}},"special-attr":[],"attr-value":{pattern:/=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,inside:{punctuation:[{pattern:/^=/,alias:"attr-equals"},{pattern:/^(\s*)["']|["']$/,lookbehind:!0}]}},punctuation:/\/?>/,"attr-name":{pattern:/[^\s>\/]+/,inside:{namespace:/^[^\s>\/:]+:/}}}},entity:[{pattern:/&[\da-z]{1,8};/i,alias:"named-entity"},/&#x?[\da-f]{1,8};/i]},o.languages.markup.tag.inside["attr-value"].inside.entity=o.languages.markup.entity,o.languages.markup.doctype.inside["internal-subset"].inside=o.languages.markup,o.hooks.add("wrap",function(i){i.type==="entity"&&(i.attributes.title=i.content.replace(/&amp;/,"&"))}),Object.defineProperty(o.languages.markup.tag,"addInlined",{value:function(s,y){var A={};A["language-"+y]={pattern:/(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,lookbehind:!0,inside:o.languages[y]},A.cdata=/^<!\[CDATA\[|\]\]>$/i;var x={"included-cdata":{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,inside:A}};x["language-"+y]={pattern:/[\s\S]+/,inside:o.languages[y]};var R={};R[s]={pattern:RegExp(/(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(/__/g,function(){return s}),"i"),lookbehind:!0,greedy:!0,inside:x},o.languages.insertBefore("markup","cdata",R)}}),Object.defineProperty(o.languages.markup.tag,"addAttribute",{value:function(i,s){o.languages.markup.tag.inside["special-attr"].push({pattern:RegExp(/(^|["'\s])/.source+"(?:"+i+")"+/\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source,"i"),lookbehind:!0,inside:{"attr-name":/^[^\s=]+/,"attr-value":{pattern:/=[\s\S]+/,inside:{value:{pattern:/(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,lookbehind:!0,alias:[s,"language-"+s],inside:o.languages[s]},punctuation:[{pattern:/^=/,alias:"attr-equals"},/"|'/]}}}})}}),o.languages.html=o.languages.markup,o.languages.mathml=o.languages.markup,o.languages.svg=o.languages.markup,o.languages.xml=o.languages.extend("markup",{}),o.languages.ssml=o.languages.xml,o.languages.atom=o.languages.xml,o.languages.rss=o.languages.xml,(function(i){var s=/(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;i.languages.css={comment:/\/\*[\s\S]*?\*\//,atrule:{pattern:RegExp("@[\\w-](?:"+/[^;{\s"']|\s+(?!\s)/.source+"|"+s.source+")*?"+/(?:;|(?=\s*\{))/.source),inside:{rule:/^@[\w-]+/,"selector-function-argument":{pattern:/(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,lookbehind:!0,alias:"selector"},keyword:{pattern:/(^|[^\w-])(?:and|not|only|or)(?![\w-])/,lookbehind:!0}}},url:{pattern:RegExp("\\burl\\((?:"+s.source+"|"+/(?:[^\\\r\n()"']|\\[\s\S])*/.source+")\\)","i"),greedy:!0,inside:{function:/^url/i,punctuation:/^\(|\)$/,string:{pattern:RegExp("^"+s.source+"$"),alias:"url"}}},selector:{pattern:RegExp(`(^|[{}\\s])[^{}\\s](?:[^{};"'\\s]|\\s+(?![\\s{])|`+s.source+")*(?=\\s*\\{)"),lookbehind:!0},string:{pattern:s,greedy:!0},property:{pattern:/(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,lookbehind:!0},important:/!important\b/i,function:{pattern:/(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i,lookbehind:!0},punctuation:/[(){};:,]/},i.languages.css.atrule.inside.rest=i.languages.css;var y=i.languages.markup;y&&(y.tag.addInlined("style","css"),y.tag.addAttribute("style","css"))})(o),o.languages.clike={comment:[{pattern:/(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,lookbehind:!0,greedy:!0},{pattern:/(^|[^\\:])\/\/.*/,lookbehind:!0,greedy:!0}],string:{pattern:/(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,greedy:!0},"class-name":{pattern:/(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,lookbehind:!0,inside:{punctuation:/[.\\]/}},keyword:/\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,boolean:/\b(?:false|true)\b/,function:/\b\w+(?=\()/,number:/\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,operator:/[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,punctuation:/[{}[\];(),.:]/},o.languages.javascript=o.languages.extend("clike",{"class-name":[o.languages.clike["class-name"],{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,lookbehind:!0}],keyword:[{pattern:/((?:^|\})\s*)catch\b/,lookbehind:!0},{pattern:/(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,lookbehind:!0}],function:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,number:{pattern:RegExp(/(^|[^\w$])/.source+"(?:"+(/NaN|Infinity/.source+"|"+/0[bB][01]+(?:_[01]+)*n?/.source+"|"+/0[oO][0-7]+(?:_[0-7]+)*n?/.source+"|"+/0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source+"|"+/\d+(?:_\d+)*n/.source+"|"+/(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/.source)+")"+/(?![\w$])/.source),lookbehind:!0},operator:/--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/}),o.languages.javascript["class-name"][0].pattern=/(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/,o.languages.insertBefore("javascript","keyword",{regex:{pattern:RegExp(/((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)/.source+/\//.source+"(?:"+/(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}/.source+"|"+/(?:\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.)*\])*\])*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}v[dgimyus]{0,7}/.source+")"+/(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/.source),lookbehind:!0,greedy:!0,inside:{"regex-source":{pattern:/^(\/)[\s\S]+(?=\/[a-z]*$)/,lookbehind:!0,alias:"language-regex",inside:o.languages.regex},"regex-delimiter":/^\/|\/$/,"regex-flags":/^[a-z]+$/}},"function-variable":{pattern:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,alias:"function"},parameter:[{pattern:/(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,lookbehind:!0,inside:o.languages.javascript},{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,lookbehind:!0,inside:o.languages.javascript},{pattern:/(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,lookbehind:!0,inside:o.languages.javascript},{pattern:/((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,lookbehind:!0,inside:o.languages.javascript}],constant:/\b[A-Z](?:[A-Z_]|\dx?)*\b/}),o.languages.insertBefore("javascript","string",{hashbang:{pattern:/^#!.*/,greedy:!0,alias:"comment"},"template-string":{pattern:/`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,greedy:!0,inside:{"template-punctuation":{pattern:/^`|`$/,alias:"string"},interpolation:{pattern:/((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,lookbehind:!0,inside:{"interpolation-punctuation":{pattern:/^\$\{|\}$/,alias:"punctuation"},rest:o.languages.javascript}},string:/[\s\S]+/}},"string-property":{pattern:/((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,lookbehind:!0,greedy:!0,alias:"property"}}),o.languages.insertBefore("javascript","operator",{"literal-property":{pattern:/((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,lookbehind:!0,alias:"property"}}),o.languages.markup&&(o.languages.markup.tag.addInlined("script","javascript"),o.languages.markup.tag.addAttribute(/on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/.source,"javascript")),o.languages.js=o.languages.javascript,(function(){if(typeof o>"u"||typeof document>"u")return;Element.prototype.matches||(Element.prototype.matches=Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector);var i="Loading…",s=function(F,I){return"✖ Error "+F+" while fetching file: "+I},y="✖ Error: File does not exist or is empty",A={js:"javascript",py:"python",rb:"ruby",ps1:"powershell",psm1:"powershell",sh:"bash",bat:"batch",h:"c",tex:"latex"},x="data-src-status",R="loading",T="loaded",E="failed",D="pre[data-src]:not(["+x+'="'+T+'"]):not(['+x+'="'+R+'"])';function C(F,I,_){var c=new XMLHttpRequest;c.open("GET",F,!0),c.onreadystatechange=function(){c.readyState==4&&(c.status<400&&c.responseText?I(c.responseText):c.status>=400?_(s(c.status,c.statusText)):_(y))},c.send(null)}function M(F){var I=/^\s*(\d+)\s*(?:(,)\s*(?:(\d+)\s*)?)?$/.exec(F||"");if(I){var _=Number(I[1]),c=I[2],l=I[3];return c?l?[_,Number(l)]:[_,void 0]:[_,_]}}o.hooks.add("before-highlightall",function(F){F.selector+=", "+D}),o.hooks.add("before-sanity-check",function(F){var I=F.element;if(I.matches(D)){F.code="",I.setAttribute(x,R);var _=I.appendChild(document.createElement("CODE"));_.textContent=i;var c=I.getAttribute("data-src"),l=F.language;if(l==="none"){var p=(/\.(\w+)$/.exec(c)||[,"none"])[1];l=A[p]||p}o.util.setLanguage(_,l),o.util.setLanguage(I,l);var w=o.plugins.autoloader;w&&w.loadLanguages(l),C(c,function(k){I.setAttribute(x,T);var n=M(I.getAttribute("data-range"));if(n){var g=k.split(/\r\n?|\n/g),b=n[0],S=n[1]==null?g.length:n[1];b<0&&(b+=g.length),b=Math.max(0,Math.min(b-1,g.length)),S<0&&(S+=g.length),S=Math.max(0,Math.min(S,g.length)),k=g.slice(b,S).join(`
`),I.hasAttribute("data-start")||I.setAttribute("data-start",String(b+1))}_.textContent=k,o.highlightElement(_)},function(k){I.setAttribute(x,E),_.textContent=k})}}),o.plugins.fileHighlight={highlight:function(I){for(var _=(I||document).querySelectorAll(D),c=0,l;l=_[c++];)o.highlightElement(l)}};var z=!1;o.fileHighlight=function(){z||(console.warn("Prism.fileHighlight is deprecated. Use `Prism.plugins.fileHighlight.highlight` instead."),z=!0),o.plugins.fileHighlight.highlight.apply(this,arguments)}})()})(Oe)),Oe.exports}var Vt=qt();const Gt=Bt(Vt);Prism.languages.javascript=Prism.languages.extend("clike",{"class-name":[Prism.languages.clike["class-name"],{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,lookbehind:!0}],keyword:[{pattern:/((?:^|\})\s*)catch\b/,lookbehind:!0},{pattern:/(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,lookbehind:!0}],function:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,number:{pattern:RegExp(/(^|[^\w$])/.source+"(?:"+(/NaN|Infinity/.source+"|"+/0[bB][01]+(?:_[01]+)*n?/.source+"|"+/0[oO][0-7]+(?:_[0-7]+)*n?/.source+"|"+/0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source+"|"+/\d+(?:_\d+)*n/.source+"|"+/(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/.source)+")"+/(?![\w$])/.source),lookbehind:!0},operator:/--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/});Prism.languages.javascript["class-name"][0].pattern=/(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/;Prism.languages.insertBefore("javascript","keyword",{regex:{pattern:RegExp(/((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)/.source+/\//.source+"(?:"+/(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}/.source+"|"+/(?:\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.)*\])*\])*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}v[dgimyus]{0,7}/.source+")"+/(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/.source),lookbehind:!0,greedy:!0,inside:{"regex-source":{pattern:/^(\/)[\s\S]+(?=\/[a-z]*$)/,lookbehind:!0,alias:"language-regex",inside:Prism.languages.regex},"regex-delimiter":/^\/|\/$/,"regex-flags":/^[a-z]+$/}},"function-variable":{pattern:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,alias:"function"},parameter:[{pattern:/(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,lookbehind:!0,inside:Prism.languages.javascript},{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,lookbehind:!0,inside:Prism.languages.javascript},{pattern:/(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,lookbehind:!0,inside:Prism.languages.javascript},{pattern:/((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,lookbehind:!0,inside:Prism.languages.javascript}],constant:/\b[A-Z](?:[A-Z_]|\dx?)*\b/});Prism.languages.insertBefore("javascript","string",{hashbang:{pattern:/^#!.*/,greedy:!0,alias:"comment"},"template-string":{pattern:/`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,greedy:!0,inside:{"template-punctuation":{pattern:/^`|`$/,alias:"string"},interpolation:{pattern:/((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,lookbehind:!0,inside:{"interpolation-punctuation":{pattern:/^\$\{|\}$/,alias:"punctuation"},rest:Prism.languages.javascript}},string:/[\s\S]+/}},"string-property":{pattern:/((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,lookbehind:!0,greedy:!0,alias:"property"}});Prism.languages.insertBefore("javascript","operator",{"literal-property":{pattern:/((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,lookbehind:!0,alias:"property"}});Prism.languages.markup&&(Prism.languages.markup.tag.addInlined("script","javascript"),Prism.languages.markup.tag.addAttribute(/on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/.source,"javascript"));Prism.languages.js=Prism.languages.javascript;Prism.languages.markup={comment:{pattern:/<!--(?:(?!<!--)[\s\S])*?-->/,greedy:!0},prolog:{pattern:/<\?[\s\S]+?\?>/,greedy:!0},doctype:{pattern:/<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,greedy:!0,inside:{"internal-subset":{pattern:/(^[^\[]*\[)[\s\S]+(?=\]>$)/,lookbehind:!0,greedy:!0,inside:null},string:{pattern:/"[^"]*"|'[^']*'/,greedy:!0},punctuation:/^<!|>$|[[\]]/,"doctype-tag":/^DOCTYPE/i,name:/[^\s<>'"]+/}},cdata:{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,greedy:!0},tag:{pattern:/<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,greedy:!0,inside:{tag:{pattern:/^<\/?[^\s>\/]+/,inside:{punctuation:/^<\/?/,namespace:/^[^\s>\/:]+:/}},"special-attr":[],"attr-value":{pattern:/=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,inside:{punctuation:[{pattern:/^=/,alias:"attr-equals"},{pattern:/^(\s*)["']|["']$/,lookbehind:!0}]}},punctuation:/\/?>/,"attr-name":{pattern:/[^\s>\/]+/,inside:{namespace:/^[^\s>\/:]+:/}}}},entity:[{pattern:/&[\da-z]{1,8};/i,alias:"named-entity"},/&#x?[\da-f]{1,8};/i]};Prism.languages.markup.tag.inside["attr-value"].inside.entity=Prism.languages.markup.entity;Prism.languages.markup.doctype.inside["internal-subset"].inside=Prism.languages.markup;Prism.hooks.add("wrap",function(e){e.type==="entity"&&(e.attributes.title=e.content.replace(/&amp;/,"&"))});Object.defineProperty(Prism.languages.markup.tag,"addInlined",{value:function(t,o){var i={};i["language-"+o]={pattern:/(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,lookbehind:!0,inside:Prism.languages[o]},i.cdata=/^<!\[CDATA\[|\]\]>$/i;var s={"included-cdata":{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,inside:i}};s["language-"+o]={pattern:/[\s\S]+/,inside:Prism.languages[o]};var y={};y[t]={pattern:RegExp(/(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(/__/g,function(){return t}),"i"),lookbehind:!0,greedy:!0,inside:s},Prism.languages.insertBefore("markup","cdata",y)}});Object.defineProperty(Prism.languages.markup.tag,"addAttribute",{value:function(e,t){Prism.languages.markup.tag.inside["special-attr"].push({pattern:RegExp(/(^|["'\s])/.source+"(?:"+e+")"+/\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source,"i"),lookbehind:!0,inside:{"attr-name":/^[^\s=]+/,"attr-value":{pattern:/=[\s\S]+/,inside:{value:{pattern:/(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,lookbehind:!0,alias:[t,"language-"+t],inside:Prism.languages[t]},punctuation:[{pattern:/^=/,alias:"attr-equals"},/"|'/]}}}})}});Prism.languages.html=Prism.languages.markup;Prism.languages.mathml=Prism.languages.markup;Prism.languages.svg=Prism.languages.markup;Prism.languages.xml=Prism.languages.extend("markup",{});Prism.languages.ssml=Prism.languages.xml;Prism.languages.atom=Prism.languages.xml;Prism.languages.rss=Prism.languages.xml;(function(e){var t="\\b(?:BASH|BASHOPTS|BASH_ALIASES|BASH_ARGC|BASH_ARGV|BASH_CMDS|BASH_COMPLETION_COMPAT_DIR|BASH_LINENO|BASH_REMATCH|BASH_SOURCE|BASH_VERSINFO|BASH_VERSION|COLORTERM|COLUMNS|COMP_WORDBREAKS|DBUS_SESSION_BUS_ADDRESS|DEFAULTS_PATH|DESKTOP_SESSION|DIRSTACK|DISPLAY|EUID|GDMSESSION|GDM_LANG|GNOME_KEYRING_CONTROL|GNOME_KEYRING_PID|GPG_AGENT_INFO|GROUPS|HISTCONTROL|HISTFILE|HISTFILESIZE|HISTSIZE|HOME|HOSTNAME|HOSTTYPE|IFS|INSTANCE|JOB|LANG|LANGUAGE|LC_ADDRESS|LC_ALL|LC_IDENTIFICATION|LC_MEASUREMENT|LC_MONETARY|LC_NAME|LC_NUMERIC|LC_PAPER|LC_TELEPHONE|LC_TIME|LESSCLOSE|LESSOPEN|LINES|LOGNAME|LS_COLORS|MACHTYPE|MAILCHECK|MANDATORY_PATH|NO_AT_BRIDGE|OLDPWD|OPTERR|OPTIND|ORBIT_SOCKETDIR|OSTYPE|PAPERSIZE|PATH|PIPESTATUS|PPID|PS1|PS2|PS3|PS4|PWD|RANDOM|REPLY|SECONDS|SELINUX_INIT|SESSION|SESSIONTYPE|SESSION_MANAGER|SHELL|SHELLOPTS|SHLVL|SSH_AUTH_SOCK|TERM|UID|UPSTART_EVENTS|UPSTART_INSTANCE|UPSTART_JOB|UPSTART_SESSION|USER|WINDOWID|XAUTHORITY|XDG_CONFIG_DIRS|XDG_CURRENT_DESKTOP|XDG_DATA_DIRS|XDG_GREETER_DATA_DIR|XDG_MENU_PREFIX|XDG_RUNTIME_DIR|XDG_SEAT|XDG_SEAT_PATH|XDG_SESSION_DESKTOP|XDG_SESSION_ID|XDG_SESSION_PATH|XDG_SESSION_TYPE|XDG_VTNR|XMODIFIERS)\\b",o={pattern:/(^(["']?)\w+\2)[ \t]+\S.*/,lookbehind:!0,alias:"punctuation",inside:null},i={bash:o,environment:{pattern:RegExp("\\$"+t),alias:"constant"},variable:[{pattern:/\$?\(\([\s\S]+?\)\)/,greedy:!0,inside:{variable:[{pattern:/(^\$\(\([\s\S]+)\)\)/,lookbehind:!0},/^\$\(\(/],number:/\b0x[\dA-Fa-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:[Ee]-?\d+)?/,operator:/--|\+\+|\*\*=?|<<=?|>>=?|&&|\|\||[=!+\-*/%<>^&|]=?|[?~:]/,punctuation:/\(\(?|\)\)?|,|;/}},{pattern:/\$\((?:\([^)]+\)|[^()])+\)|`[^`]+`/,greedy:!0,inside:{variable:/^\$\(|^`|\)$|`$/}},{pattern:/\$\{[^}]+\}/,greedy:!0,inside:{operator:/:[-=?+]?|[!\/]|##?|%%?|\^\^?|,,?/,punctuation:/[\[\]]/,environment:{pattern:RegExp("(\\{)"+t),lookbehind:!0,alias:"constant"}}},/\$(?:\w+|[#?*!@$])/],entity:/\\(?:[abceEfnrtv\\"]|O?[0-7]{1,3}|U[0-9a-fA-F]{8}|u[0-9a-fA-F]{4}|x[0-9a-fA-F]{1,2})/};e.languages.bash={shebang:{pattern:/^#!\s*\/.*/,alias:"important"},comment:{pattern:/(^|[^"{\\$])#.*/,lookbehind:!0},"function-name":[{pattern:/(\bfunction\s+)[\w-]+(?=(?:\s*\(?:\s*\))?\s*\{)/,lookbehind:!0,alias:"function"},{pattern:/\b[\w-]+(?=\s*\(\s*\)\s*\{)/,alias:"function"}],"for-or-select":{pattern:/(\b(?:for|select)\s+)\w+(?=\s+in\s)/,alias:"variable",lookbehind:!0},"assign-left":{pattern:/(^|[\s;|&]|[<>]\()\w+(?:\.\w+)*(?=\+?=)/,inside:{environment:{pattern:RegExp("(^|[\\s;|&]|[<>]\\()"+t),lookbehind:!0,alias:"constant"}},alias:"variable",lookbehind:!0},parameter:{pattern:/(^|\s)-{1,2}(?:\w+:[+-]?)?\w+(?:\.\w+)*(?=[=\s]|$)/,alias:"variable",lookbehind:!0},string:[{pattern:/((?:^|[^<])<<-?\s*)(\w+)\s[\s\S]*?(?:\r?\n|\r)\2/,lookbehind:!0,greedy:!0,inside:i},{pattern:/((?:^|[^<])<<-?\s*)(["'])(\w+)\2\s[\s\S]*?(?:\r?\n|\r)\3/,lookbehind:!0,greedy:!0,inside:{bash:o}},{pattern:/(^|[^\\](?:\\\\)*)"(?:\\[\s\S]|\$\([^)]+\)|\$(?!\()|`[^`]+`|[^"\\`$])*"/,lookbehind:!0,greedy:!0,inside:i},{pattern:/(^|[^$\\])'[^']*'/,lookbehind:!0,greedy:!0},{pattern:/\$'(?:[^'\\]|\\[\s\S])*'/,greedy:!0,inside:{entity:i.entity}}],environment:{pattern:RegExp("\\$?"+t),alias:"constant"},variable:i.variable,function:{pattern:/(^|[\s;|&]|[<>]\()(?:add|apropos|apt|apt-cache|apt-get|aptitude|aspell|automysqlbackup|awk|basename|bash|bc|bconsole|bg|bzip2|cal|cargo|cat|cfdisk|chgrp|chkconfig|chmod|chown|chroot|cksum|clear|cmp|column|comm|composer|cp|cron|crontab|csplit|curl|cut|date|dc|dd|ddrescue|debootstrap|df|diff|diff3|dig|dir|dircolors|dirname|dirs|dmesg|docker|docker-compose|du|egrep|eject|env|ethtool|expand|expect|expr|fdformat|fdisk|fg|fgrep|file|find|fmt|fold|format|free|fsck|ftp|fuser|gawk|git|gparted|grep|groupadd|groupdel|groupmod|groups|grub-mkconfig|gzip|halt|head|hg|history|host|hostname|htop|iconv|id|ifconfig|ifdown|ifup|import|install|ip|java|jobs|join|kill|killall|less|link|ln|locate|logname|logrotate|look|lpc|lpr|lprint|lprintd|lprintq|lprm|ls|lsof|lynx|make|man|mc|mdadm|mkconfig|mkdir|mke2fs|mkfifo|mkfs|mkisofs|mknod|mkswap|mmv|more|most|mount|mtools|mtr|mutt|mv|nano|nc|netstat|nice|nl|node|nohup|notify-send|npm|nslookup|op|open|parted|passwd|paste|pathchk|ping|pkill|pnpm|podman|podman-compose|popd|pr|printcap|printenv|ps|pushd|pv|quota|quotacheck|quotactl|ram|rar|rcp|reboot|remsync|rename|renice|rev|rm|rmdir|rpm|rsync|scp|screen|sdiff|sed|sendmail|seq|service|sftp|sh|shellcheck|shuf|shutdown|sleep|slocate|sort|split|ssh|stat|strace|su|sudo|sum|suspend|swapon|sync|sysctl|tac|tail|tar|tee|time|timeout|top|touch|tr|traceroute|tsort|tty|umount|uname|unexpand|uniq|units|unrar|unshar|unzip|update-grub|uptime|useradd|userdel|usermod|users|uudecode|uuencode|v|vcpkg|vdir|vi|vim|virsh|vmstat|wait|watch|wc|wget|whereis|which|who|whoami|write|xargs|xdg-open|yarn|yes|zenity|zip|zsh|zypper)(?=$|[)\s;|&])/,lookbehind:!0},keyword:{pattern:/(^|[\s;|&]|[<>]\()(?:case|do|done|elif|else|esac|fi|for|function|if|in|select|then|until|while)(?=$|[)\s;|&])/,lookbehind:!0},builtin:{pattern:/(^|[\s;|&]|[<>]\()(?:\.|:|alias|bind|break|builtin|caller|cd|command|continue|declare|echo|enable|eval|exec|exit|export|getopts|hash|help|let|local|logout|mapfile|printf|pwd|read|readarray|readonly|return|set|shift|shopt|source|test|times|trap|type|typeset|ulimit|umask|unalias|unset)(?=$|[)\s;|&])/,lookbehind:!0,alias:"class-name"},boolean:{pattern:/(^|[\s;|&]|[<>]\()(?:false|true)(?=$|[)\s;|&])/,lookbehind:!0},"file-descriptor":{pattern:/\B&\d\b/,alias:"important"},operator:{pattern:/\d?<>|>\||\+=|=[=~]?|!=?|<<[<-]?|[&\d]?>>|\d[<>]&?|[<>][&=]?|&[>&]?|\|[&|]?/,inside:{"file-descriptor":{pattern:/^\d/,alias:"important"}}},punctuation:/\$?\(\(?|\)\)?|\.\.|[{}[\];\\]/,number:{pattern:/(^|\s)(?:[1-9]\d*|0)(?:[.,]\d+)?\b/,lookbehind:!0}},o.inside=e.languages.bash;for(var s=["comment","function-name","for-or-select","assign-left","parameter","string","environment","function","keyword","builtin","boolean","file-descriptor","operator","punctuation","number"],y=i.variable[1].inside,A=0;A<s.length;A++)y[s[A]]=e.languages.bash[s[A]];e.languages.sh=e.languages.bash,e.languages.shell=e.languages.bash})(Prism);Prism.languages.json={property:{pattern:/(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?=\s*:)/,lookbehind:!0,greedy:!0},string:{pattern:/(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?!\s*:)/,lookbehind:!0,greedy:!0},comment:{pattern:/\/\/.*|\/\*[\s\S]*?(?:\*\/|$)/,greedy:!0},number:/-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i,punctuation:/[{}[\],]/,operator:/:/,boolean:/\b(?:false|true)\b/,null:{pattern:/\bnull\b/,alias:"keyword"}};Prism.languages.webmanifest=Prism.languages.json;var nt={},at;function Yt(){return at||(at=1,(function(e){e.languages.typescript=e.languages.extend("javascript",{"class-name":{pattern:/(\b(?:class|extends|implements|instanceof|interface|new|type)\s+)(?!keyof\b)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?:\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>)?/,lookbehind:!0,greedy:!0,inside:null},builtin:/\b(?:Array|Function|Promise|any|boolean|console|never|number|string|symbol|unknown)\b/}),e.languages.typescript.keyword.push(/\b(?:abstract|declare|is|keyof|readonly|require)\b/,/\b(?:asserts|infer|interface|module|namespace|type)\b(?=\s*(?:[{_$a-zA-Z\xA0-\uFFFF]|$))/,/\btype\b(?=\s*(?:[\{*]|$))/),delete e.languages.typescript.parameter,delete e.languages.typescript["literal-property"];var t=e.languages.extend("typescript",{});delete t["class-name"],e.languages.typescript["class-name"].inside=t,e.languages.insertBefore("typescript","function",{decorator:{pattern:/@[$\w\xA0-\uFFFF]+/,inside:{at:{pattern:/^@/,alias:"operator"},function:/^[\s\S]+/}},"generic-function":{pattern:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>(?=\s*\()/,greedy:!0,inside:{function:/^#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*/,generic:{pattern:/<[\s\S]+/,alias:"class-name",inside:t}}}}),e.languages.ts=e.languages.typescript})(Prism)),nt}Yt();const Xt={js:"JavaScript",ts:"TypeScript",html:"HTML",bash:"Shell",json:"JSON"};function Zt(e){const t=e.split(`
`);for(;t.length&&!t[0].trim();)t.shift();for(;t.length&&!t[t.length-1].trim();)t.pop();const o=t.filter(i=>i.trim()).reduce((i,s)=>Math.min(i,s.match(/^(\s*)/)[1].length),1/0);return t.map(i=>i.slice(o)).join(`
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
    `,computed:{langLabel(){return Xt[this.lang]||this.lang.toUpperCase()}},methods:{copy(){var e;(e=navigator.clipboard)==null||e.writeText(this._cleanCode).then(()=>{this.copied=!0,setTimeout(()=>{this.copied=!1},1800)})}},onMount(){const e=this.$refs.el;e&&(this._cleanCode=Zt(this.code),e.textContent=this._cleanCode,Gt.highlightElement(e))}},he="Courvux",Kt="https://vanjexdev.github.io/courvux";function Z({title:e,description:t,slug:o="/"}){const i=e?`${e} — ${he}`:`${he} — Lightweight reactive UI framework`,s=Kt+o;return Nt({title:e??`${he} — Lightweight reactive UI framework`,titleTemplate:e?`%s — ${he}`:void 0,meta:[{name:"description",content:t},{property:"og:title",content:i},{property:"og:description",content:t},{property:"og:type",content:"website"},{property:"og:url",content:s},{property:"og:site_name",content:he},{name:"twitter:card",content:"summary_large_image"},{name:"twitter:title",content:i},{name:"twitter:description",content:t}],link:[{rel:"canonical",href:s}]})}const Qt={data:{install:`# From GitHub — pin a tag for stable installs
pnpm add github:vanjexdev/courvux#v0.4.6

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
                    <span class="badge">v0.4.6</span>
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
pnpm add github:vanjexdev/courvux#v0.4.6`,s2:`<script type="importmap">
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
    "courvux": "https://cdn.jsdelivr.net/gh/vanjexdev/courvux@v0.4.6/dist/index.js"
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
<button cv-show="todos.some(t => t.done)" @click="clearCompleted()">Clear completed</button>`;function yo(){try{return JSON.parse(localStorage.getItem(mt))||[]}catch{return[]}}function xo(e){localStorage.setItem(mt,JSON.stringify(e))}const wo={data:{todos:yo(),newTodo:"",filter:"all",editingId:null,editText:"",_nextId:Date.now(),srcJs:go,srcHtml:bo,srcTab:"js"},computed:{filteredTodos(){return this.filter==="active"?this.todos.filter(e=>!e.done):this.filter==="completed"?this.todos.filter(e=>e.done):this.todos},remaining(){return this.todos.filter(e=>!e.done).length},allDone(){return this.todos.length>0&&this.todos.every(e=>e.done)}},watch:{todos:{deep:!0,handler(e){xo(e)}}},methods:{add(){const e=this.newTodo.trim();e&&(this.todos=[...this.todos,{id:this._nextId++,text:e,done:!1}],this.newTodo="")},toggle(e){this.todos=this.todos.map(t=>t.id===e?{...t,done:!t.done}:t)},remove(e){this.todos=this.todos.filter(t=>t.id!==e)},clearCompleted(){this.todos=this.todos.filter(e=>!e.done)},toggleAll(){const e=this.allDone;this.todos=this.todos.map(t=>({...t,done:!e}))},startEdit(e){this.editingId=e.id,this.editText=e.text,this.$nextTick(()=>{var t;return(t=this.$refs["edit_"+e.id])==null?void 0:t.focus()})},commitEdit(e){const t=this.editText.trim();t?this.todos=this.todos.map(o=>o.id===e?{...o,text:t}:o):this.remove(e),this.editingId=null,this.editText=""},cancelEdit(){this.editingId=null,this.editText=""},setFilter(e){this.filter=e}},template:`
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
    `,onMount(){Z({title:"Demo — TODO App",description:"Interactive TODO app built with Courvux. Live demo with full source code (JS + HTML).",slug:"/demo"})}},ko=[{path:"/",component:Qt},{path:"/installation",component:eo},{path:"/quick-start",component:to},{path:"/template",component:oo},{path:"/components",component:no},{path:"/reactivity",component:ao},{path:"/lifecycle",component:ro},{path:"/composables",component:io},{path:"/event-bus",component:so},{path:"/router",component:co},{path:"/store",component:lo},{path:"/head",component:uo},{path:"/ssg",component:po},{path:"/devtools",component:mo},{path:"/testing",component:ho},{path:"/pwa",component:fo},{path:"/advanced",component:vo},{path:"/demo",component:wo}],Ao={methods:{goBack(){window.history.back()}},template:`
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
    `,onMount(){Z({title:"404 — Page not found",description:"The page you are looking for does not exist on Courvux docs.",slug:"/404"})}};let Me=null;function So(e){Me=e}const Eo=$t([...ko,{path:"*",component:Ao}],{mode:"history",base:"/courvux",afterEach(){Me&&Me()},scrollBehavior:()=>{var e;return(e=document.querySelector("main"))==null||e.scrollTo({top:0,behavior:"instant"}),{x:0,y:0}}}),rt=[{key:"start",label:"Getting Started",items:[{to:"/",label:"Introduction"},{to:"/installation",label:"Installation"},{to:"/quick-start",label:"Quick Start"}]},{key:"template",label:"Template Syntax",items:[{to:"/template",label:"Directives & Bindings"}]},{key:"components",label:"Components",items:[{to:"/components",label:"Components"},{to:"/reactivity",label:"Reactivity"},{to:"/lifecycle",label:"Lifecycle"},{to:"/composables",label:"Composables"},{to:"/event-bus",label:"Event Bus"}]},{key:"router",label:"Router & Store",items:[{to:"/router",label:"Router"},{to:"/store",label:"Store"}]},{key:"seo",label:"SEO & SSG",items:[{to:"/head",label:"useHead"},{to:"/ssg",label:"Static Generation"}]},{key:"tooling",label:"Tooling",items:[{to:"/devtools",label:"DevTools"},{to:"/testing",label:"Testing"},{to:"/pwa",label:"PWA"}]},{key:"advanced",label:"Advanced",items:[{to:"/advanced",label:"Directives & Plugins"}]},{key:"demo",label:"Demo",items:[{to:"/demo",label:"⚡ TODO App"}]}];Ut({router:Eo,components:{"code-block":Jt},data:{nav:rt,open:rt.reduce((e,t)=>(e[t.key]=!0,e),{}),sidebarOpen:!1},methods:{toggle(e){this.open={...this.open,[e]:!this.open[e]}},toggleSidebar(){if(this.sidebarOpen=!this.sidebarOpen,this.sidebarOpen)document.body.style.overflow="hidden",this.$nextTick(()=>{const e=document.querySelector(".sidebar");e&&(e.style.transform="translateX(0)")});else{document.body.style.overflow="";const e=document.querySelector(".sidebar");e&&(e.style.transform="translateX(-100%)")}},closeSidebar(){if(window.innerWidth<=1024){this.sidebarOpen=!1,document.body.style.overflow="";const e=document.querySelector(".sidebar");e&&(e.style.transform="translateX(-100%)")}}},onMount(){So(()=>{this.closeSidebar()})},onBeforeMount(){typeof window<"u"&&window.addEventListener("resize",()=>{if(window.innerWidth>1024&&this.sidebarOpen){this.sidebarOpen=!1,document.body.style.overflow="";const e=document.querySelector(".sidebar");e&&(e.style.transform="")}})},template:`
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
                    <router-link to="/" @click="closeSidebar()" style="text-decoration:none; display:flex; align-items:center; gap:8px;" aria-label="Courvux v0.4.6 home">
                        <span style="font-size:1.3rem;" aria-hidden="true">⚡</span>
                        <span style="font-weight:700; font-size:15px; color:#111;">Courvux</span>
                        <span style="font-size:10px; color:#666; margin-left:2px;">v0.4.6</span>
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
    `}).mount("#app").catch(e=>{console.error("[courvux] mount failed:",e);const t=document.getElementById("app");t&&(t.innerHTML=`
            <div style="padding:1.5rem; max-width:680px; margin:2rem auto; font-family:ui-monospace,monospace; font-size:13px; color:#111; background:#fff; border:1px solid #ddd; border-radius:8px;">
                <p style="font-weight:600; margin:0 0 8px;">App failed to mount</p>
                <pre style="white-space:pre-wrap; word-break:break-word; margin:0; color:#a33;">${(e&&e.message?e.message:String(e)).replace(/[<>&]/g,o=>({"<":"&lt;",">":"&gt;","&":"&amp;"})[o])}</pre>
                <p style="margin:12px 0 0; color:#666; font-size:12px;">Check the browser console for the full stack trace.</p>
            </div>
        `)});
