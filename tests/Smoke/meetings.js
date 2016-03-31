//Smoke testing - GET Meetings
//Author Ariel Wagner Rojas
// the next line call the file init.js to declare a global var(GLOBAL.initialDirectory)
var init = require('../../init');
//with config it can use the methods located into the config file
var expect = require('chai').expect;
var RequireServices = require(GLOBAL.initialDirectory+'/lib/req-serv.js').RequireServices;
var requireServices = new RequireServices();
//with tokenAPI it can use the parameters located into the loginAPI file
var config = requireServices.config();
var tokenAPI = requireServices.tokenAPI();
var roomManagerAPI = requireServices.roomManagerAPI();
var endPoint = requireServices.endPoint();
var meetingConfig = require(GLOBAL.initialDirectory+config.path.meetingConfig);
var util = requireServices.util();
var mongodb= requireServices.mongodb();
//EndPoints
var url = config.url;
var meetingsEndPoint = url + endPoint.meetings;
var servicesEndPoint = url + endPoint.services;
var roomsEndPoint = url + endPoint.rooms;
var rooms = endPoint.rooms;
var meetings = endPoint.meetings;
var basic = config.userBasicAccountJson;
//global variables
//the token variable will contain the token
var token = null;
//the serviceId variable will contain the service id
var serviceId = null;
//the roomId variable will contain the room id
var roomId = null;
//the meetingId variable will contain the meeting id
var meetingId = null;
//the Room displayName
var displayName = null;

describe('Smoke testings for meetings: GET Method', function () {
	
	this.timeout(config.timeOut);

	before('Getting the serviceId and roomId', function (done){
		process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
		var json = meetingConfig.displayNameRoom;
		mongodb
			.findDocument('rooms', json, function(res2){
				roomId = res2._id;
				serviceId = res2.serviceId;
				displayName=res2.displayName;
				done();
			});
	});

	it('GET /services/{:serviceId}/rooms/{:roomId}/meetings returns 200', function (done){	
		roomManagerAPI
			.get(servicesEndPoint + '/' + serviceId + '/' + rooms + '/' + roomId + '/' + meetings, function(err, res){
				expect(res.status).to.equal(config.httpStatus.Ok);
				done();
			});
	});
});

describe('Smoke testings for meetings : POST Method', function () {
	
	this.timeout(config.timeOut);

	before('Getting the serviceId and roomId', function (done){
		process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
		var json = meetingConfig.displayNameRoom;
		mongodb
			.findDocument('rooms', json, function(res2){
				roomId = res2._id;
				serviceId = res2.serviceId;
				displayName=res2.displayName;
				done();
			});
	});


	after('Deleting the meeting', function (done) {
		roomManagerAPI
			.delwithBasic(basic, servicesEndPoint + '/' + serviceId + '/' + rooms + '/' + roomId + '/' + meetings + '/' + meetingId, function(err, res){
				done();
			});
	});

	it('POST /services/{:serviceId}/rooms/{:roomId}/meetings returns 200', function (done){	
		var num = displayName.substring(10);
		var meetingJSon = util.generatemeetingJson(num);
		roomManagerAPI
			.postwithBasic(basic, servicesEndPoint + '/' + serviceId + rooms  + '/' +roomId  + meetings, meetingJSon,function(err, res){
				meetingId = res.body._id;
				expect(res.status).to.equal(config.httpStatus.Ok);
				done();
			});
	});
});

describe('Smoke testings for meetings : GET, PUT and DELETE methods by meeting Id', function () {
	
	this.timeout(config.timeOut);

	before('Getting the basic authentication ',function (done){
		process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
		var json=meetingConfig.displayNameRoom;
		mongodb
			.findDocument('rooms', json, function(res2){
				roomId = res2._id;
				serviceId = res2.serviceId;
				displayName=res2.displayName;
				var num = displayName.substring(10);
				var meetingJSon = util.generatemeetingJson(num);
				roomManagerAPI
					.postwithBasic(basic, servicesEndPoint + '/' + serviceId + '/' + rooms + '/' + roomId + '/' + meetings, meetingJSon, function(err, res3){
						meetingId = res3.body._id;
						done();
					});
			});
	});

	it('GET /services/{:serviceId}/rooms/{:roomId}/meetings/{:meetingId} returns 200', function (done){	
		roomManagerAPI
			.get(servicesEndPoint + '/' + serviceId + '/' + rooms + '/' + roomId + '/' + meetings + '/' + meetingId, function(err, res){
				expect(res.status).to.equal(config.httpStatus.Ok);
				done();
			});
	});

	it('PUT /services/{:serviceId}/rooms/{:roomId}/meetings/{:meetingId} returns 200', function (done){	
		var num = displayName.substring(10);
		var meetingPutJSon = util.generatemeetingJson(num);
		meetingPutJSon._id = roomId;
		meetingPutJSon.resources = ['Floor1Room1@sinergy.eng'];
		roomManagerAPI
			.putwithBasic(basic, servicesEndPoint + '/' + serviceId + '/' + rooms + '/' + roomId + '/' + meetings + '/' + meetingId, meetingPutJSon, function(err, res){
				expect(res.status).to.equal(config.httpStatus.Ok);
				done();
			});
	});	

	it('DELETE /services/{:serviceId}/rooms/{:roomId}/meetings/{:meetingId} returns 200', function (done) {
		roomManagerAPI
			.delwithBasic(basic, servicesEndPoint + '/' + serviceId + '/' + rooms + '/' + roomId + '/' + meetings + '/' + meetingId, function(err, res){
				expect(res.status).to.equal(config.httpStatus.Ok);
				done();
			});
	});
});