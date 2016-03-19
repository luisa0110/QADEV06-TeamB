//CRUD TC Resources
//Ivan Morales Camacho
var init = require('../../init');
var expect = require('chai').expect;
var config = require(GLOBAL.initialDirectory+'/config/config.json');
var tokenAPI = require(GLOBAL.initialDirectory+config.path.tokenAPI);
var roomManagerAPI = require(GLOBAL.initialDirectory+config.path.roomManagerAPI);
var util=require(GLOBAL.initialDirectory+config.path.util);
var getEndPoint=require(GLOBAL.initialDirectory+config.path.endPoints);
var mongodb= require(GLOBAL.initialDirectory+config.path.mongodb);
var ObjectId = require('mongodb').ObjectID;
var outOfOrderConfig = require(GLOBAL.initialDirectory+config.path.outOfOrder);
var roomJson = require(GLOBAL.initialDirectory+config.path.room);
/* End Points*/  
var RoomEndPoint=config.url+getEndPoint.room;     	
var outOfOrderbyIDEndPoint=config.url+getEndPoint.getOutOfOrder;
var outOfOrderbyServiceEndPoint=config.url+getEndPoint.getOutOfOrderbyService;
var outOfOrderId=config.url+getEndPoint.outOfOrderId;
var timeout=config.timeOut;

var endPointOutOfOrder= null;
var room = null;
var token=null;

