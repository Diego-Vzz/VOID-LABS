import { FastifyInstance } from "fastify";
import { ProductController } from "./product.controller";
import { ProductSchema } from "./product.schemas";
import authenticate from "@/middlewares/auth.middleware";

class ProductRoutesClass {
    private readonly PREFIX: string = "/product";

    public async Routes(fastify: FastifyInstance) {
        fastify.get(
            `${this.PREFIX}/`,
            Config.GetProduct,
            ProductController.ProductsListAll
        );

        fastify.get(
            `${this.PREFIX}/:id`,
            Config.GetProduct,
            ProductController.GetProductData
        );

        fastify.post(
            `${this.PREFIX}/create`,
            Config.CreateProduct,
            ProductController.CreateProduct
        );
    }
}

class Config {
    public static GetProduct = {
        onRequest: [authenticate]
    }
    public static CreateProduct = {
        schema: ProductSchema.Create,
        onRequest: [authenticate],
        config: {
            rateLimit: {
                max: 5,
                timeWindow: "1 hour",
            },
        },
    }
}

export const ProductRoutes = new ProductRoutesClass();