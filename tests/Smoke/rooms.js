var init = require('../../init');
var expect = require('chai').expect;
var tokenAPI=require(GLOBAL.initialDirectory+'/lib/tokenAPI');
var roomManagerAPI=require(GLOBAL.initialDirectory+'/lib/RoomManagerAPI');
var mongodb=require(GLOBAL.initialDirectory+'/lib/mongodb');
var config =require(GLOBAL.initialDirectory+'/config/config.json');
var endPoints=require(GLOBAL.initialDirectory+'/config/endPoints');
var resourceConfig = require(GLOBAL.initialDirectory+'/config/resource.json');
var roomJson = require(GLOBAL.initialDirectory+'/config/room.json');
var util=require(GLOBAL.initialDirectory+'/util/util');
var token=null;
var room=null;
var resource=null;
var json=null;
var resourceAsoc=null;
var endPoint=null;
var endPoint2=null;


describe('Smoke Testing for Room routes', function() {
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
	this.timeout(config.timeOut);

	/**
	 * Pre condition to execute the set Test Cases.
	 * @getToken(rollback)
	 * Obtain a token to an user account setting in the config.json file,
	 * Get a room of mongodb
	 */
	before('Preconditions',function (done) {	
		tokenAPI
			.getToken(function(err,res){
				token = res.body.token;
				endPoint=config.url+endPoints.rooms;
				json=roomJson.roomQueries.customDisplayName;
				mongodb.findDocument('rooms',json,function(doc){
					room=doc;
					done();
				});						
			});
	});

	after('Post conditions : restore the properties of the rooms changed ',function (done) {
		endPoint=config.url+endPoints.rooms+'/'+room._id;
			json.customDisplayName="Floor1Room1";
			roomManagerAPI.
				put(token,endPoint,json,function(err,res){
					done();
				});			
	});

/**
 * Smoke Test to the service room with the method get.
 * Test : Get all rooms and validate the status.
 */
	it('Get /rooms , Verify the status 200',function(done){
		roomManagerAPI.
			get(endPoint,function(err,res){
				expect(res.status).to.equal(config.httpStatus.Ok);
				done();
			});
	});	
/**
 * Smoke Test to the service room with the method get for getting a
 * specific room by roomId.
 */
	it('Get /rooms/{roomId}, Verify the status 200 ',function(done){	
		endPoint=endPoint+'/'+room._id;
		roomManagerAPI.
			get(endPoint,function(err,res){
				expect(res.status).to.equal(config.httpStatus.Ok);
				done();
			});
	});	

/**
 * Smoke Test to the service room with the method put for modify the
 * display name of the room 
 */
	it('PUT /rooms/{roomId}, Verify the status 200',function(done){	
		json.customDisplayName='ChangedByAPI';
		roomManagerAPI.
			put(token,endPoint,json,function(err,res){
				expect(res.status).to.equal(config.httpStatus.Ok);
				done();
			});	
	});
});

describe('Smoke Testing for Room Resources routes ', function() {
	this.timeout(config.timeOut);

	/**
	 * Pre condition to execute the set Test Cases.
	 * @getToken(rollback)
	 * Obtain a token to an user account setting in the config.json file,
	 * Get a room randomly and create a resource
	 */
	before('Before Set',function (done) {
		tokenAPI
			.getToken(function(err,res){
				token = res.body.token;
				endPoint=config.url+endPoints.rooms;
				mongodb.findDocument('rooms',json,function(doc){
						room=doc;
						endPoint2=config.url+endPoints.resources;
						json=util.getRandomResourcesJson(resourceConfig.resourceNameSize);
							roomManagerAPI.post(token,endPoint2,json,function(err,resourceRes){
								resource=resourceRes;
								 	endPoint=endPoint+'/'+room._id+'/resources';	
								 	json=roomJson.resources.roomsAsoc;	
									json.resourceId=resource.body._id;
										roomManagerAPI.post
											(token,endPoint,json,function(err,resAsoc){
											resourceAsoc=resAsoc;
											done();
									});									
							});	
					});				
			});		
	});

	after('Before Set',function (done) {
		endPoint=config.url+endPoints.resources+'/'+resource.body._id;
		roomManagerAPI
			.del(token,endPoint,function(err,resourceDel){
				done();	
			});	
	});

/**
 * Smoke Test to the service room with the method get for getting a resource for
 * a specific room .
 */
	it('GET /rooms/{roomId}/resources,Verify the status 200',function(done){	
			roomManagerAPI.get(endPoint,function(err,res){
				expect(res.status).to.equal(config.httpStatus.Ok);
				done();
			});			  				  			 						
	});	

/**
 * Smoke Test to the service room with the method POST 
 * for associates the room with an existent resource.
 */
	it('POST rooms/{:roomId}/resources, Verify the status 200',function(done){		
		expect(resourceAsoc.status).to.equal(config.httpStatus.Ok);
  		done();
	});

/**
 * Smoke Test to the service room with the method GET 
 * for getting a specific resources of a specific room.
 */
	it('GET /rooms/{:roomId}/resources/{:roomResourceId}, Verify the status 200',function(done){													
			endPoint=endPoint+'/'+resourceAsoc.body.resources[0]._id;
			roomManagerAPI.get(endPoint,function(err,res){
				expect(res.status).to.equal(config.httpStatus.Ok);	
				done();
			})
	});	

 /**
 * Smoke Test to the service room with the method PUT
 * for Updating a specific resource from a specific room
 */			
	it('PUT /rooms/{:roomId}/resources/{:roomResourceId}, Verify the status 200',function(done){		
			 json=roomJson.roomQueries.resourcesUpdate;
			roomManagerAPI.put(token,endPoint,json,function(err,resp){
				expect(resp.status).to.equal(config.httpStatus.Ok);	
				done();		
			});
	});	
	
 /**
 * Smoke Test to the service room with the method DEL
 * for Removing a specific resource from a specific room
 */	
	it('DELETE /rooms/{:roomId}/resources/{:roomResourceId}, Verify the status 200 ',function(done){	
		 roomManagerAPI.del(token,endPoint,function(err,resp){
		 	expect(resp.status).to.equal(config.httpStatus.Ok);	
			done();			
		 });						
	});	

});

