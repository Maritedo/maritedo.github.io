System.register(["./index-legacy-myV676-I.js"],(function(e,r){"use strict";var n,t,i,a,o,s,l,d,h,c,f;return{setters:[e=>{n=e.a,t=e.d,i=e.e,a=e.g,o=e.u,s=e.l,l=e.aL,d=e.m,h=e.a5,c=e.n,f=e.j}],execute:function(){const r=n("h","\n font-size: var(--n-font-size);\n font-weight: var(--n-font-weight);\n margin: var(--n-margin);\n transition: color .3s var(--n-bezier);\n color: var(--n-text-color);\n",[t("&:first-child",{marginTop:0}),i("prefix-bar",{position:"relative",paddingLeft:"var(--n-prefix-width)"},[i("align-text",{paddingLeft:0},[t("&::before",{left:"calc(-1 * var(--n-prefix-width))"})]),t("&::before",'\n content: "";\n width: var(--n-bar-width);\n border-radius: calc(var(--n-bar-width) / 2);\n transition: background-color .3s var(--n-bezier);\n left: 0;\n top: 0;\n bottom: 0;\n position: absolute;\n '),t("&::before",{backgroundColor:"var(--n-bar-color)"})])]),g=Object.assign(Object.assign({},s.props),{type:{type:String,default:"default"},prefix:String,alignText:Boolean}),p=e=>a({name:`H${e}`,props:g,setup(n){const{mergedClsPrefixRef:t,inlineThemeDisabled:i}=o(n),a=s("Typography","-h",r,l,n,t),f=d((()=>{const{type:r}=n,{common:{cubicBezierEaseInOut:t},self:{headerFontWeight:i,headerTextColor:o,[h("headerPrefixWidth",e)]:s,[h("headerFontSize",e)]:l,[h("headerMargin",e)]:d,[h("headerBarWidth",e)]:c,[h("headerBarColor",r)]:f}}=a.value;return{"--n-bezier":t,"--n-font-size":l,"--n-margin":d,"--n-bar-color":f,"--n-bar-width":c,"--n-font-weight":i,"--n-text-color":o,"--n-prefix-width":s}})),g=i?c(`h${e}`,d((()=>n.type[0])),f,n):void 0;return{mergedClsPrefix:t,cssVars:i?void 0:f,themeClass:null==g?void 0:g.themeClass,onRender:null==g?void 0:g.onRender}},render(){var r;const{prefix:n,alignText:t,mergedClsPrefix:i,cssVars:a,$slots:o}=this;return null===(r=this.onRender)||void 0===r||r.call(this),f(`h${e}`,{class:[`${i}-h`,`${i}-h${e}`,this.themeClass,{[`${i}-h--prefix-bar`]:n,[`${i}-h--align-text`]:t}],style:a},o)}});e("N",p("1")),e("a",p("2")),p("3"),p("4"),p("5"),p("6")}}}));
