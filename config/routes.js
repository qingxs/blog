/* router config. */
var router = function (app) {
    app.get('/', function(req, res, next) {
        res.render('index', { title: '首页' });
    });
    app.get('/reg', function(req, res, next) {
        res.render('reg', { title: '注册' });
    });
    app.post('/reg', function(req, res, next) {
    });
    app.get('/login', function(req, res, next) {
        res.render('login', { title: '登录' });
    });
    app.post('/login', function(req, res, next) {
    });
    app.get('/logout', function(req, res, next) {
    });
    app.get('/post', function(req, res, next) {
        res.render('post', { title: '发布信息' });
    });
    app.post('/post', function(req, res, next) {
    });
    app.get('/users/',function(req,res,next){
        res.render('index',{title:'用户首页'});
    });

}


module.exports = router;