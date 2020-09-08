# Rent_Manager
适用于写字楼，商铺租赁管理公司的开源管理系统。
包含了租赁剖面图，合同自动生成，租金统计，催款函批量导出，租赁BI，Chrome看板等功能。
使用的技术栈：node,react,antd,dingdingAPI,mysql，Docxtemplater

#注意：
早期版本未作用户安全控制，请在安全环境中测试使用，
作者原为地产公司IT负责人，因为市面上地产管理存在软件或过于繁琐，或功能简单，或者无法调用接口等问题。因此业务时间内写的本管理工具。
开源本项目是为市面上的租赁管理软件提供一种设计管理思路。本项目遵循Apache Licence开源协议。

#下面是部分界面图片：
!!https://github.com/edien8wing/Rent_Manager/blob/master/demoIMG-01.jpg

#介绍及指引：
后端：
1：nodeServer中是node.js编写的后端程序。
2：初始安装请先使用npm install 安装所需软件包。
3：调整以下参数 配置mysql数据库/nodeServer/bin/db.js  配置端口号/nodeServer/bin/www 默认为3000
4：安装mysql数据库,使用sql.sql初始化数据库
5：使用npm start 启动后端程序

前端：
1:web目录下是前端部分。
2：请先使用npm install 安装所需软件包。再全局安装"webpack": "^1.12.9","webpack-dev-server": "^1.14.0",
3：修改web目录下webpack.config.js前端服务器配置。修改web/src/bin/下文件 AJAX.js：后端通信地址及端口 COOKIE.js登陆有效时间

看板页面：
building-guid是用原生js编写的看板程序。每隔一定时间向后端查询租赁信息并展现到屏幕上。可以使用树梅派部署到大屏或电视机上

关于钉钉：
系统的审批使用的是钉钉工作流。提供了移动审批的功能，因此需要申请钉钉企业号并按照如下方式设置：
1：在dingding后台填写通信白名单
2：将申请到的appkey 和 appSecret填写到nodeServer/bin/dingApi.js
3:在dingding后台增加下述审批：

    1：钉钉合同签订审批
    https://github.com/edien8wing/Rent_Manager/blob/master/IMG/%E5%BB%BA%E7%AB%8B%E5%AE%A1%E6%89%B9.jpg
    2：钉钉乙方变更审批
    https://github.com/edien8wing/Rent_Manager/blob/master/IMG/%E6%9B%B4%E5%90%8D.jpg
    3：钉钉退租审批
    https://github.com/edien8wing/Rent_Manager/blob/master/IMG/%E9%80%80%E7%A7%9F.jpg
    4：金额到账审批
    https://github.com/edien8wing/Rent_Manager/blob/master/IMG/%E9%80%80%E7%A7%9F.jpg

并将上述流程的process-code 更改到 nodeServer/bin/dingApi.js中
4 将所需审批的员工的dingID和depID更新到系统权限中

关于导出文件：
    导出模板位置在nodeServer/Template/ 目录下，可以更改文字但不要更改格式及参数



说明中可能有遗漏的方面，留下联系方式以便交流：
微信、手机：15000640278。 邮箱101072765@qq.com
