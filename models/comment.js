/**
 * Created by qing.liu on 2015/8/19.
 */
var mongo = require('./db');
var ObjectID = require('mongodb').ObjectID;

function Comment(data) {
  this.id = data.id;
  this.comment = data.comment;
}
module.exports = Comment;

Comment.prototype.save = function (cb) {
  var id = this.id,
    comment = this.comment;
  mongo.open(function (err, db) {
    if (err) {
      return cb(err);
    }
    db.collection('posts', function (err, _posts) {
      if (err) {
        mongo.close();
        return cb(err);
      }
      _posts.update({
        '_id': ObjectID(id)
      }, {
        $push: {'comments': comment}
      }, function (err) {
        mongo.close();
        cb(err);
      });
    });
  });
};