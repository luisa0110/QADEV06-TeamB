//CRUD TC apk router
//Miguel Angel Terceros Caballero

var expect = require('chai').expect;
//import libraries
var init = require('../../init');
var config = require(GLOBAL.initialDirectory+'/config/config.json');
var endPoints = require(GLOBAL.initialDirectory+config.path.endPoints);
var roomManagerAPI = require(GLOBAL.initialDirectory+config.path.roomManagerAPI);
var apk = require(GLOBAL.initialDirectory+config.path.apk);

//url 

var apkEndPoint = config.url + endPoints.apk;

describe('CRUD TCs of APK Routers', function () {
	before(function (done) {
		this.timeout(config.timeOut);
		process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
		done();
	});	

	it('verify that the service not exists', function(done) {
		roomManagerAPI
			.get(apkEndPoint, function(err, res){
				expect(res.status).to.equal(404);							
				expect(apk.apkError.code).to.equal(res.body.code);
				expect(res.body).to.have.property("code");
				expect(apk.apkError.message).to.equal(res.body.message);
				expect(res.body).to.have.property("message");

				done();
			});
	});
});