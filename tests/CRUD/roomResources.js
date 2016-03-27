//CRUD of roomResources

var init            = require('../../init');
var config          = require(GLOBAL.initialDirectory+'/config/config.json');
var RequireServices = require(GLOBAL.initialDirectory+'/lib/req-serv.js').RequireServices;
var requireServices = new RequireServices();

var expect          = require('chai').expect;

//services
var tokenAPI       = requireServices.tokenAPI();
var roomManagerAPI = requireServices.roomManagerAPI();

var util           = requireServices.util();
var mongodb        = requireServices.mongodb();

//config
var endPoints      = requireServices.endPoint();


var resourceConfig = requireServices.resourceConfig();
var roomResource   = requireServices.roomResource();

//End Points
var url              = requireServices.url();
var servicesEndPoint = requireServices.servicesEndPoint();
var roomsEndPoint    = requireServices.roomsEndPoint();
var resourceEndPoint = requireServices.resourceEndPoint();


console.log(resourceEndPoint);

var resources = endPoints.resources;
var rooms     = endPoints.rooms;

// global variables
var room,token,idService,idRoom,
    idResourceCreate,resourceJSon,
    associateResource,idLastResource,
    endPointFinal,roomJSON,size;

describe('CRUD test for RoomResources',function()
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
								//json of the room selected
								roomName = res.body.customDisplayName;
								roomJSON = {"customDisplayName" : roomName};									
								size = res.body.resources.length;									
								idLastResource = res.body.resources[size-1]._id;
								//endPoint for execute actions over a room									
								endPointFinal = servicesEndPoint + '/' + idService + rooms + '/' + idRoom + resources + '/' + idLastResource;

								done();
							});						
					});
			});
	});

	afterEach(function (done) {
		//delete resource create
		roomManagerAPI
			.del(token, +'/'+idResourceCreate,function(err,res){
				done();
			});	
	});

	it('CRUD-GET /services/{:serviceId}/rooms/{:roomId}/resources/{:roomResourceId} api returns the resources specified of a room', function (done) {
		//get the resource of a room specified
		mongodb
			.findDocument('rooms',roomJSON,function(res){				
				roomManagerAPI
					.get(endPointFinal, function(err, re){
										
						expect(re.status).to.equal(config.httpStatus.Ok);
						resourcesResId = (res.resources[size-1]._id).toString();
						expect(resourcesResId).to.equal(re.body._id);						
						expect(re.body).to.have.property("_id");
						expect(re.body).to.have.property("@link");					

						done();
					});	
			});		
	});

	it('CRUD-PUT /services/{:serviceId}/rooms/{:roomId}/resources/{:roomResourceId} api update the resources specified of a room', function (done) {
		//variable for the modify an resource
		var quantityJON = roomResource.amount;
		//put the last resource
		roomManagerAPI
			.put(token,endPointFinal, quantityJON, function(err, resp){
				mongodb
					.findDocument('rooms', roomJSON, function(res){	
						expect(resp.status).to.equal(config.httpStatus.Ok);
						resourcesMongoId = (res.resources[size-1]._id).toString();
						resourcesAPIpId = (resp.body.resources[size-1]._id).toString();
						expect(resourcesMongoId).to.equal(resourcesAPIpId);
						expect(resp.body.resources[size-1]).to.have.property("_id");
						expect(res.resources[size-1].quantity).to.equal(resp.body.resources[size-1].quantity);				
						expect(resp.body.resources[size-1]).to.have.property("quantity");
						
						expect(res).to.have.property("_id");
						expect(res.emailAddress).to.equal(resp.body.emailAddress);
						expect(res).to.have.property("emailAddress");
						expect(res.displayName).to.equal(resp.body.displayName);
						expect(res).to.have.property("displayName");
						expect(res).to.have.property("serviceId");						
						expect(res).to.have.property("resources");
						expect(res.customDisplayName).to.equal(resp.body.customDisplayName);
						expect(res).to.have.property("customDisplayName");
						expect(res.enabled).to.equal(resp.body.enabled);
						expect(res).to.have.property("enabled");
						expect(res.locationId).to.equal(resp.body.locationId);
						expect(res).to.have.property("locationId");
						
						done();
					});				
			});
	});
  
    

	it('CRUD-DEL /services/{:serviceId}/rooms/{:roomId}/resources/{:roomResourceId} api deleted the resources specified of a room', function (done) {
		//delete the last resource
		roomManagerAPI
			.del(token, endPointFinal, function(err, re){
				mongodb
					.findDocument('rooms', roomJSON, function(res){								
						expect(re.status).to.equal(config.httpStatus.Ok);												
						expect(re.body.resources[size-1]).to.not.exist;

						expect(res).to.have.property("_id");
						expect(res.emailAddress).to.equal(re.body.emailAddress);
						expect(res).to.have.property("emailAddress");
						expect(res.displayName).to.equal(re.body.displayName);
						expect(res).to.have.property("displayName");
						expect(res).to.have.property("serviceId");
						expect(res).to.have.property("resources");
						expect(res.customDisplayName).to.equal(re.body.customDisplayName);
						expect(res).to.have.property("customDisplayName");
						expect(res.enabled).to.equal(re.body.enabled);
						expect(res).to.have.property("enabled");
						expect(res.locationId).to.equal(re.body.locationId);
						expect(res).to.have.property("locationId");
						
						done();
					});	
			});
	});
});