import { createFileRoute } from '@tanstack/react-router'
import { LabeledField } from '../../components/inputs/LabeledField'
import { useMutation } from '@tanstack/react-query'
import { findErrorsForField } from '../../utils/forms'
import { ErrorPanel } from '../../components/Error'
import { router } from '../../main'

export const Route = createFileRoute('/app/newOrg')({
  component: RouteComponent,
})

function RouteComponent() {
  const newOrgOperation = useMutation({
    mutationKey: ['newOrg'],
    mutationFn: async (data: FormData) => {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/organisations/createNewOrganisation`, {
        method: 'POST',
        body: data,
        credentials: 'include',
      })

      let result
      try {
        result = await res.json()
      } catch (e) {
        throw new Error("Failed to parse response")
      }

      if (!res.ok || result.error) {
        throw result.error
      }

      router.navigate({
        to: '/app/$orgId',
        params: {
          orgId: result.organisationId,
        },
      })
      return result
    },
  })

  const { isPending, isError, error } = newOrgOperation

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)

    newOrgOperation.mutate(data)
  }

  return <div className='my-40 max-w-3xl mx-auto px-8'>
    <h1 className="text-2xl font-medium">New organisation</h1>
    <p className="opacity-80">Create a new organisation to host and manage your events.</p>
    <div className="h-10" />

    {
      (isError && error?.name !== "ZodError") &&
      <ErrorPanel>
        <div className='px-6 py-4'>{error?.message}</div>
      </ErrorPanel>
    }

    <form onSubmit={handleSubmit} className='contents'>
      <fieldset
        className={`my-10 w-full @container/form ${isPending ? "pointer-events-none opacity-50" : ""}`}
        disabled={isPending}
      >

        {/* Key field */}
        <LabeledField 
          label='Organisation handle' 
          description='Unique, all-lowercase unique identifier for your organisation. '
          error={findErrorsForField(error, "key")  || ((error as any)?.name === "OrganisationAlreadyExists") && error}
        >
          <input
            name='key'
            type='text'
            className={`py-1.5 w-full block h-full focus:outline-none placeholder-shown:text-neutral-500 grow bg-transparent`}
            placeholder='organisation-id'
          />
        </LabeledField>

        {/* Name field */}
        <LabeledField label='Name' error={findErrorsForField(error, "name")}>
          <input
            name='name'
            type='text'
            className={`py-1.5 w-full focus:outline-none placeholder-shown:text-neutral-500 grow bg-transparent`}
            placeholder='Organisation name'
          />
        </LabeledField>
      </fieldset>

      <button
        type='submit'
        className='
          text-sm px-4 h-9
          rounded cursor-pointer
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
