var express = require('express');
var router = express.Router();
var sha1 = require('sha1')
var xml2js = require('xml2js')
var axios = require('axios');

const {
  checkSignature
} = require('../utils');


/* GET main */
router.get('/', function (req, res, next) {
  // 签名成功
  if (checkSignature(req)) {
    const { echostr } = req.query;

    res.send(echostr);
  } else {
    res.send('fail');
  }
});
/* POST main */
router.post('/', function (req, res, next) {
  request(req.body, res);
});

function handler(req, res) {
  let data = {};

  xml2js.parseString(req.data, (err, json) => {
    if (err) {
      err.status = 400;
    } else {
      data = json.xml;
    }
  });

  const {
    FromUserName: [ToUserName] = [],
    ToUserName: [FromUserName] = [],
    CreateTime: [CreateTime] = [],
    MsgType: [MsgType] = [],
    Content: [Content] = [],
    MsgId: [MsgId] = []
  } = data;

  var msg = {
    toUserName,
    fromUserName,
    createTime,
    msgType,
    content,
    msgId
  };
  request(msg, req, res)
}

function request(data, res) {
  const params = {
    reqType: 0,
    perception: {
      inputText: {
        text: data.content
      }
    },
    userInfo: {
      apiKey: "6d49fe0ebf2943f3ac146a6658785ed1",
      userId: ~~(Math.random() * 99999)
    }
  }

  axios.post('http://openapi.tuling123.com/openapi/api/v2', params)
    .then(({ data: { results = [] } }) => {
      // resultType：文本(text);连接(url);音频(voice);视频(video);图片(image);图文(news)
      // values
      // 找到回复中的文本消息
      const reply = results.find(({ resultType }) => resultType === 'text')

      if (reply) {
        const { values: { text = '(⊙o⊙)哦，无法回复！' } = {} } = reply;

        data.content = text;
      }

      echo(data, res);
    })
    .catch(() => {
      echo(data, res);
    })
}
function echo(data = {}, res) {
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

  res.type('xml');
  res.send(output);
}

module.exports = router;
