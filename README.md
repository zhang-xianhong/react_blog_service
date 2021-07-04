## 一、安装yarn
        在node命令中使用 npm i yarn -g
        查看版本 yarn --version

## 二、搭建开发环境
        1、全局安装egg.js的脚手架工具 egg-init
        npm i egg-init -g
        2、进入service文件夹，用脚手架自动生成项目的基本结构
        npm init --type=simple
        3、安装egg项目所需要的所有依赖包
        npm install || yarn install
        4、启动服务查看结果
        npm run dev || yarn dev

## 三、egg.js目录结构和约定规范
        1、认识相关目录结构
        2、搭建一个路由
        app文件夹:项目开发文件，程序员主要操作的文件，项目的大部分代码都会写在这里。
        config文件夹：这个是整个项目的配置目录，项目和服务端的配置都在这里边进行设置。
        logs文件夹：日志文件夹，正常情况下不用修改和查看里边内容。
        node_modules:项目所需要的模块文件，这个前端应该都非常了解，不多作介绍。
        run文件夹：运行项目时，生成的配置文件，基本不修改里边的文件。
        test文件夹：测试使用的配合文件，这个在测试时会使用。
        .autod.conf.js: egg.js自己生成的配置文件，不需要进行修改。
        eslinttrc和eslintignore：代码格式化的配置文件。
        gitgnore：git设置忽略管理的配置文件。
        package.json： 包管理和命令配置文件，这个文件经常进行配置。

## 四、RESTful API设计和路由配置
        1、在controller文件夹下新建两个文件夹admin（管理端使用的所有API接口）和default（客户端使用的所有API接口）文件夹。
        2、配置一下路由。这里为了把路由也分成前后端分离的，所以在app文件夹下新建一个router文件夹。
        在文件夹下新建两个文件default.js和admin.js。

## 五、Egg.js中连接mysql数据库
        1、安装egg-mysql
        命令：npm install --save egg-mysql || yarn add egg-mysql
        2、进行插件配置——在/config/plugin.js文件中
                exports.mysql = {
                enable: true,
                package: 'egg-mysql'
                }
        3、数据库连接配置——（使用PHP study）
                打开config.default.js文件，在这个文件中进行配置（可以在https://www.npmjs.com/ 中找到相应配置）
                config.mysql = {
                // database configuration
                client: {
                // host
                host: 'localhost',
                // port
                port: '3306',
                // username
                user: 'root',
                // password
                password: 'root',
                // database
                database: 'react_blog',    
                },
                // load into app, default is open
                app: true,
                // load into agent, default is close
                agent: false,
                };
        4、创建数据库
                4.1 创建表、字段、插入数据
        5、使用Get进行表的查询(测试是否连接成功)
                在/app/controller/defalut/home.js文件中，改写index方法。
                async index(){
                //获取用户表的数据
                let result = await this.app.mysql.get("blog_content",{})
                console.log(result)
                this.ctx.body=result
                }

## 六、数据库设计和首页借口制作
                1、数据库中的表建立
                        直接使用Mysql-front工具建立使用的表,建立两张表type和article
                        type表（文章类型表）

                        id : 类型编号 int类型
                        typeName: 文章类型名称 varchar类型
                        orderNum: 类型排序编号 int类型
                        建立好表之后，我们再写入一条数据，编号为1，名称是视频教程，排列需要为1

                        article表（文章内容表）

                        id : 文章编号 int类型
                        type_id : 文章类型编号 int类型
                        title : 文章标题，varchar类型
                        article_cointent : 文章主体内容，text类型
                        introduce： 文章简介，text类型
                        addTime : 文章发布时间，int(11)类型
                        view_count ：浏览次数， int类型
                        建立好之后，可以自己写一些对应的文章进去，记得点击发布才可以。
                2、前端首页文章列表接口
                        利用RESTful的规范，建立前端首页所需要的接口了。
                        在/app/contoller/default/home.js文件夹中，写一个getArticleList的方法，代码如下：
                        async getArticleList(){

                        let sql = 'SELECT article.id as id,'+
                                'article.title as title,'+
                                'article.introduce as introduce,'+
                                'article.addTime as addTime,'+
                                'article.view_count as view_count ,'+
                                '.type.typeName as typeName '+
                                'FROM article LEFT JOIN type ON article.type_id = type.Id'

                        const results = await this.app.mysql.query(sql)

                        this.ctx.body={
                                data:results
                        }
                        }

                        写完之后还需要配置一下路由（router），打开/app/router/default.js,新建立一个get形式的路由配置，代码如下：
                        module.exports = app =>{
                                const {router,controller} = app
                                router.get('/default/index',controller.default.home.index)
                                router.get('/default/getArticleList',controller.default.home.getArticleList)
                        }

