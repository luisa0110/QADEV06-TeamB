/*
Scenario 4 – The same room should not be associated at two different locations

Given there is a main location 'Fundacion Jala' created

	And a 2 sub-locations  'Floor2' and 'Floor3' created

	And the sub-locations have a parent location 'Fundacion Jala'

When the room 'B4C3' is associated at the location 'Floor2' 
	and  the same room 'B4C3' is associated at the location 'Floor3'

		Then room 'B4C3' should not be associated at location 'Floor3'
*/

var init = require('../../init');
var config = require(GLOBAL.initialDirectory+'/config/config.json');
var expect = require('chai').expect;
var tokenAPI = require(GLOBAL.initialDirectory+config.path.tokenAPI);
var endPoints = require(GLOBAL.initialDirectory+config.path.endPoints);
var roomManagerAPI = require(GLOBAL.initialDirectory+config.path.roomManagerAPI);
var util = require(GLOBAL.initialDirectory+config.path.util);
var locationConfig = require(GLOBAL.initialDirectory+config.path.locationConfig);
var roomConfig = require(GLOBAL.initialDirectory+config.path.room);
var mongoDB = require(GLOBAL.initialDirectory+config.path.mongodb);
//global variables
var token = null;
var endPoint = config.url + endPoints.locations;
var endPointRoom=config.url+endPoints.room;
var endPointById = config.url + endPoints.locationById;
var size = locationConfig.size;
var parentLocation = null;
var subLocation1=null;
var subLocation2=null;
var parentId=null;
var locationJson=null;
var quantityOfLocation=0;
var allLocations=null;
var jsonRoom=null;
var room1=null;
var room2=null;


describe('Scenario 4 – The same room should not be associated at two different locations', function (done) {
		this.timeout(config.timeOut);
		process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
	context('Given there is a main location \'Fundacion Jala\' created',function(){

		before('Given there is a main location \'Fundacion Jala\' created',function (done) {		
		//getting the token
			tokenAPI
				.getToken(function(err,res){
					token = res.body.token;
					locationJson=locationConfig.locationJson;
					locationJson.name="FundacionJala";
					locationJson.customName="FundacionJala";
					locationJson.description="Main building";
					roomManagerAPI
						.post(token,endPoint,locationJson,function (err,res) {	
							parentLocation = res;
							done();				
					});
			});	
		});

		
		before(' And a 2 sub-locations  \'Floor2\' and \'Floor3\' created',function(done) {
			console.log('\t \t And a 2 sub-locations  \'Floor2\' and \'Floor3\' created');
			console.log('\t \tAnd the sub-locations have a parent location \'Fundacion Jala\'');
			//created a sub-location 'Floor2' and 'Floor1' based in the location's _id
			// of main location (parentId) 'FundacionJala'
			parentId=parentLocation.body._id;
			locationJson.parentId=parentId;
			locationJson.name='Floor2';
			locationJson.customName='Floor2';
			locationJson.description='Sub-Location of Main location';
			
			roomManagerAPI
						.post(token,endPoint,locationJson,function (err,res) {	
							locationJson.parentId=parentId;
							locationJson.name='Floor3';
							locationJson.customName='Floor3';
							locationJson.description='Sub-Location2 of Main location';
							subLocation1=res;
							roomManagerAPI
								.post(token,endPoint,locationJson,function(err,res){
									subLocation2=res;
									done();
								});
				});
		});

		
		before('Getting all locations created',function (done) {
			
			roomManagerAPI.get(endPoint,function(err,res){
				allLocations=res.body;
				done();
			});

		});

		before('And select two rooms',function(done) {

			console.log('\t \t And select two rooms in order to associate a Location');		
			jsonRoom=roomConfig.roomQueries.customDisplayName;
			mongoDB.findDocument('rooms',jsonRoom,function(room){
				jsonRoom.customDisplayName="Floor1Room2";
				room1=room;
				mongoDB.findDocument('rooms',jsonRoom,function(room){
					room2=room;
					done();
				});

			});
			
		});

		after('Delete all locations have been created',function (done) {

			var count = 0;
			for (var i = 0; i < allLocations.length; i++) {
				roomManagerAPI
					.del(token,endPoint+'/'+allLocations[i]._id,function(err,res){
						count++
						if(count==allLocations.length){
							done();
						};
					});
			};

		});

		describe('When the room \'Floor1Room1\' is associated at the location \'Floor2\' ', function () {

			describe('and  the same room \'Floor1Room2\' is associated at the location \'Floor2\'', function () {

				it('Then room \'Floor1Room2\' should not be associated at location \'Floor3\'', function (done) {

					endPointRoom=endPointRoom+'/'+room1._id;
					jsonRoomUpdate={"locationId":subLocation1.body._id};
					roomManagerAPI
								.put(token,endPointRoom,jsonRoomUpdate,function(err,res){
									endPointRoom=endPointRoom+'/'+room2._id;
									jsonRoomUpdate={"locationId":subLocation2.body._id};

									roomManagerAPI
										.put(token,endPointRoom,jsonRoomUpdate,function(err,resp){
											expect(resp.status).to.equal(404);
											done();
									});
					});

				});
			});
		});	

	});	
});
