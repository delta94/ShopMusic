export interface SigninResponse {
    status: string;
    access_token: string;
    user: User;
    roles: Role[];
}

export interface User {
    id: number;
    username: string;
    type: string;
    first_name: any;
    last_name: any;
    email: string;
    status: string;
    address: any;
    phone: any;
    birthday: any;
    role_id: any;
    gender: any;
    code: string;
    full_name: string;
    active_time: string;
    location_id: any;
    ndepartments: Ndepartment[];
    departments: Department[];
}

export interface Ndepartment {
    id: number;
    staff_id: string;
    department_id: string;
    create_time: string;
    update_time: any;
}

export interface Department {
    id: number;
    name: string;
    parent_id: string;
    manager_id: string;
    staff_qtty: string;
    description: string;
    create_time: string;
    update_time: string;
    company_id: string;
    pivot: Pivot;
}

export interface Pivot {
    staff_id: string;
    department_id: string;
}

export interface Role {
    id: string;
    name: string;
}
