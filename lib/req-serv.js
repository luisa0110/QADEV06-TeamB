
    var RequireServices = function () {
    	 this.config = require(GLOBAL.initialDirectory+'/config/config.json');
         this.pathServices = require(GLOBAL.initialDirectory+'/config/path-services.json');
    };
    
    RequireServices.prototype.endPoint = function() {
    	return require(GLOBAL.initialDirectory + this.config.path.endPoints);
    };
    RequireServices.prototype.roomManagerAPI = function(first_argument) {
       return require(GLOBAL.initialDirectory+this.pathServices.roomManagerAPI);   		
    };
    RequireServices.prototype.config = function() {
       return require(GLOBAL.initialDirectory+'/config/config.json');		
    };
    
    RequireServices.prototype.publicKey = function() {
    	return require(GLOBAL.initialDirectory + this.config.path.publicKey);    	
    };
    RequireServices.prototype.publicKeyEndPoint = function() {
    	
       return this.url() + this.endPoint().publicKey;  
    };
    RequireServices.prototype.tokenAPI = function() {
    	return require(GLOBAL.initialDirectory + this.pathServices.tokenAPI);
    };
    RequireServices.prototype.util = function() {
    	return require(GLOBAL.initialDirectory + this.pathServices.util); //common function
    };
    RequireServices.prototype.mongodb = function() {
    	return require(GLOBAL.initialDirectory + this.pathServices.mongodb);
    };
    RequireServices.prototype.resourceConfig = function() {
    	return require(GLOBAL.initialDirectory + this.config.path.resourceConfig);
    };
    RequireServices.prototype.roomResource = function() {
    	return require(GLOBAL.initialDirectory + this.config.path.roomResource);
    };
    RequireServices.prototype.publicKey = function() {
    	return require(GLOBAL.initialDirectory + this.config.path.publicKey);
    };
    RequireServices.prototype.url = function() {
    	return this.config.url;
    };
    RequireServices.prototype.servicesEndPoint = function() {
    	return this.url() + this.endPoint().services;
    };
    RequireServices.prototype.serviceTypes = function() {
    	return  this.url() + this.endPoint().serviceTypes;
    };
    RequireServices.prototype.publicKeyEndPoint = function() {
    	return this.url() + this.endPoint().publicKey;
    };
    RequireServices.prototype.roomsEndPoint = function() {
    	return  this.url() + this.endPoint().rooms;
    };
    RequireServices.prototype.resourceEndPoint = function() {
    	return this.url() + this.endPoint().resources;
    };
    
    exports.RequireServices = RequireServices;


