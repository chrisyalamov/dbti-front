type HorizontalRuleProps = {
    containerClassName?: string
    ruleClassName?: string
    count: number
}


/**
 * This component renders a horizontal divider with a specified number of lines.
 */
export const HorizontalRule = (props: HorizontalRuleProps) => {
    const { containerClassName, ruleClassName, count } = props

    return <div className={
        containerClassName || "flex flex-col gap-px"
    }>
    {
      new Array(count).fill(0).map((_, i) => (
        <div key={i} className={
            ruleClassName || "bg-neutral-500/30 w-full h-px"
        } />
      ))
    }
  </div>
}