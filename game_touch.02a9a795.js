parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"VXXF":[function(require,module,exports) {
"use strict";var e;Object.defineProperty(exports,"__esModule",{value:!0}),function(e){e[e.clockwise=-1]="clockwise",e[e["сСlockwise"]=1]="сСlockwise"}(e=exports.direction||(exports.direction={}));
},{}],"GXGn":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.getRadians=function(e){return Math.PI/180*e};
},{}],"ZEfQ":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.startAnglePosition=179,exports.minimumEnemyOffset=20,exports.maxEnemiesCount=10,exports.maxDelayToAddEnemyInTicks=150,exports.maxDelayInactionsInTicks=180,exports.changeDirectionTriesMessage="direction counter:",exports.countOfEnemiesMessage="count of enemies:",exports.loaderWidth=200,exports.loaderHeight=15,exports.verticalLoaderOffset=7,exports.loaderMinColor="00ff00",exports.loaderMaxColor="ff0000",exports.countOfChangeDirectionTriesMessageCoordintate={x:10,y:85},exports.countOfEnemiesMessagePositionCoordinate={x:10,y:40};
},{}],"lyTY":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var t=require("./constants"),i=function(){function i(t,i,e,a,o,n){this.canvasCtx=t,this.radius=i,this.innerRadius=e,this.canvasSize=a,this.defaultStartAngle=0,this.defaultLineWidth=1,this.pointerLineWidth=4,this.defaultLineJoin="round",this.defaultStrokeStyleColor="black",this.cleanUpBackgroundColor="white",this.enemyStrokeStyleColor="red",this.pointerStyleColor="blue",this.defaultTextColor="black",this.defaultEndAngle=o(360);var s=n.x,r=n.y;this.middleXCoordinate=s,this.middleYCoordinate=r,this.initCanvas()}return i.prototype.drowStaticGameField=function(){var t=this;[this.innerRadius,this.radius].forEach(function(i){return t.drowStrokedCircle(i)})},i.prototype.drowEnemy=function(t,i,e,a){void 0===a&&(a=this.enemyStrokeStyleColor),this.drowStrokedCircle(t,i,e,a)},i.prototype.canvasCleanUp=function(){this.canvasCtx.beginPath(),this.canvasCtx.fillStyle=this.cleanUpBackgroundColor,this.canvasCtx.fillRect(0,0,this.canvasSize,this.canvasSize)},i.prototype.drowEnemies=function(t){var i=this;t.forEach(function(t){var e=t.xPosition,a=t.yPosition,o=t.enemyRadius;return i.drowEnemy(o,e,a)})},i.prototype.drowPointer=function(t,i){this.canvasCtx.beginPath(),this.setPathView(this.pointerStyleColor,this.pointerLineWidth,this.defaultLineJoin),this.canvasCtx.moveTo(this.middleXCoordinate,this.middleYCoordinate),this.canvasCtx.lineTo(t,i),this.canvasCtx.stroke()},i.prototype.drowText=function(t,i,e){var a=i.x,o=i.y;this.canvasCtx.font="25px Arial",this.canvasCtx.fillStyle=e||this.defaultTextColor,this.canvasCtx.fillText(t,a,o)},i.prototype.drowLoader=function(i,e){var a=i.x,o=i.y,n=e.width,s=e.color,r=o+t.verticalLoaderOffset;this.canvasCtx.beginPath(),this.canvasCtx.fillStyle=s,this.canvasCtx.fillRect(a,r,n,t.loaderHeight),this.canvasCtx.beginPath(),this.canvasCtx.strokeStyle=this.defaultStrokeStyleColor,this.canvasCtx.strokeRect(a,r,t.loaderWidth,t.loaderHeight)},i.prototype.drowStrokedCircle=function(t,i,e,a,o,n,s,r){void 0===i&&(i=this.middleXCoordinate),void 0===e&&(e=this.middleYCoordinate),void 0===a&&(a=this.defaultStrokeStyleColor),void 0===o&&(o=this.defaultLineWidth),void 0===n&&(n=this.defaultStartAngle),void 0===s&&(s=this.defaultEndAngle),void 0===r&&(r=this.defaultLineJoin),this.canvasCtx.beginPath(),this.setPathView(a,o,r),this.canvasCtx.arc(i,e,t,n,s),this.canvasCtx.stroke()},i.prototype.initCanvas=function(){this.canvasCtx.canvas.width=this.canvasSize,this.canvasCtx.canvas.height=this.canvasSize,this.canvasCtx.canvas.style.backgroundColor=this.cleanUpBackgroundColor},i.prototype.setPathView=function(t,i,e){this.canvasCtx.strokeStyle=t,this.canvasCtx.lineWidth=i,this.canvasCtx.lineJoin=e},i}();exports.CanvasRenderer=i;
},{"./constants":"ZEfQ"}],"xMJR":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("./constants");exports.state={enemies:[],tickCounter:0,countOfTicksWithoutEnemyDestory:0,changeDirectionCounter:5,angle:e.startAnglePosition};
},{"./constants":"ZEfQ"}],"W8PT":[function(require,module,exports) {
var global = arguments[3];
var t=arguments[3],e=1/0,o="[object Symbol]",r="object"==typeof t&&t&&t.Object===Object&&t,n="object"==typeof self&&self&&self.Object===Object&&self,c=r||n||Function("return this")(),u=Object.prototype,f=0,i=u.toString,l=c.Symbol,b=l?l.prototype:void 0,p=b?b.toString:void 0;function y(t){if("string"==typeof t)return t;if(s(t))return p?p.call(t):"";var o=t+"";return"0"==o&&1/t==-e?"-0":o}function j(t){return!!t&&"object"==typeof t}function s(t){return"symbol"==typeof t||j(t)&&i.call(t)==o}function a(t){return null==t?"":y(t)}function m(t){var e=++f;return a(t)+e}module.exports=m;
},{}],"pT8Q":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.randomIntegerInRange=function(e,r){return Math.floor(e+Math.random()*(r+1-e))};
},{}],"Wn25":[function(require,module,exports) {
"use strict";var e=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(exports,"__esModule",{value:!0});var n=e(require("lodash.uniqueid")),t=require("../constants"),r=require("../../helpers/radiant-transformer"),a=require("../../helpers/randomizer");exports.createEnemy=function(e,i,m,s){var o=Math.abs(e%360)+t.minimumEnemyOffset+360-t.minimumEnemyOffset,u=a.randomIntegerInRange(t.minimumEnemyOffset,o)%360,d=a.randomIntegerInRange(i,.9*m),f=a.randomIntegerInRange(.1*i,.4*i),l=s.x,y=s.y,g=r.getRadians(u),h=d*Math.sin(g)+l,I=d*Math.cos(g)+y,c=180*Math.atan(f/d)/Math.PI;return{xPosition:h,yPosition:I,enemyRadius:f,middlePointAngle:u,enemyAngleRange:[u-c,u+c],enemyId:n.default("enemy-id=")}};
},{"lodash.uniqueid":"W8PT","../constants":"ZEfQ","../../helpers/radiant-transformer":"GXGn","../../helpers/randomizer":"pT8Q"}],"oEyB":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var r=require("../constants"),t=function(r){return parseInt(r,16)},n=function(r){return r.toString(16)},o=function(r){return"#"+r.padStart(6,"0")},e=function(r,t){return r/t},i=function(r,t,n){return r*(n-t)+t},u=[t(r.loaderMinColor),t(r.loaderMaxColor)],a=u[0],s=u[1];exports.getLoaderDataBasedOnCurrentLoaderCounterPosition=function(t){var u=t.position,d=t.maxPosition,c=e(u,d),l=i(c,a,s);return{width:c*r.loaderWidth,color:o(n(l))}};
},{"../constants":"ZEfQ"}],"Ztbj":[function(require,module,exports) {
"use strict";var e=this&&this.__spreadArrays||function(){for(var e=0,t=0,n=arguments.length;t<n;t++)e+=arguments[t].length;var i=Array(e),o=0;for(t=0;t<n;t++)for(var r=arguments[t],a=0,s=r.length;a<s;a++,o++)i[o]=r[a];return i};Object.defineProperty(exports,"__esModule",{value:!0});var t=require("../model/game.model"),n=require("../helpers/radiant-transformer"),i=require("./renderer"),o=require("./state"),r=require("./calculation/enemy.calculation"),a=require("./constants"),s=require("./calculation/rest-range.calculation"),c=t.direction.clockwise,u=t.direction.сСlockwise,d=document.body.getClientRects(),f=d[0],m=f.width,l=f.height,g=m>l?l:m,y=g/2,h=.9*y,v=h/3,C={x:y,y:y},D=C.x,k=C.y,E=document.getElementById("canvas"),T=E.getContext("2d"),x=new i.CanvasRenderer(T,h,v,g,n.getRadians,C),w=c,I=function(e){document.addEventListener("click",e),document.addEventListener("keydown",e)},O=function(e){var t=n.getRadians(e),i=h*Math.sin(t)+D,o=h*Math.cos(t)+k;x.drowPointer(i,o)},p=function(e,t){return t===c?e<=0?360:e:e>=360?0:e},q=function(){var e=o.state.angle;O(o.state.angle),o.state.angle=p(e+w,w)},L=function(e){return!e.enemies.length},M=function(e){return e.enemies.length<a.maxEnemiesCount},P=function(e){return!e.changeDirectionCounter},A=function(t){return o.state.enemies=e(o.state.enemies,[t])},R=function(e,t,n){e(t)&&A(r.createEnemy(n,v,h,C))},W=function(e){R(L,o.state,e),x.drowEnemies(o.state.enemies)},b=function(e){R(M,o.state,e)},_=function(e,t,n,i,o){var r=e+" "+t,a=n?"red":null;x.drowText(r,i,a),x.drowLoader(i,s.getLoaderDataBasedOnCurrentLoaderCounterPosition(o))},B=function(e){_(a.changeDirectionTriesMessage,e.changeDirectionCounter,P(e),a.countOfChangeDirectionTriesMessageCoordintate,{position:e.countOfTicksWithoutEnemyDestory,maxPosition:a.maxDelayInactionsInTicks}),_(a.countOfEnemiesMessage,e.enemies.length,!M(e),a.countOfEnemiesMessagePositionCoordinate,{position:e.tickCounter,maxPosition:a.maxDelayToAddEnemyInTicks})},j=function(e){o.state.tickCounter=o.state.tickCounter+1,o.state.tickCounter>=a.maxDelayToAddEnemyInTicks&&(o.state.tickCounter=0,b(e))},F=function(){o.state.countOfTicksWithoutEnemyDestory=o.state.countOfTicksWithoutEnemyDestory+1},G=function(e){e&&(o.state.countOfTicksWithoutEnemyDestory=0)},S=function(e){o.state.changeDirectionCounter=o.state.changeDirectionCounter+e,o.state.changeDirectionCounter<0&&(o.state.changeDirectionCounter=0)},U=function(){o.state.countOfTicksWithoutEnemyDestory>a.maxDelayInactionsInTicks&&(G(!0),S(-1))},z=function(){setInterval(function(){x.canvasCleanUp(),x.drowStaticGameField(),q(),j(o.state.angle),F(),U(),W(o.state.angle),B(o.state)},10)},H=function(e){var t=o.state.changeDirectionCounter;!e&&0===t||S(e?1:-1)},J=function(){if(!o.state.enemies.length)return!1;var e=o.state.angle,t=o.state.enemies.filter(function(t){var n=t.enemyAngleRange,i=n[0],o=n[1],r=360===e?0:e;return r>i&&r<o}).map(function(e){return e.enemyId}),n=!1;return t.length&&(o.state.enemies=o.state.enemies.filter(function(e){return!t.some(function(t){return t===e.enemyId})}),n=!0),n},K=function(){var e=J();(o.state.changeDirectionCounter||e)&&(w=w===c?u:c),G(e),H(e)},N=!1,Q=function(e){var t=document.getElementById("button");t&&(t.addEventListener("keydown",function(e){return e.preventDefault()}),t.addEventListener("click",function(){N||(N=!0,e(),document.body.focus())}))};I(K),Q(z);
},{"../model/game.model":"VXXF","../helpers/radiant-transformer":"GXGn","./renderer":"lyTY","./state":"xMJR","./calculation/enemy.calculation":"Wn25","./constants":"ZEfQ","./calculation/rest-range.calculation":"oEyB"}],"QCba":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),require("./src/game/");
},{"./src/game/":"Ztbj"}]},{},["QCba"], null)
//# sourceMappingURL=game_touch.02a9a795.js.map