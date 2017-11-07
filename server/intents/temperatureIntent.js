/*jshint esversion: 6 */
'use strict';

var request = require('superagent');

module.exports.process = function(intentData, intentIndex, registry){
	return new Promise(function(resolve, reject){

		var idx = intentIndex;
		if (intentData.intent[idx].value === 'temperature') {
			if (!intentData.location) {
				reject(new Error('Missing location in weather intent'));
			}
			else{

				var location = intentData.location[0].value;
				var geo_codes = {};

				console.log(JSON.stringify(registry));
				var intentService = registry.getIntentServiceByIntent('temperature');
				var port = intentService.port;
				console.log('port found ->' + port);
				request.get(`localhost:${port}/${location}/metric`).end((err, response)=>{
					if(err){
						console.log(`weather microservice error -> ${err}`);
					}
					else{
						var dataString = response.body.d;
						resolve([dataString]);
					}	
				});
			}
		}

	} /* end of function(resolve, reject) */
	);/* end of Promise Object */
};/* end of function(intentData) */
