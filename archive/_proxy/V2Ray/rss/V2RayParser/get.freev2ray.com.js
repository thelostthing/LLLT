const https = require('https');
const HttpsProxyAgent = require('https-proxy-agent');
const url = require('url');
const cheerio = require('cheerio');
const ping = require('ping');
const fs = require('fs');
const path = require('path');

const config_path = '../../configs/get.freev2ray.com.{0}';
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
let options = url.parse('https://get.freev2ray.com');
https.get({...options, agent}, (resp) => {
  let data = '';
  let pings = [];
  let result = [];

  resp.on('data', chunk => {
    data += chunk;
  });

  resp.on('end', () => {
    let $ = cheerio.load(data, {decodeEntities: false});
    let info = $("#intro .content > header");
    let info_id = $(info).find('#uuid').text().trim();
    let info_port = parseInt($(info).find('#port').text().trim());
    let info_address = $(info).find('#ip').text().trim();

    pings.push(ping.promise.probe(info_address).then(res => {
      if(res.alive) {
        result.push({
          info_id, 
          info_port, 
          info_address
        });
      }
    }));

    Promise.all(pings).then(values => {
      deferred_result.resolve(result);
      // fs.writeFile(path.resolve(__dirname, './out.json'), JSON.stringify(result), () => {});
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
      template_clone.outbound.settings.vnext[0].users[0].id = config.info_id;
      template_clone.outbound.streamSettings.network = 'tcp';
      // delete template_clone.outbound.streamSettings.security;
      // delete template_clone.outbound.streamSettings.wsSettings;

      fs.writeFile(path.resolve(__dirname, config_path.replace('{0}', i+1)), JSON.stringify(template_clone), () => {});
    })
  });
})