/**
 * Smoke testing for attendees Route by: Jose Antonio Cardozo
 */
var init = require('../../init');
var config = require(GLOBAL.initialDirectory+'/config/config.json');
var expect = require('chai').expect;
var tokenAPI = require(GLOBAL.initialDirectory+config.path.tokenAPI);
var endPoints = require(GLOBAL.initialDirectory+config.path.endPoints);
var roomManagerAPI = require(GLOBAL.initialDirectory+config.path.roomManagerAPI);

var token = null;
var endPointServices = config.url + endPoints.services;
var endPointById = config.url + endPoints.attend;

describe('Smoke testing attendees route', function() {
	//The services needed 6 seconds for response
	this.timeout(6000);
	before(function (done) {
		process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
		//getting the token
		tokenAPI
			.getToken(function(err,res){
				token = res.body.token;
				done();
			});
	});

	it('Get /services/{servicesId}/attendees?filter=....', function (done) {
		
	  roomManagerAPI
	  	//get the services id
		.getwithToken(token,endPointServices, function (err,res) {
			var servicesID = res.body[0]._id;
			var endPointServicesById = endPointById.replace('{:serviceId}',servicesID);
			roomManagerAPI
				//get the ID of services 
			  .get(endPointServicesById,function (err,res) {
			 	 expect(res.status).to.equal(config.httpStatus.Ok);
				 done();
			   });
		});
	});
});
