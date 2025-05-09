import { queryOptions } from '@tanstack/react-query'

export const orgLicenses_queryOptionsObject = (orgId: string) => queryOptions({
    queryKey: ['orgLicenses', orgId],
    queryFn: async () => {
        const url = new URL(`${import.meta.env.VITE_BACKEND_URL}/licenses/getAll`)
        
        const params = new URLSearchParams()
        params.append('organisationId', orgId)
        url.search = params.toString()

        const res = await fetch(url.toString(), {
            credentials: 'include',
        })

        const json = await res.json()

        if (!res.ok) {
            throw new Error(json.error.message)
        }

        return await json
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: false,
    staleTime: 0
})

export const license_queryOptionsObject = (licenseId: string, organisationId: string) => queryOptions({
    queryKey: ['license', licenseId],
    queryFn: async () => {
        const url = new URL(`${import.meta.env.VITE_BACKEND_URL}/licenses/getById`)
        url.searchParams.append('licenseId', licenseId)
        url.searchParams.append('organisationId', organisationId)

        const res = await fetch(url.toString(), {
            credentials: 'include',
        })

        const json = await res.json()

        if (!res.ok) {
            throw new Error(json?.error?.message || 'Failed to fetch license')
        }

        return await json
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: false,
    staleTime: 0
})