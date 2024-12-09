import { PlatformPlugin, PluginInstallFunction } from '../tokens/platform';
export declare const makeInstaller: (components?: PlatformPlugin[]) => {
    version: string;
    install: PluginInstallFunction;
};
export declare const makeCompInstaller: <T, E extends Record<string, any>>(main: T, extra?: E | undefined) => any;
export declare const makePluginInstaller: (install: PluginInstallFunction) => PlatformPlugin;
