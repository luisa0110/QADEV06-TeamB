/**
* Scenario 6.2 – Create a meeting at the room with location and after delete the parent location.
* Given a room with location with sublocation
* when created a meeting in the subLocation
* Then modify the location a sublocation
* Then delete the parent location
*/
var init = require('../../init');
var config = require(GLOBAL.initialDirectory+'/config/config.json');
var expect = require('chai').expect;
var tokenAPI = require(GLOBAL.initialDirectory+config.path.tokenAPI);
var endPoints = require(GLOBAL.initialDirectory+config.path.endPoints);
var roomManagerAPI = require(GLOBAL.initialDirectory+config.path.roomManagerAPI);
var mongoDB = require(GLOBAL.initialDirectory+config.path.mongodb);
var roomJson = require(GLOBAL.initialDirectory+config.path.room);
var util = require(GLOBAL.initialDirectory+config.path.util);
var locationConfig = require(GLOBAL.initialDirectory+config.path.locationConfig);
var resourceConfig = require(GLOBAL.initialDirectory+config.path.resourceConfig);
var meetingConfig = require(GLOBAL.initialDirectory+config.path.meetingConfig);
var basic = config.userBasicAccountJson;
var ObjectId = require('mongodb').ObjectId;

var token = null;
/** endPoints */
var endPointLocation = config.url + endPoints.locations;
var endPointLocationId = config.url + endPoints.locationById;
var resourceEndPoint = config.url + endPoints.resources;
var servicesEndPoint = config.url + endPoints.services;
var rooms = endPoints.rooms;
var meetings = endPoints.meetings;

/** global variables */
var size = locationConfig.size;
var roomId = null;
var locationId = null;   
var serviceId = null;
var roomName = null;
var meetingId = null;
var getRoomByMeeting = null;
var jsonIdMeeting = null;
var locationParent = null;
var locationJsonId = locationConfig.locationIdForMongo;


