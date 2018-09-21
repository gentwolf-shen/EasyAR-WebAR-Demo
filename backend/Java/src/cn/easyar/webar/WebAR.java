package cn.easyar.webar;

import com.fasterxml.jackson.databind.ObjectMapper;
import okhttp3.*;

import java.io.IOException;
import java.security.MessageDigest;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.SortedMap;
import java.util.TreeMap;

public class WebAR {
    private String cloudKey;
    private String cloudSecret;
    private String cloudUrl;

    private OkHttpClient http;

    public WebAR(String cloudKey, String cloudSecret, String cloudUrl) {
        this.cloudKey = cloudKey;
        this.cloudSecret = cloudSecret;
        this.cloudUrl = cloudUrl;

        this.http = new OkHttpClient();
    }

    /**
     * 将图片数据签名，并发送到识别服务器
     * @param image 图片的base64数据
     * @return
     * @throws IOException
     */
    public ResultInfo recognize(String image) throws IOException {
        SortedMap<String, String> params = new TreeMap<>();
        params.put("image", image);
        params.put("timestamp", String.valueOf(System.currentTimeMillis()));
        params.put("appKey", this.cloudKey);
        params.put("signature", this.getSign(params));

        ObjectMapper mapper = new ObjectMapper();
        String str = mapper.writeValueAsString(params);

        return mapper.readValue(this.send(str), ResultInfo.class);
    }

    private String getSign(SortedMap<String, String> params) {
        StringBuilder builder = new StringBuilder();
        params.forEach((key, value) -> builder.append(key + value));

        return this.sha256(builder.toString() + this.cloudSecret);
    }

    private String sha256(String str) {
        StringBuilder builder = new StringBuilder();
        try {
            MessageDigest digest = MessageDigest.getInstance("sha-256");
            digest.update(str.getBytes());
            byte[] bytes = digest.digest();

            for (byte b: bytes) {
                String hex = Integer.toHexString(b & 0XFF);
                builder.append(hex.length() == 1 ? "0" + hex : hex);
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }

        return builder.toString();
    }

    private String getUtcDate() {
        return ZonedDateTime.now(ZoneOffset.UTC).format(DateTimeFormatter.ISO_INSTANT);
    }

    private byte[] send(String json) throws IOException {
        RequestBody body = RequestBody.create(MediaType.parse("application/json; charset=utf-8"), json);
        Request request = new Request.Builder()
                .url(this.cloudUrl)
                .post(body)
                .build();

        try (Response response = this.http.newCall(request).execute()) {
            return response.body().bytes();
        }
    }
}
