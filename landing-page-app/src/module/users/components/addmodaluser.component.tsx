"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatePresence, motion } from "framer-motion";
import SelectSearch, { SelectOption } from "@/shared/ui/system/components/SelectSearch";
import { SystemRolesTuple } from "../server/users.interface";
import { Action } from "..";
import { Funcitons, TypeToast } from "@/shared/lib/functions.utils";
import ModalComponent from "@/shared/ui/system/components/modal.component";

// Opciones de ejemplo, se reemplazarán con datos de tu API
const systemRoleOptions: SelectOption[] = [
    { label: "SUPER ADMIN", value: "SUPERADMIN" },
    { label: "Bot N8N", value: "BOT_N8N" }
];

const userSchema = z.object({
    username: z.string()
        .min(4, "Must be between 4 and 16 characters.")
        .max(16, "Must be between 4 and 16 characters."),
    email: z.string()
        .email("Invalid email")
        .max(250, "Maximum 250 characters allowed."),
    password: z.string()
        .min(6, "Must be between 6 and 255 characters.")
        .max(255, "Must be between 6 and 255 characters."),
    role: z.enum(SystemRolesTuple, 'Please select a role.'),
});

type UserFormValues = z.infer<typeof userSchema>;

interface IAddModalUser {
    active: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddModalUser({ active, onClose, onSuccess }: IAddModalUser) {
    if (!active) return null;

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<UserFormValues>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            role: undefined,
        }
    });

    const onSubmit = async (form: UserFormValues) => {
        const res = await Action.Create.SystemUser(form);
        if (!res.success) {
            Funcitons.Toast({
                type: TypeToast.ERROR,
                title: "¡Attention!",
                message: res.message
            });
            return;
        }

        Funcitons.Toast({
            type: TypeToast.SUCCESS,
            title: "The user has been successfully created",
            message: "Ok!"
        });

        reset();
        onSuccess();
        onClose();
    };

    return (
        <ModalComponent
            onClose={onClose}
            header={{
                titile: "New User",
                caption: "Create a new system user profile."
            }}>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                {/* Username */}
                <div className="flex flex-col gap-1.5 group">
                    <label className="text-xs font-medium text-zinc-400 group-focus-within:text-zinc-200 transition-colors select-none">
                        Username
                    </label>
                    <input
                        {...register("username")}
                        type="text"
                        placeholder="johndoe"
                        disabled={isSubmitting}
                        className="theme-input-text"
                    />
                    <AnimatePresence>
                        {errors.username && (
                            <motion.p
                                key="username_error"
                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                animate={{ opacity: 1, height: "auto", marginTop: 4 }}
                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                className="text-xs text-red-400 overflow-hidden"
                            >
                                {errors.username.message}
                            </motion.p>
                        )}
                    </AnimatePresence>
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5 group">
                    <label className="text-xs font-medium text-zinc-400 group-focus-within:text-zinc-200 transition-colors select-none">
                        Email Address
                    </label>
                    <input
                        {...register("email")}
                        type="email"
                        placeholder="user@voidcloud.com"
                        disabled={isSubmitting}
                        className="theme-input-text"
                    />
                    <AnimatePresence>
                        {errors.email && (
                            <motion.p
                                key="email_error"
                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                animate={{ opacity: 1, height: "auto", marginTop: 4 }}
                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                className="text-xs text-red-400 overflow-hidden"
                            >
                                {errors.email.message}
                            </motion.p>
                        )}
                    </AnimatePresence>
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1.5 group">
                    <label className="text-xs font-medium text-zinc-400 group-focus-within:text-zinc-200 transition-colors select-none">
                        Password
                    </label>
                    <input
                        {...register("password")}
                        type="password"
                        placeholder="••••••••"
                        disabled={isSubmitting}
                        className="theme-input-text"
                    />
                    <AnimatePresence>
                        {errors.password && (
                            <motion.p
                                key="password_error"
                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                animate={{ opacity: 1, height: "auto", marginTop: 4 }}
                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                className="text-xs text-red-400 overflow-hidden"
                            >
                                {errors.password.message}
                            </motion.p>
                        )}
                    </AnimatePresence>
                </div>

                {/* Role (SelectSearch) */}
                <div className="flex flex-col gap-1.5 group">
                    <label className="text-xs font-medium text-zinc-400 group-focus-within:text-zinc-200 transition-colors select-none">
                        Role Assignment
                    </label>
                    <Controller
                        name="role"
                        control={control}
                        render={({ field }) => (
                            <SelectSearch
                                options={systemRoleOptions}
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Select a role..."
                                disabled={isSubmitting}
                            />
                        )}
                    />
                    <AnimatePresence>
                        {errors.role && (
                            <motion.p
                                key="role_error"
                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                animate={{ opacity: 1, height: "auto", marginTop: 4 }}
                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                className="text-xs text-red-400 overflow-hidden"
                            >
                                {errors.role.message}
                            </motion.p>
                        )}
                    </AnimatePresence>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="theme-button-submit"
                >
                    {isSubmitting ? (
                        <svg className="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        "Create User"
                    )}
                </button>
            </form>
        </ModalComponent>
    );
}