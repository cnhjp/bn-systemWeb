import { App, Plugin } from 'vue'
import { ConfigProviderContext } from './config-provider'

export type PlatformApp = any

export type PlatformPlugin = any

export type SFCWithInstall<T> = T & any

export type PluginInstallFunction = (app: any, options?: ConfigProviderContext) => any