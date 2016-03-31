//CRUD testing - GET Meetings
//Author Ariel Wagner Rojas
// the next line call the file init.js to declare a global var(GLOBAL.initialDirectory)
var init = require('../../init');
//with config it can use the methods located into the config file
var expect = require('chai').expect;
var RequireServices = require(GLOBAL.initialDirectory+'/lib/req-serv.js').RequireServices;
var requireServices = new RequireServices();
var config = requireServices.config();
//with tokenAPI it can use the parameters located into the loginAPI file
var tokenAPI = requireServices.tokenAPI();
var roomManagerAPI = requireServices.roomManagerAPI();
var endPoint = requireServices.endPoint();
var meetingConfig = require(GLOBAL.initialDirectory+config.path.meetingConfig);
var util = requireServices.util();
var mongodb= requireServices.mongodb();
var ObjectId = require('mongodb').ObjectId;
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
//the meeting variable contains the meeting specified
var meeting = null;

describe('CRUD testings for meetings : POST Method', function () {
	
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

	it('POST /services/{:serviceId}/rooms/{:roomId}/meetings', function (done){	
		var num = displayName.substring(10);
		var meetingJSon = util.generatemeetingJson(num);
		roomManagerAPI
			.postwithBasic(basic, servicesEndPoint + '/' + serviceId + '/' + rooms + '/' + roomId + '/' + meetings, meetingJSon, function(err, res){
				var json = {"_id" : ObjectId(res.body._id)}
				mongodb.findDocument('meetings', json, function(res1){
					meeting = res1;
					meetingId = res.body._id;
					expect(res.status).to.equal(config.httpStatus.Ok);
					expect(res.body).to.have.property("serviceId");
					expect(res.body.serviceId).to.equal(meeting.serviceId);
					expect(res.body).to.have.property("roomId");
					expect(res.body.roomId).to.equal(meeting.roomId);
					expect(res.body).to.have.property("roomEmail");
					expect(res.body.roomEmail).to.equal(meeting.roomEmail);
					expect(res.body).to.have.property("start");
					expect((new Date(res.body.start)).toGMTString()).to.equal((new Date(meeting.start)).toGMTString());
					expect(res.body).to.have.property("end");
					expect((new Date(res.body.end)).toGMTString()).to.equal((new Date(meeting.end)).toGMTString());
					expect(res.body).to.have.property("location");
					expect(res.body.location).to.equal(meeting.location);
					expect(res.body).to.have.property("title");
					expect(res.body.title).to.equal(meeting.title);
					expect(res.body).to.have.property("organizer");
					expect(res.body.organizer).to.equal(meeting.organizer);
					expect(res.body).to.have.property("uniqueId");
					expect(res.body.uniqueId).to.equal(meeting.uniqueId);
					expect(res.body.id).to.equal(meeting.id);
					expect(res.body.itemIds).to.equal(meeting.itemIds);
					expect(res.body).to.have.property("createdByRM");
					expect(res.body.createdByRM).to.equal(meeting.createdByRM);
					expect(res.body).to.have.property("_id");
					expect(res.body._id).to.equal(meeting._id.toString());
					expect(res.body).to.have.property("resources");
					expect(res.body.resources).to.eql(meeting.resources);
					expect(res.body).to.have.property("attendees");
					expect(res.body.attendees).to.eql(meeting.attendees);
					expect(res.body).to.have.property("kind");
					expect(res.body.kind).to.equal(meeting.kind);
					done();
				});
			});
	});
});

