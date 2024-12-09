import { PlatformApp, PlatformPlugin, PluginInstallFunction, SFCWithInstall } from '@packages/tokens/platform'
import { ConfigProviderContext } from '@packages/tokens/config-provider'

const INSTALLED_KEY = Symbol('INSTALLED_KEY')

export const makeInstaller = (components: PlatformPlugin[] = []) => {
  const install: PluginInstallFunction = (app: PlatformApp, options?: ConfigProviderContext) => {
    if ((app as any)[INSTALLED_KEY]) return
    (app as any)[INSTALLED_KEY] = true

    components.forEach((c) => app.use(c))
  }

  return {
    version: '0.1.0',
    install
  }
}

export const makeCompInstaller = <T, E extends Record<string, any>>(main: T, extra?: E) => {
  (main as SFCWithInstall<T>).install = (app: PlatformApp): void => {
    for (const comp of [main, ...Object.values(extra ?? {})]) {
      app.component(comp.name, comp)
    }
  }

  if (extra) {
    for (const [key, comp] of Object.entries(extra)) {
      (main as any)[key] = comp
    }
  }

  return main as SFCWithInstall<T> & E
}

export const makePluginInstaller = (install: PluginInstallFunction): PlatformPlugin => ({
  install
})
