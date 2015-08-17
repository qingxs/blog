/**
 * Created by qing.liu on 2015/8/17.
 */
var Post = require('../models/post');
var check = require('./checkLogin');
exports.index = function(req, res) {
  Post.get(null, function (err, posts) {
    if (err) {
      console.log(err);
      posts = [];
    }
    res.render('index', {
      title: '主页',
      user: req.session.user,
      posts : posts,
      success: req.flash('success'),
      error: req.flash('error')
    });
  });
};

exports.userIndex = function(req, res) {
  Post.get(req.param('name'), function (err, posts) {
    if (err) {
      console.log(err);
      posts = [];
    }
    res.render('index', {
      title: req.param('name')+'的主页',
      user: req.session.user,
      posts : posts,
      success: req.flash('success'),
      error: req.flash('error')
    });
  });
};
exports.post = {};
exports.post.form = function(req,res){
  check.isLogin(req,res,'notLogin');
  res.render('post', {
    title: '发布信息',
    user : req.session.user,
    success : req.flash('success'),
    error : req.flash('error')
  });
};
exports.post.save = function(req,res){
  check.isLogin(req,res,'notLogin');
  var post = new Post({
    name:req.session.user.name,
    title:req.body['title'],
    content:req.body['content']
  });
  post.save(function(err){
    if(err){
      req.flash('error',err);
      return res.redirect('/');
    }
    req.flash('success','发布成功');
    res.redirect('/');
  });
};