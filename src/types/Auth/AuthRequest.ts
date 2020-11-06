export interface RegisterRequest {
    account: string;
    password: string;
    info: Info;
}

export interface Info {
    fullname: string;
    bod?: string;
    gender?: number;
}

export interface LoginRequest {
    username: string;
    password: string;
    firebase_token?: string;
}
