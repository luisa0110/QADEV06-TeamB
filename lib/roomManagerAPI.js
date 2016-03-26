//RoomManagerAPI.js
var config=require(GLOBAL.initialDirectory+'/config/config');
var request=require('superagent');
var authorization=config.tokenHeader;
var tokenPrefix=config.tokenPrefix;
var basicPrefix = config.tokenBasicPrefix;
var log4js = require('log4js');
log4js.configure('./config/log4js.json');
var logger = log4js.getLogger("RoomManager");

var get= function(endPoint,callback)
{
	request
		.get(endPoint)
	.end(function(err,res){
		if(err)
			logger.error('Error getting from RoomManagerAPI: '+err+ ' ' + endPoint)
		else
			logger.info('getting success! from ' + endPoint);
		callback(err,res);
	});
	
};
exports.get=get;
var post=function (token,endPoint,json,callback)
{
	request
		.post(endPoint)
		.set(authorization,tokenPrefix+token)
		.send(json)
	.end(function(err,res){
		if(err)
			logger.error('Error posting from RoomManagerAPI: '+err+ ' ' + endPoint)
		else
			logger.info('posting success! from ' + endPoint);
		callback(err,res);
	});
};
exports.post=post;

var put=function (token,endPoint,json,callback)
{
	request
		.put(endPoint)
		.set(authorization,tokenPrefix+token)
		.send(json)
	.end(function(err,res){
		if(err)
			logger.error('Error putting from RoomManagerAPI: '+err+ ' ' + endPoint)
		else
			logger.info('putting success! from '+ endPoint);
		callback(err,res);
	});
};
exports.put=put;
var del=function (token,endPoint,callback)
{
	request
		.del(endPoint)
		.set(authorization,tokenPrefix+token)
	.end(function(err,res){
		if(err)
			logger.error('Error deleting from RoomManagerAPI: '+err+ ' ' + endPoint)
		else
			logger.info('deleting success! from '+ endPoint);
		callback(err,res);
	});
};
exports.del=del;
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
exports.getwithToken = getwithToken;
var postwithBasic = function(basic, endPoint, json, callback){
	request
		.post(endPoint)
		.set(authorization, basicPrefix + basic)
		.send(json)
	.end(function(err, res){
		if(err)
			logger.error('Error posting from RoomManagerAPI: ' + err+' ' + endPoint)
		else
			logger.info('posting success! from ' + endPoint);
		callback(err, res);
	});
};
exports.postwithBasic = postwithBasic;
var delwithBasic=function (basic, endPoint, callback){
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
exports.delwithBasic = delwithBasic;
var putwithBasic=function (basic, endPoint, json, callback)
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
exports.putwithBasic = putwithBasic;
