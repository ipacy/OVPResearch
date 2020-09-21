sap.ui.define(["sap/ui/thirdparty/jquery","sap/ui/core/Control","sap/ui/model/json/JSONModel","sap/ovp/cards/charts/Utils","sap/ovp/app/resources","sap/base/util/each"],function(q,C,J,U,O,e){"use strict";return C.extend("sap.ovp.cards.charts.OVPVizDataHandler",{metadata:{aggregations:{data:{type:"sap.ui.core.Element"},aggregateData:{type:"sap.ui.core.Element"},content:{multiple:false}},properties:{chartType:{defaultValue:false},dependentDataReceived:{defaultValue:false},scale:{defaultValue:""},entitySet:{}}},renderer:function(r,c){r.write("<div");r.writeElementData(c);r.write(">");if(c.getContent()){r.renderControl(c.getContent());}r.write("</div>");},mergeDatasets:function(b,d,c){var t=this;var m=this.getModel();var p=b.mParameters;var D=q.extend(true,{},this.dataSet);if(p){var s=p.select.split(",");}var a=b.getPath().substring(1);var f=-1;if(a){f=a.indexOf('Parameters');}if(f>=0){a=a.substr(0,a.indexOf('Parameters'));}var g=m.getMetaModel();var h=this.getEntitySet();var l=g.getODataEntitySet(h);var n=g.getODataEntityType(l.entityType);var o=[];var r=[];for(var i=0;i<n.property.length;i++){if(n.property[i]["com.sap.vocabularies.Analytics.v1.Measure"]||(n.property[i].hasOwnProperty("sap:aggregation-role")&&n.property[i]["sap:aggregation-role"]==="measure")){if(s&&s.indexOf(n.property[i].name)!==-1){o.push(n.property[i].name);}}else{if(s&&s.indexOf(n.property[i].name)!==-1){r.push(n.property[i].name);}}}if(D&&D.results){for(var i=0;i<D.results.length-2;i++){for(var j=0;j<o.length;j++){D.results[0][o[j]]=Number(D.results[0][o[j]])+Number(D.results[i+1][o[j]]);}}var u=D.__count-D.results.length;var v={};v.results=[];v.results[0]=D.results[0];var w;if(D.__count>D.results.length){var x=q.extend(true,{},this.aggregateSet);if(x&&x.results&&D.results.length<D.__count){e(o,function(i){x.results[0][o[i]]=String(Number(t.aggregateSet.results[0][o[i]])-Number(v.results[0][o[i]]));});e(r,function(i){x.results[0][r[i]]=O.getText("OTHERS_DONUT",[u+1]);});x.results[0].$isOthers=true;w=x.results[0];if(w){d.results.splice(-1,1);}}}if(w){d.results.push(w);}var y=c.getModel('ovpCardProperties');var E=y&&y.getProperty("/bEnableStableColors");var z=y&&y.getProperty("/colorPalette");var A=n[y&&y.getProperty("/chartAnnotationPath")];if(A.DimensionAttributes.length===1&&E&&c.getVizType()==="donut"&&z&&(z instanceof Object)&&Object.keys(z).length<=10){var B=A.DimensionAttributes[0].Dimension.PropertyPath;if(z instanceof Array){var F=z.map(function(T){return T.color;});var G=F.slice();}else{var H=JSON.parse(JSON.stringify(z));}var V=c.getVizProperties();if(!V){var I={plotArea:{dataPointStyle:{rules:[]}}};V=I;}if(c&&V&&V.plotArea){if(!V.plotArea.dataPointStyle){V.plotArea.dataPointStyle={rules:[]};}else{V.plotArea.dataPointStyle.rules=[];}var K=g.getODataProperty(n,B);if(K){var L=K["com.sap.vocabularies.Common.v1.Label"]?K["com.sap.vocabularies.Common.v1.Label"].String:B;var M;if(K["com.sap.vocabularies.Common.v1.Text"]){M=K["com.sap.vocabularies.Common.v1.Text"]["Path"];}else if(K["sap:text"]){M=K["sap:text"];}else{M=K;}var N=function(i,k,Q,P){return{callback:function(T){if(T&&(T[L]===Q.dimensionValue)||(Q.hasOwnProperty(T[L]))){return true;}},properties:{color:(F&&F[i])||(Q&&Q[P])},"displayName":d.results[k][M]};};if(z instanceof Array){e(z,function(i,Q){for(var k=0;k<d.results.length;k++){if(d.results[k][B]===Q.dimensionValue){var R=N(i,k,Q);V.plotArea.dataPointStyle['rules'].push(R);G.splice(i,1);}}});}else{for(var k=0;k<d.results.length;k++){if(z.hasOwnProperty(d.results[k][B])){var P=d.results[k][B];var Q={};Q[P]=z[P];var R=N(i,k,Q,P);V.plotArea.dataPointStyle['rules'].push(R);delete H[P];}}}if(x){V.plotArea.dataPointStyle['rules'].push({callback:function(T){if(T&&(T[L].lastIndexOf('Others')!=-1)){return true;}},properties:{color:G&&G.length?F[F.length-1]:Object.keys(H).length&&H[Object.keys(H)[0]]},"displayName":x.results[0][B]});}}}c.setVizProperties(V);}}var S=new J();S.setData(d.results);c.setModel(S,"analyticalmodel");},updateBindingContext:function(){var b=this.getBinding("data");var a=this.getBinding("aggregateData");var t=this;if(this.chartBinding==b){return;}else{this.chartBinding=b;if(b){var t=this;b.attachEvent("dataReceived",function(E){t.dataSet=E&&E.getParameter("data");t.oDataClone=q.extend(true,{},t.dataSet);if(t.getChartType()=="donut"&&t.getBinding("aggregateData")!==undefined){if(t.getDependentDataReceived()===true||t.getDependentDataReceived()==="true"){t.mergeDatasets(b,t.oDataClone,t.getContent());t.setDependentDataReceived(false);}else{t.setDependentDataReceived(true);}}else{var m=new J();if(t.dataSet){var c=t.getEntitySet();var o=b.getModel();var M=U.cacheODataMetadata(o);var T=[];var d={};var f=M[c];if(f){var g=Object.keys(f);}if(g&&g.length){e(g,function(i,p){if(f[p]["type"]==="Edm.String"){if(f[p]["sap:semantics"]==="yearmonth"||f[p]["com.sap.vocabularies.Common.v1.IsCalendarYearMonth"]){T.push(p);d[p]={"sap:semantics":"yearmonth"};}else if(f[p]["sap:semantics"]==="yearquarter"||f[p]["com.sap.vocabularies.Common.v1.IsCalendarYearQuarter"]){T.push(p);d[p]={"sap:semantics":"yearquarter"};}else if(f[p]["sap:semantics"]==="yearweek"||f[p]["com.sap.vocabularies.Common.v1.IsCalendarYearWeek"]){T.push(p);d[p]={"sap:semantics":"yearweek"};}}});}if(T&&T.length){if(t.dataSet.results&&t.dataSet.results.length){e(t.dataSet.results,function(i,r){e(T,function(i,p){if(r.hasOwnProperty(p)){var h=r[p];var y,j,k,l,n,w,s;switch(d[p]["sap:semantics"]){case'yearmonth':y=parseInt(h.substr(0,4),10);j=h.substr(4);n=parseInt(j,10)-1;r[p]=new Date(Date.UTC(y,n));break;case'yearquarter':y=parseInt(h.substr(0,4),10);k=h.substr(4);l=(parseInt(k,10)*3)-2;n=l-1;r[p]=new Date(Date.UTC(y,n));break;case'yearweek':y=parseInt(h.substr(0,4),10);w=h.substr(4);var s=(1+(parseInt(w,10)-1)*7);r[p]=new Date(Date.UTC(y,0,s));break;default:break;}}});});}}m.setData(t.dataSet.results);t.oDataClone=q.extend(true,{},t.dataSet);}t.getContent().setModel(m,"analyticalmodel");t.mergeDatasets(b,t.oDataClone,t.getContent());}});}C.prototype.updateBindingContext.apply(this,arguments);}if(this.chartAggrBinding==a){return;}else{this.chartAggrBinding=a;if(a){var t=this;a.attachEvent("dataReceived",function(E){t.aggregateSet=E&&E.getParameter("data");if(t.getChartType()=="donut"){if(t.getDependentDataReceived()===true||t.getDependentDataReceived()==="true"){t.oDataClone=q.extend(true,{},t.dataSet);t.mergeDatasets(b,t.oDataClone,t.getContent());t.setDependentDataReceived(false);}else{t.setDependentDataReceived(true);}}else{var m=new J();m.setData(t.aggregateSet.results);t.getContent().setModel(m,"analyticalmodel");}});}C.prototype.updateBindingContext.apply(this,arguments);}}});});
