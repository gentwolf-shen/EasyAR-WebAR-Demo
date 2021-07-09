/**
 * WebAR基础类
 * 摄像头设置参数请查看： https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints
 * 如果打开摄像头后，播放视频有卡顿，请尝试设置 frameRate，height与width
 */
class WebAR {
    /**
     * 初始化Web AR
     * @param interval 识别间隔(毫秒)
     * @param recognizeUrl 识别服务地址
     * @param token 用token认证识别
     * @param container webAR运行需要的容器
     */
    constructor(interval, recognizeUrl, token, container = null) {
        this.isRecognizing = false;
        this.interval = interval;
        this.recognizeUrl = recognizeUrl;
        this.token = token;
        this.container = container || document.querySelector('#easyar');
        this.initVideo();
        this.initCanvas();
    }
    closeCamera() {
        if (this.videoElement && this.videoElement.srcObject) {
            this.videoElement.srcObject.getTracks().forEach(track => {
                console.info('stop camera');
                track.stop();
            });
        }
    }
    /**
     * 打开摄像头
     * 摄像头设置参数请查看： https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints
     * @returns {Promise<T>}
     * @param constraints
     */
    openCamera(constraints) {
        // 如果已打开摄像头，则需要先关闭。
        this.closeCamera();
        return new Promise((resolve, reject) => {
            navigator.mediaDevices.getUserMedia(constraints).then(stream => {
                this.videoElement.srcObject = stream;
                this.videoElement.style.display = 'block';
                this.videoElement.play().then(() => {
                }).catch(err => {
                    console.error(`摄像头视频绑定失败\n${err}`);
                    reject(err);
                });
                this.videoElement.onloadedmetadata = () => {
                    const cameraSize = {
                        width: this.videoElement.offsetWidth,
                        height: this.videoElement.offsetHeight
                    };
                    console.info(`camera size ${JSON.stringify(cameraSize)}`);
                    // 简单处理横/竖屏
                    if (window.innerWidth < window.innerHeight) {
                        // 竖屏
                        if (cameraSize.height < window.innerHeight) {
                            this.videoElement.setAttribute('height', `${window.innerHeight}px`);
                        }
                    }
                    else {
                        // 横屏
                        if (cameraSize.width < window.innerWidth) {
                            this.videoElement.setAttribute('width', `${window.innerWidth}px`);
                        }
                    }
                    resolve(true);
                };
            }).catch(err => {
                reject(err);
            });
        });
    }
    /**
     * 截取摄像头图片
     * @returns {string}
     */
    captureVideo() {
        this.canvasContext.drawImage(this.videoElement, 0, 0, this.videoElement.offsetWidth, this.videoElement.offsetHeight);
        return this.canvasElement.toDataURL('image/jpeg', 0.5).split('base64,')[1];
    }
    /**
     * 创建视频详情元素，播放摄像头视频流
     */
    initVideo() {
        this.videoElement = document.createElement('video');
        this.videoElement.setAttribute('playsinline', 'playsinline');
        this.container.appendChild(this.videoElement);
    }
    /**
     * 创建canvas，截取摄像头图片时使用
     */
    initCanvas() {
        this.canvasElement = document.createElement('canvas');
        this.canvasElement.setAttribute('width', `${window.innerWidth}px`);
        this.canvasElement.setAttribute('height', `${window.innerHeight}px`);
        this.canvasContext = this.canvasElement.getContext('2d');
        // document.body.appendChild(this.canvasElement);
    }
    /**
     * 识别
     * @param callback
     */
    startRecognize(callback) {
        this.timer = window.setInterval(() => {
            // 等待上一次识别结果
            if (this.isRecognizing) {
                return;
            }
            this.isRecognizing = true;
            // 从摄像头中抓取一张图片
            const image = { image: this.captureVideo(), notracking: true };
            // 发送到服务器识别
            this.httpPost(image).then((msg) => {
                this.stopRecognize();
                callback(msg);
            }).catch((err) => {
                this.isRecognizing = false;
                console.error(err);
            });
        }, this.interval);
    }
    /**
     * 停止识别
     */
    stopRecognize() {
        this.isRecognizing = false;
        if (this.timer) {
            window.clearInterval(this.timer);
        }
    }
    httpPost(data) {
        return fetch(this.recognizeUrl, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json;Charset=UTF-8',
                'Authorization': this.token
            }
        }).then(res => res.json()).then(data => {
            var _a;
            if (!data || data.statusCode != 0) {
                console.error(data);
                return Promise.reject(((_a = data === null || data === void 0 ? void 0 : data.result) === null || _a === void 0 ? void 0 : _a.message) || 'ERROR');
            }
            return Promise.resolve(data.result);
        });
    }
}
//# sourceMappingURL=webar.js.map