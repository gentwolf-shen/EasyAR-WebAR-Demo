import cn.easyar.webar.ResultInfo;
import cn.easyar.webar.WebAR;


public class Main {

    public static void main(String[] args) {
        String cloudKey = "<这里是云图库的Cloud Key>";
        String cloudSecret = "<这里是云图库的Cloud Secret>";
        String cloudUrl = "http://<这里是云图库的Client-end URL>/search";

        WebAR webAR = new WebAR(cloudKey, cloudSecret, cloudUrl);

        try {
            // 图片的base64数据，使用前请更换为你的图片数据
            String image = "/9j/4AAQSkZJRgA";
            ResultInfo info = webAR.recognize(image);

            if (info.getStatusCode() == 0) {
                // statusCode为0时，识别到目标，数据在target中
                System.out.println(info.getResult().getTarget().getTargetId());
            } else {
                // 未识别到目标
                System.out.println(info.getStatusCode());
                System.out.println(info.getResult().getMessage());
            }

        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }
}
