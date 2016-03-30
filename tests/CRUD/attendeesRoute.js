/**
 * CRUD of Attendees Route by: Jose Antonio Cardozo
 */
//libs

var init = require('../../init');

var expect = require('chai').expect;
var RequireServices = require(GLOBAL.initialDirectory+'/lib/req-serv.js').RequireServices;
var requireServices = new RequireServices();

var config = requireServices.config();
var tokenAPI = requireServices.tokenAPI();
var endPoints = requireServices.endPoint();
var roomManagerAPI = requireServices.roomManagerAPI();
var mongoDB = requireServices.mongodb();
var locationConfig = requireServices.locationConfig();

var token = null;
var endPointServices = config.url + endPoints.services;
var endPointById = config.url + endPoints.attend;
var ObjectId = require('mongodb').ObjectID;
var servicesId = locationConfig.locationIdForMongo;

describe('CRUD testing attendees route', function() {
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
			expect(res.status).to.equal(config.httpStatus.Ok);
			var servicesID = res.body[0]._id;
			var endPointServicesById = endPointById.replace('{:serviceId}',servicesID);
			roomManagerAPI
			  .get(endPointServicesById,function (err,res) {
			 	 expect(res.status).to.equal(config.httpStatus.Ok);
			 	 for (var i = 0; i < res.body.length; i++) {
			 	 	/*expect(res.body[i]).to.have.property("displayName");
			 	 	expect(res.body[i]).to.have.property("mail");*/
			 	 	var servicesAttend = res.body[i];
			 	 	//console.log(res.body[i]);
			 	 	//console.log(res.body[i].displayName);
			 	 	//servicesId._id = ObjectId(servicesAttend._id);

			 	 mongoDB
			 	 	.findDocument('services',servicesId,function (res) {
			 	 		expect(res).to.not.be.null;
			 	 		expect(servicesAttend.displayName).to.equal(res.body.displayName);
			 	 		expect(servicesAttend.mail).to.equal(res.body.mail);
			 	 	});
			 	 };
			 	 done();
			 });
		});
	});
});