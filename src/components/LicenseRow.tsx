import { Link } from "@tanstack/react-router"
import { IoChevronForward } from "react-icons/io5"
import { z } from "zod"

export type LicenseStatus = z.infer<typeof licenseStatusEnum>
export type LicenseRowProps = {
    id: string
    status: LicenseStatus
    type: string
    orgId: string
}

export const licenseStatusEnum = z.enum(["available", "assigned", "consumed", "expired"])
export const licenseSchema = z.object({
    licenseId: z.string().ulid(),
    status: licenseStatusEnum,
    licenseType: z.string()
})

export const statusColorMap: Record<LicenseStatus, string> = {
    available: "var(--color-blue-600)",
    assigned: "var(--color-green-600)",
    consumed: "var(--color-red-600)",
    expired: "var(--color-stone-700)"
}

export function LicenseStatusPill({ status }: { status: LicenseStatus }) {
    return <span className="
      p-1 px-1.5 
      leading-none 
      text-xs font-medium uppercase
      bg-current/5 rounded-sm
    "
        style={{
            color: statusColorMap[status]
        }}
    >
        {status}
    </span>
}

export function LicenseRow({ id, type, orgId }: LicenseRowProps) {
    return <Link
        to='/app/$orgId/licensing/license/$licenseId'
        params={{ licenseId: id, orgId }}
        className='
        flex items-center justify-between leading-none pointer-coarse:py-2 px-1 py-0.5
        hover:bg-neutral-500/20 active:bg-neutral-500/10 active:opacity-80 
        cursor-pointer rounded-sm gap-4 group first-of-type:mt-2
        odd:bg-neutral-300/5
        '
    >
        <span className='
            font-[Share_Tech_Mono] tracking-wide text-sm 
            text-neutral-500 line-clamp-1 
            shrink break-words
            '>
            {id}
        </span>
        <div className='h-0 grow' />
        <span className='text-sm capitalize'>{type}</span>
        <IoChevronForward className='opacity-10 shrink-0 group-hover:opacity-100' />
    </Link>
}