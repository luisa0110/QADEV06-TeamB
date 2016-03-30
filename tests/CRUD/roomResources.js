//CRUD TC rooms
//Brayan Gabriel Rosas Fernandez
var init = require('../../init');
var expect = require('chai').expect;
var RequireServices = require(GLOBAL.initialDirectory+'/lib/req-serv.js').RequireServices;
var requireServices = new RequireServices();

var config = requireServices.config();
var resourceConfig = requireServices.resourceConfig();
var tokenAPI = requireServices.tokenAPI();
var roomManagerAPI = requireServices.roomManagerAPI();
var endPoints = requireServices.endPoint();
var util = requireServices.util();
var roomJson = require(GLOBAL.initialDirectory+config.path.room);
var mongodb = requireServices.mongodb();

//EndPoints
var url = config.url;

// global variables
var token = null; 
var jsonByDefault = roomJson.roomQueries.roomPut;
var room = null;
var rooms = null;
var endPoint = config.url+endPoints.rooms;
var endPoint2 = config.url+endPoints.resources;
var jsonRoom = null;

describe('Resource CRUD Suite get by id and put', function () {
	this.timeout(config.timeOut);
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

	before('Preconditions , get token and obtain a roomId',function (done) {	
		tokenAPI
			.getToken(function(err,res){
				token = res.body.token;
				jsonRoom=roomJson.roomQueries.customDisplayName;
				mongodb.findDocument('rooms',jsonRoom,function(doc){
					 room=doc;
					done();
				});						
			});
	});

	after('Post conditions : restore the properties of the rooms changed ',function (done) {	
			roomManagerAPI.
				put(token,endPoint,jsonByDefault,function(err,res){
				done();
		});				
	});

	it('CRUD-GET /rooms/ api returns all rooms ', function (done) {
		endPoint=endPoint
			roomManagerAPI
			.get(endPoint,function(err,res){
					mongodb.findDocuments('rooms',function(doc){
					 rooms=doc;
					expect(err).to.be.null;
					expect(res.status).to.equal(config.httpStatus.Ok);
					expect(res.body.length).to.equal(rooms.length);
					done();
			});
		});	
	});

	it('CRUD-GET /rooms/{:roomId} api returns the room specified', function (done) {
			endPoint=endPoint+'/'+room._id;
				roomManagerAPI
				.get(endPoint,function(err,res){
				expect(err).to.be.null;
				expect(res.status).to.equal(config.httpStatus.Ok);
				expect(res.body).to.have.property("displayName")
					.and.be.equal(room.displayName);
				expect(res.body).to.have.property("customDisplayName")
					.and.be.equal(room.customDisplayName);
				expect(res.body).to.have.property("emailAddress")
					.and.be.equal(room.emailAddress);
				expect(res.body).to.have.property("enabled")
					.and.be.equal(room.enabled);
				expect(res.body).to.have.property("_id")
					.and.be.equal(room._id.toString());
					done();
			});	
	});

	it.skip('CRUD-PUT /rooms/{:roomId} api returns the rooms modified', function (done) {
		var jsonToModify=roomJson.roomQueries.roomPut;
		jsonToModify.emailAddress=util.generateString(12);
		jsonToModify.displayName=util.generateString(10);
		jsonToModify.enabled=false;
		jsonToModify.customDisplayName=util.generateString(10);
		jsonToModify.code=util.generateString(5);
		jsonToModify.__v=10;
		roomManagerAPI.
			put(token,endPoint,jsonToModify,function(err,res){
				console.log('Json on the put TC '+JSON.stringify(roomJson.roomQueries.roomPut));
				jsonRoom={"customDisplayName":res.customDisplayName};
				mongodb.findDocument('rooms',jsonRoom.customDisplayName,function(doc){	
					expect(err).to.be.null;
					expect(res.status).to.equal(config.httpStatus.Ok);
					expect(res.body).to.have.property("displayName")
					.and.be.equal(doc.displayName);
					expect(res.body).to.have.property("customDisplayName")
					.and.be.equal(doc.customDisplayName);
					expect(res.body).to.have.property("emailAddress")
					.and.be.equal(doc.emailAddress);
					expect(res.body).to.have.property("enabled")
					.and.be.equal(doc.enabled);
					expect(res.body).to.have.property("_id")
					.and.be.equal(doc._id.toString());
					expect(res.body).to.have.property("code")
					.and.be.equal(doc.code);
					expect(res.body).to.have.property("__v")
					.and.be.equal(doc.__v);
					done();
				});															
		   });			
	});
});




