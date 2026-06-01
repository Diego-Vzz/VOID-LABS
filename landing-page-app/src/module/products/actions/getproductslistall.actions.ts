"use server";

import { ProductService } from "../server/product.service";

export const ProductData = async () => {
    return await ProductService.ProductsListAll();
}