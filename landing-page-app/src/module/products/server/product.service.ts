import { ApiService } from "@/shared/services/api";
import { IProductsListAll } from "./product.interface";


class ProductServiceClass {
    private readonly PREFIX: string = "/product";

    public async ProductsListAll() {
        return await ApiService.Request<IProductsListAll[]>({
            method: "GET",
            endpoint: `${this.PREFIX}/`
        });
    }
}

export const ProductService = new ProductServiceClass();