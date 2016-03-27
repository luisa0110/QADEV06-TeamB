
var init = require('../../init');
var config = require(GLOBAL.initialDirectory+'/config/config.json');
var RequireServices = require(GLOBAL.initialDirectory+'/lib/req-serv.js').RequireServices;
var expect = require('chai').expect;
var requireServices = new RequireServices();

var roomManagerAPI =  requireServices.roomManagerAPI();
var publicKeyEndPoint = requireServices.publicKeyEndPoint(); 

describe('Smoke TC PGP public-key', function () {

    this.timeout(config.timeOut);

	before(function (done) {
		this.timeout(config.timeOut);
		process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
		done();
	});	

	it('GET /PGP Public Key Refactor', function(done) {
		roomManagerAPI
			.get(publicKeyEndPoint, function(err, res){				
				expect(res.status).to.equal(config.httpStatus.Ok);

				done();
			});
	});
});