describe('CRUD testings for meetings : GET method (all meetings), GET, PUT and DELETE methods by meeting Id', function () {

	this.timeout(config.timeOut);

	before('Creating the meeting ',function (done){
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
						var jsonId = {"_id" : ObjectId(res3.body._id)}
						mongodb
							.findDocument('meetings', jsonId, function(res4){
								meeting = res4;
								done();
							});
					});
			});
	});

	it('GET /services/{:serviceId}/rooms/{:roomId}/meetings', function (done){	
		roomManagerAPI
			.get(servicesEndPoint + '/' + serviceId + '/' + rooms + '/' + roomId + '/' + meetings, function(err, res){
				expect(res.status).to.equal(config.httpStatus.Ok);
				expect(res.body[0]).to.have.property("serviceId");
				expect(res.body[0].serviceId).to.equal(meeting.serviceId);
				expect(res.body[0]).to.have.property("roomId");
				expect(res.body[0].roomId).to.equal(meeting.roomId);
				expect(res.body[0]).to.have.property("roomEmail");
				expect(res.body[0].roomEmail).to.equal(meeting.roomEmail);
				expect(res.body[0]).to.have.property("start");
				expect((new Date(res.body[0].start)).toGMTString()).to.equal((new Date(meeting.start)).toGMTString());
				expect(res.body[0]).to.have.property("end");
				expect((new Date(res.body[0].end)).toGMTString()).to.equal((new Date(meeting.end)).toGMTString());
				expect(res.body[0]).to.have.property("location");
				expect(res.body[0].location).to.equal(meeting.location);
				expect(res.body[0]).to.have.property("title");
				expect(res.body[0].title).to.equal(meeting.title);
				expect(res.body[0]).to.have.property("organizer");
				expect(res.body[0].organizer).to.equal(meeting.organizer);
				expect(res.body[0]).to.have.property("uniqueId");
				expect(res.body[0].uniqueId).to.equal(meeting.uniqueId);
				expect(res.body[0]).to.have.property("createdByRM");
				expect(res.body[0].createdByRM).to.equal(meeting.createdByRM);
				expect(res.body[0]).to.have.property("resources");
				expect(res.body[0].resources).to.eql(meeting.resources);
				expect(res.body[0]).to.have.property("attendees");
				expect(res.body[0].attendees).to.eql(meeting.attendees);
				expect(res.body[0]).to.have.property("kind");
				expect(res.body[0].kind).to.equal(meeting.kind);
				done();
			});
	});

	it('GET /services/{:serviceId}/rooms/{:roomId}/meetings/{:meetingId}', function (done){	
		roomManagerAPI
			.get(servicesEndPoint + '/' + serviceId + '/' + rooms + '/' + roomId + '/' + meetings + '/' + meetingId, function(err, res){
				expect(res.status).to.equal(config.httpStatus.Ok);
				expect(res.body).not.to.be.null;
				expect(res.body).to.not.be.undefined;
				expect(res.body).to.have.property("serviceId");
				expect(res.body.serviceId).to.equal(meeting.serviceId);
				expect(res.body).to.have.property("roomId");
				expect(res.body.roomId).to.equal(meeting.roomId);
				expect(res.body).to.have.property("roomEmail");
				expect(res.body.roomEmail).to.equal(meeting.roomEmail);
				expect(res.body).to.have.property("start");
				expect((new Date(res.body.start)).toGMTString()).to.equal((new Date(meeting.start)).toGMTString());
				expect(res.body).to.have.property("end");
				expect((new Date(res.body.end)).toGMTString()).to.equal((new Date(meeting.end)).toGMTString());
				expect(res.body).to.have.property("location");
				expect(res.body.location).to.equal(meeting.location);
				expect(res.body).to.have.property("title");
				expect(res.body.title).to.equal(meeting.title);
				expect(res.body).to.have.property("organizer");
				expect(res.body.organizer).to.equal(meeting.organizer);
				expect(res.body).to.have.property("uniqueId");
				expect(res.body.uniqueId).to.equal(meeting.uniqueId);
				expect(res.body).to.have.property("createdByRM");
				expect(res.body.createdByRM).to.equal(meeting.createdByRM);
				expect(res.body).to.have.property("resources");
				expect(res.body.resources).to.eql(meeting.resources);
				expect(res.body).to.have.property("attendees");
				expect(res.body.attendees).to.eql(meeting.attendees);
				expect(res.body).to.have.property("kind");
				expect(res.body.kind).to.equal(meeting.kind);
				done();
			});
	});

	it.skip('PUT /services/{:serviceId}/rooms/{:roomId}/meetings/{:meetingId}', function (done){	
		var num = displayName.substring(10);
		var meetingPutJSon = util.generatemeetingJson(num);
		roomManagerAPI
			.putwithBasic(basic, servicesEndPoint + '/' + serviceId + '/' + rooms + '/' + roomId + '/' + meetings + '/' + meetingId, meetingPutJSon, function(err, res){
				var json = {"_id" : ObjectId(res.body._id)}
				mongodb
					.findDocument('meetings', json, function(res1){
						meeting = res1;
						expect(res.status).to.equal(config.httpStatus.Ok);
						expect(res.body).not.to.be.null;
						expect(res.body).to.not.be.undefined;
						expect(res.body).to.have.property("serviceId");
						expect(res.body.serviceId).to.equal(meeting.serviceId);
						expect(res.body).to.have.property("roomId");
						expect(res.body.roomId).to.equal(meeting.roomId);
						expect(res.body).to.have.property("roomEmail");
						expect(res.body.roomEmail).to.equal(meeting.roomEmail);
						expect(res.body).to.have.property("start");
						expect((new Date(res.body.start)).toGMTString()).to.equal((new Date(meeting.start)).toGMTString());
						expect(res.body).to.have.property("end");
						expect((new Date(res.body.end)).toGMTString()).to.equal((new Date(meeting.end)).toGMTString());
						expect(res.body).to.have.property("location");
						expect(res.body.location).to.equal(meeting.location);
						expect(res.body).to.have.property("title");
						expect(res.body.title).to.equal(meeting.title);
						expect(res.body).to.have.property("organizer");
						expect(res.body.organizer).to.equal(meeting.organizer);
						expect(res.body).to.have.property("uniqueId");
						expect(res.body.uniqueId).to.equal(meeting.uniqueId);
						expect(res.body).to.have.property("createdByRM");
						expect(res.body.createdByRM).to.equal(meeting.createdByRM);
						expect(res.body).to.have.property("resources");
						expect(res.body.resources).to.eql(meeting.resources);
						expect(res.body).to.have.property("attendees");
						expect(res.body.attendees).to.eql(meeting.attendees);
						expect(res.body).to.have.property("kind");
						expect(res.body.kind).to.equal(meeting.kind);
						done();
					});
			});
	});	

	it('DELETE /services/{:serviceId}/rooms/{:roomId}/meetings/{:meetingId} returns 200', function (done) {
		roomManagerAPI
			.delwithBasic(basic, servicesEndPoint + '/' + serviceId + '/' + rooms + '/' + roomId + '/' + meetings + '/' + meetingId, function(err, res){
				expect(res.status).to.equal(config.httpStatus.Ok);
				expect(res.body).not.to.be.null;
				expect(res.body).to.not.be.undefined;
				expect(res.body).to.have.property("serviceId");
				expect(res.body.serviceId).to.equal(meeting.serviceId);
				expect(res.body).to.have.property("roomId");
				expect(res.body.roomId).to.equal(meeting.roomId);
				expect(res.body).to.have.property("roomEmail");
				expect(res.body.roomEmail).to.equal(meeting.roomEmail);
				expect(res.body).to.have.property("start");
				expect((new Date(res.body.start)).toGMTString()).to.equal((new Date(meeting.start)).toGMTString());
				expect(res.body).to.have.property("end");
				expect((new Date(res.body.end)).toGMTString()).to.equal((new Date(meeting.end)).toGMTString());
				expect(res.body).to.have.property("location");
				expect(res.body.location).to.equal(meeting.location);
				expect(res.body).to.have.property("title");
				expect(res.body.title).to.equal(meeting.title);
				expect(res.body).to.have.property("organizer");
				expect(res.body.organizer).to.equal(meeting.organizer);
				expect(res.body).to.have.property("uniqueId");
				expect(res.body.uniqueId).to.equal(meeting.uniqueId);
				expect(res.body).to.have.property("createdByRM");
				expect(res.body.createdByRM).to.equal(meeting.createdByRM);
				expect(res.body).to.have.property("resources");
				expect(res.body.resources).to.eql(meeting.resources);
				expect(res.body).to.have.property("attendees");
				expect(res.body.attendees).to.eql(meeting.attendees);
				expect(res.body).to.have.property("kind");
				expect(res.body.kind).to.equal(meeting.kind);
				done();
			});
	});
});