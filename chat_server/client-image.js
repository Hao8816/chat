
var socket = require('socket.io-client')('http://127.0.0.1:3000');
var fs = require('fs')


var fs = require("fs")
var path = require("path")

var root = path.join(__dirname)

function readDirSync(path) {
    let imgs = []
    var pa = fs.readdirSync(path);
    pa.forEach(function (ele, index) {
        var info = fs.statSync(path + "/" + ele)
        if (info.isDirectory()) {
            console.log("dir: " + ele)
            readDirSync(path + "/" + ele);
        } else {
            console.log("file: " + ele)
            if (ele.endsWith('.jpg')) {
                imgs.push(ele)
            }
        }
    })
    return imgs
}



socket.on('connect', function(){
    console.log("系统链接成功")
    
    let imgs = readDirSync('./imgs/')
    console.log('imgs', imgs)
    sendImg()
    function sendImg () {
        if (!imgs.length) {
            return
        }
        const img = imgs.pop()
        const data = fs.readFileSync('./imgs/' + img)
        console.log('send image data', data)
        socket.emit('image', data)
        
        setTimeout(() => {
            sendImg()
        }, 10)
    }
    
    
});
socket.on('message', function(data){
    console.log("收到消息", data)
});
socket.on('disconnect', function(){});
