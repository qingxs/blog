/* router config. */
var bcrypt = require('bcrypt');
var User = require('../models/user'),
  Post = require('../models/post');
var router = function (app) {
    app.get('/', function(req, res) {
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
    });
  app.get('/user/:name', function(req, res) {
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
  });
    app.get('/reg',checkLogin);
    app.get('/reg', function(req, res) {
        res.render('reg', {
            title: '注册',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
    app.post('/reg',checkLogin);
    app.post('/reg', function(req, res) {
        var name = req.body['name'],
            password = req.body['password'],
            password_repeat = req.body['password-repeat'];
        if(password_repeat !== password_repeat){
          req.flash('error','两次密码输入不一致');
            return res.redirect('/reg');
        };
        var passhash = bcrypt.hashSync(password,10);
        var newUser = new User({
            name : name,
            password : passhash,
            email : req.body['email']
        });
        User.get(newUser.name,function(err,user){
            if(err){
                req.flash('error',err);
                return res.redirect('/reg');
            }
            if(user){
                req.flash('error','用户名称已存在');
                return res.redirect('/reg');
            }
            newUser.save(function(err,user){
                if(err){
                    req.flash('error',err);
                    return res.redirect('/reg');
                }
                req.session.user = user;
                req.flash('success','注册成功');
                res.redirect('/login');
            });
        });
    });
    app.get('/login',checkLogin);
    app.get('/login', function(req, res) {
        res.render('login', {
            title: '登录',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
    app.post('/login',checkLogin);
    app.post('/login', function(req, res) {
        var name = req.body['name'],
            password = req.body['password'];
        User.get(name,function(err,user){
            if(err){
                req.flash('error',err);
                return res.redirect('/login');
            }
            if(!user){
                req.flash('error','用户不存在');
                return res.redirect('/login');
            }
            if(!bcrypt.compareSync(password,user.password)){
                req.flash('error','登录密码错误');
                return res.redirect('/login');
            }
            req.flash('success','登录成功');
            req.session.user = user;
            res.redirect('/');
        });
    });
    app.get('/logout',checkNotLogin);
    app.get('/logout', function(req, res) {
        req.session.user = null;
        req.flash('success','退出成功');
        res.redirect('/');
    });
    app.get('/post',checkNotLogin);
    app.get('/post', function(req, res) {
        res.render('post', {
            title: '发布信息',
            user : req.session.user,
            success : req.flash('success'),
            error : req.flash('error')
        });
    });
    app.post('/post',checkNotLogin);
    app.post('/post', function(req, res) {
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
    });
};


module.exports = router;

function checkLogin(req,res,next){
  if(req.session.user){
      req.flash('error','用户已登录');
      res.redirect('back');
  };
    next();
};
function checkNotLogin(req,res,next){
    if(!req.session.user){
        req.flash('error','用户未登录');
        res.redirect('/login');
    };
    next();
}