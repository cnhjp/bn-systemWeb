import { LocalStore, type StorageConfig } from '@/utils'

export enum StorageMode {
    Local = 'local',
    Session = 'session',
    Cookies = 'cookies',
}

export function useStorage(mode: StorageMode = StorageMode.Local, config?: StorageConfig) {
    if (mode === StorageMode.Local) return new LocalStore({ expires: 60 * 60, ...config })
    if (mode === StorageMode.Session) return new LocalStore({ expires: 0, ...config })
    if (mode === StorageMode.Cookies) return new LocalStore({ expires: 60 * 60 * 24 * 7, ...config })
    return new LocalStore({ expires: 0, ...config })
}
