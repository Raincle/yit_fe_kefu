!function(){var e=function(){},a=function(){try{return new window.XMLHttpRequest}catch(e){return!1}},t=function(){try{return new window.ActiveXObject("Microsoft.XMLHTTP")}catch(e){return!1}},n=function(n){var s=n.dataType||"text",i=n.success||e,r=n.error||e,m=a()||t();m.onreadystatechange=function(){var e;if(4===m.readyState){var a=m.status||0;if(200===a){if("text"===s)return void i(m.responseText,m);if("json"===s){try{e=JSON.parse(m.responseText),i(e,m)}catch(t){}return}return void i(m.response||m.responseText,m)}if("json"==s){try{e=JSON.parse(m.responseText),r(e,m,"服务器返回错误信息")}catch(t){r(m.responseText,m,"服务器返回错误信息")}return}return void r(m.responseText,m,"服务器返回错误信息")}0===m.readyState&&r(m.responseText,m,"服务器异常")};var o=n.type||"GET",d=n.data||{},c="";if("get"===o.toLowerCase()){for(var u in d)d.hasOwnProperty(u)&&(c+=u+"="+d[u]+"&");c=c?c.slice(0,-1):c,n.url+=(n.url.indexOf("?")>0?"&":"?")+(c?c+"&":c)+"_v="+(new Date).getTime(),d=null}else d._v=(new Date).getTime(),d=JSON.stringify(d);if(m.open(o,n.url),m.setRequestHeader){var g=n.headers||{};g["Content-Type"]=g["Content-Type"]||"application/json";for(var l in g)g.hasOwnProperty(l)&&m.setRequestHeader(l,g[l])}return m.send(d),m};window.easemobim=window.easemobim||{},window.easemobim.emajax=n}(),window.easemobim=window.easemobim||{},window.easemobIM=window.easemobIM||{},easemobIM.Transfer=easemobim.Transfer=function(){"use strict";var e=function(e,a,t){if("string"==typeof e.data){var n,s,i=JSON.parse(e.data),r=!1;if(t&&t.length)for(n=0,s=t.length;s>n;n++)i.key===t[n]&&(r=!0,"function"==typeof a&&a(i));else"function"==typeof a&&a(i);if(!r&&t)for(n=0,s=t.length;s>n;n++)if("data"===t[n]){"function"==typeof a&&a(i);break}}},a=function(e,t){return this instanceof a?(this.key=t,this.iframe=document.getElementById(e),void(this.origin=location.protocol+"//"+location.host)):new a(e)};return a.prototype.send=function(e,a){return e.origin=this.origin,e.key=this.key,a&&(e.to=a),e=JSON.stringify(e),this.iframe?this.iframe.contentWindow.postMessage(e,"*"):window.parent.postMessage(e,"*"),this},a.prototype.listen=function(a,t){var n=this;return window.addEventListener?window.addEventListener("message",function(s){e.call(n,s,a,t)},!1):window.attachEvent&&window.attachEvent("onmessage",function(s){e.call(n,s,a,t)}),this},a}(),function(){var e=new easemobim.Transfer(null,"api"),a=function(a){var t=null;return a.msg.data&&a.msg.data.headers&&(t=a.msg.data.headers,delete a.msg.data.headers),{url:a.url,headers:t,data:a.excludeData?null:a.msg.data,type:a.type||"GET",success:function(t){try{t=JSON.parse(t)}catch(n){}e.send({call:a.msg.api,timespan:a.msg.timespan,status:0,data:t})},error:function(t){try{t=JSON.parse(t)}catch(n){}e.send({call:a.msg.api,timespan:a.msg.timespan,status:1,data:t})}}};e.listen(function(t){switch(e.targetOrigin=t.origin,t.api){case"getRelevanceList":easemobim.emajax(a({url:"/v1/webimplugin/targetChannels",msg:t}));break;case"getDutyStatus":easemobim.emajax(a({url:"/v1/webimplugin/showMessage",msg:t}));break;case"getWechatVisitor":easemobim.emajax(a({url:"/v1/webimplugin/visitors/wechat/"+t.data.openid+"?tenantId="+t.data.tenantId,msg:t,type:"POST"}));break;case"createVisitor":easemobim.emajax(a({url:"/v1/webimplugin/visitors?tenantId="+t.data.tenantId,msg:t,type:"POST"}));break;case"getSession":easemobim.emajax(a({url:"/v1/webimplugin/visitors/"+t.data.id+"/schedule-data?techChannelInfo="+t.data.orgName+"%23"+t.data.appName+"%23"+t.data.imServiceNumber+"&tenantId="+t.data.tenantId,msg:t,excludeData:!0}));break;case"getExSession":easemobim.emajax(a({url:"/v1/webimplugin/visitors/"+t.data.id+"/schedule-data-ex?techChannelInfo="+t.data.orgName+"%23"+t.data.appName+"%23"+t.data.imServiceNumber+"&tenantId="+t.data.tenantId,msg:t,excludeData:!0}));break;case"getPassword":easemobim.emajax(a({url:"/v1/webimplugin/visitors/password",msg:t}));break;case"getGroup":easemobim.emajax(a({url:"/v1/webimplugin/visitors/"+t.data.id+"/ChatGroupId?techChannelInfo="+t.data.orgName+"%23"+t.data.appName+"%23"+t.data.imServiceNumber+"&tenantId="+t.data.tenantId,msg:t,excludeData:!0}));break;case"getGroupNew":easemobim.emajax(a({url:"/v1/webimplugin/tenant/"+t.data.tenantId+"/visitors/"+t.data.id+"/ChatGroupId?techChannelInfo="+t.data.orgName+"%23"+t.data.appName+"%23"+t.data.imServiceNumber+"&tenantId="+t.data.tenantId,msg:t,excludeData:!0}));break;case"getHistory":easemobim.emajax(a({url:"/v1/webimplugin/visitors/msgHistory",msg:t}));break;case"getSlogan":easemobim.emajax(a({url:"/v1/webimplugin/notice/options",msg:t}));break;case"getTheme":easemobim.emajax(a({url:"/v1/webimplugin/theme/options",msg:t}));break;case"getSystemGreeting":easemobim.emajax(a({url:"/v1/webimplugin/welcome",msg:t}));break;case"getRobertGreeting":easemobim.emajax(a({url:"/v1/Tenants/"+t.data.tenantId+"/robots/visitor/greetings/"+t.data.originType+"?tenantId="+t.data.tenantId,msg:t,excludeData:!0}));break;case"sendVisitorInfo":easemobim.emajax(a({url:"/v1/webimplugin/tenants/"+t.data.tenantId+"/visitors/"+t.data.visitorId+"/attributes?tenantId="+t.data.tenantId,msg:t,type:"POST"}));break;case"getProject":easemobim.emajax(a({url:"/tenants/"+t.data.tenantId+"/projects",msg:t}));break;case"createTicket":easemobim.emajax(a({url:"/tenants/"+t.data.tenantId+"/projects/"+t.data.projectId+"/tickets?tenantId="+t.data.tenantId+"&easemob-target-username="+t.data["easemob-target-username"]+"&easemob-appkey="+t.data["easemob-appkey"]+"&easemob-username="+t.data["easemob-username"],msg:t,type:"POST"}));break;case"receiveMsgChannel":easemobim.emajax(a({url:"/v1/imgateway/messages",msg:t}));break;case"sendMsgChannel":easemobim.emajax(a({url:"/v1/imgateway/messages?tenantId="+t.data.tenantId,msg:t,type:"POST"}));break;case"getAgentStatus":easemobim.emajax(a({url:"/v1/tenants/"+t.data.tenantId+"/agents/"+t.data.agentUserId+"/agentstate",msg:t}));break;case"getNickNameOption":easemobim.emajax(a({url:"/v1/webimplugin/agentnicename/options?tenantId="+t.data.tenantId,msg:t,excludeData:!0}));break;case"reportEvent":easemobim.emajax(a({url:"/v1/event_collector/events",msg:t,type:"POST"}));break;case"deleteEvent":easemobim.emajax(a({url:"/v1/event_collector/event/"+encodeURIComponent(t.data.userId),msg:t,type:"DELETE",excludeData:!0}));break;case"mediaStreamUpdateStatus":var n=t.data.streamId;delete t.data.streamId,easemobim.emajax(a({url:"/v1/rtcmedia/media_streams/"+n,msg:t,type:"PUT"}));break;case"graylist":easemobim.emajax(a({url:"/management/graylist",msg:t,excludeData:!0}));break;case"getCurrentServiceSession":easemobim.emajax(a({url:"/v1/webimplugin/tenant/"+t.data.tenantId+"/visitors/"+t.data.id+"/CurrentServiceSession?techChannelInfo="+t.data.orgName+"%23"+t.data.appName+"%23"+t.data.imServiceNumber+"&tenantId="+t.data.tenantId,msg:t,excludeData:!0}));break;case"messagePredict":var s=t.data.tenantId,i=t.data.agentId;delete t.data.tenantId,delete t.data.agentId,easemobim.emajax(a({url:"/v1/webimplugin/agents/"+i+"/messagePredict?tenantId="+s,msg:t,type:"POST"}))}},["data"])}();