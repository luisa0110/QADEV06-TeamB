//RoomManagerAPI.js
var config = require(GLOBAL.initialDirectory+'/config/config.json');
var request = require('superagent');
var authorization = config.tokenHeader;
var tokenPrefix = config.tokenPrefix;
var basicPrefix = config.tokenBasicPrefix;
var log4js = require('log4js');
log4js.configure('./config/log4js.json');
var logger = log4js.getLogger("RoomManager");

var get = function(endPoint,callback)
{
	request
		.get(endPoint)
	.end(function(err,res){
		if(err)
			logger.error('Error getting from RoomManagerAPI: '+ err + ' ' + endPoint)
		else
			logger.info('getting success! from ' + endPoint);
		callback(err,res);
	});
};

var post = function (token,endPoint,json,callback)
{
	request
		.post(endPoint)
		.set(authorization,tokenPrefix+token)
		.send(json)
	.end(function(err,res){
		if(err)
			logger.error('Error posting from RoomManagerAPI: '+ err + ' ' + endPoint)
		else
			logger.info('posting success! from ' + endPoint);
		callback(err,res);
	});
};


var put = function (token,endPoint,json,callback)
{
	request
		.put(endPoint)
		.set(authorization,tokenPrefix+token)
		.send(json)
	.end(function(err,res){
		if(err)
			logger.error('Error putting from RoomManagerAPI: ' + err + ' ' + endPoint)
		else
			logger.info('putting success! from ' + endPoint);
		callback(err,res);
	});
};

var del = function (token,endPoint,callback)
{
	request
		.del(endPoint)
		.set(authorization,tokenPrefix+token)
	.end(function(err,res){
		if(err)
			logger.error('Error deleting from RoomManagerAPI: '+ err + ' ' + endPoint)
		else
			logger.info('deleting success! from '+ endPoint);
		callback(err,res);
	});
};

var delWithParam = function(token, endPoint, resourceId, callback){
	
	request
		.del(endPoint)
		.set(authorization,tokenPrefix + token)
		.send({"id": [resourceId]})
	.end(function(err, res){
		if(err)
			logger.error('Error deleting from RoomManagerAPI: '+ err + ' ' + endPoint)
		else
			logger.info('deleting success! from '+ endPoint);
		
		callback(err, res);
	});
};

var getwithToken = function(token, endPoint, callback){
	request
		.get(endPoint)
		.set(authorization, tokenPrefix + token)
		.end(function(err, res){
			if(err)
			logger.error('Error getting from RoomManagerAPI: ' + err+' ' + endPoint)
			else{}
			callback(err, res);
		});
};

var postwithBasic = function(basic, endPoint, json, callback){

	request
		.post(endPoint)
		.set(authorization, basicPrefix + basic)
		.send(json)
	.end(function(err, res){
		
		if(err){
			logger.error('Error posting from RoomManagerAPI: ' + err +' ' + endPoint);
		}
		else{
			logger.info('posting success! from ' + endPoint);
		}
		callback(err, res);
	});
};

var delwithBasic = function (basic, endPoint, callback){
	request
		.del(endPoint)
		.set(authorization, basicPrefix + basic)
	.end(function(err, res){
		if(err)
			logger.error('Error deleting from RoomManagerAPI: ' + err+' ' + endPoint)
		else
			logger.info('deleting success! from ' + endPoint);
		callback(err, res);
	});
};

var putwithBasic = function (basic, endPoint, json, callback)
{
	request
		.put(endPoint)
		.set(authorization, basicPrefix + basic)
		.send(json)
	.end(function(err, res){
		if(err)
			logger.error('Error putting from RoomManagerAPI: '+ err+' ' + endPoint)
		else
			logger.info('putting success! from '+ endPoint);
		callback(err, res);
	});
};


exports.get = get;
exports.post = post;
exports.put = put;
exports.del = del;
exports.delWithParam = delWithParam;
exports.getwithToken = getwithToken;
exports.postwithBasic = postwithBasic;
exports.delwithBasic = delwithBasic;
exports.putwithBasic = putwithBasic;
