import { createFileRoute, Link } from '@tanstack/react-router'
import { orgDetails_queryOptionsObject } from '../../../../queries/orgDetails'
import { useQuery } from '@tanstack/react-query'
import { Header } from '../../../../components/Header'
import { orgLicenses_queryOptionsObject } from '../../../../queries/licenses.ts'
import { groupBy } from '../../../../utils/groupBy.ts'
import { z } from 'zod'
import { IoChevronDown, IoChevronForward } from 'react-icons/io5'
import { useState } from 'react'
import { LicenseRow, licenseSchema, LicenseStatusPill, type LicenseStatus } from '../../../../components/LicenseRow.tsx'

export const Route = createFileRoute('/app/$orgId/licensing/')({
  component: RouteComponent,
})

type GroupOfLicensesByStatusProps = {
  status: LicenseStatus
  licenses: z.infer<typeof licenseSchema>[]
}

function GroupOfLicensesByStatus({ status, licenses }: GroupOfLicensesByStatusProps) {
  const [open, setOpen] = useState(false)
  const { orgId } = Route.useParams()

  return <div className='
    w-full flex flex-col 
    gap-0.5 pointer-coarse:gap-1.5 
    border-hairline border-neutral-500/50 
    rounded p-2 px-3'
  >
    <div className='flex items-center gap-2 py-1'>
      <button
        onClick={() => setOpen(!open)}
        className='
          p-0.5 pointer-coarse:p-2 rounded-sm 
          hover:bg-neutral-500/10 active:bg-neutral-500/5 active:opacity-80 
          cursor-pointer
        '>
        {
          open
            ? <IoChevronDown className='text-neutral-500' />
            : <IoChevronForward className='text-neutral-500' />
        }
      </button>
      <LicenseStatusPill status={status} />
      <div className='h-0 grow' />
      <span className='
        text-sm font-medium leading-none p-0.5 px-1 
        border border-neutral-500/40 
        text-neutral-500
        rounded-sm 
      '>
        {licenses.length}
      </span>
    </div>
    {
      open && licenses.map((license) => (
        <LicenseRow
          key={license.licenseId}
          status={license.status}
          id={license.licenseId}
          type={license.licenseType}
          orgId={orgId}
        />
      ))
    }
  </div>
}

function LicenseBrowser({ licenses }: { licenses: any }) {
  // Validate shape of licenses object
  const parsedLicenses = z.array(licenseSchema).safeParse(licenses)

  console.log(licenses)

  if (!parsedLicenses.success) {
    console.error("Error parsing licenses", parsedLicenses.error)
    throw new Error("Unexpected error: malformed response")
  }

  if (parsedLicenses.data.length === 0) {
    return <p className='text-sm'>No licenses found</p>
  }

  let groupedLicenses;

  try {
    groupedLicenses = groupBy(parsedLicenses.data, (license: any) => license?.status)
  } catch (e) {
    throw new Error("Unexpected error occured")
  }


  return <div className='w-full flex flex-col gap-4'>
    {
      Object.keys(groupedLicenses).map((status) => {
        const licenses = groupedLicenses[status]
        return <GroupOfLicensesByStatus
          key={status}
          status={status as LicenseStatus}
          licenses={licenses}
        />
      })
    }
  </div>

}

function RouteComponent() {
  const { orgId } = Route.useParams()
  const orgDetails = useQuery({ ...orgDetails_queryOptionsObject(orgId), throwOnError: true })
  const orgLicenses = useQuery({ ...orgLicenses_queryOptionsObject(orgId), throwOnError: true })

  // Check if the user belongs to any orgnisations
  return <div>
    <Header backNav={{
      label: "Back to Organisation",
      linkProps: { to: "/app/$orgId" }
    }} />

    <div className='max-w-7xl mx-auto px-8 my-10 mt-20 flex justify-between gap-10'>
      <div>
        <p className='opacity-50 text-sm mb-1 line-clamp-1'>{
          orgDetails.isPending
            ? "Loading..."
            : orgDetails.data.name
        }</p>
        <h1 className='text-2xl font-medium'>Licensing</h1>
      </div>

      <Link
        to='/app/$orgId/licensing/purchase'
        params={{ orgId }}
        className='
            px-3 h-8 flex items-center
          bg-amber-300  rounded-sm text-sm font-medium
            active:brightness-90 active:pt-0.5
            self-center shrink-0
          '>
        Purchase licenses
      </Link>

    </div>

    <div className='
      max-w-7xl mx-auto px-8 w-full 
      flex items-stretch justify-between 
      gap-5 lg:gap-16 xl:gap-24 
      flex-col md:flex-row'
    >
      {
        orgLicenses.isPending
          ? <p className='text-sm'>Loading licenses...</p>
          : <LicenseBrowser licenses={orgLicenses.data} />
      }
    </div>

  </div>
}
