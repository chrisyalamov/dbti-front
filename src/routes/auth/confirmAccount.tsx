import { createFileRoute } from '@tanstack/react-router'

import { z } from 'zod'
import { InputWithSubmitButton } from '../../components/inputs/InputWithSubmitButton'
import { useMutation } from '@tanstack/react-query'
import { router } from '../../main'
import { useRef } from 'react'
import { BsInfoCircleFill } from 'react-icons/bs'

const routeSearchSchema = z.object({
    id: z.string().ulid()
})

export const Route = createFileRoute('/auth/confirmAccount')({
    component: RouteComponent,
    validateSearch: search => routeSearchSchema.parse(search),
})

function RouteComponent() {
    const formRef = useRef<HTMLFormElement>(null)

    const confirmAccountOperation = useMutation({
        mutationFn: async (data: FormData) => {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cais/user/activateAccount`, {
                method: 'POST',
                body: data,
                credentials: 'include',
            })

            if (!res.ok) {
                throw new Error('Invalid code')
            }
        },
        onSuccess: () => {
            router.navigate({
                to: '/auth/orgSelector'
            })
        }
    })

    return <div className="flex flex-col items-start justify-center stretch w-full">
        <h1 className="text-2xl font-medium">Activate account</h1>
        <p className='opacity-80'>To get started, enter the code that was just sent to your email.</p>
        <div className='my-5 p-3 border-hairline border-blue-500 rounded w-full flex'>
            <p>
                For the purposes of this demo, the one-time passcode is hard-coded as
                <span className='inline-block p-0.5 leading-none bg-neutral-500/10 text-neutral-500 font-mono mx-1 rounded-sm text-sm'>445566</span>. Please use this code to proceed.
            </p>
            <BsInfoCircleFill className='text-blue-500 text-lg shrink-0 m-1' />
        </div>
        <div className='h-10' />
        {
            confirmAccountOperation.isError && confirmAccountOperation?.error?.name !== "ZodError"
                ? (
                    <div className='rounded overflow-hidden bg-neutral-500/10 my-5 w-full'>
                        <div className='bg-red-600 text-white px-6 py-3 font-medium text-lg'>Error</div>
                        <div>
                            <div className='px-6 py-4'>
                                {confirmAccountOperation.error?.message}
                            </div>
                        </div>
                    </div>
                )
                : null
        }
        <form ref={formRef} onSubmit={(e) => {
            e.preventDefault()
            const formData = new FormData(e.currentTarget)
            confirmAccountOperation.mutate(formData)
        }}>
            <InputWithSubmitButton
                placeholder='000000'
                type='text'
                name='activationCode'
                loading={confirmAccountOperation.isPending}
                error={confirmAccountOperation.isError ? 'Invalid code' : undefined}
            />
        </form>
    </div>
}