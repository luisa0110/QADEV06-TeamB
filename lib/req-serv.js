



var pathServices = require(GLOBAL.initialDirectory+'/config/path-services.json');
var config       = require(GLOBAL.initialDirectory+'/config/config.json');

//services
var tokenAPI       = require(GLOBAL.initialDirectory+pathServices.tokenAPI);
var roomManagerAPI = require(GLOBAL.initialDirectory+pathServices.roomManagerAPI);
var util           = require(GLOBAL.initialDirectory+pathServices.util); //common function
var mongodb        = require(GLOBAL.initialDirectory+pathServices.mongodb);



//paths
var endPoints      = require(GLOBAL.initialDirectory+config.path.endPoints);
var resourceConfig = require(GLOBAL.initialDirectory+config.path.resourceConfig);
var roomResource   = require(GLOBAL.initialDirectory+config.path.roomResource);
var publicKey = require(GLOBAL.initialDirectory+config.path.publicKey);

var url               = config.url;



//endpoints

var servicesEndPoint  = url + endPoints.services;
var roomsEndPoint     = url + endPoints.rooms;
var resourceEndPoint  = url + endPoints.resources;
var servicesTypes     = url + endPoints.serviceTypes;
var publicKeyEndPoint = url + endPoints.publicKey;




exports.tokenAPI = tokenAPI;
exports.roomManagerAPI = roomManagerAPI;
exports.util = util;
exports.mongodb = mongodb;

exports.endPoints = endPoints;
exports.resourceConfig = resourceConfig;
exports.roomResource = roomResource;
exports.publicKey = publicKey;


exports.url              = url;


exports.servicesEndPoint = servicesEndPoint;
exports.roomsEndPoint    = roomsEndPoint;
exports.resourceEndPoint = resourceEndPoint;
exports.servicesTypes = servicesTypes;
exports.publicKeyEndPoint = publicKeyEndPoint;
