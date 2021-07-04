/* 
    中台路由守卫的编写
    路由守卫的作用： 控制在没有进行登录的时候访问某个页面，直接跳转到登录页面中去
*/

module.exports = options => {
    return async function adminauth(ctx,next){
        console.log('66666',ctx.session.openId)
        if(ctx.session.openId) {
            await next()
        } else {
            ctx.body = {data:'没有登录'}
        }
    }
}