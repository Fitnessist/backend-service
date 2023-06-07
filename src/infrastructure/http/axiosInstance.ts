import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios"

export function createAxiosInstance (baseURL: string): AxiosInstance {
    const config: AxiosRequestConfig = {
        baseURL,
        timeout: 9000,
        headers: {
            "Content-Type": "application/json"
        }
    }

    const instance: AxiosInstance = axios.create(config)

    // Di sini, Anda dapat menambahkan pengaturan lainnya seperti interceptors, dll.

    return instance
}
