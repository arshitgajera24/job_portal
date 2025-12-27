import EmployerSettingsForm from '@/features/employers/components/EmployerSettingsForm'
import { EmployerProfileDataType } from '@/features/employers/exployerSchema';
import { getCurrentEmplyeeDetails } from '@/features/servers/employerQueries'
import { redirect } from 'next/navigation';
import React from 'react'

const EmployerSettings = async () => {
  
  const currentEmployer = await getCurrentEmplyeeDetails();
  if(!currentEmployer) return redirect("/login");

  return (
    <div>
        <EmployerSettingsForm initialData={{
          name: currentEmployer.employerDetails.name ?? "",
          description: currentEmployer.employerDetails.description ?? "",
          organizationType: (currentEmployer.employerDetails.organizationType as EmployerProfileDataType["organizationType"]) ?? "",
          teamSize: (currentEmployer.employerDetails.teamSize as EmployerProfileDataType["teamSize"]) ?? "",
          location: currentEmployer.employerDetails.location ?? "",
          websiteUrl: currentEmployer.employerDetails.websiteUrl ?? "",
          yearOfEstablishment: currentEmployer.employerDetails.yearOfEstablishment?.toString(),
          avatarUrl: currentEmployer.avatarUrl ?? "",
          bannerImageUrl: currentEmployer.employerDetails.bannerImageUrl ?? "",
        }} />
    </div>
  )
}

export default EmployerSettings
