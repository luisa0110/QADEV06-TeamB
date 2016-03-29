// util
var moment = require('moment');
var config = require(GLOBAL.initialDirectory+'/config/config.json');
var resourceConfig = require(GLOBAL.initialDirectory+config.path.resourceConfig);
var outOfOrderConfig = require(GLOBAL.initialDirectory+config.path.outOfOrder);
var locationCongig = require(GLOBAL.initialDirectory+config.path.locationConfig);
var meetingsConfig = require(GLOBAL.initialDirectory+config.path.meetingConfig);


var generateString = function(size){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < size; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};

exports.generateString = generateString;
/**this method return a Json with the field Name, Custom Name, From and description, with random values
 * @size  {number} the size of the random string for all fields
 * @return {Json}
 */
var getRandomResourcesJson = function(size){

    if(size == undefined)
        size = 12;
    var resourceJSon = resourceConfig.resourceJson;
        resourceJSon = JSON.stringify(resourceJSon)
        resourceJSon = stringReplace(resourceJSon,'resourceName',generateString(size));
        resourceJSon = stringReplace(resourceJSon,'resourceCustomName',generateString(size));
        resourceJSon = stringReplace(resourceJSon,'resourceFrom',generateString(size));
        resourceJSon = stringReplace(resourceJSon,'resourceDescription',generateString(size));

        resourceJSon = JSON.parse(resourceJSon);
        return resourceJSon;
};
exports.getRandomResourcesJson = getRandomResourcesJson;


var getResourcesJson = function(name,customName,from,description){

    var resourceJSon = resourceConfig.resourceJson;
        resourceJSon = JSON.stringify(resourceJSon)
        resourceJSon = stringReplace(resourceJSon,'resourceName',name);
        resourceJSon = stringReplace(resourceJSon,'resourceCustomName',customName);
        resourceJSon = stringReplace(resourceJSon,'resourceFrom',from);
        resourceJSon = stringReplace(resourceJSon,'resourceDescription',description);

        resourceJSon = JSON.parse(resourceJSon);
        return resourceJSon;
};
exports.getResourcesJson = getResourcesJson;

 
 /**
 * @description: This method get a Json with create an out of order in a room
 * @param: id, room's Id of the roommanager
 * @param: to,  date to start the out of order e.g. e.g 2015-10-23T16:00:00.000Z
 * @param: from , date to end the out of order e.g. e.g 2015-10-24T24:00:00.000Z
 * @param: title , the title of the out of order
 * @res: return a Json with the configations entered
 */
 var generateOutOforderJson = function (id,from,to){
        var outOfOrder;
		outOfOrderConfig.outOfOrderJson.roomId = id;
		outOfOrderConfig.outOfOrderJson.from = from;
		outOfOrderConfig.outOfOrderJson.to = to;
		outOfOrderConfig.outOfOrderJson.title = generateString(outOfOrderConfig.titleSize);
		outOfOrder = outOfOrderConfig.outOfOrderJson
		return 	outOfOrder;

};
exports.generateOutOforderJson = generateOutOforderJson;
 /**
 * @description: This method get to Current date with diferent hours e.g. 2015-10-23T16:00:00.000Z
 * @param:  num sum the number sending to actual day  if you put 0, the day is the day actual
 * @res: return Current date e.g 2015-10-23T16:00:00.000Z
 */

var getDate = function(num){
	var date = new Date();
	var aleatorio = (Math.round(Math.random()*23))+1;
	if(aleatorio<10){aleatorio='0'+aleatorio}
	if(num==0){aleatorio=23}
    var time = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+(date.getDate()+num)+'T'+aleatorio+':00:00.000Z';
	return time;
}
exports.getDate = getDate;

