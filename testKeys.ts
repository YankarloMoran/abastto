import { streamText } from 'ai'; type T = Parameters<typeof streamText>[0]; type Keys = keyof T; export const keys: Keys[] = [];