## 七、前中台结合1——前台读取首页列表接口
                1、在blog目录中安装axios模块
                        yarn add axios
                2、新建getInitialProps方法并获取数据
                        在/blog/pages/index.js文件中，在文件下方编写getInitialProps方法
                        Home.getInitialProps = async ()=>{
                        const promise = new Promise((resolve)=>{
                        axios('http://127.0.0.1:7001/default/getArticleList').then(
                        (res)=>{
                                //console.log('远程获取数据结果:',res.data.data)
                                resolve(res.data)
                        }
                        )
                        })

                        return await promise
                        }
                3、把数据放到前端界面中显示
                        当我们在getInitialProps方法里获得数据后，是可以直接传递到正式方法里，然后进行使用: 在Home组件的参数中直接传入返回的promise对象
                        然后在相应的地方进行渲染

                4、修改时间戳为日期格式
                        在/service/app/controller/home.js文件中，改写sql语句，将addTime部分代码更换为：
                        "FROM_UNIXTIME(article.addTime,'%Y-%m-%d %H:%i:%s' ) as addTime,"
                5、在游览器中预览


## 八、前中台结合2——文章详细页面接口制作与展示
                通过一个ID查找出详细的信息。
                1、编写中台详细页面的接口
                在/service/app/controller/default/home.js文件中编写接口——getArticleById，具体代码查找文件中
                编写完成后，这个接口就可以使用了，但是不要忘记，开启MySql服务和中台接口服务。
                2、编写前台导航链接
                2.1、先把首页到详细页的链接做好，这个直接使用Next.js中的<Link>标签就可以了。找到首页中循环时文章的标题，在外边包括<Link>标签就可以了。
                <div className="list-title">
                <Link href={{pathname:'/detailed',query:{id:item.id}}}>
                <a>{item.title}</a>
                </Link>
                </div>
                3、详细页从接口获取数据
                当我们能通过链接跳转到详细页面之后，就可以编写detailed.js，通过getInitialProps来访问中台接口，并从中台接口获得数据。具体代码见文件中
                预览是否可以拿到后台的数据

## 九、解决egg.js的跨域问题
                前后端存在的跨域问题需要解决，通过egg-cors
                egg-cors模块是专门用来解决egg.js跨域问题的，只要简单的配置就可以完成跨域的设置，但是跨域一定要谨慎设置，很多安全问题，都是通过跨域进行攻击的。
                1、安装egg-cors
                        yarn add egg-cors
                2、配置config/plugin.js文件
                        exports.cors: {
                                enable: true,
                                package: 'egg-cors'
                        }
                3、配置config.default.js文件
                        这个文件主要设置的是允许什么域名和请求方法可以进行跨域访问。配置代码如下。
                        config.security = {
                        　　　　csrf: {
                        　　　　　　enable: false
                        　　　　},
                        　　　　domainWhiteList: [ '*' ]
                        　　};
                        config.cors = {
                        origin: '*',
                        allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS'
                        };

