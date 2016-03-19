//resourcesOfRoom.js
//CRUD test by Miguel Angel Terceros Caballero

var init = require('../../init');
var config = require(GLOBAL.initialDirectory+'/config/config.json');
var expect = require('chai').expect;
var tokenAPI = require(GLOBAL.initialDirectory+config.path.tokenAPI);
var roomManagerAPI = require(GLOBAL.initialDirectory+config.path.roomManagerAPI);
var endPoints = require(GLOBAL.initialDirectory+config.path.endPoints);
var resourceConfig = require(GLOBAL.initialDirectory+config.path.resourceConfig);
var roomResource = require(GLOBAL.initialDirectory+config.path.roomResource);
var util = require(GLOBAL.initialDirectory+config.path.util);
var mongodb = require(GLOBAL.initialDirectory+config.path.mongodb);
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
var size = null;
var associateEndPoint = null;

describe('CRUD test for RoomManager of room’s resources',function()
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
				//json of the room selected
				roomName = res.body[0].customDisplayName;
				roomJSON = {"customDisplayName" : roomName};
				//create a new resource
				roomManagerAPI
					.post(token, resourceEndPoint, resourceJSon, function(err,resp){
						idResourceCreate = resp.body._id;

						//json for associate resource to room
						associateResource = {							
							"resourceId" : idResourceCreate,
							"quantity" : 1							
						};
						//endpoint for associate an resource to room
						associateEndPoint = url + '/rooms/'+idRoom+'/resources';

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

	it('GET /services/{:serviceId}/rooms/{:roomId}/resources API Gets all the specified room’s resources ',function (done){	
		//endpoint for given all resources of a room
		var resourcesOfRoom = servicesEndPoint + '/' + idService + rooms + '/' + idRoom + resources;

		roomManagerAPI
			.post(token,associateEndPoint,associateResource, function(err, res){
				roomManagerAPI
					.get(resourcesOfRoom, function(err, resp){
						size = res.body.resources.length;
						resourcesAPIpId = (resp.body[size-1]._id).toString();	

						expect(resp.status).to.equal(config.httpStatus.Ok);
						expect(resourcesAPIpId).to.exist;
						expect(resp.body[size-1]).to.have.property("_id");

						mongodb
							.findDocument('rooms', roomJSON, function(re){
								expect(re).to.not.be.empty;
								expect(re.resources[size-1]).to.have.property("_id");

								done();
							});	
					});

			});			
	});

	it('POST /services/{:serviceId}/rooms/{:roomId}/resources API Associates the room with an existent resource', function (done) {
		//associate resource to room
		roomManagerAPI
			.post(token,associateEndPoint,associateResource, function(err, res){
				size = res.body.resources.length;

				expect(res.status).to.equal(config.httpStatus.Ok);
				resourcesAPIpId = (res.body.resources[size-1]._id).toString();				
				expect(resourcesAPIpId).to.exist;
				expect(res.body.resources[size-1]).to.have.property("_id");

				mongodb
					.findDocument('rooms', roomJSON, function(resp){

						expect(resp).to.have.property("_id");
						expect(resp.emailAddress).to.equal(res.body.emailAddress);
						expect(resp).to.have.property("emailAddress");
						expect(resp.displayName).to.equal(res.body.displayName);
						expect(resp).to.have.property("displayName");
						expect(resp).to.have.property("serviceId");						
						expect(resp).to.have.property("resources");
						expect(resp.customDisplayName).to.equal(res.body.customDisplayName);
						expect(resp).to.have.property("customDisplayName");
						expect(resp.enabled).to.equal(res.body.enabled);
						expect(resp).to.have.property("enabled");
						expect(resp.locationId).to.equal(res.body.locationId);
						expect(resp).to.have.property("locationId");

						done();
					});				
			});								
	});
});