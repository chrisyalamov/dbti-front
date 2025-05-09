import { queryOptions } from '@tanstack/react-query'

export const po_queryOptionsObject = (poId: string) => queryOptions({
    queryKey: ['po', poId],
    queryFn: async () => {
        const url = new URL(`${import.meta.env.VITE_BACKEND_URL}/purchasing/getPurchaseOrder`)
        const params = new URLSearchParams()
        params.append('purchaseOrderId', poId)
        url.search = params.toString()

        const res = await fetch(url.toString(), {
            credentials: 'include',
        })

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

export const orgPos_queryOptionsObject = (orgId: string) => queryOptions({
    queryKey: ['orgPos', orgId],
    queryFn: async () => {
        const url = new URL(`${import.meta.env.VITE_BACKEND_URL}/purchasing/getAllPurchaseOrders`)
        url.searchParams.append('organisationId', orgId)

        const res = await fetch(url.toString(), {
            credentials: 'include',
        })

        let json;

        try {
            json = await res.json()
        } catch (e) {
            throw new Error("Failed to parse response")
        }

        if (!res.ok || json.error) {
            throw new Error(json.error.message || 'Failed to fetch purchase orders')
        }

        return json
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: false,
    staleTime: 0
})