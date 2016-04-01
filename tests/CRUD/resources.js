//CRUD TC resource
/*Modified by Maria Eloisa Alcocer Villarroel*/
var init          = require('../../init.js');
var expect        = require('chai').expect;
var should 		  = require('chai').should();
var RequireServices = require(GLOBAL.initialDirectory+'/lib/req-serv.js').RequireServices;
var requireServices = new RequireServices();
var config        = requireServices.config();

var resourceConfig = requireServices.resourceConfig();
var tokenAPI = requireServices.tokenAPI();
var roomManagerAPI = requireServices.roomManagerAPI();
var endPoints = requireServices.endPoint();
var util = requireServices.util();
var compareProp = requireServices.compareResults();


//endPoints
var resourceEndPoint = requireServices.resourceEndPoint();

// global variables
var token = null; 

describe('Resource CRUD Suite get by id and put', function () {
	this.timeout(config.timeOut);
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
	var resourceId = null;
	var resourceJson = null;
	
	before(function (done) {
		tokenAPI
			.getToken(function(err, res){
				token = res.body.token;
				done();
			});
	});

	
	describe('Set of test cases that need to create a eliminate a resource', function(){
		beforeEach(function (done) {
			//create a resource
			resourceJson = util.getRandomResourcesJson(resourceConfig.resourceNameSize);
			roomManagerAPI
				.post(token,resourceEndPoint,resourceJson,function(err, res){
					resourceId = res.body._id;
					done();
				});
		});
		afterEach(function (done) {
			//delete the resource
			if(resourceId != null)
			{
				roomManagerAPI
					.del(token, resourceEndPoint + '/' + resourceId, function(err, res){
						resourceId = null;
						resourceJson = null;
						done();
					});
			}else{
				console.log('the resourceID is null (after)');
			}
		});
			
		it('GET /resources/{resourceId} api returns the resources specified', function (done) {
			var verifyProp = null;
			var verifyVal = null;
			roomManagerAPI
				.get(resourceEndPoint + '/' + resourceId, function(err, res){
					should.not.exist(err);
					expect(res.body._id).not.equal(null);
					verifyProp = compareProp.verifyProperties('resourcemodels', res.body);
					expect(true).to.equal(verifyProp);
					compareProp.verifyValues('resourcemodels', resourceId, res.body, function(flag){
						expect(flag).to.equal(true);
						done();
					});
				});
		});

		it('PUT /resources/{resourceId} api returns the resource modified', function (done) {
			var resourceJsonToUpdate = util.getRandomResourcesJson(resourceConfig.resourceNameSize);
			var verifyProp = null;
			var verifyVal = null;
			roomManagerAPI
				.put(token,resourceEndPoint + '/' + resourceId, resourceJsonToUpdate, function(err, res){
					should.not.exist(err);
					expect(res.body._id).not.equal(null);
					verifyProp = compareProp.verifyProperties('resourcemodels', res.body);
					expect(true).to.equal(verifyProp);
					compareProp.verifyValues('resourcemodels', resourceId,res.body, function(flag){
						expect(flag).to.equal(true);
						done();
					});
				});

		});
	});
	describe('Resource CRUD Suite delete', function () {
		this.timeout(config.timeOut);
		process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
		var resourceId = null;
		var resourceJson = null;

		beforeEach(function (done) {
			//create a resource
			resourceJson = util.getRandomResourcesJson(resourceConfig.resourceNameSize);
			roomManagerAPI
				.post(token, resourceEndPoint,resourceJson, function(err, res){
					resourceId = res.body._id;
					done();
				});
		});

		it('CRUD-Delete /resources/{:id} api returns all the resources', function (done) {
			roomManagerAPI
					.del(token,resourceEndPoint + '/' + resourceId,function(err, res){
						should.not.exist(err);
						expect(res.body._id).not.equal(null);
						verifyProp = compareProp.verifyProperties('resourcemodels', res.body);
						expect(verifyProp).to.equal(true);
						compareProp.verifyValues('resourcemodels', resourceId, res.body, function(flag){
							expect(flag).to.equal(false);
							done();
						});
					});
		});
		it('Delete /resources', function (done){
				roomManagerAPI
					.delWithParam(token, resourceEndPoint, resourceId, function(err, res){
						
						
						should.not.exist(err);
						expect(res.body._id).not.equal(null);
						verifyProp = compareProp.verifyProperties('resourcemodels', res.body[0].value);
						expect(verifyProp).to.equal(true);
						compareProp.verifyValues('resourcemodels', resourceId, res.body[0].value, function(flag){
							expect(flag).to.equal(false);
							done();
						});
					});
			});
	});

	describe('Post a resource', function () {
		var resourceId = null;
		var verifyProp = null;
		afterEach(function (done) {
			roomManagerAPI
				.del(token,resourceEndPoint + '/' + resourceId, function(err, res){
					done();
				});
		});

		it('POST /resources api returns a created resource', function (done) {
			resourceJson = util.getRandomResourcesJson(resourceConfig.resourceNameSize);
			roomManagerAPI
				.post(token, resourceEndPoint, resourceJson,function(err, res){
					resourceId = res.body._id;
					should.not.exist(err);
					expect(res.body._id).not.equal(null);
					verifyProp = compareProp.verifyProperties('resourcemodels', res.body);
					expect(verifyProp).to.equal(true);
					compareProp.verifyValues('resourcemodels', resourceId, res.body, function(flag){
						expect(flag).to.equal(true);
						done();
					});
				});
		});
	});
	
	describe('Resources for get all resources', function () {
		this.timeout(config.timeOut);
		var resourceJson = null;
		var quantityOfResources = 2;
		var resourcesCreated = [];
		var resourcesDB = [];
		
		beforeEach(function (done) {
			//create a resource
			
			for (var i = 0; i < quantityOfResources; i++) {
				resourceJson = util.getRandomResourcesJson(resourceConfig.resourceNameSize);
				roomManagerAPI
					.post(token, resourceEndPoint, resourceJson,function(err, res){
						resourcesCreated.push(res.body);
					});
			};
			compareProp.getDataBase('resourcemodels', function(items){
				resourcesDB = items;
				done();
			});
		});
		
		afterEach(function (done) {
			var resourceId = '';
			for (var i = 0; i < resourcesCreated.length; i++) {
				resourceId = resourcesCreated[i]._id;
				roomManagerAPI
					.del(token, resourceEndPoint + '/' + resourceId, function(err, res){
						
					});
				
			};	
			done();			
		});

		it('CRUD-GET /resources api returns all the resources', function(done) {
			var count= 0;
			roomManagerAPI
				.get(resourceEndPoint,function(err, res){
					should.not.exist(err);
					expect(res.body.length).to.equal(resourcesDB.length);
					resourcesDB.forEach(function(el){
						resourceId = el._id;
						expect(el._id).not.equal(null);
						verifyProp = compareProp.verifyProperties('resourcemodels', el);
						expect(verifyProp).to.equal(true);
						compareProp.verifyValues('resourcemodels', resourceId, el, function(flag){
							expect(flag).to.equal(true);
							
						});
					});
					done();	
				});
			
		});
	});
});




