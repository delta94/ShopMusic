export interface ObjectAny {
    [key: string]: any;
}

export interface ResponseCommon<T> {
    code: number;
    message: string;
    data: T;
}
