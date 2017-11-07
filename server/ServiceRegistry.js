/*jshint esversion: 6 */
'use strict';
class ServiceRegistry{

	constructor(){
		this.intentServices_arr = [];
	}

	addIntentService(intentService){
		this.intentServices_arr.push(intentService);
	}

	deleteIntentService(intentService){
		// typeof
		for(var i of this.intentServices_arr){
			if(i.intent === intentService.intent){
				var key = intentService.intent + intentService.port;
				this.intentServices_arr.delete(key);
			}
		}
	}

	getIntentServiceByIntent(intentSearch){
		for(var intent_i of this.intentServices_arr){
			if(intent_i.intent === intentSearch){
				return intent_i;
			}
		}
	}

	updateIntentService(intentService){

	}

	_cleanup(){

	}

}

module.exports = ServiceRegistry;