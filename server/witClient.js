/*jshint esversion: 6 */
'use strict';

var request = require('superagent');

module.exports = function witClient(token){    
		const nlp = function (messageText, err_cb, success_cb, usrCtxt){
			request.get('https://api.wit.ai/message')
			.set('Authorization', 'Bearer ' + token)
			.query({v: '17/09/2017'})
			.query({q: messageText})
			.end((err, res)=>{
				if (err){
					err_cb(err);
				}
				else{
					success_cb(res.body, usrCtxt);
				}
			});
	};
	
	return nlp;
};