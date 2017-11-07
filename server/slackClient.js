/*jshint esversion: 6 */
'use strict';

var RtmClient = require('@slack/client').RtmClient;
var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;
const promise = require('bluebird');
let rtm;
let nlp;

function handleAuthenticated(rtmStartData){
	var channel;
	for (const c of rtmStartData.channels) {
		if (c.is_member && c.name ==='general') { channel = c.id; }
	}
	console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
}

function addHandler(rtm, event, handler){
	rtm.on(event, handler);
}

function err_cb(err){
	console.log(`err_cb tells -> ${err}`);
}

function success_cb(response, usrCtxt){

	function send_message(error, dataObj){
		if (error){
			console.log(error.message);
		}
		else{
			var i = 0;
			var dataString = '';
			while(dataObj.dataString_arr[i]){
				dataString = dataString + dataObj.dataString_arr[i];
				i++;
			}
			console.log(`inside send_message -> ${dataString}`);	
			rtm.sendMessage(dataString, usrCtxt.channel);
		}
	}

	var registry = this;
	var res = response.entities;
	if (res){	
			var promises = [];
			var i = 0;
			while(res.intent[i]){
				console.log(res.intent[i]);
				var intentHandler = require("./intents/" + res.intent[i].value + 'Intent');
				promises.push(intentHandler.process(res, i, registry));
				i++;
			}

			Promise.all(promises).then(function(allData){
				//console.log(`allData->  ${allData}`);
				//rtm.sendMessage(`${allData}`, usrCtxt.channel);
				send_message(false, {dataString_arr:allData} );
			});
	}
}

var handleMessage = (function(err_cb, success_cb, registry1){
	var usrCtxt_arr = [];
	var usrCtxt = {};
	//console.log(p_registry.getIntentServiceByIntent('temperature'));
	return function(message){
		var registry;
		if(this !== undefined){
			registry = this;
		}
		else{
			console.log('blowwww');
		}
		console.log(JSON.stringify(registry));
		var flag = false;
		var i = 0;
		var x;
		while(usrCtxt_arr[i]){
			if (usrCtxt_arr[i].user === message.user && usrCtxt_arr[i].channel === message.channel){
				x = usrCtxt_arr[i];
				flag = true;
				break;
			}
			i++;
		}
		if(flag === false){
			var y = {};
			y.user = message.user;
			y.channel = message.channel;
			usrCtxt_arr.push(y);
			usrCtxt = y;
		}
		else{
			usrCtxt = x;
		}
		var success_cb_with_registry = success_cb.bind(registry);
		nlp(message.text, err_cb, success_cb_with_registry, usrCtxt);
	};
}(err_cb, success_cb));// call function immediately with the parameters

var init = function (p_bot_token, p_nlpObj, p_registry){

	rtm = new RtmClient(p_bot_token);
	nlp = p_nlpObj;
	addHandler(rtm, CLIENT_EVENTS.RTM.AUTHENTICATED, handleAuthenticated);
	var handleMessageUsingRegistry = handleMessage.bind(p_registry);
	addHandler(rtm, RTM_EVENTS.MESSAGE, handleMessageUsingRegistry);

	return rtm;
};

module.exports.init = init;
module.exports.addHandler = addHandler;