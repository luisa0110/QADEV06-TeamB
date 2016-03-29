/**
 * Smoke testing for attendees Route by: Jose Antonio Cardozo
 * test modified by: Andres Uzeda
 */
//libs
var init = require('../../init');
var config = require(GLOBAL.initialDirectory+'/config/config.json');
var expect = require('chai').expect;
var RequireServices = require(GLOBAL.initialDirectory+'/lib/req-serv.js').RequireServices;
var requireServices = new RequireServices();
//services
var tokenAPI = requireServices.tokenAPI();
var endPoints = requireServices.endPoint();
var roomManagerAPI = requireServices.roomManagerAPI();
//variables
var token = null;
var endPointServices = config.url + endPoints.services;
var endPointById = config.url + endPoints.attend;
/*TEST*/
describe('Smoke testing attendees route', function() {
	this.timeout(6000);
	before(function (done) {
		process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

		tokenAPI
			.getToken(function(err,res){
				token = res.body.token;
				done();
			});
	});
/*
* Smoke Test to the services with the method get for getting a
* specific attendees by filter.
*/
	it('Get /services/{servicesId}/attendees?filter=....', function (done) {
		
	  roomManagerAPI
		.getwithToken(token,endPointServices, function (err,res) {
			var servicesID = res.body[0]._id;
			var endPointServicesById = endPointById.replace('{:serviceId}',servicesID);
			roomManagerAPI
			  .get(endPointServicesById,function (err,res) {
			 	 expect(res.status).to.equal(config.httpStatus.Ok);
				 done();
			   });
		});
	});
});
