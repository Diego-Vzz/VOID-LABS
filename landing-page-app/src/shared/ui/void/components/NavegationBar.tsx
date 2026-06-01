"use client";

import Logo from '@/shared/assets/svg/letter_logo.svg'
import { AppWindow, Book, CloudDownload, LayoutDashboard, Menu, Settings2, Swords, TicketPlus } from "lucide-react";
import { usePathname, useRouter } from 'next/navigation';

const iconMap = {
    LayoutDashboard,
    CloudDownload,
    TicketPlus,
    Book,
    Settings2,
    AppWindow,
    Swords
}

type IconName = keyof typeof iconMap;

export default function NavegationBar() {
    const pathname = usePathname();
    const router = useRouter();

    const PREFIX_NAVEGATION: string = "/void";
    const options = [
        { id: crypto.randomUUID(), icono: "LayoutDashboard", text: "Dashboard", path: `${PREFIX_NAVEGATION}/dashboard` },
        { id: crypto.randomUUID(), icono: "CloudDownload", text: "Download", path: `${PREFIX_NAVEGATION}/download` },
        { id: crypto.randomUUID(), icono: "TicketPlus", text: "Tickets", path: `${PREFIX_NAVEGATION}/tickets` },
        { id: crypto.randomUUID(), icono: "Book", text: "Guides", path: `${PREFIX_NAVEGATION}/guides` },
        { id: crypto.randomUUID(), icono: "Settings2", text: "Settings", path: `${PREFIX_NAVEGATION}/settings` },
    ];

    const products = [
        { id: crypto.randomUUID(), icono: "AppWindow", text: "Void Cloud", path: `${PREFIX_NAVEGATION}/cloud` },
        { id: crypto.randomUUID(), icono: "Swords", text: "Havoc", path: `${PREFIX_NAVEGATION}/havoc` }
    ];

    const handleNavigation = (path: string) => {
        router.push(path);
    };
    return (
        <>
            <nav className="flex h-auto items-center justify-between md:h-full md:flex-col md:items-start md:justify-start p-2 md:p-4 gap-4 overflow-auto">
                <div className="flex flex-row w-full h-[60px] gap-4 items-center md:justify-center md:h-[80px]">
                    <button className='size-[24px] inline md:hidden'>
                        <Menu className='size-full' />
                    </button>
                    <span className='translate-y-px text-[18px]'>
                        VOID LABS
                    </span>
                </div>

                <div className='md:flex flex-col gap-4 size-full text-[clamp(12px,3vw,16px)] hidden'>
                    <div className='flex flex-row w-full items-center gap-2'>
                        <span className='text-[#90A1B9]/45'>
                            Options
                        </span>
                        <hr className='w-full text-[#90A1B9]/45' />
                    </div>

                    {options.map((item) => {
                        const IconComponent = iconMap[item.icono as IconName];
                        const isActive = pathname === item.path;

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

                    <div className='flex flex-row w-full items-center gap-2'>
                        <span className='text-[#90A1B9]/45'>
                            Products
                        </span>
                        <hr className='w-full text-[#90A1B9]/45' />
                    </div>

                    {products.map((item) => {
                        const IconComponent = iconMap[item.icono as IconName];
                        const isActive = pathname === item.path;

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