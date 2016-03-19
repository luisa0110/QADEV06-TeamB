//Smoke TC apk router
//Miguel Angel Terceros Caballero
//

var expect = require('chai').expect;
//import libraries
var init = require('../../init');
var config = require(GLOBAL.initialDirectory+'/config/config.json');
var endPoints = require(GLOBAL.initialDirectory+config.path.endPoints);
var roomManagerAPI = require(GLOBAL.initialDirectory+config.path.roomManagerAPI);

//url 
var apkEndPoint = config.url + endPoints.apk; 

describe('APK Routers', function () {

	before(function (done) {
		this.timeout(config.timeOut);
		process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
		done();
	});	

	it('GET /apk refactor', function(done) {
		roomManagerAPI
			.get(apkEndPoint, function(err, res){							
				expect(res.status).to.equal(config.httpStatus.Ok);

				done();
			});
	});
});