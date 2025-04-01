(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["components/updateFile/updateFile"],{3592:function(e,n,i){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var t={name:"updateFile",props:{},data:function(){return{fileMediatype:"image",mode:"grid",imageValue:[],limit:2,title:"这是title"}},methods:{select:function(e){console.log("选择文件：",e),this.imageValue.push(e.tempFiles[0].url),console.log("this.imageValue：",JSON.parse(JSON.stringify(this.imageValue)))},progress:function(e){console.log("上传进度：",e)},success:function(e){console.log("上传成功")},fail:function(e){console.log("上传失败：",e)}}};n.default=t},"5f1e":function(e,n,i){"use strict";i.d(n,"b",(function(){return u})),i.d(n,"c",(function(){return o})),i.d(n,"a",(function(){return t}));var t={uniFilePicker:function(){return Promise.all([i.e("common/vendor"),i.e("uni_modules/uni-file-picker/components/uni-file-picker/uni-file-picker")]).then(i.bind(null,"4923"))}},u=function(){var e=this.$createElement;this._self._c},o=[]},bcfc:function(e,n,i){"use strict";i.r(n);var t=i("3592"),u=i.n(t);for(var o in t)["default"].indexOf(o)<0&&function(e){i.d(n,e,(function(){return t[e]}))}(o);n["default"]=u.a},c975:function(e,n,i){"use strict";i.r(n);var t=i("5f1e"),u=i("bcfc");for(var o in u)["default"].indexOf(o)<0&&function(e){i.d(n,e,(function(){return u[e]}))}(o);var l=i("828b"),c=Object(l["a"])(u["default"],t["b"],t["c"],!1,null,null,null,!1,t["a"],void 0);n["default"]=c.exports}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'components/updateFile/updateFile-create-component',
    {
        'components/updateFile/updateFile-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('df3c')['createComponent'](__webpack_require__("c975"))
        })
    },
    [['components/updateFile/updateFile-create-component']]
]);
