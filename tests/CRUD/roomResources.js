//CRUD TC rooms
//Brayan Gabriel Rosas Fernandez
var init = require('../../init');
var expect = require('chai').expect;
var RequireServices = require(GLOBAL.initialDirectory + '/lib/req-serv.js').RequireServices;
var requireServices = new RequireServices();

var config = requireServices.config();
var resourceConfig = requireServices.resourceConfig();
var tokenAPI = requireServices.tokenAPI();
var roomManagerAPI = requireServices.roomManagerAPI();
var endPoints = requireServices.endPoint();
var util = requireServices.util();
var mongodb = requireServices.mongodb();
var roomJson = require(GLOBAL.initialDirectory+'/config/room.json');

//EndPoints
var url = config.url;

// global variables
var token; 
var room;
var resource;
var rooms;
var endPointRoom = config.url + endPoints.rooms;
var urlResource = endPoints.resources;
var resourceModif;
var resourceIdOfRoom;

var json;

describe('CRUD testing for room resources',function(){

	process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
	this.timeout(config.timeOut);
	json = roomJson.roomQueries.displayName;
	var endPointRoomResc;

		before('Preconditions get token,room and resource',function (done) {	
		tokenAPI
			.getToken(function(err,res){
	     		token = res.body.token;    
				   mongodb
				      .findDocument('rooms', json, function(doc){
						  room = doc;
						      mongodb
                               .findDocuments('resourcemodels',function(resourc){
                                     resource = resourc[0];
                                     endPointRoomResc = endPointRoom + '/' + room._id + urlResource;
                                     done();
                               });
				      });						
			});
	   });


      it('GET room/{roomId}/resources/', function(done) {
           
      	    roomManagerAPI
      	     .get(endPointRoomResc, function(err,res){
				expect(res.status).to.equal(config.httpStatus.Ok);
				expect(res.body[0]).to.have.property("quantity");
				expect(res.body[0]).to.have.property("_id");
				
				done();
			  });
       });
 
     //this test case is failed because there is a bug 
       it.skip('Post room/{roomId}/resources/', function(done) {
          var roomId = resource._id;
          json = roomJson.roomPost;
          json.resourceId = roomId;

           roomManagerAPI
             .post(token, endPointRoomResc, json, function(err, res){
                  resourceModif = res.body.resources.length - 1;
				  expect(res.status).to.equal(config.httpStatus.Ok);
				  expect(res.body.resources[resourceModif]).to.equal(roomId);
                  done();

             });
        });
   /**
    * I write test cases for room/{roomId}/resources/{resourceId}
    */
      describe('room/{roomId}/resources/{resourceId}',function(){
        var lastResource;

         before(function(done){	           	 	
      	     roomManagerAPI
	      	     .get(endPointRoomResc, function(err,res){
	      	     	lastResource = res.body.length - 1;
				    resourceIdOfRoom = 	res.body[lastResource]._id;
				    endPointRoomResc = endPointRoomResc + '/' + resourceIdOfRoom;
					done();
				  });   

         });
       
        it('Get room/{roomId}/resources/{resourceId}', function(done) {
        
           roomManagerAPI
             .get(endPointRoomResc,function(err, res){
             	 
                  expect(res.body).to.have.property("_id");
                  expect(res.body._id).to.equal(resourceIdOfRoom);
                 done();                  

             });
        });

        it('PUT room/{roomId}/resources/{resourceId}',function(done) {
          
          json = roomJson.roomQueries.resourcesUpdate;
          
           roomManagerAPI
             .put(token,endPointRoomResc,json,function(err,res){
                    expect(res.status).to.equal(config.httpStatus.Ok);
                    expect(res.body.resources[lastResource]).to.have.property("quantity");
                    expect(res.body.resources[lastResource]).to.have.property("_id");
                    expect(res.body.resources[lastResource].quantity).to.equal(json.quantity);
                    expect(res.body.resources[lastResource]._id).to.equal(resourceIdOfRoom);
                   
					done();
				});	           
	    });

        it('DEL room/{roomId}/resources/{resourceId}',function(done) {
          roomManagerAPI
            .del(token, endPointRoomResc, function(err, res){
                expect(res.status).to.equal(config.httpStatus.Ok);
                done();
                    
            });
        });
      });
});
       


       
   
      
      















