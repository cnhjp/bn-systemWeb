import {UAParser} from './src/uaParser'
import {Regexes, UserAgent} from './src/types'

export const userAgent = (ua?: string, extensions?: Regexes): UserAgent => new UAParser(ua, extensions).getResult()

export * from './src/types'