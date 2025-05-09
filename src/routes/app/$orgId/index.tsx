import { createFileRoute, Link, type LinkProps } from '@tanstack/react-router'
import { Header } from '../../../components/Header'
import { DateTime } from "luxon";
import { createContext, useContext } from 'react';
import { eventsForOrg_queryOptionsObject } from '../../../queries/events';
import { useQuery } from '@tanstack/react-query';
import { HiOutlineWallet } from 'react-icons/hi2';
import { PiCertificate } from 'react-icons/pi';
import { IoCalendarOutline, IoFlash, IoWarning } from 'react-icons/io5';
import { orgDetails_queryOptionsObject } from '../../../queries/orgDetails';
import { ErrorBoundary } from 'react-error-boundary';
import { CreateEventButton } from '../../../components/CreateEventButton';

export const Route = createFileRoute('/app/$orgId/')({
  component: RouteComponent,
})

const MiniCal = () => {
  const now = DateTime.now();
  const today = now.day;
  const startOfMonth = now.startOf('month');
  const daysInMonth = now.daysInMonth;
  const firstWeekday = startOfMonth.weekday % 7
  const numberOfDaysToPad = 7 - firstWeekday

  return <div className='grid grid-cols-7 gap-1 items-center justify-center content-center text-center w-max text-xs'>
    {
      new Array(numberOfDaysToPad).fill("").map(() => <span></span>)
    }
    {
      new Array(daysInMonth).fill("").map((_, index) => {
        return index + 1 == today
          ? <span className='rounded-sm p-0.5 leading-none bg-red-400 text-white'>{index + 1}</span>
          : <span className='p-0.5 leading-none'>{index + 1}</span>
      })
    }
  </div>
}

type AgendaDayProps = {
  date: DateTime,
}

function AgendaDay(props: AgendaDayProps) {
  const { orgId } = useContext(RouteContext)
  const events = useQuery({
    ...eventsForOrg_queryOptionsObject(orgId),
    throwOnError: true,
  })

  const earliest = props.date.startOf('day')
  const latest = props.date.endOf('day')

  /**
   * From all the organisation's events, filter the ones which occur on the
   * date that this element represents:
   * - Start date is on or after 00:00am of the date, OR
   * - End date is on or before 11:59pm of the date
   */
  const eventsForDate = events.isPending
    ? []
    : events.data.filter((event: any) => {
      const startDate = DateTime.fromISO(event.startDate)
      const endDate = DateTime.fromISO(event.endDate)

      return (
        earliest <= startDate && startDate <= latest ||
        earliest <= endDate && endDate <= latest ||
        startDate <= earliest && latest <= endDate
      )
    })


  const isToday = props.date.day === DateTime.now().day
  return <div className={`col-span-full grid grid-cols-subgrid px-4 ${isToday ? "bg-neutral-500/5 -mt-[0.5px]" : ""} py-2 not-last:border-b-hairline border-neutral-500/20`}>
    <span className={`font-medium text-right ${isToday ? "text-red-500" : "text-black"}`}>{props.date.day}</span>
    <div className='flex flex-col items-stretch max-w-full overflow-hidden'>
      {
        events.isPending
          ? <span className='text-sm line-clamp-1 break-all max-w-full text-neutral-900 opacity-40 my-0.5'>Loading...</span>
          : eventsForDate.map((event: any) => {
            return <Link
              to="/app/$orgId/events/$eventId"
              className='text-sm leading-none line-clamp-1 break-all max-w-full text-neutral-900 hover:underline underline-offset-2 decoration-neutral-500/20 opacity-70 hover:opacity-90 active:opacity-50 my-0.5'
              params={{
                orgId: orgId,
                eventId: event.eventId
              }}>
              {event.name !== "" ? event.name : "Untitled Event"}
            </Link>
          })
      }
      {
        eventsForDate?.length === 0 &&
        <span className='text-sm line-clamp-1 break-all max-w-full text-neutral-900 opacity-40 my-0.5'>
          No events
        </span>
      }
    </div>
  </div>
}

