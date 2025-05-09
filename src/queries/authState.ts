import { queryOptions } from '@tanstack/react-query'

/**
 * Function that returns a queryOptions object (to be used with TanStack Query)
 * to retrieve authentication options for a particular user
 * @param id - username or email
 * @returns queryOptions object
 */
export const authState_queryOptionsObject = queryOptions({
    queryKey: ['authState'],
    queryFn: async () => {
        const url = new URL(`${import.meta.env.VITE_BACKEND_URL}/cais/state`)
        
        const res = await fetch(url.toString(), {
            credentials: 'include',
        })
        
        return await res.json()
    },
    refetchOnWindowFocus: true,
    refetchOnMount: false,
    retry: false,
    staleTime: Infinity,
    gcTime: 10000
})