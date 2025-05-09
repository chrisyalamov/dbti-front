import { z } from "zod";

export const authOptionsSchema = z.array(
    z.discriminatedUnion('type', [
        z.object({
            type: z.literal('password'),
        }),
        z.object({
            type: z.literal('email-otp')
        }),
    ])
)