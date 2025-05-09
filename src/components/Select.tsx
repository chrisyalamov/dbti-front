import { ChevronsExpand } from "./icons/Chevrons"
import { CustomAnimatedPopover } from "./Popover"
import { useSelect } from "downshift"

type DropdownElement = {
    label: React.ReactNode
    menuLabel?: React.ReactNode
    value: string
}

type DropdownProps = {
    elements: DropdownElement[]
    selected?: string
    placeholder?: string
    onChange?: (value: string) => void
    name?: string
    className?: string
}

export const Select = ({ elements, selected, name, placeholder, onChange, className }: DropdownProps) => {
    const {
        selectedItem,
        isOpen,
        getToggleButtonProps,
        getLabelProps,
        getMenuProps,
        highlightedIndex,
        getItemProps,
    } = useSelect({
        items: elements,
        selectedItem: selected
            ? elements.find((e) => e.value === selected)
            : undefined,
        onSelectedItemChange: (item) => {
            if (item.selectedItem?.value && onChange) {
                onChange(item.selectedItem?.value)
            }
        }
    })

    let button = <button className={`
            px-2 h-7 rounded-sm flex items-center justify-between gap-2 cursor-pointer select-none 
            bg-neutral-500/10 
            hover:opacity-80 
            active:bg-neutral-500/15 active:pt-0.5 
            focus-visible:focus-ring w-full
            ${className}
        `} 
        type="button"
        {...getToggleButtonProps()}

    >
        <span
            className='text-sm shrink-0'
            {...getLabelProps()}
        >
            {selectedItem?.label || placeholder || 'Select an option'}
        </span>
        <span className='text-xs'>
            <ChevronsExpand />
        </span>
    </button>

    let panel = <div {...getMenuProps()}>{
        elements.map((e, index) => {
            return (
                <li
                    key={e.value}
                    className={`
                            ${highlightedIndex === index ? 'bg-neutral-500/10' : ''}
                            ${selectedItem?.value === e.value ? 'bg-neutral-500/20' : ''}
                            flex items-center gap-2 text-sm cursor-pointer
                            active:bg-neutral-500/10 
                            active:opacity-70 min-w-56
                            px-3 py-1.5 pointer-coarse:px-4 pointer-coarse:py-3
                        `}
                    {...getItemProps({ item: e, index })}
                >
                    {e.menuLabel || e.label}
                </li>
            )
        })
    }</div>

    return <>
        <CustomAnimatedPopover
            button={button}
            panel={panel}
            anchor={{ to: "bottom start", gap: 5 }}
            open={isOpen}
            onOpenChange={() => {}}
        />
        {
            name &&
            <input
                type="hidden"
                name={name}
                value={selectedItem?.value || ''}
                className="hidden"
            />
        }
    </>
}