describe('CRUD test about out of order', function () {
    this.timeout(timeout);
	/**
	 * Pre condition to execute the set Test Cases.
	 * Obtain a token to an user account setting in the config.json file,
	 * Get the token of room manager
	 */

	before('Before get the token of room manager',function (done) {
			process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
			tokenAPI
				.getToken(function(err,res){
					token = res.body.token;
					done();
				});
	});
		 /**
		 * @description: Pre condition to execute the set Test Cases.
		 *return an endpoint by roomId and serviceId of a room out of order with the roomId
		 * @res: res an endpoint with the roomId
		 */	 
	before('return the Id of the room',function (done) {
		outOfOrderConfig.RoomId
		mongodb.findDocument('rooms',roomJson.roomQueries.customDisplayName,function(res){
			room = res;
			endPoint1= util.stringReplace(outOfOrderbyIDEndPoint,config.nameId.serviceId,res.serviceId)
			endPointOutOfOrder= util.stringReplace(endPoint1,config.nameId.roomId,res._id)
			done();
		});
	});


	describe(' create out of order and deleted', function () {
		    var endPoint= null;
		    /**
			 * @description: Pre condition to execute the set Test Cases.
			 * create an out of order in a room spesific by ID
			 */	  
			beforeEach('before create the out of order',function(done) {
				roomManagerAPI
					.post(token,endPointOutOfOrder,util.generateOutOforderJson(room._id,util.getDate(0),util.getDate(1)),function(err,res){
						done();
					});	
			});	

		    /**
			 * @description: Pre condition to execute the set Test Cases.
			 *return an endpoint of serviceId, roomId and out-of-orderId of a room out of order with the roomId
			 * @res: an endpoint with the roomId
			 */	  
			beforeEach('Before get an endpoint with the roomId',function(done) {

				roomManagerAPI.get(endPointOutOfOrder,function(err,res){
					outOrderId= res.body[0]._id;
					endPoint1= util.stringReplace(outOfOrderbyServiceEndPoint,config.nameId.serviceId,room.serviceId)
					endPoint2= util.stringReplace(endPoint1,config.nameId.roomId,room._id)	
					endPoint= util.stringReplace(endPoint2,config.nameId.outOfOrderId,outOrderId)	
					done();		
				});			
			});
		    
			/**
			 * @description: Pre condition to execute the set Test Cases.
			 * delete an out of order in a room spesific by ID
			 */	  	
			afterEach('after delete the out of order',function(done) {
				roomManagerAPI
					.del(token,endPoint,function(err,res){
						done();
					});	
			});

			it('GET//services/{:serviceId}/rooms/{:roomId}/out-of-orders', function(done) {
					
					outOfOrderConfig.RoomId.roomId=room._id
						mongodb.
							findDocument('outoforders',outOfOrderConfig.RoomId,function(res){
							servicefromDB=res;
							roomManagerAPI
								.get(endPointOutOfOrder,function(err,res){
									expect(res.status).to.equal(config.httpStatus.Ok);
									expect(res.body).to.not.be.null;
									expect(res.body[0]).to.have.property('_id');
									expect(res.body[0]._id).to.equal(servicefromDB._id.toString());
									expect(res.body[0]).to.have.property('roomId');
									expect(res.body[0].roomId).to.equal(servicefromDB.roomId.toString());
									expect(res.body[0]).to.have.property('from');
									expect((new Date(res.body[0].from)).toGMTString()).to.equal((new Date(servicefromDB.from)).toGMTString());
									expect(res.body[0]).to.have.property('to');
									expect((new Date(res.body[0].to)).toGMTString()).to.equal((new Date(servicefromDB.to)).toGMTString());
									expect(res.body[0]).to.have.property('title');
									expect(res.body[0].title).to.equal(servicefromDB.title);
									done();
								});	
							});						
			});			

			it('GET/out-of-orders', function(done){
					outOfOrderConfig.serviceId.serviceId=room.serviceId
					mongodb.
						findDocument('rooms',outOfOrderConfig.serviceId,function(res){
						servicefromDB=res;
						roomManagerAPI
							.get(RoomEndPoint,function(err,res){
								expect(res.status).to.equal(config.httpStatus.Ok);
								expect(res.body).to.not.be.null;
								expect(res.body[0]).to.have.property('_id');
								expect(res.body[0]._id).to.equal(servicefromDB._id.toString());
								expect(res.body[0]).to.have.property('emailAddress');
								expect(res.body[0]).to.have.property('displayName');
								expect(res.body[0]).to.have.property('serviceId');
								expect(res.body[0]).to.have.property('customDisplayName');
								done();
							});	
						});
			});

		describe(' test with use out-of-orderId for rooms out of orders', function () {
		    var endPointorderId= null
		    /**
			 * @description: Pre condition to execute the set Test Cases.
			 * @res: return an endpoint of out-of-orderId of a room out of order 
			 */	
			beforeEach('Before get an endpoint of out-of-orderId of a room',function (done) {

				roomManagerAPI.get(endPointOutOfOrder,function(err,res){
					outOrderId= res.body[0]._id;
					endPointorderId=util.stringReplace(outOfOrderId,config.nameId.outOfOrderId,outOrderId);		
					done();		
				
				});
			});

			it('GET/{:out-of-orderId}', function(done){
				roomManagerAPI
					.get(endPointorderId,function(err,res){
					outOfOrderConfig.RoomId.roomId=ObjectId(res.body.roomId);
					result = res;
					mongodb.
						findDocument('outoforders',outOfOrderConfig.RoomId,function(res){
							expect(result.status).to.equal(config.httpStatus.Ok);
							expect(result.body).to.not.be.null;
							expect(result.body).to.have.property('_id');
							expect(result.body._id).to.equal(res._id.toString());
							expect(result.body).to.have.property('roomId');
							expect(result.body.roomId).to.equal(res.roomId.toString());
							expect(result.body).to.have.property('from');
							expect((new Date(result.body.from)).toGMTString()).to.equal((new Date(res.from)).toGMTString());
							expect(result.body).to.have.property('to');
							expect((new Date(result.body.to)).toGMTString()).to.equal((new Date(res.to)).toGMTString());
							expect(result.body).to.have.property('title');
							expect(result.body.title).to.equal(res.title);
							done();
						});	
					});	

			});

		});

		describe('set of tests with use roomId, serviceId and out-of-orderId for rooms out of orders', function () {


			it('GET//services/{:serviceId}/rooms/{:roomId}/out-of-orders/{:out-of-orderId}', function(done) {
				roomManagerAPI
					.get(endPoint,function(err,res){
					outOfOrderConfig.RoomId.roomId=ObjectId(res.body.roomId);
					result = res;
					mongodb.
						findDocument('outoforders',outOfOrderConfig.RoomId,function(res){
							expect(result.status).to.equal(config.httpStatus.Ok);
							expect(result.body).to.not.be.null;
							expect(result.body).to.have.property('_id');
							expect(result.body._id).to.equal(res._id.toString());
							expect(result.body).to.have.property('roomId');
							expect(result.body.roomId).to.equal(res.roomId.toString());
							expect(result.body).to.have.property('from');
							expect((new Date(result.body.from)).toGMTString()).to.equal((new Date(res.from)).toGMTString());
							expect(result.body).to.have.property('to');
							expect((new Date(result.body.to)).toGMTString()).to.equal((new Date(res.to)).toGMTString());
							expect(result.body).to.have.property('title');
							expect(result.body.title).to.equal(res.title);
							done();

						});	
					});	
			});
			it('PUT//services/{:serviceId}/rooms/{:roomId}/out-of-orders/{:out-of-orderId}', function(done) {

				roomManagerAPI
					.put(token,endPoint,util.generateOutOforderJson(room._id,util.getDate(2),util.getDate(3)),function(err,res){
					roomManagerAPI
							.get(endPoint,function(err,res){
								outOfOrderConfig.RoomId.roomId=ObjectId(res.body.roomId);
								result = res;
								mongodb.
									findDocument('outoforders',outOfOrderConfig.RoomId,function(res){
										expect(result.status).to.equal(config.httpStatus.Ok);
										expect(result.body).to.not.be.null;
										expect(result.body).to.have.property('_id');
										expect(result.body._id).to.equal(res._id.toString());
										expect(result.body).to.have.property('roomId');
										expect(result.body.roomId).to.equal(res.roomId.toString());
										expect(result.body).to.have.property('from');
										expect((new Date(result.body.from)).toGMTString()).to.equal((new Date(res.from)).toGMTString());
										expect(result.body).to.have.property('to');
										expect((new Date(result.body.to)).toGMTString()).to.equal((new Date(res.to)).toGMTString());
										expect(result.body).to.have.property('title');
										expect(result.body.title).to.equal(res.title);
										done();
								});		
							});	
					});	
			});
		});
	});

	describe('CRUD test of Post about out of order', function () {
		var endPoint= null;		    
		/**
		 * @description: Pre condition to execute the set Test Cases.
		 * delete an out of order in a room spesific by ID
		 */	  	
		after('after delete the out of order',function(done) {
			roomManagerAPI
				.del(token,endPoint,function(err,res){
					done();
				});	
		});				    
	    /**
		 * @description: Pre condition to execute the set Test Cases.
		 *return an endpoint of serviceId, roomId and out-of-orderId of a room out of order with the roomId
		 * @res: an endpoint with the roomId
		 */	 
		before('Before get  an endpoint with the roomId',function (done) {
			roomManagerAPI
				.post(token,endPointOutOfOrder,util.generateOutOforderJson(room._id,util.getDate(0),util.getDate(1)),function(err,res){
					roomManagerAPI.get(endPointOutOfOrder,function(err,res){
					outOrderId= res.body[0]._id;
					endPoint1= util.stringReplace(outOfOrderbyServiceEndPoint,config.nameId.serviceId,room.serviceId)
					endPoint2= util.stringReplace(endPoint1,config.nameId.roomId,room._id)	
					endPoint= util.stringReplace(endPoint2,config.nameId.outOfOrderId,outOrderId)	
					done();		
					});					
				});			
		});				


		it('POST//services/{:serviceId}/rooms/{:roomId}/out-of-orders', function(done) {
		roomManagerAPI
			.post(token,endPointOutOfOrder,util.generateOutOforderJson(room._id,util.getDate(0),util.getDate(1)),function(err,res){
			roomManagerAPI
					.get(endPoint,function(err,res){
						outOfOrderConfig.RoomId.roomId=ObjectId(res.body.roomId);
						result = res;
						mongodb.
							findDocument('outoforders',outOfOrderConfig.RoomId,function(res){					
								expect(result.status).to.equal(config.httpStatus.Ok);
								expect(result.body).to.not.be.null;
								expect(result.body).to.have.property('_id');
								expect(result.body._id).to.equal(res._id.toString());
								expect(result.body).to.have.property('roomId');
								expect(result.body.roomId).to.equal(res.roomId.toString());
								expect(result.body).to.have.property('from');
								expect((new Date(result.body.from)).toGMTString()).to.equal((new Date(res.from)).toGMTString());
								expect(result.body).to.have.property('to');
								expect((new Date(result.body.to)).toGMTString()).to.equal((new Date(res.to)).toGMTString());
								expect(result.body).to.have.property('title');
								expect(result.body.title).to.equal(res.title);
								done();
						});		
					});	
			});
		});

	});
	describe('CRUD test of delete about out of order', function () {
		var endPoint= null;
	    /**
		 * @description: Pre condition to execute the set Test Cases.
		 * create an out of order in a room spesific by ID
		 */	  
		before('before create the out of order',function(done) {
			roomManagerAPI
				.post(token,endPointOutOfOrder,util.generateOutOforderJson(room._id,util.getDate(0),util.getDate(1)),function(err,res){
					done();
				});	
		});	
	    /**
		 * @description: Pre condition to execute the set Test Cases.
		 *return an endpoint of serviceId, roomId and out-of-orderId of a room out of order with the roomId
		 * @res: an endpoint with the roomId
		 */	 
		before('Before get  an endpoint with the roomId',function (done) {
			roomManagerAPI.get(endPointOutOfOrder,function(err,res){
				outOrderId= res.body[0]._id;
				endPoint1= util.stringReplace(outOfOrderbyServiceEndPoint,config.nameId.serviceId,room.serviceId)
				endPoint2= util.stringReplace(endPoint1,config.nameId.roomId,room._id)	
				endPoint= util.stringReplace(endPoint2,config.nameId.outOfOrderId,outOrderId)	
				done();		
			});			
		});	
		it('DELETE//services/{:serviceId}/rooms/{:roomId}/out-of-orders', function(done) {
		roomManagerAPI
			.del(token,endPoint,function(err,res){
				deleted=res;
			roomManagerAPI
					.get(endPoint,function(err,res){
						outOfOrderConfig.RoomId.roomId=ObjectId(res.body.roomId);
						result = res;
						mongodb.
							findDocument('outoforders',outOfOrderConfig.RoomId,function(res){
								expect(deleted.status).to.equal(config.httpStatus.Ok);
								expect(deleted.body).to.not.be.null;
								expect(deleted.body).to.have.property('_id');
								expect(deleted.body).to.have.property('roomId');
								expect(deleted.body).to.have.property('from');
								expect(deleted.body).to.have.property('to');
								expect(deleted.body).to.have.property('title');
						
								expect(deleted.status).to.equal(config.httpStatus.Ok);
								expect(result.body.code).to.equal(outOfOrderConfig.deleteOutOfOrder.delete);
								expect(res).to.not.exist;
								done();
						});		
					});	
			});
		});
	});
});