describe('Scenario 6.2 – Create a meeting in the sublocation ', function () {
	this.timeout(config.timeOut);
	context('Given a room with location with sublocation',function(){
		before('Generate token',function (done) {
			process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
			console.log('\t \tGenerate token')
			//getting the token
			tokenAPI
				.getToken(function(err,res){
					token = res.body.token;
					done();
				});
		});

		before('Getting a room',function (done) {
			console.log('\t \t Getting the room by ID');
			roomJson = meetingConfig.displayName;
			mongoDB
				.findDocument('rooms',roomJson,function(res){
					roomId = res._id;
					serviceId= res.serviceId
					roomName = res.displayName;
					done();
			});
		});

		before(' And location',function (done) {
			console.log('\t \t Creation of location parent');
			var locationJson = util.generateLocationJson(size.nameSize,size.customNameSize,size.description);
			roomManagerAPI
				.post(token,endPointLocation,locationJson,function (err,res) {
					locationParent = res.body._id;
					expect(res.status).to.equal(config.httpStatus.Ok);
					done();
				});
		});

		before(' And sublocation',function (done) {
			console.log('\t \t Creation of location that be sublocation');
			var SublocationJson = util.generateLocationJson(size.nameSize,size.customNameSize,size.description);
			roomManagerAPI
				.post(token,endPointLocation,SublocationJson,function (err,res) {
					location = res.body._id;
					expect(res.status).to.equal(config.httpStatus.Ok);
					done();
				});
		});

		after('Deleting the Sublocation ',function (done) {
			console.log('Remove the sublocation for keep clean the room manager')
			var endPointLocationById = util.stringReplace(endPointLocationId,locationConfig.locationIdReplace,location);
			roomManagerAPI
			  .del(token,endPointLocationById,function (err,res) {
			  	 	done();
			  });
		});

		describe('when created a meeting in the subLocation.', function () {
			
			after('Deleting the meeting', function (done) {
				console.log('Remove the meeting for keep clean the room manager')
				roomManagerAPI
					.delwithBasic(basic, servicesEndPoint + '/' + serviceId + '/' + rooms + '/' + roomId + '/' + meetings + '/' + meetingId, function(err, res){
					done();
				});
			});
			
			it('Then modify the location a sublocation', function (done) {
				console.log('Move the locatin at parent location')
				var locationParentJson = {"parentId": locationParent};
				var endPointLocationById = util.stringReplace(endPointLocationId,locationConfig.locationIdReplace,location);
				roomManagerAPI
					.put(token,endPointLocationById,locationParentJson,function (err,res) {
						expect(res.status).to.equal(config.httpStatus.Ok);
						expect(res.body.parent).to.equal(locationParent);
						done()
					});
			});

			it('The sublocation is associated with room', function (done) {
				console.log('\t \t The location is associated with the room');
				var endPoint=config.url + rooms+'/'+roomId;
				locationJSON = {"locationId" : location};
				roomManagerAPI.
						put(token,endPoint,locationJSON,function(err,res){
							expect(res.status).to.equal(config.httpStatus.Ok);
							done();	
						});
			});

			it('Then meeting is created', function (done) {
				console.log('\t \t The meeting was created ');
				var num = roomName.substring(10);
				var meetingJSon = util.generatemeetingJson(num);
					roomManagerAPI
					.postwithBasic(basic, servicesEndPoint + '/' + serviceId + '/' + rooms + '/' + roomId + '/' + meetings, meetingJSon, function(err, res){
						console.log('the meeting created is ' );
						meetingId = res.body._id;
						getRoomByMeeting = res.body;
						expect(res.status).to.equal(config.httpStatus.Ok);
						expect(res.body.servicesId).to.equal(this.servicesId);
						jsonIdMeeting = {"_id" : ObjectId(res.body._id)}
						done();
					});
			});

			it('Then location Parent is deleted', function (done) {
				console.log('Removed the location parent');
				var endPointLocationById = util.stringReplace(endPointLocationId,locationConfig.locationIdReplace,locationParent);
				roomManagerAPI
				  .del(token,endPointLocationById,function (err,res) {
				  	expect(res.status).to.equal(config.httpStatus.Ok);
				  	locationJsonId._id =  ObjectId(locationParent);
					mongoDB
						.findDocument('locations',locationJsonId,function (res) {
							expect(res).to.not.exist;
							done();
						});
			 	});
			});
			
			it('Then Verify that the meeting were not modify', function (done) {
				console.log('\t \t The meeting should be in the same room');
				var endPoint=config.url + rooms+'/'+roomId;
				mongoDB
					.findDocument('meetings',jsonIdMeeting,function (res) {
						expect(res.conflict).to.be.empty;
						expect(res._id.toString()).to.equal(getRoomByMeeting._id);
						expect(res.serviceId).to.be.equal(getRoomByMeeting.serviceId);
						expect(res.roomId).to.equal(getRoomByMeeting.roomId);
						expect(res.roomEmail).to.equal(getRoomByMeeting.roomEmail);
						expect(res.location).to.equal(getRoomByMeeting.location);
						expect(res.title).to.equal(getRoomByMeeting.title);
						expect(res.organizer).to.equal(getRoomByMeeting.organizer);
						expect(res.uniqueId).to.equal(getRoomByMeeting.uniqueId);
						expect(res.extendedProperties).to.eql(getRoomByMeeting.extendedProperties);
						done();	
					});
			});

			it('Then room be in the Sublocation', function (done) {
				console.log('\t \t The room should have the same sublocation')
				mongoDB
					.findDocument('rooms',roomJson,function(res){
						expect(res._id.toString()).to.equal(getRoomByMeeting.roomId.toString());
						expect(res.servicesId).to.equal(this.servicesId);
						expect(res.locationId.toString()).to.equal(locationJSON.locationId);
						expect(res.emailAddress).to.equal(getRoomByMeeting.roomEmail);
						done();
					});
			});
		});
	});
	
});