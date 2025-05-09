import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "../../../../components/Header";
import { useMutation, useQuery } from "@tanstack/react-query";
import { event_queryOptionsObject } from "../../../../queries/events";
import { Spinner, SpinnerSmooth } from "../../../../components/Spinner";
import { useRef, useState } from "react";
import { findErrorsForField } from "../../../../utils/forms";
import { DateTime } from "luxon";
import { IoAdd, IoChevronForward } from "react-icons/io5";
import { queryClient, router } from "../../../../main";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { ErrorPanel } from "../../../../components/Error";

export const Route = createFileRoute("/app/$orgId/events/$eventId/")({
  component: RouteComponent,
});

const LocalHeader = () => (
  <Header
    backNav={{
      label: "Back to Events",
      linkProps: { to: "/app/$orgId/events" },
    }}
  />
);

type EventPropsProps = {
  event: {
    name: string;
    description: string;
    location: string;
    startDate: string;
    endDate: string;
    eventStatus: string;
  };
};

const DeleteButton = () => {
  const { orgId, eventId } = Route.useParams();

  const deleteEventMutation = useMutation({
    mutationFn: async () => {
      const url = new URL(`${import.meta.env.VITE_BACKEND_URL}/events/deleteEvent`);
      url.searchParams.append("organisationId", orgId);
      url.searchParams.append("eventId", eventId);

      const res = await fetch(url.toString(), {
        method: "POST",
        credentials: "include",
      });

      const json = await res.json();

      if (!res.ok || json?.success === false) {
        throw new Error(json?.error?.message || "Failed to delete event");
      }

      router.navigate({
        to: "/app/$orgId/events",
        params: {
          orgId,
        },
      });

      return json;
    },
    mutationKey: ["deleteEvent"],
    throwOnError: true,
  });

  const handleDelete = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    deleteEventMutation.mutate();
  };

  return <form onSubmit={handleDelete}>
    <input type="hidden" name="eventId" value={eventId} />
    <input type="hidden" name="organisationId" value={orgId} />
    <button
      className="
      text-sm px-2.5  h-9 flex items-center justify-center
      rounded w-full cursor-pointer
      bg-red-500 text-white my-4
      active:pt-0.5 active:opacity-90 col-span-full
    "
    >
      {
        deleteEventMutation.isPending
          ? <Spinner />
          : <span>Delete event</span>
      }
    </button>
  </form>
}

const EventProps = (props: EventPropsProps) => {
  const { eventId, orgId } = Route.useParams();
  const formRef = useRef<HTMLFormElement>(null);
  const [changesToSave, setChangesToSave] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const startDate = DateTime.fromISO(props.event.startDate).toLocal().toFormat("yyyy-LL-dd'T'HH:mm");
  const endDate = DateTime.fromISO(props.event.endDate).toLocal().toFormat("yyyy-LL-dd'T'HH:mm");

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
    const url = new URL(`${import.meta.env.VITE_BACKEND_URL}/events/updateEvent`);

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
    }

    setLoading(false);
    await queryClient.invalidateQueries({
      queryKey: ["event", eventId],
    })
    return json;
  };

  const statusSelectOptions = [
    { value: "planned", label: "Planned" },
    { value: "upcoming", label: "Upcoming" },
    { value: "live", label: "Live" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  return (
    <div>
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
          <input
            type="text"
            name="name"
            placeholder="Event name"
            defaultValue={props.event.name}
            className={baseInputClassname}
            style={findErrorsForField(error, "name") && { borderColor: "red", borderStyle: "dashed" }}
            onChange={handleChange}
          />
          <p className="py-0.5 font-medium">Description</p>
          <textarea
            name="description"
            className={baseInputClassname}
            placeholder="Event description"
            rows={6}
            defaultValue={props.event.description}
            style={findErrorsForField(error, "description") && { borderColor: "red", borderStyle: "dashed" }}
            onChange={handleChange}
          />
          <p className="py-0.5 font-medium">Location</p>
          <input
            type="text"
            name="location"
            placeholder="Location"
            defaultValue={props.event.location}
            className={baseInputClassname}
            style={findErrorsForField(error, "location") && { borderColor: "red", borderStyle: "dashed" }}
            onChange={handleChange}
          />
          <p className="py-0.5 font-medium">Start date and time</p>
          <input
            type="datetime-local"
            name="startDate"
            defaultValue={startDate}
            className={baseInputClassname}
            style={findErrorsForField(error, "startDate") && { borderColor: "red", borderStyle: "dashed" }}
            onChange={handleChange}
          />
          <p className="py-0.5 font-medium">End date and time</p>
          <input
            type="datetime-local"
            name="endDate"
            defaultValue={endDate}
            className={baseInputClassname}
            style={findErrorsForField(error, "endDate") && { borderColor: "red", borderStyle: "dashed" }}
            onChange={handleChange}
          />
          <p className="py-0.5 font-medium">Status</p>
          <select
            name="eventStatus"
            className={`
              ${baseInputClassname} 
              cursor-pointer
            `}
            onChange={handleChange}
            style={{
              paddingLeft: "0.15rem",
              ...findErrorsForField(error, "status") && { borderColor: "red", borderStyle: "dashed" }
            }}
          >
            {
              statusSelectOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  selected={option.value === props.event.eventStatus}
                >
                  <p>{option.label}</p>
                </option>
              ))}
          </select>

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
                ? error?.error?.message
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
      <DeleteButton />
    </div>
  );
};

