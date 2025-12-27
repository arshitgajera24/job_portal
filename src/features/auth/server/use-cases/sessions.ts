import { cookies, headers } from "next/headers"
import crypto from "crypto"
import { getIPAddress } from "./location";
import { db } from "@/config/db";
import { sessionsTable, usersTable } from "@/drizzle/schema";
import { SESSION_LIFETIME, SESSION_REFRESH_TIME } from "@/config/constant";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export const generateSessionToken = () => {
    return crypto.randomBytes(32).toString("hex").normalize();
}

type CreateSessionDataType = {
    userAgent: string,
    ip: string,
    userId: number,
    token: string,
    tx?: DbClient,
}

export const createUserSession = async ({ token, userId, userAgent, ip, tx = db} : CreateSessionDataType) => {
    const hashToken = crypto.createHash("sha256").update(token).digest("hex");

    const [session] = await tx.insert(sessionsTable).values({id: hashToken, userId, expiresAt: new Date(Date.now() + SESSION_LIFETIME * 1000), ip, userAgent})
    return session;
}

type DbClient = typeof db | Parameters<Parameters<typeof db.transaction>[0]>[0];

export const createSessionAndSetCookies = async (userId: number, tx: DbClient = db) => {
    const token = generateSessionToken();
    const ip = await getIPAddress();
    const headersList = await headers();

    await createUserSession({
        token,
        userId,
        userAgent: headersList.get("user-agent") || "",
        ip,
        tx,
    });

    const cookieStore = await cookies();

    cookieStore.set("session", token, {
        secure: true,
        httpOnly: true,
        maxAge: SESSION_LIFETIME,
    })
}

export const invalidateSession = async (id: string) => {
    await db.delete(sessionsTable).where(eq(sessionsTable.id, id));
}

export const validateSessionAndGetUser = async (session: string) => {
    const hashToken = crypto.createHash("sha256").update(session).digest("hex");

    const [user] = await db.select({
        id: usersTable.id,
        session: {
            id: sessionsTable.id,
            expiresAt: sessionsTable.expiresAt,
            userAgent: sessionsTable.userAgent,
            ip: sessionsTable.ip,
        },
        name: usersTable.name,
        userName: usersTable.userName,
        role: usersTable.role,
        phoneNumber: usersTable.phoneNumber,
        email: usersTable.email,
        avatarUrl: usersTable.avatarUrl,
        createdAt: usersTable.createdAt,
        updatedAt: usersTable.updatedAt,
    }).from(sessionsTable).where(eq(sessionsTable.id, hashToken)).innerJoin(usersTable, eq(usersTable.id, sessionsTable.userId));
    
    if(!user) return null;

    if(Date.now() >= user.session.expiresAt.getTime())
    {
        await invalidateSession(user.session.id);
        return null;
    }

    if(Date.now() >= user.session.expiresAt.getTime() - SESSION_REFRESH_TIME * 1000)
    {
        await db.update(sessionsTable).set({ expiresAt: new Date(Date.now() + SESSION_LIFETIME * 1000)}).where(eq(sessionsTable.id, user.session.id))
    }

    return user;
}