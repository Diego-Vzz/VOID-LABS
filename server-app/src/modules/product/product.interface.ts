export interface IProduct {
    name: string;
    caption: string;
    price: number;
    duration_days: number;
    features: string[];
    is_popular: boolean;
    view_info_path: string;
    module: IProductModules | IProductModules[];
}

export interface IProductModules {
    module: string;
    active: boolean;
    configurations: IModulesConfigurations[];
}

export interface IModulesConfigurations {
    action: "enable" | "disabled";
    settings: any;
    conditions: string[];
}