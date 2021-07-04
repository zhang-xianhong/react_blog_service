/* 
    管理端使用的所有API接口
*/

'use strict'

const Controller = require('egg').Controller

class MainController extends Controller {
    
    async index() {
        this.ctx.body = 'Hi，Welcome backtop blog system'
    }

    // 判断登录相关操作，存取session
    async checkLogin() {
        let userName = this.ctx.request.body.userName
        let password = this.ctx.request.body.password
        const sql = " SELECT userName FROM admin_user WHERE userName = '"+userName +
                  "' AND password = '"+password+"'"
        const res = await this.app.mysql.query(sql)
        console.log('length=: ',res.length)
        if(res.length > 0) {
            //登录成功,进行session缓存
            let openId = new Date().getTime()
            this.ctx.session.openId = {'openId':openId }
            this.ctx.body = {'data':'登录成功','openId':openId}
            console.log('main.js中的登录测试1')
        } else {
            this.ctx.body = {data:'登录失败'}
        } 
    }

    //后台文章分类信息
    async getTypeInfo() {
        const resType = await this.app.mysql.select('type') //获得type表中的所有东西 
        console.log(resType,'-------')
        this.ctx.body = {data: resType}
    }

    // 添加文章
    async addArticle() {
        let tmpArticle = this.ctx.request.body
        const result = await this.app.mysql.insert('article',tmpArticle)
        const insertSuccess = result.affectedRows === 1 //判断是否插入了一行，即是否插入成功
        const insertId = result.insertId  //保存插入的Id值，用于判断是新增还是修改数据
        this.ctx.body = {
            isSuccess: insertSuccess,
            insertId: insertId
        }
    }

    // 更新文章接口
    async updateArticle() {
        let tempArticle = this.ctx.request.body
        const result = await this.app.mysql.update('article',tempArticle)
        const updateSuccess = result.affectedRows === 1
        console.log('这里是更新文章接口：',updateSuccess)
        this.ctx.body = { isSuccess: updateSuccess }
    }

    //获得文章列表
    async getArticleList() {
        let sql = 'SELECT article.id as id,'+
                'article.title as title,'+
                'article.introduce as introduce,'+
                "FROM_UNIXTIME(article.addTime,'%Y-%m-%d' ) as addTime,"+
                'article.view_count as view_count ,'+
                'type.typeName as typeName '+
                'FROM article LEFT JOIN type ON article.type_id = type.Id '+
                'ORDER BY article.id DESC '
        const resultList = await this.app.mysql.query(sql)
        console.log('getArticleList')
        this.ctx.body ={ list: resultList }
    }

    // 通过Id删除文章
    async deleteArticle() {
        let id = this.ctx.params.id
        const res = await this.app.mysql.delete('article',{'id':id})
        this.ctx.body = { data: res }
    }

    //根据文章ID得到文章详情，用于修改文章
    async getArticleById(){
        let id = this.ctx.params.id
        let sql = 'SELECT article.id as id,'+
        'article.title as title,'+
        'article.introduce as introduce,'+
        'article.article_content as article_content,'+
        "FROM_UNIXTIME(article.addTime,'%Y-%m-%d' ) as addTime,"+
        'article.view_count as view_count ,'+
        'type.typeName as typeName ,'+
        'type.Id as typeId '+
        'FROM article LEFT JOIN type ON article.type_id = type.Id '+
        'WHERE article.id=' + id
        const result = await this.app.mysql.query(sql)
        // console.log(result)
        this.ctx.body={data:result}
    }
}

module.exports = MainController