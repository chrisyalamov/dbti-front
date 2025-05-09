import { queryOptions } from '@tanstack/react-query'

export const cart_queryOptionsObject = queryOptions({
    queryKey: ["cart"],
    queryFn: async () => {
        console.log("the cart query is being executed");
        const url = new URL(`${import.meta.env.VITE_BACKEND_URL}/purchasing/getCart`)
        
        const res = await fetch(url.toString(), {
            credentials: 'include',
        })

        const json = await res.json()

        if (!res.ok) {
            throw new Error(json.error.message)
        }

        return json
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: false,
    staleTime: 0
})