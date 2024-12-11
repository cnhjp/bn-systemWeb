import { useStorage } from '@/hooks'

const storage = useStorage()

const TOKEN_KEY = 'token_key'

export const getToken = (): string => {
    return storage.getItem<string>(TOKEN_KEY) || ''
}
export const setToken = (token: string): void => {
    storage.setItem(TOKEN_KEY, token)
}
export const removeToken = (): void => {
    storage.removeItem(TOKEN_KEY)
}
