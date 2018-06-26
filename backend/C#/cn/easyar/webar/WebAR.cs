using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;
using System.Net.Http;
using System.Net.Http.Headers;
using Newtonsoft.Json;


namespace cn.easyar.webar {
    class WebAR {
        private string cloudKey;
        private string cloudSecret;
        private string cloudUrl;

        public WebAR(string cloudKey, string cloudSecret, string cloudUrl) {
            this.cloudKey = cloudKey;
            this.cloudSecret = cloudSecret;
            this.cloudUrl = cloudUrl;
        }

        public ResultInfo Recognize(string image) {
            SortedDictionary<string, string> param = new SortedDictionary<string, string>();
            param.Add("image", image);
            param.Add("date", DateTime.UtcNow.ToString("o"));
            param.Add("appKey", this.cloudKey);
            param.Add("signature", this.getSign(param));
            
            string json = JsonConvert.SerializeObject(param);
            string str = this.send(json);

            ResultInfo resultInfo = JsonConvert.DeserializeObject<ResultInfo>(str);
            return resultInfo;
        }
        
        private string getSign(SortedDictionary<string, string> param) {
            StringBuilder builder = new StringBuilder();
            foreach (KeyValuePair<string, string> item in param) {
                builder.Append(item.Key + item.Value);
            }

            return this.sha1(builder.ToString() + this.cloudSecret);
        }

        private string sha1(string str) {
            SHA1CryptoServiceProvider sha1 = new SHA1CryptoServiceProvider();
            byte[] bytes = sha1.ComputeHash(Encoding.UTF8.GetBytes(str));

            StringBuilder builder = new StringBuilder();
            foreach (byte b in bytes) {
                builder.Append(b.ToString("x2"));
            }

            return builder.ToString();
        }

        private string send(string json) {
            string str = "";
            try {
                HttpClient client = new HttpClient();

                HttpContent content = new StringContent(json);
                content.Headers.ContentType = new MediaTypeHeaderValue("application/json");

                HttpResponseMessage obj = client.PostAsync(this.cloudUrl, content).Result;
                str = obj.Content.ReadAsStringAsync().Result;
            } catch (Exception e) {
                System.Console.WriteLine(e.Message);
            }

            return str;
        }
    }
}
