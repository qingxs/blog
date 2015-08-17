/* router config. */
var user = require('../controllers/user'),
  art = require('../controllers/article'),
  upload = require('../controllers/upload');


var router = function (app) {
  app.get('/',art.index);
  app.get('/user/:name', art.userIndex);
  app.get('/reg', user.reg.form);
  app.post('/reg', user.reg.post);
  app.get('/login', user.login.form);
  app.post('/login', user.login.post);
  app.get('/logout', user.logout);
  app.get('/post',art.post.form);
  app.post('/post', art.post.save);
  app.get('/upload', upload.form);
  app.post('/upload',upload.save);
};


module.exports = router;