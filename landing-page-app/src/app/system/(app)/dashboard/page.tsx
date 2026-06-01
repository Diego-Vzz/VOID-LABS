import { Action } from "@/module/users";
import { ChartSpline, ShieldBan, Terminal, Tickets, Users } from "lucide-react";



export default async function DashboardPage() {
    const resDash = await Action.Dashboard.ObtainInitialData();
    console.log(resDash)
    const dataPreview = resDash.success ? resDash.data?.data_preview : null;

    return (
        <section className="flex flex-col gap-4 size-full overflow-auto">
            <div className="bg-[#111111]/50 w-full p-4 flex flex-row justify-between rounded-xl items-center">
                <span className="text-white text-[clamp(18px,3vw,32px)] font-bold">
                    System Summary
                </span>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-2 xl:grid-cols-4 gap-4 w-full">
                <div className="bg-[#111111]/50 rounded-xl p-4 flex flex-col w-full">
                    <div className="flex flex-row justify-center md:justify-between items-center gap-2">
                        <span className="text-white/70 text-[18px] hidden md:inline">
                            Total users
                        </span>
                        <span className="flex justify-center items-center bg-[#A684FF]/20 p-[12px] rounded-lg">
                            <Users className="stroke-[#A684FF]/80 size-[28px]" />
                        </span>
                    </div>
                    <span className="text-white text-[28px] font-bold hidden md:inline">
                        {dataPreview?.users ?? 0}
                    </span>
                </div>
                <div className="bg-[#111111]/50 rounded-xl p-4 flex flex-col w-full">
                    <div className="flex flex-row justify-center md:justify-between items-center gap-2">
                        <span className="text-white/70 text-[18px] hidden md:inline">
                            Banned users
                        </span>
                        <span className="flex justify-center items-center bg-[#FF6467]/20 p-[12px] rounded-lg">
                            <ShieldBan className="stroke-[#FF6467]/80 size-[28px]" />
                        </span>
                    </div>
                    <span className="text-white text-[28px] font-bold hidden md:inline">
                        {dataPreview?.banned ?? 0}
                    </span>
                </div>
                <div className="bg-[#111111]/50 rounded-xl p-4 flex flex-col w-full">
                    <div className="flex flex-row justify-center md:justify-between items-center gap-2">
                        <span className="text-white/70 text-[18px] hidden md:inline">
                            Pending tickets
                        </span>
                        <span className="flex justify-center items-center bg-[#FFDF20]/20 p-[12px] rounded-lg">
                            <Tickets className="stroke-[#FFDF20]/80 size-[28px]" />
                        </span>
                    </div>
                    <span className="text-white text-[28px] font-bold hidden md:inline">
                        {dataPreview?.tickets ?? 0}
                    </span>
                </div>
            </div>
            <div className="flex-1 flex flex-col xl:flex-row items-start gap-2">
                <div className="border-t-8 w-full xl:h-full border-t-[#7C86FF]/50 rounded-xl px-[24px] py-[24px] md:py-[32px] bg-[#111111]/50 max-xl:cursor-pointer">
                    <div className="flex items-center gap-4">
                        <span className="p-3 bg-[#00D492]/20 rounded-lg">
                            <ChartSpline className="stroke-[#00D492]/80 size-[clamp(16px,3vw,24px)]" />
                        </span>
                        <span className="text-white text-[clamp(16px,3vw,24px)] font-bold">
                            Performance Analytics
                        </span>
                    </div>
                </div>
                <div className="border-t-8 w-full xl:max-w-[380px] xl:h-full border-t-[#7C86FF]/50 rounded-xl px-[24px] py-[24px] md:py-[32px] bg-[#111111]/50 max-xl:cursor-pointer">
                    <div className="flex items-center gap-4">
                        <span className="p-3 bg-[#51A2FF]/20 rounded-lg">
                            <Terminal className="stroke-[#51A2FF]/80 size-[clamp(16px,3vw,24px)]" />
                        </span>
                        <span className="text-white text-[clamp(16px,3vw,24px)] font-bold text-balance">
                            Live Security <br /> & Activity Feed
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
