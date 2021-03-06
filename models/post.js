/**
 * Created by qing.liu on 2015/8/14.
 */
var mongo = require('./db');
var ObjectID = require('mongodb').ObjectID;
var markdown = require('markdown');
var moment = require('moment');
var util = require('util');
var config = require('../config/');

function Post(post){
  this.name = post.name;
  this.title = post.title;
  this.content = post.content;
}
module.exports = Post;

Post.prototype.save = function(callback){
  var post = {
    name : this.name,
    title : this.title,
    content : this.content,
    time: new Date(),
    comments: []
  };
  mongo.open(function(err,db){
    if(err){
      return callback(err);
    }
    db.collection('posts',function(err,_posts){
      if(err){
        mongo.close();
        return callback(err);
      }
      _posts.insert(post,{safe:true},function(err){
        mongo.close();
        callback(err);
      });
    });
  });
};
Post.update = function(id,data,callback){
  mongo.open(function(err,db){
    if(err){
      return callback(err);
    }
    db.collection('posts',function(err,_posts){
      if(err){
        mongo.close();
        return callback(err);
      }
      _posts.update({
        '_id':ObjectID(id)
      },{
        $set : data
      },{safe:true},function(err){
        mongo.close();
        callback(err);
      });
    });
  });
};
Post.remove = function(id,callback){
  mongo.open(function (err,db) {
    if (err) return callback(err);
    db.collection('posts',function(err,_posts){
      if (err){
        mongo.close();
        return callback(err);
      }
      _posts.remove({'_id':ObjectID(id)},{w:1}, function (err) {
        mongo.close();
        callback(err);
      })
    });
  })
};
Post.get = function (queryParam, page, callback) {
  //console.log('page:' + page);
  mongo.open(function(err,db){
    if (err) return callback(err);
    db.collection('posts',function(err,_posts){
      if(err){
        mongo.close();
        return callback(err);
      };
      var query = {};
      if (queryParam) {
        if (queryParam[0])query.name = queryParam[0];
        if (queryParam[1])query.title = queryParam[1];
        if (queryParam.id)query._id = ObjectID(queryParam.id);
      }
      if (!query.title && !query._id) {
        _posts.count(query, function (err, total) {

          if (err) return callback(err);
          var queryLimit = {limit: config.limit};
          if (util.isNumber(page)) {
            page = page < 1 ? 1 : page;
            var maxPage = Math.ceil(total / config.limit);
            page = page > maxPage ? maxPage : page;
            queryLimit.limit = config.limit;
            queryLimit.skip = (page - 1) * config.limit;
          }
          //console.log(util.inspect(maxPage) + '_' + page);
          _posts.find(query, queryLimit)
            .sort({time: -1})
            .toArray(function (err, docs) {
              mongo.close();
              if (err) return callback(err);
              docs.forEach(function (doc) {
                doc.content = markdown.parse(doc.content);
                doc.time = moment(doc.time).format('YYYY-MM-DD HH:mm');
              });
              var pi = {
                'page': page,
                'maxPage': maxPage,
                'total': total
              };
              callback(null, docs, pi);
            });
        });
      } else {
        _posts.findOne(query, function (err, doc) {
          mongo.close();
          //console.log('doc:'+util.inspect(doc));
          if (err) return callback(err);
          if(doc){
            if (!query._id) doc.content = markdown.parse(doc.content);
            doc.time = moment(doc.time).format('YYYY-MM-DD HH:mm');
            doc.comments.forEach(function (comment) {
              comment.content = markdown.parse(comment.content);
              comment.time = moment(comment.time).format('YYYY-MM-DD HH:mm');
            });
          }
          callback(null, doc);
        });
      }
    });
  });
};