import { createOpenRouter } from '@openrouter/ai-sdk-provider'

export const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY!,
})

/**
 * Free models on OpenRouter, ordered by preference.
 * The system tries each one in order if the previous fails (429/503).
 * Model IDs ending in `:free` are subsidized by OpenRouter.
 * Last verified: April 2026.
 */
export const FREE_MODELS = [
  'google/gemma-4-31b-it:free',
  'meta-llama/llama-3.3-70b-instruct:free',
  'qwen/qwen3-235b-a22b:free',
  'nvidia/llama-3.3-nemotron-super-49b-v1:free',
  'google/gemma-3-27b-it:free',
  'openrouter/free',
] as const

export type FreeModel = (typeof FREE_MODELS)[number]
