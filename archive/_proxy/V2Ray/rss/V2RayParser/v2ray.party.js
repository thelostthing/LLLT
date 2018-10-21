const https = require('https');
const HttpsProxyAgent = require('https-proxy-agent');
const url = require('url');
const cheerio = require('cheerio');
const ping = require('ping');
const fs = require('fs');
const path = require('path');

const config_path = '../../configs/v2ray.party.{0}';
const config_template = './template';

let deferred_result = {};
let getConfigs = new Promise((resolve, reject) => {
  deferred_result = {
    resolve,
    reject
  }
})

let proxy = process.env.http_proxy || 'http://127.0.0.1:8187';
let agent = new HttpsProxyAgent(proxy);
agent = null; // no proxy
let options = url.parse('https://v2ray.party');
https.get({...options, agent}, (resp) => {
  let data = '';
  let pings = [];
  let result = [];

  resp.on('data', chunk => {
    data += chunk;
  });

  resp.on('end', () => {
    let $ = cheerio.load(data, {decodeEntities: false});

    $('.nodes.item > ul > li').each((i, node) => {
      let title = $(node).children('p').eq(0).text();
      let info_id, info_alterId, info_network, info_security, info_path, info_port, info_address;
      
      $(node).children('p').eq(1).html().split('<br>').forEach(info => {
        let info_pair = info.trim().split(/\s*\:\s*|\s*：\s*/);
        let info_key = info_pair[0];
        let info_value = info_pair[1];

        switch(info_key.toUpperCase()) {
          case 'UUID':
            info_id = info_value;
            break;
          case 'ALTERID':
            info_alterId = +info_value;
            break;
          case 'NETWORK':
            info_network = info_value;
            break;
          case '传输安全':
            info_security = info_value;
            break;
          case 'PATH':
            info_path = info_value;
            break;
          case 'PORT':
            info_port = +info_value;
            break;
          case 'IP/地址':
            info_address = info_value;
            break;
        }
      });

      pings.push(ping.promise.probe(info_address).then(res => {
        if(res.alive) {
          result.push({
            title, 
            info_id, 
            info_alterId, 
            info_network, 
            info_security, 
            info_path, 
            info_port, 
            info_address
          });
        }
      }));
    });

    Promise.all(pings).then(values => {
      // deferred_result.resolve(result);
      fs.writeFile(path.resolve(__dirname, './out.json'), JSON.stringify(result), () => {});
    });
  });
}).on('error', err => {
  console.log('Error:', err.message);
});

getConfigs.then(value => {
  fs.readFile(path.resolve(__dirname, config_template), (err, data) => {
    let template = JSON.parse(data);
    value.forEach((config, i) => {
      let template_clone = JSON.parse(JSON.stringify(template));

      template_clone.outbound.settings.vnext[0].address = config.info_address;
      template_clone.outbound.settings.vnext[0].port = config.info_port;
      template_clone.outbound.settings.vnext[0].users[0].alterId = config.info_alterId;
      template_clone.outbound.settings.vnext[0].users[0].id = config.info_id;
      template_clone.outbound.streamSettings.network = config.info_network;
      template_clone.outbound.streamSettings.security = config.info_security;
      template_clone.outbound.streamSettings.wsSettings.path = config.info_path;

      fs.writeFile(path.resolve(__dirname, config_path.replace('{0}', i+1)), JSON.stringify(template_clone), () => {});
    })
  });
})