
var init = require('../../init.js');
var expect = require('chai').expect;

var RequireServices = require(GLOBAL.initialDirectory+'/lib/req-serv.js').RequireServices;
var requireServices = new RequireServices();

var config = requireServices.config();
var roomManagerAPI = requireServices.roomManagerAPI();
var tokenAPI = requireServices.tokenAPI();
var mongodb = requireServices.mongodb();
var serviceConfig = require(GLOBAL.initialDirectory+config.path.serviceConfig);
var locationConfig = requireServices.locationConfig();
var resourceConfig = requireServices.resourceConfig();
var util = requireServices.util();

var roomJson = serviceConfig.roomDisplayJson;
var roomtolocationJson = serviceConfig.locationId;
var resourceJson = resourceConfig.resourceJson;
var RoomDisablejson = serviceConfig.RoomDisablejson;

var endPoints = requireServices.endPoint()
var url = config.url;
var locationEndPoint = url+endPoints.locations;
var serviceEndPoint = url+endPoints.services;
var resourceEndPoint = url+endPoints.resources; 
var meetings = endPoints.meetings;
var rooms = endPoints.rooms;
var basic = config.userBasicAccountJson;

var size = locationConfig.size
var token, Service, roomId,room ,location ,resource,
    meeting ,displayName ,meetingEndPoint ,urlRoom; 
//status for response 200
var ok = config.httpStatus.Ok;

 /*
Scenario 1.2– Deleting a location with a meeting associated to a room

Given I have a Room from Exchange server
	And a location associated 
	And one meeting reserved with an specific date
When I delete the location associated to a room
	Then ensure that the meeting is there without changes
	and the room does not has a location
*/


describe('Scenario 1.2– Deleting a location with a meeting associated to a room', function () {
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
		before(' And a location associated',function (done) {
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
					.delwithBasic(basic,meetingEndPoint+'/'+meeting.body._id,function()
					{
						roomManagerAPI
							.put(token,urlRoom,RoomDisablejson,function(err,res)
							{
								done();
							});
				});
		});
		describe('When I delete the location associated to a room', function () {
			it('Then ensure that the meeting is there without changes', function (done) {				
				roomManagerAPI
					.get(meetingEndPoint,function(err,res)
					{
						expect(res.status).to.equal(ok);
						expect(res.body[0].roomId).to.equal(roomId.toString());
						expect(res.body[0].roomEmail).to.equal(room.body.emailAddress);
						done();
					});
			});
			it('and the room does not has a location',function (done)
			{
				roomManagerAPI
					.del(token,locationEndPoint+'/'+location.body._id,function (err,res)
					{
						urlRoom = serviceEndPoint+'/'+Service[0]._id + rooms+'/'+roomId;
						roomManagerAPI
							.get(urlRoom,function(err,res)
							{
								expect(res.status).to.equal(ok);
								var roomStatus = res.body;
								expect(roomStatus._id).to.equal(roomId.toString());
								expect(roomStatus.locationId).to.equal(null);
								done();
							});	
					});
			});
		});
	});
});