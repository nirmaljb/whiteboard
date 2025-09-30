import { z } from 'zod';

const signUpSchema = z.object({
    username: z.string(),
    email: z.email(),
    password: z.string().min(8)
});

const signInSchema = z.object({
    email: z.email(),
    password: z.string().min(8)
});

const roomSchema = z.object({
    slug: z.string().min(3)
})

export { signUpSchema, signInSchema, roomSchema };