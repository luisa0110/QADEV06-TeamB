// Scenario1.1.js by Joaquin Gonzales
 /*
Scenario 1.1 – Disable a room with a meeting associated

Given I have a Room from Exchange server
	And a location associated 
	And one meeting reserved with an specific date
When I dissable the Room
	Then ensure that the meeting is there without changes
*/
var init = require('../../init.js');
var config = require(GLOBAL.initialDirectory+'/config/config.json');
var expect = require('chai').expect;

var roomManagerAPI = require(GLOBAL.initialDirectory+config.path.roomManagerAPI);
var tokenAPI = require(GLOBAL.initialDirectory+config.path.tokenAPI);
var mongodb = require(GLOBAL.initialDirectory+config.path.mongodb);
var serviceConfig = require(GLOBAL.initialDirectory+config.path.serviceConfig);
var locationConfig = require(GLOBAL.initialDirectory+config.path.locationConfig);
var resourceConfig = require(GLOBAL.initialDirectory+config.path.resourceConfig);
var util = require(GLOBAL.initialDirectory+config.path.util);

var roomJson = serviceConfig.roomDisplayJson;
//var locationJson = locationConfig.locationJson;
var roomtolocationJson = serviceConfig.locationId;
var resourceJson = resourceConfig.resourceJson;
var RoomDisablejson = serviceConfig.RoomDisablejson;

var endPoints = require(GLOBAL.initialDirectory+config.path.endPoints);
var url = config.url;
var locationEndPoint = url+endPoints.locations;
var serviceEndPoint = url+endPoints.services;
var resourceEndPoint = url+endPoints.resources; 
var meetings = endPoints.meetings;
var rooms = endPoints.rooms;
var basic = config.userBasicAccountJson;

var size = locationConfig.size;
var token = null; 
var Service = null;
var roomId = null;
var room = null;
var location = null;
var resource = null;
var meeting = null;
var displayName = null;
var meetingEndPoint = null;
var urlRoom = null;
//status for response 200
var ok = config.httpStatus.Ok;

describe('Scenario 1.1 – Disable a room with a meeting associated', function () {
	context('Given I have a Room e.g(Floor1Room99) from Exchange server',function(){
		before('Getting the the Room From email server and token',function (done)
		{
			process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
			tokenAPI
				.getToken(function (err,res)
				{					
					token = res.body.token;
					roomManagerAPI
						.getwithToken(token,serviceEndPoint,function (err,res)
						{
							Service = res.body;
							mongodb
								.findDocument('rooms',roomJson,function(res)
								{
									roomId = res._id;
									displayName = res.displayName;
									urlRoom = serviceEndPoint+'/'+Service[0]._id + rooms+'/'+roomId;
									roomManagerAPI
										.get(urlRoom,function(err,res)
										{
											room = res;
											done();
										});	
								});
						});
				});
			
		});
		before('And a location associated',function (done) {
			console.log('\t \tAnd a location associated');
			var locationJson = util.generateLocationJson(size.nameSize,size.customNameSize,size.description);
			roomManagerAPI
				.post(token,locationEndPoint,locationJson,function(err,res)
				{
					location = res;
					roomtolocationJson.locationId = location.body._id;
					roomManagerAPI
						.put(token,urlRoom,roomtolocationJson,function(err,res)
						{
							done();
						});
				});
		});
		
		before('And one meeting reserved with an specific date',function (done) {
			console.log('\t \tAnd one meeting reserved with an specific date');
			var num = displayName.substring(10);
			var meetingJSon = util.generatemeetingJson(num);
			meetingEndPoint = serviceEndPoint + '/' + Service[0]._id + rooms + '/' + roomId +  meetings; 
			roomManagerAPI
				.postwithBasic(basic,meetingEndPoint,meetingJSon,function (err,res)
				{
					meeting = res;
					done();
				});
		});
		after(function (done) {
			RoomDisablejson.enabled = true;
			roomManagerAPI
				.del(token,locationEndPoint+'/'+location.body._id,function (err,res)
				{
					roomManagerAPI
						.delwithBasic(basic,meetingEndPoint+'/'+meeting.body._id,function()
						{
							roomManagerAPI
								.put(token,urlRoom,RoomDisablejson,function(err,res)
								{
									done();
								});
						});
				});
		});
		describe('When I dissable the Room e.g(Floor1Room99)', function () {
			it('Then ensure that the Room is there without changes', function (done) {				
				roomManagerAPI
					.put(token,urlRoom,RoomDisablejson,function(err,res)
					{
						expect(res.status).to.equal(ok);
						expect(res.body._id).to.equal(roomId.toString());
						expect(res.body._id).to.equal(meeting.body.roomId.toString());
						expect(res.body.enabled).to.equal(false);
						done();
					});
			});
			it('Then the meeting is associated to the Room',function (done)
			{
				roomManagerAPI
					.get(meetingEndPoint,function(err,res)
					{
						expect(res.status).to.equal(ok);
						expect(res.body[0].roomId).to.equal(roomId.toString());
						expect(res.body[0].roomEmail).to.equal(room.body.emailAddress);
						done();
					});
			});
		});
		
	});
});