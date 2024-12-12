import JSEncrypt from 'jsencrypt'

//公钥
const publicKey =
    'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDTrVj9VrIEfXcbD4y1Tynd2nt9muQhPcEGojMDt/rOAf33oV2YZUFVirZXxeXxStFIBVJE5lFvsFSf5nhsgRV6tmVvZAIWgs6k40X9O09x2c3dDVHfChDaa2msuPJFYG1dkZuxNKFb79Q8inMD7Q4YwCBCYchJ/vIBRFIGQ9P+sQIDAQAB'

// 加密
export const encrypt = (word: any) => {
    const encryptor = new JSEncrypt()
    encryptor.setPublicKey(publicKey) // 设置公钥
    return encryptor.encrypt(word) // 对需要加密的数据进行加密
}
