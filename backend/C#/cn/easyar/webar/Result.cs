using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace cn.easyar.webar {
    class Result {
        public string appKey { get; set; }
        public string date { get; set; }
        public string signature { get; set; }
        public string message { get; set; }
        public Target target { get; set; }
    }
}
