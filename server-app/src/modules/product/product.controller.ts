import { FastifyReply, FastifyRequest } from "fastify";
import { ProductService } from "./product.service";
import { IProduct } from "./product.interface";
import { ITokenPayload } from "../auth";

class ProductControllerClass {
    public async ProductsListAll(req: FastifyRequest, reply: FastifyReply) {
        const result = await ProductService.ProductsListAll();
        return reply.code(201).send(result);
    }

    public async GetProductData(req: FastifyRequest, reply: FastifyReply) {
        const params = req.params as { id: string };
        const result = await ProductService.GetProductData(params.id);
        return reply.code(201).send(result);
    }

    public async CreateProduct(req: FastifyRequest, reply: FastifyReply) {
        const result = await ProductService.CreateProduct(
            req.body as IProduct,
            req.user as ITokenPayload
        );
        return reply.code(201).send(result);
    }
}

export const ProductController = new ProductControllerClass();