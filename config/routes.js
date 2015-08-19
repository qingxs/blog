/* router config. */
var user = require('../controllers/user'),
  art = require('../controllers/article'),
  upload = require('../controllers/upload');


var router = function (app) {
  app.get(/^\/$|^\/(index\/?(page(\d+)\/?)?)$/i, art.index);
  app.get(/^\/user\/([^\/]+)\/?((?!(page\d+))?|[^\/]+)\/?(?:page(\d+)\/?)?$/i, art.user);
  app.post(/\/user\/([^\/]*)\/([^\/]*)\/?(page\d+\/?)?$/i, art.comment);
  app.get('/reg', user.reg.form);
  app.post('/reg', user.reg.post);
  app.get('/login', user.login.form);
  app.post('/login', user.login.post);
  app.get('/logout', user.logout);
  app.get('/post',art.post.form);
  app.post('/post', art.post.save);
  app.get('/edit/:id',art.post.edit);
  app.post('/edit/:id',art.post.update);
  app.all('/remove/:id',art.post.remove);
  app.get('/upload', upload.form);
  app.post('/upload',upload.save);
};


module.exports = router;