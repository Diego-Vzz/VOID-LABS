import { toast } from "sonner";
import { ReactNode } from "react";
import { NextResponse } from "next/server";

export enum TypeToast {
    INFO = "INFO",
    ERROR = "ERROR",
    SUCCESS = "SUCCESS",
    WARNING = "WARNING",
    LOADING = "LOADING"
}

export interface IToast {
    icon?: ReactNode;
    type: TypeToast;
    title: string;
    message: string;
}

class FuncitonsClass {
    public Toast(params: IToast) {
        switch (params.type) {
            case TypeToast.ERROR:
                toast.error(params.title, { description: params.message });
                break;
            case TypeToast.INFO:
                toast.info(params.title, { description: params.message });
                break;
            case TypeToast.SUCCESS:
                toast.success(params.title, { description: params.message });
                break;
            case TypeToast.LOADING:
                toast.loading(params.title, { description: params.message });
                break;
            case TypeToast.WARNING:
                toast.warning(params.title, { description: params.message });
                break;
        }
    }

    public DeleteAllCookies(response: NextResponse) {
        response.cookies.getAll().forEach(cookie => {
            response.cookies.delete(cookie.name);
        });
    }
}

export const Funcitons = new FuncitonsClass();