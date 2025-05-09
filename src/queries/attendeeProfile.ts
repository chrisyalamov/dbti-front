import { queryOptions } from "@tanstack/react-query";

export const attendeeProfile_queryOptionsObject = (attendeeProfileId: string) => queryOptions({
    queryKey: ['attendeeProfile', attendeeProfileId],
    queryFn: async () => {
        const url = new URL(`${import.meta.env.VITE_BACKEND_URL}/events/getAttendeeProfile`)
        url.searchParams.append('attendeeProfileId', attendeeProfileId)
        
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

export const attendeeLicenses_queryOptionsObject = (attendeeProfileId: string) => queryOptions({
    queryKey: ['attendeeLicenses', attendeeProfileId],
    queryFn: async () => {
        const url = new URL(`${import.meta.env.VITE_BACKEND_URL}/licenses/getAttendeeLicenses`)
        url.searchParams.append('attendeeProfileId', attendeeProfileId)
        
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