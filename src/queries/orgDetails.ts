import { queryOptions } from '@tanstack/react-query'

export const orgDetails_queryOptionsObject = (orgId: string) => queryOptions({
    queryKey: ['orgDetails', orgId],
    queryFn: async () => {
        const url = new URL(`${import.meta.env.VITE_BACKEND_URL}/organisations/getOrganisation`)
        const params = new URLSearchParams()
        params.append('organisationId', orgId)
        url.search = params.toString()

        const res = await fetch(url.toString())

        if (!res.ok) {
            throw new Error('Failed to fetch organisation details')
        }

        return await res.json()
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: false,
    staleTime: 0
})