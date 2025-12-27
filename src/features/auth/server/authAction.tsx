"use server"

import { db } from "@/config/db";
import { applicantsTable, employersTable, usersTable } from "@/drizzle/schema";
import argon2 from "argon2";
import { eq, or } from "drizzle-orm";
import { LoginUserDataType, loginUserSchema, RegisterUserDataType, registerUserSchema } from "../authSchema";
import { createSessionAndSetCookies, invalidateSession } from "./use-cases/sessions";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "crypto";


export const registrationAction = async (data: RegisterUserDataType) => {

    try {
        const {data: validatedData, error} = registerUserSchema.safeParse(data);
        if(error) return { success: false, message: error.issues[0].message };

        const {name, userName, email, role, password} = validatedData;

        const [userExists] = await db.select().from(usersTable).where(or(eq(usersTable.userName, userName), eq(usersTable.email, email)));
        if(userExists)
        {
            if(userExists.userName === userName) return { success: false, message: "Username Already Exists" };
            else if(userExists.email === email) return { success: false, message: "Email Already Exists" };
        }

        const hashPassword = await argon2.hash(password);

        await db.transaction(async (tx) => {
            const [user] = await tx.insert(usersTable).values({name, userName, email, role, password: hashPassword});
        
            if(role === "employer")
                await tx.insert(employersTable).values({id: user.insertId});
            else
                await tx.insert(applicantsTable).values({id: user.insertId});

            await createSessionAndSetCookies(user.insertId, tx);
        });
        

        return { success: true, message: "Registration Successful" };
    } catch (error) {
        console.log(error);
        return { success: false, message: "Registration Failed" };
    }
};

export const loginAction = async (data: LoginUserDataType) => {
    try {
        const {data: validatedData, error} = loginUserSchema.safeParse(data);
        if(error) return { success: false, message: error.issues[0].message };

        const {email, password} = validatedData;
    
        const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
        if(!user) return { success: false, message: "Invalid Credentials" };

        const isPasswordValid = await argon2.verify(user.password, password);
        if(!isPasswordValid) return { success: false, message: "Invalid Credentials" };

        await createSessionAndSetCookies(user.id);
        
        return { success: true, message: "Login Successful", role: user.role };
    } catch (error) {
        console.log(error);
        return { success: false, message: "Login Failed" };
    }
};

export const handleLogout = async () => {
    const cookieStore = await cookies();
    const session = cookieStore.get("session")?.value;

    if (!session) return redirect("/login");

    const hashToken = crypto.createHash("sha256").update(session).digest("hex");
    
    await invalidateSession(hashToken);
    cookieStore.delete("session");

    return redirect("/login");
}



