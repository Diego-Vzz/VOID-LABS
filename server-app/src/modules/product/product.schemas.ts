import { z } from "zod";

const ModuleConfigurationSchema = z.object({
    action: z.enum(["enable", "disabled"]),
    settings: z.any(),
    conditions: z.array(z.string())
});

const ProductModuleSchema = z.object({
    module: z.string(),
    active: z.boolean(),
    configurations: z.array(ModuleConfigurationSchema)
});

export const ProductSchema = {
    Create: {
        body: z.object({
            name: z.string()
                .min(6, "Only a maximum of 250 characters and a minimum of 6 are accepted.")
                .max(250, "Only a maximum of 250 characters and a minimum of 6 are accepted."),
            caption: z.string()
                .min(6, "Only a maximum of 250 characters and a minimum of 6 are accepted.")
                .max(250, "Only a maximum of 250 characters and a minimum of 6 are accepted."),
            price: z.number(),
            features: z.string().array(),
            duration_days: z.number(),
            is_popular: z.boolean(),
            view_info_path: z.string()
                .min(6, "Only a maximum of 255 characters and a minimum of 6 are accepted.")
                .max(250, "Only a maximum of 255 characters and a minimum of 6 are accepted."),
            module: z.union([ProductModuleSchema, z.array(ProductModuleSchema)])
        })
    }
}