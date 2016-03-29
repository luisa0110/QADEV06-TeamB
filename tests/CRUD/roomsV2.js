/*
room.js
CRUD test
author: Andres Uzeda
*/
//libs
var init = require('../../init');
//var init = require('../init');
var expect = require('chai').expect;
var RequireServices = require(GLOBAL.initialDirectory+'/lib/req-serv.js').RequireServices;
var requireServices = new RequireServices();
var config =require(GLOBAL.initialDirectory+'/config/config.json');
var roomJson = require(GLOBAL.initialDirectory+'/config/room.json');
//services
var tokenAPI = requireServices.tokenAPI();
var roomManagerAPI = requireServices.roomManagerAPI();
var mongodb = requireServices.mongodb();
var endPoints	=	requireServices.endPoint();
var resourceConfig = requireServices.resourceConfig();
var util = requireServices.util();
//variables
var token=null;
var room=null;
var resource=null;
var json=null;
var resourceAsoc=null;
var endPoint=null;
var endPoint2=null;
/*TESTS*/
describe('CRUD Testing for Room routes', function() {
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
				json=roomJson.roomQueries.displayName;
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
 * TODO
 */
	it('Get /rooms , <TODO>',function(done){
		roomManagerAPI.
			get(endPoint,function(err,res){
				mongodb.findDocuments('rooms',function(doc){
				rooms=doc;
				expect(err).to.be.null;
				expect(res.status).to.equal(config.httpStatus.Ok);
				expect(res.body.length).to.equal(rooms.length);
				done();
				});
			});
	});	
/**
 * TODO
 */
	it('Get /rooms/{roomId}, <TODO> ',function(done){	
		endPoint=endPoint+'/'+room._id;
		roomManagerAPI.
			get(endPoint,function(err,res){
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

/**
 *TODO
 */
	it('PUT /rooms/{roomId}, <TODO>',function(done){	
		json.customDisplayName='ChangedByAPI';
		roomManagerAPI.
			put(token,endPoint,json,function(err,res){
				json=roomJson.roomQueries.displayName;
				mongodb.findDocument('rooms',json,function(doc){
					expect(res.body).to.have.property("customDisplayName")
					.and.be.equal(doc.customDisplayName);
					done();
				});
			});	
	});
});