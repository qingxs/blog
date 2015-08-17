/**
 * Created by qing.liu on 2015/8/17.
 */
var check = require('./checkLogin');

exports.form = function (req, res) {
  check.isLogin(req, res, 'notLogin');
  res.render('upload', {
    title: '文件上传',
    user: req.session.user,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
};
exports.save = function (req, res) {
  check.isLogin(req, res, 'notLogin');
  //upload

  req.flash('success', '文件上传成功!');
  res.redirect('/upload');
};
