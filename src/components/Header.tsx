import { Link, type LinkProps } from "@tanstack/react-router";
import { useState } from "react";
import { IoChevronBack, IoExitOutline } from "react-icons/io5";
import { CustomAnimatedPopover } from "./Popover";
import { useMutation, useQuery } from "@tanstack/react-query";
import { authState_queryOptionsObject } from "../queries/authState";
import { Spinner } from "./Spinner";
import { queryClient, router } from "../main";

type HeaderProps = {
    title?: string;
    backNav?: {
        label: string;
        linkProps: LinkProps
    };
    displayAuthBadge?: boolean;
}

type AuthStateUser = {
    id: string;
    fullName: string;
    email: string;
}

/**
 * Panel that appears when user badge is clicked
 */
const DropdownPanel = () => {
    const logOutMutation = useMutation({
        mutationFn: async () => {
            await fetch(`${import.meta.env.VITE_BACKEND_URL}/cais/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            })

            router.navigate({
                to: '/',
            })

            await queryClient.invalidateQueries()
            await queryClient.clear()

            window.location.reload()

            return null
        },
        mutationKey: ['logout'],
    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        logOutMutation.mutate()
    }

    return <form className="flex flex-col text-sm py-1" onSubmit={handleSubmit}>
        <button className="flex items-center px-4 py-1 gap-2 min-w-52 hover:bg-neutral-400/20 active:bg-neutral-400/10 cursor-pointer">
            {
                logOutMutation.isPending
                    ? <Spinner />
                    : <>
                        <IoExitOutline  />
                        Sign out
                    </>
            }
        </button>
    </form>
};

/**
 * Contents of the user badge
 */
const UserBadge = (user: AuthStateUser) => {
    console.log(user);
    return <div className="flex items-center gap-2">
        <div className="size-6 rounded-full bg-neutral-500/15 flex items-center justify-center">
            <span className="text-neutral-400 text-xs">{user?.fullName[0]}</span>
        </div>
        <p className="text-sm">
            {user.fullName}
        </p>
    </div>
};

const UnauthActions = () => {
    return <div className="flex items-center gap-2">
        <Link to="/auth/login" className='
            text-sm px-2  h-6 flex items-center justify-center gap-2
            rounded-xs cursor-pointer
            bg-white ring-[0.5px] ring-neutral-500/40
            active:bg-neutral-500/10 active:ring-neutral-500/40
            active:pt-0.5 active:opacity-90
        '>Log in</Link>
    </div>
};

/**
 * Layout block that either shows the login button or the currently 
 * logged in user
 */
const AuthBlock = () => {
    const authState = useQuery(authState_queryOptionsObject)
    const [open, setOpen] = useState(false);

    if (authState.isLoading) {
        return <Spinner />
    }

    if (!authState.data || !authState.data.userId) {
        return <UnauthActions />
    }


    return <CustomAnimatedPopover
        anchor={{
            to: "bottom end",
            gap: 14
        }}
        open={open}
        onOpenChange={() => {
            setOpen(!open)
        }
        }
        button={
            <button
                onClick={() => {
                    setOpen(!open)
                }}
                className="
                        cursor-pointer relative px-2 py-1 rounded overflow-hidden 
                        hover:bg-neutral-500/20 active:bg-neutral-500/10
                        appearance-none outline-none! focus-within:outline-none focus:outline-none
                ">
                <UserBadge {...authState.data} />
            </button>
        }

        panel={<DropdownPanel />}
    />

}

export const Header = (props: HeaderProps) => {
    const displayAuthBadge = props.displayAuthBadge ?? true;

    return <div className="w-full h-12 bg-neutral-500/5 flex items-center gap-4 px-6 text-sm">
        <div>
            {
                props.backNav
                    ? <Link
                        to={props.backNav.linkProps.to}
                        params={props.backNav.linkProps.params}
                        className="flex items-center gap-2 opacity-60"
                    >
                        <IoChevronBack className="shrink-0" />
                        <span className="line-clamp-1 break-words">{props.backNav.label}</span>
                    </Link>
                    : null
            }
        </div>
        <div className="grow" />
        <p>{props.title}</p>
        <div className="grow" />
        {
            displayAuthBadge
                ? <AuthBlock />
                : null
        }

    </div>
}