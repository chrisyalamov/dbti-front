import { queryOptions } from '@tanstack/react-query'

export const availableSkus_queryOptionsObject = queryOptions({
    queryKey: ['availableSkus'],
    queryFn: async () => {
        const url = new URL(`${import.meta.env.VITE_BACKEND_URL}/licenses/getAvailableSkus`)

        const res = await fetch(url.toString())

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


export const skuDetails_queryOptionsObject = (orgId: string, skuId: string) => queryOptions({
    queryKey: ['skuDetails', orgId, skuId],
    queryFn: async () => {
        const url = new URL(`${import.meta.env.VITE_BACKEND_URL}/licenses/getSkuById`)

        const params = new URLSearchParams()
        params.append('organisationId', orgId)
        params.append('skuId', skuId)
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