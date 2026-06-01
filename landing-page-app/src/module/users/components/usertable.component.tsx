"use client";

import { DataGridAction, DataGridColumn } from "@/shared/ui/system/types";
import { IUserData } from "../server/users.interface";
import { Info, List, Pencil, ShieldBan, Trash2, User, UserKey, UserPlus, Users } from "lucide-react";
import DataGrid from "@/shared/ui/system/components/DataGrid";
import AddModalUser from "./addmodaluser.component";
import { useState } from "react";
import { Action } from "..";
import { Funcitons, TypeToast } from "@/shared/lib/functions.utils";
import ModalOptionsComponent from "./modaloptions.component";

interface IUserPageComponent {
    userData: IUserData[] | null
}

const columns: DataGridColumn<IUserData>[] = [
    {
        accessorKey: "id",
        header: "ID",
        sortable: true,
        hideOnMobile: true,
        minWidth: "min-w-[50px]",
        align: "center",
    },
    {
        accessorKey: "username",
        header: "User",
        sortable: true,
        cell: (value, row) => (
            <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-lg bg-white/5 border border-white/10">
                    <User className="size-4 text-zinc-400" />
                </div>
                <span className="font-medium text-white">{value as string}</span>
            </div>
        ),
    },
    {
        accessorKey: "role_name",
        header: "Role",
        sortable: true,
        align: "center",
    },
    {
        accessorKey: "status",
        header: "Status",
        align: "center",
        cell: (value, row) => {
            const variants = {
                Active: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400" },
                Inactive: { bg: "bg-red-500/10", text: "text-red-400", dot: "bg-red-400" },
                Banned: { bg: "bg-red-500/10", text: "text-red-400", dot: "bg-red-400" },
            };

            const config = variants[row.status];

            return (
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.bg} ${config.text}`}>
                    <span className={`size-1.5 rounded-full ${config.dot}`} />
                    {value}
                </span>
            );
        },
    }
];

interface IUserOptions {
    active: boolean;
    user_selected: string;
    role: string;
    banned: boolean;
}

const userOptionsDefualtValue: IUserOptions = {
    active: false,
    user_selected: "",
    role: "",
    banned: false
}

export default function UserTableComponent({ userData }: IUserPageComponent) {
    const [isVisibleAddModalUser, setVisibleAddModalUser] = useState(false);
    const [newUserData, setNewUserData] = useState<IUserData[]>([]);
    const [viewOptionsUser, setViewOptionsUser] = useState<IUserOptions>(userOptionsDefualtValue);

    const actions: DataGridAction<IUserData>[] = [
        {
            label: "Options",
            variant: "default",
            icon: <List className="size-3.5" />,
            onClick: (row) => {
                setViewOptionsUser({
                    active: true,
                    user_selected: row.username,
                    role: row.role_name ?? "",
                    banned: row.status === "Banned"
                })
            },
        },
        {
            label: "Info",
            variant: "default",
            icon: <Info className="size-3.5" />,
            onClick: (row) => { },
        }
    ];

    const onSuccessData = async () => {
        const res = await Action.Get.UserData();
        if (!res.success
            || !res.data) {
            Funcitons.Toast({
                type: TypeToast.ERROR,
                title: "¡Attention!",
                message: res.message
            });
            return;
        }

        setNewUserData(res.data)
    }
    return (
        <>
            <AddModalUser active={isVisibleAddModalUser}
                onClose={() => { setVisibleAddModalUser(false); }}
                onSuccess={onSuccessData} />
            <ModalOptionsComponent active={viewOptionsUser.active}
                user_selected={viewOptionsUser.user_selected} role={viewOptionsUser.role} banned={viewOptionsUser.banned}
                onClose={() => setViewOptionsUser(userOptionsDefualtValue)} />
            <div className="flex flex-row gap-4 w-full">
                <button className="px-2 py-2 rounded-lg bg-emerald-500/10 text-emerald-400/80 border-emerald-400/50 border-2 w-full md:w-auto flex items-center gap-1 justify-center text-[14px] cursor-pointer hover:bg-emerald-500/20 transition-all duration-300" onClick={() => { setVisibleAddModalUser(true) }}>
                    <UserPlus /> Add new user to the system
                </button>
            </div>
            <DataGrid
                data={newUserData?.length > 0 ? newUserData : userData}
                columns={columns}
                searchable
                searchPlaceholder="Search products by name, category, or ID..."
                pagination
                pageSize={5}
                rowKey="id"
                actions={actions}
            />
        </>
    );
}