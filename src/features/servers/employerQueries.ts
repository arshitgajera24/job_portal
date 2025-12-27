import { db } from "@/config/db";
import { getCurrentUser } from "../auth/server/authQueries"
import { employersTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";


export const getCurrentEmplyeeDetails = async () => {
    const currentUser = await getCurrentUser();

    if(!currentUser) return null;
    if(currentUser.role !== "employer") return null;

    const [employer] = await db.select().from(employersTable).where(eq(employersTable.id, currentUser.id));

    const isProfileCompleted =  employer.name &&
                                employer.description &&
                                currentUser.avatarUrl &&
                                employer.organizationType &&
                                employer.yearOfEstablishment;

    return {...currentUser, employerDetails: employer, isProfileCompleted};
}