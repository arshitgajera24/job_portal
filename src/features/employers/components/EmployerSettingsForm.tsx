"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { updateEmployerProfileAction } from '@/features/servers/employerAction'
import { Briefcase, Building2, Calendar, FileText, Globe, Loader, Loader2, MapPin, Upload, X } from 'lucide-react'
import React, { ComponentProps, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { EmployerProfileDataType, employerProfileSchema, organizationTypes, teamSizeOptions } from '../exployerSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import Tiptap from '@/components/textEditor'
import { UploadButton, useUploadThing } from '@/lib/uploadthing'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { useDropzone } from '@uploadthing/react'

interface Prop {
    initialData?: Partial<EmployerProfileDataType>
}

const EmployerSettingsForm = ({initialData}: Prop) => {

    const {register, handleSubmit, watch, setValue, control, formState: { errors, isDirty, isSubmitting }} = useForm<EmployerProfileDataType>({
        defaultValues: {
            name: initialData?.name || "",
            description: initialData?.description || "",
            organizationType: initialData?.organizationType || "",
            teamSize: initialData?.teamSize || "",
            yearOfEstablishment: initialData?.yearOfEstablishment,
            location: initialData?.location || "",
            websiteUrl: initialData?.websiteUrl || "",
            avatarUrl: initialData?.avatarUrl || "",
            bannerImageUrl: initialData?.bannerImageUrl || "",
        },
        resolver: zodResolver(employerProfileSchema),
    });

    const avatarUrl = watch("avatarUrl");

    const handleRemoveAvatar = () => {
        setValue("avatarUrl", "");
    }

    const handleFormSubmit = async (data: EmployerProfileDataType) => {
        const response = await updateEmployerProfileAction(data);

        if(response.success)
        {
            toast.success(response.message);
        }
        else toast.error(response.message);
    };


  return (
    <Card className='w-full md:w-5/6'>
        <CardContent>
            <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-6'>
                <div className="grid lg:grid-cols-[1fr_4fr] gap-6">
                    <Controller name='avatarUrl' control={control} render={({field, fieldState}) => (
                        <div className='space-y-2'>
                            <Label>Upload Logo*</Label>
                            <ImageUpload 
                                value={field.value} 
                                onChange={field.onChange} 
                                boxText="A Photo larger than 400 pixels Works best. Max Photo size 5 MB."
                                className={cn(fieldState.error && "ring-1 ring-destructive/50 rounded-lg", "h-64 w-64")} />
                            {fieldState.error && (
                                <p className="text-sm text-destructive">
                                    {fieldState.error.message}
                                </p>
                            )}
                        </div>
                    )} />

                    <Controller name='bannerImageUrl' control={control} render={({field, fieldState}) => (
                        <div className='space-y-2'>
                            <Label>Banner Image</Label>
                            <ImageUpload 
                                value={field.value} 
                                onChange={field.onChange} 
                                boxText="Banner Images optional dimentions 1520x400. Supported Format JPEG, PNG. Max Photo Size 5 MB."
                                className={cn(fieldState.error && "ring-1 ring-destructive/50 rounded-lg", "h-64 w-full")} />
                            {fieldState.error && (
                                <p className="text-sm text-destructive">
                                    {fieldState.error.message}
                                </p>
                            )}
                        </div>
                    )}/>
                </div>

                <div className="space-y-2">
                    <Label htmlFor='companyName'>Company name*</Label>
                    <div className="relative">
                        <Building2 className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground' />
                        <Input id='companyName' type='text' placeholder='Enter Company Name' {...register("name")} className={`pl-10 ${errors.name ? "border-destructive" : ""}`} />
                    </div>
                    {
                        errors.name && <p className="text-sm text-destructive">
                            {errors.name.message}
                        </p>
                    }
                </div>

                <div className="space-y-2">
                    <Controller name='description' control={control} render={({field, fieldState}) => (
                        <div className='space-y-2'>
                            <Label htmlFor='description'>Company Description*</Label>
                            <Tiptap content={field.value} onChange={field.onChange} />
                            {
                                fieldState.error && <p className="text-sm text-destructive">
                                    {fieldState.error.message}
                                </p>
                            }
                        </div>
                    )} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className='space-y-2'>
                        <Label htmlFor='organizationType'>Organization Type*</Label>
                        <Controller name='organizationType' control={control} render={({field}) => (
                            <div className='relative'>
                                <Briefcase className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground z-10' />
                                <Select value={field.value} onValueChange={field.onChange} >
                                    <SelectTrigger className={`pl-10 w-full ${errors.organizationType ? "border-destructive" : ""}`}>
                                        <SelectValue placeholder="Select Organization Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {
                                            organizationTypes.map((type, index) => (
                                                <SelectItem key={index} value={type}>
                                                    {type}
                                                </SelectItem>
                                            ))
                                        }
                                    </SelectContent>
                                </Select>
                            </div>
                        )}/>
                        {
                            errors.organizationType && <p className="text-sm text-destructive">
                                {errors.organizationType.message}
                            </p>
                        }
                    </div>

                    <div className='space-y-2'>
                        <Label htmlFor='teamSize'>Team Size*</Label>
                        <Controller name='teamSize' control={control} render={({field}) => (
                            <div className='relative'>
                                <Briefcase className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground z-10' />
                                <Select value={field.value} onValueChange={field.onChange} >
                                    <SelectTrigger className={`pl-10 w-full ${errors.teamSize ? "border-destructive" : ""}`}>
                                        <SelectValue placeholder="Select Team Size" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {
                                            teamSizeOptions.map((type, index) => (
                                                <SelectItem key={index} value={type}>
                                                    {type}
                                                </SelectItem>
                                            ))
                                        }
                                    </SelectContent>
                                </Select>
                            </div>
                        )} />
                        {
                            errors.teamSize && <p className="text-sm text-destructive">
                                {errors.teamSize.message}
                            </p>
                        }
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor='yearOfEstablishment'>Year of Establishment*</Label>
                        <div className="relative">
                            <Calendar className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground' />
                            <Input id='yearOfEstablishment' type='text' placeholder='E. g., 2005' maxLength={4} {...register("yearOfEstablishment")} className={`pl-10 ${errors.yearOfEstablishment ? "border-destructive" : ""}`} />
                        </div>
                        {
                            errors.yearOfEstablishment && <p className="text-sm text-destructive">
                                {errors.yearOfEstablishment.message}
                            </p>
                        }
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor='location'>Location</Label>
                        <div className="relative">
                            <MapPin className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground' />
                            <Input id='location' type='text' placeholder='E. g., Surat, Vadodara' {...register("location")} className={`pl-10 ${errors.location ? "border-destructive" : ""}`} />
                        </div>
                        {
                            errors.location && <p className="text-sm text-destructive">
                                {errors.location.message}
                            </p>
                        }
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor='websiteUrl'>Website Url (Optional)</Label>
                    <div className="relative">
                        <Globe className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground' />
                        <Input id='websiteUrl' type='text' placeholder='https://www.yourcomany.com' {...register("websiteUrl")} className={`pl-10 ${errors.websiteUrl ? "border-destructive" : ""}`} />
                    </div>
                    {
                        errors.websiteUrl && <p className="text-sm text-destructive">
                            {errors.websiteUrl.message}
                        </p>
                    }
                </div>

                <div className="flex items-center gap-4 pt-4">
                    <Button type='submit'>
                        {isSubmitting && <Loader className='w-4 h-4 animate-spin' />}
                        {isSubmitting ? "Saving Changes..." : "Save Changes"}
                    </Button>
                    {
                        !isDirty && <p className='text-sm text-muted-foreground'> No Changes to Save </p>
                    }
                </div>

            </form>
        </CardContent>
    </Card>
  )
}

