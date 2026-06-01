"use client";

import { LayoutDashboard, Logs, Menu, ShoppingCart, Ticket, User } from "lucide-react";
import { usePathname, useRouter } from 'next/navigation';

const iconMap = {
    LayoutDashboard,
    ShoppingCart,
    Ticket,
    Logs,
    User
}

type IconName = keyof typeof iconMap;

export default function NavegationBar() {
    const pathname = usePathname();
    const router = useRouter();

    const PREFIX_NAVEGATION: string = "/system";
    const options = [
        { id: crypto.randomUUID(), icono: "LayoutDashboard", text: "Dashboard", path: `${PREFIX_NAVEGATION}/dashboard` },
        { id: crypto.randomUUID(), icono: "ShoppingCart", text: "Products", path: `${PREFIX_NAVEGATION}/products` },
        { id: crypto.randomUUID(), icono: "User", text: "Users", path: `${PREFIX_NAVEGATION}/users` },
        { id: crypto.randomUUID(), icono: "Ticket", text: "Tickets", path: `${PREFIX_NAVEGATION}/tickets` },
        { id: crypto.randomUUID(), icono: "Logs", text: "Logs", path: `${PREFIX_NAVEGATION}/logs` },
    ];

    const handleNavigation = (path: string) => {
        router.push(path);
    };
    return (
        <>
            <nav className="flex h-auto items-center justify-between lg:h-full lg:flex-col lg:items-start lg:justify-start p-2 lg:p-4 gap-4 overflow-auto bg-[#18181B] rounded-xl">
                <div className="flex flex-row w-full h-[60px] gap-4 items-center lg:justify-center lg:h-[80px]">
                    <button className='size-[24px] inline lg:hidden'>
                        <Menu className='size-full' />
                    </button>
                    <span className='translate-y-px text-[18px]'>
                        VOID SYSTEM
                    </span>
                </div>

                <div className='lg:flex flex-col gap-4 size-full text-[clamp(12px,3vw,16px)] hidden'>
                    <div className='flex flex-row w-full items-center gap-2'>
                        <span className='text-[#90A1B9]/45'>
                            Options
                        </span>
                        <hr className='w-full text-[#90A1B9]/45' />
                    </div>

                    {options.map((item) => {
                        const IconComponent = iconMap[item.icono as IconName];
                        const isActive = pathname === item.path || pathname.startsWith(item.path);

                        return (
                            <button
                                key={item.id}
                                onClick={() => { handleNavigation(item.path) }}
                                className={`flex items-center justify-start p-4 gap-2.5 rounded-[12px]  transition-all duration-200 group relative overflow-hidden 
                                    ${isActive ? 'bg-indigo-500/10 text-indigo-400' : 'hover:bg-white/5 hover:text-white'} cursor-pointer`}
                            >
                                {IconComponent && (
                                    <IconComponent
                                        className={`transition-all duration-200 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.5px] group-hover:stroke-white'}`}
                                    />
                                )}

                                <span className='translate-y-px'>
                                    {item.text}
                                </span>

                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-r-full shadow-[0_0_10px_#6366f1] max-lg:hidden" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </nav>
        </>
    );
}