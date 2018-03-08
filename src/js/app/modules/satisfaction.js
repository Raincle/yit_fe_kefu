var utils = require("../../common/utils");
var _const = require("../../common/const");
var uikit = require("./uikit");
var apiHelper = require("./apiHelper");
var channel = require("./channel");
var profile = require("./tools/profile");
var eventListener = require("./tools/eventListener");
var loading = require("./uikit/loading");

var dom;
var starsUl;
var commentDom;
var tagContainer;
var dialog;

var starList;

var session;
var invite;
var score;
var evaluationDegreeId;
var _initOnce = _.once(_init);

module.exports = {
	init: init,
	show: show,
};

function _init(){
	//添加头像
	// var avatars = document.querySelectorAll(".chat-container .em-widget-left img");
	// var lastAvatarSrc = avatars[avatars.length - 1].src;
	// var name = document.querySelector(".em-widget-header-nickname").innerText;
	
	
	loading.show("satisfaction");
	apiHelper.getSatisfactionTipWord().then(function(tipWord){
		dom = utils.createElementFromHTML([
			"<div class=\"wrapper\">",
			// "<img class=\"avatar\" src=\"" + lastAvatarSrc + "\"></img>",
			// "<p class=\"name\">" + name + "</p>",
			"<span class=\"title\">" + tipWord + "</span>",
			"<ul></ul>",
			"<p class=\"desc\" style=\"opacity:0\">非常满意</p>",
			"<div class=\"tag-container\"></div>",
			"<textarea spellcheck=\"false\" placeholder=\"请输入您的评价，最多500字。\"></textarea>",
			"</div>"
		].join(""));
		starsUl = dom.querySelector("ul");
		commentDom = dom.querySelector("textarea");
		tagContainer = dom.querySelector(".tag-container");
		

		utils.live("li, li path", "click", function(){
			var level = +this.getAttribute("data-level");

			evaluationDegreeId = this.getAttribute("data-evaluate-id");
			score = this.getAttribute("data-score");
			var desc = document.querySelector(".satisfaction .desc");
			desc.style.opacity = 1;
			var confirm = document.querySelector(".satisfaction .footer .confirm-btn");
			confirm.style.backgroundColor = "#85bfc3";
			
			switch(score){
			case "1":
				desc.innerText = "非常不满意";
				break;
			case "2":
				desc.innerText = "不满意";
				break;
			case "3":
				desc.innerText = "一般";
				break;
			case "4":
				desc.innerText = "满意";
				break;
			case "5":
				desc.innerText = "非常满意";
				break;
			default:
				break;
			}

			level && _.each(starList, function(elem, i){
				utils.toggleClass(elem, "sel", i < level);
			});

			evaluationDegreeId && _createLabel(evaluationDegreeId);
		}, starsUl);
		
		setTimeout(function(){
			var starsLI = document.querySelectorAll(".satisfaction ul li");
			for (var i = 0; i < starsLI.length; i++) {
				if (parseInt(starsLI[i].getAttribute("data-score")) == 5) {
					starsLI[i].click();
				}
			}
		},300);

		
		utils.live("span.tag", "click", function(){
			utils.toggleClass(this, "selected");
		}, tagContainer);

		dialog = uikit.createDialog({
			contentDom: dom,
			className: "satisfaction"
		}).addButton({
			confirmText: __("common.submit"),
			confirm: _confirm,
		});
		loading.hide("satisfaction");
		dialog.show();
	});
}

function _clear(){
	commentDom.blur();
	commentDom.value = "";
	score = null;
	// clear stars
	utils.removeClass(starList, "sel");
	// clear label
	tagContainer.innerHTML = "";
	document.title = "一条在线客服";
}

function _sendSatisfaction(score, content, session, invite, appraiseTags, evaluationDegreeId){
	channel.sendText("", {
		ext: {
			weichat: {
				ctrlType: "enquiry",
				ctrlArgs: {
					// 后端类型要求，inviteId必须传数字
					inviteId: invite || 0,
					serviceSessionId: session || profile.currentOfficialAccount.sessionId || "",
					detail: content,
					summary: score,
					appraiseTags: appraiseTags,
					evaluationDegreeId: evaluationDegreeId,
				}
			}
		}
	});
}

