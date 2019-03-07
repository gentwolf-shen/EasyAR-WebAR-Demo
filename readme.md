# EasyAR WebAR 简介

WebAR，由全球领先的AR开放平台和AR技术领导者视+AR针对Web平台（如微信、Safari浏览器）开发的全新AR产品。
WebAR由Web前端和EasyAR云服务组成，支持平面图片识别、云识别、3D渲染、复杂互动等功能。 WebAR具有模式轻、部署快、传播性强等特点。

EasyAR 官网地址： https://www.easyar.cn https://www.easyar.com

技术支持：support@easyar.com

QQ群：463096767， 543115898，756218026


# EasyAR WebAR 集成运行包

## 一、功能说明

为方便开发者快速搭建开发环境，EasyAR推出集成运行包，零配置即可运行。

## 二、文件及目录说明

1. EasyAR-WebAR_linux：linux系统程序
2. EasyAR-WebAR_darwin：Mac OS系统程序
3. EasyAR-WebAR_windows.exe：windows系统程序
4. config/application.txt程序配置(JSON格式)
    * 4.1 port：程序监听端口
    * 4.2 key：EasyAR 云识别 Cloud Key
    * 4.3 secret：EasyAR 云识别 Cloud Secret
    * 4.4 url：EasyAR 云识别 Client-end URL
5. html：HTML、JS等文件目录
6. backend：后端识别程序示例(C#、Java、PHP等)

## 三、开发使用

1. 修改config/application.txt，将你的云识别app、secret及url填入。
2. 运行EasyAR-WebAR程序，如启动成功，会显示监听的端口号。
    * 2.1 linux系统：
        ./EasyAR-WebAR_linux
    * 2.2 Mac OS系统：
        ./EasyAR-WebAR_darwin
    * 2.3 windows系统：
        鼠标双击或在cmd中运行：EasyAR-WebAR_windows.exe
3. 在浏览器(需要摄像头)中输入http://<你的ip>:<端口>/html/<Demo目录>,
    如：http://127.0.0.1:3000/html/SimpleThreeJsExample
4. 如果一切顺利，第一个Demo将会呈现在你的浏览器中。
5. 如果集成包不能运行,请参考后端程序配置运行环境。

## 四、集成到生产环境

EasyAR WebAR集成包，可方便与流行的Web服务器集成。

使用反向代理功能，将浏览器发送的数据转发到EasyAR WebAR程序上。
配置完成后，请重新启动nginx或apache。


集成方法如下(域名必须支持HTTPS协议)：

1. 与nginx集成

    在nginx配置文件中的server中，添加以下内容：
    
    ``` 
    location /webar/recognize {
        proxy_pass   http://127.0.0.1:3000/webar/recognize;
    }     
    ```

2. 与apache集成

    修改httpd.conf文件，将mod_proxy.so与mod_proxy_http.so前的#符去掉，
    再修改httpd-ssl.conf，在你的VirtualHost中增加：

    ```    
      ProxyPass /webar/recognize  http://127.0.0.1:3000/webar/recognize
      ProxyPassReverse /webar/recognize  http://127.0.0.1:3000/webar/recognize      
    ```
    
## 五、祝一切顺利

