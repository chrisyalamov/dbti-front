import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { skuDetails_queryOptionsObject } from "../../../../queries/skus";
import { Spinner } from "../../../../components/Spinner";
import type { Sku } from "./purchase";
import { useState } from "react";
import { LuShoppingCart } from "react-icons/lu";
import { RiDiscountPercentFill } from "react-icons/ri";
import { queryClient, router } from "../../../../main";
import { IoCloseCircle, IoWarning } from "react-icons/io5";
import { initiateCheckout } from "../../../../utils/checkout";

export const Route = createFileRoute(
  "/app/$orgId/licensing/purchase/sku/$skuId",
)({
  component: RouteComponent,
});

function QuantityPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="mt-5 flex items-center gap-4">
      <input
        type="number"
        name="quantity"
        min={1}
        value={value}
        onChange={(e) => {
          const value = parseInt(e.target.value);
          if (onChange) onChange(value);
        }}
        className="
          focus-visible:focus-ring 
          w-20 rounded-sm 
          border border-neutral-500/30 bg-neutral-500/5 
          p-1 px-2.5 leading-none
        "
        placeholder="0"
      />
      <span className="text-sm">licenses</span>
    </div>
  );
}

async function addSkuToCart(data: FormData) {
  const url = new URL(`${import.meta.env.VITE_BACKEND_URL}/purchasing/addOrChangeCartItem`);

  const res = await fetch(url.toString(), {
    method: "POST",
    credentials: "include",
    body: data,
  });

  return await res.json();
}

function PurchaseCard({ sku }: { sku: Sku }) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const orgId = Route.useParams().orgId as string;

  const addItemMutation = useMutation({
    mutationFn: addSkuToCart,
    mutationKey: ["addSkuToCart", sku.skuId],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      })
    },
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    let buyNow = false;

    if (e.nativeEvent instanceof SubmitEvent && e.nativeEvent.submitter) {
      // Check if the submitter is a button
      if (!(e.nativeEvent.submitter instanceof HTMLButtonElement)) return
      const action = e.nativeEvent.submitter?.value;

      // If the "Buy now" button was clicked, set removeAllOtherItems to true
      if (action === "buy") { buyNow = true }
    }

    const formData = new FormData(e.currentTarget);
    formData.append("removeAllOtherItems", buyNow.toString());

    addItemMutation.mutate(formData, {
      onSuccess: async (data) => {
        if (buyNow) {
          try {
            await initiateCheckout(
              data.buyNowUIC,
              quantity * sku.unitPrice,
              sku.unitPriceCurrency,
              orgId,
            )
          } catch (err) {
            setError(err as Error);
            setLoading(false);
          }
        } else {
          router.navigate({
            to: "/app/$orgId/licensing/purchase",
            params: { orgId },
          })
        }
      }
    });
  };

  return (<>
    <form
      className={`
        w-full overflow-hidden rounded 
        ring ring-neutral-500/20 ring-inset
        ${addItemMutation.isPending || loading ? "pointer-events-none opacity-50" : ""}
      `}
      onSubmit={handleSubmit}
    >
      <fieldset disabled={addItemMutation.isPending || loading}>
        <input type="hidden" name="skuId" value={sku.skuId} />
        <div className="flex items-start gap-5 p-3 px-4.5">
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-medium">{sku.name}</h3>
            <p className="max-w-[45ch] text-xs opacity-50">{sku.description}</p>
            <QuantityPicker value={quantity} onChange={setQuantity} />
          </div>
          <div className="grow" />
          <div className="shrink-0 text-right">
            <p className="text-lg font-medium">
              <span className="uppercase opacity-40">
                {sku.unitPriceCurrency}{" "}
              </span>
              {sku.unitPrice}
            </p>
            <p className="text-xs opacity-50">per license</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-neutral-500/10 px-4.5 py-3">
          <p className="font-medium">
            <span className="mr-2 uppercase opacity-40">
              {" "}
              {sku.unitPriceCurrency}
            </span>
            {(sku.unitPrice * quantity).toFixed(2)}
          </p>
          <div className="grow" />
          {
            addItemMutation.isPending && <Spinner />
          }
          <button
            type="submit"
            value="add"
            name="cartAction"
            className="
              flex items-center gap-2 shrink-0
              h-7 active:pt-0.5 px-3
              rounded-sm bg-white cursor-pointer
              text-sm font-medium
              ring-[0.5px] ring-neutral-500/30 active:bg-neutral-500/15
              focus-visible:focus-ring
              "
          >
            Add to cart
            <LuShoppingCart />
          </button>
          <button
            type="submit"
            value="buy"
            name="cartAction"
            className="
              focus-visible:focus-ring
              flex items-center gap-2 rounded-sm h-7 px-3 shrink-0
              bg-amber-300
              text-sm font-medium
              ring-[0.5px] ring-black/20 ring-inset
              cursor-pointer active:pt-0.5 active:brightness-90
          ">
            Buy now
          </button>
        </div>
      </fieldset>
    </form>
    {
      error?.message
        ? (<p className="text-red-600 flex items-center gap-2 my-3">
          <IoWarning className="text-lg shrink-0" />
          <span className="text-xs line-clamp-1">{error.message}</span>
        </p>)
        : null
    }
  </>
  );
}

function BulkOffers({ sku }: { sku: Sku }) {
  const { bulkPricingOffers } = sku


  console.log(sku)

  if (!bulkPricingOffers || bulkPricingOffers.length === 0) return null;

  return <div className="my-10">
    <h2 className="flex items-center gap-4 text-lg font-medium">
      <span>Volume pricing</span>
      <div className="h-px grow bg-neutral-500/20" />
      <RiDiscountPercentFill className="shrink-0 text-xl text-blue-500" />
    </h2>
    <p className="text-sm my-2">
      Discounts may apply to purchases of large quantities.
    </p>
    <div className="flex flex-col gap-1 my-4">
      {
        bulkPricingOffers.map((offer) => (
          <div
            key={offer.minQuantity}
            className="
              flex items-center gap-4 rounded-sm text-sm 
              bg-neutral-500/10 py-2 px-3 leading-none
              "
          >
            <p className="">
              <span>{offer.minQuantity}</span>
              <span className="opacity-20"> — </span>
              <span>{offer.maxQuantity}</span>
            </p>
            <div className="grow" />
            <p className="font-medium text-blue-500">
              {offer.discountPercentage * 100}% off
            </p>
          </div>
        ))
      }
    </div>
    <p
      className="
        text-xs text-balance text-right 
        opacity-40 my-2 max-w-[60ch] place-self-end 
    ">
      Discounts are applied at checkout. The offers displayed above are subject
      to change and may not be available at the time of purchase. <br />
      Terms and conditions apply.
    </p>
  </div>
}

const CloseButton = ({ orgId }: { orgId: string }) => <Link
  to="/app/$orgId/licensing/purchase"
  params={{ orgId }}
>
  <IoCloseCircle className="
  ml-auto mb-4
    text-xl opacity-50 hover:opacity-70 active:*:opacity-30
  " />
</Link>

function RouteComponent() {
  const orgId = Route.useParams().orgId as string;
  const skuId = Route.useParams().skuId as string;

  const skuDetails = useQuery(skuDetails_queryOptionsObject(orgId, skuId));

  return skuDetails.isPending ? (
    <Spinner />
  ) : (
    <div className="grow">
      <CloseButton orgId={orgId} />
      <PurchaseCard sku={skuDetails.data} />
      <BulkOffers sku={skuDetails.data} />
    </div>
  );
}
