const fs = require('fs')
const proto = require('./message_pb');

const message = new proto.SearchResponse();

message.setId(1)
message.setName('vaster')
message.setEmail('15238228816@163.com')
console.log(message)

const bytes = message.serializeBinary()
console.log(bytes)

const json = {
  id: 1,
  name: 'vaster',
  email: '15238228816@163.com'
}
fs.writeFile('m.proto', bytes, (err) => {
  if (err) throw err;
  console.log('文件已保存');
});

fs.writeFile('m.json', JSON.stringify(json), (err) => {
  if (err) throw err;
  console.log('文件已保存');
});
