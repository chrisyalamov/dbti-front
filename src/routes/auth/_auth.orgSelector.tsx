import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { availableOrgs_queryOptionsObject } from '../../queries/availableOrgs'
import { Spinner } from '../../components/Spinner'
import { ErrorPanel } from '../../components/Error'
import { IoAdd } from 'react-icons/io5'

export const Route = createFileRoute('/auth/_auth/orgSelector')({
    component: RouteComponent,
})

type Organisation = {
    organisationId: string,
    organisationName: string,
    organisationLogoUrl: string,
}

function NoOrgs() {
    return <div className='flex justify-between items-center gap-x-4 gap-y-4 flex-wrap'>
        <p className='text-neutral-500'>No organisations available</p>

        <Link
            className='
                h-8 px-3.5 rounded-sm w-max shrink-0
                bg-white border-hairline border-neutral-500/40 
                cursor-pointer flex items-center gap-2 text-sm
                active:bg-neutral-500/10 active:pt-0.5 active:[&>*]:opacity-80 
                focus-visible:focus-ring
            '
            to="/app/newOrg"
        >
            <IoAdd />
            <span>Create organisation</span>
        </Link>
    </div>
}

function OrgLink({ org }: { org: Organisation }) {
    return <Link
        to="/app/$orgId"
        params={{ orgId: org.organisationId }}
        className='flex items-center gap-2 p-1 active:pt-1.5 active:pb-0.5 rounded-sm hover:bg-neutral-500/5 active:bg-neutral-500/20 active:[&>*]:opacity-70'>
        <div className='size-6 rounded-sm bg-neutral-500/20 text-neutral-500 flex items-center justify-center font-light'>
            {org.organisationName[0]}
        </div>
        <span className='font-medium'>{org.organisationName}</span>
    </Link>
}

function OrgSelector({ organisations }: { organisations: Organisation[] }) {
    return <div className='flex flex-col gap-2'>
        {
            organisations.map((org) => {
                return <OrgLink key={org.organisationId} org={org} />
            })
        }
        <Link
            className='
                h-9 px-3.5 rounded-sm w-full shrink-0
                bg-white border-hairline border-neutral-500/40 
                cursor-pointer flex items-center justify-center gap-2 text-sm
                active:bg-neutral-500/10 active:pt-0.5 active:[&>*]:opacity-80 
                focus-visible:focus-ring
            '
            to="/app/newOrg"
        >
            <IoAdd />
            <span>Create organisation</span>
        </Link>
    </div>
}

function RouteComponent() {
    const availableOrgs = useQuery(availableOrgs_queryOptionsObject)

    return <div className='w-full'>
        <h1 className="text-2xl font-medium">Organisations</h1>
        <p className='opacity-80'>Select which organisation you wish to access.</p>

        <div className='h-10' />
        {
            availableOrgs.isLoading
                ? <Spinner />
                : availableOrgs.isError
                    ? <ErrorPanel>
                        <div className='px-6 py-3'>{availableOrgs.error.message}</div>
                    </ErrorPanel>
                    : availableOrgs.data.length === 0
                        ? <NoOrgs />
                        : <OrgSelector organisations={availableOrgs.data} />
        }
    </div>
}
