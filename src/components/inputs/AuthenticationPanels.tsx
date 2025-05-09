import { IoTimerOutline } from "react-icons/io5"
import { LuAsterisk } from "react-icons/lu"
import { useState } from "react"
import type { AuthenticationPanelBaseProps, AuthPanelHeaderProps, ErrorMessageProps } from "./AuthenticationPanels.types"
import { InputWithSubmitButton } from "./InputWithSubmitButton"


const AuthPanelHeader = ({ icon, title, description, error }: AuthPanelHeaderProps) => {
    return <div className='flex gap-4 items-start w-full'>
        <div className={`
            text-xl p-2 w-9 shrink-0 box-content 
            rounded border-[0.5px] border-neutral-500/20
            flex items-center justify-center
            ${error
                ? 'text-red-500 border-red-500/20 bg-red-500/5'
                : 'bg-neutral-500/5 '
            }
            `}
        >
            {icon}
        </div>
        <div className='grow'>
            <p className='font-medium flex items-center justify-between gap-1'>{title}</p>
            <p className='opacity-70 text-sm'>{description}</p>
        </div>
    </div>
}

const ErrorMessage = ({ error }: ErrorMessageProps) => {
    return <p className='text-sm my-2 text-red-600'>{error}</p>
}

const PasswordPanel = ({ uic, handle, onSuccess }: AuthenticationPanelBaseProps) => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<null | string>(null)

    /**
     * Function that is called when the form is submitted.
     * It sends a POST request to the server with the
     * password and the UIC token, and either:
     * 
     * - redirects to the app dashboard if the login attempt succeeds
     * - sets the error variable if the login attempt fails
     */
    let onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const password = formData.get('password')

        if (typeof password !== 'string' || password.length < 8) {
            setError('Password must be at least 8 characters long')
            setLoading(false)
            return
        }

        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cais/auth/login`, {
            method: 'POST',
            body: JSON.stringify({
                handle: handle,
                uic: uic,
                authenticationMethod: {
                    type: 'password',
                    password: password,
                }
            }),
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        })

        const json = await response.json()

        if (response.status !== 200) {
            /**
             * If the response is not HTTP 200 (OK) but it isn't
             * HTTP 401 (Incorrect password) either, it's some
             * other error.
             */
            setLoading(false)
            setError("An error occured: " + (json as any)?.error?.message)
            return
        } else {
            onSuccess()
        }
    }

    return <form onSubmit={onSubmit}>
        <div className='leading-tight w-full'>
            <AuthPanelHeader
                icon={<LuAsterisk />}
                title='Password'
                description='Enter your password to continue'
                error={error}
            />
            <InputWithSubmitButton
                placeholder='Password'
                type='password'
                name='password'
                loading={loading}
                error={error}
            />
            <ErrorMessage error={error} />
        </div>
    </form>
}

const EmailOtpPanel = ({ uic, handle, onSuccess }: AuthenticationPanelBaseProps) => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<null | string>(null)

    let onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const code = formData.get('code')

        if (typeof code !== 'string' || code.length !== 6) {
            setError('Code must be 6 characters long')
            setLoading(false)
            return
        }

        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cais/auth/login`, {
            method: 'POST',
            body: JSON.stringify({
                handle: handle,
                uic: uic,
                authenticationMethod: {
                    type: 'email-otp',
                    code: code,
                }
            }),
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        })
        
        const json = await response.json()

        if (response.status !== 200) {
            /**
             * If the response is not HTTP 200 (OK) but it isn't
             * HTTP 401 (Incorrect password) either, it's some
             * other error.
             */
            setLoading(false)
            setError("An error occured: " + (json as any)?.error?.message)
            return
        } else {
            onSuccess()
        }
    }

    return <form onSubmit={onSubmit}>
        <div className='leading-tight w-full'>
            <AuthPanelHeader
                icon={<IoTimerOutline />}
                title='One-time passcode'
                description={`Log in by entering the code we just sent to ${handle}.`}
                error={error}
            />
            <InputWithSubmitButton
                placeholder='Code'
                type='text'
                name='code'
                loading={loading}
                error={error}
            />
            <ErrorMessage error={error} />
        </div>
    </form>
}

const AuthenticationPanels = {
    "password": PasswordPanel,
    "email-otp": EmailOtpPanel,
}

export default AuthenticationPanels