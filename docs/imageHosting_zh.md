# 图床功能说明

设置了图床并开启后，在思维导图编辑过程中上传的所有图片都会上传到图床，可显著减小思维导图源文件体积，加快读取和保存的速度。

目前默认适配的是PicGo软件来管理图床和图片，PicGo是一个免费、开源的图床管理工具，支持多种图床，如阿里云、七牛云等。可点击这里进行下载：[GitHub](https://github.com/Molunerfinn/PicGo/releases)。

配置完成并开启使用后，在编辑思维导图的过程中需确保PicGo软件正在运行，否则无法上传。如果你想要使用其他图床工具，需要自行配置和测试。

上传成功后图片却打开，可能是权限问题，需检查图床是否开启了公开访问权限。

## imgHostingResponseField配置说明

接口响应结构配置用于提取上传成功后的图片URL，默认是`data.result[0]`，`data`代表接口响应数据的根对象，不可修改。其他字段需根据接口响应数据的结构进行配置。示例如下：

如果图床接口响应数据的结构为：

```json
{ 
    "success": true, 
    "result": ["https://example.com/image.jpg" ]
}
```

则接口响应结构配置为：`data.result[0]`。

如果图床接口响应数据的结构为：

```json
{ 
    "success": true, 
    "data": { 
        "url": "https://example.com/image.jpg" 
    }
}
```

则接口响应结构配置为：`data.data.url`。

如果图床接口响应数据的结构为：

```json
{ 
    "url": "https://example.com/image.jpg" 
}
```

则接口响应结构配置为：`data.url`。

如果图床接口响应数据的结构为：

```json
https://example.com/image.jpg
```

则接口响应结构配置为：`data`。

图床接口响应数据的结构为：

```json
["https://example.com/image.jpg"]
```

则接口响应结构配置为：`data[0]`。