function Agenda() {
  const currentMonth = DateTime.now().toFormat('LLLL');
  const previousDays = [
    DateTime.now().minus({ days: 1 }),
  ]

  const today = DateTime.now()
  const nextDays = [
    DateTime.now().plus({ days: 1 }),
    DateTime.now().plus({ days: 2 }),
    DateTime.now().plus({ days: 3 }),
  ]

  const { orgId } = useContext(RouteContext)

  return <div className='bg-white rounded pb-[2px] shrink' style={{
    filter: "drop-shadow(0px 4px 9px rgba(0, 0, 0, 0.10)) drop-shadow(0px 16px 46px rgba(0, 0, 0, 0.09)) drop-shadow(0px 36px 82px rgba(0, 0, 0, 0.05)) drop-shadow(0px 0px 3px rgba(0, 0, 0, 0.25))",
    overflow: "hidden",
  }}>
    <div className='bg-white rounded pb-[2px]' style={{
      boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.25)",
      overflow: "hidden",
    }}>
      <div className='bg-white rounded' style={{
        boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.25)",
        overflow: "hidden",
      }}>
        <div className='flex w-full justify-between p-4 pb-16 gap-16'>
          <p className='text-xl font-light'>{currentMonth}</p>
          <MiniCal />
        </div>

        {/* Adjacent days */}
        <ErrorBoundary fallback={
          <div className='flex items-center justify-center gap-2 p-4 text-red-500'>
            <IoWarning className='text-2xl' />
            <p className='text-sm'>Unable to load events</p>
          </div>
        }>
          <div className='grid grid-cols-[30px_1fr] gap-x-10 w-full'>
            {/* Previous days */}
            {previousDays.map(date => <AgendaDay date={date} />)}

            {/* Current day */}
            <AgendaDay date={today} />

            {/* Next days */}
            {nextDays.map(date => <AgendaDay date={date} />)}
          </div>
        </ErrorBoundary>

        <Link to="/app/$orgId/events" params={{ orgId: orgId }} className='border-t-hairline mt-4 border-neutral-500/40 hover:bg-neutral-500/5 active:opacity-60 p-2 flex items-center justify-center'>
          See all events
        </Link>
      </div>
    </div>
  </div>
}

function NavLink({ linkOptions, icon, label }: { linkOptions: LinkProps, icon: React.ReactNode, label: string }) {
  return <Link
    to={linkOptions.to}
    params={linkOptions.params}
    className="flex items-center gap-2 py-1 hover:underline underline-offset-2 decoration-neutral-500/20 opacity-70 hover:opacity-90 active:opacity-50"
  >
    {icon}
    {label}
  </Link>
}

function NavPanel() {
  return <div className='grow'>
    <NavLink linkOptions={{ to: "/app/$orgId/events" }} icon={<IoCalendarOutline />} label="Events" />
    <NavLink linkOptions={{ to: "/app/$orgId/licensing" }} icon={<PiCertificate />} label="Licensing" />
    <NavLink linkOptions={{ to: "/app/$orgId/billing" }} icon={<HiOutlineWallet />} label="Billing" />
  </div>
}

function QuickActionsPanel() {
  const { orgId } = useContext(RouteContext)

  return <div className='grow shrink-0 px-5 py-3 rounded border border-neutral-500/20 flex flex-col justify-start gap-2'>
    <p className='text-sm mb-2 font-medium text-neutral-500 flex items-center gap-2'><IoFlash /> Quick actions</p>
    <CreateEventButton orgId={orgId} style={{width: "100%"}} />
    <Link 
      to="/app/$orgId/licensing/purchase"
      params={{ orgId }}
      className='
        px-8 h-8 bg-neutral-500/10 rounded-sm cursor-pointer text-sm 
        active:bg-neutral-500/20 active:pt-0.5 font-medium
        flex items-center justify-center
      '
    >
      Buy licenses
    </Link>
  </div>
}

const RouteContext = createContext({ orgId: "" })

function RouteComponent() {
  const { orgId } = Route.useParams()
  const orgDetails = useQuery(orgDetails_queryOptionsObject(orgId))

  // Check if the user belongs to any orgnisations
  return <RouteContext.Provider value={{ orgId }}>
    <div>
      <Header />

      <div className='max-w-7xl mx-auto px-8 my-10 mt-20'>
        <h1 className={`text-2xl font-medium ${orgDetails.isPending ? "opacity-50" : ""}`}>
          {orgDetails.data?.name || "Loading..."}
        </h1>
      </div>

      <div className='max-w-7xl mx-auto px-8 w-full flex items-stretch justify-between gap-5 lg:gap-16 xl:gap-24 flex-col md:flex-row'>
        <NavPanel />
        <QuickActionsPanel />
        <Agenda />
      </div>

    </div>
  </RouteContext.Provider>
}
