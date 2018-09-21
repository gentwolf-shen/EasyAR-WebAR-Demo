using System;
using cn.easyar.webar;

namespace WebARDemo {
    class Program {
        static void Main(string[] args) {
            string cloudKey = "<这里是云图库的Cloud Key>";
            string cloudSecret = "<这里是云图库的Cloud Secret>";
            string cloudUrl = "http://<这里是云图库的Client-end URL>/search";

            WebAR webAR = new WebAR(cloudKey, cloudSecret, cloudUrl);

            try {
                // 图片的base64数据，使用前请更换为你的图片数据
                string image = "/9j/4AAQSkZJRgA";
                ResultInfo info = webAR.Recognize(image);

                if (info.statusCode == 0) {
                    // statusCode为0时，识别到目标，数据在target中
                    System.Console.WriteLine(info.result.target.targetId);
                } else {
                    // 未识别到目标
                    System.Console.WriteLine(info.statusCode);
                    System.Console.WriteLine(info.result.message);
                }
            } catch(Exception e) {
                System.Console.WriteLine(e.Message);
            }

            System.Console.Read();
        }
    }
}
