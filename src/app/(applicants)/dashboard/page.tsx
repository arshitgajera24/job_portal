import { handleLogout } from '@/features/auth/server/authAction'
import React from 'react'

const ApplicantDashboard = () => {
  return (
    <div>
        <h1>Applicant Dashboard</h1>
        <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default ApplicantDashboard
