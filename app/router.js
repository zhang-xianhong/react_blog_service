'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  // const { router, controller } = app;
  // router.get('/', controller.home.index);
  // router.get('/list', controller.home.list);
  // 引入自己设定的路由
  require('./router/default')(app),
  require('./router/admin')(app)

};
