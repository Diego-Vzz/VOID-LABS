import { IUserData } from "@/module/users";
import UserTableComponent from "@/module/users/components/usertable.component";
import { UserService } from "@/module/users/server/users.service";


export default async function UserPage() {
    const response = await UserService.SystemUser();
    const emptyData: IUserData[] = [];
    const userData = response.data ?? emptyData;
    
    return (
        <div className="flex w-full min-w-0 flex-col gap-6 p-4 lg:p-8 overflow-hidden">
            <div className="bg-[#18181B]">
                <h1 className="text-2xl font-semibold text-white tracking-tight">
                    Users
                </h1>
                <p className="text-sm text-zinc-400 mt-1">
                    Centralize the management of client access and administrative permissions.
                </p>
            </div>

            <UserTableComponent userData={userData} />
        </div>
    );
}
