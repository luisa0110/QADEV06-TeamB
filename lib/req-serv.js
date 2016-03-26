
var pathServices = require(GLOBAL.initialDirectory+'/config/path-services.json');
var config       = require(GLOBAL.initialDirectory+'/config/config.json');

var tokenAPI       = require(GLOBAL.initialDirectory+pathServices.tokenAPI);
var roomManagerAPI = require(GLOBAL.initialDirectory+pathServices.roomManagerAPI);

var util           = require(GLOBAL.initialDirectory+pathServices.util); //common function

var mongodb        = require(GLOBAL.initialDirectory+pathServices.mongodb);
////

var endPoints      = require(GLOBAL.initialDirectory+config.path.endPoints);
var resourceConfig = require(GLOBAL.initialDirectory+config.path.resourceConfig);
var roomResource   = require(GLOBAL.initialDirectory+config.path.roomResource);
///
var url            = config.url;
var servicesEndPoint = url + endPoints.services;
var roomsEndPoint    = url + endPoints.rooms;
var resourceEndPoint = url + endPoints.resources;


exports.tokenAPI = tokenAPI;
exports.roomManagerAPI = roomManagerAPI;
exports.util = util;
exports.mongodb = mongodb;

exports.endPoints = endPoints;
exports.resourceConfig = resourceConfig;
exports.roomResource = roomResource;

exports.url              = url;
exports.servicesEndPoint = servicesEndPoint;
exports.roomsEndPoint    = roomsEndPoint;
exports.resourceEndPoint = resourceEndPoint;