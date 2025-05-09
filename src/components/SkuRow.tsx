import { Link } from "@tanstack/react-router";
import type { Sku } from "../routes/app/$orgId/licensing/purchase";

export function SkuRow({ sku, orgId }: { sku: Sku, orgId?: string }) {
    const contents = (
        <>
            <div className='flex flex-col gap-2'>
                <h3 className='
                text-lg font-medium group-hover:underline
                underline-offset-2 decoration-neutral-500/40
            '>{sku.name}</h3>
                <p className='opacity-50 text-xs max-w-[45ch]'>{sku.description}</p>
            </div>
            <div className='grow' />
            <div className='text-right shrink-0'>
                <p className='text-lg font-medium'>
                    <span className='uppercase opacity-40'>{sku.unitPriceCurrency} </span>
                    {sku.unitPrice}
                </p>
                <p className='opacity-50 text-xs'>per license</p>
            </div>
        </>
    )
    return orgId
        ? <Link
            to={`/app/$orgId/licensing/purchase/sku/$skuId`}
            params={{ skuId: sku.skuId, orgId }}
            className="
                focus-visible:focus-ring 
                active:pt-3.5 active:pb-2.5 
                active:bg-neutral-500/15 active:opacity-80
                group
                flex gap-5 items-start 
                p-3 px-4.5 rounded w-full 
                ring ring-neutral-500/20 ring-inset 
            "
        >
            {contents}
        </Link>
        : <div className="
                flex gap-5 items-start 
                p-3 px-4.5 rounded w-full 
                ring ring-neutral-500/20 ring-inset 
        ">
            {contents}
        </div>
}