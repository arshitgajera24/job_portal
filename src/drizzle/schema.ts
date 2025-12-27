import { relations } from "drizzle-orm";
import { date, int, mysqlEnum, mysqlTable, text, timestamp, varchar, year } from "drizzle-orm/mysql-core";


export const usersTable = mysqlTable("users", {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", {length: 255}).notNull(),
    userName: varchar("username", {length: 255}).unique().notNull(),
    password: text("password").notNull(),
    email: varchar("email", {length: 255}).notNull().unique(),
    role: mysqlEnum("role", ['admin', 'applicant', 'employer']).default("applicant"),
    phoneNumber: varchar("phone_number", {length: 255}),
    avatarUrl: text("avatar_url"),
    deletedAt: timestamp("deleted_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
})

export const sessionsTable = mysqlTable("sessions", {
    id: varchar("id", {length: 255}).primaryKey(),
    userId: int("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
    userAgent: text("user_agent").notNull(),
    ip: varchar("ip", {length: 255}).notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
})

export const employersTable = mysqlTable("employers", {
    id: int("id").primaryKey().references(() => usersTable.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }),
    description: text("description"),
    bannerImageUrl: text("banner_image_url"),
    organizationType: varchar("organization_type", {length: 100}),
    teamSize: varchar("team_size", {length: 50}),
    yearOfEstablishment: year("year_of_extablishment"),
    websiteUrl: varchar("website_url", {length: 255}),
    location: varchar("location", {length: 255}),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().onUpdateNow().notNull(),
})

export const applicantsTable = mysqlTable("applicants", {
    id: int("id").primaryKey().references(() => usersTable.id, { onDelete: "cascade" }),
    biography: text("biography"),
    dateOfBirth: date("date_of_birth"),
    nationality: varchar("nationality", {length: 100}),
    maritalStatus: mysqlEnum("marital_status", ["single", "married", "divorced"]),
    gender: mysqlEnum("gender", ["male", "female", "other"]),
    education: mysqlEnum("education", ["none", "high school", "undergraduate", "masters", "phd"]),
    experience: text("experience"),
    websiteUrl: varchar("website_url", {length: 255}),
    location: varchar("location", {length: 255}),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().onUpdateNow().notNull(),
})

export const userRelations = relations(usersTable, ({one, many}) => ({
    employer: one(employersTable, {
        fields: [usersTable.id],
        references: [employersTable.id],
    }),
    applicant: one(applicantsTable, {
        fields: [usersTable.id],
        references: [applicantsTable.id],
    }),
    session: many(sessionsTable),
}))

export const sessionRelations = relations(sessionsTable, ({one}) => ({
    user: one(usersTable, {
        fields: [sessionsTable.userId],
        references: [usersTable.id],
    })
}))

