import { queryOptions } from "@tanstack/react-query";

export const eventsForOrg_queryOptionsObject = (orgId: string) => queryOptions({
    queryKey: ['eventsForOrg', orgId],
    queryFn: async () => {
        const url = new URL(`${import.meta.env.VITE_BACKEND_URL}/events/getAllEventsForOrg`)
        url.searchParams.append('organisationId', orgId)
        
        const res = await fetch(url.toString(), {
            credentials: 'include',
        })

        const json = await res.json()

        if (!res.ok || json?.success === false) {
            throw new Error(json?.error?.message || 'Failed to fetch')
        }

        return json
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: false,
    staleTime: 0
})

export const event_queryOptionsObject = (eventId: string) => queryOptions({
    queryKey: ['event', eventId],
    queryFn: async () => {
        const url = new URL(`${import.meta.env.VITE_BACKEND_URL}/events/getEventById`)
        url.searchParams.append('eventId', eventId)
        
        const res = await fetch(url.toString(), {
            credentials: 'include',
        })

        let json;
        try {
            json = await res.json()
        } catch (e) {
            throw new Error('Failed to parse response')
        }

        if (!res.ok || json?.success === false) {
            throw new Error(json?.error?.message || 'Failed to fetch')
        }

        return json
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: false,
    staleTime: 0
})