/**
 * WebAR简单类
 * @param interval 识别间隔时间(毫秒)
 * @param recognizeUrl 识别服务地址
 * @constructor
 */
const WebAR = function(interval, recognizeUrl) {
    var interval = interval;
    var recognizeUrl = recognizeUrl;

    var videoSetting = {width: 320, height: 240};
    var videoElement = null;
    var videoDeviceElement = null;

    var canvasElement = null;
    var canvasContext = null;

    var timer = null;
    var isRecognizing = false;

    var debug = document.createElement('div');
    debug.setAttribute('id', 'debug');
    debug.setAttribute('width', (window.innerWidth / 2).toString());
    debug.setAttribute('height', window.innerHeight.toString());
    document.body.appendChild(debug);

    /**
     * 列出所有摄像头
     * @param videoDevice
     * @returns {Promise}
     */
    this.listCamera = function(videoDevice) {
        videoDeviceElement = videoDevice;

        return new Promise((resolve, reject) => {
            navigator.mediaDevices.enumerateDevices()
                .then((devices) => {
                    devices.find((device) => {
                        if (device.kind === 'videoinput') {
                            const option = document.createElement('option');
                            option.text = device.label || 'camera '+ (videoDeviceElement.length + 1).toString();
                            option.value = device.deviceId;

                            // 将摄像头id存储在select元素中，方便切换前、后置摄像头
                            videoDeviceElement.appendChild(option);
                        }
                    });

                    if (videoDeviceElement.length === 0) {
                        reject('没有摄像头');
                    } else {
                        videoDeviceElement.style.display = 'inline-block';

                        // 创建canvas，截取摄像头图片时使用
                        canvasElement = document.createElement('canvas');
                        canvasContext = canvasElement.getContext('2d');

                        resolve(true);
                    }
                })
                .catch((err) => {
                    reject(err);
                });
        });
    };

    /**
     * 打开摄像头
     * @param video
     * @param deviceId
     * @param setting
     * @returns {Promise}
     */
    this.openCamera = function(video, deviceId, setting) {
        videoElement = video;
        if (setting) {
            videoSetting = setting;
        }

        // 摄像头参数
        // 更多参数请查看 https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamConstraints
        const constraints = {
            audio: false,
            video: {deviceId: {exact: deviceId}}
        };

        canvasElement.setAttribute('width', videoSetting.width + 'px');
        canvasElement.setAttribute('height', videoSetting.height + 'px');

        // 如果是切换摄像头，则需要先关闭。
        if (videoElement.srcObject) {
            videoElement.srcObject.getTracks().forEach((track) => {
                track.stop();
            });
        }

        return new Promise((resolve, reject) => {
            navigator.mediaDevices.getUserMedia(constraints)
                .then((stream) => {
                    videoElement.srcObject = stream;
                    videoElement.style.display = 'block';
                    videoElement.onloadedmetadata = function(){
                        resolve(true);
                    };
                    videoElement.play();
                })
                .catch((err) => {
                    reject(err);
                });
        });
    };

    /**
     * 截取摄像头图片，返回 base64编码后的图片数据
     * @returns {string}
     */
    this.captureVideo = function() {
        canvasContext.drawImage(videoElement, 0, 0, videoSetting.width, videoSetting.height);
        return canvasElement.toDataURL('image/jpeg', 0.5).split('base64,')[1];
    };

    /**
     * 识别
     */
    this.startRecognize = function(callback) {
        timer = window.setInterval(() => {
            if (isRecognizing) return;

            isRecognizing = true;

            // 从摄像头中抓取一张图片
            const image = {image: this.captureVideo()};

            // 发送到服务器识别
            this.httpPost(recognizeUrl, image)
                .then((msg) => {
                    this.stopRecognize();

                    callback(msg);
                })
                .catch((err) => {
                    isRecognizing = false;
                    this.trace(err);
                });
        }, interval);
    };

    /**
     * 停止识别
     */
    this.stopRecognize = function() {
        if (timer) {
            window.clearInterval(timer);
            isRecognizing = false;
        }
    };

    /**
     * HTTP请求，可以使用jQuery等代替
     * @param url
     * @param image
     * @returns {Promise}
     */
    this.httpPost = function(url, image) {
        return new Promise((resolve, reject) => {
            const http = new XMLHttpRequest();
            http.onload = () => {
                try {
                    const msg = JSON.parse(http.responseText);
                    if (http.status === 200) {
                        if (msg.statusCode === 0) {
                            resolve(msg.result);
                        } else {
                            reject(msg);
                        }
                    } else {
                        reject(msg);
                    }
                } catch (err) {
                    reject(err);
                }
            };
            http.onerror = (err) => {
                reject(err);
            };

            http.open('POST', url);
            http.setRequestHeader('Content-Type', 'application/json;Charset=UTF-8');
            http.send(JSON.stringify(image))
        });
    };

    /**
     * 调用输出
     * @param arg
     */
    this.trace = function(arg) {
        if (typeof arg === 'string') {
            debug.innerHTML += arg;
        } else {
            debug.innerHTML += JSON.stringify(arg);
        }
        debug.innerHTML += '<br />';
    };

};