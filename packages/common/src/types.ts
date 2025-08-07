import {z} from "zod"

export const createUserSchema = z.object({
    name: z.string().min(3),
    username: z.string().min(4).max(30),
    password: z.string()
})

export const signinSchema = z.object({
    username: z.string().min(4).max(30),
    password: z.string()
})

export const createRoomSchema = z.object({
    name: z.string()
})

// export enum wsDataType{
//   JOIN = "join-room",
//   LEAVE = "leave-room",
//   CHAT = "chat"
// }


export type createUserInput = z.infer<typeof createUserSchema>;
export type signinInput = z.infer<typeof signinSchema>;
export type createRoomInput = z.infer<typeof createRoomSchema>;
