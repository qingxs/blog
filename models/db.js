var config = require('../config/');
var Mongodb = require('mongodb');
var Db = Mongodb.Db;
var Collection = Mongodb.Collection;
var Server = Mongodb.Server;

module.exports = new Db(config.db.name,new Server(config.db.host,config.db.port));