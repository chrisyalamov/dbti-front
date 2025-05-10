import { createFileRoute, Link } from '@tanstack/react-router'
import { Header } from '../../../../components/Header'
import { eventsForOrg_queryOptionsObject } from '../../../../queries/events'
import { useQuery } from '@tanstack/react-query'
import { DateTime } from 'luxon'
import { IoArrowForward } from 'react-icons/io5'
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary'
import { ErrorPanel } from '../../../../components/Error'
import { CreateEventButton } from '../../../../components/CreateEventButton'
import { orgDetails_queryOptionsObject } from '../../../../queries/orgDetails'

export const Route = createFileRoute('/app/$orgId/events/')({
  component: RouteComponent,
})

type EventBlockProps = {
  event: {
    eventId: string
    organisationId: string
    name: string
    description: string
    location: string
    startDate: string
    endDate: string
  }
}

const EventBlock = (props: EventBlockProps) => {
  const { event } = props
  const startDate = DateTime.fromISO(event.startDate).toFormat("d MMM")
  const endDate = DateTime.fromISO(event.endDate).toFormat("d MMM")

  console.log(event)

  return <Link
    to="/app/$orgId/events/$eventId"
    params={{ orgId: event.organisationId, eventId: event.eventId }}
    className='
      rounded-sm group
      ring ring-inset ring-neutral-500/40 
      active:bg-neutral-500/5 active:[&>*]:opacity-70
      flex flex-col overflow-hidden
    '
  >
    <div className='text-balance max-w-[60ch] px-5 py-3.5 grow'>
      {
        event.name !== ""
          ? <h2 className='text-lg font-medium group-hover:underline underline-offset-4 decoration-neutral-500/20'>{event.name}</h2>
          : <h2 className='text-lg font-medium  text-neutral-500/50 group-hover:underline underline-offset-4 decoration-neutral-500/20'>Untitled Event</h2>
      }
      {
        event.description !== ""
          ? <p className='text-sm opacity-60'>{event.description}</p>
          : <p className='text-sm opacity-60 text-neutral-500/50 '>No description</p>
      }
      <p className='text-sm opacity-50 mt-5'>{event.location}</p>
    </div>
    <div className='bg-neutral-500/5 group-hover:bg-amber-400/15 flex items-center text-sm gap-4 px-6 py-2'>
      <span>{startDate}</span>
      <div className='grow h-px' style={{
        background: `linear-gradient(to right, transparent, rgb(120 120 120 / 20%), transparent)`,
      }}></div>
      <span>{endDate}</span>
      <IoArrowForward className='text-neutral-500/40 size-5 p-0.5 rounded-sm bg-white' />
    </div>
  </Link>
}

function ErrorFallback({ error }: FallbackProps) {
  return <div className='max-w-4xl my-6 mx-auto px-8'>
    <ErrorPanel>
      <div className='flex flex-col gap-2 px-6 py-4'>
        <h2 className='text-lg font-medium'>Something went wrong</h2>
        <p className='text-sm opacity-70'>{error.message}</p>
      </div>
    </ErrorPanel>
  </div>
}

function RouteComponent() {
  const { orgId } = Route.useParams()

  const events = useQuery(eventsForOrg_queryOptionsObject(orgId))
  const orgDetails = useQuery(orgDetails_queryOptionsObject(orgId))

  return <div>
    <Header backNav={{
      label: "Back to Organisation",
      linkProps: { to: "/app/$orgId" }
    }} 
    organisation={orgDetails.data ?? undefined}
    />

    <ErrorBoundary fallbackRender={ErrorFallback}>

      <div className='max-w-7xl mx-auto px-8 my-10 mt-20 flex items-center  justify-between gap-5'>
        <h1 className="text-2xl font-medium">
          Events
        </h1>
        <CreateEventButton orgId={orgId} />
      </div>

      <div className='max-w-7xl mx-auto px-8 w-full grid gap-10 lg:grid-cols-2'>
        {
          events.isSuccess && events.data?.length > 0
            ? events.data.map((event: any) => (
              <EventBlock key={event.eventId} event={event} />
            ))
            : <div className='text-neutral-500 w-full text-center col-span-full bg-neutral-500/5 rounded-lg p-10'>
              No events found
            </div>
        }
      </div>
    </ErrorBoundary>

  </div>
}
