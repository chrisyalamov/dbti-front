import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { router } from '../../main'
import { z } from 'zod'
import { useQuery } from '@tanstack/react-query'
import { authState_queryOptionsObject } from '../../queries/authState'

export const Route = createFileRoute('/auth/login')({
  component: RouteComponent,
})


function RouteComponent() {
  const [err, setErr] = useState<string | null>(null)
  const authState = useQuery(authState_queryOptionsObject)

  if (authState.isSuccess) {
    if (authState.data.userId) {
      router.navigate({
        to: '/auth/orgSelector',
      })
    }
  }

  const formAction = async (data: FormData) => {
    const email = z.string().email().safeParse(data.get('email'))
    if (!email.success) {
      setErr('Invalid email')
      return
    }
    router.navigate({
      to: '/auth/authOptions',
      search: {
        email: email.data
      },
    })
  }

  return <div className="flex flex-col items-start justify-center stretch w-full">
    <h1 className="text-2xl font-medium">Login</h1>
    <p className="opacity-50 my-1">Please log in to continue.</p>
    <div className='h-10' />
    <form action={formAction} className='contents'>
      <div className='my-3 w-full'>
        <input id="email" name='email' type='text' className={`border-hairline ${err ? "border-dashed border-red-500" : " border-gray-500/50"} rounded-md px-3 py-1.5 w-full focus:outline-none focus:border-neutral-500`} placeholder='Email' />
        {
          err
            ? <span className='text-sm text-red-600'>Invalid email format</span>
            : null
        }
      </div>
      <button
        type='submit'
        className='
          text-sm px-10  h-10
          rounded cursor-pointer
          bg-neutral-900 text-white
          active:pt-0.5
          select-none
          active:opacity-95
          active:[&>*]:opacity-80
          relative shrink-0 
          font-medium
          focus-visible:focus-ring
        '
      >
        <span>Continue</span>
      </button>

    </form>
  </div>

}
