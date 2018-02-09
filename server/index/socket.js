const {
  execSync
} = require('child_process');
var arp = require('node-arp');


exports.data_get = function() {
  const stdout = execSync('cat /var/lib/misc/dnsmasq.leases', {
    encoding: 'utf8'
  });

  var arr = []; //줄 단위로 배열 저장(마지막은 빈배열이 들어감.)
  arr = stdout.split("\n");
  var data__ = {};
  for (var i = 0; i < arr.length - 1; i++) { //2차원 배열에 data 저장
    arr[i] = arr[i].split(" ");
    var tmp = {};
    var string_num = "client_list_";
    string_num += String(i + 1);
    tmp['Expire time'] = arr[i][0];
    tmp['MAC Address'] = arr[i][1];
    tmp['IP Address'] = arr[i][2];
    tmp['Host name'] = arr[i][3];
    tmp['Client ID'] = arr[i][4];
    data__[string_num] = tmp;
  }

  return data__;
}

exports.arp_req = function(a, data__, data_key, resolve, reject) {
  arp.getMAC(data__[data_key[a]]['IP Address'], function(err, mac) {
    if (!err) {
      console.log("mac : " + mac);
      if (mac == "(incomplete)") {
        result = {
          'MAC Address': data__[data_key[a]]['MAC Address'],
          'IP Address': data__[data_key[a]]['IP Address'],
          'Host name': data__[data_key[a]]['Host name'],
          'arp': 0,
          'length': Object.keys(data__).length
        }
        resolve(result);
      } else {
        result = {
          'MAC Address': data__[data_key[a]]['MAC Address'],
          'IP Address': data__[data_key[a]]['IP Address'],
          'Host name': data__[data_key[a]]['Host name'],
          'arp': 1,
          'length': Object.keys(data__).length
        }
        reject(result);
      }

    } else {}
  });
}

exports.wait = function(msecs) {
  var start = new Date().getTime();
  var cur = start;
  while (cur - start < msecs) {
    cur = new Date().getTime();
  }
}

exports.hostname_rec = function() {
  const std_hostname = execSync('hostname -f', {
    encoding: 'utf8'
  });
  var hostname = std_hostname.split("\n");

  return hostname[0];
}

exports.eth0_ip_rec = function() {
  const text = execSync('ip a s eth0', {
    encoding: 'utf8'
  });
  var ip = text.match(/inet ([0-9.]+)/i);
  try {
    if (ip != null) {
      return ip[1];
    } else {
      throw "No IP Address Found";
    }
  } catch (e) {
    return "No IP Address Found";
  }
}

exports.eth0_mac_rec = function() {
  const text = execSync('ip a s eth0', {
    encoding: 'utf8'
  });
  var mac = text.match(/link\/ether ([0-9a-f:]+)/i);
  try {
    if (mac != null) {
      return mac[1];
    } else {
      throw "No MAC Address Found";
    }
  } catch (e) {
    return "No MAC Address Found";
  }
}

exports.wlan_whois = function() {
  var text = execSync('curl \"http://whois.kisa.or.kr/openapi/whois.jsp?query=39.119.118.152\&key=2018020617475141381350\&answer=json\"', {
    encoding: 'utf8'
  });
  text = JSON.parse(text);
  wlan_infor = {
    'IP Address': '39.119.118.152',
    'MAC Address': 'aa.aa.aa.aa.aa.aa',
    'orgName': text['whois']['english']['ISP']['netinfo']['orgName']
  }
  return wlan_infor;
}

exports.wlan_exnet_data = function() {
  /*var text = execSync('curl \"http://whois.kisa.or.kr/openapi/whois.jsp?query=39.119.118.152\&key=2018020617475141381350\&answer=json\"', {
    encoding: 'utf8'
  });
  text = JSON.parse(text);*/
  exnet = [{
      'IP Address': '1.2.3.4',
      'MAC Address': 'aa.aa.aa.aa.aa.aa',
      'Host name': 'test1'
    },
    {
      'IP Address': '11.22.33.44',
      'MAC Address': 'bb.bb.bb.bb.bb.bb',
      'Host name': 'test2'
    },
    {
      'IP Address': '11.12.13.14',
      'MAC Address': 'cc.cc.cc.cc.cc.cc',
      'Host name': 'test3'
    },
    {
      'IP Address': '110.120.130.140',
      'MAC Address': 'dd.dd.dd.dd.dd.dd',
      'Host name': 'test4'
    }
  ]
  return exnet;
}
