//scenario3.2.js
//Ivan Morales Camacho
var init 	= require('../../init');
var expect 	= require('chai').expect;

var RequireServices = require(GLOBAL.initialDirectory+'/lib/req-serv.js').RequireServices;
var requireServices = new RequireServices();

var ObjectId 		 = require('mongodb').ObjectID;
var config 			 = requireServices.config();
var tokenAPI 		 = requireServices.tokenAPI();
var roomManagerAPI 	 = requireServices.roomManagerAPI();
var util			 = requireServices.util();
var getEndPoint		 = requireServices.endPoint();
var mongodb			 = requireServices.mongodb();
var outOfOrderConfig = requireServices.outOfOrder();
var roomJson 		 = requireServices.room();
var resourceConfig 	 = requireServices.resourceConfig();
var meetingsConfig 	 = requireServices.meetingConfig();
/* out of order*/     	
var outOfOrderbyIDEndPoint 		= config.url + getEndPoint.getOutOfOrder;
var outOfOrderbyServiceEndPoint	= config.url + getEndPoint.getOutOfOrderbyService;
//resource
var resourceEndPoint = config.url + getEndPoint.resources;
var url 			 = config.url;
//locations
var locationConfig = require(GLOBAL.initialDirectory + config.path.locationConfig);
var endPoint 	   = config.url + getEndPoint.locations;
var endPointById   = config.url + getEndPoint.locationById;
var size 		   = locationConfig.size;
//meeting
var servicesEndPoint = url + getEndPoint.services;
var basic 			 = config.userBasicAccountJson;
var rooms 			 = getEndPoint.rooms;
var meetings 		 = getEndPoint.meetings;
//timeout
var timeout			 = config.timeOut;
//global variables
var endPointOutOfOrder	 = null;
var resourceId 			 = null;
var room 				 = null;
var roomId 				 = null;
var serviceId 			 = null;
var token				 = null;
var locationID 			 = null;
var endPointLocationById = null;
var locationJson  		 = null;
var outOforderId 		 = null;
var meeting 			 = null;
var meetingId 			 = null;
var roomEmail 			 = null;
var locationName 		 = null;

describe('Scenario 3.2 – Create a meeting in a room associated to location in different date of the out of order ', function () {
	this.timeout(timeout);
	context('Given a room out of order e.g roomA ', function(){
		before('get the token of the roomManager', function(done) {
			process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
			tokenAPI
				.getToken(function(err, res){
					token = res.body.token;
					done();
				});
		});	
		before('return  the room of roomManager', function(done) {
			mongodb.findDocument('rooms', meetingsConfig.displayName, function(res){
				room = res;
				roomId = res._id;
				done();
			});
		});
		before(function(done) {
			console.log('\t \t And an location eg. floor1 is created');
			locationJson = util.generateLocationJson(size.nameSize, size.customNameSize, size.description);
			roomManagerAPI
				.post(token, endPoint, locationJson, function (err, res) {
					locationID = res.body._id;
					locationName = res.body.customName;
					endPointLocationById = util.stringReplace(endPointById, locationConfig.locationIdReplace, locationID);
					done();
				});
		});
		after('delete a locations ',function(done) {
			roomManagerAPI
			  .del(token, endPointLocationById, function (err, res) {
			  	 	done();
			  });
		});	
	
		before( function(done){
			console.log('\t \t And the floor1 is associated to roomA');
			associateLocation = { "locationId" :locationID};
			var associateEndPointL = url + '/rooms/'+roomId;
			roomManagerAPI
				.put(token, associateEndPointL, associateLocation, function(err, res){
					done();
				});				
		});
		before( function(done){
			console.log('\t \t And put out of order a roomA with a spesific time');
			endPoint1 = util.stringReplace(outOfOrderbyIDEndPoint, config.nameId.serviceId, room.serviceId);
			endPointOutOfOrder = util.stringReplace(endPoint1, config.nameId.roomId, room._id);
			outOfOrderConfig.bdtJson.roomId = roomId;
			associateOutOfOrder = outOfOrderConfig.bdtJson;
			roomManagerAPI.post(token, endPointOutOfOrder, associateOutOfOrder, function(err, res){
				outOforderId = res.body._id;
				done();
			});					
		});
		after('delete the out of order of the roomA', function(done){
			endPoint1 = util.stringReplace(outOfOrderbyServiceEndPoint, config.nameId.serviceId, room.serviceId);
			endPoint2 = util.stringReplace(endPoint1, config.nameId.roomId, room._id);
			endPoint = util.stringReplace(endPoint2, config.nameId.outOfOrderId, outOforderId);
			roomManagerAPI
				.del(token, endPoint, function(err, res){
					done();
				});				
		});
		describe('When you want to create a meeting in the roomA that its stops be room out of order\n', function () {
		it('then the meeting must be created', function(done) {
				var num = room.displayName.substring(10);
				meetingsConfig.meetingJSon.location = room.displayName;
				meetingsConfig.meetingJSon.roomEmail = room.roomEmail;
				meetingsConfig.meetingJSon.start = util.getDate(4);
		   		meetingsConfig.meetingJSon.end = util.getDate(5);
				associateEndPointM=servicesEndPoint + '/' + room.serviceId + rooms + '/' + roomId + meetings;

				roomManagerAPI
					.postwithBasic(basic, associateEndPointM, meetingsConfig.meetingJSon, function(err, res){
						meetingId = res.body._id;
				var json = {"_id" : ObjectId(res.body._id)};
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
			after('delete the meeting ',function (done) {
					roomManagerAPI
						.delwithBasic(basic, servicesEndPoint + '/' + room.serviceId + '/' + rooms + '/' + roomId + '/' + meetings + '/' + meetingId, function(err, res){
							done();
						});
				});
		});
	});	
});