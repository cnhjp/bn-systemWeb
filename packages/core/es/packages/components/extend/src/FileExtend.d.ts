/**
 * 是否图片
 * @param filePath 文件路径
 */
export declare function isImage(filePath: string): boolean;
/**
 * 是否视频
 * @param filePath 文件路径
 */
export declare function isVideo(filePath: string): boolean;
/**
 * 是否Word
 * @param filePath 文件路径
 */
export declare function isWord(filePath: string): boolean;
/**
 * 是否Excel
 * @param filePath 文件路径
 */
export declare function isExcel(filePath: string): boolean;
/**
 * 是否PDF
 * @param filePath 文件路径
 */
export declare function isPDF(filePath: string): boolean;
/**
 * Blob转换成Base64
 * @param blob 文件对象
 */
export declare function blobToBaseURL(blob: Blob): Promise<string | ArrayBuffer | null | undefined>;
/**
 * base64转换成Blob
 * @param dataUrl base64
 */
export declare function dataUrlToBlob(dataUrl: string): Blob;
/**
 * base64转换成File
 * @param dataUrl base64
 * @param filename 文件名称
 */
export declare function dataUrlToFile(dataUrl: string, filename: string): File;
declare const _default: any;
export default _default;
