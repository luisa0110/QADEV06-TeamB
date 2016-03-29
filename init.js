//GLOBAL.initialDirectory contains the root directory
GLOBAL.initialDirectory = __dirname;
var RequireServices = require(GLOBAL.initialDirectory + '/lib/req-serv.js').RequireServices;
var requireServices = new RequireServices();

var config = requireServices.config();
var tokenAPI = requireServices.tokenAPI();
var roomManagerAPI = requireServices.roomManagerAPI();
var authorization = config.tokenHeader;
var tokenPrefix = config.tokenPrefix;
var url = config.url;
var endPoints = requireServices.endPoint();
var servicesJson = config.path.serviceConfig;
var exchangeAccountJson = config.exchangeAccount;
var serviceEndPoint = url + endPoints.services;

/**
 * this method starts the exchange service using the credential provided in the config.json
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