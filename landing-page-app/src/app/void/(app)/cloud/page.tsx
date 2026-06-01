"use client";

import AutoClicker from "@/shared/ui/void/components/AutoClicker";

export default function Cloud() {
    const options = [
        { id: crypto.randomUUID(), text: "Combat", selected: false },
        { id: crypto.randomUUID(), text: "Movement", selected: false },
        { id: crypto.randomUUID(), text: "Inventory", selected: false },
        { id: crypto.randomUUID(), text: "Visuals", selected: false },
        { id: crypto.randomUUID(), text: "System", selected: false },
    ];
    return (
        <section className="flex xl:flex-row flex-col size-full overflow-auto xl:items-center gap-1">
            <div className="max-xl:justify-around flex flex-row xl:flex-col w-full xl:max-w-[189px] h-[60px] xl:h-[680px] gap-1 bg-[#18181B] rounded-[12px] p-2 xl:px-0 xl:py-4 overflow-auto">
                {options.map((item) => {
                    const IsActive: boolean = false;

                    return (
                        <button key={item.id}
                            className={
                                `flex items-center justify-start p-2 xl:p-4 ${IsActive && 'text-white'} relative transition-all duration-200`
                            }>
                            <span className="translate-y-px">
                                {item.text}
                            </span>

                            {IsActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-[22px] bg-indigo-500" />
                            )}
                        </button>
                    )
                })}
            </div>
            <div className="flex flex-col xl:grid xl:grid-cols-2 w-full h-[680px] gap-2.5 bg-[#18181B] rounded-[12px] p-4 xl:p-8 overflow-y-auto overflow-x-hidden">
                <AutoClicker />
            </div>
        </section>
    );
}
