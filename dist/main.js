!function(t){var e={};function i(n){if(e[n])return e[n].exports;var s=e[n]={i:n,l:!1,exports:{}};return t[n].call(s.exports,s,s.exports,i),s.l=!0,s.exports}i.m=t,i.c=e,i.d=function(t,e,n){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},i.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var s in t)i.d(n,s,function(e){return t[e]}.bind(null,s));return n},i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="./",i(i.s=0)}([function(t,e,i){"use strict";i.r(e);i(1);function n(t){var e=this,i=function(){function t(t){t.type;var e=t.origin,i=void 0===e?0:e,n=t.range,s=void 0===n?100:n,r=t.start,o=void 0===r?0:r,a=t.end,l=void 0===a?null:a,h=t.step,d=void 0===h?1:h,c=t.list,u=void 0===c?[]:c;this.range=s,this.origin=i,this.step=d,u[0]&&(this.range=u.length-1,this.origin=0,this.step=1),this._start=Math.max(o-i,0),this._end=null===l?s:Math.min(s,Math.max(this.start,l-i)),this.value=[this.start+this.origin,this.end+this.origin]}return Object.defineProperty(t.prototype,"start",{get:function(){return this._start},set:function(t){"range"==this.type?this._start=Math.min(this.end-this.step,Math.max(t,0)):this._start=Math.min(this.end,Math.max(t,0))},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"end",{get:function(){return this._end},set:function(t){"range"==this.type?this._end=Math.max(this.start+this.step,Math.min(t,this.range)):this._end=Math.max(this.start,Math.min(t,this.range))},enumerable:!1,configurable:!0}),t.prototype.update=function(t){if("direct"==t.method)t.endPos&&(this.end=t.endPos-this.origin),t.startPos&&(this.start=t.startPos-this.origin);else if("tepping"==t.method)t.startPos&&(this.start+=t.startPos*this.step),t.endPos&&(this.end+=t.endPos*this.step);else if("scaleClick"==t.method)"point"==this.type||Math.abs(t.startPos-this.end)<=Math.abs(t.startPos-this.start)?this.end=t.startPos:this.start=t.startPos;else{var e=this.range/100*t.startPos,i=this.range/100*t.endPos;(i-this.end>=.7*this.step||this.end-i>=.7*this.step||i==this.range)&&(this.end=Math.round(i/this.step)*this.step),(e-this.start>=.7*this.step||this.start-e>=.7*this.step||0==e)&&(this.start=Math.round(e/this.step)*this.step)}"range"==this.type&&(this.start=0),this.value=[this.start+this.origin,this.end+this.origin],this.updated(100/this.range*this.start,100/this.range*this.end)},t}(),n=function(){function t(t){var e=t.orient,i=void 0===e?"horizontal":e;this.inversion="vertical"===i}return t.prototype.shiftReac=function(t){this.inversion&&!t.method&&(t.endPos&&(t.endPos=100-t.endPos),t.startPos&&(t.startPos=100-t.startPos)),this.callToModel(t)},t.prototype.updateReact=function(t,e){this.callToView(t,e)},t}(),s=function(){function t(t){var i=t.orient,n=void 0===i?"horizontal":i,s=t.type,r=void 0===s?"range":s,o=t.origin,a=void 0===o?0:o,l=t.range,h=void 0===l?100:l,d=t.meanings,c=void 0===d||d,u=t.cloud,g=void 0===u?"click":u,p=t.scaleInterval,m=void 0===p?10:p,f=t.list,v=void 0===f?[]:f;this.meaningsClass=function(){function t(t){this.orient=t.orient,this.origin=t.origin,this.range=t.range,this.interval=t.interval,this.list=t.list,this.list[0]&&(this.origin=0,this.range=this.list.length-1,this.interval=1),this.html="<div class='RangeSlider__meanings RangeSlider__meanings_for_"+this.orient+"'></div>"}return t.prototype.render=function(t){var i=this,n=Boolean(this.list[0]),s=this.element=e.querySelector(".RangeSlider__meanings"),r=Math.ceil(this.range/this.interval),o=document.createElement("div");o.classList.add("Meaninigs__mainline"),o.classList.add("Meaninigs__mainline_for_"+this.orient),s.append(o);var a=document.createElement("span");a.classList.add("Meaninigs__cell"),a.classList.add("Meaninigs__cell_for_"+this.orient),"vertical"==this.orient?a.style.height=this.interval/this.range*100+"%":a.style.width=this.interval/this.range*100+"%";var l=function(t){var e=a.cloneNode(!0);e.classList.add("Meaninigs__cell_meaning_"+t),e.setAttribute("value",""+t);var s=document.createElement("span");return s.innerHTML=n?i.list[t]:t.toString(),e.append(s),o.append(e),e};l(this.origin);for(var h=1;h<r;h++)h!==r-1?l(h*this.interval+this.origin):l(h*this.interval+this.origin).style.flexShrink="1";"vertical"==this.orient?l(this.range+this.origin).style.height="0px":l(this.range+this.origin).style.width="0px",this.element.onclick=function(e){if(e.target.closest(".Meaninigs__cell>span")){var n=+e.target.closest(".Meaninigs__cell").getAttribute("value")-i.origin;t({startPos:n,method:"scaleClick"})}}},t.prototype.update=function(t,e){var i=this;this.element.querySelectorAll(".Meaninigs__cell").forEach((function(n){var s=n,r=+n.getAttribute("value");r>=i.range/100*t+i.origin&&r<=i.range/100*e+i.origin?s.classList.add("Meaninigs__cell_status_active"):s.classList.remove("Meaninigs__cell_status_active")}))},t}(),this.LineClass=function(){function t(t){this.orient=t.orient}return t.prototype.render=function(){this.element=e.querySelector(".RangeSlider__line")},t}(),this.TumblerClass=function(){function t(t){this.orient=t.orient,this.type=t.type,this.cloud=t.cloud,this.html='<span tabindex= "1"; class=\'RangeSlider__tumbler RangeSlider__tumbler_for_'+this.orient+"'> </span>"}return t.prototype.render=function(t){var i=this;this.elements=e.querySelectorAll(".RangeSlider__tumbler"),this.elements.forEach((function(n,s){var r,o=n;"point"===i.type&&0===s&&(o.style.display="none"),(r=document.createElement("div")).classList.add("RangeSlider__cloud"),r.classList.add("RangeSlider__cloud_for_"+i.orient),r.append(document.createElement("b")),r.append(document.createElement("div")),n.append(r),"always"!==i.cloud&&(r.style.display="none"),o.onmousedown=function(n){n.preventDefault(),"click"==i.cloud&&(r.style.display="block"),e.onmousemove=function(s){var r=n.target,o=e.querySelector(".RangeSlider"),a="vertical"===i.orient?(s.clientY-o.getBoundingClientRect().y)/o.getBoundingClientRect().height*100:(s.clientX-o.getBoundingClientRect().x)/o.getBoundingClientRect().width*100;r.nextSibling?t({startPos:a}):t({endPos:a})},document.onmouseup=function(t){"click"==i.cloud&&(r.style.display="none"),e.onmousemove=null,document.onmouseup=null}},o.onfocus=function(e){"click"==i.cloud&&(r.style.display="block");var n=e.target;document.onkeydown=function(e){"ArrowDown"===e.key&&"vertical"===i.orient||"ArrowLeft"===e.key&&"vertical"!==i.orient?n.nextSibling?t({startPos:-1,method:"tepping"}):t({endPos:-1,method:"tepping"}):("ArrowUp"===e.key&&"vertical"===i.orient||"ArrowRight"===e.key&&"vertical"!==i.orient)&&(n.nextSibling?t({startPos:1,method:"tepping"}):t({endPos:1,method:"tepping"}))},e.target.onblur=function(t){"click"==i.cloud&&(r.style.display="none"),document.onkeydown=null,t.target.onblur=null}}}))},t.prototype.update=function(t,e,i,n){var s=this.elements[0],r=this.elements[1];"vertical"==this.orient?(s.style.bottom=t+"%",r.style.bottom=e+"%"):(s.style.left=t+"%",r.style.left=e+"%"),s.querySelector("b").innerText=i,r.querySelector("b").innerText=n},t}(),this.SelectedClass=function(){function t(t){this.orient=t.orient,this.html="<div class='RangeSlider__selected RangeSlider__selected_for_"+this.orient+"'></div>"}return t.prototype.render=function(){this.element=e.querySelector(".RangeSlider__selected")},t.prototype.update=function(t,e){"vertical"==this.orient?(this.element.style.bottom=t+"%",this.element.style.top=100-e+"%"):(this.element.style.left=t+"%",this.element.style.right=100-e+"%")},t}(),this.element,this.orient=n,this.meaningsDisplay=c,this.tumbler=new this.TumblerClass({orient:n,type:r,cloud:g}),this.line=new this.LineClass({orient:n}),this.selected=new this.SelectedClass({orient:n}),this.meanings=new this.meaningsClass({list:v,orient:n,origin:a,range:h,interval:m})}return t.prototype.render=function(){e.innerHTML="<div class='RangeSlider RangeSlider_for_"+this.orient+"'><div class='RangeSlider__line RangeSlider__line_for_"+this.orient+"'> "+this.selected.html+this.tumbler.html+this.tumbler.html+"</div> "+this.meanings.html+" </div></div>",this.line.render(),this.meanings.render(this.tumblerShifted),this.meaningsDisplay||(this.meanings.element.style.display="none"),this.tumbler.render(this.tumblerShifted),this.selected.render(),this.element=e.querySelector(".RangeSlider")},t.prototype.viewUpdate=function(t,e){var i=(this.meanings.range/100*t+this.meanings.origin).toFixed(),n=(this.meanings.range/100*e+this.meanings.origin).toFixed();this.meanings.list[0]&&(i=this.meanings.list[+i],n=this.meanings.list[+n]),this.tumbler.update(t,e,i,n),this.selected.update(t,e),this.meanings.update(t,e)},t}();return{Model:new i(t),Presenter:new n(t),View:new s(t),init:function(){this.View.tumblerShifted=this.Presenter.shiftReac.bind(this.Presenter),this.Presenter.callToModel=this.Model.update.bind(this.Model),this.Model.updated=this.Presenter.updateReact.bind(this.Presenter),this.Presenter.callToView=this.View.viewUpdate.bind(this.View),this.View.render(),this.Presenter.shiftReac({})},getValue:function(){return console.log("Selected range: "+this.Model.value[0]+" — "+this.Model.value[1]),this.Model.value},setValue:function(t,e){this.Presenter.shiftReac({startPos:t,endPos:e,method:"direct"})}}}var s=document.querySelector(".wrapper>div"),r=document.querySelector(".wrapper-two>div"),o=document.querySelector(".wrapper-three>div"),a=document.querySelector(".wrapper-list>div"),l=n.call(s,{type:"range",start:20,end:80,step:1,meanings:!1,cloud:"always"}),h=n.call(r,{type:"point",origin:10,range:90,end:10,step:5,scaleInterval:20}),d=n.call(o,{type:"point",orient:"vertical",origin:0,scaleInterval:5,range:10,end:5}),c=n.call(a,{type:"range",list:["ἄ","β","γ","λ","Ξ","ζ","π","θ","ψ"],end:2,cloud:"none"});l.init(),h.init(),d.init(),c.init()},function(t,e,i){}]);