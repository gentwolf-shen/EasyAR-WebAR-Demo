class App {
    constructor() {
        // 摄像头设置参数请查看： https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints
        // 预置打开摄像头的参数
        this.cameras = [
            { label: '默认摄像头', value: { audio: false, video: true } },
            { label: '前置摄像头', value: { audio: false, video: { facingMode: { exact: 'user' } } } },
            { label: '后置摄像头', value: { audio: false, video: { facingMode: { exact: 'environment' } } } }
        ];
        // 识别成功后的回调
        this.callback = null;
        this.listCamera();
        this.initEvent();
    }
    /**
     * 初始化WebAR对象
     * @param token 认证token
     */
    setToken(token) {
        this.webAR = new WebAR(1000, 'https://cn1-crs.easyar.com:8443/search', token, document.querySelector('#easyAR'));
    }
    /**
     * 使用集成方法初始化WebAR对象
     */
    useEasyAr() {
        // expire：有效期（秒）
        fetch('/webar/token?expire=86400', {
            method: 'POST',
        }).then(res => res.json()).then(data => {
            return data.statusCode === 0 ? Promise.resolve(data) : Promise.reject(data.result);
        }).catch(err => {
            console.info(err);
            alert(`获取token失败\n${err}`);
        }).then(data => {
            this.setToken(data.result.token);
        });
    }
    /**
     * 使用预置参数列出打开摄像头的参数
     */
    listCamera() {
        this.cameraElement = document.querySelector('#videoDevice');
        this.cameras.forEach((item, index) => this.cameraElement.appendChild(new Option(item.label, `${index}`)));
    }
    show(target) {
        document.querySelector(`#${target}`).classList.remove('none');
    }
    hide(target) {
        document.querySelector(`#${target}`).classList.add('none');
    }
    /**
     * 尝试打开摄像头
     * @param p 摄像头参数
     */
    openCamera(p) {
        this.stopRecognize();
        this.webAR.openCamera(p).then(() => {
            this.show('start');
        }).catch(err => {
            console.error(err);
            alert(`摄像头打开失败\n${err}`);
        });
    }
    initEvent() {
        // 打开设备上的摄像头
        document.querySelector('#openCamera').addEventListener('click', () => {
            this.openCamera(this.cameras[this.cameraElement.value].value);
        });
        // 开启识别
        document.querySelector('#start').addEventListener('click', () => {
            // todo: 清除已渲染的内容(视业务需求)
            this.show('scanLine');
            this.hide('start');
            this.show('stop');
            this.webAR.startRecognize((msg) => {
                this.stopRecognize();
                this.show('start');
                if (this.callback) {
                    this.callback(msg);
                }
            });
        }, false);
        // 暂停识别
        document.querySelector('#stop').addEventListener('click', () => {
            this.stopRecognize();
            this.show('start');
        }, false);
    }
    stopRecognize() {
        this.hide('scanLine');
        this.hide('stop');
        this.webAR.stopRecognize();
    }
}
//# sourceMappingURL=app.js.map