## 十、重构前台博客详细页面1——marked+hightlight
        1、安装marked和hightlight.js
        yarn add marked
        yarn add highlight.js
        2、重构detailed文件
        引入模块：
                import marked from 'marked'
                import hljs from "highlight.js";
                import 'highlight.js/styles/monokai-sublime.css';
        设置marked.setOptions，具体看源代码
        3、设置CSS样式

## 十一、重构前台博客详细页面2——实现文章导航
        使用tocify.tsx
        1、使用这个文件的两个必要条件
                1.1、你的程序员中使用了Ant DesignUI库，因为它里边的导航部分，使用了antd的Anchor组件
                1.2、安装lodash模块，这个可以直接使用yarn add lodash来安装，这样安装好像有些问题，所以尝试使用 yarn add @types/lodash
                上面两个条件满足后，你可以把文件tocify.tsx拷贝到你的项目里了，我这里放到了/blog/components文件夹下了，把它视为一种自定义组件。具体看源代码
        2、使用tocify.tsx生成文件目录
        引入：import Tocify from '../components/tocify.tsx'
        引入后，需要对marked的渲染进行自定义，这时候需要设置renderer.heading，就是写一个方法重新定义对#这种标签的解析。代码见detailed.js
        最后在需要显示文章导航的地方，写下面的代码:
        <div className="toc-list">
                {tocify && tocify.render()}
        </div>
        这样就完成了前端详细文章页面的文章导航，可以预览一下效果。

## 十二、前台文章列表页的制作1——接口模块化何读取文章分类
        1、编写统一中台API配置文件
        在blog文件夹下，新建config文件夹，在此文件夹下新建apiUrl.js文件，该文件作用是用于配置url地址相同的部分，方便管理
        设置好这个文件之后，到相应的文件地址的地方引入这个问价，并做相应的更改
        2、修改首页接口，读取文章类别信息
        我们希望每个页面只读取一次接口，然后服务端渲染好后展示给我们，这时候就需要在首页的getArticleList接口中进行修改了。
        文件位置/service/app/default/home.js
        3、修改数据库
        我们打开mysql的管理工具，然后在里边加入icon字段。
        视频教程加上 YoutubeOutlined
        大胖逼逼叨加上 MessageOutlined
        快乐生活加上 SmileOutlined
        4、修改Header组件
        以前我们的Header组件是静态的，也就是写死的，现在我们需要利用useEffect()方法来从接口中获取动态数据。
        需要先引入useState和useEffect,然后由于还要进行跳转，所以还要引入Router和Link,由于还要访问接口，所以还要引入axios和servicePath。
        useEffect()写完后，可以获得博客的分类信息了，要想让分类信息可以跳转，可以写一个方法handleClick
        这些都准备好以后，就可以写我们的JSX语法，修改<Menu>组件部分了
        这个需要动态的获取Icon图标，所以自己设定了一个方法
        引入所有的Icon图标：import * as Icons from '@ant-design/icons'
        然后在Menu.Item 中获取每一项： const TagIcon = Icons[item.icon]
        然后使用这个组件就行了 <TagIcon />


## 十三、前台文章列表页的制作2——根据类别读取文章列表
        1、编写根据类别ID获取文章列表的接口
                在/service/app/default/home.js,编写对应的接口，因为这里需要转换时间，所以只能使用query这种形式。
                具体代码见配置
        2、配置路由和接口管理文件
                有了接口后，需要中台为其配置路由，才能让前台可以访问到。
                打开/service/router/default.js文件，然后在下方增加代码。
                router.get('/default/getListById',controller.default.home.getListById)
                配置好了路由，接下里去前台的接口管理文件/config/apiUrl.js 中添加跳转的路径
        3、编写前台UI界面
                在list.js文件中配置：可以直接使用getInitialProps从接口中获取数据
                当getInitialProps写完后，就可以编写JSX部分了，这里主要是循环部分<List>组件的代码。
                
                如果是不请求，直接写一个useEffect就可以解决不刷新的问题。
                useEffect(()=>{
                setMylist(list.data)
                })

## 十三、让前台所有页面支持Markdown解析


