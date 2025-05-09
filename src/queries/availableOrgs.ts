import { queryOptions } from '@tanstack/react-query'

export const availableOrgs_queryOptionsObject = queryOptions({
    queryKey: ['availableOrgs'],
    queryFn: async () => {
        const url = new URL(`${import.meta.env.VITE_BACKEND_URL}/cais/getAvailableOrganisations`)

        const res = await fetch(url.toString(), {
            credentials: 'include',
        })

        if (res.status === 401) {
            throw new Error('Unauthorized')
        }

        if (!res.ok) {
            const result = await res.json()
            throw new Error(result.error)
        }

        return await res.json()
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: false,
    staleTime: 0,
})