# Image Hosting Feature Description

Once the image hosting is configured and enabled, all images uploaded during the mind map editing process will be uploaded to the image hosting service. This significantly reduces the size of the mind map source file and speeds up both reading and saving operations.

Currently, the default integration uses PicGo software to manage the image hosting and images. PicGo is a free, open-source tool for managing image hosting services, supporting various platforms such as Alibaba Cloud and Qiniu Cloud. You can download it here: [GitHub](https://github.com/Molunerfinn/PicGo/releases).

After configuration and enabling the feature, ensure that the PicGo software is running during the mind map editing process; otherwise, uploads will fail. If you wish to use other image hosting tools, you will need to configure and test them on your own.

If an image fails to open after a successful upload, it may be due to permission issues. Please check whether the image hosting service has public access enabled.

## imgHostingResponseField Configuration Description

The interface response structure configuration is used to extract the image URL after a successful upload. The default setting is `data.result[0]`, where `data` represents the root object of the interface response data and cannot be modified. Other fields should be configured according to the structure of the interface response data. Examples are as follows:

If the image hosting interface response data structure is:

```json
{ 
    "success": true, 
    "result": ["https://example.com/image.jpg" ]
}
```

Then the interface response structure configuration should be: `data.result[0]`.

If the image hosting interface response data structure is:

```json
{ 
    "success": true, 
    "data": { 
        "url": "https://example.com/image.jpg" 
    }
}
```

Then the interface response structure configuration should be: `data.data.url`.

If the image hosting interface response data structure is:

```json
{ 
    "url": "https://example.com/image.jpg" 
}
```

Then the interface response structure configuration should be: `data.url`.

If the image hosting interface response data structure is:

```json
https://example.com/image.jpg
```

Then the interface response structure configuration should be: `data`.

If the image hosting interface response data structure is:

```json
["https://example.com/image.jpg"]
```

Then the interface response structure configuration should be: `data[0]`.