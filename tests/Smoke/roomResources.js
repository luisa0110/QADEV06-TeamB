//roomResources
//smoke test from Miguel Angel Terceros Caballero

var init = require('../../init');
var config = require(GLOBAL.initialDirectory+'/config/config.json');
var expect = require('chai').expect;
var requireServices = require(GLOBAL.initialDirectory+'/lib/req-serv.js');


var tokenAPI = requireServices.tokenAPI;
var roomManagerAPI = requireServices.roomManagerAPI;
var endPoints = requireServices.endPoints;
var resourceConfig = requireServices.resourceConfig;
var roomResource = requireServices.roomResource;
var util = requireServices.util;
//End Points
var url = requireServices.url;
var servicesEndPoint = url + endPoints.services;
var roomsEndPoint = url + endPoints.rooms;
var RESOURCE_END_POINT = url + endPoints.resources;
var RESOURCES = endPoints.resources;
var ROOMS = endPoints.rooms;

// global variables
var token,idService,idRoom,idResourceCreate,
    resourceJSon,associateResource,
    idLastResource,endPointFinal;


describe('Smoke test for RoomManager',function()
{
	this.timeout(config.timeOut);
	before(function (done) {
		process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
		//getting the token
		tokenAPI
			.getToken(function(err,res){
				token = res.body.token;	
				//getting serviceID
				roomManagerAPI
					.getwithToken(token, servicesEndPoint, function(err, resp){
						idService = resp.body[0]._id;

						done();			
					});							
			});
	});

	after('After to create tests',function(done)
	{
		token = null;
		done();
	});

	beforeEach(function (done) {		
		//getting roomID
		roomManagerAPI
			.get(roomsEndPoint, function(err, res){
				idRoom = res.body[0]._id;//id room
				resourceJSon = util.getRandomResourcesJson(resourceConfig.resourceNameSize);
				//create a new resource
				roomManagerAPI
					.post(token, RESOURCE_END_POINT, resourceJSon, function(err,resp){
						idResourceCreate = resp.body._id;
						//json for associate resource to room
						associateResource = {
							"resourceId" : idResourceCreate,
							"quantity" : 1
						};
						//endpoint for associate an resource to room
						var associateEndPoint = url + '/rooms/'+idRoom+'/resources';
						//associate resource to room
						roomManagerAPI
							.post(token,associateEndPoint,associateResource, function(err, res){										
								var size = res.body.resources.length;										
								idLastResource = res.body.resources[size-1]._id;
								
								//console.log(res.body.resources[size-1]);
								//endPoint for execute actions over a room									
								endPointFinal = servicesEndPoint + '/' + idService + ROOMS + '/' + idRoom + RESOURCES + '/' + idLastResource;

								done();
							});						
					});
			});
			
	});

	afterEach(function (done) {
		//delete resource create
		roomManagerAPI
			.del(token,RESOURCE_END_POINT+'/'+idResourceCreate,function(err,res){
				done();
			});
	});

	it('GET /services/{:serviceId}/rooms/{:roomId}/resources/{:roomResourceId} returns 200',function (done){	
		//get the resource of a room specified
		roomManagerAPI
			.get(endPointFinal, function(err, re){							
				expect(re.status).to.equal(config.httpStatus.Ok);
				done();
			});			

	});

	it('PUT /services/{:serviceId}/rooms/{:roomId}/resources/{:roomResourceId} returns 200', function (done) {
		//variable for the modify an resource
		var quantityJON = roomResource.amount;

		//put the last resource
		roomManagerAPI
			.put(token,endPointFinal, quantityJON, function(err, re){						
				expect(re.status).to.equal(config.httpStatus.Ok);
				done();
			});										
	});
	
	it('DELETE /services/{:serviceId}/rooms/{:roomId}/resources/{:roomResourceId} returns 200', function (done) {
		//delete the last resource
		roomManagerAPI
			.del(token, endPointFinal, function(err, re){
				expect(re.status).to.equal(config.httpStatus.Ok);

				done();
			});				
	});
});