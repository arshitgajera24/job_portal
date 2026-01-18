import { getCurrentUser } from '@/features/auth/server/authQueries';
import EmployeeProfileCompletionStatus from '@/features/employers/components/EmployeeProfileStatus';
import StatsCards from '@/features/employers/components/EmployerStats';
import { redirect } from 'next/navigation';
import React from 'react'

const ExployerDashboard = async () => {

    const user = await getCurrentUser();

    if (!user) return redirect("/login");
    if (user.role !== "employer") return redirect("/dashboard");
    
  return (
    <div className='space-y-6'>
        <h1 className='text-4xl font-semibold text-foreground'>Overview</h1>
        <div>
            <h1 className='text-2xl font-semibold text-foreground'>
                Hello, <span className="capitalize">{user?.name.toLowerCase()}</span>
            </h1>
            <p className='text-muted-foreground'>Here is Your Daily Activities and Application</p>
        </div>
        <StatsCards />
        <EmployeeProfileCompletionStatus />
    </div>
  )
}

export default ExployerDashboard
