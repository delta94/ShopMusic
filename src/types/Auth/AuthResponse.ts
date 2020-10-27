export interface RegisterResult {
    code: number;
    message: string;
    data: User;
}

export interface User {
    account: string;
    password: string;
    create_at: any;
    enable: boolean;
    ipAddress: any;
    info: Info;
    uuid: string;
}

export interface Info {
    fullname: string;
    bod: any;
    gender: any;
    avatar: any;
    uuid: string;
}

export interface LoginResult {
    code: number;
    message: string;
    data: LoginInReponse;
}

export interface LoginInReponse {
    jwttoken: string;
    refreshToken: any;
    user: User;
    duringTime: number;
}
