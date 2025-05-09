type ErrorPanelProps = {
    children: React.ReactNode;
}

export const ErrorPanel = ({ children }: ErrorPanelProps) => {
    return <div className='rounded overflow-hidden bg-neutral-500/10 w-full'>
        <div className='bg-red-600 text-white px-6 py-3 font-medium text-lg'>
            Error
        </div>
        <div>
            {children}
        </div>
    </div>
}