var getCurrentDate = function(moreSeconds){
    var date = new Date();
    date.setMilliseconds(000);
    var res = [];
    var currentTime = date.toJSON();
    res.push(currentTime);
    if(moreSeconds !== undefined){
        date.setSeconds(date.getSeconds()+moreSeconds);
        var currentPlus = date.toJSON();
        res.push(currentPlus);
    };
    return res;
}
exports.getCurrentDate = getCurrentDate;


/**
 * @text  {string} the text that its want to replace some value
 * @textToreplace  {[string} the text that is founded to then be replaced
 * @replaceWith  {string} the text that is wanded to be replaced
 * @text {string} return the string modified with the changes
 */
var stringReplace = function(text,textToReplace,replaceWith){
    text = text.replace(textToReplace,replaceWith);
    return text;
};

exports.stringReplace = stringReplace;

/**
 * this method returns a date in american format
 * @param  {Date} the parameter that is founded to then be replaced
 * @return {date}
 */
var getDateFromUnixTimeStamp = function (timeStamp) {
    var date = moment(timeStamp,'x').format('YYYY-MM-DD');
    return date;
};
exports.getDateFromUnixTimeStamp = getDateFromUnixTimeStamp;

/**
 * Function: generateLocationJson
 * This function generate random string to location that recive of size for name, custom name and description
 * Parameters:
 *   sizeName        - is the size of name of location
 *   customNameSize  - is the size of display name
 *   descriptionSize - is a small description about of location.
 * Returns:
 *   return the json with name, custonName and description of location.
 */
var generateLocationJson = function (sizeName, customNameSize, descriptionSize) {
    locationCongig.locationJson.name = generateString(sizeName),
    locationCongig.locationJson.customName = generateString(customNameSize),
    locationCongig.locationJson.description = generateString(descriptionSize)
    return locationCongig.locationJson;
};
exports.generateLocationJson = generateLocationJson;
/**
 * @description: This method get to Current date with diferent hours e.g. 2015-10-23T16:00:00.000Z
 * @param:  num sum the number sending to actual day  if you put 0, the day is the day actual
 * @res: return Current date e.g 2015-10-23T16:00:00.000Z
 */

var getDate = function(num){
    var date = new Date();
    var day = date.getDate() + num;
    var month = date.getMonth()+1;
    var aleatorio = (Math.round(Math.random()*23))+1;
    if(aleatorio < 10){ aleatorio = '0'+ aleatorio }
    if(num == 0){aleatorio = 23}
         if(day > 31){
            month = date.getMonth()+2;
            day = '0' + (1 + num);
         }
    var time = date.getFullYear() + '-' + (month) + '-' + (day) + 'T' + aleatorio + ':00:00.000Z';
    return time;
}
exports.getDate = getDate;
/**
 * This method generated a meeting with location, roomEmail, start date and end date specified
 * @param  {num} the parameter indicate the posicion of room where the meeting is created
 * @return {json} returns the json of the meeting configured
 */

var generatemeetingJson = function (num) {

    meetingsConfig.meetingJSon.location = meetingsConfig.meetingJSon.location.replace('[num]', num);
    meetingsConfig.meetingJSon.roomEmail = meetingsConfig.meetingJSon.roomEmail.replace('[num]', num);
    meetingsConfig.meetingJSon.resources = meetingsConfig.meetingJSon.resources[0].replace('[num]', num);
    meetingsConfig.meetingJSon.start = getDate(0);
    meetingsConfig.meetingJSon.end = getDate(1);
    
    return meetingsConfig.meetingJSon;
};
exports.generatemeetingJson = generatemeetingJson;
/**
 * this method returns a date in american format
 * @param  {Date} the parameter that is founded to then be replaced
 * @return {date}
 */
var getDateFromUnixTimeStamp = function (timeStamp) {
    var date = moment(timeStamp,'x').format('YYYY-MM-DD');
    return date;
};

exports.getDateFromUnixTimeStamp = getDateFromUnixTimeStamp;

var contains = function(text, textToCompare){

  return (text.indexOf(textToCompare) > -1)

};

exports.contains = contains;