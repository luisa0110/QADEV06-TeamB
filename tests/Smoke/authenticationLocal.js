
var init = require('../../init');

var config = require(GLOBAL.initialDirectory+'/config/config.json');
var expect = require('chai').expect;
var tokenAPI = require(GLOBAL.initialDirectory+config.path.tokenAPI);



describe('Smoke testing for Authentication (token)', function () {

	this.timeout(config.timeOut);

	before('Setting for obtain the token', function(){
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
    });

	it('POST /Authentication/login (local) with valid authentication',function (done){
		tokenAPI
		.getToken(function(err, token){
			expect(token.status).to.equal(config.httpStatus.Ok);
			expect(token.body.token).not.to.be.null;
			console.log();
			done();
		});
	});
});