import { IoChevronForward } from "react-icons/io5"
import type { FieldWithSubmitProps } from "./InputWithSubmitButton.types"
import { SpinnerSmooth } from "../Spinner"

export const InputWithSubmitButton = ({ placeholder, type, name, loading, error }: FieldWithSubmitProps) => {
    return <div className={`
        flex items-center gap-2 stretch w-full mt-5 
        rounded-sm border-hairline
        [:has(:focus)]:outline-none 
        ${error
            ? 'border-red-500/40 [:has(:focus)]:border-red-500'
            : 'border-gray-500/60 [:has(:focus)]:border-neutral-500'
        }
    `}>
        <input
            id={name}
            name={name}
            type={type}
            className={`
                grow  text-sm 
                focus:outline-none 
                px-2 py-1.5 
                `} placeholder={placeholder} />
        <div style={{
            display: loading ? 'block' : 'none',
        }}>
            <SpinnerSmooth />
        </div>
        <button
            type='submit'
            className='
                -ml-px text-sm px-2.5 
                rounded cursor-pointer
                active:opacity-50
                relative shrink-0 
                self-stretch
                '>
            <IoChevronForward />
        </button>
    </div>
}