import { Path, definePrototype } from '@packages/components/core'
import { makePluginInstaller } from '@packages/utils/installer'

declare type ArrayBufferContext = {
  /**
   * 缓冲数组
   */
  arrayBuffer: Uint8Array
  /**
   * 类型字符串
   */
  mimeString: string
}

const FileTypes = {
  image: ['.jpg', '.jpeg', '.png', '.bmp', '.gif'],
  video: ['.mp4'],
  doc: ['.doc', '.docx'],
  xls: ['.xls', '.xlsx'],
  pdf: ['.pdf']
}

const getSuffix = (path: string): string =>
  Path.getSuffix(path)?.toLowerCase() || ''

/**
 * 是否图片
 * @param filePath 文件路径
 */
export function isImage(filePath: string): boolean {
  return FileTypes.image.indexOf(getSuffix(filePath)) > -1
}

/**
 * 是否视频
 * @param filePath 文件路径
 */
export function isVideo(filePath: string): boolean {
  return FileTypes.video.indexOf(getSuffix(filePath)) > -1
}

/**
 * 是否Word
 * @param filePath 文件路径
 */
export function isWord(filePath: string): boolean {
  return FileTypes.doc.indexOf(getSuffix(filePath)) > -1
}

/**
 * 是否Excel
 * @param filePath 文件路径
 */
export function isExcel(filePath: string): boolean {
  return FileTypes.xls.indexOf(getSuffix(filePath)) > -1
}

/**
 * 是否PDF
 * @param filePath 文件路径
 */
export function isPDF(filePath: string): boolean {
  return FileTypes.pdf.indexOf(getSuffix(filePath)) > -1
}

/**
 * Blob转换成Base64
 * @param blob 文件对象
 */
export function blobToBaseURL(
  blob: Blob
): Promise<string | ArrayBuffer | null | undefined> {
  return new Promise((resolve, reject) => {
    if ('FileReader' in window) {
      let reader = new FileReader()
      reader.onload = function(evt) {
        resolve(evt.target?.result)
      }
      reader.readAsDataURL(blob)
    } else {
      reject(new Error('FileReader对象不存在！'))
    }
  })
}

/**
 * base64转换成缓冲数组
 * @param dataUrl base64
 */
function dataUrlToArrayBuffer(dataUrl: string): ArrayBufferContext {
  let dataArray: string[] = dataUrl.split(',')
  let mimeString: string = (dataArray[0].match(/:(.*?);/) || [])[1] // mime类型
  let byteString: string = atob(dataArray[1]) // base64解码
  let byteLength: number = byteString.length // 数组长度
  let arrayBuffer: Uint8Array = new Uint8Array(byteLength) // 缓冲数组
  while (byteLength--) {
    arrayBuffer[byteLength] = byteString.charCodeAt(byteLength)
  }
  return { arrayBuffer, mimeString }
}

/**
 * base64转换成Blob
 * @param dataUrl base64
 */
export function dataUrlToBlob(dataUrl: string) {
  const result = dataUrlToArrayBuffer(dataUrl)
  return new Blob([result.arrayBuffer], { type: result.mimeString })
}

/**
 * base64转换成File
 * @param dataUrl base64
 * @param filename 文件名称
 */
export function dataUrlToFile(dataUrl: string, filename: string) {
  const result = dataUrlToArrayBuffer(dataUrl)
  return new File([result.arrayBuffer], filename, { type: result.mimeString })
}

export default makePluginInstaller(() => {
  ;(<any>File).isImage = isImage
  ;(<any>File).isVideo = isVideo
  ;(<any>File).isWord = isWord
  ;(<any>File).isExcel = isExcel
  ;(<any>File).isPDF = isPDF
  ;(<any>File).blobToBaseURL = blobToBaseURL
  ;(<any>File).dataUrlToBlob = dataUrlToBlob
  ;(<any>File).dataUrlToFile = dataUrlToFile
  definePrototype(File, 'isImage', (file: File) => isImage(file.name))
  definePrototype(File, 'isVideo', (file: File) => isVideo(file.name))
  definePrototype(File, 'isWord', (file: File) => isWord(file.name))
  definePrototype(File, 'isExcel', (file: File) => isExcel(file.name))
  definePrototype(File, 'isPDF', (file: File) => isPDF(file.name))
  definePrototype(File, 'toBaseURL', (file: File) => blobToBaseURL(file))
})
