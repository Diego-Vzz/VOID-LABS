"use client";

import { X } from "lucide-react";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface IModalComponent {
    header: {
        titile: string;
        caption: string;
    };
    children: ReactNode;
    onClose: () => void;
}

export default function ModalComponent({
    header,
    onClose,
    children
}: IModalComponent) {
    return (
        <div className="size-full fixed top-0 left-0 bg-black/60 z-50 transition-all duration-300 flex justify-center items-center px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md bg-[#0A0A0C] border border-zinc-800 rounded-xl relative flex flex-col"
            >
                <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800/50">
                    <div>
                        <h2 className="text-lg font-semibold text-white tracking-tight">
                            {header.titile}
                        </h2>
                        <p className="text-xs text-zinc-400 mt-1">
                            {header.caption}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-colors outline-none"
                    >
                        <X className="size-5" />
                    </button>
                </div>
                <div className="flex flex-col gap-5 p-6 max-h-[80vh] overflow-y-auto">
                    {children}
                </div>
            </motion.div>
        </div>
    );
}