!function(e){var t={};function s(i){if(t[i])return t[i].exports;var n=t[i]={i:i,l:!1,exports:{}};return e[i].call(n.exports,n,n.exports,s),n.l=!0,n.exports}s.m=e,s.c=t,s.d=function(e,t,i){s.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:i})},s.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},s.t=function(e,t){if(1&t&&(e=s(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var i=Object.create(null);if(s.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)s.d(i,n,function(t){return e[t]}.bind(null,n));return i},s.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return s.d(t,"a",t),t},s.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},s.p="./",s(s.s=2)}([function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.CLICK=t.ALWAYS=t.NONE=t.HORIZONTAL=t.VERTICAL=t.RANGE=t.POINT=t.STRIDE=t.SCALE_CLICK=t.DRAG=t.DIRECT=void 0,t.DIRECT="direct",t.DRAG="drag",t.SCALE_CLICK="scaleClick",t.STRIDE="stride",t.POINT="point",t.RANGE="range",t.VERTICAL="vertical",t.HORIZONTAL="horizontal",t.NONE="none",t.ALWAYS="always",t.CLICK="click"},function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.default=class{constructor(){this.subscribe=e=>{this.observers.push(e)},this.unsubscribe=e=>{this.observers=this.observers.filter(t=>t!==e)},this.broadcast=(...e)=>{this.observers.forEach(t=>t(...e))},this.observers=[]}}},function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const i=s(0),n=s(3),a=s(9),r=s(10),o=s(11),l=s(1),c=void(jQuery.fn.rangeSlider=function(e){return new d(this[0],e)});class d{constructor(e,t){this.configChangeObserver=new l.default,this.getConfig=()=>this.config.getData(),this.changeConfig=e=>{const t=this.config.getData();this.config.setData(e);const s=this.config.getData();this.configChangeObserver.broadcast(t,s)},this.addValuesUpdateListener=e=>{this.model.addValuesUpdateListener(e)},this.removeValuesUpdateListener=e=>{this.model.removeValuesUpdateListener(e)},this.addConfigChangeListener=e=>this.configChangeObserver.subscribe(e),this.removeConfigChangeListener=e=>this.configChangeObserver.unsubscribe(e),this.root=e,this.config=new o.default(t),this.model=new a.default(this.config),this.view=new n.default(this.root,this.config),this.presenter=new r.default(this.view,this.model),this.addConfigChangeListener(()=>{this.reRender()}),this.addConfigChangeListener((e,t)=>{e.step!==t.step&&this.model.adaptValues()});const{start:s,end:i}=this.config.getData();this.model.updateDirectly({startPosition:s,endPosition:i})}getValues(){return this.model.getValues()}setValues(e,t){const{type:s}=this.config.getData();s===i.POINT?this.model.updateDirectly({endPosition:e}):this.model.updateDirectly({startPosition:e,endPosition:t})}reRender(){this.view.render(),this.model.updateDirectly({})}}t.default=c},function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),s(4);const i=s(1),n=s(5),a=s(6),r=s(7),o=s(8);t.default=class{constructor(e,t){this.observer=new i.default,this.root=e,this.config=t,this.render()}render(){const{root:e,config:t}=this,{orient:s}=t.getData(),i=document.createElement("div");i.className="range-slider  js-range-slider  range-slider_orient_"+s,this.element=i,this.line=new o.default(t,i,this.observer.broadcast),this.scale=new r.default(t,i,this.observer.broadcast),this.tumblers=new n.default(t,this.line.element,this.observer.broadcast),this.indicator=new a.default(t,this.line.element),e.innerHTML="",e.append(this.element)}updateView(e){const{start:t,end:s}=e.coordinates,{start:i,end:n}=e.values;this.tumblers.update(t,s,i,n),this.indicator.update(t,s),this.scale.update(i,n)}}},function(e,t,s){},function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const i=s(0);t.default=class{constructor(e,t,s){this.render=()=>{const{orient:e,type:t}=this.config.getData(),s=[];for(let n=0;n<2;n+=1){const a=document.createElement("div");a.className="js-range-slider__tumbler range-slider__tumbler  range-slider__tumbler_orient_"+e,a.tabIndex=0;const r=this.createCloud();a.append(r),a.addEventListener("mousedown",this.handleTumblerMousedown),a.addEventListener("keydown",this.handlerTumblerKeydown),a.addEventListener("focus",this.handleTumblerFocus),t===i.POINT&&0===n&&(a.style.display="none"),s.push(a)}this.elements=s,this.elements.forEach(e=>{this.parent.append(e)})},this.handleTumblerMousedown=e=>{e.preventDefault();const{cloud:t}=this.config.getData(),s=e.target.closest(".js-range-slider__tumbler"),n=s.querySelector(".js-range-slider__cloud "),a=s===this.elements[0];t===i.CLICK&&(n.style.display="block"),document.body.style.cursor="pointer";const r=e=>{this.handlerDocumentMove(e,a)};document.addEventListener("mousemove",r),document.addEventListener("click",e=>{e.preventDefault(),e.stopPropagation(),t===i.CLICK&&(n.style.display="none"),document.body.style.cursor="auto",document.removeEventListener("mousemove",r)},{capture:!0,once:!0})},this.handleTumblerFocus=e=>{const{cloud:t}=this.config.getData(),s=e.target,n=s.querySelector(".js-range-slider__cloud ");t===i.CLICK&&(n.style.display="block"),s.onblur=e=>{t===i.CLICK&&(n.style.display="none"),e.target.onblur=null}},this.handlerTumblerKeydown=e=>{const{callback:t}=this,{orient:s}=this.config.getData(),n=e.target===this.elements[0];"ArrowDown"===e.key&&s===i.VERTICAL||"ArrowLeft"===e.key&&s!==i.VERTICAL?(t(i.STRIDE,n?{startPosition:-1}:{endPosition:-1}),e.preventDefault()):("ArrowUp"===e.key&&s===i.VERTICAL||"ArrowRight"===e.key&&s!==i.VERTICAL)&&(t(i.STRIDE,n?{startPosition:1}:{endPosition:1}),e.preventDefault())},this.handlerDocumentMove=(e,t)=>{const{orient:s}=this.config.getData(),n=this.elements[0].closest(".js-range-slider"),a=(n.getBoundingClientRect().bottom-e.clientY)/n.getBoundingClientRect().height*100,r=(e.clientX-n.getBoundingClientRect().left)/n.getBoundingClientRect().width*100,o=s===i.VERTICAL?a:r;t?this.callback(i.DRAG,{startPosition:o}):this.callback(i.DRAG,{endPosition:o})},this.createCloud=()=>{const{orient:e,cloud:t}=this.config.getData(),s=document.createElement("div");s.className="js-range-slider__cloud range-slider__cloud  range-slider__cloud_orient_"+e;const n=document.createElement("b");return n.className="js-range-slider__cloud-value range-slider__cloud-value",s.append(n),t!==i.ALWAYS&&(s.style.display="none"),s},this.updateClouds=(e,t)=>{const{elements:s}=this,{list:i}=this.config.getData();let n,a;i.length?(n=i[e].toString(),a=i[t].toString()):(n=e.toLocaleString(),a=t.toLocaleString()),s[0].querySelector(".js-range-slider__cloud-value").innerText=n,s[1].querySelector(".js-range-slider__cloud-value").innerText=a},this.config=e,this.parent=t,this.callback=s,this.render()}update(e,t,s,n){const{orient:a}=this.config.getData(),r=this.elements[0],o=this.elements[1];a===i.VERTICAL?(r.style.top=100-e+"%",o.style.top=100-t+"%"):(r.style.left=e+"%",o.style.left=t+"%"),100===e?(r.style.zIndex="11",o.style.zIndex="12"):100===t?(r.style.zIndex="12",o.style.zIndex="11"):(r.style.zIndex="11",o.style.zIndex="11"),this.updateClouds(s,n)}}},function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const i=s(0);t.default=class{constructor(e,t){this.config=e,this.parent=t,this.render()}render(){const{orient:e}=this.config.getData(),t=document.createElement("div");t.className="range-slider__indicator  range-slider__indicator_orient_"+e,this.element=t,this.parent.append(this.element)}update(e,t){const{orient:s}=this.config.getData(),n=this.element;s===i.VERTICAL?(n.style.bottom=e+"%",n.style.top=100-t+"%"):(n.style.left=e+"%",n.style.right=100-t+"%")}}},function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const i=s(0);t.default=class{constructor(e,t,s){this.render=()=>{const{orient:e,scaleInterval:t,rangeStart:s,rangeOffset:n,scale:a}=this.config.getData(),r=Math.ceil(n/t),o=document.createElement("div");o.className="js-range-slider__scale range-slider__scale  range-slider__scale_orient_"+e,o.append(this.createDivision(s));for(let e=1;e<r;e+=1)if(e!==r-1&&1!==r)o.append(this.createDivision(e*t+s));else{const i=this.createDivision(e*t+s);i.style.flexShrink="1",o.append(i)}const l=this.createDivision(n+s);e===i.VERTICAL?l.style.height="0px":l.style.width="0px",o.append(l),a||(o.style.display="none"),this.element=o,this.parent.append(this.element)},this.handlerDivisionClick=e=>{const{orient:t,type:s}=this.config.getData(),n=e.target.closest(".js-range-slider__scale-division"),a=t===i.VERTICAL?n.offsetTop+n.offsetHeight:n.offsetLeft,r=t===i.VERTICAL?[...n.closest(".js-range-slider").querySelectorAll(".js-range-slider__tumbler")].map(e=>e.offsetTop):[...n.closest(".js-range-slider").querySelectorAll(".js-range-slider__tumbler")].map(e=>e.offsetLeft),o=Math.abs(a-r[0]),l=Math.abs(a-r[1]),c=t===i.VERTICAL?100-100/n.closest(".js-range-slider__scale").offsetHeight*a:100/n.closest(".js-range-slider__scale").offsetWidth*a;s===i.POINT||o>=l?this.callback(i.SCALE_CLICK,{endPosition:c}):this.callback(i.SCALE_CLICK,{startPosition:c})},this.handlerDivisionKeydown=e=>{if("Enter"!==e.code)return;const{orient:t,type:s}=this.config.getData(),n=e.target.closest(".js-range-slider__scale-division"),a=Number(n.getAttribute("value")),r=t===i.VERTICAL?n.offsetTop+n.offsetHeight:n.offsetLeft,o=t===i.VERTICAL?[...n.closest(".js-range-slider").querySelectorAll(".js-range-slider__tumbler")].map(e=>e.offsetTop+e.offsetHeight):[...n.closest(".js-range-slider").querySelectorAll(".js-range-slider__tumbler")].map(e=>e.offsetLeft+e.offsetWidth/2),l=Math.abs(r-o[0]),c=Math.abs(r-o[1]);s===i.POINT||l>=c?this.callback(i.SCALE_CLICK,{endPosition:a}):this.callback(i.SCALE_CLICK,{startPosition:a})},this.createDivision=e=>{const{list:t,orient:s,scaleInterval:n,rangeOffset:a}=this.config.getData(),r=t.length,o=document.createElement("span");if(o.className="js-range-slider__scale-division range-slider__scale-division  range-slider__scale-division_orient_"+s,s===i.VERTICAL){const e=Math.min(n/a*100,100);o.style.height=e+"%"}else{const e=Math.min(n/a*100,100);o.style.width=e+"%"}o.setAttribute("value",""+e.toLocaleString());const l=document.createElement("span");return l.className="range-slider__scale-value js-range-slider__scale-value",l.innerHTML=r?t[e].toString():e.toLocaleString(),l.tabIndex=0,l.addEventListener("click",this.handlerDivisionClick),l.addEventListener("keydown",this.handlerDivisionKeydown),o.append(l),this.divisions.push(o),o},this.config=e,this.parent=t,this.divisions=[],this.callback=s,this.render()}update(e,t){this.element.querySelectorAll(".js-range-slider__scale-division").forEach(s=>{const i=s,n=+s.getAttribute("value");n>=e&&n<=t?i.classList.add("range-slider__scale-division_active"):i.classList.remove("range-slider__scale-division_active")})}}},function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const i=s(0);t.default=class{constructor(e,t,s){this.handlerLineClick=e=>{const{orient:t,type:s}=this.config.getData(),n=t===i.VERTICAL?e.clientY:e.clientX,a=this.element.closest(".js-range-slider"),r=(a.getBoundingClientRect().bottom-n)/a.getBoundingClientRect().height*100,o=(n-a.getBoundingClientRect().left)/a.getBoundingClientRect().width*100,l=t===i.VERTICAL?r:o,c=t===i.VERTICAL?[...e.target.closest(".js-range-slider").querySelectorAll(".js-range-slider__tumbler")].map(e=>e.getBoundingClientRect().top+e.offsetHeight/2):[...e.target.closest(".js-range-slider").querySelectorAll(".js-range-slider__tumbler")].map(e=>e.getBoundingClientRect().left+e.offsetWidth/2),d=Math.abs(n-c[0]),h=Math.abs(n-c[1]);s===i.POINT||d>=h?this.callback(i.SCALE_CLICK,{endPosition:l}):this.callback(i.SCALE_CLICK,{startPosition:l})},this.config=e,this.parent=t,this.callback=s,this.render()}render(){const{orient:e}=this.config.getData(),t=document.createElement("div");t.className="range-slider__line  range-slider__line_orient_"+e,t.addEventListener("click",this.handlerLineClick),this.element=t,this.parent.append(this.element)}}},function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const i=s(0),n=s(1);t.default=class{constructor(e){this.updateDirectly=e=>{this.update(this.processValue,e)},this.updateFromPercent=e=>{this.update(this.processPercent,e)},this.updateFromStride=e=>{this.update(this.processStep,e)},this.adaptValues=()=>{const{step:e,rangeOffset:t,type:s}=this.config.getData();let n=this.end===t?t:Math.min(t,Math.round(this.end/e)*e),a=Math.min(t,Math.round(this.start/e)*e);if(a===n&&s!==i.POINT){Math.abs(a-this.start)<Math.abs(n-this.end)?n=Math.min(t,n+e):a=Math.ceil(n/e)*e-e}this.setValues({start:a,end:n}),this.callTheBroadcast()},this.update=(e,t)=>{const s=this.start,i=this.end,{start:n,end:a}=e(t);switch(e){case this.processValue:this.setValues({start:n,end:a}),this.callTheBroadcast();break;default:n===s&&a===i||(this.setValues({start:n,end:a}),this.callTheBroadcast())}},this.processValue=e=>{const{rangeStart:t,type:s,rangeOffset:n}=this.config.getData(),{startPosition:a,endPosition:r}=e,o=this.start,l=this.end;let c=isNaN(a)?o:a-t,d=isNaN(r)?l:r-t;return d=s===i.POINT?Math.max(0,Math.min(d,n)):Math.max(1,Math.min(d,n)),c=s===i.POINT?0:Math.min(d-1,Math.max(0,c)),{start:c,end:d}},this.processPercent=e=>{const{rangeOffset:t,step:s}=this.config.getData(),{startPosition:i,endPosition:n}=e,a=this.convertToValue(i),r=Math.round(a/s)*s,o=this.convertToValue(n),l=o>=t-t%s*.5?t:Math.round(o/s)*s;return this.accordinateTheCoordinates({start:r,end:l})},this.processStep=e=>{const{step:t}=this.config.getData(),s=this.start,i=this.end,{startPosition:n,endPosition:a}=e;let r,o;return n&&(n<0?r=Math.ceil(s/t)*t+t*n:n>0&&(r=Math.floor(s/t)*t+t*n)),a&&(a<0&&(o=Math.ceil(i/t)*t+t*a),a>0&&(o=Math.floor(i/t)*t+t*a)),this.accordinateTheCoordinates({start:r,end:o})},this.accordinateTheCoordinates=e=>{const{type:t,rangeOffset:s,step:n}=this.config.getData(),{start:a,end:r}=e,o=this.start,l=this.end;let c=isNaN(a)?o:Math.max(a,0),d=isNaN(r)?l:Math.min(r,s);const h=t===i.POINT?0:Math.max(Math.ceil(d/n)*n-n,o),u=t===i.POINT?0:Math.min(Math.floor(h/n)*n+n,l);return c=Math.min(c,h),d=Math.max(d,u),{start:c,end:d}},this.convertToPercent=e=>e/(this.config.getData().rangeOffset/100),this.convertToValue=e=>e/(100/this.config.getData().rangeOffset),this.setValues=e=>{this.start=e.start,this.end=e.end},this.callTheBroadcast=()=>{this.observer.broadcast({coordinates:{start:this.convertToPercent(this.start),end:this.convertToPercent(this.end)},values:this.getValues()})},this.config=e,this.observer=new n.default}getValues(){const{rangeStart:e}=this.config.getData();return{start:this.start+e,end:this.end+e}}addValuesUpdateListener(e){this.observer.subscribe(e)}removeValuesUpdateListener(e){this.observer.unsubscribe(e)}}},function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const i=s(0);t.default=class{constructor(e,t){this.reactToInteraction=(e,t)=>{switch(e){case i.DRAG:case i.SCALE_CLICK:this.model.updateFromPercent(t);break;case i.STRIDE:this.model.updateFromStride(t)}},this.reactToUpdate=e=>{this.view.updateView(e)},this.connectLayers=()=>{this.model.observer.subscribe(this.reactToUpdate.bind(this)),this.view.observer.subscribe(this.reactToInteraction.bind(this))},this.view=e,this.model=t,this.connectLayers()}}},function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const i=s(0),n=s(12);t.default=class{constructor(e){this.setData(e)}getData(){return Object.assign(Object.assign({},this),{list:[...this.list]})}setData(e){const{type:t,list:s,orient:a,cloud:r,scale:o,rangeStart:l,scaleInterval:c,rangeOffset:d,step:h,start:u,end:g}=e;this.type=t===i.RANGE||t===i.POINT?t:this.type||n.default.type,this.orient=a===i.VERTICAL||a===i.HORIZONTAL?a:this.orient||n.default.orient,this.cloud=r===i.NONE||r===i.ALWAYS||r===i.CLICK?r:this.cloud||n.default.cloud,this.scale=void 0!==o?o:this.scale||n.default.scale,this.rangeStart=void 0!==l?Math.round(l):this.rangeStart||n.default.rangeStart,this.rangeOffset=void 0!==d?Math.max(1,Math.round(d)):this.rangeOffset||n.default.rangeOffset,this.scaleInterval=void 0!==c?Math.min(this.rangeOffset,Math.max(1,Math.round(c))):this.scaleInterval||n.default.scaleInterval,this.step=void 0!==h?Math.min(this.rangeOffset,Math.max(1,Math.round(h))):this.step||n.default.step,s&&s.length?(this.list=s,this.rangeOffset=s.length-1,this.rangeStart=0,this.step=1,this.scaleInterval=1):this.list=this.list&&this.list.length?this.list:n.default.list,this.end=void 0!==g?g:this.end||this.rangeStart+this.rangeOffset,this.start=void 0!==u?u:this.start||this.rangeStart}}},function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const i=s(0),n={type:i.RANGE,orient:i.HORIZONTAL,cloud:i.CLICK,rangeOffset:100,rangeStart:0,scaleInterval:10,step:1,scale:!1,list:[],start:0,end:0};t.default=n}]);