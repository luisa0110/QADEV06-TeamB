
var init = require('../../init');
var expect = require('chai').expect;

var RequireServices = require(GLOBAL.initialDirectory+'/lib/req-serv.js').RequireServices;
var requireServices = new RequireServices();

var config = requireServices.config();
var tokenAPI = requireServices.tokenAPI();
var util = requireServices.util();

describe('CRUD testing for Authentication (token)', function () {

	this.timeout(config.timeOut);
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
	before('Setting for obtain the token', function(){
       // process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
    });

    it('POST /Authentication/login (local) Verify that returns a valid token when the entered credentials are correct', function (done){
		tokenAPI
		.getToken(function(err, res){
			
			expect(res.status).to.equal(config.httpStatus.Ok);
			expect(res.body.token).to.not.be.undefined;
			expect(res.body).to.have.property("token");
			expect(res.body.token).to.be.a('string');

			expect(res.body.username).to.not.be.undefined;
			expect(res.body.username).to.be.a('string');
			expect(res.body).to.have.property("username")
			.and.be.equal(config.userAccountJson.username);

			var currentDate = util.getDateFromUnixTimeStamp((new Date()).getTime());
			var createdAuth = res.body.createdAt.substr(0, 10);
			expect(res.status).to.equal(config.httpStatus.Ok);
			expect(res.body.createdAt).to.not.be.undefined;
			expect(currentDate).to.equal(createdAuth);

			var date = new Date();
			var hour = date.getHours();
			var hourCreation = parseInt(res.body.createdAt.substr(11,2));
			var hourExpiration = parseInt(res.body.expiration.substr(11,2));
			differenceHours = hourExpiration - hourCreation;
			if(hourCreation > 17){
				expect(differenceHours).to.equal(-18);
			}
			else{
				expect(differenceHours).to.equal(6);
			}
			expect(res.status).to.equal(config.httpStatus.Ok);
			expect(res.body.createdAt).to.not.be.undefined;

			done();
		});
	});
});
