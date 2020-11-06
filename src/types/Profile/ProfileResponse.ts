import { Info, User } from 'types/Auth/AuthResponse';

export interface ChangeAvatarResponse {
    code: number;
    message: string;
    data: string;
}

export interface UserInfoResponse {
    code: number;
    message: string;
    data: Info;
}

export interface ChangePasswordResponse {
    code: number;
    message: string;
    data: User;
}
