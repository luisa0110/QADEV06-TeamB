/**
 * Smoke test of location by: Jose Antonio Cardozo
 */
var init = require('../../init');
var config = require(GLOBAL.initialDirectory+'/config/config.json');
var expect = require('chai').expect;
var tokenAPI = require(GLOBAL.initialDirectory+config.path.tokenAPI);
var endPoints = require(GLOBAL.initialDirectory+config.path.endPoints);
var roomManagerAPI = require(GLOBAL.initialDirectory+config.path.roomManagerAPI);
var util = require(GLOBAL.initialDirectory+config.path.util);
var locationConfig = require(GLOBAL.initialDirectory+config.path.locationConfig);

//global variables
var token = null;
var endPoint = config.url + endPoints.locations;
var endPointById = config.url + endPoints.locationById;
var size = locationConfig.size;

describe('Smoke testing for Locations of room manager', function() {
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

	it('GET /locations', function(done) {
		roomManagerAPI
			.get(endPoint,function (err,res){
				expect(res.status).to.equal(config.httpStatus.Ok);
				done();
			});
	});

	describe('Test that need the DELETE the location at finished', function () {
		var locationID = null;
		afterEach(function (done) {
			var endPointLocationById = util.stringReplace(endPointById,locationConfig.locationIdReplace,locationID);
			roomManagerAPI
				.del(token,endPointLocationById,function (err,res) {
					done();
			});
		});

		it('POST /locations', function(done) {
		// create a locations with random string.
		var locationJson = util.generateLocationJson(size.nameSize,size.customNameSize,size.description);
		roomManagerAPI
			.post(token,endPoint,locationJson,function (err,res) {
				expect(res.status).to.equal(config.httpStatus.Ok);
				locationID = res.body._id;
				done();
			});
		});
	});

	describe('Test that needed location created', function () {
		var locationID = null; 
		var endPointLocationById = null;
		var locationJson  = null;
	
		beforeEach(function (done) {
			locationJson = util.generateLocationJson(size.nameSize,size.customNameSize,size.description);
			roomManagerAPI
				.post(token,endPoint,locationJson,function (err,res) {
					locationID = res.body._id;
					endPointLocationById = util.stringReplace(endPointById,locationConfig.locationIdReplace,locationID);
					done();
				});
		});
	
		afterEach(function (done) {
			roomManagerAPI
			  .del(token,endPointLocationById,function (err,res) {
			  	 	done();
			  });
		});

		it('GET /locations/{:locationId}', function(done) {
			roomManagerAPI
				.get(endPointLocationById,function (err,res) {
					expect(res.status).to.equal(config.httpStatus.Ok);
					done();
				});
		});

		it('PUT /locations/{:locationId}', function (done) {
			var locationJsonMod = util.generateLocationJson(size.nameSize,size.customNameSize,size.description);
			roomManagerAPI
				.put(token,endPointLocationById,locationJsonMod,function (err,res) {
					expect(res.status).to.equal(config.httpStatus.Ok);
					done()
				});
		});
	});
		
		describe('create a locations for delete ', function () {
			var endPointLocationById = null;
			before(function (done) {
				var locationJson = util.generateLocationJson(size.nameSize,size.customNameSize,size.description);
				roomManagerAPI
					.post(token,endPoint,locationJson,function (err,res) {
						var locationID = res.body._id;
						endPointLocationById = util.stringReplace(endPointById,locationConfig.locationIdReplace,locationID);
						done();
				});
			});

			it('DELETE /locations/{:locationId}', function (done) {
					roomManagerAPI
					  .del(token,endPointLocationById,function (err,res) {
					  		expect(res.status).to.equal(config.httpStatus.Ok);
					  		done();
					  });
			});
		});
});