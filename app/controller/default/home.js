/* 
  default（客户端使用的所有API接口）
*/

'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    // const { ctx } = this;
    // ctx.body = '访问到了api接口';
    /* let result = await this.app.mysql.get("test_content",{})
    console.log(result)
    this.ctx.body = result */
    this.ctx.body = 'api hi，我是前台index接口'
  }

  async getArticleList() {

    let sql = 'SELECT article.id as id,'+
                 'article.title as title,'+
                 'article.introduce as introduce,'+
                 //主要代码----------start
                 "FROM_UNIXTIME(article.addTime,'%Y-%m-%d' ) as addTime,"+
                 //主要代码----------end
                 'article.view_count as view_count ,'+
                 'type.typeName as typeName '+
                 'FROM article LEFT JOIN type ON article.type_id = type.Id ' +
                 'ORDER BY article.addTime DESC'
 
     const results = await this.app.mysql.query(sql)
     this.ctx.body = {
          data:results
        }
  }

    async getArticleById() {
      //先配置路由的动态传值，然后再接收值
      let id = this.ctx.params.id
      let sql = 'SELECT article.id as id,'+
                'article.title as title,'+
                'article.introduce as introduce,'+
                'article.article_content as article_content,'+
                "FROM_UNIXTIME(article.addTime,'%Y-%m-%d') as addTime,"+
                'article.view_count as view_count ,'+
                'type.typeName as typeName ,'+
                'type.Id as typeId '+
                'FROM article LEFT JOIN type ON article.type_id = type.Id '+
                'WHERE article.id='+id

      const result = await this.app.mysql.query(sql)
      this.ctx.body={data:result}
  }

  // 得到类别名称和编号
  async getTypeInfo() {
    const result = await this.app.mysql.select('type')
    this.ctx.body = {data: result}
  }

  // 根据类别Id获得文章列表
  async getListById() {
    let id = this.ctx.params.id
    let sql = 'SELECT article.id as id,'+
                 'article.title as title,'+
                 'article.introduce as introduce,'+
                 "FROM_UNIXTIME(article.addTime,'%Y-%m-%d') as addTime,"+
                 'article.view_count as view_count ,'+
                 'article.type_id as typeId,'+
                 'type.typeName as typeName '+
                 'FROM article LEFT JOIN type ON article.type_id = type.Id '+
                //  'AND article.type_id =' + id
                  'WHERE type_id='+id
                //  'where article.type_id =' + id
                // 'FROM article,type WHERE article.type_id = type.Id AND article.type_id ='+id
 
     const results = await this.app.mysql.query(sql)
 
     this.ctx.body = { data:results }
  }
}

module.exports = HomeController;
