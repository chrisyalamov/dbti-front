import type { CSSProperties } from "react"


export const LabelToRight = ({ children, style, className }: { children: React.ReactNode, style?: CSSProperties, className?: string }) => {
    return <div className={`
        border border-current border-r-0 
        rounded-l relative pl-1 
        text-xs font-medium tracking-wide uppercase 
        bg-[var(--label-color,black)] text-white
        ${className}
    `} style={style}>
        <div className="p-0.5 pr-1  flex items-center justify-center h-full">{children}</div>
        <svg height="100%" style={{
            height: "calc(100% + 2px)",
            top: -1,
            right: 1
        }}
            className='absolute right-1 translate-x-full text-[var(--label-color,black)]'
            viewBox="0 0 11 20" fill="none" xmlns="http://www</svg>.w3.org/2000/svg"
        >
        <path d="M0 1H1.86181C3.09495 1 4.2525 1.59308 4.97115 2.5931L9.76102 9.25824C10.0797 9.70163 10.0797 10.2984 9.76102 10.7418L4.97115 17.407C4.2525 18.4069 3.09495 19 1.86181 19H0" fill="currentColor"/>

        </svg>

    </div>
}
export const LabelToLeft = ({ children, style, className }: { children: React.ReactNode, style?: CSSProperties, className?: string }) => {
    return <div className={`
        border border-current border-l-0 
        rounded-r relative pr-1 
        text-xs font-medium tracking-wide uppercase 
        bg-[var(--label-color,black)] text-white
        ${className}
    `} style={style}>
        <div className="p-0.5 pl-1 flex items-center justify-center h-full">{children}</div>
        <svg height="100%" style={{
            height: "calc(100% + 2px)",
            top: -1,
            left: 1,
        }}
            className='absolute left-1 -translate-x-full text-[var(--label-color,black)]'
            viewBox="0 0 11 20" fill="none" xmlns="http://www</svg>.w3.org/2000/svg"
        >
            <path d="M11 1H9.13819C7.90505 1 6.7475 1.59308 6.02885 2.5931L1.23898 9.25824C0.920341 9.70163 0.920341 10.2984 1.23898 10.7418L6.02885 17.407C6.7475 18.4069 7.90505 19 9.13819 19H11" fill="currentColor" />

        </svg>

    </div>
}


export const LabelToRightOutline = ({ children, style, className }: { children: React.ReactNode, style?: CSSProperties, className?: string }) => {
    return <div className={`
        border border-current border-r-0 
        rounded-l relative pl-1 
        text-xs font-medium tracking-wide uppercase 
        flex items-center
        text-[var(--label-color,black)]
        ${className}
    `} style={style}>
        <div className="p-0.5 pr-1  flex items-center justify-center h-full">{children}</div>
        <svg height="100%" style={{
            height: "calc(100% + 3px)",
            top: -1.5,
            right: 1
        }}
            className='absolute right-1 translate-x-full text-[var(--label-color,black)]'
            viewBox="0 0 11 20" fill="none" xmlns="http://www</svg>.w3.org/2000/svg"
        >
        <path d="M0 1H1.86181C3.09495 1 4.2525 1.59308 4.97115 2.5931L9.76102 9.25824C10.0797 9.70163 10.0797 10.2984 9.76102 10.7418L4.97115 17.407C4.2525 18.4069 3.09495 19 1.86181 19H0" stroke="currentColor" strokeWidth={0.9}/>

        </svg>

    </div>
}

export const LabelToLeftOutline = ({ children, style, className }: { children: React.ReactNode, style?: CSSProperties, className?: string }) => {
    return <div className={`
        border border-current border-l-0 
        rounded-r relative pr-1 
        text-xs font-medium tracking-wide uppercase 
        flex items-center
        text-[var(--label-color,black)]
        ${className}
    `} style={style}>
        <div className="p-0.5 pr-1 flex items-center justify-center h-full">{children}</div>
        <svg height="100%" style={{
            height: "calc(100% + 3px)",
            top: -1.5,
            left: 1
        }}
            className='absolute left-1 -translate-x-full text-[var(--label-color,black)]'
            viewBox="0 0 11 20" fill="none" xmlns="http://www</svg>.w3.org/2000/svg"
        >
        <path d="M11 1H9.13819C7.90505 1 6.7475 1.59308 6.02885 2.5931L1.23898 9.25824C0.920341 9.70163 0.920341 10.2984 1.23898 10.7418L6.02885 17.407C6.7475 18.4069 7.90505 19 9.13819 19H11" stroke="currentColor" strokeWidth={0.9}/>

        </svg>

    </div>
}