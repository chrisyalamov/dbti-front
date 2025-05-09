import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Header } from "../../../../components/Header";
import { useQuery } from "@tanstack/react-query";
import { SpinnerSmooth } from "../../../../components/Spinner";
import { useRef, useState } from "react";
import { findErrorsForField } from "../../../../utils/forms";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { ErrorPanel } from "../../../../components/Error";
import { attendeeProfile_queryOptionsObject } from "../../../../queries/attendeeProfile";

export const Route = createFileRoute("/app/$orgId/events/$eventId/attendees/$attendeeId")({
  component: RouteComponent,
});

const LocalHeader = () => (
  <Header
    backNav={{
      label: "Back to event",
      linkProps: { to: "/app/$orgId/events/$eventId" },
    }}
  />
);

type AttendeePropsProps = {
  attendee: {
    fullName: string;
    email: string;
  };
};

const AttendeeProps = (props: AttendeePropsProps) => {
  const { eventId, orgId, attendeeId } = Route.useParams();

  const formRef = useRef<HTMLFormElement>(null);
  const [changesToSave, setChangesToSave] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const baseInputClassname = `
      border rounded-sm bg-transparent px-1.5 py-0.5
      border-transparent hover:border-neutral-500/20
      focus-visible:border-neutral-500/35 focus:outline-none
      not-focus:overflow-ellipsis focus-visible:bg-white
  `;

  const handleChange = () => {
    setChangesToSave(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const url = new URL(`${import.meta.env.VITE_BACKEND_URL}/events/updateAttendeeProfile`);

    const form = formRef?.current as HTMLFormElement;
    if (!form) return;
    const data = new FormData(form);

    const res = await fetch(url.toString(), {
      method: "POST",
      credentials: "include",
      body: data,
    });

    const json = await res.json();

    if (!res.ok || json?.success === false) {
      setError(json.error);
    } else {
      setError(null);
    }

    setLoading(false);
    setChangesToSave(false);
    return json;
  };

  return (
    <form onSubmit={handleSubmit} ref={formRef}>
      <fieldset
        disabled={loading}
        className={`
            grid grid-cols-[auto_1fr] items-start gap-x-5 gap-y-1 
            rounded-sm border border-neutral-500/20 p-2 px-3.5 text-sm
            ${loading ? "opacity-50" : ""}
            [&:has(:focus)]:bg-neutral-500/5
          `}
      >
        <p className="py-0.5 font-medium">Name</p>
        <input type="hidden" name="eventId" value={eventId} />
        <input type="hidden" name="organisationId" value={orgId} />
        <input type="hidden" name="attendeeProfileId" value={attendeeId} />
        <input
          type="text"
          name="fullName"
          placeholder="Event name"
          defaultValue={props.attendee.fullName}
          className={baseInputClassname}
          style={findErrorsForField(error, "fullName") && { borderColor: "red", borderStyle: "dashed" }}
          onChange={handleChange}
        />
        <p className="py-0.5 font-medium">Email</p>
        <input
          type="email"
          name="email"
          placeholder="Email"
          defaultValue={props.attendee.email}
          className={baseInputClassname}
          style={findErrorsForField(error, "email") && { borderColor: "red", borderStyle: "dashed" }}
          onChange={handleChange}
        />

        {
          changesToSave && (
            <button
              type="submit"
              className="
                text-sm px-2.5  h-9 flex items-center justify-center
                rounded w-full cursor-pointer
                bg-neutral-900 text-white mb-2 mt-10
                active:pt-0.5 active:opacity-90 col-span-full
            ">
              Save changes
            </button>
          )
        }

        <div className="col-span-full">
          {
            error
              ? error?.message
                ? (<p className="text-red-600 flex items-center gap-2 my-3">
                  <span className="text-xs line-clamp-1">{error.message}</span>
                </p>)
                : error?.issues?.map((issue: any) => (
                  <p key={issue.path[0]} className="items-center gap-2 my-3">
                    <span className="text-xs">{issue.path[0]}: </span>
                    <span className="text-xs text-red-600">{issue.message}</span>
                  </p>
                ))
              : null
          }
        </div>
      </fieldset>
    </form>
  );
};

const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <ErrorPanel>
      <div className="px-6 py-3">
        <p>{error.message}</p>
        <button
          className="
          text-sm px-3  h-8 flex items-center justify-center gap-2
          rounded-sm cursor-pointer
          bg-white ring-[0.5px] ring-neutral-500/40
          active:bg-neutral-500/10 active:ring-neutral-500/40
          active:pt-0.5 active:opacity-90
        "
          onClick={() => resetErrorBoundary()}
        >
          <span>Go back and retry</span>
        </button>
      </div>
    </ErrorPanel>
  );
}

function RouteComponent() {
  const { attendeeId } = Route.useParams();

  const attendeeProfileQuery = useQuery({
    ...attendeeProfile_queryOptionsObject(attendeeId),
    throwOnError: true,
  });

  if (attendeeProfileQuery.isLoading || attendeeProfileQuery.isFetching || attendeeProfileQuery.isPending) {
    return (
      <div className="flex h-screen flex-col">
        <LocalHeader />
        <div className="flex grow flex-col items-center justify-center">
          <SpinnerSmooth />
        </div>
      </div>
    );
  }

  const attendeeProfile = attendeeProfileQuery.data;

  return (
    <div>
      <LocalHeader />

      <div className="mx-auto my-10 mt-20 max-w-7xl px-8">
        <h1 className="text-2xl font-medium">
          Attendee profile
        </h1>

        <div className="mt-5 grid gap-5 gap-x-16 md:grid-cols-2 lg:grid-cols-[1fr_2fr]">
          <ErrorBoundary fallbackRender={ErrorFallback}>
            <AttendeeProps attendee={attendeeProfile as any} />
            <Outlet />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}
