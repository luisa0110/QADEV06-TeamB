//GLOBAL.initialDirectory contains the root directory
GLOBAL.initialDirectory = __dirname;

var config = require(GLOBAL.initialDirectory+'/config/config.json');
var tokenAPI = require(GLOBAL.initialDirectory+config.path.tokenAPI);
var roomManagerAPI = require(GLOBAL.initialDirectory+config.path.roomManagerAPI);
var authorization=config.tokenHeader;
var tokenPrefix=config.tokenPrefix;
var url = config.url;
var endPoints = require(GLOBAL.initialDirectory+config.path.endPoints);
var servicesJson = require(GLOBAL.initialDirectory+config.path.serviceConfig);
var exchangeAccountJson = config.exchangeAccount;
var serviceEndPoint = url+endPoints.services;
/**
 * this method starts the exchange service usen the credential provided in the config.json
 * @paramToken  {is a string token}
 * @param  {done}
 * @return {none}
 */
var startService = function(token,done){
	console.log("entra aqui!!!");
	roomManagerAPI
		.getwithToken(token,serviceEndPoint,function(err,res){
			var size = res.body.length;
			console.log('-------------------',JSON.stringify(res.body));
			console.log('token ', token);
			if(size == 0)
			{
				roomManagerAPI
					.post(token,serviceEndPoint+servicesJson.postFilter,exchangeAccountJson,function(err,res){
						console.log('////////////'+res.body);
						done();
					});
			}else{

				//TODO if the size is more than 0, here we can verify if in the services founded is an exchange server  
				done();
			}

			
		});

};
exports.startService = startService;