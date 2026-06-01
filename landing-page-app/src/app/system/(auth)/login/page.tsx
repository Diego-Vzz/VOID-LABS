"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AnimatePresence, motion } from 'framer-motion';
import { Funcitons, TypeToast } from '@/shared/lib/functions.utils';
import { useRouter } from 'next/navigation';
import { Action } from '@/module/auth';

const loginSchema = z.object({
  username: z.string()
    .min(4, "Must be between 4 and 16 characters.")
    .max(16, "Must be between 4 and 16 characters."),
  password: z.string().min(6, "Password is too short"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const route = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: ""
    }
  })

  const onSubmit = async (form: LoginFormValues) => {
    const response = await Action.Auth.Login(form);

    if (!response.success) {
      Funcitons.Toast({
        type: TypeToast.ERROR,
        title: "¡Attention!",
        message: response.message
      });
      return;
    }

    Funcitons.Toast({
      type: TypeToast.SUCCESS,
      title: "Session started successfully",
      message: "Welcome back."
    });
    reset();
    route.push("/system/dashboard");
  }

  return (
    <div className="flex flex-col w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white tracking-tight">Sign in to System</h1>
        <p className="text-sm text-zinc-400 mt-2">
          Enter your details to access the dashboard.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5 group">
          <label className="text-xs font-medium text-zinc-400 group-focus-within:text-zinc-200 transition-colors select-none">
            Email Address
          </label>
          <input
            {...register("username")}
            type="text"
            placeholder="@user"
            disabled={isSubmitting}
            className={`
              w-full text-sm text-white placeholder-zinc-600 px-3 py-2.5 
              bg-[#0A0A0C] border border-zinc-800 rounded-lg
              transition-all duration-200 outline-none
              focus:bg-[#121214] focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500
              disabled:opacity-50 disabled:cursor-default
              ${errors.username ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/50' : ''}
            `}
          />
          <AnimatePresence>
            {errors.username && (
              <motion.p
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 4 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="text-xs text-red-400 overflow-hidden"
              >
                {errors.username.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-col gap-1.5 group">
          <div className="flex justify-between items-center">
            <label className="text-xs font-medium text-zinc-400 group-focus-within:text-zinc-200 transition-colors select-none">
              Password
            </label>
            <a href="#" className="text-xs text-zinc-400 hover:text-white transition-colors">
              Forgot password?
            </a>
          </div>
          <input
            {...register("password")}
            type="password"
            placeholder="••••••••"
            disabled={isSubmitting}
            className={`
              w-full text-sm text-white placeholder-zinc-600 px-3 py-2.5 
              bg-[#0A0A0C] border border-zinc-800 rounded-lg
              transition-all duration-200 outline-none
              focus:bg-[#121214] focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500
              disabled:opacity-50 disabled:cursor-default
              ${errors.password ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/50' : ''}
            `}
          />
          <AnimatePresence>
            {errors.password && (
              <motion.p
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 4 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="text-xs text-red-400 overflow-hidden"
              >
                {errors.password.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-white hover:bg-zinc-200 text-black font-medium text-sm py-2.5 rounded-lg transition-colors mt-2 flex justify-center items-center h-[40px] disabled:opacity-70 cursor-pointer disabled:cursor-default"
        >
          {isSubmitting ? (
            <svg className="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            "Sign In"
          )}
        </button>
      </form>
    </div>
  );
}
