//Services CRUD test cases by Joaquin Gonzales

var init = require('../../init.js');
var config = require(GLOBAL.initialDirectory+'/config/config.json');
var expect = require('chai').expect;
var assert = require('chai').assert;
var should = require('chai').should();
var RequireServices = require(GLOBAL.initialDirectory+'/lib/req-serv.js').RequireServices;
var requireServices = new RequireServices();

//Configuration

var tokenAPI = requireServices.tokenAPI();
var roomManagerAPI =  requireServices.roomManagerAPI();
var mongodb = requireServices.mongodb();
var endPoints = requireServices.endPoint();
var config        = requireServices.config();
var serviceConfig = requireServices.serviceConfig();
var compareProp = requireServices.compareResults();

//End Points
var url = requireServices.url();
var serviceEndPoint = requireServices.servicesEndPoint();
var serviceTypes = requireServices.serviceTypes();

var serviceEndPointPost = serviceEndPoint + serviceConfig.postFilter;
var roomEndPoint = serviceEndPoint;

var serviceType  = serviceConfig.service.type;
var serviceEndPointFilter = requireServices.service_Types().replace('{:serviceType}',serviceType);
//this var helps to concat an End point to get an specific room
var rooms = endPoints.rooms;
//Global Variables
var token = null; 
var idService = 0;
var idRoom = null;
var servicefromDB = null;
var roomsfromDB = null;
var respService = null;
var ObjectId = require('mongodb').ObjectID;
//variables with Json Archives 
var serviceIdJson = serviceConfig.serviceId;
var servicejson = serviceConfig.service;
var roomDisplayJson = serviceConfig.roomDisplayJson;
var roomJson = serviceConfig.roomJson;
var adminJson = config.exchangeAccount;
var roomProperties = serviceConfig.PropertiesRoom;
var serviceProperties = serviceConfig.PropertiesService;
var existService = '';
//status for response 200
var ok = config.httpStatus.Ok;

