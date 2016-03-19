/**
 * CRUD of Attendees Route by: Jose Antonio Cardozo
 */
var init = require('../../init');
var config = require(GLOBAL.initialDirectory+'/config/config.json');
var expect = require('chai').expect;
var tokenAPI = require(GLOBAL.initialDirectory+config.path.tokenAPI);
var endPoints = require(GLOBAL.initialDirectory+config.path.endPoints);
var roomManagerAPI = require(GLOBAL.initialDirectory+config.path.roomManagerAPI);
var mongoDB = require(GLOBAL.initialDirectory+config.path.mongodb);
var locationConfig = require(GLOBAL.initialDirectory+config.path.locationConfig);

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
			 	 	expect(res.body[i]).to.have.property("username");
			 	 	expect(res.body[i]).to.have.property("mail");
			 	 	var servicesAttend = res.body[i];
			 	 	servicesId._id = ObjectId(servicesAttend._id);

			 	 mongoDB
			 	 	.findDocument('services',servicesId,function (res) {
			 	 		expect(res).to.not.be.null;
			 	 		expect(servicesAttend.username).to.equal(res.body.username);
			 	 		expect(servicesAttend.mail).to.equal(res.body.mail);
			 	 	});
			 	 };
			 	 done();
			 });
		});
	});
});