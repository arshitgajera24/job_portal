"use client"

import { Input } from '@/components/ui/input';
import React, { ChangeEvent, FormEvent, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Lock, Mail, User, UserCheck } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { toast } from 'sonner';
import { registrationAction } from '@/features/auth/server/authAction';
import { Controller, useForm } from 'react-hook-form';
import { RegisterUserWithConfirmDataType, registerUserWithConfirmSchema } from '@/features/auth/authSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

const Registration:React.FC = () => {

    const {
        register,
        handleSubmit,
        watch,
        control,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(registerUserWithConfirmSchema),
    });

    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleRegister = async (data: RegisterUserWithConfirmDataType) => {
        try {
            const result = await registrationAction(data);

            if(result.success)
            {
                toast.success(result.message);
                if(data.role === "employer") router.push("/employer-dashboard");
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
                <CardDescription>Create Your Account to get Started</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(handleRegister)} className='space-y-6'>
                    <div className='space-y-2'>
                        <Label htmlFor='name'>Full Name*</Label>
                        <div className='relative'>
                            <User className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground' />
                            <Input id='name' type='text' placeholder='Enter Your Full Name' {...register("name")} className={`pl-10 ${errors.name ? "border-destructive" : ""}`} />
                        </div>
                        {
                            errors.name && (
                                <p className="text-sm text-destructive">
                                    {errors.name.message}
                                </p>
                            )
                        }
                    </div>

                    <div className='space-y-2'>
                        <Label htmlFor='username'>Username*</Label>
                        <div className='relative'>
                            <User className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground' />
                            <Input id='username' type='text' placeholder='Choose a Username' {...register("userName")} className={`pl-10 ${errors.userName ? "border-destructive" : ""}`} />
                        </div>
                        {
                            errors.userName && (
                                <p className="text-sm text-destructive">
                                    {errors.userName.message}
                                </p>
                            )
                        }
                    </div>

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

                    <div className='space-y-2 w-full'>
                        <Label htmlFor='role'>I am a*</Label>
                        <Controller name='role' control={control} render={({field}) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className='w-full'>
                                    <SelectValue placeholder="Select Your Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='applicant'>Job Applicant</SelectItem>
                                    <SelectItem value='employer'>Employer</SelectItem>
                                </SelectContent>
                            </Select>
                        )}>
                            
                        </Controller>
                        {
                            errors.role && (
                                <p className="text-sm text-destructive">
                                    {errors.role.message}
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

                    <div className='space-y-2'>
                        <Label htmlFor='confirmPassword'>Confirm Password*</Label>
                        <div className='relative'>
                            <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground' />
                            <Input id='confirmPassword' type={showConfirmPassword ? "text" : "password"} placeholder='Confirm Your Password' {...register("confirmPassword")} className={`pl-10 pr-10 ${errors.confirmPassword ? "border-destructive" : ""}`} />
                            <Button type='button' variant="ghost" size="sm" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer'>
                                {
                                    showConfirmPassword ? (
                                        <EyeOff className='w-4 h-4 text-muted-foreground' />
                                    ) : (
                                        <Eye className='w-4 h-4 text-muted-foreground' />
                                    )
                                }
                            </Button>
                        </div>
                        {
                            errors.confirmPassword && (
                                <p className="text-sm text-destructive">
                                    {errors.confirmPassword.message}
                                </p>
                            )
                        }
                    </div>

                    <Button type='submit' className='w-full'>
                        Create Account
                    </Button>

                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">
                            Already have an Account?&nbsp;
                            <Link href="/login" className='text-primary hover:text-primary/80 font-medium underline-offset-4 hover:underline'>
                                Sign in Here
                            </Link>
                        </p>
                    </div>
                </form>
            </CardContent>
        </Card>
    </div>
  );
}

export default Registration
