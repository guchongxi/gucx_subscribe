const { TOKEN } = require('./config');
const sha1 = require('sha1')

/**
 * 校验微信服务器签名
 */
module.exports.checkSignature = ({ query: { signature, timestamp, nonce } }) => {
  // 按照字典排序
  var params = [TOKEN, timestamp, nonce]
    .sort()
    .join('')

  // 连接
  var str = sha1(params);

  // 返回签名是否一致
  return str == signature;
}