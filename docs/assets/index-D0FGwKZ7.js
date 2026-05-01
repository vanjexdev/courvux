(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))c(l);new MutationObserver(l=>{for(const y of l)if(y.type==="childList")for(const E of y.addedNodes)E.tagName==="LINK"&&E.rel==="modulepreload"&&c(E)}).observe(document,{childList:!0,subtree:!0});function o(l){const y={};return l.integrity&&(y.integrity=l.integrity),l.referrerPolicy&&(y.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?y.credentials="include":l.crossOrigin==="anonymous"?y.credentials="omit":y.credentials="same-origin",y}function c(l){if(l.ep)return;l.ep=!0;const y=o(l);fetch(l.href,y)}})();var gt=new Set(["push","pop","shift","unshift","splice","sort","reverse"]),at=t=>t instanceof Date||t instanceof RegExp||t instanceof Map||t instanceof Set||t instanceof WeakMap||t instanceof WeakSet||ArrayBuffer.isView(t)||t instanceof ArrayBuffer,Le=new WeakSet,xe=Symbol("raw"),$e=t=>t===null||typeof t!="object"?t:t[xe]??t,ke=0,je=new Map,fe=null;function Me(t){const e=[],o=fe;fe=e;try{t()}finally{fe=o}return e}function bt(t){ke++;try{t()}finally{if(ke--,ke===0){const e=[...je.values()];je.clear(),e.forEach(o=>o())}}}function it(t,e){return t===null||typeof t!="object"||Le.has(t)||at(t)?t:new Proxy(t,{get(o,c){if(c===xe)return o[xe]??o;if(typeof c=="string"&&Array.isArray(o)&&gt.has(c))return(...y)=>{const E=Array.prototype[c].apply(o,y);return e(),E};const l=o[c];return l!==null&&typeof l=="object"&&!Le.has(l)?it(l,e):l},set(o,c,l){return o[c]=l,e(),!0}})}function Pe(){const t={},e=Math.random().toString(36).slice(2),o=(y,E)=>(t[y]||(t[y]=new Set),t[y].add(E),()=>{var k;(k=t[y])==null||k.delete(E)}),c=y=>{ke>0?je.set(`${e}:${y}`,()=>{(t[y]?[...t[y]]:[]).forEach(E=>E())}):(t[y]?[...t[y]]:[]).forEach(E=>E())},l={};return{subscribe:o,createReactiveState:y=>new Proxy(y,{get(E,k){if(k===xe)return y;typeof k=="string"&&!k.startsWith("$")&&fe&&fe.push({sub:o,key:k});const D=E[k];return typeof k=="string"&&!k.startsWith("$")&&D!==null&&typeof D=="object"&&!Le.has(D)&&!at(D)?it(D,()=>c(k)):D},set(E,k,D){if(l[k])return l[k](D),!0;const $=E[k];return E[k]=D,($!==D||D!==null&&typeof D=="object")&&c(k),!0}}),registerSetInterceptor:(y,E)=>{l[y]=E},notifyAll:()=>{Object.keys(t).forEach(y=>c(y))}}}var Ce=new WeakMap;function ve(t,e,o){var l,y;const c=e.indexOf(".");if(c>=0){const E=e.slice(0,c),k=e.slice(c+1),D=t[E];return D&&Ce.has(D)?ve(D,k,o):((l=Ce.get(t))==null?void 0:l(E,o))??(()=>{})}return((y=Ce.get(t))==null?void 0:y(e,o))??(()=>{})}var st=(t,e)=>t.split(".").reduce((o,c)=>o==null?void 0:o[c],e),ct=(()=>{try{return new Function("return 1")(),!0}catch{return console.warn("[courvux] CSP blocks eval. Expressions limited to property access and literals."),!1}})(),Ie=new Map,Re=new Map,lt=(t,e)=>{const o=t.trim();if(o==="true")return!0;if(o==="false")return!1;if(o==="null")return null;if(o!=="undefined")return/^-?\d+(\.\d+)?$/.test(o)?parseFloat(o):/^(['"`])(.*)\1$/s.test(o)?o.slice(1,-1):o.startsWith("!")?!lt(o.slice(1).trim(),e):st(o,e)},N=(t,e)=>{if(!ct)return lt(t,e);try{let o=Ie.get(t);return o||(o=new Function("$data",`with($data) { return (${t}) }`),Ie.set(t,o)),o(e)}catch{return st(t,e)}},ue=(t,e,o)=>t.startsWith("$store.")&&e.store?e.storeSubscribeOverride?e.storeSubscribeOverride(e.store,t.slice(7),o):ve(e.store,t.slice(7),o):e.subscribe(t,o),K=(t,e,o)=>{const c=new Set(["true","false","null","undefined","in","of","typeof","instanceof"]),l=t.match(/\$?[a-zA-Z_][\w$]*(?:\.\$?[a-zA-Z_][\w$]*)*/g)??[],y=[...new Set(l.map(k=>k.startsWith("$store.")?k:k.split(".")[0]).filter(k=>!c.has(k)))];if(y.length===0)return()=>{};const E=y.map(k=>ue(k,e,o));return()=>E.forEach(k=>k())},le=(t,e,o)=>{const c=t.split(".");if(c.length===1)e[c[0]]=o;else{const l=c.slice(0,-1).reduce((y,E)=>y==null?void 0:y[E],e);l&&(l[c[c.length-1]]=o)}},ze=(t,e,o,c,l)=>{const y={};return Object.keys(t).forEach(E=>y[E]=t[E]),y[o]=e,l&&(y[l]=c),y},De=t=>t?typeof t=="string"?t:Array.isArray(t)?t.map(De).filter(Boolean).join(" "):typeof t=="object"?Object.entries(t).filter(([,e])=>!!e).map(([e])=>e).join(" "):"":"",He=(t,e,o)=>{if(!e){t.style.cssText=o;return}typeof e=="string"?t.style.cssText=o?`${o};${e}`:e:typeof e=="object"&&(o&&(t.style.cssText=o),Object.entries(e).forEach(([c,l])=>{t.style[c]=l??""}))},Ne=(t,e,o)=>{if(ct)try{let c=Re.get(t);c||(c=new Function("__p__",`with(__p__){${t}}`),Re.set(t,c));const l=new Proxy({},{has:()=>!0,get:(y,E)=>E==="$event"?o:E in e?e[E]:globalThis[E],set:(y,E,k)=>(e[E]=k,!0)});c(l)}catch(c){console.warn(`[courvux] handler error "${t}":`,c)}},ie=t=>{const e=getComputedStyle(t),o=Math.max(parseFloat(e.animationDuration)||0,parseFloat(e.transitionDuration)||0)*1e3;return o<=0?Promise.resolve():new Promise(c=>{const l=()=>c();t.addEventListener("animationend",l,{once:!0}),t.addEventListener("transitionend",l,{once:!0}),setTimeout(l,o+50)})},yt=`
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
`,We=!1;function Ue(){if(We||typeof document>"u")return;We=!0;const t=document.createElement("style");t.id="cv-transitions-el",t.textContent=yt,document.head.appendChild(t)}var Be=!1;function kt(){if(Be||typeof document>"u")return;Be=!0;const t=document.createElement("style");t.id="cv-cloak-style",t.textContent="[cv-cloak]{display:none!important}",document.head.appendChild(t)}function wt(t){if(typeof window<"u"&&"Sanitizer"in window){const o=document.createElement("div");return o.setHTML(t,{sanitizer:new window.Sanitizer}),o.innerHTML}const e=new DOMParser().parseFromString(t,"text/html");return e.querySelectorAll("script,iframe,object,embed,form,meta,link,style").forEach(o=>o.remove()),e.querySelectorAll("*").forEach(o=>{Array.from(o.attributes).forEach(c=>{(c.name.startsWith("on")||c.value.trim().toLowerCase().startsWith("javascript:"))&&o.removeAttribute(c.name)})}),e.body.innerHTML}async function oe(t,e,o){var y,E,k,D,$,x,V,j,H,R,C,P,_,d,a,v,S;const c=Array.from(t.childNodes);let l=0;for(;l<c.length;){const A=c[l];if(A.nodeType===3){const i=A.textContent||"",r=i.match(/\{\{([\s\S]+?)\}\}/g);if(r){const s=i,u=()=>{let m=s;r.forEach(p=>{const b=p.replace(/^\{\{\s*/,"").replace(/\s*\}\}$/,"");m=m.replace(p,N(b,e)??"")}),A.textContent=m};r.forEach(m=>{K(m.replace(/^\{\{\s*/,"").replace(/\s*\}\}$/,""),o,u)}),u()}l++;continue}if(A.nodeType!==1){l++;continue}const n=A,h=n.tagName.toLowerCase();if(n.hasAttribute("cv-pre")){n.removeAttribute("cv-pre"),l++;continue}if(n.hasAttribute("cv-once")){n.removeAttribute("cv-once"),await oe(n,e,{...o,subscribe:()=>()=>{},storeSubscribeOverride:()=>()=>{}}),l++;continue}if(n.hasAttribute("cv-cloak")&&n.removeAttribute("cv-cloak"),n.hasAttribute("cv-teleport")){const i=n.getAttribute("cv-teleport");n.removeAttribute("cv-teleport");const r=document.querySelector(i)??document.body,s=document.createComment(`cv-teleport: ${i}`);n.replaceWith(s),await oe(n,e,o),r.appendChild(n),l++;continue}if(n.hasAttribute("cv-memo")){const i=n.getAttribute("cv-memo");n.removeAttribute("cv-memo");const r=()=>i.split(",").map(b=>N(b.trim(),e));let s=r();const u=[],m=b=>(u.push(b),()=>{const g=u.indexOf(b);g>-1&&u.splice(g,1)});await oe(n,e,{...o,subscribe:(b,g)=>m(g),storeSubscribeOverride:(b,g,w)=>m(w)});const p=K(i,o,()=>{const b=r();b.some((g,w)=>g!==s[w])&&(s=b,[...u].forEach(g=>g()))});(y=o.registerCleanup)==null||y.call(o,()=>p()),l++;continue}if(n.hasAttribute("cv-data")){const i=n.getAttribute("cv-data").trim();n.removeAttribute("cv-data");let r={},s={};if(i.startsWith("{")){const u=N(i,e)??{};Object.entries(u).forEach(([m,p])=>{typeof p=="function"?s[m]=p:r[m]=p})}else if(i){const u=(E=o.components)==null?void 0:E[i];if(u){const m=typeof u.data=="function"?u.data():u.data??{};m instanceof Promise||Object.assign(r,m),Object.assign(s,u.methods??{})}}if(o.createChildScope){const u=o.createChildScope(r,s);(k=o.registerCleanup)==null||k.call(o,u.cleanup),await oe(n,u.state,{...o,subscribe:u.subscribe})}else await oe(n,{...e,...r,...s},o);l++;continue}if(n.hasAttribute("cv-for")){const i=n.getAttribute("cv-for");n.removeAttribute("cv-for");const r=i.match(/^\(?(\w+)(?:,\s*(\w+))?\)?\s+in\s+(.+)$/);if(r){const[,s,u,m]=r,p=n.getAttribute(":key")??null;p&&n.removeAttribute(":key");const b=n.getAttribute("cv-transition")??null;b&&n.removeAttribute("cv-transition");const g=document.createComment(`cv-for: ${m}`);n.replaceWith(g);let w=[],L=[];const F=new Map,W=async()=>{var G;const z=N(m,e),M=z?typeof z=="number"?Array.from({length:z},(I,B)=>[B+1,B]):Array.isArray(z)?z.map((I,B)=>[I,B]):Object.entries(z).map(([I,B])=>[B,I]):[];if(p){const I=[],B=new Map,Q=new Set;for(const[X,Y]of M){const re=N(p,ze(e,X,s,Y,u));Q.has(re)&&console.warn(`[courvux] cv-for: duplicate :key "${re}" in "${m}"`),Q.add(re),I.push(re),B.set(re,[X,Y])}const q=[];for(const[X,{el:Y,destroy:re}]of F)B.has(X)||(b?(Y.classList.add(`${b}-leave`),q.push(ie(Y).then(()=>{var ae;Y.classList.remove(`${b}-leave`),re(),(ae=Y.parentNode)==null||ae.removeChild(Y),F.delete(X)}))):(re(),(G=Y.parentNode)==null||G.removeChild(Y),F.delete(X)));q.length&&await Promise.all(q);const U=g.parentNode,te=[];for(const X of I){const[Y,re]=B.get(X);if(F.has(X)){const ae=F.get(X);ae.itemRef!==Y&&(ae.reactive[s]=Y,ae.itemRef=Y),u&&(ae.reactive[u]=re)}else{const ae=n.cloneNode(!0),Se=[],{subscribe:mt,createReactiveState:ht}=Pe(),Ee=ht({[s]:Y,...u?{[u]:re}:{}}),ft=new Proxy({},{has(se,ee){return!0},get(se,ee){return typeof ee!="string"?e[ee]:ee===s||u&&ee===u?Ee[ee]:e[ee]},set(se,ee,ce){return ee===s||u&&ee===u?(Ee[ee]=ce,!0):(e[ee]=ce,!0)}}),vt={...o,subscribe:(se,ee)=>{const ce=se.split(".")[0];let de;return ce===s||u&&ce===u?de=mt(ce,ee):de=o.subscribe(se,ee),Se.push(de),de},storeSubscribeOverride:(se,ee,ce)=>{const de=ve(se,ee,ce);return Se.push(de),de}},_e=document.createDocumentFragment();_e.appendChild(ae),await oe(_e,ft,vt);const Te=_e.firstChild??ae;b&&Te.classList.add(`${b}-enter`),F.set(X,{el:Te,reactive:Ee,itemRef:Y,destroy:()=>Se.forEach(se=>se())}),b&&te.push(Te)}}let J=g.nextSibling,pe=0;for(const X of I){const{el:Y}=F.get(X);Y!==J?pe++:J=Y.nextSibling}if(pe>0)if(pe>I.length>>1){const X=document.createDocumentFragment();for(const Y of I)X.appendChild(F.get(Y).el);U.insertBefore(X,g.nextSibling)}else{J=g.nextSibling;for(const X of I){const{el:Y}=F.get(X);Y!==J?U.insertBefore(Y,J):J=Y.nextSibling}}w=I.map(X=>F.get(X).el),te.length&&Promise.all(te.map(X=>ie(X).then(()=>X.classList.remove(`${b}-enter`))))}else{if(L.forEach(q=>q()),L=[],w.forEach(q=>{var U;return(U=q.parentNode)==null?void 0:U.removeChild(q)}),w=[],!M.length)return;const I=g.parentNode,B=g.nextSibling,Q={...o,subscribe:(q,U)=>{const te=o.subscribe(q,U);return L.push(te),te},storeSubscribeOverride:(q,U,te)=>{const J=ve(q,U,te);return L.push(J),J}};for(const[q,U]of M){const te=n.cloneNode(!0),J=document.createDocumentFragment();J.appendChild(te),await oe(J,ze(e,q,s,U,u),Q);const pe=J.firstChild??te;I.insertBefore(J,B),w.push(pe)}}};(D=o.registerCleanup)==null||D.call(o,()=>{F.forEach(({el:z,destroy:M})=>{var G;M(),(G=z.parentNode)==null||G.removeChild(z)}),F.clear(),L.forEach(z=>z()),w.forEach(z=>{var M;return(M=z.parentNode)==null?void 0:M.removeChild(z)}),w=[]}),K(m,o,W),await W()}l++;continue}if(n.hasAttribute("cv-if")){const i=[],r=n.getAttribute("cv-if");n.removeAttribute("cv-if");const s=document.createComment("cv-if");n.replaceWith(s),i.push({condition:r,template:n,anchor:s});let u=l+1;for(;u<c.length;){const w=c[u];if(w.nodeType===3&&((($=w.textContent)==null?void 0:$.trim())??"")===""){u++;continue}if(w.nodeType!==1)break;const L=w;if(L.hasAttribute("cv-else-if")){const F=L.getAttribute("cv-else-if");L.removeAttribute("cv-else-if");const W=document.createComment("cv-else-if");L.replaceWith(W),i.push({condition:F,template:L,anchor:W}),u++;continue}if(L.hasAttribute("cv-else")){L.removeAttribute("cv-else");const F=document.createComment("cv-else");L.replaceWith(F),i.push({condition:null,template:L,anchor:F}),u++;break}break}l=u;let m=null,p=!1,b=!1;const g=async()=>{var w,L;if(p){b=!0;return}p=!0;try{do{b=!1,m&&((w=m.parentNode)==null||w.removeChild(m),m=null);for(const F of i)if(F.condition===null||N(F.condition,e)){const W=F.template.cloneNode(!0),z=document.createDocumentFragment();z.appendChild(W),await oe(z,e,o);const M=z.firstChild??W;(L=F.anchor.parentNode)==null||L.insertBefore(z,F.anchor.nextSibling),m=M;break}}while(b)}finally{p=!1}};i.filter(w=>w.condition).forEach(w=>{K(w.condition,o,g)}),await g();continue}if(n.hasAttribute("cv-show")){const i=n.getAttribute("cv-show");n.removeAttribute("cv-show");const r=Array.from(n.attributes).filter(s=>s.name==="cv-transition"||s.name.startsWith("cv-transition:")||s.name.startsWith("cv-transition."));if(r.length>0){const s=M=>(n.getAttribute(M)??"").split(" ").filter(Boolean),u=s("cv-transition:enter"),m=s("cv-transition:enter-start"),p=s("cv-transition:enter-end"),b=s("cv-transition:leave"),g=s("cv-transition:leave-start"),w=s("cv-transition:leave-end"),L=n.getAttribute("cv-transition")??"",F=new Set(L.split(".").slice(1)),W=[...F].find(M=>/^\d+$/.test(M)),z=W?parseInt(W):200;if(u.length||m.length||b.length||g.length){r.forEach(q=>n.removeAttribute(q.name));const M=()=>new Promise(q=>requestAnimationFrame(()=>requestAnimationFrame(()=>q())));let G=!!N(i,e),I=!1,B=null;const Q=async q=>{if(I){B=q;return}I=!0;try{q?(n.style.display="",n.classList.add(...u,...m),await M(),n.classList.remove(...m),n.classList.add(...p),await ie(n),n.classList.remove(...u,...p)):(n.classList.add(...b,...g),await M(),n.classList.remove(...g),n.classList.add(...w),await ie(n),n.classList.remove(...b,...w),n.style.display="none"),G=q}finally{if(I=!1,B!==null&&B!==G){const U=B;B=null,Q(U)}else B=null}};G||(n.style.display="none"),K(i,o,()=>{const q=!!N(i,e);q!==G&&Q(q)})}else{const M=[...F].find(U=>U==="scale"||/^scale$/.test(U)),G=(()=>{const U=[...F].find(te=>/^\d+$/.test(te)&&te!==W);return U?parseInt(U)/100:.9})(),I=[];(!F.has("scale")||F.has("opacity"))&&I.push(`opacity ${z}ms ease`),M&&I.push(`transform ${z}ms ease`),I.length||I.push(`opacity ${z}ms ease`),n.style.transition=(n.style.transition?n.style.transition+", ":"")+I.join(", "),r.forEach(U=>n.removeAttribute(U.name));let B=!!N(i,e);const Q=()=>new Promise(U=>requestAnimationFrame(()=>requestAnimationFrame(()=>U()))),q=async U=>{U?(n.style.display="",n.style.opacity="0",M&&(n.style.transform=`scale(${G})`),await Q(),n.style.opacity="",M&&(n.style.transform=""),await ie(n)):(n.style.opacity="0",M&&(n.style.transform=`scale(${G})`),await ie(n),n.style.display="none",n.style.opacity="",M&&(n.style.transform="")),B=U};B||(n.style.display="none"),K(i,o,()=>{const U=!!N(i,e);U!==B&&q(U)})}}else{const s=n.getAttribute("cv-show-transition"),u=n.getAttribute(":transition");s&&n.removeAttribute("cv-show-transition"),u&&n.removeAttribute(":transition");const m=s??(u?String(N(u,e)):null);if(m){Ue();let p=!!N(i,e);p||(n.style.display="none");let b=!1,g=null;const w=async L=>{if(b){g=L;return}b=!0;try{L?(n.style.display="",n.classList.add(`${m}-enter`),await ie(n),n.classList.remove(`${m}-enter`)):(n.classList.add(`${m}-leave`),await ie(n),n.classList.remove(`${m}-leave`),n.style.display="none"),p=L}finally{if(b=!1,g!==null&&g!==p){const F=g;g=null,w(F)}else g=null}};K(i,o,()=>{const L=!!N(i,e);L!==p&&w(L)})}else{const p=()=>{n.style.display=N(i,e)?"":"none"};K(i,o,p),p()}}}if(n.hasAttribute("cv-focus")){const i=n.getAttribute("cv-focus")??"";if(n.removeAttribute("cv-focus"),!i)Promise.resolve().then(()=>n.focus());else{const r=()=>{N(i,e)&&Promise.resolve().then(()=>n.focus())};K(i,o,r),r()}}{const i=Array.from(n.attributes).filter(r=>r.name==="cv-intersect"||r.name.startsWith("cv-intersect:")||r.name.startsWith("cv-intersect."));if(i.length&&typeof IntersectionObserver<"u"){const r=i.find(M=>M.name==="cv-intersect"||M.name==="cv-intersect:enter"||M.name.startsWith("cv-intersect.")),s=i.find(M=>M.name==="cv-intersect:leave"),u=(r==null?void 0:r.value)??"",m=(s==null?void 0:s.value)??"",p=((r==null?void 0:r.name)??"cv-intersect").split("."),b=new Set(p.slice(1)),g=b.has("once");let w=0;if(b.has("half"))w=.5;else if(b.has("full"))w=1;else{const M=[...b].find(G=>G.startsWith("threshold-"));M&&(w=parseInt(M.replace("threshold-",""))/100)}const L=[...b].find(M=>M.startsWith("margin-")),F=L?`${L.replace("margin-","")}px`:void 0;i.forEach(M=>n.removeAttribute(M.name));const W=M=>{if(M)try{new Function("$data",`with($data){${M}}`)(e)}catch(G){console.warn(`[courvux] cv-intersect error "${M}":`,G)}},z=new IntersectionObserver(M=>{M.forEach(G=>{G.isIntersecting?(W(u),g&&z.disconnect()):W(m)})},{threshold:w,...F?{rootMargin:F}:{}});z.observe(n),(x=o.registerCleanup)==null||x.call(o,()=>z.disconnect())}}{const i=Array.from(n.attributes).find(r=>r.name==="cv-html"||r.name.startsWith("cv-html."));if(i){const r=i.value;n.removeAttribute(i.name);const s=i.name.split(".").slice(1).includes("sanitize"),u=()=>{const m=String(N(r,e)??"");n.innerHTML=s?wt(m):m};K(r,o,u),u(),l++;continue}}if(n.hasAttribute("cv-ref")&&!((V=o.components)!=null&&V[h])){const i=n.getAttribute("cv-ref");n.removeAttribute("cv-ref"),o.refs&&(o.refs[i]=n)}const f=!!((j=o.components)!=null&&j[h]),T=Array.from(n.attributes).find(i=>i.name==="cv-model"||i.name.startsWith("cv-model."));if(T&&!f){const i=T.value;n.removeAttribute(T.name);const r=new Set(T.name.split(".").slice(1)),s=n,u=(H=s.type)==null?void 0:H.toLowerCase(),m=p=>{if(r.has("number")){const b=parseFloat(p);return isNaN(b)?p:b}return r.has("trim")?p.trim():p};if(u==="checkbox"){const p=()=>{const b=N(i,e);s.checked=Array.isArray(b)?b.includes(s.value):!!b};ue(i,o,p),p(),s.addEventListener("change",()=>{const b=N(i,e);if(Array.isArray(b)){const g=[...b];if(s.checked)g.includes(s.value)||g.push(s.value);else{const w=g.indexOf(s.value);w>-1&&g.splice(w,1)}le(i,e,g)}else le(i,e,s.checked)})}else if(u==="radio"){const p=()=>{s.checked=N(i,e)===s.value};ue(i,o,p),p(),s.addEventListener("change",()=>{s.checked&&le(i,e,m(s.value))})}else if(n.hasAttribute("contenteditable")){const p=n,b=()=>{const g=String(N(i,e)??"");p.innerText!==g&&(p.innerText=g)};if(ue(i,o,b),b(),r.has("debounce")){const g=[...r].find(F=>/^\d+$/.test(F)),w=g?parseInt(g):300;let L;p.addEventListener("input",()=>{clearTimeout(L),L=setTimeout(()=>le(i,e,m(p.innerText)),w)})}else{const g=r.has("lazy")?"blur":"input";p.addEventListener(g,()=>le(i,e,m(p.innerText)))}}else{const p=()=>{s.value=N(i,e)??""};if(ue(i,o,p),p(),r.has("debounce")){const b=[...r].find(L=>/^\d+$/.test(L)),g=b?parseInt(b):300;let w;s.addEventListener("input",()=>{clearTimeout(w),w=setTimeout(()=>le(i,e,m(s.value)),g)})}else{const b=h==="select"||r.has("lazy")?"change":"input";s.addEventListener(b,()=>le(i,e,m(s.value)))}}}if(o.directives&&Array.from(n.attributes).forEach(i=>{var W,z;if(!i.name.startsWith("cv-"))return;const r=i.name.slice(3).split("."),s=r[0],u=r.slice(1),m=s.indexOf(":"),p=m>=0?s.slice(0,m):s,b=m>=0?s.slice(m+1):void 0,g=o.directives[p];if(!g)return;const w=i.value;n.removeAttribute(i.name);const L=typeof g=="function"?{onMount:g}:g,F={value:w?N(w,e):void 0,arg:b,modifiers:Object.fromEntries(u.map(M=>[M,!0]))};(W=L.onMount)==null||W.call(L,n,F),L.onUpdate&&w&&K(w,o,()=>{F.value=N(w,e),L.onUpdate(n,F)}),L.onDestroy&&((z=o.registerCleanup)==null||z.call(o,()=>L.onDestroy(n,F)))}),h==="slot"){const i=n.getAttribute("name")??"default",r=(R=o.slots)==null?void 0:R[i];if(r){const s={};Array.from(n.attributes).forEach(p=>{p.name.startsWith(":")&&(s[p.name.slice(1)]=N(p.value,e))});const u=await r(s),m=document.createDocumentFragment();u.forEach(p=>m.appendChild(p)),n.replaceWith(m)}else{const s=document.createDocumentFragment();for(;n.firstChild;)s.appendChild(n.firstChild);await oe(s,e,o),n.replaceWith(s)}l++;continue}if(h==="cv-transition"){Ue();const i=n.getAttribute("name")??"fade",r=n.getAttribute(":show")??null;n.removeAttribute("name"),r&&n.removeAttribute(":show");const s=document.createElement("div");for(s.className="cv-t-wrap";n.firstChild;)s.appendChild(n.firstChild);if(n.replaceWith(s),await oe(s,e,o),r){let u=!!N(r,e),m=!1,p=null;u||(s.style.display="none");const b=async g=>{if(m){p=g;return}m=!0;try{g?(s.style.display="",s.classList.add(`${i}-enter`),await ie(s),s.classList.remove(`${i}-enter`)):(s.classList.add(`${i}-leave`),await ie(s),s.classList.remove(`${i}-leave`),s.style.display="none"),u=g}finally{if(m=!1,p!==null&&p!==u){const w=p;p=null,b(w)}else p=null}};K(r,o,()=>{const g=!!N(r,e);g!==u&&b(g)})}l++;continue}if(h==="router-view"&&o.mountRouterView){const i=n.getAttribute("name")??void 0;n.setAttribute("aria-live","polite"),n.setAttribute("aria-atomic","true"),await o.mountRouterView(n,i),l++;continue}if(h==="router-link"){const i=n.getAttribute(":to"),r=n.getAttribute("to"),s=()=>i?String(N(i,e)??"/"):r||"/",u=document.createElement("a");u.innerHTML=n.innerHTML,Array.from(n.attributes).forEach(w=>{w.name!=="to"&&w.name!==":to"&&u.setAttribute(w.name,w.value)});const m=((C=o.router)==null?void 0:C.base)??"",p=w=>m?w===m?"/":w.startsWith(m+"/")?w.slice(m.length)||"/":w||"/":w||"/",b=()=>{var w;return((w=o.router)==null?void 0:w.mode)==="history"?p(window.location.pathname):window.location.hash.slice(1)||"/"},g=()=>{var F;const w=s(),L=b()===w;((F=o.router)==null?void 0:F.mode)==="history"?u.href=`${m}${w}`:u.href=`#${w}`,L?(u.setAttribute("aria-current","page"),u.classList.add("active")):(u.removeAttribute("aria-current"),u.classList.remove("active"))};((P=o.router)==null?void 0:P.mode)==="history"?(u.addEventListener("click",w=>{w.preventDefault(),o.router.navigate(s())}),window.addEventListener("popstate",g)):window.addEventListener("hashchange",g),i&&ue(i,o,g),g(),n.replaceWith(u),await oe(u,e,o),l++;continue}if(h==="component"&&n.hasAttribute(":is")&&o.mountDynamic){const i=n.getAttribute(":is");n.removeAttribute(":is");const r=document.createComment("component:is");n.replaceWith(r),await o.mountDynamic(r,i,n,e,o),l++;continue}if((_=o.components)!=null&&_[h]&&o.mountElement){await o.mountElement(n,h,e,o),l++;continue}{const i=Array.from(n.attributes).find(r=>r.name==="cv-intersect"||r.name.startsWith("cv-intersect."));if(i&&typeof IntersectionObserver<"u"){const r=new Set(i.name.split(".").slice(1));n.removeAttribute(i.name);const s=N(i.value,e);let u,m=0,p="0px",b=r.has("once");if(typeof s=="function"?u=g=>s.call(e,g):s&&typeof s=="object"&&(typeof s.handler=="function"&&(u=g=>s.handler.call(e,g)),s.threshold!==void 0&&(m=s.threshold),s.margin&&(p=s.margin),s.once&&(b=!0)),u){const g=new IntersectionObserver(w=>{const L=w[0];u(L),b&&L.isIntersecting&&g.disconnect()},{threshold:m,rootMargin:p});g.observe(n),(d=o.registerCleanup)==null||d.call(o,()=>g.disconnect())}}}if(n.hasAttribute("cv-resize")){const i=n.getAttribute("cv-resize");if(n.removeAttribute("cv-resize"),typeof ResizeObserver<"u"){const r=N(i,e);let s,u="content-box";if(typeof r=="function"?s=m=>r.call(e,m):r&&typeof r=="object"&&(typeof r.handler=="function"&&(s=m=>r.handler.call(e,m)),r.box&&(u=r.box)),s){const m=new ResizeObserver(p=>{p[0]&&s(p[0])});m.observe(n,{box:u}),(a=o.registerCleanup)==null||a.call(o,()=>m.disconnect())}}}if(n.hasAttribute("cv-scroll")){const i=n.getAttribute("cv-scroll");n.removeAttribute("cv-scroll");const r=N(i,e);let s,u=0;if(typeof r=="function"?s=m=>r.call(e,m):r&&typeof r=="object"&&(typeof r.handler=="function"&&(s=m=>r.handler.call(e,m)),r.throttle&&(u=r.throttle)),s){let m=0;const p=()=>{const b=Date.now();u>0&&b-m<u||(m=b,s({scrollTop:n.scrollTop,scrollLeft:n.scrollLeft,scrollHeight:n.scrollHeight,scrollWidth:n.scrollWidth,clientHeight:n.clientHeight,clientWidth:n.clientWidth}))};n.addEventListener("scroll",p,{passive:!0}),(v=o.registerCleanup)==null||v.call(o,()=>n.removeEventListener("scroll",p))}}if(n.hasAttribute("cv-clickoutside")){const i=n.getAttribute("cv-clickoutside");n.removeAttribute("cv-clickoutside");const r=s=>{n.contains(s.target)||(typeof e[i]=="function"?e[i].call(e,s):Ne(i,e,s))};document.addEventListener("click",r,!0),(S=o.registerCleanup)==null||S.call(o,()=>document.removeEventListener("click",r,!0))}if(n.hasAttribute("cv-bind")){const i=n.getAttribute("cv-bind");n.removeAttribute("cv-bind");const r=n.getAttribute("class")??"",s=n.getAttribute("style")??"";let u=[];const m=()=>{const p=N(i,e)??{},b=Object.keys(p);for(const g of u)g in p||(g==="class"?n.className=r:g==="style"?n.style.cssText=s:n.removeAttribute(g));for(const[g,w]of Object.entries(p))g==="class"?n.className=[r,De(w)].filter(Boolean).join(" "):g==="style"?He(n,w,s):w==null||w===!1?n.removeAttribute(g):n.setAttribute(g,w===!0?"":String(w));u=b};K(i,o,m),m()}const O={enter:"Enter",esc:"Escape",escape:"Escape",space:" ",tab:"Tab",delete:"Delete",backspace:"Backspace",up:"ArrowUp",down:"ArrowDown",left:"ArrowLeft",right:"ArrowRight"};Array.from(n.attributes).forEach(i=>{if(i.name.startsWith("@")||i.name.startsWith("cv:on:")){const r=(i.name.startsWith("@")?i.name.substring(1):i.name.substring(6)).split("."),s=r[0],u=new Set(r.slice(1)),m=[...u].find(w=>w in O),p=i.value,b=w=>{u.has("prevent")&&w.preventDefault(),u.has("stop")&&w.stopPropagation(),!(u.has("self")&&w.target!==w.currentTarget)&&(m&&w.key!==O[m]||(typeof e[p]=="function"?e[p].call(e,w):Ne(p,e,w)))},g={};u.has("once")&&(g.once=!0),u.has("passive")&&(g.passive=!0),u.has("capture")&&(g.capture=!0),n.addEventListener(s,b,Object.keys(g).length?g:void 0)}else if(i.name.startsWith(":")){const r=i.name.slice(1),s=i.value;if(r==="class"){const u=n.getAttribute("class")??"",m=()=>{n.className=[u,De(N(s,e))].filter(Boolean).join(" ")};K(s,o,m),m()}else if(r==="style"){const u=n.getAttribute("style")??"",m=()=>He(n,N(s,e),u);K(s,o,m),m()}else if(r.includes("-")){const u=()=>{const m=N(s,e);m==null||m===!1?n.removeAttribute(r):n.setAttribute(r,m===!0?"":String(m))};K(s,o,u),u()}else{const u=()=>{n[r]=N(s,e)??""};K(s,o,u),u()}}}),A.hasChildNodes()&&await oe(A,e,o),l++}}var xt=`
router-view.fade-leave{animation:cv-fade-out 0.25s forwards}
router-view.fade-enter{animation:cv-fade-in 0.25s forwards}
router-view.slide-up-leave{animation:cv-slide-up-out 0.25s forwards}
router-view.slide-up-enter{animation:cv-slide-up-in 0.25s forwards}
@keyframes cv-fade-out{to{opacity:0}}
@keyframes cv-fade-in{from{opacity:0}}
@keyframes cv-slide-up-out{to{opacity:0;transform:translateY(-12px)}}
@keyframes cv-slide-up-in{from{opacity:0;transform:translateY(12px)}}
`;function At(){if(document.getElementById("cv-transitions"))return;const t=document.createElement("style");t.id="cv-transitions",t.textContent=xt,document.head.appendChild(t)}async function ge(t,e,o){t.classList.add(`${e}-${o}`);const c=getComputedStyle(t),l=Math.max(parseFloat(c.animationDuration)||0,parseFloat(c.transitionDuration)||0)*1e3;l>0&&await new Promise(y=>{const E=()=>y();t.addEventListener("animationend",E,{once:!0}),t.addEventListener("transitionend",E,{once:!0}),setTimeout(E,l+50)}),t.classList.remove(`${e}-${o}`)}var we=new Map;async function St(t){if(typeof t!="function")return t;if(we.has(t))return we.get(t);const e=await t();return we.set(t,e.default),e.default}function qe(t,e){if(t.components)return t.components[e];if(e==="default")return t.component}function Ve(t,e){if(t==="*")return{};const o=[],c=t.replace(/:(\w+)/g,(y,E)=>(o.push(E),"([^/]+)")),l=e.match(new RegExp(`^${c}$`));return l?Object.fromEntries(o.map((y,E)=>[y,l[E+1]])):null}function Et(t,e){if(t==="/")return{params:{},remaining:e};const o=[],c=t.replace(/:(\w+)/g,(y,E)=>(o.push(E),"([^/]+)")),l=e.match(new RegExp(`^${c}(/.+)?$`));return l?{params:Object.fromEntries(o.map((y,E)=>[y,l[E+1]])),remaining:l[o.length+1]||"/"}:null}function dt(t,e=""){return t.map(o=>{var l;if(o.path==="*")return o;const c=((e.endsWith("/")?e.slice(0,-1):e)+o.path).replace(/\/+/g,"/")||"/";return(l=o.children)!=null&&l.length?{...o,path:c,children:dt(o.children,c==="/"?"":c)}:{...o,path:c}})}var me=(t,e)=>new Promise(o=>t(e,o)),Ge=(t,e)=>t!=null&&t.beforeLeave?new Promise(o=>t.beforeLeave(e,o)):Promise.resolve(void 0);function _t(t,e={}){const o=e.mode??"hash",c=Tt(e.base??"");return{routes:dt(t),mode:o,base:c,transition:e.transition,beforeEach:e.beforeEach,afterEach:e.afterEach,scrollBehavior:e.scrollBehavior,navigate(l,y){const E=Ye(l,y==null?void 0:y.query);o==="history"?(history.pushState({},"",`${c}${E}`),window.dispatchEvent(new PopStateEvent("popstate"))):window.location.hash=E},replace(l,y){const E=Ye(l,y==null?void 0:y.query);if(o==="history")history.replaceState({},"",`${c}${E}`),window.dispatchEvent(new PopStateEvent("popstate"));else{const k=window.location.href.split("#")[0];window.location.replace(`${k}#${E}`)}},back(){history.back()},forward(){history.forward()}}}function Tt(t){if(!t||t==="/")return"";let e=t.startsWith("/")?t:`/${t}`;return e.endsWith("/")&&(e=e.slice(0,-1)),e}function $t(t,e){return e?t===e?"/":t.startsWith(e+"/")?t.slice(e.length)||"/":t||"/":t||"/"}function Ye(t,e){return!e||!Object.keys(e).length?t:`${t}?${new URLSearchParams(e).toString()}`}function Xe(t){if(!t)return{};const e=new URLSearchParams(t.startsWith("?")?t.slice(1):t),o={};return e.forEach((c,l)=>{o[l]=c}),o}function Ze(t,e,o,c="default",l){const y=e.base??"",E=()=>e.mode==="history"?$t(window.location.pathname,y):(window.location.hash.slice(1)||"/").split("?")[0]||"/",k=()=>{if(e.mode==="history")return Xe(window.location.search);const a=window.location.hash.slice(1)||"/",v=a.indexOf("?");return v>=0?Xe(a.slice(v+1)):{}};e.transition&&At();let D=null,$=null,x=null,V=null,j=!1;const H=()=>{j||(j=!0,l==null||l())},R=new Map,C=a=>{var v;if(a!=null&&a.keepAlive&&x){(v=x.deactivate)==null||v.call(x);const S=document.createDocumentFragment();for(;t.firstChild;)S.appendChild(t.firstChild);R.set(D.path,{fragment:S,activation:x}),x=null}else x==null||x.destroy(),x=null,t.innerHTML=""},P=async(a,v,S,A,n)=>{const h=typeof v=="function"&&!we.has(v),f=h?v.__asyncOptions:void 0,T=a.loadingTemplate??(f==null?void 0:f.loadingTemplate);h&&T&&(t.innerHTML=T);let O;try{O=await St(v)}catch(i){const r=f==null?void 0:f.errorTemplate;if(r)return t.innerHTML=r,{destroy:()=>{t.innerHTML=""}};throw i}return h&&T&&(t.innerHTML=""),o(t,O,S,A,n)},_=async()=>{var S,A,n,h,f,T,O,i;const a=E(),v=k();for(const r of e.routes){if((S=r.children)!=null&&S.length){const u=Et(r.path,a);if(u!==null)for(const m of r.children){const p=Ve(m.path,a);if(p!==null){const b={params:u.params,query:v,path:a,meta:r.meta};if(m.redirect){const F={params:p,query:v,path:a,meta:m.meta},W=typeof m.redirect=="function"?m.redirect(F):m.redirect;e.navigate(W);return}if(e.beforeEach){const F=await me(e.beforeEach,b);if(F){e.navigate(F);return}}if(r.beforeEnter){const F=await me(r.beforeEnter,b);if(F){e.navigate(F);return}}if(m.beforeEnter){const F={params:p,query:v,path:a,meta:m.meta},W=await me(m.beforeEnter,F);if(W){e.navigate(W);return}}const g=`${r.path}::${JSON.stringify(u.params)}`;if(V!==g){const F=await Ge(x,b);if(F){e.navigate(F);return}const W=r.transition??e.transition;W&&t.hasChildNodes()&&await ge(t,W,"leave"),C($);const z=qe(r,c);if(z){const M={routes:r.children,mode:e.mode,base:e.base,transition:r.transition??e.transition,beforeEach:e.beforeEach,afterEach:e.afterEach,scrollBehavior:e.scrollBehavior,navigate:(G,I)=>e.navigate(G,I),replace:(G,I)=>e.replace(G,I),back:()=>e.back(),forward:()=>e.forward()};x=await P(r,z,b,c==="default"?r.layout:void 0,c==="default"?M:void 0),(A=x.enter)==null||A.call(x,D)}else t.innerHTML="";V=g,W&&await ge(t,W,"enter")}const w={params:{...u.params,...p},query:v,path:a,meta:m.meta??r.meta};(n=e.afterEach)==null||n.call(e,w,D);const L=(h=e.scrollBehavior)==null?void 0:h.call(e,w,D);L&&window.scrollTo(L.x??0,L.y??0),D=w,$=r,H();return}}}const s=Ve(r.path,a);if(s!==null){V=null;const u={params:s,query:v,path:a,meta:r.meta};if(r.redirect){const w=typeof r.redirect=="function"?r.redirect(u):r.redirect;e.navigate(w);return}if(e.beforeEach){const w=await me(e.beforeEach,u);if(w){e.navigate(w);return}}if(r.beforeEnter){const w=await me(r.beforeEnter,u);if(w){e.navigate(w);return}}const m=await Ge(x,u);if(m){e.navigate(m);return}const p=r.transition??e.transition;p&&t.hasChildNodes()&&await ge(t,p,"leave"),C($);const b=qe(r,c);if(b){const w=u.path;if(r.keepAlive&&R.has(w)){const L=R.get(w);t.appendChild(L.fragment),x=L.activation,(f=x.activate)==null||f.call(x),R.delete(w)}else{const L=D;x=await P(r,b,u,c==="default"?r.layout:void 0),(T=x.enter)==null||T.call(x,L)}}else t.innerHTML="",x=null;p&&await ge(t,p,"enter"),(O=e.afterEach)==null||O.call(e,u,D);const g=(i=e.scrollBehavior)==null?void 0:i.call(e,u,D);g&&window.scrollTo(g.x??0,g.y??0),D=u,$=r,H();return}}V=null,C($),$=null,H()},d=e.mode==="history"?"popstate":"hashchange";return window.addEventListener(d,_),_(),()=>{window.removeEventListener(d,_),x==null||x.destroy(),x=null,R.forEach(({activation:a})=>a.destroy()),R.clear()}}function Ct(){if(typeof window>"u")return null;if(window.__COURVUX_DEVTOOLS__)return window.__COURVUX_DEVTOOLS__;const t=new Map,e={instances:[],stores:[],on(o,c){return t.has(o)||t.set(o,new Set),t.get(o).add(c),()=>{var l;return(l=t.get(o))==null?void 0:l.delete(c)}},_emit(o,c){var l;(l=t.get(o))==null||l.forEach(y=>{try{y(c)}catch{}})},_registerInstance(o){this.instances.push(o),this._emit("mount",o)},_unregisterInstance(o){const c=this.instances.findIndex(l=>l.id===o);if(c!==-1){const l=this.instances[c];this.instances.splice(c,1),this._emit("destroy",l)}},_registerStore(o){this.stores.push(o),o.subscribe(()=>this._emit("store-update",o))}};return window.__COURVUX_DEVTOOLS__=e,e}var Ft=0;function Ot(){return++Ft}var Lt=`
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
`;function jt(){if(document.getElementById("cvd-styles"))return;const t=document.createElement("style");t.id="cvd-styles",t.textContent=Lt,document.head.appendChild(t)}function be(t){return t===null?"null":t===void 0?"undefined":typeof t=="string"?`"${t}"`:typeof t=="object"?JSON.stringify(t):String(t)}function Je(t){try{return JSON.parse(t)}catch{return t}}function Pt(t){if(typeof document>"u")return;jt();const e=document.createElement("div");e.id="cvd",document.body.appendChild(e);let o=!1,c="components",l=new Set;const y=document.createElement("div");y.id="cvd-badge",y.innerHTML='<span class="cvd-badge-dot"></span>COURVUX',e.appendChild(y);const E=document.createElement("div");E.id="cvd-panel",E.style.display="none",e.appendChild(E),E.innerHTML=`
        <div id="cvd-head">
            <span id="cvd-title">⚡ COURVUX DEVTOOLS</span>
            <div id="cvd-tabs">
                <button class="cvd-tab active" data-tab="components">Components</button>
                <button class="cvd-tab" data-tab="store">Store</button>
            </div>
            <button id="cvd-close">✕</button>
        </div>
        <div id="cvd-body"></div>
    `;const k=E.querySelector("#cvd-body");y.addEventListener("click",()=>{o=!0,y.style.display="none",E.style.display="flex",R()}),E.querySelector("#cvd-close").addEventListener("click",()=>{o=!1,E.style.display="none",y.style.display=""}),E.querySelectorAll(".cvd-tab").forEach(C=>{C.addEventListener("click",()=>{c=C.dataset.tab,E.querySelectorAll(".cvd-tab").forEach(P=>P.classList.remove("active")),C.classList.add("active"),R()})});const D=E.querySelector("#cvd-head");let $=!1,x=0,V=0;D.addEventListener("mousedown",C=>{C.target.closest("button")||($=!0,x=C.clientX-e.getBoundingClientRect().left,V=C.clientY-e.getBoundingClientRect().top)}),document.addEventListener("mousemove",C=>{$&&(e.style.right="auto",e.style.bottom="auto",e.style.left=`${C.clientX-x}px`,e.style.top=`${C.clientY-V}px`)}),document.addEventListener("mouseup",()=>{$=!1});function j(){const C=t.instances;if(!C.length){k.innerHTML='<div class="cvd-empty">No hay componentes montados</div>';return}k.innerHTML=C.map(P=>{const _=P.getState(),d=Object.keys(_);return`
                <div class="cvd-inst${l.has(P.id)?" open":""}" data-id="${P.id}">
                    <div class="cvd-inst-head">
                        <span class="cvd-arrow">▶</span>
                        <span class="cvd-inst-name">&lt;${P.name}&gt;</span>
                        <span class="cvd-count">${d.length} keys</span>
                        <span class="cvd-inst-id">#${P.id}</span>
                    </div>
                    <div class="cvd-kv">
                        ${d.length?d.map(a=>`
                            <div class="cvd-row">
                                <span class="cvd-key">${a}</span>
                                <span class="cvd-val" data-inst="${P.id}" data-key="${a}" title="click to edit">${be(_[a])}</span>
                            </div>
                        `).join(""):'<span style="color:#555">— sin datos reactivos —</span>'}
                    </div>
                </div>
            `}).join(""),k.querySelectorAll(".cvd-inst-head").forEach(P=>{P.addEventListener("click",()=>{const _=P.closest(".cvd-inst"),d=parseInt(_.dataset.id);l.has(d)?l.delete(d):l.add(d),_.classList.toggle("open")})}),k.querySelectorAll(".cvd-val").forEach(P=>{P.addEventListener("click",_=>{_.stopPropagation();const d=P;if(d.querySelector("input"))return;const a=parseInt(d.dataset.inst),v=d.dataset.key,S=t.instances.find(f=>f.id===a);if(!S)return;const A=be(S.getState()[v]);d.classList.add("editing"),d.innerHTML=`<input class="cvd-edit" value='${A.replace(/'/g,"&#39;")}'>`;const n=d.querySelector("input");n.focus(),n.select();const h=()=>{S.setState(v,Je(n.value)),d.classList.remove("editing")};n.addEventListener("blur",h),n.addEventListener("keydown",f=>{f.key==="Enter"&&(f.preventDefault(),h()),f.key==="Escape"&&(d.classList.remove("editing"),R())})})})}function H(){if(!t.stores.length){k.innerHTML='<div class="cvd-empty">No hay store registrado</div>';return}k.innerHTML=t.stores.map((C,P)=>{const _=C.getState(),d=Object.keys(_);return`
                <div class="cvd-inst open" data-store="${P}">
                    <div class="cvd-inst-head">
                        <span class="cvd-arrow" style="transform:rotate(90deg)">▶</span>
                        <span class="cvd-inst-name" style="color:#ffcb6b">Store</span>
                        <span class="cvd-count">${d.length} keys</span>
                    </div>
                    <div class="cvd-kv">
                        ${d.map(a=>`
                            <div class="cvd-row">
                                <span class="cvd-key cvd-store-key">${a}</span>
                                <span class="cvd-val" data-store="${P}" data-key="${a}" title="click to edit">${be(_[a])}</span>
                            </div>
                        `).join("")}
                    </div>
                </div>
            `}).join(""),k.querySelectorAll(".cvd-inst-head").forEach(C=>{C.addEventListener("click",()=>C.closest(".cvd-inst").classList.toggle("open"))}),k.querySelectorAll("[data-store][data-key]").forEach(C=>{C.addEventListener("click",P=>{P.stopPropagation();const _=C;if(_.querySelector("input"))return;const d=parseInt(_.dataset.store),a=_.dataset.key,v=t.stores[d];if(!v)return;const S=be(v.getState()[a]);_.classList.add("editing"),_.innerHTML=`<input class="cvd-edit" value='${S.replace(/'/g,"&#39;")}'>`;const A=_.querySelector("input");A.focus(),A.select();const n=()=>{v.setState(a,Je(A.value)),_.classList.remove("editing")};A.addEventListener("blur",n),A.addEventListener("keydown",h=>{h.key==="Enter"&&(h.preventDefault(),n()),h.key==="Escape"&&(_.classList.remove("editing"),R())})})})}function R(){o&&(c==="components"?j():H())}t.on("mount",()=>R()),t.on("update",()=>R()),t.on("destroy",()=>R()),t.on("store-update",()=>R())}var Dt="__COURVUX_HEAD_COLLECTOR__";function Mt(){return globalThis[Dt]??null}var It=(t,e)=>{Object.entries(e).forEach(([o,c])=>{o!=="innerHTML"&&(c==null||c===!1||t.setAttribute(o,c===!0?"":String(c)))})},Rt=t=>{const e={};return Array.from(t.attributes).forEach(o=>{e[o.name]=o.value}),e},zt=(t,e)=>{Array.from(t.attributes).forEach(o=>t.removeAttribute(o.name)),Object.entries(e).forEach(([o,c])=>t.setAttribute(o,c))},Ke=(t,e,o,c)=>{let l=o?document.head.querySelector(o):null;l?(c.push({el:l,prevAttrs:Rt(l),created:!1}),Array.from(l.attributes).forEach(y=>l.removeAttribute(y.name))):(l=document.createElement(t),document.head.appendChild(l),c.push({el:l,created:!0})),It(l,e)};function Ht(t){var E,k,D;const e=Mt();if(e!==null)return e.push(t),()=>{};if(typeof document>"u")return()=>{};const o=[];let c;const l={},y={};if(t.title!==void 0){c=document.title;const $=t.titleTemplate,x=typeof $=="function"?$(t.title):typeof $=="string"?$.replace("%s",t.title):t.title;document.title=x}return(E=t.meta)==null||E.forEach($=>{Ke("meta",$,$.name?`meta[name="${CSS.escape($.name)}"]`:$.property?`meta[property="${CSS.escape($.property)}"]`:$["http-equiv"]?`meta[http-equiv="${CSS.escape($["http-equiv"])}"]`:null,o)}),(k=t.link)==null||k.forEach($=>{Ke("link",$,$.rel==="canonical"?'link[rel="canonical"]':$.rel&&$.href?`link[rel="${CSS.escape($.rel)}"][href="${CSS.escape($.href)}"]`:null,o)}),(D=t.script)==null||D.forEach($=>{const x=document.createElement("script");Object.entries($).forEach(([V,j])=>{V==="innerHTML"?x.textContent=String(j):j!=null&&j!==!1&&x.setAttribute(V,j===!0?"":String(j))}),document.head.appendChild(x),o.push({el:x,created:!0})}),t.htmlAttrs&&Object.entries(t.htmlAttrs).forEach(([$,x])=>{l[$]=document.documentElement.getAttribute($),document.documentElement.setAttribute($,x)}),t.bodyAttrs&&Object.entries(t.bodyAttrs).forEach(([$,x])=>{y[$]=document.body.getAttribute($),document.body.setAttribute($,x)}),function(){c!==void 0&&(document.title=c),o.forEach(({el:$,prevAttrs:x,created:V})=>{var j;V?(j=$.parentNode)==null||j.removeChild($):x&&zt($,x)}),Object.entries(l).forEach(([$,x])=>{x===null?document.documentElement.removeAttribute($):document.documentElement.setAttribute($,x)}),Object.entries(y).forEach(([$,x])=>{x===null?document.body.removeAttribute($):document.body.setAttribute($,x)})}}var Fe="data-courvux-ssr",Nt=t=>t?Promise.resolve().then(t):Promise.resolve();function Qe(t,e){const o=t.trim();if(o.startsWith("{")){const c=o.replace(/[{}]/g,"").split(",").map(l=>l.trim()).filter(Boolean);return Object.fromEntries(c.map(l=>[l,e[l]]))}return{[o]:e}}var ye=t=>{if(t===null||typeof t!="object")return t;try{return structuredClone(t)}catch{return t}};async function ne(t,e,o){var S,A,n;const c={},{subscribe:l,createReactiveState:y,registerSetInterceptor:E,notifyAll:k}=Pe();let D;if(typeof e.data=="function"?(e.loadingTemplate&&(t.innerHTML=e.loadingTemplate),D=await e.data()):D=e.data??{},e.templateUrl){const h=o.baseUrl?new URL(e.templateUrl,o.baseUrl).href:e.templateUrl,f=await fetch(h);if(!f.ok)throw new Error(`Failed to load template: ${h} (${f.status})`);t.innerHTML=await f.text()}else e.template&&(t.innerHTML=e.template);t.removeAttribute(Fe),(S=t.querySelector(`[${Fe}]`))==null||S.removeAttribute(Fe);const $={};if(e.inject&&o.provided){const h=Array.isArray(e.inject)?Object.fromEntries(e.inject.map(f=>[f,f])):e.inject;Object.entries(h).forEach(([f,T])=>{o.provided&&T in o.provided&&($[f]=o.provided[T])})}const x=y({...o.globalProperties??{},...D,...$,...e.methods,$refs:c,$el:t,...o.slots?{$slots:Object.fromEntries(Object.keys(o.slots).map(h=>[h,!0]))}:{},...o.store?{$store:o.store}:{},...o.currentRoute?{$route:o.currentRoute}:{},...o.router?{$router:o.router}:{}});x.$watch=(h,f,T)=>{const O=(T==null?void 0:T.deep)??!1,i=(T==null?void 0:T.immediate)??!1;let r=O?ye(x[h]):x[h];const s=l(h,()=>{const u=x[h];f.call(x,u,r),r=O?ye(u):u});return i&&f.call(x,x[h],void 0),s},x.$batch=bt,x.$nextTick=h=>Nt(h),x.$dispatch=(h,f,T)=>{t.dispatchEvent(new CustomEvent(h,{bubbles:!0,composed:!0,...T??{},detail:f}))},o.magics&&Object.entries(o.magics).forEach(([h,f])=>{x[h]=f(x)}),x.$forceUpdate=()=>k();const V=[];x.$watchEffect=h=>{let f=[];const T=()=>{f.forEach(s=>s()),f=[];const i=Me(()=>{try{h()}catch{}}),r=new Map;for(const{sub:s,key:u}of i)r.has(s)||r.set(s,new Set),!r.get(s).has(u)&&(r.get(s).add(u),f.push(s(u,T)))};T();const O=()=>{f.forEach(r=>r()),f=[];const i=V.indexOf(O);i>-1&&V.splice(i,1)};return V.push(O),O};const j=[];e.computed&&Object.entries(e.computed).forEach(([h,f])=>{const T=typeof f=="function"?f:f.get,O=typeof f!="function"?f.set:void 0;let i=[];const r=()=>{i.forEach(p=>p()),i=[];let s;const u=Me(()=>{try{s=T.call(x)}catch(p){(e.debug??o.debug)&&console.warn("[courvux] computed error:",p)}});x[h]=s;const m=new Map;for(const{sub:p,key:b}of u)m.has(p)||m.set(p,new Set),!m.get(p).has(b)&&(m.get(p).add(b),i.push(p(b,r)))};r(),j.push(()=>i.forEach(s=>s())),O&&E(h,s=>O.call(x,s))});const H=[];e.watch&&Object.entries(e.watch).forEach(([h,f])=>{const T=typeof f=="object"&&f!==null&&"handler"in f,O=T?f.handler:f,i=T?f.immediate??!1:!1,r=T?f.deep??!1:!1;let s=r?ye(x[h]):x[h];const u=l(h,()=>{const m=x[h];O.call(x,m,s),s=r?ye(m):m});H.push(u),i&&O.call(x,x[h],void 0)});const R={...o.provided??{}};if(e.provide){const h=typeof e.provide=="function"?e.provide.call(x):e.provide;Object.assign(R,h)}const C={...o,provided:R,components:{...o.components,...e.components}};C.mountElement=Ae(C),C.createChildScope=(h,f)=>{const T=new Set(Object.keys(h)),O=new Set(Object.keys(f)),{subscribe:i,createReactiveState:r}=Pe(),s=r(h);let u;return u=new Proxy({},{get(m,p){return typeof p!="string"?x[p]:T.has(p)?s[p]:O.has(p)?f[p].bind(u):x[p]},set(m,p,b){return typeof p!="string"?!1:T.has(p)?(s[p]=b,!0):(x[p]=b,!0)},has(m,p){return T.has(p)||O.has(p)||p in x},ownKeys(){return[...T,...O,...Object.keys(x)]},getOwnPropertyDescriptor(m,p){return T.has(p)||O.has(p)||p in x?{configurable:!0,enumerable:!0,writable:!0}:void 0}}),{state:u,subscribe:(m,p)=>T.has(m)?i(m,p):d(m,p),cleanup:()=>{}}},C.mountDynamic=async(h,f,T,O,i)=>{let r=null,s=null;const u=T.getAttribute("loading-template")??"",m=async()=>{var z,M,G;s==null||s(),s=null,r!=null&&r.parentNode&&(r.parentNode.removeChild(r),r=null);const p=N(f,O);if(!p)return;let b;if(typeof p=="function"){if(u){const I=document.createElement("div");I.innerHTML=u,(z=h.parentNode)==null||z.insertBefore(I,h.nextSibling),r=I}b=(await p()).default,r!=null&&r.parentNode&&(r.parentNode.removeChild(r),r=null)}else typeof p=="string"?b=(M=C.components)==null?void 0:M[p]:p&&typeof p=="object"&&(b=p);if(!b)return;const g=document.createElement("div");Array.from(T.attributes).forEach(I=>g.setAttribute(I.name,I.value)),g.innerHTML=T.innerHTML;const w={},L={};Array.from(T.attributes).forEach(I=>{if(I.name.startsWith(":"))w[I.name.slice(1)]=N(I.value,O);else if(I.name.startsWith("@")||I.name.startsWith("cv:on:")){const B=I.value,Q=I.name.startsWith("@")?I.name.slice(1):I.name.slice(6);L[Q]=(...q)=>{typeof O[B]=="function"&&O[B].call(O,...q)}}});const F={...b,data:{...b.data,...w},methods:{...b.methods,$emit(I,...B){var Q;ut(b,I,B),(Q=L[I])==null||Q.call(L,...B)}}},W={...C,components:{...C.components,...b.components}};W.mountElement=Ae(W),s=(await ne(g,F,W)).destroy,(G=h.parentNode)==null||G.insertBefore(g,h.nextSibling),r=g};K(f,i,m),await m()};const P=[];x.$addCleanup=h=>{P.push(h)};let _=!1;const d=(h,f)=>!e.onBeforeUpdate&&!e.onUpdated?l(h,f):l(h,()=>{var T;_||(_=!0,(T=e.onBeforeUpdate)==null||T.call(x),Promise.resolve().then(()=>{var O;_=!1,(O=e.onUpdated)==null||O.call(x)})),f()});try{(A=e.onBeforeMount)==null||A.call(x),await oe(t,x,{subscribe:d,refs:c,...C,registerCleanup:h=>P.push(h)}),t.removeAttribute("cv-cloak"),(n=e.onMount)==null||n.call(x)}catch(h){if(e.onError)t.removeAttribute("cv-cloak"),e.onError.call(x,h);else if(o.errorHandler)t.removeAttribute("cv-cloak"),o.errorHandler(h,x,e.name??t.tagName.toLowerCase());else throw h}const a=typeof window<"u"?window.__COURVUX_DEVTOOLS__:void 0,v=a?Ot():0;if(a){const h=x,f=new Set,T={id:v,name:e.name??t.tagName.toLowerCase(),el:t,getState:()=>{const O={};for(const i of Object.keys(h))if(!(i.startsWith("$")||typeof h[i]=="function"))try{O[i]=h[i]}catch{}return O},setState:(O,i)=>{h[O]=i},subscribe:O=>(f.add(O),()=>f.delete(O)),children:[]};Object.keys(h).filter(O=>!O.startsWith("$")&&typeof h[O]!="function").forEach(O=>{l(O,()=>{a._emit("update",T),f.forEach(i=>i())})}),a._registerInstance(T),P.push(()=>a._unregisterInstance(v))}return{state:x,destroy:()=>{var h,f;(h=e.onBeforeUnmount)==null||h.call(x),j.forEach(T=>T()),H.forEach(T=>T()),V.forEach(T=>T()),P.forEach(T=>T()),(f=e.onDestroy)==null||f.call(x)},activate:()=>{var h;(h=e.onActivated)==null||h.call(x)},deactivate:()=>{var h;(h=e.onDeactivated)==null||h.call(x)},beforeLeave:e.onBeforeRouteLeave?(h,f)=>e.onBeforeRouteLeave.call(x,h,f):void 0,enter:e.onBeforeRouteEnter?h=>e.onBeforeRouteEnter.call(x,h):void 0}}function ut(t,e,o){if(!t.emits||Array.isArray(t.emits))return;const c=t.emits[e];typeof c=="function"&&!c(...o)&&console.warn(`[courvux] emit "${e}": validator returned false`)}function Ae(t){return async(e,o,c,l)=>{const y=t.components[o],E=e.getAttribute("cv-ref");E&&e.removeAttribute("cv-ref");const k={},D=[],$={};Array.from(e.attributes).filter(_=>_.name==="cv-model"||_.name.startsWith("cv-model.")||_.name.startsWith("cv-model:")).forEach(_=>{e.removeAttribute(_.name);const d=_.value,a=_.name.indexOf(":"),v=a>=0?_.name.slice(a+1).split(".")[0]:"modelValue",S=v==="modelValue"?"update:modelValue":`update:${v}`;k[v]=$e(N(d,c)),D.push({propName:v,expr:d}),$[S]=A=>{le(d,c,A)}});const x={};Array.from(e.attributes).forEach(_=>{const d=_.name.startsWith(":"),a=_.name.startsWith("@")||_.name.startsWith("cv:on:"),v=_.name==="cv-model"||_.name.startsWith("cv-model.")||_.name.startsWith("cv-model:"),S=_.name.startsWith("v-slot"),A=_.name==="slot";!d&&!a&&!v&&!S&&!A&&(x[_.name]=_.value)}),y.inheritAttrs===!1&&Object.keys(x).forEach(_=>e.removeAttribute(_)),Array.from(e.attributes).forEach(_=>{if(_.name.startsWith(":")){const d=_.name.slice(1),a=_.value;k[d]=$e(N(a,c)),D.push({propName:d,expr:a})}else if(_.name.startsWith("@")||_.name.startsWith("cv:on:")){const d=_.name.startsWith("@")?_.name.slice(1):_.name.slice(6),a=_.value;$[d]=(...v)=>{typeof c[a]=="function"&&c[a].call(c,...v)}}});const V=e.getAttribute("v-slot")??e.getAttribute("v-slot:default");V&&(e.removeAttribute("v-slot"),e.removeAttribute("v-slot:default"));const j=new Map,H=[];Array.from(e.childNodes).forEach(_=>{const d=_.nodeType===1?_.getAttribute("slot"):null;if(d){if(!j.has(d)){const a=e.getAttribute(`v-slot:${d}`)??null;a&&e.removeAttribute(`v-slot:${d}`),j.set(d,{nodes:[],vSlot:a})}j.get(d).nodes.push(_.cloneNode(!0))}else H.push(_.cloneNode(!0))});const R={};H.some(_=>{var d;return _.nodeType===1||_.nodeType===3&&(((d=_.textContent)==null?void 0:d.trim())??"")!==""})&&(R.default=async _=>{const d=V?{...c,...Qe(V,_)}:c,a=document.createDocumentFragment();return H.forEach(v=>a.appendChild(v.cloneNode(!0))),await oe(a,d,l),Array.from(a.childNodes)});for(const[_,{nodes:d,vSlot:a}]of j)R[_]=async v=>{const S=a?{...c,...Qe(a,v)}:c,A=document.createDocumentFragment();return d.forEach(n=>A.appendChild(n.cloneNode(!0))),await oe(A,S,l),Array.from(A.childNodes)};const C={...t,components:{...t.components,...y.components},slots:R};C.mountElement=Ae(C);const{state:P}=await ne(e,{...y,data:{...y.data,...k,$attrs:x,$parent:c},methods:{...y.methods,$emit(_,...d){var a;ut(y,_,d),(a=$[_])==null||a.call($,...d)}}},C);P&&(D.forEach(({propName:_,expr:d})=>{ue(d,{...l,subscribe:l.subscribe},()=>{P[_]=$e(N(d,c))})}),E&&l.refs&&(l.refs[E]=P))}}function Wt(t){kt();const e=typeof window<"u"?Ct():void 0,o=[],c={...t.directives},l={...t.components??{}},y=[],E=new Map,k={},D=new Map;if(t.debug&&e&&Pt(e),e&&t.store){const j=t.store,H=Object.keys(j).filter(R=>typeof j[R]!="function");e._registerStore({getState(){const R={};return H.forEach(C=>{try{R[C]=j[C]}catch{}}),R},setState(R,C){j[R]=C},subscribe(R){const C=H.map(P=>{try{return ve(j,P,R)}catch{return()=>{}}});return()=>C.forEach(P=>P())}})}const $={router:t.router,use(j){return o.includes(j)||(o.push(j),j.install($)),$},directive(j,H){return c[j]=H,$},component(j,H){return l[j]=H,$},provide(j,H){return typeof j=="string"?k[j]=H:Object.assign(k,j),$},magic(j,H){return D.set(`$${j}`,H),$},mount:async j=>(await V(j),$),mountAll:async(j="[data-courvux]")=>{const H=Array.from(document.querySelectorAll(j));return await Promise.all(H.map(R=>x(R))),$},mountEl:async j=>x(j),unmount(j){if(!j)y.forEach(H=>H()),y.length=0,E.clear();else{const H=document.querySelector(j);if(H){const R=E.get(H);if(R){R(),E.delete(H);const C=y.indexOf(R);C>-1&&y.splice(C,1)}}}return $},destroy(){y.forEach(j=>j()),y.length=0,E.clear()}},x=async j=>{const H=new URL(".",document.baseURI).href,R={components:l,router:t.router,store:t.store,directives:c,baseUrl:H,provided:{...k},errorHandler:t.errorHandler,globalProperties:t.globalProperties,magics:D.size?Object.fromEntries(D):void 0};if(R.mountElement=Ae(R),t.router){const P=t.router;R.mountRouterView=async(_,d)=>{await new Promise(a=>{Ze(_,P,async(v,S,A,n,h)=>{const f={...R,currentRoute:A};if(h){let T=null;const O={...f,mountRouterView:async(i,r)=>{T=Ze(i,h,async(s,u,m,p)=>{const b={...f,currentRoute:m};if(p){let g=null;const w={...b,mountRouterView:async(F,W)=>{g=await ne(F,u,b)}},{destroy:L}=await ne(s,{template:p},w);return{destroy:()=>{g==null||g.destroy(),L()},activate:()=>g==null?void 0:g.activate(),deactivate:()=>g==null?void 0:g.deactivate()}}else return await ne(s,u,b)},r)}};if(n){let i=null;const r={...O,mountRouterView:async(u,m)=>{i=await ne(u,S,O)}},{destroy:s}=await ne(v,{template:n},r);return{destroy:()=>{T==null||T(),i==null||i.destroy(),s()},activate:()=>i==null?void 0:i.activate(),deactivate:()=>i==null?void 0:i.deactivate()}}else{const i=await ne(v,S,O);return{destroy:()=>{T==null||T(),i.destroy()},activate:()=>i.activate(),deactivate:()=>i.deactivate()}}}else if(n){let T=null;const O={...f,mountRouterView:async(r,s)=>{T=await ne(r,S,f)}},{destroy:i}=await ne(v,{template:n},O);return{destroy:()=>{T==null||T.destroy(),i()},activate:()=>T==null?void 0:T.activate(),deactivate:()=>T==null?void 0:T.deactivate()}}else return await ne(v,S,f)},d,a)})}}const C=await ne(j,t,R);return y.push(C.destroy),E.set(j,C.destroy),C.state},V=async j=>{const H=document.querySelector(j);if(H)return x(H)};return $}var et=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function Ut(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var Oe={exports:{}},tt;function Bt(){return tt||(tt=1,(function(t){var e=typeof window<"u"?window:typeof WorkerGlobalScope<"u"&&self instanceof WorkerGlobalScope?self:{};/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 *
 * @license MIT <https://opensource.org/licenses/MIT>
 * @author Lea Verou <https://lea.verou.me>
 * @namespace
 * @public
 */var o=(function(c){var l=/(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i,y=0,E={},k={manual:c.Prism&&c.Prism.manual,disableWorkerMessageHandler:c.Prism&&c.Prism.disableWorkerMessageHandler,util:{encode:function d(a){return a instanceof D?new D(a.type,d(a.content),a.alias):Array.isArray(a)?a.map(d):a.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/\u00a0/g," ")},type:function(d){return Object.prototype.toString.call(d).slice(8,-1)},objId:function(d){return d.__id||Object.defineProperty(d,"__id",{value:++y}),d.__id},clone:function d(a,v){v=v||{};var S,A;switch(k.util.type(a)){case"Object":if(A=k.util.objId(a),v[A])return v[A];S={},v[A]=S;for(var n in a)a.hasOwnProperty(n)&&(S[n]=d(a[n],v));return S;case"Array":return A=k.util.objId(a),v[A]?v[A]:(S=[],v[A]=S,a.forEach(function(h,f){S[f]=d(h,v)}),S);default:return a}},getLanguage:function(d){for(;d;){var a=l.exec(d.className);if(a)return a[1].toLowerCase();d=d.parentElement}return"none"},setLanguage:function(d,a){d.className=d.className.replace(RegExp(l,"gi"),""),d.classList.add("language-"+a)},currentScript:function(){if(typeof document>"u")return null;if(document.currentScript&&document.currentScript.tagName==="SCRIPT")return document.currentScript;try{throw new Error}catch(S){var d=(/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(S.stack)||[])[1];if(d){var a=document.getElementsByTagName("script");for(var v in a)if(a[v].src==d)return a[v]}return null}},isActive:function(d,a,v){for(var S="no-"+a;d;){var A=d.classList;if(A.contains(a))return!0;if(A.contains(S))return!1;d=d.parentElement}return!!v}},languages:{plain:E,plaintext:E,text:E,txt:E,extend:function(d,a){var v=k.util.clone(k.languages[d]);for(var S in a)v[S]=a[S];return v},insertBefore:function(d,a,v,S){S=S||k.languages;var A=S[d],n={};for(var h in A)if(A.hasOwnProperty(h)){if(h==a)for(var f in v)v.hasOwnProperty(f)&&(n[f]=v[f]);v.hasOwnProperty(h)||(n[h]=A[h])}var T=S[d];return S[d]=n,k.languages.DFS(k.languages,function(O,i){i===T&&O!=d&&(this[O]=n)}),n},DFS:function d(a,v,S,A){A=A||{};var n=k.util.objId;for(var h in a)if(a.hasOwnProperty(h)){v.call(a,h,a[h],S||h);var f=a[h],T=k.util.type(f);T==="Object"&&!A[n(f)]?(A[n(f)]=!0,d(f,v,null,A)):T==="Array"&&!A[n(f)]&&(A[n(f)]=!0,d(f,v,h,A))}}},plugins:{},highlightAll:function(d,a){k.highlightAllUnder(document,d,a)},highlightAllUnder:function(d,a,v){var S={callback:v,container:d,selector:'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'};k.hooks.run("before-highlightall",S),S.elements=Array.prototype.slice.apply(S.container.querySelectorAll(S.selector)),k.hooks.run("before-all-elements-highlight",S);for(var A=0,n;n=S.elements[A++];)k.highlightElement(n,a===!0,S.callback)},highlightElement:function(d,a,v){var S=k.util.getLanguage(d),A=k.languages[S];k.util.setLanguage(d,S);var n=d.parentElement;n&&n.nodeName.toLowerCase()==="pre"&&k.util.setLanguage(n,S);var h=d.textContent,f={element:d,language:S,grammar:A,code:h};function T(i){f.highlightedCode=i,k.hooks.run("before-insert",f),f.element.innerHTML=f.highlightedCode,k.hooks.run("after-highlight",f),k.hooks.run("complete",f),v&&v.call(f.element)}if(k.hooks.run("before-sanity-check",f),n=f.element.parentElement,n&&n.nodeName.toLowerCase()==="pre"&&!n.hasAttribute("tabindex")&&n.setAttribute("tabindex","0"),!f.code){k.hooks.run("complete",f),v&&v.call(f.element);return}if(k.hooks.run("before-highlight",f),!f.grammar){T(k.util.encode(f.code));return}if(a&&c.Worker){var O=new Worker(k.filename);O.onmessage=function(i){T(i.data)},O.postMessage(JSON.stringify({language:f.language,code:f.code,immediateClose:!0}))}else T(k.highlight(f.code,f.grammar,f.language))},highlight:function(d,a,v){var S={code:d,grammar:a,language:v};if(k.hooks.run("before-tokenize",S),!S.grammar)throw new Error('The language "'+S.language+'" has no grammar.');return S.tokens=k.tokenize(S.code,S.grammar),k.hooks.run("after-tokenize",S),D.stringify(k.util.encode(S.tokens),S.language)},tokenize:function(d,a){var v=a.rest;if(v){for(var S in v)a[S]=v[S];delete a.rest}var A=new V;return j(A,A.head,d),x(d,A,a,A.head,0),R(A)},hooks:{all:{},add:function(d,a){var v=k.hooks.all;v[d]=v[d]||[],v[d].push(a)},run:function(d,a){var v=k.hooks.all[d];if(!(!v||!v.length))for(var S=0,A;A=v[S++];)A(a)}},Token:D};c.Prism=k;function D(d,a,v,S){this.type=d,this.content=a,this.alias=v,this.length=(S||"").length|0}D.stringify=function d(a,v){if(typeof a=="string")return a;if(Array.isArray(a)){var S="";return a.forEach(function(T){S+=d(T,v)}),S}var A={type:a.type,content:d(a.content,v),tag:"span",classes:["token",a.type],attributes:{},language:v},n=a.alias;n&&(Array.isArray(n)?Array.prototype.push.apply(A.classes,n):A.classes.push(n)),k.hooks.run("wrap",A);var h="";for(var f in A.attributes)h+=" "+f+'="'+(A.attributes[f]||"").replace(/"/g,"&quot;")+'"';return"<"+A.tag+' class="'+A.classes.join(" ")+'"'+h+">"+A.content+"</"+A.tag+">"};function $(d,a,v,S){d.lastIndex=a;var A=d.exec(v);if(A&&S&&A[1]){var n=A[1].length;A.index+=n,A[0]=A[0].slice(n)}return A}function x(d,a,v,S,A,n){for(var h in v)if(!(!v.hasOwnProperty(h)||!v[h])){var f=v[h];f=Array.isArray(f)?f:[f];for(var T=0;T<f.length;++T){if(n&&n.cause==h+","+T)return;var O=f[T],i=O.inside,r=!!O.lookbehind,s=!!O.greedy,u=O.alias;if(s&&!O.pattern.global){var m=O.pattern.toString().match(/[imsuy]*$/)[0];O.pattern=RegExp(O.pattern.source,m+"g")}for(var p=O.pattern||O,b=S.next,g=A;b!==a.tail&&!(n&&g>=n.reach);g+=b.value.length,b=b.next){var w=b.value;if(a.length>d.length)return;if(!(w instanceof D)){var L=1,F;if(s){if(F=$(p,g,d,r),!F||F.index>=d.length)break;var G=F.index,W=F.index+F[0].length,z=g;for(z+=b.value.length;G>=z;)b=b.next,z+=b.value.length;if(z-=b.value.length,g=z,b.value instanceof D)continue;for(var M=b;M!==a.tail&&(z<W||typeof M.value=="string");M=M.next)L++,z+=M.value.length;L--,w=d.slice(g,z),F.index-=g}else if(F=$(p,0,w,r),!F)continue;var G=F.index,I=F[0],B=w.slice(0,G),Q=w.slice(G+I.length),q=g+w.length;n&&q>n.reach&&(n.reach=q);var U=b.prev;B&&(U=j(a,U,B),g+=B.length),H(a,U,L);var te=new D(h,i?k.tokenize(I,i):I,u,I);if(b=j(a,U,te),Q&&j(a,b,Q),L>1){var J={cause:h+","+T,reach:q};x(d,a,v,b.prev,g,J),n&&J.reach>n.reach&&(n.reach=J.reach)}}}}}}function V(){var d={value:null,prev:null,next:null},a={value:null,prev:d,next:null};d.next=a,this.head=d,this.tail=a,this.length=0}function j(d,a,v){var S=a.next,A={value:v,prev:a,next:S};return a.next=A,S.prev=A,d.length++,A}function H(d,a,v){for(var S=a.next,A=0;A<v&&S!==d.tail;A++)S=S.next;a.next=S,S.prev=a,d.length-=A}function R(d){for(var a=[],v=d.head.next;v!==d.tail;)a.push(v.value),v=v.next;return a}if(!c.document)return c.addEventListener&&(k.disableWorkerMessageHandler||c.addEventListener("message",function(d){var a=JSON.parse(d.data),v=a.language,S=a.code,A=a.immediateClose;c.postMessage(k.highlight(S,k.languages[v],v)),A&&c.close()},!1)),k;var C=k.util.currentScript();C&&(k.filename=C.src,C.hasAttribute("data-manual")&&(k.manual=!0));function P(){k.manual||k.highlightAll()}if(!k.manual){var _=document.readyState;_==="loading"||_==="interactive"&&C&&C.defer?document.addEventListener("DOMContentLoaded",P):window.requestAnimationFrame?window.requestAnimationFrame(P):window.setTimeout(P,16)}return k})(e);t.exports&&(t.exports=o),typeof et<"u"&&(et.Prism=o),o.languages.markup={comment:{pattern:/<!--(?:(?!<!--)[\s\S])*?-->/,greedy:!0},prolog:{pattern:/<\?[\s\S]+?\?>/,greedy:!0},doctype:{pattern:/<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,greedy:!0,inside:{"internal-subset":{pattern:/(^[^\[]*\[)[\s\S]+(?=\]>$)/,lookbehind:!0,greedy:!0,inside:null},string:{pattern:/"[^"]*"|'[^']*'/,greedy:!0},punctuation:/^<!|>$|[[\]]/,"doctype-tag":/^DOCTYPE/i,name:/[^\s<>'"]+/}},cdata:{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,greedy:!0},tag:{pattern:/<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,greedy:!0,inside:{tag:{pattern:/^<\/?[^\s>\/]+/,inside:{punctuation:/^<\/?/,namespace:/^[^\s>\/:]+:/}},"special-attr":[],"attr-value":{pattern:/=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,inside:{punctuation:[{pattern:/^=/,alias:"attr-equals"},{pattern:/^(\s*)["']|["']$/,lookbehind:!0}]}},punctuation:/\/?>/,"attr-name":{pattern:/[^\s>\/]+/,inside:{namespace:/^[^\s>\/:]+:/}}}},entity:[{pattern:/&[\da-z]{1,8};/i,alias:"named-entity"},/&#x?[\da-f]{1,8};/i]},o.languages.markup.tag.inside["attr-value"].inside.entity=o.languages.markup.entity,o.languages.markup.doctype.inside["internal-subset"].inside=o.languages.markup,o.hooks.add("wrap",function(c){c.type==="entity"&&(c.attributes.title=c.content.replace(/&amp;/,"&"))}),Object.defineProperty(o.languages.markup.tag,"addInlined",{value:function(l,y){var E={};E["language-"+y]={pattern:/(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,lookbehind:!0,inside:o.languages[y]},E.cdata=/^<!\[CDATA\[|\]\]>$/i;var k={"included-cdata":{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,inside:E}};k["language-"+y]={pattern:/[\s\S]+/,inside:o.languages[y]};var D={};D[l]={pattern:RegExp(/(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(/__/g,function(){return l}),"i"),lookbehind:!0,greedy:!0,inside:k},o.languages.insertBefore("markup","cdata",D)}}),Object.defineProperty(o.languages.markup.tag,"addAttribute",{value:function(c,l){o.languages.markup.tag.inside["special-attr"].push({pattern:RegExp(/(^|["'\s])/.source+"(?:"+c+")"+/\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source,"i"),lookbehind:!0,inside:{"attr-name":/^[^\s=]+/,"attr-value":{pattern:/=[\s\S]+/,inside:{value:{pattern:/(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,lookbehind:!0,alias:[l,"language-"+l],inside:o.languages[l]},punctuation:[{pattern:/^=/,alias:"attr-equals"},/"|'/]}}}})}}),o.languages.html=o.languages.markup,o.languages.mathml=o.languages.markup,o.languages.svg=o.languages.markup,o.languages.xml=o.languages.extend("markup",{}),o.languages.ssml=o.languages.xml,o.languages.atom=o.languages.xml,o.languages.rss=o.languages.xml,(function(c){var l=/(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;c.languages.css={comment:/\/\*[\s\S]*?\*\//,atrule:{pattern:RegExp("@[\\w-](?:"+/[^;{\s"']|\s+(?!\s)/.source+"|"+l.source+")*?"+/(?:;|(?=\s*\{))/.source),inside:{rule:/^@[\w-]+/,"selector-function-argument":{pattern:/(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,lookbehind:!0,alias:"selector"},keyword:{pattern:/(^|[^\w-])(?:and|not|only|or)(?![\w-])/,lookbehind:!0}}},url:{pattern:RegExp("\\burl\\((?:"+l.source+"|"+/(?:[^\\\r\n()"']|\\[\s\S])*/.source+")\\)","i"),greedy:!0,inside:{function:/^url/i,punctuation:/^\(|\)$/,string:{pattern:RegExp("^"+l.source+"$"),alias:"url"}}},selector:{pattern:RegExp(`(^|[{}\\s])[^{}\\s](?:[^{};"'\\s]|\\s+(?![\\s{])|`+l.source+")*(?=\\s*\\{)"),lookbehind:!0},string:{pattern:l,greedy:!0},property:{pattern:/(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,lookbehind:!0},important:/!important\b/i,function:{pattern:/(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i,lookbehind:!0},punctuation:/[(){};:,]/},c.languages.css.atrule.inside.rest=c.languages.css;var y=c.languages.markup;y&&(y.tag.addInlined("style","css"),y.tag.addAttribute("style","css"))})(o),o.languages.clike={comment:[{pattern:/(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,lookbehind:!0,greedy:!0},{pattern:/(^|[^\\:])\/\/.*/,lookbehind:!0,greedy:!0}],string:{pattern:/(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,greedy:!0},"class-name":{pattern:/(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,lookbehind:!0,inside:{punctuation:/[.\\]/}},keyword:/\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,boolean:/\b(?:false|true)\b/,function:/\b\w+(?=\()/,number:/\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,operator:/[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,punctuation:/[{}[\];(),.:]/},o.languages.javascript=o.languages.extend("clike",{"class-name":[o.languages.clike["class-name"],{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,lookbehind:!0}],keyword:[{pattern:/((?:^|\})\s*)catch\b/,lookbehind:!0},{pattern:/(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,lookbehind:!0}],function:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,number:{pattern:RegExp(/(^|[^\w$])/.source+"(?:"+(/NaN|Infinity/.source+"|"+/0[bB][01]+(?:_[01]+)*n?/.source+"|"+/0[oO][0-7]+(?:_[0-7]+)*n?/.source+"|"+/0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source+"|"+/\d+(?:_\d+)*n/.source+"|"+/(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/.source)+")"+/(?![\w$])/.source),lookbehind:!0},operator:/--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/}),o.languages.javascript["class-name"][0].pattern=/(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/,o.languages.insertBefore("javascript","keyword",{regex:{pattern:RegExp(/((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)/.source+/\//.source+"(?:"+/(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}/.source+"|"+/(?:\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.)*\])*\])*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}v[dgimyus]{0,7}/.source+")"+/(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/.source),lookbehind:!0,greedy:!0,inside:{"regex-source":{pattern:/^(\/)[\s\S]+(?=\/[a-z]*$)/,lookbehind:!0,alias:"language-regex",inside:o.languages.regex},"regex-delimiter":/^\/|\/$/,"regex-flags":/^[a-z]+$/}},"function-variable":{pattern:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,alias:"function"},parameter:[{pattern:/(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,lookbehind:!0,inside:o.languages.javascript},{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,lookbehind:!0,inside:o.languages.javascript},{pattern:/(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,lookbehind:!0,inside:o.languages.javascript},{pattern:/((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,lookbehind:!0,inside:o.languages.javascript}],constant:/\b[A-Z](?:[A-Z_]|\dx?)*\b/}),o.languages.insertBefore("javascript","string",{hashbang:{pattern:/^#!.*/,greedy:!0,alias:"comment"},"template-string":{pattern:/`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,greedy:!0,inside:{"template-punctuation":{pattern:/^`|`$/,alias:"string"},interpolation:{pattern:/((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,lookbehind:!0,inside:{"interpolation-punctuation":{pattern:/^\$\{|\}$/,alias:"punctuation"},rest:o.languages.javascript}},string:/[\s\S]+/}},"string-property":{pattern:/((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,lookbehind:!0,greedy:!0,alias:"property"}}),o.languages.insertBefore("javascript","operator",{"literal-property":{pattern:/((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,lookbehind:!0,alias:"property"}}),o.languages.markup&&(o.languages.markup.tag.addInlined("script","javascript"),o.languages.markup.tag.addAttribute(/on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/.source,"javascript")),o.languages.js=o.languages.javascript,(function(){if(typeof o>"u"||typeof document>"u")return;Element.prototype.matches||(Element.prototype.matches=Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector);var c="Loading…",l=function(C,P){return"✖ Error "+C+" while fetching file: "+P},y="✖ Error: File does not exist or is empty",E={js:"javascript",py:"python",rb:"ruby",ps1:"powershell",psm1:"powershell",sh:"bash",bat:"batch",h:"c",tex:"latex"},k="data-src-status",D="loading",$="loaded",x="failed",V="pre[data-src]:not(["+k+'="'+$+'"]):not(['+k+'="'+D+'"])';function j(C,P,_){var d=new XMLHttpRequest;d.open("GET",C,!0),d.onreadystatechange=function(){d.readyState==4&&(d.status<400&&d.responseText?P(d.responseText):d.status>=400?_(l(d.status,d.statusText)):_(y))},d.send(null)}function H(C){var P=/^\s*(\d+)\s*(?:(,)\s*(?:(\d+)\s*)?)?$/.exec(C||"");if(P){var _=Number(P[1]),d=P[2],a=P[3];return d?a?[_,Number(a)]:[_,void 0]:[_,_]}}o.hooks.add("before-highlightall",function(C){C.selector+=", "+V}),o.hooks.add("before-sanity-check",function(C){var P=C.element;if(P.matches(V)){C.code="",P.setAttribute(k,D);var _=P.appendChild(document.createElement("CODE"));_.textContent=c;var d=P.getAttribute("data-src"),a=C.language;if(a==="none"){var v=(/\.(\w+)$/.exec(d)||[,"none"])[1];a=E[v]||v}o.util.setLanguage(_,a),o.util.setLanguage(P,a);var S=o.plugins.autoloader;S&&S.loadLanguages(a),j(d,function(A){P.setAttribute(k,$);var n=H(P.getAttribute("data-range"));if(n){var h=A.split(/\r\n?|\n/g),f=n[0],T=n[1]==null?h.length:n[1];f<0&&(f+=h.length),f=Math.max(0,Math.min(f-1,h.length)),T<0&&(T+=h.length),T=Math.max(0,Math.min(T,h.length)),A=h.slice(f,T).join(`
`),P.hasAttribute("data-start")||P.setAttribute("data-start",String(f+1))}_.textContent=A,o.highlightElement(_)},function(A){P.setAttribute(k,x),_.textContent=A})}}),o.plugins.fileHighlight={highlight:function(P){for(var _=(P||document).querySelectorAll(V),d=0,a;a=_[d++];)o.highlightElement(a)}};var R=!1;o.fileHighlight=function(){R||(console.warn("Prism.fileHighlight is deprecated. Use `Prism.plugins.fileHighlight.highlight` instead."),R=!0),o.plugins.fileHighlight.highlight.apply(this,arguments)}})()})(Oe)),Oe.exports}var qt=Bt();const Vt=Ut(qt);Prism.languages.javascript=Prism.languages.extend("clike",{"class-name":[Prism.languages.clike["class-name"],{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,lookbehind:!0}],keyword:[{pattern:/((?:^|\})\s*)catch\b/,lookbehind:!0},{pattern:/(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,lookbehind:!0}],function:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,number:{pattern:RegExp(/(^|[^\w$])/.source+"(?:"+(/NaN|Infinity/.source+"|"+/0[bB][01]+(?:_[01]+)*n?/.source+"|"+/0[oO][0-7]+(?:_[0-7]+)*n?/.source+"|"+/0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source+"|"+/\d+(?:_\d+)*n/.source+"|"+/(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/.source)+")"+/(?![\w$])/.source),lookbehind:!0},operator:/--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/});Prism.languages.javascript["class-name"][0].pattern=/(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/;Prism.languages.insertBefore("javascript","keyword",{regex:{pattern:RegExp(/((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)/.source+/\//.source+"(?:"+/(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}/.source+"|"+/(?:\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.)*\])*\])*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}v[dgimyus]{0,7}/.source+")"+/(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/.source),lookbehind:!0,greedy:!0,inside:{"regex-source":{pattern:/^(\/)[\s\S]+(?=\/[a-z]*$)/,lookbehind:!0,alias:"language-regex",inside:Prism.languages.regex},"regex-delimiter":/^\/|\/$/,"regex-flags":/^[a-z]+$/}},"function-variable":{pattern:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,alias:"function"},parameter:[{pattern:/(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,lookbehind:!0,inside:Prism.languages.javascript},{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,lookbehind:!0,inside:Prism.languages.javascript},{pattern:/(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,lookbehind:!0,inside:Prism.languages.javascript},{pattern:/((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,lookbehind:!0,inside:Prism.languages.javascript}],constant:/\b[A-Z](?:[A-Z_]|\dx?)*\b/});Prism.languages.insertBefore("javascript","string",{hashbang:{pattern:/^#!.*/,greedy:!0,alias:"comment"},"template-string":{pattern:/`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,greedy:!0,inside:{"template-punctuation":{pattern:/^`|`$/,alias:"string"},interpolation:{pattern:/((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,lookbehind:!0,inside:{"interpolation-punctuation":{pattern:/^\$\{|\}$/,alias:"punctuation"},rest:Prism.languages.javascript}},string:/[\s\S]+/}},"string-property":{pattern:/((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,lookbehind:!0,greedy:!0,alias:"property"}});Prism.languages.insertBefore("javascript","operator",{"literal-property":{pattern:/((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,lookbehind:!0,alias:"property"}});Prism.languages.markup&&(Prism.languages.markup.tag.addInlined("script","javascript"),Prism.languages.markup.tag.addAttribute(/on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/.source,"javascript"));Prism.languages.js=Prism.languages.javascript;Prism.languages.markup={comment:{pattern:/<!--(?:(?!<!--)[\s\S])*?-->/,greedy:!0},prolog:{pattern:/<\?[\s\S]+?\?>/,greedy:!0},doctype:{pattern:/<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,greedy:!0,inside:{"internal-subset":{pattern:/(^[^\[]*\[)[\s\S]+(?=\]>$)/,lookbehind:!0,greedy:!0,inside:null},string:{pattern:/"[^"]*"|'[^']*'/,greedy:!0},punctuation:/^<!|>$|[[\]]/,"doctype-tag":/^DOCTYPE/i,name:/[^\s<>'"]+/}},cdata:{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,greedy:!0},tag:{pattern:/<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,greedy:!0,inside:{tag:{pattern:/^<\/?[^\s>\/]+/,inside:{punctuation:/^<\/?/,namespace:/^[^\s>\/:]+:/}},"special-attr":[],"attr-value":{pattern:/=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,inside:{punctuation:[{pattern:/^=/,alias:"attr-equals"},{pattern:/^(\s*)["']|["']$/,lookbehind:!0}]}},punctuation:/\/?>/,"attr-name":{pattern:/[^\s>\/]+/,inside:{namespace:/^[^\s>\/:]+:/}}}},entity:[{pattern:/&[\da-z]{1,8};/i,alias:"named-entity"},/&#x?[\da-f]{1,8};/i]};Prism.languages.markup.tag.inside["attr-value"].inside.entity=Prism.languages.markup.entity;Prism.languages.markup.doctype.inside["internal-subset"].inside=Prism.languages.markup;Prism.hooks.add("wrap",function(t){t.type==="entity"&&(t.attributes.title=t.content.replace(/&amp;/,"&"))});Object.defineProperty(Prism.languages.markup.tag,"addInlined",{value:function(e,o){var c={};c["language-"+o]={pattern:/(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,lookbehind:!0,inside:Prism.languages[o]},c.cdata=/^<!\[CDATA\[|\]\]>$/i;var l={"included-cdata":{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,inside:c}};l["language-"+o]={pattern:/[\s\S]+/,inside:Prism.languages[o]};var y={};y[e]={pattern:RegExp(/(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(/__/g,function(){return e}),"i"),lookbehind:!0,greedy:!0,inside:l},Prism.languages.insertBefore("markup","cdata",y)}});Object.defineProperty(Prism.languages.markup.tag,"addAttribute",{value:function(t,e){Prism.languages.markup.tag.inside["special-attr"].push({pattern:RegExp(/(^|["'\s])/.source+"(?:"+t+")"+/\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source,"i"),lookbehind:!0,inside:{"attr-name":/^[^\s=]+/,"attr-value":{pattern:/=[\s\S]+/,inside:{value:{pattern:/(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,lookbehind:!0,alias:[e,"language-"+e],inside:Prism.languages[e]},punctuation:[{pattern:/^=/,alias:"attr-equals"},/"|'/]}}}})}});Prism.languages.html=Prism.languages.markup;Prism.languages.mathml=Prism.languages.markup;Prism.languages.svg=Prism.languages.markup;Prism.languages.xml=Prism.languages.extend("markup",{});Prism.languages.ssml=Prism.languages.xml;Prism.languages.atom=Prism.languages.xml;Prism.languages.rss=Prism.languages.xml;(function(t){var e="\\b(?:BASH|BASHOPTS|BASH_ALIASES|BASH_ARGC|BASH_ARGV|BASH_CMDS|BASH_COMPLETION_COMPAT_DIR|BASH_LINENO|BASH_REMATCH|BASH_SOURCE|BASH_VERSINFO|BASH_VERSION|COLORTERM|COLUMNS|COMP_WORDBREAKS|DBUS_SESSION_BUS_ADDRESS|DEFAULTS_PATH|DESKTOP_SESSION|DIRSTACK|DISPLAY|EUID|GDMSESSION|GDM_LANG|GNOME_KEYRING_CONTROL|GNOME_KEYRING_PID|GPG_AGENT_INFO|GROUPS|HISTCONTROL|HISTFILE|HISTFILESIZE|HISTSIZE|HOME|HOSTNAME|HOSTTYPE|IFS|INSTANCE|JOB|LANG|LANGUAGE|LC_ADDRESS|LC_ALL|LC_IDENTIFICATION|LC_MEASUREMENT|LC_MONETARY|LC_NAME|LC_NUMERIC|LC_PAPER|LC_TELEPHONE|LC_TIME|LESSCLOSE|LESSOPEN|LINES|LOGNAME|LS_COLORS|MACHTYPE|MAILCHECK|MANDATORY_PATH|NO_AT_BRIDGE|OLDPWD|OPTERR|OPTIND|ORBIT_SOCKETDIR|OSTYPE|PAPERSIZE|PATH|PIPESTATUS|PPID|PS1|PS2|PS3|PS4|PWD|RANDOM|REPLY|SECONDS|SELINUX_INIT|SESSION|SESSIONTYPE|SESSION_MANAGER|SHELL|SHELLOPTS|SHLVL|SSH_AUTH_SOCK|TERM|UID|UPSTART_EVENTS|UPSTART_INSTANCE|UPSTART_JOB|UPSTART_SESSION|USER|WINDOWID|XAUTHORITY|XDG_CONFIG_DIRS|XDG_CURRENT_DESKTOP|XDG_DATA_DIRS|XDG_GREETER_DATA_DIR|XDG_MENU_PREFIX|XDG_RUNTIME_DIR|XDG_SEAT|XDG_SEAT_PATH|XDG_SESSION_DESKTOP|XDG_SESSION_ID|XDG_SESSION_PATH|XDG_SESSION_TYPE|XDG_VTNR|XMODIFIERS)\\b",o={pattern:/(^(["']?)\w+\2)[ \t]+\S.*/,lookbehind:!0,alias:"punctuation",inside:null},c={bash:o,environment:{pattern:RegExp("\\$"+e),alias:"constant"},variable:[{pattern:/\$?\(\([\s\S]+?\)\)/,greedy:!0,inside:{variable:[{pattern:/(^\$\(\([\s\S]+)\)\)/,lookbehind:!0},/^\$\(\(/],number:/\b0x[\dA-Fa-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:[Ee]-?\d+)?/,operator:/--|\+\+|\*\*=?|<<=?|>>=?|&&|\|\||[=!+\-*/%<>^&|]=?|[?~:]/,punctuation:/\(\(?|\)\)?|,|;/}},{pattern:/\$\((?:\([^)]+\)|[^()])+\)|`[^`]+`/,greedy:!0,inside:{variable:/^\$\(|^`|\)$|`$/}},{pattern:/\$\{[^}]+\}/,greedy:!0,inside:{operator:/:[-=?+]?|[!\/]|##?|%%?|\^\^?|,,?/,punctuation:/[\[\]]/,environment:{pattern:RegExp("(\\{)"+e),lookbehind:!0,alias:"constant"}}},/\$(?:\w+|[#?*!@$])/],entity:/\\(?:[abceEfnrtv\\"]|O?[0-7]{1,3}|U[0-9a-fA-F]{8}|u[0-9a-fA-F]{4}|x[0-9a-fA-F]{1,2})/};t.languages.bash={shebang:{pattern:/^#!\s*\/.*/,alias:"important"},comment:{pattern:/(^|[^"{\\$])#.*/,lookbehind:!0},"function-name":[{pattern:/(\bfunction\s+)[\w-]+(?=(?:\s*\(?:\s*\))?\s*\{)/,lookbehind:!0,alias:"function"},{pattern:/\b[\w-]+(?=\s*\(\s*\)\s*\{)/,alias:"function"}],"for-or-select":{pattern:/(\b(?:for|select)\s+)\w+(?=\s+in\s)/,alias:"variable",lookbehind:!0},"assign-left":{pattern:/(^|[\s;|&]|[<>]\()\w+(?:\.\w+)*(?=\+?=)/,inside:{environment:{pattern:RegExp("(^|[\\s;|&]|[<>]\\()"+e),lookbehind:!0,alias:"constant"}},alias:"variable",lookbehind:!0},parameter:{pattern:/(^|\s)-{1,2}(?:\w+:[+-]?)?\w+(?:\.\w+)*(?=[=\s]|$)/,alias:"variable",lookbehind:!0},string:[{pattern:/((?:^|[^<])<<-?\s*)(\w+)\s[\s\S]*?(?:\r?\n|\r)\2/,lookbehind:!0,greedy:!0,inside:c},{pattern:/((?:^|[^<])<<-?\s*)(["'])(\w+)\2\s[\s\S]*?(?:\r?\n|\r)\3/,lookbehind:!0,greedy:!0,inside:{bash:o}},{pattern:/(^|[^\\](?:\\\\)*)"(?:\\[\s\S]|\$\([^)]+\)|\$(?!\()|`[^`]+`|[^"\\`$])*"/,lookbehind:!0,greedy:!0,inside:c},{pattern:/(^|[^$\\])'[^']*'/,lookbehind:!0,greedy:!0},{pattern:/\$'(?:[^'\\]|\\[\s\S])*'/,greedy:!0,inside:{entity:c.entity}}],environment:{pattern:RegExp("\\$?"+e),alias:"constant"},variable:c.variable,function:{pattern:/(^|[\s;|&]|[<>]\()(?:add|apropos|apt|apt-cache|apt-get|aptitude|aspell|automysqlbackup|awk|basename|bash|bc|bconsole|bg|bzip2|cal|cargo|cat|cfdisk|chgrp|chkconfig|chmod|chown|chroot|cksum|clear|cmp|column|comm|composer|cp|cron|crontab|csplit|curl|cut|date|dc|dd|ddrescue|debootstrap|df|diff|diff3|dig|dir|dircolors|dirname|dirs|dmesg|docker|docker-compose|du|egrep|eject|env|ethtool|expand|expect|expr|fdformat|fdisk|fg|fgrep|file|find|fmt|fold|format|free|fsck|ftp|fuser|gawk|git|gparted|grep|groupadd|groupdel|groupmod|groups|grub-mkconfig|gzip|halt|head|hg|history|host|hostname|htop|iconv|id|ifconfig|ifdown|ifup|import|install|ip|java|jobs|join|kill|killall|less|link|ln|locate|logname|logrotate|look|lpc|lpr|lprint|lprintd|lprintq|lprm|ls|lsof|lynx|make|man|mc|mdadm|mkconfig|mkdir|mke2fs|mkfifo|mkfs|mkisofs|mknod|mkswap|mmv|more|most|mount|mtools|mtr|mutt|mv|nano|nc|netstat|nice|nl|node|nohup|notify-send|npm|nslookup|op|open|parted|passwd|paste|pathchk|ping|pkill|pnpm|podman|podman-compose|popd|pr|printcap|printenv|ps|pushd|pv|quota|quotacheck|quotactl|ram|rar|rcp|reboot|remsync|rename|renice|rev|rm|rmdir|rpm|rsync|scp|screen|sdiff|sed|sendmail|seq|service|sftp|sh|shellcheck|shuf|shutdown|sleep|slocate|sort|split|ssh|stat|strace|su|sudo|sum|suspend|swapon|sync|sysctl|tac|tail|tar|tee|time|timeout|top|touch|tr|traceroute|tsort|tty|umount|uname|unexpand|uniq|units|unrar|unshar|unzip|update-grub|uptime|useradd|userdel|usermod|users|uudecode|uuencode|v|vcpkg|vdir|vi|vim|virsh|vmstat|wait|watch|wc|wget|whereis|which|who|whoami|write|xargs|xdg-open|yarn|yes|zenity|zip|zsh|zypper)(?=$|[)\s;|&])/,lookbehind:!0},keyword:{pattern:/(^|[\s;|&]|[<>]\()(?:case|do|done|elif|else|esac|fi|for|function|if|in|select|then|until|while)(?=$|[)\s;|&])/,lookbehind:!0},builtin:{pattern:/(^|[\s;|&]|[<>]\()(?:\.|:|alias|bind|break|builtin|caller|cd|command|continue|declare|echo|enable|eval|exec|exit|export|getopts|hash|help|let|local|logout|mapfile|printf|pwd|read|readarray|readonly|return|set|shift|shopt|source|test|times|trap|type|typeset|ulimit|umask|unalias|unset)(?=$|[)\s;|&])/,lookbehind:!0,alias:"class-name"},boolean:{pattern:/(^|[\s;|&]|[<>]\()(?:false|true)(?=$|[)\s;|&])/,lookbehind:!0},"file-descriptor":{pattern:/\B&\d\b/,alias:"important"},operator:{pattern:/\d?<>|>\||\+=|=[=~]?|!=?|<<[<-]?|[&\d]?>>|\d[<>]&?|[<>][&=]?|&[>&]?|\|[&|]?/,inside:{"file-descriptor":{pattern:/^\d/,alias:"important"}}},punctuation:/\$?\(\(?|\)\)?|\.\.|[{}[\];\\]/,number:{pattern:/(^|\s)(?:[1-9]\d*|0)(?:[.,]\d+)?\b/,lookbehind:!0}},o.inside=t.languages.bash;for(var l=["comment","function-name","for-or-select","assign-left","parameter","string","environment","function","keyword","builtin","boolean","file-descriptor","operator","punctuation","number"],y=c.variable[1].inside,E=0;E<l.length;E++)y[l[E]]=t.languages.bash[l[E]];t.languages.sh=t.languages.bash,t.languages.shell=t.languages.bash})(Prism);Prism.languages.json={property:{pattern:/(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?=\s*:)/,lookbehind:!0,greedy:!0},string:{pattern:/(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?!\s*:)/,lookbehind:!0,greedy:!0},comment:{pattern:/\/\/.*|\/\*[\s\S]*?(?:\*\/|$)/,greedy:!0},number:/-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i,punctuation:/[{}[\],]/,operator:/:/,boolean:/\b(?:false|true)\b/,null:{pattern:/\bnull\b/,alias:"keyword"}};Prism.languages.webmanifest=Prism.languages.json;var ot={},nt;function Gt(){return nt||(nt=1,(function(t){t.languages.typescript=t.languages.extend("javascript",{"class-name":{pattern:/(\b(?:class|extends|implements|instanceof|interface|new|type)\s+)(?!keyof\b)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?:\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>)?/,lookbehind:!0,greedy:!0,inside:null},builtin:/\b(?:Array|Function|Promise|any|boolean|console|never|number|string|symbol|unknown)\b/}),t.languages.typescript.keyword.push(/\b(?:abstract|declare|is|keyof|readonly|require)\b/,/\b(?:asserts|infer|interface|module|namespace|type)\b(?=\s*(?:[{_$a-zA-Z\xA0-\uFFFF]|$))/,/\btype\b(?=\s*(?:[\{*]|$))/),delete t.languages.typescript.parameter,delete t.languages.typescript["literal-property"];var e=t.languages.extend("typescript",{});delete e["class-name"],t.languages.typescript["class-name"].inside=e,t.languages.insertBefore("typescript","function",{decorator:{pattern:/@[$\w\xA0-\uFFFF]+/,inside:{at:{pattern:/^@/,alias:"operator"},function:/^[\s\S]+/}},"generic-function":{pattern:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>(?=\s*\()/,greedy:!0,inside:{function:/^#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*/,generic:{pattern:/<[\s\S]+/,alias:"class-name",inside:e}}}}),t.languages.ts=t.languages.typescript})(Prism)),ot}Gt();const Yt={js:"JavaScript",ts:"TypeScript",html:"HTML",bash:"Shell",json:"JSON"};function Xt(t){const e=t.split(`
`);for(;e.length&&!e[0].trim();)e.shift();for(;e.length&&!e[e.length-1].trim();)e.pop();const o=e.filter(c=>c.trim()).reduce((c,l)=>Math.min(c,l.match(/^(\s*)/)[1].length),1/0);return e.map(c=>c.slice(o)).join(`
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
    `,computed:{langLabel(){return Yt[this.lang]||this.lang.toUpperCase()}},methods:{copy(){var t;(t=navigator.clipboard)==null||t.writeText(this._cleanCode).then(()=>{this.copied=!0,setTimeout(()=>{this.copied=!1},1800)})}},onMount(){const t=this.$refs.el;t&&(this._cleanCode=Xt(this.code),t.textContent=this._cleanCode,Vt.highlightElement(t))}},he="Courvux",Jt="https://vanjexdev.github.io/courvux";function Z({title:t,description:e,slug:o="/"}){const c=t?`${t} — ${he}`:`${he} — Lightweight reactive UI framework`,l=Jt+o;return Ht({title:t??`${he} — Lightweight reactive UI framework`,titleTemplate:t?`%s — ${he}`:void 0,meta:[{name:"description",content:e},{property:"og:title",content:c},{property:"og:description",content:e},{property:"og:type",content:"website"},{property:"og:url",content:l},{property:"og:site_name",content:he},{name:"twitter:card",content:"summary_large_image"},{name:"twitter:title",content:c},{name:"twitter:description",content:e}],link:[{rel:"canonical",href:l}]})}const Kt={data:{install:`# From GitHub — pin a tag for stable installs
pnpm add github:vanjexdev/courvux#v0.4.0

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
                    <span class="badge">v0.4.0</span>
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
    `,onMount(){Z({description:"Lightweight reactive UI framework for the browser. No virtual DOM. Proxy-based reactivity. ~10 KB gzip.",slug:"/"})}},Qt={data:{s1:`# Latest commit on main (rolling)
pnpm add github:vanjexdev/courvux

# Pin to a tagged release (recommended for production)
pnpm add github:vanjexdev/courvux#v0.4.0`,s2:`<script type="importmap">
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
    "courvux": "https://cdn.jsdelivr.net/gh/vanjexdev/courvux@v0.4.0/dist/index.js"
  }
}
<\/script>

<script type="module">
  import { createApp, createStore, createRouter } from 'courvux';
<\/script>`},onMount(){Z({title:"Installation",description:"Install Courvux from GitHub or via import map / CDN. Vite plugin for templateUrl inlining and jsDelivr CDN setup.",slug:"/installation"});const t=this.$refs.pen;if(!t)return;const e=document.createElement("iframe");e.src="https://codepen.io/jesusuzcategui-the-bold/embed/VYmZNgZ?default-tab=html%2Cresult&theme-id=dark",e.height="420",e.style.cssText="width:100%; border:0; border-radius:8px; display:block; margin-bottom:1rem;",e.scrolling="no",e.setAttribute("frameborder","no"),e.setAttribute("allowtransparency","true"),e.allowFullscreen=!0,e.title="Courvux CDN demo on CodePen",t.replaceWith(e)},template:`
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
    `},eo={data:{s1:`import { createApp } from 'courvux';

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
    `,onMount(){Z({title:"Quick Start",description:"Build your first reactive Courvux app — counter example, methods, computed properties.",slug:"/quick-start"})}},to={data:{s_interp:`<!-- Text interpolation -->
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
    `,onMount(){Z({title:"Template Syntax",description:"Courvux directives and bindings: cv-if, cv-for, cv-model, cv-show, :class, :style, @event.",slug:"/template"})}},oo={data:{s_define:`createApp({
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
    `,onMount(){Z({title:"Components",description:"Define, register, and compose Courvux components with props, slots, emits, and scoped slots.",slug:"/components"})}},no={data:{s_computed:`{
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
    `,onMount(){Z({title:"Lifecycle Hooks",description:"onMount, onBeforeUnmount, onDestroy, error boundaries, and async data in Courvux.",slug:"/lifecycle"})}},ao={data:{s_storage:`import { cvStorage } from 'courvux';

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
    `,onMount(){Z({title:"Composables",description:"Reactive composables in Courvux: cvStorage, cvFetch, cvDebounce, cvThrottle, cvMediaQuery, cvListener.",slug:"/composables"})}},io={data:{s_basic:`import { createEventBus } from 'courvux';

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
    `,onMount(){Z({title:"Event Bus",description:"Typed cross-component event bus in Courvux: on, off, emit, once, clear, and provide/inject patterns.",slug:"/event-bus"})}},so={data:{s_setup:`import { createApp, createRouter } from 'courvux';

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
    `,onMount(){Z({title:"Router",description:"SPA routing in Courvux: dynamic params, nested routes, navigation guards, transitions.",slug:"/router"})}},co={data:{s1:`import { createStore } from 'courvux';

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
    `,onMount(){Z({title:"Store",description:"Global reactive state in Courvux with createStore, modules, and namespaced actions.",slug:"/store"})}},lo={data:{s_basic:`import { useHead } from 'courvux';

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
    `,onMount(){Z({title:"useHead — SEO and metadata",description:"Per-component head management with useHead in Courvux: title, meta tags, Open Graph, JSON-LD, htmlAttrs.",slug:"/head"})}},uo={data:{s_vite:`// vite.config.js
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
    `,onMount(){Z({title:"Static Site Generation",description:"Pre-render every route to static HTML at build time with the courvux/plugin/ssg Vite plugin.",slug:"/ssg"})}},po={data:{s_setup:`import { createApp, setupDevTools, mountDevOverlay } from 'courvux';

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
    `,onMount(){Z({title:"DevTools",description:"In-app DevTools overlay for Courvux: live component state inspection and inline editing, no browser extension needed.",slug:"/devtools"})}},mo={data:{s_basic:`import { mount } from 'courvux/test-utils';
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
    `,onMount(){Z({title:"Testing",description:"Vitest-compatible test utility for Courvux. Mount components, drive state, query the DOM with happy-dom.",slug:"/testing"})}},ho={data:{s_manifest:`{
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
    `,onMount(){Z({title:"Progressive Web App",description:"Make any Courvux app installable and offline-capable: manifest, vite-plugin-pwa, install prompt utility.",slug:"/pwa"})}},fo={data:{s_dir:`// Full definition
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
    `,onMount(){Z({title:"Advanced",description:"Custom directives, plugins, transitions, and the cv-data inline scope in Courvux.",slug:"/advanced"})}},pt="courvux-demo-todos",vo=`const STORAGE_KEY = 'courvux-demo-todos';

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
};`,go=`<!-- Input -->
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
<button cv-show="todos.some(t => t.done)" @click="clearCompleted()">Clear completed</button>`;function bo(){try{return JSON.parse(localStorage.getItem(pt))||[]}catch{return[]}}function yo(t){localStorage.setItem(pt,JSON.stringify(t))}const ko={data:{todos:bo(),newTodo:"",filter:"all",editingId:null,editText:"",_nextId:Date.now(),srcJs:vo,srcHtml:go,srcTab:"js"},computed:{filteredTodos(){return this.filter==="active"?this.todos.filter(t=>!t.done):this.filter==="completed"?this.todos.filter(t=>t.done):this.todos},remaining(){return this.todos.filter(t=>!t.done).length},allDone(){return this.todos.length>0&&this.todos.every(t=>t.done)}},watch:{todos:{deep:!0,handler(t){yo(t)}}},methods:{add(){const t=this.newTodo.trim();t&&(this.todos=[...this.todos,{id:this._nextId++,text:t,done:!1}],this.newTodo="")},toggle(t){this.todos=this.todos.map(e=>e.id===t?{...e,done:!e.done}:e)},remove(t){this.todos=this.todos.filter(e=>e.id!==t)},clearCompleted(){this.todos=this.todos.filter(t=>!t.done)},toggleAll(){const t=this.allDone;this.todos=this.todos.map(e=>({...e,done:!t}))},startEdit(t){this.editingId=t.id,this.editText=t.text,this.$nextTick(()=>{var e;return(e=this.$refs["edit_"+t.id])==null?void 0:e.focus()})},commitEdit(t){const e=this.editText.trim();e?this.todos=this.todos.map(o=>o.id===t?{...o,text:e}:o):this.remove(t),this.editingId=null,this.editText=""},cancelEdit(){this.editingId=null,this.editText=""},setFilter(t){this.filter=t}},template:`
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
    `,onMount(){Z({title:"Demo — TODO App",description:"Interactive TODO app built with Courvux. Live demo with full source code (JS + HTML).",slug:"/demo"})}},wo=[{path:"/",component:Kt},{path:"/installation",component:Qt},{path:"/quick-start",component:eo},{path:"/template",component:to},{path:"/components",component:oo},{path:"/reactivity",component:no},{path:"/lifecycle",component:ro},{path:"/composables",component:ao},{path:"/event-bus",component:io},{path:"/router",component:so},{path:"/store",component:co},{path:"/head",component:lo},{path:"/ssg",component:uo},{path:"/devtools",component:po},{path:"/testing",component:mo},{path:"/pwa",component:ho},{path:"/advanced",component:fo},{path:"/demo",component:ko}],xo={methods:{goBack(){window.history.back()}},template:`
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
    `,onMount(){Z({title:"404 — Page not found",description:"The page you are looking for does not exist on Courvux docs.",slug:"/404"})}},Ao=_t([...wo,{path:"*",component:xo}],{mode:"history",base:"/courvux",scrollBehavior:()=>{var t;return(t=document.querySelector("main"))==null||t.scrollTo({top:0,behavior:"instant"}),{x:0,y:0}}}),rt=[{key:"start",label:"Getting Started",items:[{to:"/",label:"Introduction"},{to:"/installation",label:"Installation"},{to:"/quick-start",label:"Quick Start"}]},{key:"template",label:"Template Syntax",items:[{to:"/template",label:"Directives & Bindings"}]},{key:"components",label:"Components",items:[{to:"/components",label:"Components"},{to:"/reactivity",label:"Reactivity"},{to:"/lifecycle",label:"Lifecycle"},{to:"/composables",label:"Composables"},{to:"/event-bus",label:"Event Bus"}]},{key:"router",label:"Router & Store",items:[{to:"/router",label:"Router"},{to:"/store",label:"Store"}]},{key:"seo",label:"SEO & SSG",items:[{to:"/head",label:"useHead"},{to:"/ssg",label:"Static Generation"}]},{key:"tooling",label:"Tooling",items:[{to:"/devtools",label:"DevTools"},{to:"/testing",label:"Testing"},{to:"/pwa",label:"PWA"}]},{key:"advanced",label:"Advanced",items:[{to:"/advanced",label:"Directives & Plugins"}]},{key:"demo",label:"Demo",items:[{to:"/demo",label:"⚡ TODO App"}]}];Wt({router:Ao,components:{"code-block":Zt},data:{nav:rt,open:rt.reduce((t,e)=>(t[e.key]=!0,t),{})},methods:{toggle(t){this.open={...this.open,[t]:!this.open[t]}}},template:`
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
                        <span style="font-size:10px; color:#999; margin-left:2px;">v0.4.0</span>
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
