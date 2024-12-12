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

const CLIENT_KEY = 'client_key'

export const getClientID = (): string => {
    return storage.getItem<string>(CLIENT_KEY) || ''
}
export const setClientID = (clientId: string): void => {
    storage.setItem(CLIENT_KEY, clientId)
}
export const removeClientID = (): void => {
    storage.removeItem(CLIENT_KEY)
}
