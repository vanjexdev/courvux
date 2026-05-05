(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const b of a)if(b.type==="childList")for(const k of b.addedNodes)k.tagName==="LINK"&&k.rel==="modulepreload"&&s(k)}).observe(document,{childList:!0,subtree:!0});function o(a){const b={};return a.integrity&&(b.integrity=a.integrity),a.referrerPolicy&&(b.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?b.credentials="include":a.crossOrigin==="anonymous"?b.credentials="omit":b.credentials="same-origin",b}function s(a){if(a.ep)return;a.ep=!0;const b=o(a);fetch(a.href,b)}})();var kt=new Set(["push","pop","shift","unshift","splice","sort","reverse"]),lt=e=>e instanceof Date||e instanceof RegExp||e instanceof Map||e instanceof Set||e instanceof WeakMap||e instanceof WeakSet||ArrayBuffer.isView(e)||e instanceof ArrayBuffer,De=new WeakSet,Ae=Symbol("raw"),Oe=e=>e===null||typeof e!="object"?e:e[Ae]??e,ke=0,Ie=new Map,ve=null;function He(e){const t=[],o=ve;ve=t;try{e()}finally{ve=o}return t}function St(e){ke++;try{e()}finally{if(ke--,ke===0){const t=[...Ie.values()];Ie.clear(),t.forEach(o=>o())}}}function ut(e,t){return e===null||typeof e!="object"||De.has(e)||lt(e)?e:new Proxy(e,{get(o,s){if(s===Ae)return o[Ae]??o;if(typeof s=="string"&&Array.isArray(o)&&kt.has(s))return(...b)=>{const k=Array.prototype[s].apply(o,b);return t(),k};const a=o[s];return a!==null&&typeof a=="object"&&!De.has(a)?ut(a,t):a},set(o,s,a){return o[s]=a,t(),!0}})}function Le(){const e={},t=Math.random().toString(36).slice(2),o=(b,k)=>(e[b]||(e[b]=new Set),e[b].add(k),()=>{var f;(f=e[b])==null||f.delete(k)}),s=b=>{ke>0?Ie.set(`${t}:${b}`,()=>{(e[b]?[...e[b]]:[]).forEach(k=>k())}):(e[b]?[...e[b]]:[]).forEach(k=>k())},a={};return{subscribe:o,createReactiveState:b=>new Proxy(b,{get(k,f){if(f===Ae)return b;typeof f=="string"&&!f.startsWith("$")&&ve&&ve.push({sub:o,key:f});const I=k[f];return typeof f=="string"&&!f.startsWith("$")&&I!==null&&typeof I=="object"&&!De.has(I)&&!lt(I)?ut(I,()=>s(f)):I},set(k,f,I){if(a[f])return a[f](I),!0;const $=k[f];return k[f]=I,($!==I||I!==null&&typeof I=="object")&&s(f),!0}}),registerSetInterceptor:(b,k)=>{a[b]=k},notifyAll:()=>{Object.keys(e).forEach(b=>s(b))}}}var Fe=new WeakMap;function be(e,t,o){var a,b;const s=t.indexOf(".");if(s>=0){const k=t.slice(0,s),f=t.slice(s+1),I=e[k];return I&&Fe.has(I)?be(I,f,o):((a=Fe.get(e))==null?void 0:a(k,o))??(()=>{})}return((b=Fe.get(e))==null?void 0:b(t,o))??(()=>{})}var pt=(e,t)=>e.split(".").reduce((o,s)=>o==null?void 0:o[s],t),ze=(()=>{try{return new Function("return 1")(),!0}catch{return console.warn("[courvux] CSP blocks eval. Expressions limited to property access and literals."),!1}})(),Ne=new Map,We=new Map,mt=(e,t)=>{const o=e.trim();if(o==="true")return!0;if(o==="false")return!1;if(o==="null")return null;if(o!=="undefined")return/^-?\d+(\.\d+)?$/.test(o)?parseFloat(o):/^(['"`])(.*)\1$/s.test(o)?o.slice(1,-1):o.startsWith("!")?!mt(o.slice(1).trim(),t):pt(o,t)},W=(e,t)=>{if(!ze)return mt(e,t);try{let o=Ne.get(e);return o||(o=new Function("$data",`with($data) { return (${e}) }`),Ne.set(e,o)),o(t)}catch{return pt(e,t)}},ht=(e,t,o)=>e.startsWith("$store.")&&t.store?t.storeSubscribeOverride?t.storeSubscribeOverride(t.store,e.slice(7),o):be(t.store,e.slice(7),o):t.subscribe(e,o),J=(e,t,o)=>{const s=new Set(["true","false","null","undefined","in","of","typeof","instanceof"]),a=e.match(/\$?[a-zA-Z_][\w$]*(?:\.\$?[a-zA-Z_][\w$]*)*/g)??[],b=[...new Set(a.map(f=>f.startsWith("$store.")?f:f.split(".")[0]).filter(f=>!s.has(f)))];if(b.length===0)return()=>{};const k=b.map(f=>ht(f,t,o));return()=>k.forEach(f=>f())},Ue=new Map,At=e=>{const t=Ue.get(e);if(t)return t;const o=e.trim();let s=0,a=-1,b=null;for(let f=0;f<o.length;f++){const I=o[f];I==="["?(s===0&&(a=f,b="bracket"),s++):I==="]"?s--:I==="."&&s===0&&(a=f,b="dot")}let k;if(a<0)k={parent:"",keyExpr:JSON.stringify(o)};else if(b==="dot")k={parent:o.slice(0,a),keyExpr:JSON.stringify(o.slice(a+1))};else{const f=o.lastIndexOf("]");k=f>a?{parent:o.slice(0,a),keyExpr:o.slice(a+1,f)}:{parent:"",keyExpr:JSON.stringify(o)}}return Ue.set(e,k),k},pe=(e,t,o)=>{if(ze)try{const{parent:a,keyExpr:b}=At(e),k=a?W(a,t):t,f=W(b,t);if(k==null)return;k[f]=o;return}catch(a){console.warn(`[courvux] setStateValue: write failed for "${e}":`,a);return}const s=e.split(".");if(s.length===1)t[s[0]]=o;else{const a=s.slice(0,-1).reduce((b,k)=>b==null?void 0:b[k],t);a&&(a[s[s.length-1]]=o)}},qe=(e,t,o,s,a)=>{const b={};return Object.keys(e).forEach(k=>b[k]=e[k]),b[o]=t,a&&(b[a]=s),b},Me=e=>e?typeof e=="string"?e:Array.isArray(e)?e.map(Me).filter(Boolean).join(" "):typeof e=="object"?Object.entries(e).filter(([,t])=>!!t).map(([t])=>t).join(" "):"":"",Be=(e,t,o)=>{if(!t){e.style.cssText=o;return}typeof t=="string"?e.style.cssText=o?`${o};${t}`:t:typeof t=="object"&&(o&&(e.style.cssText=o),Object.entries(t).forEach(([s,a])=>{e.style[s]=a??""}))},Ve=(e,t,o)=>{if(ze)try{let s=We.get(e);s||(s=new Function("__p__",`with(__p__){${e}}`),We.set(e,s));const a=new Proxy({},{has:()=>!0,get:(b,k)=>k==="$event"?o:k in t?t[k]:globalThis[k],set:(b,k,f)=>(t[k]=f,!0)});s(a)}catch(s){console.warn(`[courvux] handler error "${e}":`,s)}},ce=e=>{const t=getComputedStyle(e),o=Math.max(parseFloat(t.animationDuration)||0,parseFloat(t.transitionDuration)||0)*1e3;return o<=0?Promise.resolve():new Promise(s=>{const a=()=>s();e.addEventListener("animationend",a,{once:!0}),e.addEventListener("transitionend",a,{once:!0}),setTimeout(a,o+50)})},Ct=`
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
`,Ge=!1;function Ye(){if(Ge||typeof document>"u")return;Ge=!0;const e=document.createElement("style");e.id="cv-transitions-el",e.textContent=Ct,document.head.appendChild(e)}var Xe=!1;function Et(){if(Xe||typeof document>"u")return;Xe=!0;const e=document.createElement("style");e.id="cv-cloak-style",e.textContent="[cv-cloak]{display:none!important}",document.head.appendChild(e)}function Tt(e){if(typeof window<"u"&&"Sanitizer"in window){const o=document.createElement("div");return o.setHTML(e,{sanitizer:new window.Sanitizer}),o.innerHTML}const t=new DOMParser().parseFromString(e,"text/html");return t.querySelectorAll("script,iframe,object,embed,form,meta,link,style").forEach(o=>o.remove()),t.querySelectorAll("*").forEach(o=>{Array.from(o.attributes).forEach(s=>{(s.name.startsWith("on")||s.value.trim().toLowerCase().startsWith("javascript:"))&&o.removeAttribute(s.name)})}),t.body.innerHTML}async function te(e,t,o){var b,k,f,I,$,C,L,_,M,z,O,R,E,c,d,p,w;const s=Array.from(e.childNodes);let a=0;for(;a<s.length;){const S=s[a];if(S.nodeType===3){const i=S.textContent||"",l=i.match(/\{\{([\s\S]+?)\}\}/g);if(l){const r=i,g=()=>{let m=r;l.forEach(u=>{const h=u.replace(/^\{\{\s*/,"").replace(/\s*\}\}$/,"");m=m.replace(u,W(h,t)??"")}),S.textContent=m};l.forEach(m=>{J(m.replace(/^\{\{\s*/,"").replace(/\s*\}\}$/,""),o,g)}),g()}a++;continue}if(S.nodeType!==1){a++;continue}const n=S,y=n.tagName.toLowerCase();if(n.hasAttribute("cv-pre")){n.removeAttribute("cv-pre"),a++;continue}if(n.hasAttribute("cv-once")){n.removeAttribute("cv-once"),await te(n,t,{...o,subscribe:()=>()=>{},storeSubscribeOverride:()=>()=>{}}),a++;continue}if(n.hasAttribute("cv-cloak")&&n.removeAttribute("cv-cloak"),n.hasAttribute("cv-teleport")){const i=n.getAttribute("cv-teleport");n.removeAttribute("cv-teleport");const l=document.querySelector(i)??document.body,r=document.createComment(`cv-teleport: ${i}`);n.replaceWith(r),await te(n,t,o),l.appendChild(n),a++;continue}if(n.hasAttribute("cv-memo")){const i=n.getAttribute("cv-memo");n.removeAttribute("cv-memo");const l=()=>i.split(",").map(h=>W(h.trim(),t));let r=l();const g=[],m=h=>(g.push(h),()=>{const v=g.indexOf(h);v>-1&&g.splice(v,1)});await te(n,t,{...o,subscribe:(h,v)=>m(v),storeSubscribeOverride:(h,v,T)=>m(T)});const u=J(i,o,()=>{const h=l();h.some((v,T)=>v!==r[T])&&(r=h,[...g].forEach(v=>v()))});(b=o.registerCleanup)==null||b.call(o,()=>u()),a++;continue}if(n.hasAttribute("cv-data")){const i=n.getAttribute("cv-data").trim();n.removeAttribute("cv-data");let l={},r={};if(i.startsWith("{")){const g=W(i,t)??{};Object.entries(g).forEach(([m,u])=>{typeof u=="function"?r[m]=u:l[m]=u})}else if(i){const g=(k=o.components)==null?void 0:k[i];if(g){const m=typeof g.data=="function"?g.data():g.data??{};m instanceof Promise||Object.assign(l,m),Object.assign(r,g.methods??{})}}if(o.createChildScope){const g=o.createChildScope(l,r);(f=o.registerCleanup)==null||f.call(o,g.cleanup),await te(n,g.state,{...o,subscribe:g.subscribe})}else await te(n,{...t,...l,...r},o);a++;continue}if(n.hasAttribute("cv-for")){const i=n.getAttribute("cv-for");n.removeAttribute("cv-for");const l=i.match(/^\(?(\w+)(?:,\s*(\w+))?\)?\s+in\s+(.+)$/);if(l){const[,r,g,m]=l,u=n.getAttribute(":key")??null;u&&n.removeAttribute(":key");const h=n.getAttribute("cv-transition")??null;h&&n.removeAttribute("cv-transition");const v=document.createComment(`cv-for: ${m}`);n.replaceWith(v);let T=[],F=[];const j=new Map;let U=!1,N=!1;const D=async()=>{var K;const q=W(m,t),H=q?typeof q=="number"?Array.from({length:q},(V,B)=>[B+1,B]):Array.isArray(q)?q.map((V,B)=>[V,B]):Object.entries(q).map(([V,B])=>[B,V]):[];if(u){const V=[],B=new Map,de=new Set;for(const[X,Y]of H){const ie=W(u,qe(t,X,r,Y,g));de.has(ie)&&console.warn(`[courvux] cv-for: duplicate :key "${ie}" in "${m}"`),de.add(ie),V.push(ie),B.set(ie,[X,Y])}const Q=[];for(const[X,{el:Y,destroy:ie}]of j)B.has(X)||(h?(Y.classList.add(`${h}-leave`),Q.push(ce(Y).then(()=>{var se;Y.classList.remove(`${h}-leave`),ie(),(se=Y.parentNode)==null||se.removeChild(Y),j.delete(X)}))):(ie(),(K=Y.parentNode)==null||K.removeChild(Y),j.delete(X)));Q.length&&await Promise.all(Q);const re=v.parentNode,ae=[];for(const X of V){const[Y,ie]=B.get(X);if(j.has(X)){const se=j.get(X);se.itemRef!==Y&&(se.reactive[r]=Y,se.itemRef=Y),g&&(se.reactive[g]=ie)}else{const se=n.cloneNode(!0),Ee=[],{subscribe:bt,createReactiveState:yt}=Le(),Te=yt({[r]:Y,...g?{[g]:ie}:{}}),xt=new Proxy({},{has(le,ee){return!0},get(le,ee){return typeof ee!="string"?t[ee]:ee===r||g&&ee===g?Te[ee]:t[ee]},set(le,ee,ue){return ee===r||g&&ee===g?(Te[ee]=ue,!0):(t[ee]=ue,!0)}}),wt={...o,subscribe:(le,ee)=>{const ue=le.split(".")[0];let me;return ue===r||g&&ue===g?me=bt(ue,ee):me=o.subscribe(le,ee),Ee.push(me),me},storeSubscribeOverride:(le,ee,ue)=>{const me=be(le,ee,ue);return Ee.push(me),me}},_e=document.createDocumentFragment();_e.appendChild(se),await te(_e,xt,wt);const $e=_e.firstChild??se;h&&$e.classList.add(`${h}-enter`),j.set(X,{el:$e,reactive:Te,itemRef:Y,destroy:()=>Ee.forEach(le=>le())}),h&&ae.push($e)}}let oe=v.nextSibling,he=0;for(const X of V){const{el:Y}=j.get(X);Y!==oe?he++:oe=Y.nextSibling}if(he>0)if(he>V.length>>1){const X=document.createDocumentFragment();for(const Y of V)X.appendChild(j.get(Y).el);re.insertBefore(X,v.nextSibling)}else{oe=v.nextSibling;for(const X of V){const{el:Y}=j.get(X);Y!==oe?re.insertBefore(Y,oe):oe=Y.nextSibling}}T=V.map(X=>j.get(X).el),ae.length&&Promise.all(ae.map(X=>ce(X).then(()=>X.classList.remove(`${h}-enter`))))}else{if(F.forEach(Q=>Q()),F=[],T.forEach(Q=>{var re;return(re=Q.parentNode)==null?void 0:re.removeChild(Q)}),T=[],!H.length)return;const V=v.parentNode,B=v.nextSibling,de={...o,subscribe:(Q,re)=>{const ae=o.subscribe(Q,re);return F.push(ae),ae},storeSubscribeOverride:(Q,re,ae)=>{const oe=be(Q,re,ae);return F.push(oe),oe}};for(const[Q,re]of H){const ae=n.cloneNode(!0),oe=document.createDocumentFragment();oe.appendChild(ae),await te(oe,qe(t,Q,r,re,g),de);const he=oe.firstChild??ae;V.insertBefore(oe,B),T.push(he)}}},G=async()=>{if(U){N=!0;return}U=!0;try{for(await D();N;)N=!1,await D()}finally{U=!1}};(I=o.registerCleanup)==null||I.call(o,()=>{j.forEach(({el:q,destroy:H})=>{var K;H(),(K=q.parentNode)==null||K.removeChild(q)}),j.clear(),F.forEach(q=>q()),T.forEach(q=>{var H;return(H=q.parentNode)==null?void 0:H.removeChild(q)}),T=[]}),J(m,o,G),await G()}a++;continue}if(n.hasAttribute("cv-if")){const i=[],l=n.getAttribute("cv-if");n.removeAttribute("cv-if");const r=document.createComment("cv-if");n.replaceWith(r),i.push({condition:l,template:n,anchor:r});let g=a+1;for(;g<s.length;){const T=s[g];if(T.nodeType===3&&((($=T.textContent)==null?void 0:$.trim())??"")===""){g++;continue}if(T.nodeType!==1)break;const F=T;if(F.hasAttribute("cv-else-if")){const j=F.getAttribute("cv-else-if");F.removeAttribute("cv-else-if");const U=document.createComment("cv-else-if");F.replaceWith(U),i.push({condition:j,template:F,anchor:U}),g++;continue}if(F.hasAttribute("cv-else")){F.removeAttribute("cv-else");const j=document.createComment("cv-else");F.replaceWith(j),i.push({condition:null,template:F,anchor:j}),g++;break}break}a=g;let m=null,u=!1,h=!1;const v=async()=>{var T,F;if(u){h=!0;return}u=!0;try{do{h=!1,m&&((T=m.parentNode)==null||T.removeChild(m),m=null);for(const j of i)if(j.condition===null||W(j.condition,t)){const U=j.template.cloneNode(!0),N=document.createDocumentFragment();N.appendChild(U),await te(N,t,o);const D=N.firstChild??U;(F=j.anchor.parentNode)==null||F.insertBefore(N,j.anchor.nextSibling),m=D;break}}while(h)}finally{u=!1}};i.filter(T=>T.condition).forEach(T=>{J(T.condition,o,v)}),await v();continue}if(n.hasAttribute("cv-show")){const i=n.getAttribute("cv-show");n.removeAttribute("cv-show");const l=Array.from(n.attributes).filter(r=>r.name==="cv-transition"||r.name.startsWith("cv-transition:")||r.name.startsWith("cv-transition."));if(l.length>0){const r=D=>(n.getAttribute(D)??"").split(" ").filter(Boolean),g=r("cv-transition:enter"),m=r("cv-transition:enter-start"),u=r("cv-transition:enter-end"),h=r("cv-transition:leave"),v=r("cv-transition:leave-start"),T=r("cv-transition:leave-end"),F=n.getAttribute("cv-transition")??"",j=new Set(F.split(".").slice(1)),U=[...j].find(D=>/^\d+$/.test(D)),N=U?parseInt(U):200;if(g.length||m.length||h.length||v.length){l.forEach(V=>n.removeAttribute(V.name));const D=()=>new Promise(V=>requestAnimationFrame(()=>requestAnimationFrame(()=>V())));let G=!!W(i,t),q=!1,H=null;const K=async V=>{if(q){H=V;return}q=!0;try{V?(n.style.display="",n.classList.add(...g,...m),await D(),n.classList.remove(...m),n.classList.add(...u),await ce(n),n.classList.remove(...g,...u)):(n.classList.add(...h,...v),await D(),n.classList.remove(...v),n.classList.add(...T),await ce(n),n.classList.remove(...h,...T),n.style.display="none"),G=V}finally{if(q=!1,H!==null&&H!==G){const B=H;H=null,K(B)}else H=null}};G||(n.style.display="none"),J(i,o,()=>{const V=!!W(i,t);V!==G&&K(V)})}else{const D=[...j].find(B=>B==="scale"||/^scale$/.test(B)),G=(()=>{const B=[...j].find(de=>/^\d+$/.test(de)&&de!==U);return B?parseInt(B)/100:.9})(),q=[];(!j.has("scale")||j.has("opacity"))&&q.push(`opacity ${N}ms ease`),D&&q.push(`transform ${N}ms ease`),q.length||q.push(`opacity ${N}ms ease`),n.style.transition=(n.style.transition?n.style.transition+", ":"")+q.join(", "),l.forEach(B=>n.removeAttribute(B.name));let H=!!W(i,t);const K=()=>new Promise(B=>requestAnimationFrame(()=>requestAnimationFrame(()=>B()))),V=async B=>{B?(n.style.display="",n.style.opacity="0",D&&(n.style.transform=`scale(${G})`),await K(),n.style.opacity="",D&&(n.style.transform=""),await ce(n)):(n.style.opacity="0",D&&(n.style.transform=`scale(${G})`),await ce(n),n.style.display="none",n.style.opacity="",D&&(n.style.transform="")),H=B};H||(n.style.display="none"),J(i,o,()=>{const B=!!W(i,t);B!==H&&V(B)})}}else{const r=n.getAttribute("cv-show-transition"),g=n.getAttribute(":transition");r&&n.removeAttribute("cv-show-transition"),g&&n.removeAttribute(":transition");const m=r??(g?String(W(g,t)):null);if(m){Ye();let u=!!W(i,t);u||(n.style.display="none");let h=!1,v=null;const T=async F=>{if(h){v=F;return}h=!0;try{F?(n.style.display="",n.classList.add(`${m}-enter`),await ce(n),n.classList.remove(`${m}-enter`)):(n.classList.add(`${m}-leave`),await ce(n),n.classList.remove(`${m}-leave`),n.style.display="none"),u=F}finally{if(h=!1,v!==null&&v!==u){const j=v;v=null,T(j)}else v=null}};J(i,o,()=>{const F=!!W(i,t);F!==u&&T(F)})}else{const u=()=>{n.style.display=W(i,t)?"":"none"};J(i,o,u),u()}}}if(n.hasAttribute("cv-focus")){const i=n.getAttribute("cv-focus")??"";if(n.removeAttribute("cv-focus"),!i)Promise.resolve().then(()=>n.focus());else{const l=()=>{W(i,t)&&Promise.resolve().then(()=>n.focus())};J(i,o,l),l()}}{const i=Array.from(n.attributes).filter(l=>l.name==="cv-intersect"||l.name.startsWith("cv-intersect:")||l.name.startsWith("cv-intersect."));if(i.length&&typeof IntersectionObserver<"u"){const l=i.find(D=>D.name==="cv-intersect"||D.name==="cv-intersect:enter"||D.name.startsWith("cv-intersect.")),r=i.find(D=>D.name==="cv-intersect:leave"),g=(l==null?void 0:l.value)??"",m=(r==null?void 0:r.value)??"",u=((l==null?void 0:l.name)??"cv-intersect").split("."),h=new Set(u.slice(1)),v=h.has("once");let T=0;if(h.has("half"))T=.5;else if(h.has("full"))T=1;else{const D=[...h].find(G=>G.startsWith("threshold-"));D&&(T=parseInt(D.replace("threshold-",""))/100)}const F=[...h].find(D=>D.startsWith("margin-")),j=F?`${F.replace("margin-","")}px`:void 0;i.forEach(D=>n.removeAttribute(D.name));const U=D=>{if(D)try{new Function("$data",`with($data){${D}}`)(t)}catch(G){console.warn(`[courvux] cv-intersect error "${D}":`,G)}},N=new IntersectionObserver(D=>{D.forEach(G=>{G.isIntersecting?(U(g),v&&N.disconnect()):U(m)})},{threshold:T,...j?{rootMargin:j}:{}});N.observe(n),(C=o.registerCleanup)==null||C.call(o,()=>N.disconnect())}}{const i=Array.from(n.attributes).find(l=>l.name==="cv-html"||l.name.startsWith("cv-html."));if(i){const l=i.value;n.removeAttribute(i.name);const r=i.name.split(".").slice(1).includes("sanitize"),g=()=>{const m=String(W(l,t)??"");n.innerHTML=r?Tt(m):m};J(l,o,g),g(),a++;continue}}if(n.hasAttribute("cv-ref")&&!((L=o.components)!=null&&L[y])){const i=n.getAttribute("cv-ref");n.removeAttribute("cv-ref"),o.refs&&(o.refs[i]=n)}const x=!!((_=o.components)!=null&&_[y]),A=Array.from(n.attributes).find(i=>i.name==="cv-model"||i.name.startsWith("cv-model."));if(A&&!x){const i=A.value;n.removeAttribute(A.name);const l=new Set(A.name.split(".").slice(1)),r=n,g=(M=r.type)==null?void 0:M.toLowerCase(),m=u=>{if(l.has("number")){const h=parseFloat(u);return isNaN(h)?u:h}return l.has("trim")?u.trim():u};if(g==="checkbox"){const u=()=>{const h=W(i,t);r.checked=Array.isArray(h)?h.includes(r.value):!!h};J(i,o,u),u(),r.addEventListener("change",()=>{const h=W(i,t);if(Array.isArray(h)){const v=[...h];if(r.checked)v.includes(r.value)||v.push(r.value);else{const T=v.indexOf(r.value);T>-1&&v.splice(T,1)}pe(i,t,v)}else pe(i,t,r.checked)})}else if(g==="radio"){const u=()=>{r.checked=W(i,t)===r.value};J(i,o,u),u(),r.addEventListener("change",()=>{r.checked&&pe(i,t,m(r.value))})}else if(n.hasAttribute("contenteditable")){const u=n,h=()=>{const v=String(W(i,t)??"");u.innerText!==v&&(u.innerText=v)};if(J(i,o,h),h(),l.has("debounce")){const v=[...l].find(j=>/^\d+$/.test(j)),T=v?parseInt(v):300;let F;u.addEventListener("input",()=>{clearTimeout(F),F=setTimeout(()=>pe(i,t,m(u.innerText)),T)})}else{const v=l.has("lazy")?"blur":"input";u.addEventListener(v,()=>pe(i,t,m(u.innerText)))}}else{const u=()=>{r.value=W(i,t)??""};if(J(i,o,u),u(),l.has("debounce")){const h=[...l].find(F=>/^\d+$/.test(F)),v=h?parseInt(h):300;let T;r.addEventListener("input",()=>{clearTimeout(T),T=setTimeout(()=>pe(i,t,m(r.value)),v)})}else{const h=y==="select"||l.has("lazy")?"change":"input";r.addEventListener(h,()=>pe(i,t,m(r.value)))}}}if(o.directives&&Array.from(n.attributes).forEach(i=>{var U,N;if(!i.name.startsWith("cv-"))return;const l=i.name.slice(3).split("."),r=l[0],g=l.slice(1),m=r.indexOf(":"),u=m>=0?r.slice(0,m):r,h=m>=0?r.slice(m+1):void 0,v=o.directives[u];if(!v)return;const T=i.value;n.removeAttribute(i.name);const F=typeof v=="function"?{onMount:v}:v,j={value:T?W(T,t):void 0,arg:h,modifiers:Object.fromEntries(g.map(D=>[D,!0]))};(U=F.onMount)==null||U.call(F,n,j),F.onUpdate&&T&&J(T,o,()=>{j.value=W(T,t),F.onUpdate(n,j)}),F.onDestroy&&((N=o.registerCleanup)==null||N.call(o,()=>F.onDestroy(n,j)))}),y==="slot"){const i=n.getAttribute("name")??"default",l=(z=o.slots)==null?void 0:z[i];if(l){const r={};Array.from(n.attributes).forEach(u=>{u.name.startsWith(":")&&(r[u.name.slice(1)]=W(u.value,t))});const g=await l(r),m=document.createDocumentFragment();g.forEach(u=>m.appendChild(u)),n.replaceWith(m)}else{const r=document.createDocumentFragment();for(;n.firstChild;)r.appendChild(n.firstChild);await te(r,t,o),n.replaceWith(r)}a++;continue}if(y==="cv-transition"){Ye();const i=n.getAttribute("name")??"fade",l=n.getAttribute(":show")??null;n.removeAttribute("name"),l&&n.removeAttribute(":show");const r=document.createElement("div");for(r.className="cv-t-wrap";n.firstChild;)r.appendChild(n.firstChild);if(n.replaceWith(r),await te(r,t,o),l){let g=!!W(l,t),m=!1,u=null;g||(r.style.display="none");const h=async v=>{if(m){u=v;return}m=!0;try{v?(r.style.display="",r.classList.add(`${i}-enter`),await ce(r),r.classList.remove(`${i}-enter`)):(r.classList.add(`${i}-leave`),await ce(r),r.classList.remove(`${i}-leave`),r.style.display="none"),g=v}finally{if(m=!1,u!==null&&u!==g){const T=u;u=null,h(T)}else u=null}};J(l,o,()=>{const v=!!W(l,t);v!==g&&h(v)})}a++;continue}if(y==="router-view"&&o.mountRouterView){const i=n.getAttribute("name")??void 0;n.setAttribute("aria-live","polite"),n.setAttribute("aria-atomic","true"),await o.mountRouterView(n,i),a++;continue}if(y==="router-link"){const i=n.getAttribute(":to"),l=n.getAttribute("to"),r=()=>i?String(W(i,t)??"/"):l||"/",g=D=>String(D).replace(/[&"<>]/g,G=>({"&":"&amp;",'"':"&quot;","<":"&lt;",">":"&gt;"})[G]);let m="";Array.from(n.attributes).forEach(D=>{D.name==="to"||D.name===":to"||(m+=` ${D.name}="${g(D.value)}"`)});const u=document.createElement("div");u.innerHTML=`<a${m}></a>`;const h=u.firstElementChild;for(;n.firstChild;)h.appendChild(n.firstChild);const v=((O=o.router)==null?void 0:O.base)??"",T=D=>v?D===v?"/":D.startsWith(v+"/")?D.slice(v.length)||"/":D||"/":D||"/",F=()=>{var D;return((D=o.router)==null?void 0:D.mode)==="history"?T(window.location.pathname):window.location.hash.slice(1)||"/"},j=()=>{var q;const D=r(),G=F()===D;((q=o.router)==null?void 0:q.mode)==="history"?h.href=`${v}${D}`:h.href=`#${D}`,G?(h.setAttribute("aria-current","page"),h.classList.add("active")):(h.removeAttribute("aria-current"),h.classList.remove("active"))};((R=o.router)==null?void 0:R.mode)==="history"?(h.addEventListener("click",D=>{D.preventDefault(),o.router.navigate(r())}),window.addEventListener("popstate",j)):window.addEventListener("hashchange",j),i&&J(i,o,j),j();const U=document.createDocumentFragment();U.appendChild(h),await te(U,t,o);const N=U.firstChild??h;n.replaceWith(N),a++;continue}if(y==="component"&&n.hasAttribute(":is")&&o.mountDynamic){const i=n.getAttribute(":is");n.removeAttribute(":is");const l=document.createComment("component:is");n.replaceWith(l),await o.mountDynamic(l,i,n,t,o),a++;continue}if((E=o.components)!=null&&E[y]&&o.mountElement){await o.mountElement(n,y,t,o),a++;continue}{const i=Array.from(n.attributes).find(l=>l.name==="cv-intersect"||l.name.startsWith("cv-intersect."));if(i&&typeof IntersectionObserver<"u"){const l=new Set(i.name.split(".").slice(1));n.removeAttribute(i.name);const r=W(i.value,t);let g,m=0,u="0px",h=l.has("once");if(typeof r=="function"?g=v=>r.call(t,v):r&&typeof r=="object"&&(typeof r.handler=="function"&&(g=v=>r.handler.call(t,v)),r.threshold!==void 0&&(m=r.threshold),r.margin&&(u=r.margin),r.once&&(h=!0)),g){const v=new IntersectionObserver(T=>{const F=T[0];g(F),h&&F.isIntersecting&&v.disconnect()},{threshold:m,rootMargin:u});v.observe(n),(c=o.registerCleanup)==null||c.call(o,()=>v.disconnect())}}}if(n.hasAttribute("cv-resize")){const i=n.getAttribute("cv-resize");if(n.removeAttribute("cv-resize"),typeof ResizeObserver<"u"){const l=W(i,t);let r,g="content-box";if(typeof l=="function"?r=m=>l.call(t,m):l&&typeof l=="object"&&(typeof l.handler=="function"&&(r=m=>l.handler.call(t,m)),l.box&&(g=l.box)),r){const m=new ResizeObserver(u=>{u[0]&&r(u[0])});m.observe(n,{box:g}),(d=o.registerCleanup)==null||d.call(o,()=>m.disconnect())}}}if(n.hasAttribute("cv-scroll")){const i=n.getAttribute("cv-scroll");n.removeAttribute("cv-scroll");const l=W(i,t);let r,g=0;if(typeof l=="function"?r=m=>l.call(t,m):l&&typeof l=="object"&&(typeof l.handler=="function"&&(r=m=>l.handler.call(t,m)),l.throttle&&(g=l.throttle)),r){let m=0;const u=()=>{const h=Date.now();g>0&&h-m<g||(m=h,r({scrollTop:n.scrollTop,scrollLeft:n.scrollLeft,scrollHeight:n.scrollHeight,scrollWidth:n.scrollWidth,clientHeight:n.clientHeight,clientWidth:n.clientWidth}))};n.addEventListener("scroll",u,{passive:!0}),(p=o.registerCleanup)==null||p.call(o,()=>n.removeEventListener("scroll",u))}}if(n.hasAttribute("cv-clickoutside")){const i=n.getAttribute("cv-clickoutside");n.removeAttribute("cv-clickoutside");const l=r=>{n.contains(r.target)||(typeof t[i]=="function"?t[i].call(t,r):Ve(i,t,r))};document.addEventListener("click",l,!0),(w=o.registerCleanup)==null||w.call(o,()=>document.removeEventListener("click",l,!0))}if(n.hasAttribute("cv-bind")){const i=n.getAttribute("cv-bind");n.removeAttribute("cv-bind");const l=n.getAttribute("class")??"",r=n.getAttribute("style")??"";let g=[];const m=()=>{const u=W(i,t)??{},h=Object.keys(u);for(const v of g)v in u||(v==="class"?n.className=l:v==="style"?n.style.cssText=r:n.removeAttribute(v));for(const[v,T]of Object.entries(u))if(v==="class")n.className=[l,Me(T)].filter(Boolean).join(" ");else if(v==="style")Be(n,T,r);else if(T==null||T===!1)try{n.removeAttribute(v)}catch{}else try{n.setAttribute(v,T===!0?"":String(T))}catch(F){console.warn(`[courvux] cv-bind: skipping invalid attribute name "${v}":`,F)}g=h};J(i,o,m),m()}const P={enter:"Enter",esc:"Escape",escape:"Escape",space:" ",tab:"Tab",delete:"Delete",backspace:"Backspace",up:"ArrowUp",down:"ArrowDown",left:"ArrowLeft",right:"ArrowRight"};Array.from(n.attributes).forEach(i=>{if(i.name.startsWith("@")||i.name.startsWith("cv:on:")){const l=(i.name.startsWith("@")?i.name.substring(1):i.name.substring(6)).split("."),r=l[0],g=new Set(l.slice(1)),m=[...g].find(T=>T in P),u=i.value,h=T=>{g.has("prevent")&&T.preventDefault(),g.has("stop")&&T.stopPropagation(),!(g.has("self")&&T.target!==T.currentTarget)&&(m&&T.key!==P[m]||(typeof t[u]=="function"?t[u].call(t,T):Ve(u,t,T)))},v={};g.has("once")&&(v.once=!0),g.has("passive")&&(v.passive=!0),g.has("capture")&&(v.capture=!0),n.addEventListener(r,h,Object.keys(v).length?v:void 0)}else if(i.name.startsWith(":")){const l=i.name.slice(1),r=i.value;if(l==="class"){const g=n.getAttribute("class")??"",m=()=>{n.className=[g,Me(W(r,t))].filter(Boolean).join(" ")};J(r,o,m),m()}else if(l==="style"){const g=n.getAttribute("style")??"",m=()=>Be(n,W(r,t),g);J(r,o,m),m()}else if(l.includes("-")){const g=()=>{const m=W(r,t);m==null||m===!1?n.removeAttribute(l):n.setAttribute(l,m===!0?"":String(m))};J(r,o,g),g()}else{const g=()=>{n[l]=W(r,t)??""};J(r,o,g),g()}}}),S.hasChildNodes()&&await te(S,t,o),a++}}var _t=`
router-view.fade-leave{animation:cv-fade-out 0.25s forwards}
router-view.fade-enter{animation:cv-fade-in 0.25s forwards}
router-view.slide-up-leave{animation:cv-slide-up-out 0.25s forwards}
router-view.slide-up-enter{animation:cv-slide-up-in 0.25s forwards}
@keyframes cv-fade-out{to{opacity:0}}
@keyframes cv-fade-in{from{opacity:0}}
@keyframes cv-slide-up-out{to{opacity:0;transform:translateY(-12px)}}
@keyframes cv-slide-up-in{from{opacity:0;transform:translateY(12px)}}
`;function $t(){if(document.getElementById("cv-transitions"))return;const e=document.createElement("style");e.id="cv-transitions",e.textContent=_t,document.head.appendChild(e)}async function ye(e,t,o){e.classList.add(`${t}-${o}`);const s=getComputedStyle(e),a=Math.max(parseFloat(s.animationDuration)||0,parseFloat(s.transitionDuration)||0)*1e3;a>0&&await new Promise(b=>{const k=()=>b();e.addEventListener("animationend",k,{once:!0}),e.addEventListener("transitionend",k,{once:!0}),setTimeout(k,a+50)}),e.classList.remove(`${t}-${o}`)}var Se=new Map;async function Ot(e){if(typeof e!="function")return e;if(Se.has(e))return Se.get(e);const t=await e();return Se.set(e,t.default),t.default}function Je(e,t){if(e.components)return e.components[t];if(t==="default")return e.component}function Ze(e,t){if(e==="*")return{};const o=[],s=e.replace(/:(\w+)/g,(b,k)=>(o.push(k),"([^/]+)")),a=t.match(new RegExp(`^${s}$`));return a?Object.fromEntries(o.map((b,k)=>[b,a[k+1]])):null}function Ft(e,t){if(e==="/")return{params:{},remaining:t};const o=[],s=e.replace(/:(\w+)/g,(b,k)=>(o.push(k),"([^/]+)")),a=t.match(new RegExp(`^${s}(/.+)?$`));return a?{params:Object.fromEntries(o.map((b,k)=>[b,a[k+1]])),remaining:a[o.length+1]||"/"}:null}function ft(e,t=""){return e.map(o=>{var a;if(o.path==="*")return o;const s=((t.endsWith("/")?t.slice(0,-1):t)+o.path).replace(/\/+/g,"/")||"/";return(a=o.children)!=null&&a.length?{...o,path:s,children:ft(o.children,s==="/"?"":s)}:{...o,path:s}})}var fe=(e,t)=>new Promise(o=>e(t,o)),Ke=(e,t)=>e!=null&&e.beforeLeave?new Promise(o=>e.beforeLeave(t,o)):Promise.resolve(void 0);function jt(e,t={}){const o=t.mode??"hash",s=Pt(t.base??"");return{routes:ft(e),mode:o,base:s,transition:t.transition,beforeEach:t.beforeEach,afterEach:t.afterEach,scrollBehavior:t.scrollBehavior,navigate(a,b){const k=Qe(a,b==null?void 0:b.query);o==="history"?(history.pushState({},"",`${s}${k}`),window.dispatchEvent(new PopStateEvent("popstate"))):window.location.hash=k},replace(a,b){const k=Qe(a,b==null?void 0:b.query);if(o==="history")history.replaceState({},"",`${s}${k}`),window.dispatchEvent(new PopStateEvent("popstate"));else{const f=window.location.href.split("#")[0];window.location.replace(`${f}#${k}`)}},back(){history.back()},forward(){history.forward()}}}function Pt(e){if(!e||e==="/")return"";let t=e.startsWith("/")?e:`/${e}`;return t.endsWith("/")&&(t=t.slice(0,-1)),t}function Dt(e,t){return t?e===t?"/":e.startsWith(t+"/")?e.slice(t.length)||"/":e||"/":e||"/"}function Qe(e,t){return!t||!Object.keys(t).length?e:`${e}?${new URLSearchParams(t).toString()}`}function et(e){if(!e)return{};const t=new URLSearchParams(e.startsWith("?")?e.slice(1):e),o={};return t.forEach((s,a)=>{o[a]=s}),o}function tt(e,t,o,s="default",a){const b=t.base??"",k=p=>p.length>1&&p.endsWith("/")?p.slice(0,-1):p,f=()=>t.mode==="history"?k(Dt(window.location.pathname,b)):k((window.location.hash.slice(1)||"/").split("?")[0]||"/"),I=()=>{if(t.mode==="history")return et(window.location.search);const p=window.location.hash.slice(1)||"/",w=p.indexOf("?");return w>=0?et(p.slice(w+1)):{}};t.transition&&$t();let $=null,C=null,L=null,_=null,M=!1;const z=()=>{M||(M=!0,a==null||a())},O=new Map,R=p=>{var w;if(p!=null&&p.keepAlive&&L){(w=L.deactivate)==null||w.call(L);const S=document.createDocumentFragment();for(;e.firstChild;)S.appendChild(e.firstChild);O.set($.path,{fragment:S,activation:L}),L=null}else L==null||L.destroy(),L=null,e.innerHTML=""},E=async(p,w,S,n,y)=>{const x=typeof w=="function"&&!Se.has(w),A=x?w.__asyncOptions:void 0,P=p.loadingTemplate??(A==null?void 0:A.loadingTemplate);x&&P&&(e.innerHTML=P);let i;try{i=await Ot(w)}catch(l){const r=A==null?void 0:A.errorTemplate;if(r)return e.innerHTML=r,{destroy:()=>{e.innerHTML=""}};throw l}return x&&P&&(e.innerHTML=""),o(e,i,S,n,y)},c=async()=>{var S,n,y,x,A,P,i,l;const p=f(),w=I();for(const r of t.routes){if((S=r.children)!=null&&S.length){const m=Ft(r.path,p);if(m!==null)for(const u of r.children){const h=Ze(u.path,p);if(h!==null){const v={params:m.params,query:w,path:p,meta:r.meta};if(u.redirect){const U={params:h,query:w,path:p,meta:u.meta},N=typeof u.redirect=="function"?u.redirect(U):u.redirect;t.navigate(N);return}if(t.beforeEach){const U=await fe(t.beforeEach,v);if(U){t.navigate(U);return}}if(r.beforeEnter){const U=await fe(r.beforeEnter,v);if(U){t.navigate(U);return}}if(u.beforeEnter){const U={params:h,query:w,path:p,meta:u.meta},N=await fe(u.beforeEnter,U);if(N){t.navigate(N);return}}const T=`${r.path}::${JSON.stringify(m.params)}`;if(_!==T){const U=await Ke(L,v);if(U){t.navigate(U);return}const N=r.transition??t.transition;N&&e.hasChildNodes()&&await ye(e,N,"leave"),R(C);const D=Je(r,s);if(D){const G={routes:r.children,mode:t.mode,base:t.base,transition:r.transition??t.transition,beforeEach:t.beforeEach,afterEach:t.afterEach,scrollBehavior:t.scrollBehavior,navigate:(q,H)=>t.navigate(q,H),replace:(q,H)=>t.replace(q,H),back:()=>t.back(),forward:()=>t.forward()};L=await E(r,D,v,s==="default"?r.layout:void 0,s==="default"?G:void 0),(n=L.enter)==null||n.call(L,$)}else e.innerHTML="";_=T,N&&await ye(e,N,"enter")}const F={params:{...m.params,...h},query:w,path:p,meta:u.meta??r.meta};(y=t.afterEach)==null||y.call(t,F,$);const j=(x=t.scrollBehavior)==null?void 0:x.call(t,F,$);j&&window.scrollTo(j.x??0,j.y??0),$=F,C=r,z();return}}}const g=Ze(r.path,p);if(g!==null){_=null;const m={params:g,query:w,path:p,meta:r.meta};if(r.redirect){const F=typeof r.redirect=="function"?r.redirect(m):r.redirect;t.navigate(F);return}if(t.beforeEach){const F=await fe(t.beforeEach,m);if(F){t.navigate(F);return}}if(r.beforeEnter){const F=await fe(r.beforeEnter,m);if(F){t.navigate(F);return}}const u=await Ke(L,m);if(u){t.navigate(u);return}const h=r.transition??t.transition;h&&e.hasChildNodes()&&await ye(e,h,"leave"),R(C);const v=Je(r,s);if(v){const F=m.path;if(r.keepAlive&&O.has(F)){const j=O.get(F);e.appendChild(j.fragment),L=j.activation,(A=L.activate)==null||A.call(L),O.delete(F)}else{const j=$;L=await E(r,v,m,s==="default"?r.layout:void 0),(P=L.enter)==null||P.call(L,j)}}else e.innerHTML="",L=null;h&&await ye(e,h,"enter"),(i=t.afterEach)==null||i.call(t,m,$);const T=(l=t.scrollBehavior)==null?void 0:l.call(t,m,$);T&&window.scrollTo(T.x??0,T.y??0),$=m,C=r,z();return}}_=null,R(C),C=null,z()},d=t.mode==="history"?"popstate":"hashchange";return window.addEventListener(d,c),c(),()=>{window.removeEventListener(d,c),L==null||L.destroy(),L=null,O.forEach(({activation:p})=>p.destroy()),O.clear()}}function It(){if(typeof window>"u")return null;if(window.__COURVUX_DEVTOOLS__)return window.__COURVUX_DEVTOOLS__;const e=new Map,t={instances:[],stores:[],on(o,s){return e.has(o)||e.set(o,new Set),e.get(o).add(s),()=>{var a;return(a=e.get(o))==null?void 0:a.delete(s)}},_emit(o,s){var a;(a=e.get(o))==null||a.forEach(b=>{try{b(s)}catch{}})},_registerInstance(o){this.instances.push(o),this._emit("mount",o)},_unregisterInstance(o){const s=this.instances.findIndex(a=>a.id===o);if(s!==-1){const a=this.instances[s];this.instances.splice(s,1),this._emit("destroy",a)}},_registerStore(o){this.stores.push(o),o.subscribe(()=>this._emit("store-update",o))}};return window.__COURVUX_DEVTOOLS__=t,t}var Lt=0;function Mt(){return++Lt}var Rt=`
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
`;function zt(){if(document.getElementById("cvd-styles"))return;const e=document.createElement("style");e.id="cvd-styles",e.textContent=Rt,document.head.appendChild(e)}function xe(e){return e===null?"null":e===void 0?"undefined":typeof e=="string"?`"${e}"`:typeof e=="object"?JSON.stringify(e):String(e)}function ot(e){try{return JSON.parse(e)}catch{return e}}function Ht(e){if(typeof document>"u")return;zt();const t=document.createElement("div");t.id="cvd",document.body.appendChild(t);let o=!1,s="components",a=new Set;const b=document.createElement("div");b.id="cvd-badge",b.innerHTML='<span class="cvd-badge-dot"></span>COURVUX',t.appendChild(b);const k=document.createElement("div");k.id="cvd-panel",k.style.display="none",t.appendChild(k),k.innerHTML=`
        <div id="cvd-head">
            <span id="cvd-title">⚡ COURVUX DEVTOOLS</span>
            <div id="cvd-tabs">
                <button class="cvd-tab active" data-tab="components">Components</button>
                <button class="cvd-tab" data-tab="store">Store</button>
            </div>
            <button id="cvd-close">✕</button>
        </div>
        <div id="cvd-body"></div>
    `;const f=k.querySelector("#cvd-body");b.addEventListener("click",()=>{o=!0,b.style.display="none",k.style.display="flex",L()}),k.querySelector("#cvd-close").addEventListener("click",()=>{o=!1,k.style.display="none",b.style.display=""}),k.querySelectorAll(".cvd-tab").forEach(_=>{_.addEventListener("click",()=>{s=_.dataset.tab,k.querySelectorAll(".cvd-tab").forEach(M=>M.classList.remove("active")),_.classList.add("active"),L()})});const I=k.querySelector("#cvd-head");I.addEventListener("pointerdown",_=>{if(_.target.closest("button"))return;I.setPointerCapture(_.pointerId);const M=_.clientX,z=_.clientY,O=t.offsetLeft,R=t.offsetTop,E=d=>{t.style.right="auto",t.style.bottom="auto",t.style.left=`${O+(d.clientX-M)}px`,t.style.top=`${R+(d.clientY-z)}px`},c=d=>{I.releasePointerCapture(d.pointerId),I.removeEventListener("pointermove",E),I.removeEventListener("pointerup",c),I.removeEventListener("pointercancel",c)};I.addEventListener("pointermove",E),I.addEventListener("pointerup",c),I.addEventListener("pointercancel",c)});function $(){const _=e.instances;if(!_.length){f.innerHTML='<div class="cvd-empty">No hay componentes montados</div>';return}f.innerHTML=_.map(M=>{const z=M.getState(),O=Object.keys(z);return`
                <div class="cvd-inst${a.has(M.id)?" open":""}" data-id="${M.id}">
                    <div class="cvd-inst-head">
                        <span class="cvd-arrow">▶</span>
                        <span class="cvd-inst-name">&lt;${M.name}&gt;</span>
                        <span class="cvd-count">${O.length} keys</span>
                        <span class="cvd-inst-id">#${M.id}</span>
                    </div>
                    <div class="cvd-kv">
                        ${O.length?O.map(R=>`
                            <div class="cvd-row">
                                <span class="cvd-key">${R}</span>
                                <span class="cvd-val" data-inst="${M.id}" data-key="${R}" title="click to edit">${xe(z[R])}</span>
                            </div>
                        `).join(""):'<span style="color:#555">— sin datos reactivos —</span>'}
                    </div>
                </div>
            `}).join(""),f.querySelectorAll(".cvd-inst-head").forEach(M=>{M.addEventListener("click",()=>{const z=M.closest(".cvd-inst"),O=parseInt(z.dataset.id);a.has(O)?a.delete(O):a.add(O),z.classList.toggle("open")})}),f.querySelectorAll(".cvd-val").forEach(M=>{M.addEventListener("click",z=>{z.stopPropagation();const O=M;if(O.querySelector("input"))return;const R=parseInt(O.dataset.inst),E=O.dataset.key,c=e.instances.find(S=>S.id===R);if(!c)return;const d=xe(c.getState()[E]);O.classList.add("editing"),O.innerHTML=`<input class="cvd-edit" value='${d.replace(/'/g,"&#39;")}'>`;const p=O.querySelector("input");p.focus(),p.select();const w=()=>{c.setState(E,ot(p.value)),O.classList.remove("editing")};p.addEventListener("blur",w),p.addEventListener("keydown",S=>{S.key==="Enter"&&(S.preventDefault(),w()),S.key==="Escape"&&(O.classList.remove("editing"),L())})})})}function C(){if(!e.stores.length){f.innerHTML='<div class="cvd-empty">No hay store registrado</div>';return}f.innerHTML=e.stores.map((_,M)=>{const z=_.getState(),O=Object.keys(z);return`
                <div class="cvd-inst open" data-store="${M}">
                    <div class="cvd-inst-head">
                        <span class="cvd-arrow" style="transform:rotate(90deg)">▶</span>
                        <span class="cvd-inst-name" style="color:#ffcb6b">Store</span>
                        <span class="cvd-count">${O.length} keys</span>
                    </div>
                    <div class="cvd-kv">
                        ${O.map(R=>`
                            <div class="cvd-row">
                                <span class="cvd-key cvd-store-key">${R}</span>
                                <span class="cvd-val" data-store="${M}" data-key="${R}" title="click to edit">${xe(z[R])}</span>
                            </div>
                        `).join("")}
                    </div>
                </div>
            `}).join(""),f.querySelectorAll(".cvd-inst-head").forEach(_=>{_.addEventListener("click",()=>_.closest(".cvd-inst").classList.toggle("open"))}),f.querySelectorAll("[data-store][data-key]").forEach(_=>{_.addEventListener("click",M=>{M.stopPropagation();const z=_;if(z.querySelector("input"))return;const O=parseInt(z.dataset.store),R=z.dataset.key,E=e.stores[O];if(!E)return;const c=xe(E.getState()[R]);z.classList.add("editing"),z.innerHTML=`<input class="cvd-edit" value='${c.replace(/'/g,"&#39;")}'>`;const d=z.querySelector("input");d.focus(),d.select();const p=()=>{E.setState(R,ot(d.value)),z.classList.remove("editing")};d.addEventListener("blur",p),d.addEventListener("keydown",w=>{w.key==="Enter"&&(w.preventDefault(),p()),w.key==="Escape"&&(z.classList.remove("editing"),L())})})})}function L(){o&&(s==="components"?$():C())}e.on("mount",()=>L()),e.on("update",()=>L()),e.on("destroy",()=>L()),e.on("store-update",()=>L())}var Nt="__COURVUX_HEAD_COLLECTOR__";function Wt(){return globalThis[Nt]??null}var Ut=(e,t)=>{Object.entries(t).forEach(([o,s])=>{o!=="innerHTML"&&(s==null||s===!1||e.setAttribute(o,s===!0?"":String(s)))})},qt=e=>{const t={};return Array.from(e.attributes).forEach(o=>{t[o.name]=o.value}),t},Bt=(e,t)=>{Array.from(e.attributes).forEach(o=>e.removeAttribute(o.name)),Object.entries(t).forEach(([o,s])=>e.setAttribute(o,s))},nt=(e,t,o,s)=>{let a=o?document.head.querySelector(o):null;a?(s.push({el:a,prevAttrs:qt(a),created:!1}),Array.from(a.attributes).forEach(b=>a.removeAttribute(b.name))):(a=document.createElement(e),document.head.appendChild(a),s.push({el:a,created:!0})),Ut(a,t)};function Vt(e){var k,f,I;const t=Wt();if(t!==null)return t.push(e),()=>{};if(typeof document>"u")return()=>{};const o=[];let s;const a={},b={};if(e.title!==void 0){s=document.title;const $=e.titleTemplate,C=typeof $=="function"?$(e.title):typeof $=="string"?$.replace("%s",e.title):e.title;document.title=C}return(k=e.meta)==null||k.forEach($=>{nt("meta",$,$.name?`meta[name="${CSS.escape($.name)}"]`:$.property?`meta[property="${CSS.escape($.property)}"]`:$["http-equiv"]?`meta[http-equiv="${CSS.escape($["http-equiv"])}"]`:null,o)}),(f=e.link)==null||f.forEach($=>{nt("link",$,$.rel==="canonical"?'link[rel="canonical"]':$.rel&&$.href?`link[rel="${CSS.escape($.rel)}"][href="${CSS.escape($.href)}"]`:null,o)}),(I=e.script)==null||I.forEach($=>{const C=document.createElement("script");Object.entries($).forEach(([L,_])=>{L==="innerHTML"?C.textContent=String(_):_!=null&&_!==!1&&C.setAttribute(L,_===!0?"":String(_))}),document.head.appendChild(C),o.push({el:C,created:!0})}),e.htmlAttrs&&Object.entries(e.htmlAttrs).forEach(([$,C])=>{a[$]=document.documentElement.getAttribute($),document.documentElement.setAttribute($,C)}),e.bodyAttrs&&Object.entries(e.bodyAttrs).forEach(([$,C])=>{b[$]=document.body.getAttribute($),document.body.setAttribute($,C)}),function(){s!==void 0&&(document.title=s),o.forEach(({el:$,prevAttrs:C,created:L})=>{var _;L?(_=$.parentNode)==null||_.removeChild($):C&&Bt($,C)}),Object.entries(a).forEach(([$,C])=>{C===null?document.documentElement.removeAttribute($):document.documentElement.setAttribute($,C)}),Object.entries(b).forEach(([$,C])=>{C===null?document.body.removeAttribute($):document.body.setAttribute($,C)})}}var je="data-courvux-ssr",Gt=e=>e?Promise.resolve().then(e):Promise.resolve();function rt(e,t){const o=e.trim();if(o.startsWith("{")){const s=o.replace(/[{}]/g,"").split(",").map(a=>a.trim()).filter(Boolean);return Object.fromEntries(s.map(a=>[a,t[a]]))}return{[o]:t}}var we=e=>{if(e===null||typeof e!="object")return e;try{return structuredClone(e)}catch{return e}};async function ne(e,t,o){var w,S,n;const s={},{subscribe:a,createReactiveState:b,registerSetInterceptor:k,notifyAll:f}=Le();let I;if(typeof t.data=="function"?(t.loadingTemplate&&(e.innerHTML=t.loadingTemplate),I=await t.data()):I=t.data??{},t.templateUrl){const y=o.baseUrl?new URL(t.templateUrl,o.baseUrl).href:t.templateUrl,x=await fetch(y);if(!x.ok)throw new Error(`Failed to load template: ${y} (${x.status})`);e.innerHTML=await x.text()}else t.template&&(e.innerHTML=t.template);e.removeAttribute(je),(w=e.querySelector(`[${je}]`))==null||w.removeAttribute(je);const $={};if(t.inject&&o.provided){const y=Array.isArray(t.inject)?Object.fromEntries(t.inject.map(x=>[x,x])):t.inject;Object.entries(y).forEach(([x,A])=>{o.provided&&A in o.provided&&($[x]=o.provided[A])})}const C=b({...o.globalProperties??{},...I,...$,...t.methods,$refs:s,$el:e,...o.slots?{$slots:Object.fromEntries(Object.keys(o.slots).map(y=>[y,!0]))}:{},...o.store?{$store:o.store}:{},...o.currentRoute?{$route:o.currentRoute}:{},...o.router?{$router:o.router}:{}});C.$watch=(y,x,A)=>{const P=(A==null?void 0:A.deep)??!1,i=(A==null?void 0:A.immediate)??!1;let l=P?we(C[y]):C[y];const r=a(y,()=>{const g=C[y];x.call(C,g,l),l=P?we(g):g});return i&&x.call(C,C[y],void 0),r},C.$batch=St,C.$nextTick=y=>Gt(y),C.$dispatch=(y,x,A)=>{e.dispatchEvent(new CustomEvent(y,{bubbles:!0,composed:!0,...A??{},detail:x}))},o.magics&&Object.entries(o.magics).forEach(([y,x])=>{C[y]=x(C)}),C.$forceUpdate=()=>f();const L=[];C.$watchEffect=y=>{let x=[];const A=()=>{x.forEach(r=>r()),x=[];const i=He(()=>{try{y()}catch{}}),l=new Map;for(const{sub:r,key:g}of i)l.has(r)||l.set(r,new Set),!l.get(r).has(g)&&(l.get(r).add(g),x.push(r(g,A)))};A();const P=()=>{x.forEach(l=>l()),x=[];const i=L.indexOf(P);i>-1&&L.splice(i,1)};return L.push(P),P};const _=[];t.computed&&Object.entries(t.computed).forEach(([y,x])=>{const A=typeof x=="function"?x:x.get,P=typeof x!="function"?x.set:void 0;let i=[];const l=()=>{i.forEach(u=>u()),i=[];let r;const g=He(()=>{try{r=A.call(C)}catch(u){(t.debug??o.debug)&&console.warn("[courvux] computed error:",u)}});C[y]=r;const m=new Map;for(const{sub:u,key:h}of g)m.has(u)||m.set(u,new Set),!m.get(u).has(h)&&(m.get(u).add(h),i.push(u(h,l)))};l(),_.push(()=>i.forEach(r=>r())),P&&k(y,r=>P.call(C,r))});const M=[];t.watch&&Object.entries(t.watch).forEach(([y,x])=>{const A=typeof x=="object"&&x!==null&&"handler"in x,P=A?x.handler:x,i=A?x.immediate??!1:!1,l=A?x.deep??!1:!1;let r=l?we(C[y]):C[y];const g=a(y,()=>{const m=C[y];P.call(C,m,r),r=l?we(m):m});M.push(g),i&&P.call(C,C[y],void 0)});const z={...o.provided??{}};if(t.provide){const y=typeof t.provide=="function"?t.provide.call(C):t.provide;Object.assign(z,y)}const O={...o,provided:z,components:{...o.components,...t.components}};O.mountElement=Ce(O),O.createChildScope=(y,x)=>{const A=new Set(Object.keys(y)),P=new Set(Object.keys(x)),{subscribe:i,createReactiveState:l}=Le(),r=l(y);let g;return g=new Proxy({},{get(m,u){return typeof u!="string"?C[u]:A.has(u)?r[u]:P.has(u)?x[u].bind(g):C[u]},set(m,u,h){return typeof u!="string"?!1:A.has(u)?(r[u]=h,!0):(C[u]=h,!0)},has(m,u){return A.has(u)||P.has(u)||u in C},ownKeys(){return[...A,...P,...Object.keys(C)]},getOwnPropertyDescriptor(m,u){return A.has(u)||P.has(u)||u in C?{configurable:!0,enumerable:!0,writable:!0}:void 0}}),{state:g,subscribe:(m,u)=>A.has(m)?i(m,u):c(m,u),cleanup:()=>{}}},O.mountDynamic=async(y,x,A,P,i)=>{let l=null,r=null;const g=A.getAttribute("loading-template")??"",m=async()=>{var D,G,q;r==null||r(),r=null,l!=null&&l.parentNode&&(l.parentNode.removeChild(l),l=null);const u=W(x,P);if(!u)return;let h;if(typeof u=="function"){if(g){const H=document.createElement("div");H.innerHTML=g,(D=y.parentNode)==null||D.insertBefore(H,y.nextSibling),l=H}h=(await u()).default,l!=null&&l.parentNode&&(l.parentNode.removeChild(l),l=null)}else typeof u=="string"?h=(G=O.components)==null?void 0:G[u]:u&&typeof u=="object"&&(h=u);if(!h)return;const v=document.createElement("div"),T=H=>H.startsWith("@")||H.startsWith("cv:on:")||H.startsWith(":")||H.startsWith("cv-")||H.startsWith("v-slot");Array.from(A.attributes).forEach(H=>{T(H.name)||v.setAttribute(H.name,H.value)}),v.innerHTML=A.innerHTML;const F={},j={};Array.from(A.attributes).forEach(H=>{if(H.name.startsWith(":"))F[H.name.slice(1)]=W(H.value,P);else if(H.name.startsWith("@")||H.name.startsWith("cv:on:")){const K=H.value,V=H.name.startsWith("@")?H.name.slice(1):H.name.slice(6);j[V]=(...B)=>{typeof P[K]=="function"&&P[K].call(P,...B)}}});const U={...h,data:{...h.data,...F},methods:{...h.methods,$emit(H,...K){var V;gt(h,H,K),(V=j[H])==null||V.call(j,...K)}}},N={...O,components:{...O.components,...h.components}};N.mountElement=Ce(N),r=(await ne(v,U,N)).destroy,(q=y.parentNode)==null||q.insertBefore(v,y.nextSibling),l=v};J(x,i,m),await m()};const R=[];C.$addCleanup=y=>{R.push(y)};let E=!1;const c=(y,x)=>!t.onBeforeUpdate&&!t.onUpdated?a(y,x):a(y,()=>{var A;E||(E=!0,(A=t.onBeforeUpdate)==null||A.call(C),Promise.resolve().then(()=>{var P;E=!1,(P=t.onUpdated)==null||P.call(C)})),x()});try{(S=t.onBeforeMount)==null||S.call(C),await te(e,C,{subscribe:c,refs:s,...O,registerCleanup:y=>R.push(y)}),e.removeAttribute("cv-cloak"),(n=t.onMount)==null||n.call(C)}catch(y){if(t.onError)e.removeAttribute("cv-cloak"),t.onError.call(C,y);else if(o.errorHandler)e.removeAttribute("cv-cloak"),o.errorHandler(y,C,t.name??e.tagName.toLowerCase());else throw y}const d=typeof window<"u"?window.__COURVUX_DEVTOOLS__:void 0,p=d?Mt():0;if(d){const y=C,x=new Set,A={id:p,name:t.name??e.tagName.toLowerCase(),el:e,getState:()=>{const P={};for(const i of Object.keys(y))if(!(i.startsWith("$")||typeof y[i]=="function"))try{P[i]=y[i]}catch{}return P},setState:(P,i)=>{y[P]=i},subscribe:P=>(x.add(P),()=>x.delete(P)),children:[]};Object.keys(y).filter(P=>!P.startsWith("$")&&typeof y[P]!="function").forEach(P=>{a(P,()=>{d._emit("update",A),x.forEach(i=>i())})}),d._registerInstance(A),R.push(()=>d._unregisterInstance(p))}return{state:C,destroy:()=>{var y,x;(y=t.onBeforeUnmount)==null||y.call(C),_.forEach(A=>A()),M.forEach(A=>A()),L.forEach(A=>A()),R.forEach(A=>A()),(x=t.onDestroy)==null||x.call(C)},activate:()=>{var y;(y=t.onActivated)==null||y.call(C)},deactivate:()=>{var y;(y=t.onDeactivated)==null||y.call(C)},beforeLeave:t.onBeforeRouteLeave?(y,x)=>t.onBeforeRouteLeave.call(C,y,x):void 0,enter:t.onBeforeRouteEnter?y=>t.onBeforeRouteEnter.call(C,y):void 0}}function gt(e,t,o){if(!e.emits||Array.isArray(e.emits))return;const s=e.emits[t];typeof s=="function"&&!s(...o)&&console.warn(`[courvux] emit "${t}": validator returned false`)}function Ce(e){return async(t,o,s,a)=>{const b=e.components[o],k=t.getAttribute("cv-ref");k&&t.removeAttribute("cv-ref");const f={},I=[],$={};Array.from(t.attributes).filter(E=>E.name==="cv-model"||E.name.startsWith("cv-model.")||E.name.startsWith("cv-model:")).forEach(E=>{t.removeAttribute(E.name);const c=E.value,d=E.name.indexOf(":"),p=d>=0?E.name.slice(d+1).split(".")[0]:"modelValue",w=p==="modelValue"?"update:modelValue":`update:${p}`;f[p]=Oe(W(c,s)),I.push({propName:p,expr:c}),$[w]=S=>{pe(c,s,S)}});const C={};Array.from(t.attributes).forEach(E=>{const c=E.name.startsWith(":"),d=E.name.startsWith("@")||E.name.startsWith("cv:on:"),p=E.name==="cv-model"||E.name.startsWith("cv-model.")||E.name.startsWith("cv-model:"),w=E.name.startsWith("v-slot"),S=E.name==="slot";!c&&!d&&!p&&!w&&!S&&(C[E.name]=E.value)}),b.inheritAttrs===!1&&Object.keys(C).forEach(E=>t.removeAttribute(E)),Array.from(t.attributes).forEach(E=>{if(E.name.startsWith(":")){const c=E.name.slice(1),d=E.value;f[c]=Oe(W(d,s)),I.push({propName:c,expr:d})}else if(E.name.startsWith("@")||E.name.startsWith("cv:on:")){const c=E.name.startsWith("@")?E.name.slice(1):E.name.slice(6),d=E.value;$[c]=(...p)=>{typeof s[d]=="function"&&s[d].call(s,...p)}}});const L=t.getAttribute("v-slot")??t.getAttribute("v-slot:default");L&&(t.removeAttribute("v-slot"),t.removeAttribute("v-slot:default"));const _=new Map,M=[];Array.from(t.childNodes).forEach(E=>{const c=E.nodeType===1?E.getAttribute("slot"):null;if(c){if(!_.has(c)){const d=t.getAttribute(`v-slot:${c}`)??null;d&&t.removeAttribute(`v-slot:${c}`),_.set(c,{nodes:[],vSlot:d})}_.get(c).nodes.push(E.cloneNode(!0))}else M.push(E.cloneNode(!0))});const z={};M.some(E=>{var c;return E.nodeType===1||E.nodeType===3&&(((c=E.textContent)==null?void 0:c.trim())??"")!==""})&&(z.default=async E=>{const c=L?{...s,...rt(L,E)}:s,d=document.createDocumentFragment();return M.forEach(p=>d.appendChild(p.cloneNode(!0))),await te(d,c,a),Array.from(d.childNodes)});for(const[E,{nodes:c,vSlot:d}]of _)z[E]=async p=>{const w=d?{...s,...rt(d,p)}:s,S=document.createDocumentFragment();return c.forEach(n=>S.appendChild(n.cloneNode(!0))),await te(S,w,a),Array.from(S.childNodes)};const O={...e,components:{...e.components,...b.components},slots:z};O.mountElement=Ce(O);const{state:R}=await ne(t,{...b,data:{...b.data,...f,$attrs:C,$parent:s},methods:{...b.methods,$emit(E,...c){var d;gt(b,E,c),(d=$[E])==null||d.call($,...c)}}},O);R&&(I.forEach(({propName:E,expr:c})=>{ht(c,{...a,subscribe:a.subscribe},()=>{R[E]=Oe(W(c,s))})}),k&&a.refs&&(a.refs[k]=R))}}function Yt(e){Et();const t=typeof window<"u"?It():void 0,o=[],s={...e.directives},a={...e.components??{}},b=[],k=new Map,f={},I=new Map;if(e.debug&&t&&Ht(t),t&&e.store){const _=e.store,M=Object.keys(_).filter(z=>typeof _[z]!="function");t._registerStore({getState(){const z={};return M.forEach(O=>{try{z[O]=_[O]}catch{}}),z},setState(z,O){_[z]=O},subscribe(z){const O=M.map(R=>{try{return be(_,R,z)}catch{return()=>{}}});return()=>O.forEach(R=>R())}})}const $={router:e.router,use(_){return o.includes(_)||(o.push(_),_.install($)),$},directive(_,M){return s[_]=M,$},component(_,M){return a[_]=M,$},provide(_,M){return typeof _=="string"?f[_]=M:Object.assign(f,_),$},magic(_,M){return I.set(`$${_}`,M),$},mount:async _=>(await L(_),$),mountAll:async(_="[data-courvux]")=>{const M=Array.from(document.querySelectorAll(_));return await Promise.all(M.map(z=>C(z))),$},mountEl:async _=>C(_),unmount(_){if(!_)b.forEach(M=>M()),b.length=0,k.clear();else{const M=document.querySelector(_);if(M){const z=k.get(M);if(z){z(),k.delete(M);const O=b.indexOf(z);O>-1&&b.splice(O,1)}}}return $},destroy(){b.forEach(_=>_()),b.length=0,k.clear()}},C=async _=>{const M=new URL(".",document.baseURI).href,z={components:a,router:e.router,store:e.store,directives:s,baseUrl:M,provided:{...f},errorHandler:e.errorHandler,globalProperties:e.globalProperties,magics:I.size?Object.fromEntries(I):void 0};if(z.mountElement=Ce(z),e.router){const R=e.router;z.mountRouterView=async(E,c)=>{await new Promise(d=>{tt(E,R,async(p,w,S,n,y)=>{const x={...z,currentRoute:S};if(y){let A=null;const P={...x,mountRouterView:async(i,l)=>{A=tt(i,y,async(r,g,m,u)=>{const h={...x,currentRoute:m};if(u){let v=null;const T={...h,mountRouterView:async(j,U)=>{v=await ne(j,g,h)}},{destroy:F}=await ne(r,{template:u},T);return{destroy:()=>{v==null||v.destroy(),F()},activate:()=>v==null?void 0:v.activate(),deactivate:()=>v==null?void 0:v.deactivate()}}else return await ne(r,g,h)},l)}};if(n){let i=null;const l={...P,mountRouterView:async(g,m)=>{i=await ne(g,w,P)}},{destroy:r}=await ne(p,{template:n},l);return{destroy:()=>{A==null||A(),i==null||i.destroy(),r()},activate:()=>i==null?void 0:i.activate(),deactivate:()=>i==null?void 0:i.deactivate()}}else{const i=await ne(p,w,P);return{destroy:()=>{A==null||A(),i.destroy()},activate:()=>i.activate(),deactivate:()=>i.deactivate()}}}else if(n){let A=null;const P={...x,mountRouterView:async(l,r)=>{A=await ne(l,w,x)}},{destroy:i}=await ne(p,{template:n},P);return{destroy:()=>{A==null||A.destroy(),i()},activate:()=>A==null?void 0:A.activate(),deactivate:()=>A==null?void 0:A.deactivate()}}else return await ne(p,w,x)},c,d)})}}const O=await ne(_,e,z);return b.push(O.destroy),k.set(_,O.destroy),O.state},L=async _=>{const M=document.querySelector(_);if(M)return C(M)};return $}var at=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function Xt(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var Pe={exports:{}},it;function Jt(){return it||(it=1,(function(e){var t=typeof window<"u"?window:typeof WorkerGlobalScope<"u"&&self instanceof WorkerGlobalScope?self:{};/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 *
 * @license MIT <https://opensource.org/licenses/MIT>
 * @author Lea Verou <https://lea.verou.me>
 * @namespace
 * @public
 */var o=(function(s){var a=/(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i,b=0,k={},f={manual:s.Prism&&s.Prism.manual,disableWorkerMessageHandler:s.Prism&&s.Prism.disableWorkerMessageHandler,util:{encode:function c(d){return d instanceof I?new I(d.type,c(d.content),d.alias):Array.isArray(d)?d.map(c):d.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/\u00a0/g," ")},type:function(c){return Object.prototype.toString.call(c).slice(8,-1)},objId:function(c){return c.__id||Object.defineProperty(c,"__id",{value:++b}),c.__id},clone:function c(d,p){p=p||{};var w,S;switch(f.util.type(d)){case"Object":if(S=f.util.objId(d),p[S])return p[S];w={},p[S]=w;for(var n in d)d.hasOwnProperty(n)&&(w[n]=c(d[n],p));return w;case"Array":return S=f.util.objId(d),p[S]?p[S]:(w=[],p[S]=w,d.forEach(function(y,x){w[x]=c(y,p)}),w);default:return d}},getLanguage:function(c){for(;c;){var d=a.exec(c.className);if(d)return d[1].toLowerCase();c=c.parentElement}return"none"},setLanguage:function(c,d){c.className=c.className.replace(RegExp(a,"gi"),""),c.classList.add("language-"+d)},currentScript:function(){if(typeof document>"u")return null;if(document.currentScript&&document.currentScript.tagName==="SCRIPT")return document.currentScript;try{throw new Error}catch(w){var c=(/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(w.stack)||[])[1];if(c){var d=document.getElementsByTagName("script");for(var p in d)if(d[p].src==c)return d[p]}return null}},isActive:function(c,d,p){for(var w="no-"+d;c;){var S=c.classList;if(S.contains(d))return!0;if(S.contains(w))return!1;c=c.parentElement}return!!p}},languages:{plain:k,plaintext:k,text:k,txt:k,extend:function(c,d){var p=f.util.clone(f.languages[c]);for(var w in d)p[w]=d[w];return p},insertBefore:function(c,d,p,w){w=w||f.languages;var S=w[c],n={};for(var y in S)if(S.hasOwnProperty(y)){if(y==d)for(var x in p)p.hasOwnProperty(x)&&(n[x]=p[x]);p.hasOwnProperty(y)||(n[y]=S[y])}var A=w[c];return w[c]=n,f.languages.DFS(f.languages,function(P,i){i===A&&P!=c&&(this[P]=n)}),n},DFS:function c(d,p,w,S){S=S||{};var n=f.util.objId;for(var y in d)if(d.hasOwnProperty(y)){p.call(d,y,d[y],w||y);var x=d[y],A=f.util.type(x);A==="Object"&&!S[n(x)]?(S[n(x)]=!0,c(x,p,null,S)):A==="Array"&&!S[n(x)]&&(S[n(x)]=!0,c(x,p,y,S))}}},plugins:{},highlightAll:function(c,d){f.highlightAllUnder(document,c,d)},highlightAllUnder:function(c,d,p){var w={callback:p,container:c,selector:'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'};f.hooks.run("before-highlightall",w),w.elements=Array.prototype.slice.apply(w.container.querySelectorAll(w.selector)),f.hooks.run("before-all-elements-highlight",w);for(var S=0,n;n=w.elements[S++];)f.highlightElement(n,d===!0,w.callback)},highlightElement:function(c,d,p){var w=f.util.getLanguage(c),S=f.languages[w];f.util.setLanguage(c,w);var n=c.parentElement;n&&n.nodeName.toLowerCase()==="pre"&&f.util.setLanguage(n,w);var y=c.textContent,x={element:c,language:w,grammar:S,code:y};function A(i){x.highlightedCode=i,f.hooks.run("before-insert",x),x.element.innerHTML=x.highlightedCode,f.hooks.run("after-highlight",x),f.hooks.run("complete",x),p&&p.call(x.element)}if(f.hooks.run("before-sanity-check",x),n=x.element.parentElement,n&&n.nodeName.toLowerCase()==="pre"&&!n.hasAttribute("tabindex")&&n.setAttribute("tabindex","0"),!x.code){f.hooks.run("complete",x),p&&p.call(x.element);return}if(f.hooks.run("before-highlight",x),!x.grammar){A(f.util.encode(x.code));return}if(d&&s.Worker){var P=new Worker(f.filename);P.onmessage=function(i){A(i.data)},P.postMessage(JSON.stringify({language:x.language,code:x.code,immediateClose:!0}))}else A(f.highlight(x.code,x.grammar,x.language))},highlight:function(c,d,p){var w={code:c,grammar:d,language:p};if(f.hooks.run("before-tokenize",w),!w.grammar)throw new Error('The language "'+w.language+'" has no grammar.');return w.tokens=f.tokenize(w.code,w.grammar),f.hooks.run("after-tokenize",w),I.stringify(f.util.encode(w.tokens),w.language)},tokenize:function(c,d){var p=d.rest;if(p){for(var w in p)d[w]=p[w];delete d.rest}var S=new L;return _(S,S.head,c),C(c,S,d,S.head,0),z(S)},hooks:{all:{},add:function(c,d){var p=f.hooks.all;p[c]=p[c]||[],p[c].push(d)},run:function(c,d){var p=f.hooks.all[c];if(!(!p||!p.length))for(var w=0,S;S=p[w++];)S(d)}},Token:I};s.Prism=f;function I(c,d,p,w){this.type=c,this.content=d,this.alias=p,this.length=(w||"").length|0}I.stringify=function c(d,p){if(typeof d=="string")return d;if(Array.isArray(d)){var w="";return d.forEach(function(A){w+=c(A,p)}),w}var S={type:d.type,content:c(d.content,p),tag:"span",classes:["token",d.type],attributes:{},language:p},n=d.alias;n&&(Array.isArray(n)?Array.prototype.push.apply(S.classes,n):S.classes.push(n)),f.hooks.run("wrap",S);var y="";for(var x in S.attributes)y+=" "+x+'="'+(S.attributes[x]||"").replace(/"/g,"&quot;")+'"';return"<"+S.tag+' class="'+S.classes.join(" ")+'"'+y+">"+S.content+"</"+S.tag+">"};function $(c,d,p,w){c.lastIndex=d;var S=c.exec(p);if(S&&w&&S[1]){var n=S[1].length;S.index+=n,S[0]=S[0].slice(n)}return S}function C(c,d,p,w,S,n){for(var y in p)if(!(!p.hasOwnProperty(y)||!p[y])){var x=p[y];x=Array.isArray(x)?x:[x];for(var A=0;A<x.length;++A){if(n&&n.cause==y+","+A)return;var P=x[A],i=P.inside,l=!!P.lookbehind,r=!!P.greedy,g=P.alias;if(r&&!P.pattern.global){var m=P.pattern.toString().match(/[imsuy]*$/)[0];P.pattern=RegExp(P.pattern.source,m+"g")}for(var u=P.pattern||P,h=w.next,v=S;h!==d.tail&&!(n&&v>=n.reach);v+=h.value.length,h=h.next){var T=h.value;if(d.length>c.length)return;if(!(T instanceof I)){var F=1,j;if(r){if(j=$(u,v,c,l),!j||j.index>=c.length)break;var G=j.index,U=j.index+j[0].length,N=v;for(N+=h.value.length;G>=N;)h=h.next,N+=h.value.length;if(N-=h.value.length,v=N,h.value instanceof I)continue;for(var D=h;D!==d.tail&&(N<U||typeof D.value=="string");D=D.next)F++,N+=D.value.length;F--,T=c.slice(v,N),j.index-=v}else if(j=$(u,0,T,l),!j)continue;var G=j.index,q=j[0],H=T.slice(0,G),K=T.slice(G+q.length),V=v+T.length;n&&V>n.reach&&(n.reach=V);var B=h.prev;H&&(B=_(d,B,H),v+=H.length),M(d,B,F);var de=new I(y,i?f.tokenize(q,i):q,g,q);if(h=_(d,B,de),K&&_(d,h,K),F>1){var Q={cause:y+","+A,reach:V};C(c,d,p,h.prev,v,Q),n&&Q.reach>n.reach&&(n.reach=Q.reach)}}}}}}function L(){var c={value:null,prev:null,next:null},d={value:null,prev:c,next:null};c.next=d,this.head=c,this.tail=d,this.length=0}function _(c,d,p){var w=d.next,S={value:p,prev:d,next:w};return d.next=S,w.prev=S,c.length++,S}function M(c,d,p){for(var w=d.next,S=0;S<p&&w!==c.tail;S++)w=w.next;d.next=w,w.prev=d,c.length-=S}function z(c){for(var d=[],p=c.head.next;p!==c.tail;)d.push(p.value),p=p.next;return d}if(!s.document)return s.addEventListener&&(f.disableWorkerMessageHandler||s.addEventListener("message",function(c){var d=JSON.parse(c.data),p=d.language,w=d.code,S=d.immediateClose;s.postMessage(f.highlight(w,f.languages[p],p)),S&&s.close()},!1)),f;var O=f.util.currentScript();O&&(f.filename=O.src,O.hasAttribute("data-manual")&&(f.manual=!0));function R(){f.manual||f.highlightAll()}if(!f.manual){var E=document.readyState;E==="loading"||E==="interactive"&&O&&O.defer?document.addEventListener("DOMContentLoaded",R):window.requestAnimationFrame?window.requestAnimationFrame(R):window.setTimeout(R,16)}return f})(t);e.exports&&(e.exports=o),typeof at<"u"&&(at.Prism=o),o.languages.markup={comment:{pattern:/<!--(?:(?!<!--)[\s\S])*?-->/,greedy:!0},prolog:{pattern:/<\?[\s\S]+?\?>/,greedy:!0},doctype:{pattern:/<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,greedy:!0,inside:{"internal-subset":{pattern:/(^[^\[]*\[)[\s\S]+(?=\]>$)/,lookbehind:!0,greedy:!0,inside:null},string:{pattern:/"[^"]*"|'[^']*'/,greedy:!0},punctuation:/^<!|>$|[[\]]/,"doctype-tag":/^DOCTYPE/i,name:/[^\s<>'"]+/}},cdata:{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,greedy:!0},tag:{pattern:/<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,greedy:!0,inside:{tag:{pattern:/^<\/?[^\s>\/]+/,inside:{punctuation:/^<\/?/,namespace:/^[^\s>\/:]+:/}},"special-attr":[],"attr-value":{pattern:/=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,inside:{punctuation:[{pattern:/^=/,alias:"attr-equals"},{pattern:/^(\s*)["']|["']$/,lookbehind:!0}]}},punctuation:/\/?>/,"attr-name":{pattern:/[^\s>\/]+/,inside:{namespace:/^[^\s>\/:]+:/}}}},entity:[{pattern:/&[\da-z]{1,8};/i,alias:"named-entity"},/&#x?[\da-f]{1,8};/i]},o.languages.markup.tag.inside["attr-value"].inside.entity=o.languages.markup.entity,o.languages.markup.doctype.inside["internal-subset"].inside=o.languages.markup,o.hooks.add("wrap",function(s){s.type==="entity"&&(s.attributes.title=s.content.replace(/&amp;/,"&"))}),Object.defineProperty(o.languages.markup.tag,"addInlined",{value:function(a,b){var k={};k["language-"+b]={pattern:/(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,lookbehind:!0,inside:o.languages[b]},k.cdata=/^<!\[CDATA\[|\]\]>$/i;var f={"included-cdata":{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,inside:k}};f["language-"+b]={pattern:/[\s\S]+/,inside:o.languages[b]};var I={};I[a]={pattern:RegExp(/(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(/__/g,function(){return a}),"i"),lookbehind:!0,greedy:!0,inside:f},o.languages.insertBefore("markup","cdata",I)}}),Object.defineProperty(o.languages.markup.tag,"addAttribute",{value:function(s,a){o.languages.markup.tag.inside["special-attr"].push({pattern:RegExp(/(^|["'\s])/.source+"(?:"+s+")"+/\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source,"i"),lookbehind:!0,inside:{"attr-name":/^[^\s=]+/,"attr-value":{pattern:/=[\s\S]+/,inside:{value:{pattern:/(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,lookbehind:!0,alias:[a,"language-"+a],inside:o.languages[a]},punctuation:[{pattern:/^=/,alias:"attr-equals"},/"|'/]}}}})}}),o.languages.html=o.languages.markup,o.languages.mathml=o.languages.markup,o.languages.svg=o.languages.markup,o.languages.xml=o.languages.extend("markup",{}),o.languages.ssml=o.languages.xml,o.languages.atom=o.languages.xml,o.languages.rss=o.languages.xml,(function(s){var a=/(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;s.languages.css={comment:/\/\*[\s\S]*?\*\//,atrule:{pattern:RegExp("@[\\w-](?:"+/[^;{\s"']|\s+(?!\s)/.source+"|"+a.source+")*?"+/(?:;|(?=\s*\{))/.source),inside:{rule:/^@[\w-]+/,"selector-function-argument":{pattern:/(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,lookbehind:!0,alias:"selector"},keyword:{pattern:/(^|[^\w-])(?:and|not|only|or)(?![\w-])/,lookbehind:!0}}},url:{pattern:RegExp("\\burl\\((?:"+a.source+"|"+/(?:[^\\\r\n()"']|\\[\s\S])*/.source+")\\)","i"),greedy:!0,inside:{function:/^url/i,punctuation:/^\(|\)$/,string:{pattern:RegExp("^"+a.source+"$"),alias:"url"}}},selector:{pattern:RegExp(`(^|[{}\\s])[^{}\\s](?:[^{};"'\\s]|\\s+(?![\\s{])|`+a.source+")*(?=\\s*\\{)"),lookbehind:!0},string:{pattern:a,greedy:!0},property:{pattern:/(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,lookbehind:!0},important:/!important\b/i,function:{pattern:/(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i,lookbehind:!0},punctuation:/[(){};:,]/},s.languages.css.atrule.inside.rest=s.languages.css;var b=s.languages.markup;b&&(b.tag.addInlined("style","css"),b.tag.addAttribute("style","css"))})(o),o.languages.clike={comment:[{pattern:/(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,lookbehind:!0,greedy:!0},{pattern:/(^|[^\\:])\/\/.*/,lookbehind:!0,greedy:!0}],string:{pattern:/(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,greedy:!0},"class-name":{pattern:/(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,lookbehind:!0,inside:{punctuation:/[.\\]/}},keyword:/\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,boolean:/\b(?:false|true)\b/,function:/\b\w+(?=\()/,number:/\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,operator:/[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,punctuation:/[{}[\];(),.:]/},o.languages.javascript=o.languages.extend("clike",{"class-name":[o.languages.clike["class-name"],{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,lookbehind:!0}],keyword:[{pattern:/((?:^|\})\s*)catch\b/,lookbehind:!0},{pattern:/(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,lookbehind:!0}],function:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,number:{pattern:RegExp(/(^|[^\w$])/.source+"(?:"+(/NaN|Infinity/.source+"|"+/0[bB][01]+(?:_[01]+)*n?/.source+"|"+/0[oO][0-7]+(?:_[0-7]+)*n?/.source+"|"+/0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source+"|"+/\d+(?:_\d+)*n/.source+"|"+/(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/.source)+")"+/(?![\w$])/.source),lookbehind:!0},operator:/--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/}),o.languages.javascript["class-name"][0].pattern=/(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/,o.languages.insertBefore("javascript","keyword",{regex:{pattern:RegExp(/((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)/.source+/\//.source+"(?:"+/(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}/.source+"|"+/(?:\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.)*\])*\])*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}v[dgimyus]{0,7}/.source+")"+/(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/.source),lookbehind:!0,greedy:!0,inside:{"regex-source":{pattern:/^(\/)[\s\S]+(?=\/[a-z]*$)/,lookbehind:!0,alias:"language-regex",inside:o.languages.regex},"regex-delimiter":/^\/|\/$/,"regex-flags":/^[a-z]+$/}},"function-variable":{pattern:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,alias:"function"},parameter:[{pattern:/(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,lookbehind:!0,inside:o.languages.javascript},{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,lookbehind:!0,inside:o.languages.javascript},{pattern:/(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,lookbehind:!0,inside:o.languages.javascript},{pattern:/((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,lookbehind:!0,inside:o.languages.javascript}],constant:/\b[A-Z](?:[A-Z_]|\dx?)*\b/}),o.languages.insertBefore("javascript","string",{hashbang:{pattern:/^#!.*/,greedy:!0,alias:"comment"},"template-string":{pattern:/`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,greedy:!0,inside:{"template-punctuation":{pattern:/^`|`$/,alias:"string"},interpolation:{pattern:/((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,lookbehind:!0,inside:{"interpolation-punctuation":{pattern:/^\$\{|\}$/,alias:"punctuation"},rest:o.languages.javascript}},string:/[\s\S]+/}},"string-property":{pattern:/((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,lookbehind:!0,greedy:!0,alias:"property"}}),o.languages.insertBefore("javascript","operator",{"literal-property":{pattern:/((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,lookbehind:!0,alias:"property"}}),o.languages.markup&&(o.languages.markup.tag.addInlined("script","javascript"),o.languages.markup.tag.addAttribute(/on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/.source,"javascript")),o.languages.js=o.languages.javascript,(function(){if(typeof o>"u"||typeof document>"u")return;Element.prototype.matches||(Element.prototype.matches=Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector);var s="Loading…",a=function(O,R){return"✖ Error "+O+" while fetching file: "+R},b="✖ Error: File does not exist or is empty",k={js:"javascript",py:"python",rb:"ruby",ps1:"powershell",psm1:"powershell",sh:"bash",bat:"batch",h:"c",tex:"latex"},f="data-src-status",I="loading",$="loaded",C="failed",L="pre[data-src]:not(["+f+'="'+$+'"]):not(['+f+'="'+I+'"])';function _(O,R,E){var c=new XMLHttpRequest;c.open("GET",O,!0),c.onreadystatechange=function(){c.readyState==4&&(c.status<400&&c.responseText?R(c.responseText):c.status>=400?E(a(c.status,c.statusText)):E(b))},c.send(null)}function M(O){var R=/^\s*(\d+)\s*(?:(,)\s*(?:(\d+)\s*)?)?$/.exec(O||"");if(R){var E=Number(R[1]),c=R[2],d=R[3];return c?d?[E,Number(d)]:[E,void 0]:[E,E]}}o.hooks.add("before-highlightall",function(O){O.selector+=", "+L}),o.hooks.add("before-sanity-check",function(O){var R=O.element;if(R.matches(L)){O.code="",R.setAttribute(f,I);var E=R.appendChild(document.createElement("CODE"));E.textContent=s;var c=R.getAttribute("data-src"),d=O.language;if(d==="none"){var p=(/\.(\w+)$/.exec(c)||[,"none"])[1];d=k[p]||p}o.util.setLanguage(E,d),o.util.setLanguage(R,d);var w=o.plugins.autoloader;w&&w.loadLanguages(d),_(c,function(S){R.setAttribute(f,$);var n=M(R.getAttribute("data-range"));if(n){var y=S.split(/\r\n?|\n/g),x=n[0],A=n[1]==null?y.length:n[1];x<0&&(x+=y.length),x=Math.max(0,Math.min(x-1,y.length)),A<0&&(A+=y.length),A=Math.max(0,Math.min(A,y.length)),S=y.slice(x,A).join(`
`),R.hasAttribute("data-start")||R.setAttribute("data-start",String(x+1))}E.textContent=S,o.highlightElement(E)},function(S){R.setAttribute(f,C),E.textContent=S})}}),o.plugins.fileHighlight={highlight:function(R){for(var E=(R||document).querySelectorAll(L),c=0,d;d=E[c++];)o.highlightElement(d)}};var z=!1;o.fileHighlight=function(){z||(console.warn("Prism.fileHighlight is deprecated. Use `Prism.plugins.fileHighlight.highlight` instead."),z=!0),o.plugins.fileHighlight.highlight.apply(this,arguments)}})()})(Pe)),Pe.exports}var Zt=Jt();const Kt=Xt(Zt);Prism.languages.javascript=Prism.languages.extend("clike",{"class-name":[Prism.languages.clike["class-name"],{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,lookbehind:!0}],keyword:[{pattern:/((?:^|\})\s*)catch\b/,lookbehind:!0},{pattern:/(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,lookbehind:!0}],function:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,number:{pattern:RegExp(/(^|[^\w$])/.source+"(?:"+(/NaN|Infinity/.source+"|"+/0[bB][01]+(?:_[01]+)*n?/.source+"|"+/0[oO][0-7]+(?:_[0-7]+)*n?/.source+"|"+/0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source+"|"+/\d+(?:_\d+)*n/.source+"|"+/(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/.source)+")"+/(?![\w$])/.source),lookbehind:!0},operator:/--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/});Prism.languages.javascript["class-name"][0].pattern=/(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/;Prism.languages.insertBefore("javascript","keyword",{regex:{pattern:RegExp(/((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)/.source+/\//.source+"(?:"+/(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}/.source+"|"+/(?:\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.)*\])*\])*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}v[dgimyus]{0,7}/.source+")"+/(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/.source),lookbehind:!0,greedy:!0,inside:{"regex-source":{pattern:/^(\/)[\s\S]+(?=\/[a-z]*$)/,lookbehind:!0,alias:"language-regex",inside:Prism.languages.regex},"regex-delimiter":/^\/|\/$/,"regex-flags":/^[a-z]+$/}},"function-variable":{pattern:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,alias:"function"},parameter:[{pattern:/(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,lookbehind:!0,inside:Prism.languages.javascript},{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,lookbehind:!0,inside:Prism.languages.javascript},{pattern:/(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,lookbehind:!0,inside:Prism.languages.javascript},{pattern:/((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,lookbehind:!0,inside:Prism.languages.javascript}],constant:/\b[A-Z](?:[A-Z_]|\dx?)*\b/});Prism.languages.insertBefore("javascript","string",{hashbang:{pattern:/^#!.*/,greedy:!0,alias:"comment"},"template-string":{pattern:/`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,greedy:!0,inside:{"template-punctuation":{pattern:/^`|`$/,alias:"string"},interpolation:{pattern:/((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,lookbehind:!0,inside:{"interpolation-punctuation":{pattern:/^\$\{|\}$/,alias:"punctuation"},rest:Prism.languages.javascript}},string:/[\s\S]+/}},"string-property":{pattern:/((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,lookbehind:!0,greedy:!0,alias:"property"}});Prism.languages.insertBefore("javascript","operator",{"literal-property":{pattern:/((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,lookbehind:!0,alias:"property"}});Prism.languages.markup&&(Prism.languages.markup.tag.addInlined("script","javascript"),Prism.languages.markup.tag.addAttribute(/on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/.source,"javascript"));Prism.languages.js=Prism.languages.javascript;Prism.languages.markup={comment:{pattern:/<!--(?:(?!<!--)[\s\S])*?-->/,greedy:!0},prolog:{pattern:/<\?[\s\S]+?\?>/,greedy:!0},doctype:{pattern:/<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,greedy:!0,inside:{"internal-subset":{pattern:/(^[^\[]*\[)[\s\S]+(?=\]>$)/,lookbehind:!0,greedy:!0,inside:null},string:{pattern:/"[^"]*"|'[^']*'/,greedy:!0},punctuation:/^<!|>$|[[\]]/,"doctype-tag":/^DOCTYPE/i,name:/[^\s<>'"]+/}},cdata:{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,greedy:!0},tag:{pattern:/<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,greedy:!0,inside:{tag:{pattern:/^<\/?[^\s>\/]+/,inside:{punctuation:/^<\/?/,namespace:/^[^\s>\/:]+:/}},"special-attr":[],"attr-value":{pattern:/=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,inside:{punctuation:[{pattern:/^=/,alias:"attr-equals"},{pattern:/^(\s*)["']|["']$/,lookbehind:!0}]}},punctuation:/\/?>/,"attr-name":{pattern:/[^\s>\/]+/,inside:{namespace:/^[^\s>\/:]+:/}}}},entity:[{pattern:/&[\da-z]{1,8};/i,alias:"named-entity"},/&#x?[\da-f]{1,8};/i]};Prism.languages.markup.tag.inside["attr-value"].inside.entity=Prism.languages.markup.entity;Prism.languages.markup.doctype.inside["internal-subset"].inside=Prism.languages.markup;Prism.hooks.add("wrap",function(e){e.type==="entity"&&(e.attributes.title=e.content.replace(/&amp;/,"&"))});Object.defineProperty(Prism.languages.markup.tag,"addInlined",{value:function(t,o){var s={};s["language-"+o]={pattern:/(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,lookbehind:!0,inside:Prism.languages[o]},s.cdata=/^<!\[CDATA\[|\]\]>$/i;var a={"included-cdata":{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,inside:s}};a["language-"+o]={pattern:/[\s\S]+/,inside:Prism.languages[o]};var b={};b[t]={pattern:RegExp(/(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(/__/g,function(){return t}),"i"),lookbehind:!0,greedy:!0,inside:a},Prism.languages.insertBefore("markup","cdata",b)}});Object.defineProperty(Prism.languages.markup.tag,"addAttribute",{value:function(e,t){Prism.languages.markup.tag.inside["special-attr"].push({pattern:RegExp(/(^|["'\s])/.source+"(?:"+e+")"+/\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source,"i"),lookbehind:!0,inside:{"attr-name":/^[^\s=]+/,"attr-value":{pattern:/=[\s\S]+/,inside:{value:{pattern:/(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,lookbehind:!0,alias:[t,"language-"+t],inside:Prism.languages[t]},punctuation:[{pattern:/^=/,alias:"attr-equals"},/"|'/]}}}})}});Prism.languages.html=Prism.languages.markup;Prism.languages.mathml=Prism.languages.markup;Prism.languages.svg=Prism.languages.markup;Prism.languages.xml=Prism.languages.extend("markup",{});Prism.languages.ssml=Prism.languages.xml;Prism.languages.atom=Prism.languages.xml;Prism.languages.rss=Prism.languages.xml;(function(e){var t="\\b(?:BASH|BASHOPTS|BASH_ALIASES|BASH_ARGC|BASH_ARGV|BASH_CMDS|BASH_COMPLETION_COMPAT_DIR|BASH_LINENO|BASH_REMATCH|BASH_SOURCE|BASH_VERSINFO|BASH_VERSION|COLORTERM|COLUMNS|COMP_WORDBREAKS|DBUS_SESSION_BUS_ADDRESS|DEFAULTS_PATH|DESKTOP_SESSION|DIRSTACK|DISPLAY|EUID|GDMSESSION|GDM_LANG|GNOME_KEYRING_CONTROL|GNOME_KEYRING_PID|GPG_AGENT_INFO|GROUPS|HISTCONTROL|HISTFILE|HISTFILESIZE|HISTSIZE|HOME|HOSTNAME|HOSTTYPE|IFS|INSTANCE|JOB|LANG|LANGUAGE|LC_ADDRESS|LC_ALL|LC_IDENTIFICATION|LC_MEASUREMENT|LC_MONETARY|LC_NAME|LC_NUMERIC|LC_PAPER|LC_TELEPHONE|LC_TIME|LESSCLOSE|LESSOPEN|LINES|LOGNAME|LS_COLORS|MACHTYPE|MAILCHECK|MANDATORY_PATH|NO_AT_BRIDGE|OLDPWD|OPTERR|OPTIND|ORBIT_SOCKETDIR|OSTYPE|PAPERSIZE|PATH|PIPESTATUS|PPID|PS1|PS2|PS3|PS4|PWD|RANDOM|REPLY|SECONDS|SELINUX_INIT|SESSION|SESSIONTYPE|SESSION_MANAGER|SHELL|SHELLOPTS|SHLVL|SSH_AUTH_SOCK|TERM|UID|UPSTART_EVENTS|UPSTART_INSTANCE|UPSTART_JOB|UPSTART_SESSION|USER|WINDOWID|XAUTHORITY|XDG_CONFIG_DIRS|XDG_CURRENT_DESKTOP|XDG_DATA_DIRS|XDG_GREETER_DATA_DIR|XDG_MENU_PREFIX|XDG_RUNTIME_DIR|XDG_SEAT|XDG_SEAT_PATH|XDG_SESSION_DESKTOP|XDG_SESSION_ID|XDG_SESSION_PATH|XDG_SESSION_TYPE|XDG_VTNR|XMODIFIERS)\\b",o={pattern:/(^(["']?)\w+\2)[ \t]+\S.*/,lookbehind:!0,alias:"punctuation",inside:null},s={bash:o,environment:{pattern:RegExp("\\$"+t),alias:"constant"},variable:[{pattern:/\$?\(\([\s\S]+?\)\)/,greedy:!0,inside:{variable:[{pattern:/(^\$\(\([\s\S]+)\)\)/,lookbehind:!0},/^\$\(\(/],number:/\b0x[\dA-Fa-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:[Ee]-?\d+)?/,operator:/--|\+\+|\*\*=?|<<=?|>>=?|&&|\|\||[=!+\-*/%<>^&|]=?|[?~:]/,punctuation:/\(\(?|\)\)?|,|;/}},{pattern:/\$\((?:\([^)]+\)|[^()])+\)|`[^`]+`/,greedy:!0,inside:{variable:/^\$\(|^`|\)$|`$/}},{pattern:/\$\{[^}]+\}/,greedy:!0,inside:{operator:/:[-=?+]?|[!\/]|##?|%%?|\^\^?|,,?/,punctuation:/[\[\]]/,environment:{pattern:RegExp("(\\{)"+t),lookbehind:!0,alias:"constant"}}},/\$(?:\w+|[#?*!@$])/],entity:/\\(?:[abceEfnrtv\\"]|O?[0-7]{1,3}|U[0-9a-fA-F]{8}|u[0-9a-fA-F]{4}|x[0-9a-fA-F]{1,2})/};e.languages.bash={shebang:{pattern:/^#!\s*\/.*/,alias:"important"},comment:{pattern:/(^|[^"{\\$])#.*/,lookbehind:!0},"function-name":[{pattern:/(\bfunction\s+)[\w-]+(?=(?:\s*\(?:\s*\))?\s*\{)/,lookbehind:!0,alias:"function"},{pattern:/\b[\w-]+(?=\s*\(\s*\)\s*\{)/,alias:"function"}],"for-or-select":{pattern:/(\b(?:for|select)\s+)\w+(?=\s+in\s)/,alias:"variable",lookbehind:!0},"assign-left":{pattern:/(^|[\s;|&]|[<>]\()\w+(?:\.\w+)*(?=\+?=)/,inside:{environment:{pattern:RegExp("(^|[\\s;|&]|[<>]\\()"+t),lookbehind:!0,alias:"constant"}},alias:"variable",lookbehind:!0},parameter:{pattern:/(^|\s)-{1,2}(?:\w+:[+-]?)?\w+(?:\.\w+)*(?=[=\s]|$)/,alias:"variable",lookbehind:!0},string:[{pattern:/((?:^|[^<])<<-?\s*)(\w+)\s[\s\S]*?(?:\r?\n|\r)\2/,lookbehind:!0,greedy:!0,inside:s},{pattern:/((?:^|[^<])<<-?\s*)(["'])(\w+)\2\s[\s\S]*?(?:\r?\n|\r)\3/,lookbehind:!0,greedy:!0,inside:{bash:o}},{pattern:/(^|[^\\](?:\\\\)*)"(?:\\[\s\S]|\$\([^)]+\)|\$(?!\()|`[^`]+`|[^"\\`$])*"/,lookbehind:!0,greedy:!0,inside:s},{pattern:/(^|[^$\\])'[^']*'/,lookbehind:!0,greedy:!0},{pattern:/\$'(?:[^'\\]|\\[\s\S])*'/,greedy:!0,inside:{entity:s.entity}}],environment:{pattern:RegExp("\\$?"+t),alias:"constant"},variable:s.variable,function:{pattern:/(^|[\s;|&]|[<>]\()(?:add|apropos|apt|apt-cache|apt-get|aptitude|aspell|automysqlbackup|awk|basename|bash|bc|bconsole|bg|bzip2|cal|cargo|cat|cfdisk|chgrp|chkconfig|chmod|chown|chroot|cksum|clear|cmp|column|comm|composer|cp|cron|crontab|csplit|curl|cut|date|dc|dd|ddrescue|debootstrap|df|diff|diff3|dig|dir|dircolors|dirname|dirs|dmesg|docker|docker-compose|du|egrep|eject|env|ethtool|expand|expect|expr|fdformat|fdisk|fg|fgrep|file|find|fmt|fold|format|free|fsck|ftp|fuser|gawk|git|gparted|grep|groupadd|groupdel|groupmod|groups|grub-mkconfig|gzip|halt|head|hg|history|host|hostname|htop|iconv|id|ifconfig|ifdown|ifup|import|install|ip|java|jobs|join|kill|killall|less|link|ln|locate|logname|logrotate|look|lpc|lpr|lprint|lprintd|lprintq|lprm|ls|lsof|lynx|make|man|mc|mdadm|mkconfig|mkdir|mke2fs|mkfifo|mkfs|mkisofs|mknod|mkswap|mmv|more|most|mount|mtools|mtr|mutt|mv|nano|nc|netstat|nice|nl|node|nohup|notify-send|npm|nslookup|op|open|parted|passwd|paste|pathchk|ping|pkill|pnpm|podman|podman-compose|popd|pr|printcap|printenv|ps|pushd|pv|quota|quotacheck|quotactl|ram|rar|rcp|reboot|remsync|rename|renice|rev|rm|rmdir|rpm|rsync|scp|screen|sdiff|sed|sendmail|seq|service|sftp|sh|shellcheck|shuf|shutdown|sleep|slocate|sort|split|ssh|stat|strace|su|sudo|sum|suspend|swapon|sync|sysctl|tac|tail|tar|tee|time|timeout|top|touch|tr|traceroute|tsort|tty|umount|uname|unexpand|uniq|units|unrar|unshar|unzip|update-grub|uptime|useradd|userdel|usermod|users|uudecode|uuencode|v|vcpkg|vdir|vi|vim|virsh|vmstat|wait|watch|wc|wget|whereis|which|who|whoami|write|xargs|xdg-open|yarn|yes|zenity|zip|zsh|zypper)(?=$|[)\s;|&])/,lookbehind:!0},keyword:{pattern:/(^|[\s;|&]|[<>]\()(?:case|do|done|elif|else|esac|fi|for|function|if|in|select|then|until|while)(?=$|[)\s;|&])/,lookbehind:!0},builtin:{pattern:/(^|[\s;|&]|[<>]\()(?:\.|:|alias|bind|break|builtin|caller|cd|command|continue|declare|echo|enable|eval|exec|exit|export|getopts|hash|help|let|local|logout|mapfile|printf|pwd|read|readarray|readonly|return|set|shift|shopt|source|test|times|trap|type|typeset|ulimit|umask|unalias|unset)(?=$|[)\s;|&])/,lookbehind:!0,alias:"class-name"},boolean:{pattern:/(^|[\s;|&]|[<>]\()(?:false|true)(?=$|[)\s;|&])/,lookbehind:!0},"file-descriptor":{pattern:/\B&\d\b/,alias:"important"},operator:{pattern:/\d?<>|>\||\+=|=[=~]?|!=?|<<[<-]?|[&\d]?>>|\d[<>]&?|[<>][&=]?|&[>&]?|\|[&|]?/,inside:{"file-descriptor":{pattern:/^\d/,alias:"important"}}},punctuation:/\$?\(\(?|\)\)?|\.\.|[{}[\];\\]/,number:{pattern:/(^|\s)(?:[1-9]\d*|0)(?:[.,]\d+)?\b/,lookbehind:!0}},o.inside=e.languages.bash;for(var a=["comment","function-name","for-or-select","assign-left","parameter","string","environment","function","keyword","builtin","boolean","file-descriptor","operator","punctuation","number"],b=s.variable[1].inside,k=0;k<a.length;k++)b[a[k]]=e.languages.bash[a[k]];e.languages.sh=e.languages.bash,e.languages.shell=e.languages.bash})(Prism);Prism.languages.json={property:{pattern:/(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?=\s*:)/,lookbehind:!0,greedy:!0},string:{pattern:/(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?!\s*:)/,lookbehind:!0,greedy:!0},comment:{pattern:/\/\/.*|\/\*[\s\S]*?(?:\*\/|$)/,greedy:!0},number:/-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i,punctuation:/[{}[\],]/,operator:/:/,boolean:/\b(?:false|true)\b/,null:{pattern:/\bnull\b/,alias:"keyword"}};Prism.languages.webmanifest=Prism.languages.json;var st={},ct;function Qt(){return ct||(ct=1,(function(e){e.languages.typescript=e.languages.extend("javascript",{"class-name":{pattern:/(\b(?:class|extends|implements|instanceof|interface|new|type)\s+)(?!keyof\b)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?:\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>)?/,lookbehind:!0,greedy:!0,inside:null},builtin:/\b(?:Array|Function|Promise|any|boolean|console|never|number|string|symbol|unknown)\b/}),e.languages.typescript.keyword.push(/\b(?:abstract|declare|is|keyof|readonly|require)\b/,/\b(?:asserts|infer|interface|module|namespace|type)\b(?=\s*(?:[{_$a-zA-Z\xA0-\uFFFF]|$))/,/\btype\b(?=\s*(?:[\{*]|$))/),delete e.languages.typescript.parameter,delete e.languages.typescript["literal-property"];var t=e.languages.extend("typescript",{});delete t["class-name"],e.languages.typescript["class-name"].inside=t,e.languages.insertBefore("typescript","function",{decorator:{pattern:/@[$\w\xA0-\uFFFF]+/,inside:{at:{pattern:/^@/,alias:"operator"},function:/^[\s\S]+/}},"generic-function":{pattern:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>(?=\s*\()/,greedy:!0,inside:{function:/^#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*/,generic:{pattern:/<[\s\S]+/,alias:"class-name",inside:t}}}}),e.languages.ts=e.languages.typescript})(Prism)),st}Qt();const eo={js:"JavaScript",ts:"TypeScript",html:"HTML",bash:"Shell",json:"JSON"};function to(e){const t=e.split(`
`);for(;t.length&&!t[0].trim();)t.shift();for(;t.length&&!t[t.length-1].trim();)t.pop();const o=t.filter(s=>s.trim()).reduce((s,a)=>Math.min(s,a.match(/^(\s*)/)[1].length),1/0);return t.map(s=>s.slice(o)).join(`
`)}const oo={data:{lang:"js",code:"",label:"",copied:!1},template:`
        <div class="code-block">
            <div class="code-header">
                <span class="code-lang">{{ label || langLabel }}</span>
                <button class="copy-btn" @click="copy()">
                    {{ copied ? '✓ Copied' : 'Copy' }}
                </button>
            </div>
            <pre class="language-placeholder"><code cv-ref="el" :class="'language-' + lang"></code></pre>
        </div>
    `,computed:{langLabel(){return eo[this.lang]||this.lang.toUpperCase()}},methods:{copy(){var e;(e=navigator.clipboard)==null||e.writeText(this._cleanCode).then(()=>{this.copied=!0,setTimeout(()=>{this.copied=!1},1800)})}},onMount(){const e=this.$refs.el;e&&(this._cleanCode=to(this.code),e.textContent=this._cleanCode,Kt.highlightElement(e))}},ge="Courvux",no="https://vanjexdev.github.io/courvux";function Z({title:e,description:t,slug:o="/"}){const s=e?`${e} — ${ge}`:`${ge} — Lightweight reactive UI framework`,a=no+o;return Vt({title:e??`${ge} — Lightweight reactive UI framework`,titleTemplate:e?`%s — ${ge}`:void 0,meta:[{name:"description",content:t},{property:"og:title",content:s},{property:"og:description",content:t},{property:"og:type",content:"website"},{property:"og:url",content:a},{property:"og:site_name",content:ge},{name:"twitter:card",content:"summary_large_image"},{name:"twitter:title",content:s},{name:"twitter:description",content:t}],link:[{rel:"canonical",href:a}]})}const ro={data:{install:`# From GitHub — pin a tag for stable installs
pnpm add github:vanjexdev/courvux#v0.5.3

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
                    <span class="badge">v0.5.3</span>
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
    `,onMount(){Z({description:"Lightweight reactive UI framework for the browser. No virtual DOM. Proxy-based reactivity. ~20 KB gzip with everything (router, store, devtools, composables, useHead, SSR).",slug:"/"})}},ao={data:{s1:`# Latest commit on main (rolling)
pnpm add github:vanjexdev/courvux

# Pin to a tagged release (recommended for production)
pnpm add github:vanjexdev/courvux#v0.5.3`,s2:`<script type="importmap">
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
    "courvux": "https://cdn.jsdelivr.net/gh/vanjexdev/courvux@v0.5.3/dist/index.js"
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
    `},io={data:{s1:`import { createApp } from 'courvux';

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
    `,onMount(){Z({title:"Quick Start",description:"Build your first reactive Courvux app — counter example, methods, computed properties.",slug:"/quick-start"})}},so={data:{s_interp:`<!-- Text interpolation -->
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
    `,onMount(){Z({title:"Template Syntax",description:"Courvux directives and bindings: cv-if, cv-for, cv-model, cv-show, :class, :style, @event.",slug:"/template"})}},co={data:{s_define:`createApp({
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
    `,onMount(){Z({title:"Components",description:"Define, register, and compose Courvux components with props, slots, emits, and scoped slots.",slug:"/components"})}},lo={data:{s_computed:`{
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
    `,onMount(){Z({title:"Reactivity",description:"Proxy-based reactive state, computed properties, watchers, and refs in Courvux.",slug:"/reactivity"})}},uo={data:{s1:`{
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
    `,onMount(){Z({title:"Lifecycle Hooks",description:"onMount, onBeforeUnmount, onDestroy, error boundaries, and async data in Courvux.",slug:"/lifecycle"})}},po={data:{s_storage:`import { cvStorage } from 'courvux';

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
    `,onMount(){Z({title:"Composables",description:"Author and reuse logic in Courvux with defineComposable + useComposables, plus the built-in cvStorage, cvFetch, cvDebounce, cvThrottle, cvMediaQuery, cvListener helpers.",slug:"/composables"})}},mo={data:{s_basic:`import { createEventBus } from 'courvux';

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
    `,onMount(){Z({title:"Event Bus",description:"Typed cross-component event bus in Courvux: on, off, emit, once, clear, and provide/inject patterns.",slug:"/event-bus"})}},ho={data:{s_setup:`import { createApp, createRouter } from 'courvux';

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
    `,onMount(){Z({title:"Router",description:"SPA routing in Courvux: dynamic params, nested routes, navigation guards, transitions.",slug:"/router"})}},fo={data:{s1:`import { createStore } from 'courvux';

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
    `,onMount(){Z({title:"Store",description:"Global reactive state in Courvux with createStore, modules, and namespaced actions.",slug:"/store"})}},go={data:{s_basic:`import { useHead } from 'courvux';

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
    `,onMount(){Z({title:"useHead — SEO and metadata",description:"Per-component head management with useHead in Courvux: title, meta tags, Open Graph, JSON-LD, htmlAttrs.",slug:"/head"})}},vo={data:{s_vite:`// vite.config.js
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
    `,onMount(){Z({title:"Static Site Generation",description:"Pre-render every route to static HTML at build time with the courvux/plugin/ssg Vite plugin.",slug:"/ssg"})}},bo={data:{s_setup:`import { createApp, setupDevTools, mountDevOverlay } from 'courvux';

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
    `,onMount(){Z({title:"DevTools",description:"In-app DevTools overlay for Courvux: live component state inspection and inline editing, no browser extension needed.",slug:"/devtools"})}},yo={data:{s_basic:`import { mount } from 'courvux/test-utils';
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
    `,onMount(){Z({title:"Testing",description:"Vitest-compatible test utility for Courvux. Mount components, drive state, query the DOM with happy-dom.",slug:"/testing"})}},xo={data:{s_manifest:`{
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
    `,onMount(){Z({title:"Progressive Web App",description:"Make any Courvux app installable and offline-capable: manifest, vite-plugin-pwa, install prompt utility.",slug:"/pwa"})}},wo={data:{s_dir:`// Full definition
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
    `,onMount(){Z({title:"Advanced",description:"Custom directives, plugins, transitions, and the cv-data inline scope in Courvux.",slug:"/advanced"})}},ko={template:`
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
    `,onMount(){Z({title:"Design decisions",description:"Why Courvux uses Proxy over signals, Options API over Composition, no Virtual DOM, embedded DevTools, cv- prefix, and SSG over per-request SSR. Trade-offs documented.",slug:"/design-decisions"})}},So={data:{s_keyed:`<!-- Without :key, every state change rebuilds the whole list -->
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
    `,onMount(){Z({title:"FAQ",description:"Frequently asked questions and troubleshooting for Courvux: cv-for keys, strict CSP, TypeScript, lazy loading, Vite/Tauri integration, testing, migration.",slug:"/faq"})}},Ao={data:{s_component_vue:`// Vue 3 — Options API
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
                    <tr><td><code>v-html</code></td><td><code>cv-html</code> (also <code>cv-html.sanitize</code>)</td></tr>
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
    `,onMount(){Z({title:"Migrating from Vue",description:"Mapping table from Vue 3 Options API to Courvux: directives, lifecycle hooks, props, emits, router, Pinia store. Surgical migration, mostly identical syntax.",slug:"/migrating-from-vue"})}},Co={data:{s_xdata:`<!-- Alpine -->
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
                    <tr><td><code>x-html="..."</code></td><td><code>cv-html</code> (also <code>cv-html.sanitize</code>)</td></tr>
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
    `,onMount(){Z({title:"Migrating from Alpine",description:"Mapping table from Alpine.js to Courvux: x-data → cv-data, directives, named components, stores. Mostly identical syntax with a prefix swap.",slug:"/migrating-from-alpine"})}},vt="courvux-demo-todos",Eo=`const STORAGE_KEY = 'courvux-demo-todos';

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
};`,To=`<!-- Input -->
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
<button cv-show="todos.some(t => t.done)" @click="clearCompleted()">Clear completed</button>`;function _o(){try{return JSON.parse(localStorage.getItem(vt))||[]}catch{return[]}}function $o(e){localStorage.setItem(vt,JSON.stringify(e))}const Oo={data:{todos:_o(),newTodo:"",filter:"all",editingId:null,editText:"",_nextId:Date.now(),srcJs:Eo,srcHtml:To,srcTab:"js"},computed:{filteredTodos(){return this.filter==="active"?this.todos.filter(e=>!e.done):this.filter==="completed"?this.todos.filter(e=>e.done):this.todos},remaining(){return this.todos.filter(e=>!e.done).length},allDone(){return this.todos.length>0&&this.todos.every(e=>e.done)}},watch:{todos:{deep:!0,handler(e){$o(e)}}},methods:{add(){const e=this.newTodo.trim();e&&(this.todos=[...this.todos,{id:this._nextId++,text:e,done:!1}],this.newTodo="")},toggle(e){this.todos=this.todos.map(t=>t.id===e?{...t,done:!t.done}:t)},remove(e){this.todos=this.todos.filter(t=>t.id!==e)},clearCompleted(){this.todos=this.todos.filter(e=>!e.done)},toggleAll(){const e=this.allDone;this.todos=this.todos.map(t=>({...t,done:!e}))},startEdit(e){this.editingId=e.id,this.editText=e.text,this.$nextTick(()=>{var t;return(t=this.$refs["edit_"+e.id])==null?void 0:t.focus()})},commitEdit(e){const t=this.editText.trim();t?this.todos=this.todos.map(o=>o.id===e?{...o,text:t}:o):this.remove(e),this.editingId=null,this.editText=""},cancelEdit(){this.editingId=null,this.editText=""},setFilter(e){this.filter=e}},template:`
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
    `,onMount(){Z({title:"Demo — TODO App",description:"Interactive TODO app built with Courvux. Live demo with full source code (JS + HTML).",slug:"/demo"})}},Fo=[{path:"/",component:ro},{path:"/installation",component:ao},{path:"/quick-start",component:io},{path:"/template",component:so},{path:"/components",component:co},{path:"/reactivity",component:lo},{path:"/lifecycle",component:uo},{path:"/composables",component:po},{path:"/event-bus",component:mo},{path:"/router",component:ho},{path:"/store",component:fo},{path:"/head",component:go},{path:"/ssg",component:vo},{path:"/devtools",component:bo},{path:"/testing",component:yo},{path:"/pwa",component:xo},{path:"/advanced",component:wo},{path:"/design-decisions",component:ko},{path:"/faq",component:So},{path:"/migrating-from-vue",component:Ao},{path:"/migrating-from-alpine",component:Co},{path:"/demo",component:Oo}],jo={methods:{goBack(){window.history.back()}},template:`
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
    `,onMount(){Z({title:"404 — Page not found",description:"The page you are looking for does not exist on Courvux docs.",slug:"/404"})}};let Re=null;function Po(e){Re=e}const Do=jt([...Fo,{path:"*",component:jo}],{mode:"history",base:"/courvux",afterEach(){Re&&Re()},scrollBehavior:()=>{var e;return(e=document.querySelector("main"))==null||e.scrollTo({top:0,behavior:"instant"}),{x:0,y:0}}}),dt=[{key:"start",label:"Getting Started",items:[{to:"/",label:"Introduction"},{to:"/installation",label:"Installation"},{to:"/quick-start",label:"Quick Start"}]},{key:"template",label:"Template Syntax",items:[{to:"/template",label:"Directives & Bindings"}]},{key:"components",label:"Components",items:[{to:"/components",label:"Components"},{to:"/reactivity",label:"Reactivity"},{to:"/lifecycle",label:"Lifecycle"},{to:"/composables",label:"Composables"},{to:"/event-bus",label:"Event Bus"}]},{key:"router",label:"Router & Store",items:[{to:"/router",label:"Router"},{to:"/store",label:"Store"}]},{key:"seo",label:"SEO & SSG",items:[{to:"/head",label:"useHead"},{to:"/ssg",label:"Static Generation"}]},{key:"tooling",label:"Tooling",items:[{to:"/devtools",label:"DevTools"},{to:"/testing",label:"Testing"},{to:"/pwa",label:"PWA"}]},{key:"advanced",label:"Advanced",items:[{to:"/advanced",label:"Directives & Plugins"}]},{key:"reference",label:"Reference",items:[{to:"/design-decisions",label:"Design Decisions"},{to:"/faq",label:"FAQ & Troubleshooting"},{to:"/migrating-from-vue",label:"Migrating from Vue"},{to:"/migrating-from-alpine",label:"Migrating from Alpine"}]},{key:"demo",label:"Demo",items:[{to:"/demo",label:"⚡ TODO App"}]}];Yt({router:Do,components:{"code-block":oo},data:{nav:dt,open:dt.reduce((e,t)=>(e[t.key]=!0,e),{}),sidebarOpen:!1},methods:{toggle(e){this.open={...this.open,[e]:!this.open[e]}},toggleSidebar(){if(this.sidebarOpen=!this.sidebarOpen,this.sidebarOpen)document.body.style.overflow="hidden",this.$nextTick(()=>{const e=document.querySelector(".sidebar");e&&(e.style.transform="translateX(0)")});else{document.body.style.overflow="";const e=document.querySelector(".sidebar");e&&(e.style.transform="translateX(-100%)")}},closeSidebar(){if(window.innerWidth<=1024){this.sidebarOpen=!1,document.body.style.overflow="";const e=document.querySelector(".sidebar");e&&(e.style.transform="translateX(-100%)")}}},onMount(){Po(()=>{this.closeSidebar()})},onBeforeMount(){typeof window<"u"&&window.addEventListener("resize",()=>{if(window.innerWidth>1024&&this.sidebarOpen){this.sidebarOpen=!1,document.body.style.overflow="";const e=document.querySelector(".sidebar");e&&(e.style.transform="")}})},template:`
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
                    <router-link to="/" @click="closeSidebar()" style="text-decoration:none; display:flex; align-items:center; gap:8px;" aria-label="Courvux v0.5.3 home">
                        <span style="font-size:1.3rem;" aria-hidden="true">⚡</span>
                        <span style="font-weight:700; font-size:15px; color:#111;">Courvux</span>
                        <span style="font-size:10px; color:#666; margin-left:2px;">v0.5.3</span>
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
