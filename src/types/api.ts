export interface ApiResponse<T> {
    result: 'SUCCESS' | string
    data: T
    title: string
    message: string
}