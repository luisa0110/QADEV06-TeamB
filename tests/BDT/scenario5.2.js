//BDT - Meetings
//Author Ariel Wagner Rojas
// the next line call the file init.js to declare a global var(GLOBAL.initialDirectory)
var init = require('../../init');
//with config it can use the methods located into the config file
var config = require(GLOBAL.initialDirectory+'/config/config.json');
var expect = require('chai').expect;
//with tokenAPI it can use the parameters located into the loginAPI file
var tokenAPI = require(GLOBAL.initialDirectory+config.path.tokenAPI);
var roomManagerAPI = require(GLOBAL.initialDirectory+config.path.roomManagerAPI);
var endPoint = require(GLOBAL.initialDirectory+config.path.endPoints);
var meetingConfig = require(GLOBAL.initialDirectory+config.path.meetingConfig);
var locationConfig = require(GLOBAL.initialDirectory+config.path.locationConfig);
var util = require(GLOBAL.initialDirectory+config.path.util);
var mongodb= require(GLOBAL.initialDirectory+config.path.mongodb);
var ObjectId = require('mongodb').ObjectId;
//EndPoints
var url = config.url;
var endPointById = url + endPoint.locationById;
var meetingsEndPoint = url + endPoint.meetings;
var servicesEndPoint = url + endPoint.services;
var roomsEndPoint = url + endPoint.rooms;
var resourceEndPoint = url+endPoint.resources;
var endPointlocation = url + endPoint.locations;
//global variables
var rooms = endPoint.rooms;
var meetings = endPoint.meetings;
var basic = config.userBasicAccountJson;
var size = locationConfig.size;
var locationJsonId = locationConfig.locationIdForMongo;
var token = null;
var serviceId = null;
var roomId = null;
var meetingId1 = null;
var meetingId2 = null;
var meetingId3 = null;
var displayName = null;
var location = null; 
var locationId = null;
var endPointLocationById = null;
var locationJson  = null;

describe('meetings', function () {
	this.timeout(config.timeOut);
	before('Geeting the token', function (done) {
		process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
		tokenAPI
			.getToken(function(err,res){
				token = res.body.token;
				var json = meetingConfig.displayName;
				mongodb
					.findDocument('rooms', json, function(res2){
						roomId = res2._id;
						serviceId = res2.serviceId;
						displayName=res2.displayName;
						done();
					});
			});
	});

	describe('Scenario 5.2: Create meetings at different time in a Room', function () {
		context('Given I have a Room', function(){
			before('And a location assigned at to Room', function (done) {
				console.log('\t\tAnd a location assigned at to Room');
				locationJson = util.generateLocationJson(size.nameSize,size.customNameSize,size.description);
				roomManagerAPI
					.post(token,endPointlocation,locationJson,function (err,res) {
						location = res.body;
						locationId = res.body._id;
						endPointLocationById = util.stringReplace(endPointById,locationConfig.locationIdReplace,location._id);
						meetingConfig.locationId.locationId = locationId;
						var json = meetingConfig.locationId;
						roomManagerAPI.
							put(token,roomsEndPoint + '/' + roomId, json, function(err,res){
								done();
							});
					});
			});

			before('And one meeting assigned at the Room', function(done){
				console.log('\t\tAnd one meeting assigned at the Room');
				var num = displayName.substring(10);
				var meetingJSon = util.generatemeetingJson(num);
				meetingJSon.start = meetingConfig.startMeeting;
				meetingJSon.end = meetingConfig.endMeeting;
				roomManagerAPI
					.postwithBasic(basic, servicesEndPoint + '/' + serviceId + '/' + rooms + '/' + roomId + '/' + meetings, meetingJSon, function(err, res){
						meetingId1 = res.body._id;
						done();
					});
			});

			after('Deleting The location, resources and meeting', function (done) {
				roomManagerAPI
				  	.del(token,endPointLocationById,function (err,res) {
						roomManagerAPI
							.delwithBasic(basic, servicesEndPoint + '/' + serviceId + '/' + rooms + '/' + roomId + '/' + meetings + '/' + meetingId1, function(err, res){
								meetingId1 = null;
								done();
							});
					});
			});

			describe('When a new meeting is assigned to same Room at different time', function () {
				after('deleting the new meeting', function (done) {
					roomManagerAPI
						.delwithBasic(basic, servicesEndPoint + '/' + serviceId + '/' + rooms + '/' + roomId + '/' + meetings + '/' + meetingId2, function(err, res){
							meetingId2 = null;
							roomManagerAPI
								.delwithBasic(basic, servicesEndPoint + '/' + serviceId + '/' + rooms + '/' + roomId + '/' + meetings + '/' + meetingId3, function(err, res){
									meetingId3 = null;
									done();
								});
						});
				});
				
				it('Then ensure that is possible assign more of one meeting to room at different time', function (done) {
					var num = displayName.substring(10);
					var meetingJSon = util.generatemeetingJson(num);
					meetingJSon.start = meetingConfig.startMeeting2;
					meetingJSon.end = meetingConfig.endMeeting2;
					roomManagerAPI
						.postwithBasic(basic, servicesEndPoint + '/' + serviceId + '/' + rooms + '/' + roomId + '/' + meetings, meetingJSon, function(err, res){
							meetingId2 = res.body._id;
							expect(res.status).to.equal(config.httpStatus.Ok);
							expect(res.body).to.not.be.undefined;
							meetingJSon.start = meetingConfig.startMeeting3;
							meetingJSon.end = meetingConfig.endMeeting3;
							roomManagerAPI
								.postwithBasic(basic, servicesEndPoint + '/' + serviceId + '/' + rooms + '/' + roomId + '/' + meetings, meetingJSon, function(err, res1){
									meetingId3 = res1.body._id;
									expect(res1.status).to.equal(config.httpStatus.Ok);
									expect(res1.body).to.not.be.undefined;
									done();
								});
						});
				});
			});
		});
	});
});