export type TProductStatus = "WORKING" | "UPDATING" | "DETECTED";

export interface IProductsListAll {
    id: string;
    name: string;
    caption: string;
    price: number;
    status: TProductStatus;
    features: JSON;
    duration_days: number;
    is_popular: boolean;
    view_info_path: string;
    has_modules: number;
    has_subscriptions: number;
}