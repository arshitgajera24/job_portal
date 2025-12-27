"use server"

import { db } from "@/config/db";
import { getCurrentUser } from "../auth/server/authQueries";
import { employersTable, usersTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { EmployerProfileDataType } from "../employers/exployerSchema";

export const updateEmployerProfileAction = async (data: EmployerProfileDataType) => {
    try {
        const curerntUser = await getCurrentUser();
        if(!curerntUser || curerntUser.role !== "employer") return {success: false, message: "Unauthorized Employer"};

        const { name, description, yearOfEstablishment, location, websiteUrl, organizationType, teamSize, avatarUrl, bannerImageUrl } = data;

        const updatedEmployer = await db.update(employersTable).set({name, description, yearOfEstablishment: yearOfEstablishment ? parseInt(yearOfEstablishment) : null, location, websiteUrl, organizationType, teamSize, bannerImageUrl}).where(eq(employersTable.id, curerntUser.id));
        await db.update(usersTable).set({ avatarUrl }).where(eq(usersTable.id, curerntUser.id));

        return {success: true, message: "Profile Updated Successfully"};
    } catch (error) {
        console.log(error);
        return {success: false, message: "Something went Wrong, Profile not Updated"};
    }
}