describe('Rooms associated to Resources', function(done) {

	before('Before Set',function (done) {
		tokenAPI
			.getToken(function(err,res){
				token = res.body.token;
				jsonRoom = roomJson.roomQueries.displayName;
				console.log(jsonRoom);
				console.log('...................');
				mongodb.findDocument('rooms',jsonRoom,function(doc){
					room = doc;
						jsonRoom = util.getRandomResourcesJson(resourceConfig.resourceNameSize);
						roomManagerAPI.post(token,endPoint2,jsonRoom,function(err,resourceRes){
							resource = resourceRes;
						 	endPoint = endPoint+'/'+room._id+'/resources';	
						 	jsonRoom = roomJson.resources.roomsAsoc;	
							jsonRoom.resourceId = resource.body._id;
								roomManagerAPI.post
									(token,endPoint,jsonRoom,function(err,resAsoc){
									resourceAsoc = resAsoc;
								console.log(doc);	
									done();
								});									
						});	
				});				
			});		
	});

	after('Before Set',function (done) {
		endPoint2=endPoint2+'/'+resource.body._id;
		roomManagerAPI
			.del(token,endPoint2,function(err,resourceDel){
				done();	
			});	
	});




	it.only('GET /rooms/{roomId}/resources ,CRUD Get a resources associated to room',function(done){	
		roomManagerAPI.get(endPoint,function(err,res){
			mongoJson = { "displayName" : "Floor1Room1"}
			mongodb.findDocument('rooms',mongoJson,function(doc){
				expect(err).to.be.null;
				expect(res.status).to.equal(config.httpStatus.Ok);
				expect(res.body[0]).to.have.property("_id")
				.and.be.equal(doc.resources[0]._id.toString());
				/*
				expect(res.body[0]).to.have.property("resourceId")
				.and.be.equal(doc.resources[0].resourceId.toString());
				expect(res.body[0]).to.have.property("quantity")
				.and.be.equal(doc.resources[0].quantity);*/
				//console.log(res.body[0]);
				done();	
			});	
		});			  				  			 						
	});	




	it.skip('POST /rooms/{roomId}/resources ,CRUD Associate a resources associated to room',function(done){	
			jsonToModify=roomJson.resources.roomsAsoc;
			roomManagerAPI.post(token,endPoint,jsonToModify,function(err,res){
				mongodb.findDocument('rooms',mongoJson,function(doc){	
				expect(err).to.be.null;
				expect(res.status).to.equal(config.httpStatus.Ok);
				expect(res.body[0]).to.have.property("_id")
				.and.be.equal(doc.resources[0]._id.toString());
				expect(res.body[0]).to.have.property("resourceId")
				.and.be.equal(doc.resources[0].resourceId.toString());
				expect(res.body[0]).to.have.property("quantity")
				.and.be.equal(doc.resources[0].quantity);
				done();	
			});	
		});			  				  			 						
	});	

	it.skip('GET /rooms/{:roomId}/resources/{:roomResourceId}, CRUD get a specified resource of specified room',function(done){													
		endPoint=endPoint+'/'+resourceAsoc.body.resources[0]._id;
			roomManagerAPI.get(endPoint,function(err,res){
			mongodb.findDocument('rooms',mongoJson,function(doc){
				expect(err).to.be.null;
				expect(res.status).to.equal(config.httpStatus.Ok);
				expect(res.body[0]).to.have.property("_id")
				.and.be.equal(doc.resources[0]._id.toString());
				expect(res.body[0]).to.have.property("resourceId")
				.and.be.equal(doc.resources[0].resourceId.toString());
				expect(res.body[0]).to.have.property("quantity")
				.and.be.equal(doc.resources[0].quantity);
				done();
			});
		});	
	});	

	it.skip('PUT /rooms/{:roomId}/resources/{:roomResourceId},CRUD modify a specified resource of specified room',function(done){		
		 jsonRoom=roomJson.roomQueries.resourcesUpdate;
		 roomManagerAPI.put(token,endPoint,jsonRoom,function(err,resp){
			mongodb.findDocument('rooms',mongoJson,function(doc){
				expect(err).to.be.null;
				expect(res.status).to.equal(config.httpStatus.Ok);
				expect(res.body[0]).to.have.property("_id")
				.and.be.equal(doc.resources[0]._id.toString());
				expect(res.body[0]).to.have.property("resourceId")
				.and.be.equal(doc.resources[0].resourceId.toString());
				expect(res.body[0]).to.have.property("quantity")
				.and.be.equal(doc.resources[0].quantity);
				done();
			});	
		});
	});	

	it.skip('DELETE /rooms/{:roomId}/resources/{:roomResourceId},CRUD Delete a resource associate to room ',function(done){	
		 roomManagerAPI.del(token,endPoint,function(err,resp){
		 	mongodb.findDocument('rooms',mongoJson,function(doc){
				expect(err).to.be.null;
				expect(res.status).to.equal(config.httpStatus.Ok);
				expect(res.body[0]).to.have.property("_id")
				.and.be.equal(doc.resources[0]._id.toString());
				expect(res.body[0]).to.have.property("resourceId")
				.and.be.equal(doc.resources[0].resourceId.toString());
				expect(res.body[0]).to.have.property("quantity")
				.and.be.equal(doc.resources[0].quantity);
				done();
			});	
		 });						
	});	
		
});

