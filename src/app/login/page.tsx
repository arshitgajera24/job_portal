"use client"

import { Input } from '@/components/ui/input';
import React, { ChangeEvent, FormEvent, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Lock, Mail, UserCheck } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { toast } from 'sonner';
import { loginAction } from '@/features/auth/server/authAction';
import { LoginUserDataType, loginUserSchema } from '@/features/auth/authSchema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';


const Login:React.FC = () => {

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginUserSchema)
    });

    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);


    const handleLogin = async (data: LoginUserDataType) => {
        try {
            const result = await loginAction(data);

            if(result.success)
            {
                toast.success(result.message);
                if(result.role === "employer") router.push("/employer-dashboard");
                else router.push("/dashboard");
            }
            else toast.error(result.message)
        } catch (error) {
            console.log(error);
        }
    }

  return (
    <div className='min-h-screen bg-background flex items-center justify-center p-4'>
        <Card className='w-lg max-w-wd'>
            <CardHeader className='text-center'>
                <div className='mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4'>
                    <UserCheck className='w-8 h-8 text-primary-foreground' />
                </div>
                <CardTitle className='text-2xl'>Join our Job Portal</CardTitle>
                <CardDescription>Login Your Account</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(handleLogin)} className='space-y-6'>
                    <div className='space-y-2'>
                        <Label htmlFor='email'>Email*</Label>
                        <div className='relative'>
                            <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground' />
                            <Input id='email' type='email' placeholder='Enter a Valid Email' {...register("email")} className={`pl-10 ${errors.email ? "border-destructive" : ""}`} />
                        </div>
                        {
                            errors.email && (
                                <p className="text-sm text-destructive">
                                    {errors.email.message}
                                </p>
                            )
                        }
                    </div>

                    <div className='space-y-2'>
                        <Label htmlFor='password'>Password*</Label>
                        <div className='relative'>
                            <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground' />
                            <Input id='password' type={showPassword ? "text" : "password"} placeholder='Create a Strong Password' {...register("password")} className={`pl-10 pr-10 ${errors.password ? "border-destructive" : ""}`} />
                            <Button type='button' variant="ghost" size="sm" onClick={() => setShowPassword(!showPassword)} className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer'>
                                {
                                    showPassword ? (
                                        <EyeOff className='w-4 h-4 text-muted-foreground' />
                                    ) : (
                                        <Eye className='w-4 h-4 text-muted-foreground' />
                                    )
                                }
                            </Button>
                        </div>
                        {
                            errors.password && (
                                <p className="text-sm text-destructive">
                                    {errors.password.message}
                                </p>
                            )
                        }
                    </div>

                    <Button type='submit' className='w-full'>
                        Login
                    </Button>

                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">
                            Don't have an Account?&nbsp;
                            <Link href="/register" className='text-primary hover:text-primary/80 font-medium underline-offset-4 hover:underline'>
                                Register Here
                            </Link>
                        </p>
                    </div>
                </form>
            </CardContent>
        </Card>
    </div>
  );
}

export default Login
