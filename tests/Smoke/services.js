//Services
//Author : Joaquin Gonzales Mosquera
var init          = require('../../init.js');


var expect        = require('chai').expect;

var RequireServices = require(GLOBAL.initialDirectory+'/lib/req-serv.js').RequireServices;
var requireServices = new RequireServices();

var config        = requireServices.config();
var serviceConfig = require(GLOBAL.initialDirectory+config.path.serviceConfig);

var tokenAPI = requireServices.tokenAPI();
var roomManagerAPI = requireServices.roomManagerAPI();
var mongodb = requireServices.mongodb();
//endpoints
var endPoints = requireServices.endPoint();

var util = requireServices.util();
//user account
var userJSon = config.userAccountJson;
var adminJson = config.exchangeAccount;
var roomJson = serviceConfig.roomJson;
var mongojs = serviceConfig.roomDisplayJson;
//End Points
var url = requireServices.url();
var serviceEndPoint = requireServices.servicesEndPoint();
var serviceEndPointFilter = serviceEndPoint + serviceConfig.postFilter;;
var serviceTypes = requireServices.serviceTypes();
//var service?Types = url+endPoints.service?Types;//TODO   
// global variables
var existService = false;
var token = null; 
var idService = null;
var idRoom = null;
var roomEndPoint = serviceEndPoint;
var rooms = endPoints.rooms;
//status for response 200
var ok = config.httpStatus.Ok;

describe('Smoke test for RoomManager ROOT', function(){
	this.timeout(config.timeOut);
	before(function (done) {
		process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
		//getting the token
		tokenAPI
			.getToken(function(err,res){
				token = res.body.token;
				done();
			});
	});
	after('After to create tests',function(done)
	{
		token = null;
		done();
	});
	
	describe('GET methods', function(){
		before(function(done){
		roomManagerAPI
				.getwithToken(token,serviceEndPoint,function(err,res)
				{
					if(res.body.length <= 0)
					{
						roomManagerAPI
							.post(token,serviceEndPointFilter,adminJson,function(err,resp){
								idService=res.body._id;
								existService = false;
							done();
							});
					}
					else{
						existService = true;
						idService=res.body._id;
						done();
					} 
			});
		});
		after(function(done){
			roomManagerAPI
				.getwithToken(token,serviceEndPoint,function(err,res)
				{
					idService = res.body;
					if(idService.length > 0 && existService === false)
					{
						roomManagerAPI
							.del(token,serviceEndPoint+'/'+idService[0]._id,function(err,res)
							{
								done();
							});
					}
					 else {
						 existService = false;
						 done();
					 } 
					 
				});
		});
		it('GET /servicesType SmokeTest, Verify the status 200',function(done)
		{
			roomManagerAPI
				.get(serviceTypes,function(err,res)
				{
					expect(res.status).to.equal(ok);
					done();
				});
		});

		it('Get /services SmokeTest, Verify the status 200',function(done)
		{
			roomManagerAPI
				.getwithToken(token, serviceEndPoint, function(err,res)
				{
					expect(res.status).to.equal(ok);
					done();
				});				
		});
		
		it('GET ?type=exchange SmokeTest, Verify the status 200', function(done){
			roomManagerAPI
				.getwithToken(token, serviceEndPointFilter, function(err, res){
					expect(res.status).to.equal(ok);
					done();
				});
		});
		
		describe('GET /services/serviceID',function()
		{		
			beforeEach(function(done)
			{
				roomManagerAPI
					.getwithToken(token, serviceEndPoint, function(err,resp){
					idService = resp.body[0]._id;
					roomEndPoint=roomEndPoint + '/' + idService + '/'+rooms;
					mongodb
						.findDocument('rooms',mongojs,function(res)
						{
							idRoom = res._id;
							done();
						});
				});
			});
			afterEach(function(done)
			{
				roomEndPoint = serviceEndPoint;
				done();
			});
			it('GET /services/ServiceID Smoke test, Verify the status 200 (GET method) by serviceID',function(done)
			{
				roomManagerAPI
					.get(serviceEndPoint + '/' + idService, function(err,res)
					{
						expect(res.status).to.equal(ok);
						done();
					});
			});
			it('GET /services/serviceID/rooms smoke test, verify the status 200 after to require rooms',function(done)
			{
				roomManagerAPI
					.get(roomEndPoint,function(err,res)
					{
						expect(res.status).to.equal(ok);
						done();
					});
			});
			it('GET /services/serviceID/rooms/roomID Smoke test, verify that the server returns the romm with IdRoom',function(done)
			{
				roomManagerAPI
					.get(roomEndPoint+'/'+idRoom,function(err,res)
					{
						expect(res.status).to.equal(ok);
						done();
					});	
			});
			it('PUT /services/serviceID/rooms/roomID Smoke test, verify that it is possible modify a room with method PUT',function(done)
			{
				roomManagerAPI
					.put(token,roomEndPoint+'/'+idRoom,roomJson,function(err,res)
					{
						expect(res.status).to.equal(ok);
						done();
					});
			});
		});
	});
	

	describe('DEL /service/serviceID',function()
	{
		before(function(done)
		{
			roomManagerAPI
				.getwithToken(token,serviceEndPoint,function(err,res)
				{
					if(res.body.length <= 0){
						roomManagerAPI
							.post(token,serviceEndPointFilter, adminJson, function(err,res)
							{
								idService = res.body._id;
								existService = false;
								done();
							});
					}
					else {
						existService = true;
						idService = res.body[0]._id;
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
		it('DELETE /services Smoke Test, Verify the status 200 after to delete a service',function(done)
		{
			roomManagerAPI
				.del(token, serviceEndPoint + '/' + idService, function(err, resp)
				{
					expect(resp.status).to.equal(ok);
					
					done();
				});
		});
	});
	describe('Method Post Service',function()
	{
		before(function(done)
		{
			roomManagerAPI
				.getwithToken(token,serviceEndPoint,function(err,res)
				{
					if(res.body.length > 0)
					{
						idService = res.body[0]._id;
						roomManagerAPI
							.del(token,serviceEndPoint+'/' + idService,function(err,res)
							{
								done();
							});
						existService = true;
					}
					else done();
			});
		});
		after(function(done)
		{
			roomManagerAPI
				.del(token,serviceEndPoint+'/'+idService,function(err,res)
				{
					if(existService){
					roomManagerAPI
						.post(token,serviceEndPointFilter,adminJson,function(err,resp)
						{
							done();
						});
					}
					else done();
				});
				
				
		});
		it('POST /services Smoke Test, Verify the status 200 after to add a new service',function(done)
		{
			roomManagerAPI
				.post(token,serviceEndPointFilter,adminJson,function(err,resp)
				{
					idService = resp.body._id;
					expect(resp.status).to.equal(ok);
					done();
				});
		});
	});
});
