import { useMutation } from "@tanstack/react-query";
import { router } from "../main";
import type { CSSProperties } from "react";
import { Spinner } from "./Spinner";

export const CreateEventButton = ({ orgId, style }: { orgId: string, style?: CSSProperties }) => {
    const newEventMutation = useMutation({
      mutationFn: async () => {
        console.log(import.meta.env)
        const url = new URL(`${import.meta.env.VITE_BACKEND_URL}/events/createEvent`)
        url.searchParams.append('organisationId', orgId)
  
        let json, res;
  
        try {
          res = await fetch(url.toString(), {
            method: 'POST',
            credentials: 'include',
          })
  
          json = await res.json()
        } catch (e) {
          throw new Error('Failed to fetch or parse response')
        }
  
        if (!res?.ok || json?.success === false) {
          throw new Error(json?.error?.message || 'Failed to fetch')
        }
  
        return json
      },
      mutationKey: ['createEvent'],
      throwOnError: true,
      onSuccess: (data) => {
        router.navigate({
          to: `/app/$orgId/events/$eventId`,
          params: {
            orgId,
            eventId: data.eventId,
          },
        })
      },
    })
  
    return <button
      onClick={() => newEventMutation.mutate()}
      className='
            px-3 h-8 flex items-center text-center justify-center
            bg-amber-300  rounded-sm text-sm font-medium
            active:brightness-90 active:pt-0.5
            self-center shrink-0 cursor-pointer 
        '
      style={style}>
      {
        newEventMutation.isPending
          ? <Spinner />
          : <span>Create event</span>
}
    </button>
  }