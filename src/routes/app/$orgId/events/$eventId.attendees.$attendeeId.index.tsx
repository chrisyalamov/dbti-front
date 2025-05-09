import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router'
import { attendeeLicenses_queryOptionsObject } from '../../../../queries/attendeeProfile';
import { SpinnerSmooth } from '../../../../components/Spinner';
import { Link } from '@tanstack/react-router';
import { LicenseStatusPill } from '../../../../components/LicenseRow';

export const Route = createFileRoute(
    '/app/$orgId/events/$eventId/attendees/$attendeeId/',
)({
    component: RouteComponent,
})

const AttendeeLicenseBrowser = () => {
    const { attendeeId, eventId, orgId } = Route.useParams();

    const attendeeLicensesQuery = useQuery({
        ...attendeeLicenses_queryOptionsObject(attendeeId),
        throwOnError: true,
    });

    if (attendeeLicensesQuery.isLoading || attendeeLicensesQuery.isFetching || attendeeLicensesQuery.isPending) {
        return (
            <div className="flex grow flex-col items-center justify-center">
                <SpinnerSmooth />
            </div>
        );
    }

    const licenses = attendeeLicensesQuery.data;

    if (!licenses || licenses.length === 0) {
        return (
            <div className="flex grow flex-col items-center justify-center">
                <p className="font-medium">No licenses found</p>
                <p className="text-sm opacity-60">Would you like to assign a new license?</p>
                <Link
                    to="/app/$orgId/events/$eventId/attendees/$attendeeId/assign"
                    params={{
                        orgId,
                        eventId,
                        attendeeId,
                    }}
                    className="
                        text-sm px-3  h-8 flex items-center justify-center gap-2
                        rounded-sm cursor-pointer
                        bg-white ring-[0.5px] ring-neutral-500/40
                        active:bg-neutral-500/10 active:ring-neutral-500/40
                        active:pt-0.5 active:opacity-90 my-4
                    "
                >
                    <span>Assign new license</span>
                </Link>
            </div>
        );
    }

    console.log(licenses)

    return (
        <div className="grid gap-5">
            <div className='flex items-start justify-between pb-10 border-b border-neutral-500/20'>
                <h2 className="text-xl font-medium">Licenses</h2>
                <Link
                    to="/app/$orgId/events/$eventId/attendees/$attendeeId/assign"
                    params={{
                        orgId,
                        eventId,
                        attendeeId,
                    }}
                    className="
                        text-sm px-3  h-8 flex items-center justify-center gap-2
                        rounded-sm cursor-pointer
                        bg-white ring-[0.5px] ring-neutral-500/40
                        active:bg-neutral-500/10 active:ring-neutral-500/40
                        active:pt-0.5 active:opacity-90 my-4
                    "
                >
                    <span>Assign new license</span>
                </Link>

            </div>
            <div className="grid">
                {licenses.map((license: any) => (
                    <div key={license.id} className="
                        not-last:border-b-hairline border-neutral-500/20 py-2 group
                        flex items-center gap-x-5
                    ">
                        <p className='font-[Share_Tech_Mono]'>{license.licenses.licenseId}</p>
                        <div className='grow' />
                        <p className='uppercase text-xs font-medium text-neutral-500 ring ring-inset ring-neutral-500/20 rounded-sm leading-none p-1'>{license.licenses.licenseType}</p>
                        <LicenseStatusPill status={license.licenses?.status} />
                    </div>
                ))}
            </div>
        </div>
    );
}

function RouteComponent() {
    return <AttendeeLicenseBrowser />
}