export default EmployerSettingsForm

type ImageUploadProps = Omit<ComponentProps<"div">, "onChange"> & {
    value?: string;
    onChange: (url: string) => void;
    boxText?: string;
}

export const ImageUpload = ({value, onChange, boxText, className, ...props}: ImageUploadProps) => {
    const [isUploading, setIsUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    
    const {startUpload} = useUploadThing("imageUploader", {
        onClientUploadComplete: (res) => {
            if(res && res[0])
            {
                onChange(res[0].ufsUrl);
                toast.success("Image Uploaded Successfully");
            }
            setIsUploading(false);
            setPreviewUrl(null);
        },
        onUploadError: (error: Error) => {
            toast.error(`Error Uploading Image: ${error.message}`);
            setIsUploading(false);
            setPreviewUrl(null);
        }
    });

    const handleFileSelect = async (files: File[]) => {
        const file = files[0];
        if(!file) return;

        if(!file.type.startsWith("image/"))
        {
            toast.error("Please Slect a Valid Image File");
            return ;
        }

        if(file.size > 5 * 1024 * 1024)
        {
            toast.error("Image Size should be less than 5 MB");
            return ;
        }

        const reader = new FileReader();
        reader.onloadend = () => setPreviewUrl(reader.result as string);
        reader.readAsDataURL(file);

        setIsUploading(true);
        await startUpload([file]);
    }

    const { getInputProps, getRootProps, isDragActive } = useDropzone({
        onDrop: handleFileSelect,
        accept: { "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"] },
        maxFiles: 1,
        disabled: isUploading,
    });

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange("");
        setPreviewUrl(null);
    }

    if (value || previewUrl)
    return (
      <div
        className={cn("overflow-hidden border-2 border-border relative group rounded-lg",className)}
        {...props}>
        <Image
          src={previewUrl || value || ""}
          alt="Uploaded image"
          height={200}
          width={200}
          className="w-full h-full object-cover"
        />

        {isUploading && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
              <p className="text-sm text-white font-medium">Uploading...</p>
            </div>
          </div>
        )}

        {!isUploading && (
          <div
            {...getRootProps()}
            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 cursor-pointer">
            <input {...getInputProps()} />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={(e) => e.stopPropagation()}>
              <Upload className="w-4 h-4 mr-2" />
              Change
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleRemove}>
              <X className="w-4 h-4 mr-2" />
              Remove
            </Button>
          </div>
        )}
      </div>
    );

  return (
    <div
      {...getRootProps()}
      className={cn("border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors",
        isDragActive
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25 hover:border-primary/50",
        isUploading && "opacity-50 pointer-events-none",
        className
      )}
      {...props}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
          <Upload className="w-6 h-6 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-foreground mb-1">
          <span className="text-primary">Browse photo</span> or drop here
        </p>
        {boxText && (
          <p className="text-xs text-muted-foreground text-center px-4 max-w-xs">
            {boxText}
          </p>
        )}
      </div>
    </div>
  );
};

