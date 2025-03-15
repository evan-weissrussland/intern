import { searchSchema } from '@/components/search/search-shema'
import { z } from 'zod'

export type SearchValues = z.infer<typeof searchSchema>
