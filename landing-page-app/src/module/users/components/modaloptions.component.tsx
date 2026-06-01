"use client";

import ModalComponent from "@/shared/ui/system/components/modal.component";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AnimatePresence, motion } from "framer-motion";
import { Ban, Loader, Pencil, ShieldAlert, Trash } from "lucide-react";

const banUserSchema = z.object({
    ban_reason: z.string()
        .min(4, "Must be between 4 and 255 characters.")
        .max(16, "Must be between 4 and 255 characters.")
});

type banUserFormValues = z.infer<typeof banUserSchema>;

interface IModalOptionsComponent {
    active: boolean;
    user_selected: string;
    role: string;
    banned: boolean;
    onClose: () => void;
}

export default function ModalOptionsComponent(
    { active, onClose, user_selected, role, banned }: IModalOptionsComponent
) {
    if (!active) return null;

    const isUser: boolean = role === "USER";

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<banUserFormValues>({
        resolver: zodResolver(banUserSchema),
        defaultValues: {
            ban_reason: ""
        }
    });

    const onBanUser = async (form: banUserFormValues) => {
        reset();
    }

    return (
        <ModalComponent header={{
            titile: `User options (${user_selected})`,
            caption: `List of options to perform an action on the user`
        }} onClose={onClose}>
            {isUser &&
                (!banned ?
                    <form onSubmit={handleSubmit(onBanUser)}
                        className="flex flex-col gap-3 p-4 rounded-sm bg-black/10">
                        <div className="flex flex-col gap-1.5 group w-full">
                            <label className="text-xs font-medium text-zinc-400 group-focus-within:text-zinc-200 transition-colors select-none">
                                Reason
                            </label>
                            <input
                                {...register("ban_reason")}
                                type="text"
                                disabled={isSubmitting}
                                className="theme-input-text"
                            />
                            <AnimatePresence>
                                {errors.ban_reason && (
                                    <motion.p
                                        key="ban_reason_error"
                                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                        animate={{ opacity: 1, height: "auto", marginTop: 4 }}
                                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                        className="text-xs text-red-400 overflow-hidden"
                                    >
                                        {errors.ban_reason.message}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="theme-button-submit gap-2"
                        >
                            {isSubmitting ? (
                                <Loader className="animate-spin h-4 w-4 stroke-indigo-400" />
                            ) : (
                                <>
                                    <Ban className="size-4" /> Ban user
                                </>
                            )}
                        </button>
                    </form> :
                    <form onSubmit={handleSubmit(onBanUser)}
                        className="flex flex-col gap-3 p-4 rounded-sm bg-black/10">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="theme-button-submit gap-2"
                        >
                            {isSubmitting ? (
                                <Loader className="animate-spin h-4 w-4 stroke-indigo-400" />
                            ) : (
                                <>
                                    <ShieldAlert className="size-4" /> Unban user
                                </>
                            )}
                        </button>
                    </form>)}
            <div className="flex flex-col gap-3 p-4 rounded-sm bg-black/10">
                <label className="text-xs font-medium text-zinc-400 group-focus-within:text-zinc-200 transition-colors select-none">
                    Actions
                </label>
                <button className="transition-colors duration-200 cursor-pointer rounded-lg text-sm text-red-500 w-full px-4 py-3 bg-red-500/10 hover:bg-red-500/20">
                    Delete user
                </button>
                <button className="transition-colors duration-200 cursor-pointer rounded-lg text-sm text-blue-500 w-full py-2.5 bg-blue-500/10 hover:bg-blue-500/20">
                    Edit user
                </button>
            </div>
        </ModalComponent>
    );
}