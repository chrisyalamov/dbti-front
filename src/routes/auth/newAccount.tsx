import { createFileRoute, Link } from '@tanstack/react-router'
import { IoArrowForwardCircle, IoCheckmarkCircle, IoCheckmarkCircleOutline } from 'react-icons/io5'
import { useMutation, useQuery } from '@tanstack/react-query'
import { LabeledField } from '../../components/inputs/LabeledField'
import { findErrorsForField } from '../../utils/forms'
import { router } from '../../main'
import { ErrorPanel } from '../../components/Error'
import { authState_queryOptionsObject } from '../../queries/authState'

export const Route = createFileRoute('/auth/newAccount')({
  component: RouteComponent,
})

function NewAccountError({ error }: { error: Error }) {
  if (error.name != "ZodError") {
    return <ErrorPanel>
      <p className='p-4 px-6'>{error.message}</p>
      {/* If the error was a duplicate email, offer the user the option to sign in instead. */}

      {
        error.name === "DuplicateEmail"
          ? <Link
            to='/auth/login'
            className='
            w-full flex items-center justify-center gap-2 px-2 h-9 mt-3 text-sm
            border-t-hairline border-t-neutral-500/20
            hover:bg-neutral-500/10 active:bg-neutral-500/20 active:pt-0.5
            focus-visible:focus-ring focus-visible:bg-neutral-500/10
          '>
            Trying to log in instead? <IoArrowForwardCircle className='text-lg' />
          </Link>
          : null
      }
    </ErrorPanel>
  }
  return null
}

function TermsAndConditionsCheckbox({ error }: { error: Error | null }) {
  return <>
    <label htmlFor="agreesToTermsAndConditions" className='
            flex items-center gap-3 px-2 h-8 
            select-none rounded-sm 
            hover:bg-neutral-500/15 
            active:pt-0.5 active:bg-neutral-500/10 
            cursor-pointer 
            [:has(:focus-visible)]:focus-ring
          '>
      <input
        name='agreesToTermsAndConditions'
        type='checkbox'
        id='agreesToTermsAndConditions'
        className="sr-only"
      />

      {/* Custom icons shown when the checkbox is on/off */}
      <IoCheckmarkCircleOutline className='text-xl block [input:checked~&]:hidden opacity-30' />
      <IoCheckmarkCircle className='text-xl hidden [input:checked~&]:block' />

      <p className='text-sm text-neutral-500'>
        I agree to <Link to='/terms' className='underline'>Carder's terms of service</Link>.
      </p>
    </label>

    {/* Error message shown when the checkbox is not checked */}
    {
      findErrorsForField(error, "agreesToTermsAndConditions")
        ? <div className='text-red-600 bg-red-500/5 p-2 px-3 text-xs rounded-sm my-1'>
          You must agree to the terms and conditions to continue.
        </div>
        : null
    }

    {/* Hidden field which contains data about the version of the T&Cs the user is agreeing to. */}
    <input type='hidden' name='termsAndConditionsVersion' value='1.0' />
  </>
}

function RouteComponent() {
  const authState = useQuery(authState_queryOptionsObject)
  
  const initiateRegistrationOperation = useMutation({
    mutationKey: ['initiateRegistration'],
    mutationFn: async (data: FormData) => {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cais/user/initiateRegistration`, {
        method: 'POST',
        body: data,
        credentials: 'include',
      })

      let result 
      
      try {
        result = await res.json()
      } catch (e) {
        throw new Error('Invalid response from server')
      }

      if (!res.ok) {
        throw result.error
      }
      
      return result
    },
    onSuccess: (data) => {
      router.navigate({
        to: '/auth/confirmAccount',
        search: {
          id: data.userId,
        },
      })
    }
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)

    initiateRegistrationOperation.mutate(data)
  }

  if (authState.isSuccess) {
    if (authState.data.userId) {
      router.navigate({
        to: '/auth/orgSelector',
      })
    }
  }

  const { isPending, isError, error }  = initiateRegistrationOperation

  return <div className="flex flex-col items-start justify-center stretch w-full">
    <h1 className="text-2xl font-medium">Create account</h1>
    <div className='h-10' />

    {isError && <NewAccountError error={error as Error} />}

    <form onSubmit={handleSubmit} className='contents'>
      <fieldset
        className={`my-10 w-full @container/form ${isPending ? "pointer-events-none opacity-50" : ""}`}
        disabled={isPending}
      >

        {/* Email field */}
        <LabeledField label='Email' error={findErrorsForField(error, "email") || ((error as any)?.name === "DuplicateEmail") && error}>
          <input
            name='email'
            type='text'
            className={`py-1.5 w-full focus:outline-none placeholder-shown:text-neutral-500 grow`}
            placeholder='Email address'
          />
        </LabeledField>

        {/* Name field */}
        <LabeledField label='Full name' error={findErrorsForField(error, "fullName")}>
          <input
            name='fullName'
            type='text'
            className={`py-1.5 w-full focus:outline-none placeholder-shown:text-neutral-500 grow`}
            placeholder='Full name'
          />
        </LabeledField>

        {/* Password field */}
        <LabeledField label='Password' error={findErrorsForField(error, "password")}>
          <input
            name='password'
            type='password'
            className={`py-1.5 w-full focus:outline-none placeholder-shown:text-neutral-500 grow`}
            placeholder='Password'
          />
        </LabeledField>

        {/* Why no "confirm password" field? See design decisions in the documentation */}

        {/* Agreement to terms and conditions  */}
        <TermsAndConditionsCheckbox error={error} />
      </fieldset>

      <button
        type='submit'
        className='
          text-sm px-2.5  h-10
          rounded w-full cursor-pointer
          bg-neutral-900 text-white
          active:pt-0.5
          select-none
          active:opacity-95
          active:[&>*]:opacity-80
          relative shrink-0 
          font-medium
          focus-visible:focus-ring
        '
      >
        <span>Continue</span>
      </button>

    </form>
  </div>

}
