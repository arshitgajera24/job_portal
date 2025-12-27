import z from "zod";

export const organizationTypes = [
    "Development",
    "Business",
    "Finance & Accounting",
    "It & Software",
    "Office Productivity",
    "Personal Development",
    "Design",
    "Marketing",
    "Photography & Video",
    "Healthcare",
    "Education",
    "Retail",
    "Manufacturing",
    "Hospitality",
    "Consulting",
    "Real Estate",
    "Legal",
    "Other",
] as const;

export const teamSizeOptions = [
    "Just me",
    "2-10 Employees",
    "11-50 Employees",
    "51-200 Employees",
    "201-500 Employees",
    "501-1000 Employees",
    "1001+ Employees",
] as const;

export const employerProfileSchema = z.object({
    name: z.string().trim().min(1, "Company Name is Required").max(255, "Company name must not exceed 255 characters"),
    description: z.string().trim().min(10, "Description is Required with Minimum 10 Characters").max(2000, "Description must not exceed 2000 characters"),
    organizationType: z.enum(organizationTypes, {error: "Please Select a Valid Organization Type"}).or(z.literal("")),
    teamSize: z.enum(teamSizeOptions, {error: "Please Select a Valid Team Size"}).or(z.literal("")),
    yearOfEstablishment: z.string().trim().regex(/^\d{4}$/, "4 Digit Year is Required").refine((year) => {
        const yearNum = parseInt(year);
        const currentYear = new Date().getFullYear();
        return yearNum >= 1800 && yearNum <= currentYear; 
    }, {
        message: "Please Enter a Valid Year between 1800 and Current Year"
    }),
    avatarUrl: z.string().url("Valid Url is Required").trim().max(500, "Avatar url must not exceed 500 Characters").optional().or(z.literal("")),
    websiteUrl: z.url("Valid Url is Required").trim().max(500, "Website url must not exceed 500 Characters").optional().or(z.literal("")),
    location: z.string().trim().max(255, "Location must not exceed 255 characters").optional().or(z.literal("")),
    bannerImageUrl: z.string().url("Valid Url is Required").trim().max(500, "Banner Image url must not exceed 500 Characters").optional().or(z.literal("")),
})

export type EmployerProfileDataType = z.infer<typeof employerProfileSchema>;

