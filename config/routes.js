/* router config. */
var bcrypt = require('bcrypt');
var User = require('../models/user');
var router = function (app) {
    app.get('/', function(req, res, next) {
        res.render('index', {
            title: '主页',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
    app.get('/reg', function(req, res, next) {
        res.render('reg', {
            title: '注册',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
    app.post('/reg', function(req, res, next) {
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
    app.get('/login', function(req, res, next) {
        res.render('login', {
            title: '登录',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
    app.post('/login', function(req, res, next) {
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
    app.get('/logout', function(req, res, next) {
        req.session.user = null;
        req.flash('success','退出成功');
        res.redirect('/');
    });
    app.get('/post', function(req, res, next) {
        res.render('post', {
            title: '发布信息',
            user : req.session.user,
            success : req.flash('success'),
            error : req.flash('error')
        });
    });
    app.post('/post', function(req, res, next) {
    });
    app.get('/users/',function(req,res,next){
        res.render('index',{title:'用户首页'});
    });

}


module.exports = router;