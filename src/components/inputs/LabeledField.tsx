type LabeledFieldProps = {
  label: string
  description?: string
  children: React.ReactNode
  error?: Error
}

export const LabeledField = ({ label, description, children, error }: LabeledFieldProps) => {
  return <div className={`my-6 @md/form:my-4 text-sm`}>
    <div className={`
        flex gap-1 @md/form:gap-3
        flex-col items-start
        @md/form:flex-row @md/form:items-stretch 
        ${error ? "border-red-500" : "border-neutral-500/50 [:has(:focus-visible)]:border-current"} border-hairline rounded-sm
        ${error ? "rounded-t-sm" : "rounded-sm"}
        `}
    >
      <label
        className={`
            text-sm  
            w-full @md/form:w-40 @lg/form:w-54 @xl/form:w-64 p-1.5 px-3 
            grow-0 shrink-0 break-words overflow-hidden
            ${error ? "bg-red-500/5" : "bg-neutral-500/5"}
          `}>
        {label}
        {
          description
            ? <p className='text-xs text-neutral-500/80 mt-1'>{description}</p>
            : null
        }
      </label>
      <div className='px-3 @md/form:px-0 grow w-full'>
        {children}
      </div>
    </div>
    {
      error
        ? <div className='text-xs text-red-600 p-1 px-3 rounded-b-sm'>{error.message}</div>
        : null
    }
  </div>
}