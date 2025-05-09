import { queryOptions } from '@tanstack/react-query'

/**
 * Function that returns a queryOptions object (to be used with TanStack Query)
 * to retrieve authentication options for a particular user
 * @param id - username or email
 * @returns queryOptions object
 */
export const authOptions_queryOptionsObject = (handle: string) => queryOptions({
    queryKey: ['authOptions', handle],
    queryFn: async () => {
        const url = new URL(`${import.meta.env.VITE_BACKEND_URL}/cais/auth/getAuthenticationOptions`)
        const params = new URLSearchParams()
        params.append('handle', handle)
        url.search = params.toString()

        const res = await fetch(url.toString(), {
            credentials: 'include',
        })

        if (res.status === 404) {
            throw new Error('User not found')
        }

        if (!res.ok) {
            throw new Error('Failed to fetch authentication options')
        }
        
        return await res.json()
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: false,
    staleTime: 0
})