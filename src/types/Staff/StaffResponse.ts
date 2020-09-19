export interface StaffResponse {
    meta: Meta;
    result: Staff[];
    status: string;
}

export interface Meta {
    has_next: boolean;
    total_count: number;
    page_count: number;
    page_size: number;
    page_id: number;
    off_set: number;
}

export interface Staff {
    id: number;
    code?: string;
    image_url?: string;
    full_name: string;
    gender: string;
    status: string;
    manager_id?: string;
    birthday?: string;
    marital_status?: string;
    birth_place?: string;
    home_address?: string;
    live_address?: string;
    bhxh_code?: string;
    bhyt_code?: string;
    tax_code?: string;
    bank_code?: string;
    identity_code?: string;
    identity_time?: string;
    identity_place?: string;
    phone?: string;
    email?: string;
    skype?: string;
    start_to_work_time?: string;
    official_working_time?: string;
    estimated_contract_time?: string;
    bhxh_paying_start_time?: string;
    create_time?: string;
    update_time?: string;
    note?: string;
    remember_token: any;
    demit_time?: string;
    is_marketing: string;
    office?: string;
    departments: Department[];
    managements?: Managements;
}

export interface Department {
    id: number;
    name: string;
    parent_id: string;
    manager_id: string;
    staff_qtty: string;
    description?: string;
    create_time: string;
    update_time: string;
    company_id?: string;
    pivot: Pivot;
}

export interface Pivot {
    staff_id: string;
    department_id: string;
}

export interface Managements {
    id: number;
    code: string;
    image_url?: string;
    full_name: string;
    gender: string;
    status: string;
    manager_id: string;
    birthday: string;
    marital_status: string;
    birth_place?: string;
    home_address?: string;
    live_address?: string;
    bhxh_code?: string;
    bhyt_code?: string;
    tax_code?: string;
    bank_code?: string;
    identity_code: string;
    identity_time?: string;
    identity_place?: string;
    phone: string;
    email: string;
    skype?: string;
    start_to_work_time?: string;
    official_working_time?: string;
    estimated_contract_time?: string;
    bhxh_paying_start_time?: string;
    create_time?: string;
    update_time?: string;
    note?: string;
    remember_token: any;
    demit_time?: string;
    is_marketing: string;
    office?: string;
}
