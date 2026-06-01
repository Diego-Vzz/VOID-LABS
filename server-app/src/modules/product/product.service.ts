import prisma from "@/shared/database/prisma";
import { AppError } from "@/shared/utils/app-error.utils";
import { IProduct } from "./product.interface";
import { ITokenPayload } from "../auth";
import { AuditService, IAudit } from "../audit";

class ProductServiceClass {
    public async ProductsListAll() {
        const data = await prisma.void_products.findMany({
            select: {
                id: true,
                name: true,
                caption: true,
                price: true,
                status: true,
                features: true,
                duration_days: true,
                is_popular: true,
                view_info_path: true,
                _count: {
                    select: {
                        modules: true,
                        subscriptions: true
                    }
                },
            }
        });

        const products_data = data.map(item => {
            return {
                id: item.id,
                name: item.name,
                caption: item.caption,
                price: item.price,
                status: item.status,
                features: item.features,
                duration_days: item.duration_days,
                is_popular: item.is_popular,
                view_info_path: item.view_info_path,
                has_modules: item._count.modules > 0,
                has_subscriptions: item._count.subscriptions > 0
            }
        });

        return products_data;
    }

    public async GetProductData(id: string) {
        const data = await prisma.void_products.findUnique({
            where: { id: id }
        });
        return { product: data }
    }

    public async CreateProduct(params: IProduct, user: ITokenPayload) {
        return await prisma.$transaction(async (db) => {
            const exists = await db.void_products.findFirst({
                where: { name: params.name },
                select: { id: true }
            });

            if (exists) {
                throw new AppError("Product already exists", 409, `The product '${params.name}' is already registered.`);
            }

            const modulesArray = params.module ? (Array.isArray(params.module) ? params.module : [params.module]) : [];

            const mappedModules = modulesArray.map(m => ({
                module: {
                    create: {
                        module: m.module,
                        active: m.active ?? true,
                        configurations: {
                            create: m.configurations || []
                        }
                    }
                }
            }));

            const product = await db.void_products.create({
                data: {
                    name: params.name,
                    caption: params.caption,
                    price: params.price,
                    duration_days: params.duration_days,
                    features: params.features,
                    is_popular: params.is_popular,
                    view_info_path: params.view_info_path,
                    ...(mappedModules.length > 0 && {
                        modules: {
                            create: mappedModules
                        }
                    })
                }
            });

            const audit: IAudit = {
                user_id: user.id,
                action: `CREATED PRODUCT '${product.name}'`
            }

            await AuditService.AuditLog(audit);
        });
    }
}

export const ProductService = new ProductServiceClass();