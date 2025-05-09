import { createFileRoute, Link, Outlet, type LinkProps } from '@tanstack/react-router'
import { MdHome } from "react-icons/md";
import { HiMiniWallet } from "react-icons/hi2";
import { Logo } from '../../logo'
import useNavStore from '../../utils/nav-store';
import { useQuery } from '@tanstack/react-query';
import { authState_queryOptionsObject } from '../../queries/authState';
import { SpinnerSmooth } from '../../components/Spinner';


export const Route = createFileRoute('/_marketing')({
    component: RouteComponent,
})

type NavItemProps = {
    icon: React.ReactElement
    label: string
} & LinkProps

function NavItem({ icon, label, ...props }: NavItemProps) {
    return <Link className="flex gap-2 items-center opacity-90 [&.active]:opacity-50 hover:opacity-100 active:text-amber-300" {...props}>
        <span className='border size-5 rounded-md flex items-center justify-center p-0.5'>
            {icon}
        </span>
        <span>
            {label}
        </span>
    </Link>
}

function CTABar() {
    const authState = useQuery(authState_queryOptionsObject)

    if (authState.isLoading) {
        return <SpinnerSmooth />
    }

    if (authState.data?.userId) {
        return <Link
            to='/auth/orgSelector'
            className='text-sm px-2.5 h-8 md:h-7 bg-white text-black rounded-sm leading-none font-medium cursor-pointer active:pt-0.5 active:opacity-50 shrink-0 flex items-center justify-center'
        >
            Admin portal
        </Link>
    } else {
        return <>
            <Link
                to='/auth/newAccount'
                className='
                    text-sm px-2.5 h-8 md:h-7 
                    bg-white text-black rounded-sm 
                    leading-none font-medium cursor-pointer active:pt-0.5 active:opacity-50 shrink-0
                    flex items-center justify-center
                    '
            >
                Get started
            </Link>
            <Link
                to='/auth/login'
                className='
                    text-sm px-2.5 h-8 md:h-7 
                    bg-transparent border border-white text-white 
                    hover:bg-white hover:text-black rounded-sm 
                    leading-none font-medium cursor-pointer active:pt-0.5 active:opacity-50 shrink-0
                    flex items-center justify-center
                    '
            >
                Log in
            </Link>
        </>
    }
}

    function RouteComponent() {
        const isOpen = useNavStore((state) => state.isOpen)
        const toggle = useNavStore((state) => state.toggle)

        return <div className='h-full min-h-screen bg-neutral-950 text-white'>
            <div className='flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-6 px-4 md:px-12 py-4'>
                <div className='flex items-center justify-between'>
                    <Logo className='text-4xl text-amber-300 shrink-0' />
                    <span className='text-lg font-[ligo] text-amber-300 mx-5 hidden md:block'>CARDER</span>
                    <button className='md:hidden' onClick={toggle}>
                        <svg width="1.5em" height="1.35em" viewBox="0 0 21 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M0.899565 14.8727C0.801092 13.9858 0.739821 12.7818 0.73993 12.2453L0.739929 7.10932C0.739821 6.57275 0.801091 5.3688 0.899565 4.30458C1.17613 1.31564 3.36593 0.0515138 5.45858 0.0515137C7.55123 0.0515136 9.74102 1.31564 10.0176 4.30458C10.1161 5.36883 10.1773 6.57276 10.1772 7.10934V12.2452C10.1773 12.7818 10.1161 13.9858 10.0176 14.8727C9.74102 17.6844 7.55123 18.9485 5.45858 18.9485C3.36593 18.9485 1.17614 17.6844 0.899565 14.8727ZM6.38777 13.062C6.38777 13.319 6.29826 13.5393 6.11925 13.7229C5.93565 13.9019 5.71532 13.9915 5.45828 13.9915C5.20123 13.9915 4.98321 13.9019 4.80419 13.7229C4.62059 13.5393 4.52879 13.319 4.52879 13.062C4.52879 12.8049 4.62059 12.5869 4.80419 12.4079C4.98321 12.2243 5.20123 12.1325 5.45828 12.1325C5.71532 12.1325 5.93565 12.2243 6.11925 12.4079C6.29826 12.5869 6.38777 12.8049 6.38777 13.062ZM6.38777 9.49976C6.38777 9.7568 6.29826 9.97712 6.11925 10.1607C5.93565 10.3397 5.71532 10.4292 5.45828 10.4292C5.20123 10.4292 4.98321 10.3397 4.80419 10.1607C4.62059 9.97712 4.52879 9.7568 4.52879 9.49976C4.52879 9.24271 4.62059 9.02468 4.80419 8.84567C4.98321 8.66207 5.20123 8.57027 5.45828 8.57027C5.71532 8.57027 5.93564 8.66207 6.11925 8.84567C6.29826 9.02468 6.38777 9.24271 6.38777 9.49976ZM6.11925 6.59852C6.29826 6.41491 6.38777 6.19459 6.38777 5.93755C6.38777 5.6805 6.29826 5.46247 6.11925 5.28346C5.93564 5.09986 5.71532 5.00806 5.45828 5.00806C5.20123 5.00806 4.98321 5.09986 4.80419 5.28346C4.62059 5.46247 4.52879 5.6805 4.52879 5.93755C4.52879 6.19459 4.62059 6.41491 4.80419 6.59852C4.98321 6.77753 5.20123 6.86703 5.45828 6.86703C5.71532 6.86703 5.93564 6.77753 6.11925 6.59852Z" fill="currentColor" />
                            <path className="transition-all" style={{ transform: isOpen ? "translateY(-42%)" : "translateY(0)" }} d="M16.7585 14.859L14.294 12.3944C14.0105 12.111 14.2113 11.6263 14.6122 11.6263L20.5413 11.6263C20.9422 11.6263 21.1429 12.111 20.8594 12.3945L18.3949 14.859C18.0092 15.2447 17.8164 15.4375 17.5767 15.4375C17.3371 15.4375 17.1442 15.2447 16.7585 14.859Z" fill="currentColor" />
                            <path className="transition-all" style={{ transform: isOpen ? "translateY(42%)" : "translateY(0)" }} d="M16.7585 4.14104L14.294 6.60555C14.0105 6.88903 14.2113 7.37375 14.6122 7.37375L20.5413 7.37375C20.9422 7.37375 21.1429 6.88903 20.8594 6.60555L18.3949 4.14104C18.0092 3.75532 17.8164 3.56246 17.5767 3.56246C17.3371 3.56246 17.1442 3.75532 16.7585 4.14104Z" fill="currentColor" />
                        </svg>

                    </button>
                </div>

                <div className={`my-10 md:my-0 ${isOpen ? "flex" : "hidden"} md:flex flex-col md:flex-row gap-2 md:gap-6`}>
                    <NavItem to='/' icon={<MdHome />} label='Home' />
                    <NavItem to='/pricing' icon={<HiMiniWallet />} label='Pricing' />
                </div>

                {/* Separator— empty element that takes up available space */}
                <div className='grow' />

                {/* CTA buttons */}
                <div className={`${isOpen ? "flex" : "hidden"} md:flex flex-col md:flex-row gap-2`}>
                    <CTABar />
                </div>
            </div>

            <Outlet />

        </div>
    }
