export interface BuyListRequest {
    totalCost: number;
    items: Item[];
}

export interface Item {
    uuid: string;
    cost: number;
    time: number;
}
