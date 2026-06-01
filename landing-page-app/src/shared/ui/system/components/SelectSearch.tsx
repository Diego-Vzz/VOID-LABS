"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, Check } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export interface SelectOption {
    label: string;
    value: string | number;
}

interface SelectSearchProps {
    options: SelectOption[];
    value?: string | number;
    onChange: (value: string | number) => void;
    placeholder?: string;
    disabled?: boolean;
}

export default function SelectSearch({
    options,
    value,
    onChange,
    placeholder = "Select an option...",
    disabled = false,
}: SelectSearchProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((opt) => opt.value === value);

    const filteredOptions = options.filter((opt) =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleOpen = () => {
        if (!disabled) {
            setIsOpen(!isOpen);
            setSearchTerm("");
        }
    };

    const handleSelect = (optionValue: string | number) => {
        onChange(optionValue);
        setIsOpen(false);
        setSearchTerm("");
    };

    return (
        <div className="relative w-full" ref={containerRef}>
            <div
                onClick={toggleOpen}
                className={`
                    flex items-center justify-between w-full text-sm px-3 py-2.5 
                    bg-[#0A0A0C] border rounded-lg transition-all duration-200 outline-none
                    ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} border-zinc-800 focus:bg-[#121214] focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500
                `}
            >
                <span className={`truncate ${selectedOption ? "text-white" : "text-zinc-600"}`}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown
                    className={`size-4 text-zinc-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                />
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-50 w-full mt-2 bg-[#121214] border border-zinc-800 rounded-lg shadow-xl overflow-hidden"
                    >
                        <div className="p-2 border-b border-zinc-800/50 flex items-center gap-2">
                            <Search className="size-4 text-zinc-500 ml-1" />
                            <input
                                type="text"
                                className="w-full bg-transparent text-sm text-white placeholder-zinc-600 outline-none"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>

                        <div className="max-h-48 overflow-y-auto p-1 custom-scrollbar">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((opt) => (
                                    <div
                                        key={opt.value}
                                        onClick={() => handleSelect(opt.value)}
                                        className={`
                                            flex items-center justify-between px-3 py-2 text-sm rounded-md cursor-pointer transition-colors
                                            ${value === opt.value ? "bg-zinc-800 text-white" : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"}
                                        `}
                                    >
                                        <span className="truncate">{opt.label}</span>
                                        {value === opt.value && <Check className="size-4 text-emerald-400" />}
                                    </div>
                                ))
                            ) : (
                                <div className="px-3 py-4 text-center text-sm text-zinc-500">
                                    No results found.
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
