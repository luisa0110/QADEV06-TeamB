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
var roomJson = require(GLOBAL.initialDirectory + config.path.room);
var mongodb = requireServices.mongodb();
//var roomJson = require(GLOBAL.initialDirectory+'/config/room.json');

//EndPoints
var url = config.url;

// global variables
var token; 
//var jsonByDefault = roomJson.roomQueries.roomPut;
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
           
      	    console.log(endPointRoomResc);
      	    roomManagerAPI
      	     .get(endPointRoomResc, function(err,res){
				expect(res.status).to.equal(config.httpStatus.Ok);
				expect(res.body[0]).to.have.property("quantity");
				expect(res.body[0]).to.have.property("resourceId");
				expect(res.body[0]).to.have.property("_id");
				console.log(res.body);
				
				done();
			  });
       });
 
     //this test case is failed because there is a bug 
       it('Post room/{roomId}/resources/', function(done) {
          var roomId = resource._id;

          var json = {
 						 "resourceId": roomId,
  						 "quantity": 10
				     };

           roomManagerAPI
             .post(token, endPointRoomResc, json, function(err, res){
                  resourceModif = res.body.resources.length - 1;
				  expect(res.status).to.equal(config.httpStatus.Ok);
				  expect(res.body.resources[resourceModif]).to.equal(roomId);
                  done();

             });
        });
       
      describe('room/{roomId}/resources/{resourceId}',function(){
        var lastResource;
         beforeEach(function(done){	           	 	
      	     roomManagerAPI
      	     .get(endPointRoomResc, function(err,res){
                console.log(res.body.length);
      	     	lastResource = res.body.length - 1;
			    resourceIdOfRoom = 	res.body[lastResource]._id;
			    console.log(resourceIdOfRoom);
				done();
			  });   

         });
        
        it('Get room/{roomId}/resources/{resourceId}', function(done) {
         endPointRoomResc = endPointRoomResc + '/' + resourceIdOfRoom;

           roomManagerAPI
             .get(endPointRoomResc,function(err, res){
             	
                  expect(res.body).to.have.property("quantity");
                  expect(res.body).to.have.property("resourceId");
                  expect(res.body).to.have.property("_id");
                  expect(res.body._id).to.equal(resourceIdOfRoom);
                 done();                  

             });
        });
    
        it('Del room/{roomId}/resources/{resourceId}',function(done) {
          
          roomManagerAPI
            .del(token, endPointRoomResc, function(err, res){
                expect(res.status).to.equal(config.httpStatus.Ok);
              
            });
        });
        
     

      

      });


});
       


       
   
      
      