describe('CRUD Tesinting for Services Room Manager',function()
{
	this.timeout(config.timeOut);
	before(function(done)
	{
		process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
		tokenAPI
			.getToken(function(err,res)
			{
				
				token = res.body.token;
				done();
			});
	});
	after(function(done)
	{
		token=null;
		done();
	});
	it('GET /serviceType CRUD testing, verify request fields for servicetype ',function(done)
	{
		roomManagerAPI
			.get(serviceTypes,function(err,res)
			{
				expect(res.status).to.equal(ok);
				expect(res.body[0]).to.have.property(serviceProperties.version);
				expect(res.body[0].version).to.equal(serviceProperties.zero);
				expect(res.body[0]).to.have.property(serviceProperties.name);
				expect(res.body[0].name).to.equal(serviceProperties.exchange);
				expect(res.body[0]).to.have.property(serviceProperties.support);
				expect(res.body[0].support[0]).to.equal(serviceProperties.Exchange);
				done();
				

			});		
	});
	it('GET /services CRUD testing, verify request fields for Service',function(done)
	{
		mongodb
			.findDocument('services',servicejson,function(res)
			{
				servicefromDB = res;
				roomManagerAPI
					.getwithToken(token,serviceEndPoint,function(err,res)
					{
						var resp=res.body[0];
						expect(res.status).to.equal(ok);
						expect(resp).to.have.property(serviceProperties.type);
						expect(resp.type).to.equal(servicefromDB.type);
						expect(resp).to.have.property(serviceProperties.name);
						expect(resp.name).to.equal(servicefromDB.name);
						expect(resp).to.have.property(serviceProperties.version);
						expect(resp.version).to.equal(servicefromDB.version);
						expect(resp).to.have.property(serviceProperties._id);
						expect(resp._id).to.equal(servicefromDB._id.toString());
						expect(resp).to.have.property(serviceProperties.impersonate);
						expect(resp.impersonate).to.equal(servicefromDB.impersonate);
						done();
					});
			});
	});
	describe('CRUD testing for service/serviceID',function()
	{
		
		before(function(done)
		{
			roomManagerAPI
				.getwithToken(token,serviceEndPoint,function(err,resp)
				{
					respService = resp;
					idService = resp.body[0]._id;
					roomEndPoint = roomEndPoint +'/'+ idService;
					done();
				});
		});
		it('GET /service/serviceID, CRUD testing for an specific service',function(done)
		{			
			serviceIdJson._id=ObjectId(idService);
			mongodb
				.findDocument('services',serviceIdJson, function(res)
				{	
					servicefromDB = res;
					expect(respService.status).to.equal(ok);
					var respServiceBody = respService.body[0];
					expect(respServiceBody).to.have.property(serviceProperties.type);
					expect(respServiceBody.type).to.equal(servicefromDB.type);
					expect(respServiceBody).to.have.property(serviceProperties.name);
					expect(respServiceBody.name).to.equal(servicefromDB.name);
					expect(respServiceBody).to.have.property(serviceProperties.version);
					expect(respServiceBody.version).to.equal(servicefromDB.version);
					expect(respServiceBody).to.have.property(serviceProperties._id);
					expect(respServiceBody._id).to.equal(servicefromDB._id.toString());
					expect(respServiceBody).to.have.property(serviceProperties.impersonate);
					expect(respServiceBody.impersonate).to.equal(servicefromDB.impersonate);
					done();
	
				});
		});
		it('GET /services/serviceId/rooms, CRUD testing for Email Server Rooms',function(done)
		{			
			var roomEndPointrooms = roomEndPoint+ rooms;
			mongodb
				.findDocuments('rooms',function(res)
				{
					roomsfromDB = res;
					roomManagerAPI
					.get(roomEndPointrooms,function(err,res)
					{
						expect(res.status).to.equal(ok);
						var responseRooms= res.body;
						expect(responseRooms.length).to.equal(roomsfromDB.length);
						expect(responseRooms[0]).to.have.property(roomProperties.emailAddress);
						expect(responseRooms[0]).to.have.property(roomProperties.displayName);
						expect(responseRooms[0]).to.have.property(roomProperties.serviceId);
						expect(responseRooms[0]).to.have.property(roomProperties._id);
						expect(responseRooms[0]).to.have.property(roomProperties.enabled);
						expect(responseRooms[0]).to.have.property(roomProperties.locationId);
						expect(responseRooms[0]).to.have.property(roomProperties.customDisplayName);
						done();
					});
				});
		});
		it('Get /service/serviceID/rooms/roomId, CRUD testing for an specific room',function(done)
		{

			mongodb
			.findDocument('rooms',roomDisplayJson,function(res)
			{
				roomsfromDB = res;
				var roomEndPointroomid = roomEndPoint+ rooms +'/'+roomsfromDB._id;
				roomManagerAPI
					.get(roomEndPointroomid,function(err,res)
					{
						expect(res.status).to.equal(ok);
						var responseRoom=res.body;
						expect(responseRoom).to.have.property(roomProperties.emailAddress);
						expect(responseRoom.emailAddress).to.equal(roomsfromDB.emailAddress);
						expect(responseRoom).to.have.property(roomProperties.displayName);
						expect(responseRoom.displayName).to.equal(roomsfromDB.displayName);
						expect(responseRoom).to.have.property(roomProperties.serviceId);
						expect(responseRoom.serviceId).to.equal(roomsfromDB.serviceId.toString());
						expect(responseRoom).to.have.property(roomProperties._id);
						expect(responseRoom._id).to.equal(roomsfromDB._id.toString());
						expect(responseRoom).to.have.property(roomProperties.enabled);
						expect(responseRoom.enabled).to.equal(roomsfromDB.enabled);
						expect(responseRoom).to.have.property(roomProperties.locationId);
						expect(responseRoom.locationId).to.equal(roomsfromDB.locationId);
						done();
					});
			});	
		});
		/*This test case is to review*/
		it('PUT /service/serviceID/roomId/rooms, CRUD testing verify the room is modified with metho put',function(done)
		{
			mongodb
				.findDocument('rooms',roomDisplayJson,function(res)
				{
					roomsfromDB = res;
					var roomEndPointroomId = roomEndPoint+ rooms +'/'+roomsfromDB._id;
					roomManagerAPI
						.put(token,roomEndPointroomId,roomJson,function(err,res)
						{
							expect(res.status).to.equal(ok);
							var responseRoom = res.body;
							expect(responseRoom).to.have.property(roomProperties.emailAddress);
							expect(responseRoom.emailAddress).to.equal(roomsfromDB.emailAddress);
							expect(responseRoom).to.have.property(roomProperties.displayName);
							expect(responseRoom.displayName).to.equal(roomsfromDB.displayName);
							expect(responseRoom).to.have.property(roomProperties.serviceId);
							expect(responseRoom.serviceId).to.equal(roomsfromDB.serviceId.toString());
							expect(responseRoom).to.have.property(roomProperties._id);
							expect(responseRoom._id).to.equal(roomsfromDB._id.toString());
							expect(responseRoom).to.have.property(roomProperties.enabled);
							expect(responseRoom.enabled).to.equal(roomsfromDB.enabled);
							expect(responseRoom).to.have.property(roomProperties.locationId);
							expect(responseRoom.locationId).to.equal(roomsfromDB.locationId);
							//test for the properties that were modified
							expect(responseRoom).to.have.property(roomProperties.customDisplayName);
							expect(responseRoom.customDisplayName).to.equal(roomJson.customDisplayName);
							expect(responseRoom).to.have.property(roomProperties.enabled);
							expect(responseRoom.enabled).to.equal(false);
							done();
						});
				});
		});
	});
	describe('Test for DELETE Method CRUD testing',function()
	{
		before(function(done)
		{
			roomManagerAPI
				.getwithToken(token,serviceEndPoint,function(err,res)
				{
					if(res.body.length == 0)
					{
						//serviceEndPointPost=serviceEndPoint+serviceConfig.postFilter;
						roomManagerAPI
							.post(token,serviceEndPointFilter,adminJson,function(err,resp)
							{
								idService=resp.body._id;
								done();
							});
					}
					else
						{
							existService = true;
							idService=res.body[0]._id;
							done();
						}
				});
		});
		after(function(done)
		{
			if(existService){
				roomManagerAPI
					.post(token,serviceEndPointFilter,adminJson,function(err,resp)
					{
						done();
					});
			}
			else {
				done()};
		});
		it('DELETE /services, CRUD testing for DELETE Method',function(done)
		{			
			roomManagerAPI
				.del(token,serviceEndPoint+'/'+idService,function(err,res)
				{
					serviceIdJson._id = ObjectId(idService);
					mongodb
						.findDocument('services',serviceIdJson,function(resp)
						{
							expect(res.status).to.equal(ok);
							
							done();
						});
				});
		});
	});
	describe('Test for Post Method CRUD',function()
	{
		var exitSer = null;
		var resp = '';
		before(function(done)
		{
			roomManagerAPI
				.getwithToken(token,serviceEndPoint,function(err,res)
				{
					var resp = res.body;
					if(resp.length > 0)
					{
						idService = resp[0]._id;
						roomManagerAPI
							.del(token,serviceEndPoint+'/'+idService,function(err,res)
							{
								done();
							});
					}
					else
						{
							done();
						}
				});
		});
		it('POST /services, CRUD testing for Post Method',function(done)
		{
			roomManagerAPI
				.post(token,serviceEndPointFilter,adminJson,function(err,resp)
				{
					idService = resp.body._id;
					var PostService = resp;
					serviceIdJson._id=ObjectId(idService);
					mongodb
						.findDocument('services',serviceIdJson, function(res)
						{
						expect(resp.status).to.equal(ok);
						done();
					});
				});
		});
	});
});