const AddAttendeeButton = () => {
  const { orgId, eventId } = Route.useParams();

  const newAttendeeMutation = useMutation({
    mutationFn: async () => {
      const url = new URL(`${import.meta.env.VITE_BACKEND_URL}/events/newAttendeeProfile`)
      url.searchParams.append('organisationId', orgId)
      url.searchParams.append('eventId', eventId)

      const res = await fetch(url.toString(), {
        method: 'POST',
        credentials: 'include',
      })

      const json = await res.json()

      if (!res.ok || json?.success === false) {
        throw new Error(json?.error?.message || 'Failed to create new attendee')
      }

      return json
    },
    mutationKey: ['createAttendee'],
    throwOnError: true,
    onSuccess: (data) => {
      router.navigate({
        to: "/app/$orgId/events/$eventId/attendees/$attendeeId",
        params: {
          orgId,
          eventId: eventId,
          attendeeId: data[0].attendeeProfileId,
        },
      })
    },
  })

  return <button
    onClick={() => newAttendeeMutation.mutate()}
    className="
      text-sm px-3  h-8 flex items-center justify-center gap-2
      rounded-sm cursor-pointer
      bg-white ring-[0.5px] ring-neutral-500/40
      active:bg-neutral-500/10 active:ring-neutral-500/40
      active:pt-0.5 active:opacity-90
">
    {
      newAttendeeMutation.isPending
        ? <Spinner />
        : <>
          <IoAdd />
          <span className="text-sm">Add attendee</span>
        </>
    }
  </button>
}

const AttendeeRow = (props: { attendee: any }) => {
  const { orgId, eventId } = Route.useParams();
  return (
    <Link
      to="/app/$orgId/events/$eventId/attendees/$attendeeId"
      params={{
        attendeeId: props.attendee.attendeeProfileId,
        orgId,
        eventId,
      }}
      className="
        flex items-center gap-2 group
        hover:bg-neutral-500/5 active:bg-neutral-500/10
        rounded-sm cursor-pointer
        py-1 px-2
      "
    >
      <div className="rounded-full text-neutral-500 bg-neutral-500/10 size-6 text-xs flex items-center justify-center">
        {props.attendee.fullName[0]}
      </div>
      <p style={
        props.attendee?.fullName === "" ? { opacity: 0.5 } : {}
      }>
        {props.attendee.fullName || "New attendee"}
      </p>
      <div className="grow" />
      <IoChevronForward className='opacity-10 shrink-0 group-hover:opacity-100' />
    </Link>
  );
}

const AttendeeList = (props: { attendees: any[] }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-5">
        <h2 className="text-lg font-medium">Attendees</h2>
        <AddAttendeeButton />
      </div>
      <div className="flex flex-col gap-1">
        {
          props.attendees.map((attendee) => (
            <AttendeeRow key={attendee.attendeeId} attendee={attendee} />
          ))
        }
        {
          props.attendees.length === 0 && (
            <div className="flex items-center justify-center text-center text-balance flex-col gap-2 group bg-neutral-500/5 rounded-lg p-5">
              <p>No attendees yet</p>
              <p className="text-sm opacity-50">Click the button in the top right hand corner to add an attendee!</p>
            </div>
          )
        }
      </div>
    </div>
  );
}

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
  const { eventId } = Route.useParams();

  const eventQuery = useQuery({
    ...event_queryOptionsObject(eventId),
    throwOnError: true,
  });

  if (eventQuery.isLoading || eventQuery.isFetching || eventQuery.isPending) {
    return (
      <div className="flex h-screen flex-col">
        <LocalHeader />
        <div className="flex grow flex-col items-center justify-center">
          <SpinnerSmooth />
        </div>
      </div>
    );
  }

  const { event, attendeeProfiles } = eventQuery?.data || {};

  return (
    <div>
      <LocalHeader />

      <div className="mx-auto my-10 mt-20 max-w-7xl px-8">
        {event?.name == "" ? (
          <h1 className="text-2xl font-medium opacity-50">Untitled event</h1>
        ) : (
          <h1 className="text-2xl font-medium">{event?.name}</h1>
        )}
        <div className="mt-5 grid gap-5 gap-x-16 md:grid-cols-2 lg:grid-cols-[1fr_2fr]">
          <ErrorBoundary fallbackRender={ErrorFallback}>
            <EventProps event={event as any} />
            <AttendeeList attendees={attendeeProfiles} />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}
