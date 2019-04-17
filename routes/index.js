var express = require('express');
var router = express.Router();
var xml2js = require('xml2js')
var axios = require('axios');

const {
  checkSignature
} = require('../utils');
const {
  API_KEY,
  API_HOST
} = require('../config');


/* GET main */
router.get('/', function (req, res, next) {
  // 签名成功
  if (checkSignature(req)) {
    const { echostr } = req.query;

    res.send(echostr);
  } else {
    res.send('fail~~(from test)');
  }
});
/* POST main */
router.post('/', function (req, res, next) {
  handler(req)
    .then(data => {
      res.type('xml');
      res.send(data);
    })
});

function handler(req) {
  return new Promise(resolve => {
    let buf = '';
    // 获取XML内容
    req.setEncoding('utf8');
    req.on('data', function (chunk) {
      buf += chunk;
    });
    // 内容接收完毕
    req.on('end', function () {
      xml2js.parseString(buf, function (err, json) {
        if (err) {
          err.status = 400;
        } else {
          req.body = json;
        }
      });

      let data = req.body.xml;

      const {
        FromUserName: [toUserName] = [],
        ToUserName: [fromUserName] = [],
        CreateTime: [createTime] = [],
        MsgType: [msgType] = [],
        Content: [content] = [],
        MsgId: [msgId] = []
      } = data;

      var msg = {
        toUserName,
        fromUserName,
        createTime,
        msgType,
        content,
        msgId
      };
      request(msg)
        .then(resolve)
    });
  })
}

function request(data) {
  const params = {
    reqType: 0,
    perception: {
      inputText: {
        text: data.content
      }
    },
    userInfo: {
      apiKey: API_KEY,
      // 不支持 除英文数字以外的字符
      userId: data.toUserName.replace(/[^A-Za-z0-9]/g, '')
    }
  }

  return axios.post(API_HOST, params)
    .then(({ data: { results = [] } }) => {
      // resultType：文本(text);连接(url);音频(voice);视频(video);图片(image);图文(news)
      // values
      // 找到回复中的文本消息
      const reply = results.find(({ resultType }) => resultType === 'text')

      if (reply) {
        const { values: { text = '(⊙o⊙)哦，无法回复！' } = {} } = reply;

        data.content = text;
      }
    })
    .catch(() => { })
    .then(() => echo(data))
}
function echo(data = {}) {
  const time = Math.round(new Date().getTime() / 1000);
  const { toUserName, fromUserName, msgType, content } = data;
  const output = `
  <xml>
    <ToUserName>< ![CDATA[${toUserName}] ]></ToUserName>
    <FromUserName>< ![CDATA[${fromUserName}] ]></FromUserName>
    <CreateTime>${time}</CreateTime>
    <MsgType>< ![CDATA[${msgType}] ]></MsgType>
    <Content>< ![CDATA[${content}] ]></Content>
  </xml>
  `;

  return output.replace(/ /g, '');
}

module.exports = router;
