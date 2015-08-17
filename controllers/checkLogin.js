/**
 * Created by qing.liu on 2015/8/17.
 */
exports.isLogin = function (req, res, status) {
  status = status || 'login';
  if (status === 'login') {
    if (req.session.user) {
      req.flash('error', '用户已登录');
      res.redirect('back');
    }
  } else {
    if (!req.session.user) {
      req.flash('error', '用户未登录');
      res.redirect('/login');
    }
  }
};