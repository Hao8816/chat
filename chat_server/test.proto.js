 // https://github.com/protocolbuffers/protobuf/tree/master/js
 const proto1 = require('./message_pb')
 console.log(proto1)
 const mes = new proto1.ImageData()
 console.log(mes)
 //const message = new proto.ImageData()
 mes.setName('xxxx')
 mes.setData('1111')
 const res = mes.serializeBinary()
 console.log('压缩', res)

 const ss = proto1.ImageData.deserializeBinary(res)
 console.log('名称信息', ss)

 