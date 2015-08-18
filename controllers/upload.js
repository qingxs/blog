/**
 * Created by qing.liu on 2015/8/17.
 */
var multer = require('multer');
var check = require('./checkLogin');
var util = require('util');
var storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function (req, file, cb) {
    var _info = file.originalname.split('.');
    var _extName = _info.pop().toLowerCase();
    var _fileName = _info.join('-') + '_' + Date.now() +'.' + _extName;
    cb(null,_fileName);
  }
});
var limit ={
  fileSize:1024*1024*100
};
var uploader = multer({
  storage: storage,
  limit:limit
}).array('files');

exports.form = function (req, res) {
  check.isLogin(req, res, 'notLogin');
  res.render('upload', {
    title: '文件上传',
    user: req.session.user,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
};
exports.save = function (req, res, next) {
  check.isLogin(req, res, 'notLogin');
  uploader(req, res, function (err) {
    if(err){
      console.log(err);
      return err;
    }
    console.log(util.inspect(res, true, 3));
  });

  //这里怎么取得上传文件保存的文件名？

  //console.log(uploader)
  req.flash('success', '文件上传成功!!!');
  res.redirect('/upload');
};

