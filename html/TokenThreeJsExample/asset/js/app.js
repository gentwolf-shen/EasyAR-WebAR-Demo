/**
 *
 * 请将第3个参数修改为你的WebAR Token
 * 如果不修改，请扫描身份证印有国徽的那一面来体验
 *
 */
const webAR = new WebAR(1000, 'https://cn1-crs.easyar.com:8443/search', 'I63ooxI48OcR9MseGyf9F3UpVoa4Seio4CtCM1k2kHD59TngdniDdS2FXAx3UWlStF+eUKVvoEJWuU2+bGgpcQ==');
const threeHelper = new ThreeHelper();

document.querySelector('#openCamera').addEventListener('click', function(){
    const videoSetting = {width: 480, height: 360};

    const video = document.querySelector('#video');
    const videoDevice = document.querySelector('#videoDevice');

    const openCamera = (video, deviceId, videoSetting) => {
        webAR.openCamera(video, deviceId, videoSetting)
            .then((msg) => {
                // 打开摄像头成功
                // 将视频铺满全屏(简单处理)
                let videoWidth = video.offsetWidth;
                let videoHeight = video.offsetHeight;

                if (window.innerWidth < window.innerHeight) {
                    // 竖屏
                    if (videoHeight < window.innerHeight) {
                        video.setAttribute('height', window.innerHeight.toString() +'px');
                    }
                }  else {
                    // 横屏
                    if (videoWidth < window.innerWidth) {
                        video.setAttribute('width', window.innerWidth.toString() +'px');
                    }
                }
            })
            .catch((err) => {
                alert(err);
                alert('打开视频设备失败');
            });
    };

    // 列出视频设备
    webAR.listCamera(videoDevice)
        .then(() => {
            openCamera(video, videoDevice.value, videoSetting);
            videoDevice.onchange = () => {
                openCamera(video, videoDevice.value, videoSetting);
            };

            document.querySelector('#openCamera').style.display = 'none';
            document.querySelector('#start').style.display = 'inline-block';
            document.querySelector('#stop').style.display = 'inline-block';
        })
        .catch((err) => {
            console.info(err);
            alert('没有可使用的视频设备');
        });
}, false);

document.querySelector('#start').addEventListener('click', () => {
    webAR.startRecognize((msg) => {
        alert('识别成功');

        // 识别成功后，从meta中取出model地址
        // const meta = JSON.parse(window.atob(msg.target.meta));
        // threeHelper.loadObject(meta.model);

        // 加载本地模型
        threeHelper.loadObject('asset/model/trex_v3.fbx');

        webAR.trace('加载模型');
    });
}, false);

document.querySelector('#stop').addEventListener('click', () => {
    webAR.stopRecognize();
}, false);
