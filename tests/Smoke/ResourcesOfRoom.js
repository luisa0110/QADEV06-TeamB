//roomResources2
//smoke test by Miguel Angel Terceros Caballero

var init = require('../../init');
var config = require(GLOBAL.initialDirectory+'/config/config.json');
var expect = require('chai').expect;
var tokenAPI = require(GLOBAL.initialDirectory+config.path.tokenAPI);
var roomManagerAPI = require(GLOBAL.initialDirectory+config.path.roomManagerAPI);
var endPoints = require(GLOBAL.initialDirectory+config.path.endPoints);
var resourceConfig = require(GLOBAL.initialDirectory+config.path.resourceConfig);
var roomResource = require(GLOBAL.initialDirectory+config.path.roomResource);
var util = require(GLOBAL.initialDirectory+config.path.util);
//End Points
var url = config.url;
var servicesEndPoint = url + endPoints.services;
var roomsEndPoint = url + endPoints.rooms;
var resourceEndPoint = url + endPoints.resources;
var resources = endPoints.resources;
var rooms = endPoints.rooms;
// global variables
var token = null; 
var idService=null;
var idRoom = null;
var idResourceCreate = null;
var resourceJSon = null;
var associateResource = null;

describe('Smoke test for RoomManager of room’s resources ',function()
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
					.post(token, resourceEndPoint, resourceJSon, function(err,resp){
						idResourceCreate = resp.body._id;
						done();
					});
			});
			
	});

	afterEach(function (done) {
		//delete resource create
		roomManagerAPI
			.del(token,resourceEndPoint+'/'+idResourceCreate,function(err,res){
				done();
			});
	});

	it('GET /services/{:serviceId}/rooms/{:roomId}/resources returns 200',function (done){	
		//endpoint for given all resources of a room
		var resourcesOfRoom = servicesEndPoint + '/' + idService + rooms + '/' + idRoom + resources;
		
		roomManagerAPI
			.get(resourcesOfRoom, function(err, res){								
				expect(res.status).to.equal(config.httpStatus.Ok);

				done();
			});						

	});

	it('POST /services/{:serviceId}/rooms/{:roomId}/resources returns 200', function (done) {
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
				expect(res.status).to.equal(config.httpStatus.Ok);

				done();
			});								
	});
});