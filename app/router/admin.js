// 后台管理员路由配置文件
module.exports = app => {
    const {router,controller} = app
    // 生成并使用守卫
    var adminauth = app.middleware.adminauth()
    router.get('/admin/index',controller.admin.main.index)
    router.post('/admin/checkLogin',controller.admin.main.checkLogin) 
    router.get('/admin/getTypeInfo',adminauth,controller.admin.main.getTypeInfo) //配置一个中间件——路由守卫
    router.post('/admin/addArticle',adminauth,controller.admin.main.addArticle) //添加文章
    router.post('/admin/updateArticle',adminauth,controller.admin.main.updateArticle) //更新文章
    router.get('/admin/getArticleList',adminauth,controller.admin.main.getArticleList) //获取文章列表
    router.get('/admin/deleteArticle/:id',adminauth,controller.admin.main.deleteArticle) //删除文章
    router.get('/admin/getArticleById/:id',adminauth,controller.admin.main.getArticleById) //通过Id获取文章列表，从而进行修改
}   