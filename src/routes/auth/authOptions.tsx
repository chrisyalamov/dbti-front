import { createFileRoute, Link } from '@tanstack/react-router'

import { z } from 'zod'
import { useQuery } from '@tanstack/react-query'
import { authOptions_queryOptionsObject } from '../../queries/authOptions'
import { Spinner } from '../../components/Spinner'
import { IoChevronBack } from 'react-icons/io5'
import { BiSolidEditAlt } from 'react-icons/bi'
import type { authOptionsSchema } from '../../validators/authOptions'
import authOptionPanelComponents from '../../components/inputs/AuthenticationPanels'
import { queryClient, router } from '../../main'
import { authState_queryOptionsObject } from '../../queries/authState'

const routeSearchSchema = z.object({
    email: z.string().email(),
})

export const Route = createFileRoute('/auth/authOptions')({
    component: RouteComponent,
    validateSearch: search => routeSearchSchema.parse(search),
})

type AuthOptionsProps = {
    email: string,
    options: z.infer<typeof authOptionsSchema>,
    uic: string
}

const AuthOptions = ({ email, options, uic }: AuthOptionsProps) => {

    const onSuccessfulLogin = async () => {
        await queryClient.invalidateQueries(authState_queryOptionsObject)

        const state = await queryClient.fetchQuery(authState_queryOptionsObject)

        console.log(state)
        state?.accountStatus !== "active"

        if (state?.accountStatus !== "active") {
            router.navigate({
                to: "/auth/confirmAccount",
                search: {
                    id: state?.userId
                }
            })   
            return
        }

        router.navigate({
            to: "/auth/orgSelector"
        })
    }

    return <div className='w-full'>
        <h1 className="text-2xl font-semibold">Making sure it's you</h1>
        <div className='my-1'>
            <span className='opacity-50'>Signing in as</span>
            <Link
                className='inline-flex items-center gap-1 hover:bg-neutral-400/20 active:bg-neutral-400/10 active:opacity-50 rounded px-1'
                to='/auth/login'>
                <span>{email}</span>
                <BiSolidEditAlt />
            </Link>
        </div>

        <div className='h-5' />

        <div className='flex flex-col gap-10 mt-5'>
            {
                options.map((option, index) => {
                    const OptionComponent = authOptionPanelComponents[option.type]
                    return <>
                        <div key={option.type} className='w-full'>
                            <OptionComponent uic={uic} handle={email} index={index} onSuccess={onSuccessfulLogin} />
                        </div>
                        {
                            index === options.length - 1
                                ? null
                                : <div className='flex gap-2 items-center'>
                                    <div className='w-full h-[1px] bg-neutral-500/20' />
                                    <span className='text-neutral-500'>or</span>
                                    <div className='w-full h-[1px] bg-neutral-500/20' />
                                </div>
                        }
                    </>
                })
            }
        </div>
    </div>
}

const UserNotFound = () => {
    return <div className='w-full'>
        <p className='text-red-600 font-semibold'>No user found with this email address.</p>
        <p>Please check the email address and try again.</p>
        <Link
            className='
            font-semibold text-sm px-2.5 w-full h-9 mt-10
            bg-neutral-400/10
            rounded leading-none cursor-pointer 
            active:pt-0.5 active:bg-neutral-500/10 active:button-sunk 
            [--overlay-strength:0] [--strength:0.1] 
            relative shrink-0 focus-visible:outline-2 -outline-offset-[3px] 
            outline-current focus-visible:outline-dashed
            flex items-center justify-center
            hover:not-[:active]:outline hover:outline-current/10 hover:-outline-offset-1
        '
            to='/auth/login'>
            <IoChevronBack />
            Back to login
        </Link>
    </div>
}

type UnknownErrorProps = {
    message: string
}

const UnknownError = ({ message }: UnknownErrorProps) => {
    return <div>
        <p className='font-semibold'>
            <span className='text-red-600'>An unknown error occured.</span>
        </p>
        <p className='text-sm opacity-60'>
            {message}
        </p>
    </div>
}

function RouteComponent() {
    const search = Route.useSearch()
    const authOptions = useQuery(authOptions_queryOptionsObject(search.email))

    return <div className="flex flex-col items-start justify-center stretch w-full">
        {
            authOptions.status === 'pending'
                ? <div className='items-center border-[0.5px] border-dashed border-neutral-500 bg-neutral-500/5 text-neutral-500 rounded w-full p-1 flex justify-center gap-2'>
                    <Spinner />
                    <span>Loading</span>
                </div>
                : authOptions.status === 'success'
                    ? <AuthOptions uic={authOptions.data.uic} email={search.email} options={authOptions.data.options} />
                    : authOptions.status === 'error'
                        ? authOptions.error.message === 'User not found'
                            ? <UserNotFound />
                            : <UnknownError message={authOptions.error.message} />
                        : null
        }
    </div >
}