function _setSatisfaction(){
	apiHelper.getEvaluationDegrees().then(function(entities){
		starsUl.innerHTML = _.chain(entities)
		.sortBy("level")
		.map(function(elem, index){
			// stat level 1-based
			var level = index + 1;
			var name = elem.name;
			var id = elem.id;
			var score = elem.score;
			
			var star = "<svg viewBox='0 0 94 94' width='55px' height='55px'><path data-score='" + score + "' data-level='" + level + "' data-evaluate-id='" + id + "' stroke='#CCCCCC' stroke-width='2' fill='none' d='M78.8161296,39.1508155 C78.2939723,37.4210125 76.7617012,36.0829909 74.2833163,35.2018216 C74.2511471,35.2018216 74.217962,35.1692862 74.1857927,35.1692862 L64.3050994,32.492904 C61.989931,31.8726965 60.0008569,30.404194 58.6639716,28.4134294 C56.4138188,24.9538233 54.163666,21.5596272 51.9138519,18.1328956 C51.9138519,18.1328956 51.8813441,18.0674857 51.8488362,18.0674857 C50.4465966,16.1095954 48.6857547,15 46.9249128,15 C45.6527045,15 43.7614926,15.5547977 42.0660051,18.2308409 L36.5227394,27.2712985 C35.283039,29.2945986 33.32715,30.8285109 31.0116429,31.5141284 C28.8268445,32.1665325 26.6745539,32.85215 24.4897555,33.504893 L19.5658321,35.0059309 C17.2835101,35.7566194 15.8162547,36.9316247 15.2615895,38.5634823 C14.6744165,40.2604109 15.0662038,42.2837111 16.5334592,44.6662571 C16.565967,44.731667 16.5988135,44.7970769 16.6641678,44.8296124 C18.8486276,47.6364753 21.0659339,50.4104639 23.2835788,53.2169879 C24.7183263,55.0122008 25.4683772,57.2968015 25.4030229,59.5814022 C25.2726529,63.7584834 25.1747907,67.9687778 25.0440821,72.1461978 C24.8161885,74.7246346 25.1747907,76.5520441 26.1855817,77.6945139 C26.9356326,78.5756831 27.9789314,79 29.2833089,79 C30.2944385,79 31.4681073,78.7390383 33.0660713,78.1513662 L42.4899616,74.3003177 C44.7726222,73.386613 47.3160229,73.3212031 49.5986835,74.2023724 C53.315753,75.5729295 57.0331611,76.9763609 60.7834157,78.3797924 C61.7613601,78.7061639 62.6421197,78.8369837 63.4571863,78.8369837 C65.2833825,78.8369837 68.3811097,77.9883499 68.6421884,72.3420885 L68.6421884,72.2116077 C68.4793105,69.2746028 68.2182319,64.5745817 68.0225075,61.3108663 C67.8921375,59.0262656 68.5771727,56.7416649 69.9465659,54.9142555 L77.3813821,44.9272188 C78.8161296,42.8063122 79.3051019,40.8477441 78.8161296,39.1508155 Z'></path></svg>"

			return "<li data-level=\"" + level
				+ "\" title=\"" + name
				+ "\" data-evaluate-id=\"" + id
				+ "\" data-score=\"" + score
				+ "\">" + star + "</li>";
		})
		.value()
		.join("");

		starList = starsUl.querySelectorAll("li");
	});
}

function _createLabel(evaluateId){
	apiHelper.getAppraiseTags(evaluateId).then(function(entities){
		tagContainer.innerHTML = _.map(entities, function(elem){
			var name = elem.name;
			var id = elem.id;

			return "<span data-label-id = \"" + id + "\" class=\"tag\">" + name + "</span>";
		}).join("");
		utils.removeClass(tagContainer, "hide");
	});
}

function _confirm(){
	var selectedTagNodeList = tagContainer.querySelectorAll(".selected");
	var tagNodeList = tagContainer.querySelectorAll(".tag");
	var content = commentDom.value;
	var appraiseTags = _.map(selectedTagNodeList, function(elem){
		return {
			id: elem.getAttribute("data-label-id"),
			name: elem.innerText
		};
	});

	// 必须选择星级
	if(!score){
		uikit.tip(__("evaluation.select_level_please"));
		// 防止对话框关闭
		return false;
	}
	// 若有标签则至少选择一个
	else if(tagNodeList.length > 0 && selectedTagNodeList.length === 0){
		uikit.tip(__("evaluation.select_tag_please"));
		// 防止对话框关闭
		return false;
	}

	_sendSatisfaction(score, content, session, invite, appraiseTags, evaluationDegreeId);
	// 评价成功
	uikit.tip(__("evaluation.submit_success"));
	// 处理评价按钮
	document.querySelector(".evaluation .btn").style.backgroundColor = "#dedede";
	document.querySelector(".evaluation .btn").onclick = null;
	document.querySelectorAll(".evaluation p")[1].innerText = "感谢您的评价！";
	
	_clear();
}

function show(inviteId, serviceSessionId){
	_initOnce();
	session = serviceSessionId;
	invite = inviteId;
	_setSatisfaction();
	dialog && dialog.show();
}

function init(){
	eventListener.add(
		_const.SYSTEM_EVENT.SATISFACTION_EVALUATION_MESSAGE_RECEIVED,
		function(officialAccount, inviteId, serviceSessionId){
			if(officialAccount !== profile.currentOfficialAccount) return;
			show(inviteId, serviceSessionId);
		}
	);
}
