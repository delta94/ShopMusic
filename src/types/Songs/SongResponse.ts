export interface SongResponse {
    code: number;
    message: string;
    data: SongResult;
}

export interface SongResult {
    content: Song[];
    pageable: Pageable;
    last: boolean;
    totalPages: number;
    totalElements: number;
    sort: Sort2;
    numberOfElements: number;
    first: boolean;
    size: number;
    number: number;
    empty: boolean;
}

export interface Song {
    title: string;
    description: string;
    slug: string;
    parent: any;
    category: string;
    author: string;
    fileUuid: any;
    thumb: any;
    time: number;
    status: number;
    type: number;
    cost: number;
    createAt: string;
    publishAt: string;
    uuid: string;
}

export interface Pageable {
    sort: Sort;
    pageNumber: number;
    pageSize: number;
    offset: number;
    paged: boolean;
    unpaged: boolean;
}

export interface Sort {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
}

export interface Sort2 {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
}

export interface Demo {
    id: number;
    name: string;
    description: string;
    path: string;
    song_id: number;
    created_at: any;
    updated_at: any;
    deleted_at: any;
}
