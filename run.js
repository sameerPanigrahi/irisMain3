/*jshint esversion: 6 */
'use strict';

var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;


const express = require('express');
const service = express();
const http = require('http');
const server = http.createServer(service);

var ServiceRegistry = require('./server/ServiceRegistry');
var registry = new ServiceRegistry();
service.set('registry', registry);

var bot_token = 'xoxb-238893809540-JLE6rUJMepIMMMsJi5JjGlfX';
var wit_Token = '4XH5DMV7S6JDWFFSKMQOU6KYUCY2D2CH';

const slackClient = require('./server/slackClient');
const witClient = require('./server/witClient');

const nlp = witClient(wit_Token);
const rtm = slackClient.init(bot_token, nlp, service.get('registry'));

rtm.start();

//start the express server only if the client is authenticated.
slackClient.addHandler(rtm, CLIENT_EVENTS.RTM.AUTHENTICATED, ()=>{
	server.listen(3000);
});
service.set('slackClient', slackClient);
service.get('/:intent/:port', function(req, res){
	var intent = req.params.intent;
	var port = req.params.port;
	service.get('registry').addIntentService({intent:intent,port:port});
	res.send({successMessage:`service added: intent is ${intent} and port is ${port}`});
});

server.on('listening', function(){
	console.log(`IRIS is listening on ${server.address().port} in ${service.get('env')} mode`);
});
