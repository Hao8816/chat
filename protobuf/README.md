### proto文件定义
默认编译的时候默认使用proto2的语法，如果想使用proto3的语法，需要在文件头部申明
```
syntax = "proto3";

message SearchRequest {
  string query = 1;
  int32 page_number = 2;
  int32 result_per_page = 3;
}
```
### proto文件编译
```
// 输出闭包
protoc --js_out=library=myproto_libs,binary:. message.proto

// 输出commonjs的包
protoc --js_out=import_style=commonjs,binary:. message.proto
```
