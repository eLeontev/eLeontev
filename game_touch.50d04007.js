parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"VXXF":[function(require,module,exports) {
"use strict";var e;Object.defineProperty(exports,"__esModule",{value:!0}),function(e){e[e.clockwise=-1]="clockwise",e[e["сСlockwise"]=1]="сСlockwise"}(e=exports.direction||(exports.direction={}));
},{}],"GXGn":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.getRadians=function(e){return Math.PI/180*e};
},{}],"pT8Q":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.randomIntegerInRange=function(e,r){return Math.floor(e+Math.random()*(r+1-e))};
},{}],"Ztbj":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("../model/game.model"),n=require("../helpers/radiant-transformer"),t=require("../helpers/randomizer"),i=e.direction.clockwise,o=e.direction.сСlockwise,a=document.body.getClientRects(),r=a[0],d=r.width,c=r.height,s=d>c?c:d,l=s/2,u=.9*l,g=u/3,h=20,f={x:l,y:l},m=f.x,v=f.y,y=179,k=document.getElementById("canvas"),b=k.getContext("2d");b.canvas.width=s,b.canvas.height=s,b.canvas.style.backgroundColor="white";var R,P=function(e){e.beginPath(),e.lineWidth=1,e.strokeStyle="black",e.lineJoin="bevel",e.arc(m,v,u,0,n.getRadians(360)),e.stroke(),e.beginPath(),e.arc(m,v,g,0,n.getRadians(360)),e.stroke()},I=i,w=function(e){document.addEventListener("click",e),document.addEventListener("keydown",e)},M=function(e,t,i){var o=n.getRadians(e),a=u*Math.sin(o)+m,r=u*Math.cos(o)+v;t.beginPath(),t.lineWidth=4,t.lineJoin="round",t.strokeStyle=i,t.moveTo(m,v),t.lineTo(a,r),t.stroke()},x=function(e,n){return n===i?e<=0?360:e:e>=360?0:e},E=function(e){M(y,e,"blue"),y=x(y+I,I)},p=function(e){var i=Math.abs(e%360)+h+360-h,o=t.randomIntegerInRange(h,i)%360,a=t.randomIntegerInRange(g,.9*u),r=t.randomIntegerInRange(.1*g,.4*g),d=n.getRadians(o),c=a*Math.sin(d)+m,s=a*Math.cos(d)+v,l=180*Math.atan(r/a)/Math.PI;return{xPosition:c,yPosition:s,enemyRadius:r,middlePointAngle:o,enemyAngleRange:[o-l,o+l]}},L=function(e,t){R||(R=p(e));var i=R.xPosition,o=R.yPosition,a=R.enemyRadius;t.beginPath(),t.lineWidth=1,t.strokeStyle="red",t.arc(i,o,a,0,n.getRadians(360)),t.stroke()},S=function(e){e.beginPath(),e.fillStyle="white",e.fillRect(0,0,s,s)},q=function(){setInterval(function(){S(b),P(b),E(b),L(y,b)},10)},A=function(){if(R){var e=R.enemyAngleRange,n=e[0],t=e[1],i=360===y?0:y;i>n&&i<t&&(R=null)}},C=function(){I=I===i?o:i,A()},W=!1,B=function(e){var n=document.getElementById("button");n&&(n.addEventListener("keydown",function(e){return e.preventDefault()}),n.addEventListener("click",function(){W||(W=!0,e(),document.body.focus())}))};w(C),B(q);
},{"../model/game.model":"VXXF","../helpers/radiant-transformer":"GXGn","../helpers/randomizer":"pT8Q"}],"QCba":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),require("./src/game/");
},{"./src/game/":"Ztbj"}]},{},["QCba"], null)
//# sourceMappingURL=game_touch.50d04007.js.map