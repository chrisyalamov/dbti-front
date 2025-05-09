import { createFileRoute, Link } from '@tanstack/react-router'
import { license_queryOptionsObject } from '../../../../queries/licenses'
import { SpinnerSmooth } from '../../../../components/Spinner'
import { Header } from '../../../../components/Header'
import { useMutation, useQuery } from '@tanstack/react-query'
import { IoAttachOutline } from 'react-icons/io5'
import { queryClient } from '../../../../main'
import { TbUnlink } from 'react-icons/tb'

export const Route = createFileRoute(
  '/app/$orgId/licensing/license/$licenseId',
)({
  component: RouteComponent,
})

type UnassignButtonProps = {
  licenseId: string
  attendeeProfileId: string
  status: string
}

const UnassignButton = ({ licenseId, attendeeProfileId, status }: UnassignButtonProps) => {
  const unassignMutation = useMutation({
    mutationFn: async () => {
      const url = new URL(`${import.meta.env.VITE_BACKEND_URL}/licenses/unassignFromAttendeeProfile`)
      url.searchParams.append('licenseId', licenseId)
      url.searchParams.append('attendeeProfileId', attendeeProfileId)

      await fetch(url, {
        method: 'POST',
        credentials: 'include',
      })

      queryClient.invalidateQueries({
        queryKey: ['license', licenseId],
      })

      return null
    },
    mutationKey: ['unassign', licenseId, attendeeProfileId],
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    unassignMutation.mutate()
  }

  if (status === 'assigned') {
    return (
      <form className='contents' onSubmit={handleSubmit}>
        <div className='w-px h-16 bg-neutral-500/20' />
        <button
          className='
            text-sm px-4 h-9 flex items-center justify-center gap-2
            rounded-sm cursor-pointer
            bg-white ring-[0.5px] ring-neutral-500/40
            active:bg-neutral-500/10 active:ring-neutral-500/40
            active:pt-0.5 active:opacity-90
          '
          type='submit'
        >
          {unassignMutation.isPending
            ?
            <SpinnerSmooth />
            : <>
              <TbUnlink className="text-lg" />
              Unassign license
            </>
          }
        </button>
      </form>
    )
  } else {
    return <></>
  }
}

function RouteComponent() {
  const { orgId, licenseId } = Route.useParams() as any

  const license = useQuery({
    ...license_queryOptionsObject(licenseId, orgId),
    throwOnError: true,
  })

  if (license.isLoading || license.isFetching || license.isPending) {
    return (
      <div className="flex grow flex-col items-center justify-center">
        <SpinnerSmooth />
      </div>
    )
  }

  return <div>
    <Header
      backNav={{
        label: "Back to licensing dashboard",
        linkProps: { to: "/app/$orgId/licensing", params: { orgId } },
      }}
    />
    <div className='my-32 flex items-center flex-col'>
      <div className='bg-amber-300 rounded-sm px-5 py-2'>

        <div className='flex items-center justify-between gap-10'>
          <h2 className='font-medium shrink-0'>License</h2>
          <p className='text-sm opacity-50 font-[Share_Tech_Mono] shrink line-clamp-1 break-words'>{license?.data?.[0].licenses.licenseId}</p>
        </div>

        <div className='grid grid-cols-[auto_1fr] gap-x-10 gap-y-1.5 mt-16 text-sm'>
          <p className='font-medium'>Type</p>
          <p className='opacity-80 capitalize px-1'>{license?.data?.[0].licenses.licenseType}</p>
          <p className='font-medium'>Purchase order</p>
          <Link
            to="/app/$orgId/billing/po/$poId"
            params={{ orgId, poId: license?.data?.[0].licenses.purchaseOrderId }}
            className='opacity-80 font-[Share_Tech_Mono] line-clamp-1 break-words rounded-sm hover:bg-neutral-500/10 active:bg-neutral-500/5 px-1 flex items-center gap-1'
          >
            {license?.data?.[0].licenses.purchaseOrderId}
            <IoAttachOutline className='text-lg' />
          </Link>
        </div>
      </div>

      {
        license?.data?.[0].licenses.status === 'assigned' && license?.data?.[0]?.license_assignments?.targetType === 'attendeeProfile'
          ? <UnassignButton
            licenseId={license?.data?.[0].licenses.licenseId}
            attendeeProfileId={license?.data?.[0].license_assignments?.targetId}
            status={license?.data?.[0].licenses.status}
          />
          : null
      }


      <div className='w-px h-16 bg-neutral-500/20' />

      <div className='border border-neutral-500/40 rounded-sm'>
        {
          license?.data?.[0].license_assignments
            ? <div>
              <h2 className='font-medium px-5 py-2 bg-neutral-500/10 border-b border-blue-500'>Assigned to</h2>
              <div className='flex items-center justify-between gap-10 px-5 py-2 text-sm'>
                <p>{license?.data?.[0].license_assignments?.targetType}</p>
                <p className='font-[Share_Tech_Mono]'>{license?.data?.[0].license_assignments?.targetId}</p>
              </div>
            </div>
            : <p className='px-4 py-2.5'>This license is not assigned to anything.</p>
        }
      </div>
    </div>
  </div>
}
