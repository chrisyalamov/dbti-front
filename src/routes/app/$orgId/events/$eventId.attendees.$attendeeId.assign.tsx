import { useMutation, useQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router'
import { SpinnerSmooth } from '../../../../components/Spinner';
import { IoCloseCircle } from 'react-icons/io5';
import { orgLicenses_queryOptionsObject } from '../../../../queries/licenses';
import { queryClient, router } from '../../../../main';

export const Route = createFileRoute(
  '/app/$orgId/events/$eventId/attendees/$attendeeId/assign',
)({
  component: RouteComponent,
})

const CloseButton = () => {
  const { orgId, eventId, attendeeId } = Route.useParams();

  return <Link
    to="/app/$orgId/events/$eventId/attendees/$attendeeId"
    params={{ orgId, eventId, attendeeId }}
  >
    <IoCloseCircle className="
      ml-auto mb-4
      text-xl opacity-50 hover:opacity-70 active:*:opacity-30
  " />
  </Link>
}

const NoLicenses = () => {
  const { orgId } = Route.useParams();

  return (
    <div className="flex grow flex-col items-center justify-center my-20">
      <p className="font-medium">No licenses available</p>
      <p className="text-sm opacity-60">Would you like to purchase licenses?</p>
      <Link
        to="/app/$orgId/licensing"
        params={{ orgId }}
        className="
          text-sm px-3  h-8 flex items-center justify-center gap-2
          rounded-sm cursor-pointer
          bg-white ring-[0.5px] ring-neutral-500/40
          active:bg-neutral-500/10 active:ring-neutral-500/40
          active:pt-0.5 active:opacity-90 my-4
        ">
        <span>Purchase licenses</span>
      </Link>
    </div>
  )
}

const LicensePicker = () => {
  const { orgId, eventId, attendeeId } = Route.useParams();

  const licenses = useQuery({
    ...orgLicenses_queryOptionsObject(orgId),
    throwOnError: true,
  });

  const assignmentMutation = useMutation({
    mutationFn: async (licenseId: string) => {
      console.log(`Assigning license ${licenseId} to attendee ${attendeeId}`);

      const url = new URL(`${import.meta.env.VITE_BACKEND_URL}/licenses/assignToAttendeeProfile`);
      url.searchParams.append('attendeeProfileId', attendeeId);
      url.searchParams.append('licenseId', licenseId);
      url.searchParams.append('organisationId', orgId);

      const res = await fetch(url.toString(), {
        method: 'POST',
        credentials: 'include',
      });

      const json = await res?.json();

      if (!res.ok || json.error) {
        throw new Error(json.error.message || 'Failed to assign license');
      }

      queryClient.invalidateQueries({
        queryKey: ['attendeeLicenses', attendeeId],
      });
      queryClient.invalidateQueries({
        queryKey: ['orgLicenses', orgId],
      });
      router.navigate({
        to: '/app/$orgId/events/$eventId/attendees/$attendeeId',
        params: {
          orgId,
          eventId,
          attendeeId,
        },
      })

      return json;
    }
  });

  if (licenses.isLoading || licenses.isFetching || licenses.isPending || assignmentMutation.isPending) {
    return (
      <div className="flex grow flex-col items-center justify-center">
        <SpinnerSmooth />
      </div>
    );
  }

  if (!licenses.data || licenses.data.length === 0) {
    return <NoLicenses />;
  }

  const availableLicenses = licenses.data.filter((license: any) => license.status === 'available');

  if (availableLicenses.length === 0) {
    return <NoLicenses />;
  }

  const handleClick = async (licenseId: string) => { assignmentMutation.mutate(licenseId); }

  return (
    <div className="grid gap-5">
      <h2 className="text-green-600 w-full rounded p-1 text-center bg-green-500/5">Available Licenses</h2>
      <div>
        {availableLicenses.map((license: any) => (
          <div key={license.id} className="
            not-last:border-b-hairline border-neutral-500/20 py-2 group
            flex items-center gap-x-5
          ">
            <p className='font-[Share_Tech_Mono]'>{license.licenseId}</p>
            <div className='grow' />
            <p className='uppercase text-neutral-500 bg-neutral-500/10 rounded-sm leading-none p-1 text-xs'>{license.licenseType}</p>
            <button
              className="
                text-xs px-3 h-6 flex items-center justify-center gap-2
                rounded-sm cursor-pointer
                bg-white ring-[0.5px] ring-neutral-500/40
                active:bg-neutral-500/10 active:ring-neutral-500/40
                active:pt-0.5 active:opacity-90
                opacity-70 group-hover:opacity-100
              "
              onClick={() => handleClick(license.licenseId)}
            >
              <span>Assign license</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );

}

function RouteComponent() {
  return <div className='bg-neutral-500/5 rounded-lg p-4'>
    <div className='flex items-center justify-between'>
      <h1 className="font-medium mb-4">Assign license to attendee</h1>
      <CloseButton />
    </div>
    <p className="text-sm opacity-60 mb-4">Select a license to assign to the attendee.</p>
    <LicensePicker />
  </div>
}
