/**
 * CRUD locations by: Jose Antonio Cardozo
 */
var init = require('../../init');
var config = require(GLOBAL.initialDirectory+'/config/config.json');
var expect = require('chai').expect;
var tokenAPI = require(GLOBAL.initialDirectory+config.path.tokenAPI);
var endPoints = require(GLOBAL.initialDirectory+config.path.endPoints);
var roomManagerAPI = require(GLOBAL.initialDirectory+config.path.roomManagerAPI);
var util = require(GLOBAL.initialDirectory+config.path.util);
var locationConfig = require(GLOBAL.initialDirectory+config.path.locationConfig);
var mongoDB = require(GLOBAL.initialDirectory+config.path.mongodb);

var ObjectId = require('mongodb').ObjectID;

//global variables
var token = null;
var endPoint = config.url + endPoints.locations;
var endPointById = config.url + endPoints.locationById;
var size = locationConfig.size;
var locationJsonId = locationConfig.locationIdForMongo;


describe('CRUD of RoomManager', function (){
	this.timeout(config.timeOut);
	//Before
	before(function (done) {
		process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
		//getting the token
		tokenAPI
			.getToken(function(err,res){
				token = res.body.token;
				done();
			});
	});
	
	it('CRUD of GET /locations', function(done) {
		roomManagerAPI
			.get(endPoint,function (err,res){
				var arrayLocation = res;
				expect(arrayLocation.status).to.equal(config.httpStatus.Ok);
				expect(arrayLocation.body).to.not.be.null;
				for (var i = 0; i < arrayLocation.length; i++) {
					expect(arrayLocation.body[i]).to.have.property('_id');
					expect(arrayLocation.body[i]).to.have.property('path');
					expect(arrayLocation.body[i]).to.have.property('name');
					expect(arrayLocation.body[i]).to.have.property('customName');
					expect(arrayLocation.body[i]).to.have.property('description');
					expect(arrayLocation.body[i]).to.have.property('__v');	
				};
				mongoDB.findDocuments('locations',function (res) {
						for (var i = 0; i < res.length; i++) {
							expect(arrayLocation.body[i]._id).to.equal(res[i]._id.toString());
							expect(arrayLocation.body[i].path).to.equal(res[i].path);
							expect(arrayLocation.body[i].name).to.equal(res[i].name);
							expect(arrayLocation.body[i].customName).to.equal(res[i].customName);
							expect(arrayLocation.body[i].description).to.equal(res[i].description);
							expect(arrayLocation.body[i].__v).to.equal(res[i].__v);
						};
						done();		
					});
			});
	});

	describe('CRUD Test that need the DELETE the location at finished', function () {
		var locationID = null;
		after(function (done) {
			var endPointLocationById = util.stringReplace(endPointById,locationConfig.locationIdReplace,locationID);
			roomManagerAPI
				.del(token,endPointLocationById,function (err,res) {
					done();
			});
		});

		it('CRUD of POST /locations', function(done) {
		var locationJson = util.generateLocationJson(size.nameSize,size.customNameSize,size.description);
		roomManagerAPI
			.post(token,endPoint,locationJson,function (err,res) {
				locationID = res.body._id;
				locationJsonId._id =  ObjectId(locationID);
				var locationCreated = res.body;
				
				expect(res.status).to.equal(config.httpStatus.Ok);
				expect(res.body).to.have.property('_id');
				expect(res.body).to.have.property('path');
				expect(res.body).to.have.property('name');
				expect(res.body).to.have.property('customName');
				expect(res.body).to.have.property('description');
				expect(res.body).to.have.property('__v');

				mongoDB
					.findDocument('locations',locationJsonId,function (res) {
						expect(locationCreated._id).to.equal(res._id.toString());
						expect(locationCreated.path).to.equal(res.path);
						expect(locationCreated.name).to.equal(res.name);
						expect(locationCreated.customName).to.equal(res.customName);
						expect(locationCreated.description).to.equal(res.description);
						done();
					});
			});
		});
	});
	
	describe('CRUD Test that needed location created', function () {

		var location = null; 
		var endPointLocationById = null;
		var locationJson  = null;
		beforeEach(function (done) {
			locationJson = util.generateLocationJson(size.nameSize,size.customNameSize,size.description);
			roomManagerAPI
				.post(token,endPoint,locationJson,function (err,res) {
					location = res.body;
					endPointLocationById = util.stringReplace(endPointById,locationConfig.locationIdReplace,location._id);
					done();
				});
		});
	
		afterEach(function (done) {
			roomManagerAPI
			  .del(token,endPointLocationById,function (err,res) {
			  	 	done();
			  });
		});

		it('CRUD GET /locations/locationId', function (done) {
			roomManagerAPI
				.get(endPointLocationById,function (err,res) {
					expect(res.status).to.equal(config.httpStatus.Ok);
					expect(res.body).to.have.property('_id');
					expect(res.body).to.have.property('path');
					expect(res.body).to.have.property('name');
					expect(res.body).to.have.property('customName');
					expect(res.body).to.have.property('description');
					expect(res.body).to.have.property('__v');
					locationJsonId._id =  ObjectId(res.body._id);
					var getLocation = res.body;

					mongoDB
						.findDocument('locations',locationJsonId,function (res) {
							expect(res).to.not.be.null;
							expect(res._id.toString()).to.equal(getLocation._id);
							expect(res.path).to.equal(getLocation.path);
							expect(res.name).to.equal(getLocation.name);
							expect(res.customName).to.equal(getLocation.customName);
							expect(res.description).to.equal(getLocation.description);
							expect(res.__v).to.equal(getLocation.__v);
							done();
						});
				});
		});

		it('CRUD PUT /locations/locationId', function (done) {
			// generated the changes that want modify in the location.
			var locationJsonMod = util.generateLocationJson(size.nameSize,size.customNameSize,size.description);
			roomManagerAPI
				.put(token,endPointLocationById,locationJsonMod,function (err,res) {
					expect(res.status).to.equal(config.httpStatus.Ok);
					expect(locationJsonMod.name).to.equal(res.body.name);
					expect(locationJsonMod.customName).to.equal(res.body.customName);
					expect(locationJsonMod.description).to.equal(res.body.description);
					expect(res.status).to.equal(config.httpStatus.Ok);
					expect(res.body).to.have.property('_id');
					expect(res.body).to.have.property('path');
					expect(res.body).to.have.property('name');
					expect(res.body).to.have.property('customName');
					expect(res.body).to.have.property('description');
					expect(res.body).to.have.property('__v');

					var locationModify = res.body;
					locationJsonId._id =  ObjectId(res.body._id);

					mongoDB
						.findDocument('locations',locationJsonId,function (res) {
							expect(res).to.not.be.null;
							expect(res._id.toString()).to.equal(locationModify._id);
							expect(res.path).to.equal(locationModify.path);
							expect(res.name).to.equal(locationModify.name);
							expect(res.customName).to.equal(locationModify.customName);
							expect(res.description).to.equal(locationModify.description);
							expect(res.__v).to.equal(locationModify.__v);
							done();
						});
				});
		});
	});

	describe('create a locations for delete ', function () {
		var endPointLocationById = null;
		
		var locationToDeleted = null;
		before(function (done) {
			var locationJson = util.generateLocationJson(size.nameSize,size.customNameSize,size.description);
			roomManagerAPI
				.post(token,endPoint,locationJson,function (err,res) {
					locationToDeleted = res.body;
					endPointLocationById = util.stringReplace(endPointById,locationConfig.locationIdReplace,locationToDeleted._id);
					done();
			});
		});

		it('CRUD DELETE /locations/{:locationId}', function (done) {
			roomManagerAPI
			  .del(token,endPointLocationById,function (err,res) {
			  		// this the location that was deleted
			  		var locationRemove = res.body;
			  		locationJsonId._id =  ObjectId(res.body._id);

			  		expect(res.status).to.equal(config.httpStatus.Ok);
			  		expect(locationRemove._id).to.equal(locationToDeleted._id);
			  		expect(locationRemove.name).to.equal(locationToDeleted.name);
			  		expect(locationRemove.customName).to.equal(locationToDeleted.customName);
			  		expect(locationRemove._v).to.equal(locationToDeleted._v);
			  		expect(locationRemove.description).to.equal(locationToDeleted.description);
			  		expect(locationRemove.path).to.equal(locationToDeleted.path);
			  		mongoDB
			  			.findDocument('locations',locationJsonId,function (res) {
			  				expect(res).to.not.exist;

			  			})
			  		done();
			  });
		});
	});

});


