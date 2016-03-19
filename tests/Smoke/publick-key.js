//Smoke TC pgp public-key
//Miguel Angel Terceros Caballero

var expect = require('chai').expect;
//import libraries
var init = require('../../init');
var config = require(GLOBAL.initialDirectory+'/config/config.json');
var endPoints = require(GLOBAL.initialDirectory+config.path.endPoints);
var roomManagerAPI = require(GLOBAL.initialDirectory+config.path.roomManagerAPI);

//url
var publicKeyEndPoint = config.url + endPoints.publicKey;

describe('Smoke TC PGP public-key', function () {

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