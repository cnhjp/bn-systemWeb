<script setup>

</script>

# 核心组件库

引用方式

```
import { xxx } from 'venus-core'
```

## 1. DownloadUtil

### 用法

```
DownloadUtil(data:any, filename:string, mime-type?:string)
```

### 参数

- data： 包含即将成为 File 内容的 Blob、File、String 或 dataURL。
- filename：要创建的文件的名称。请注意，较旧的浏览器（如 FF3.5、Ch5）不支持您提供的文件名，而是自动命名下载的文件。
- mime-type：要下载的文件的 MIME 内容类型。虽然是可选的，但它可以帮助浏览器向用户提供更友好的下载信息，鼓励他们接受下载。
