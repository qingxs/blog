var config = require('../config/');
var Mongo = require('mongodb');

var newDb = function(){
    var Db = Mongo.Db;
    var Connection = Mongo.Connection;
    var Server = Mongo.Server;
    return new Db(config.db.name,new Server(config.db.host,config.db.port));
};
module.exports = newDb;