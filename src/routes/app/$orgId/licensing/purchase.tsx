import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Header } from '../../../../components/Header'
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { ErrorPanel } from '../../../../components/Error';
import { useMutation, useQuery } from '@tanstack/react-query';
import { cart_queryOptionsObject } from '../../../../queries/cart';
import { Spinner, SpinnerSmooth } from '../../../../components/Spinner';
import { useState } from 'react';
import { IoEye, IoEyeOff } from 'react-icons/io5';
import { queryClient } from '../../../../main';
import { RiDiscountPercentFill } from 'react-icons/ri';
import { HorizontalRule } from '../../../../components/Divider';
import { initiateCheckout } from '../../../../utils/checkout';


export const Route = createFileRoute('/app/$orgId/licensing/purchase')({
  component: RouteComponent,
})

// #region Types
export type BulkPricingOffer = {
  offerId: string
  minQuantity: number
  maxQuantity: number
  discountPercentage: number
}

export type Sku = {
  skuId: string
  name: string
  unitPriceCurrency: string
  unitPrice: number
  description: string
  bulkPricingOffers: BulkPricingOffer[]
}

export const errorRenderer = (props: FallbackProps) => {
  return <ErrorPanel>
    <p className='my-4 px-6'>{props.error.message}</p>
  </ErrorPanel>
}

type CartItem = {
  skuId: string
  skuName: string
  currency: string
  unitPrice: number
  quantity: number
  totalPrice: number
  type: string
  appliedDiscountRate?: number
}

type TotalLineProps = {
  total: number
  currency: string
  uic: string
  orgId: string
}

type CartProps = {
  cartItems: any[]
  isLoading: boolean
  uic: string
  orgId: string
}

// #endregion

// #region Components
const updateCartItem = async (skuId: string, quantity: number) => {
  const url = new URL(`${import.meta.env.VITE_BACKEND_URL}/purchasing/addOrChangeCartItem`)
  const data = new FormData()
  data.append('skuId', skuId)
  data.append('quantity', quantity.toString())

  const res = await fetch(url.toString(), {
    method: 'POST',
    credentials: 'include',
    body: data,
  })

  if (!res.ok) {
    throw new Error('Failed to update cart item')
  }

  return
}

function QuantityPicker({ count, skuId }: { count: number, skuId: string }) {
  const [editing, setEditing] = useState(false)

  const quantityChangeMutation = useMutation({
    mutationKey: ['updateCartItem', skuId],
    mutationFn: async (quantity: number) => {
      const res = await updateCartItem(
        skuId,
        quantity
      )
      return res
    },
    onSuccess: () => {
      // Invalidate the cart query to refresh the data
      queryClient.invalidateQueries({
        queryKey: ['cart'],
      })
    }
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value)
    quantityChangeMutation.mutate(value)
    setEditing(false)
  }

  return <div className='
    flex items-center justify-center gap-2 
    ring ring-inset ring-neutral-500/20 
    rounded-sm h-full overflow-hidden'
  >
    {
      quantityChangeMutation.isPending
        ? <Spinner />
        : editing
          ? <input
            type='number'
            name='quantity'
            min={0}
            defaultValue={count}
            autoFocus
            onBlur={handleChange}
            disabled={quantityChangeMutation.isPending}
            className={`
              ${quantityChangeMutation.isPending
                ? "opacity-50 pointer-events-none"
                : ""
              }
              focus-visible:focus-ring
              p-1 grow-0 shrink block w-full

          `}
          />
          : <button
            className='
              text-sm font-medium 
              size-full cursor-pointer
              hover:bg-neutral-500/10 active:bg-neutral-500/15 active:pt-0.5'
            onClick={() => {
              setEditing(true)
            }}
          >
            {count}
          </button>
    }
  </div>
}

function CartLineItemCharge({ item }: { item: CartItem }) {
  return <>
    {/* SKU Name */}
    <div className='flex flex-col gap-2'>
      <h3>{item.skuName}</h3>
    </div>

    {/* Quantity */}
    <QuantityPicker count={item.quantity} skuId={item.skuId} />

    {/* Line total */}
    <p className='text-right'>
      <span className='uppercase opacity-40'>{item.currency} </span>
      {item.totalPrice}
    </p>

  </>
}

function CartLineItemDiscount({ item }: { item: CartItem }) {
  return <>
    {/* Name */}
    <div className='flex flex-col gap-2'>
      <h3>{item.skuName}</h3>
    </div>

    {/* Discount rate */}
    <p className='flex items-center justify-center text-blue-500 gap-2'>
      <RiDiscountPercentFill className='shrink-0 text-xl' />
      <span className='shrink-0'>{item.appliedDiscountRate}% off</span>
    </p>

    {/* Discount amount */}
    <p className='text-right'>
      <span className='uppercase opacity-40'>{item.currency} </span>
      {item.totalPrice}
    </p>
  </>
}

function CartLineItem({ item }: { item: any }) {
  const parsedItem = {
    ...item,
    quantity: parseInt(item.quantity),
    unitPrice: parseFloat(item.unitPrice).toFixed(2),
    totalPrice: parseFloat(item.totalPrice).toFixed(2),
    appliedDiscountRate: (item.appliedDiscountRate * 100).toFixed(0),
  } as CartItem

  return <div className='
    grid gap-5 items-center 
    col-span-full grid-cols-subgrid
    px-1 py-0.5 w-full h-7
    leading-none text-sm 
  '>
    {
      item.type === "charge"
        ? <CartLineItemCharge item={parsedItem} />
        : item.type === "discount"
          ? <CartLineItemDiscount item={parsedItem} />
          : <div className='opacity-50 col-span-full'>Unknown item</div>
    }
  </div>
}

function TotalLine({ total, currency, uic, orgId }: TotalLineProps) {
  const formattedTotal = total.toFixed(2)
  const [loadingCheckoutSession, setLoadingCheckoutSession] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const handleCheckout = async () => {
    setLoadingCheckoutSession(true)
    setErr(null)
    try {
      setLoadingCheckoutSession(true)
      await initiateCheckout(uic, total, currency, orgId)
    } catch (error) {
      setErr((error as any)?.message ?? "Unknown error occured")
      setLoadingCheckoutSession(false)
    }
  }

  return <>
    <div className='flex items-center gap-3 py-3'>
      <p className='font-medium'>
        <span className='mr-2 text-lg font-semibold'>Total</span>
      </p>
      <div className='grow' />
      <p className='font-medium'>
        <span className='uppercase opacity-40'>{currency} </span>
        {formattedTotal}
      </p>
    </div>
    <button
      onClick={handleCheckout}
      className='
          text-sm px-2.5  h-10 flex items-center justify-center
          rounded w-full cursor-pointer
          bg-neutral-900 text-white
          active:pt-0.5 active:opacity-90
        '>
      {
        loadingCheckoutSession
          ? <SpinnerSmooth />
          : <span>Checkout</span>
      }
    </button>
    <div className='
        mt-3 text-sm text-red-600
      '>
      {err}
    </div>
  </>
}

function Cart({ cartItems, isLoading, uic, orgId }: CartProps) {
  const [isOpen, setIsOpen] = useState(false)
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + parseFloat(item.totalPrice),
    0
  )

  return <div className='flex flex-col gap-5 my-10' style={{
    opacity: isLoading ? 0.5 : 1,
    pointerEvents: isLoading ? "none" : "auto",
  }}>
    <div className='flex items-center gap-2'>
      <h2 className='font-medium shrink-0'>Your cart</h2>
      <div className='h-px block grow bg-neutral-500/20' />
      <button
        className='
            flex items-center justify-center rounded-sm cursor-pointer
            hover:bg-neutral-500/10 active:bg-neutral-500/15 
            active:pt-0.5 px-1 h-6 text-sm text-neutral-500
          '
        onClick={() => {
          setIsOpen(!isOpen)
        }}>
        {
          isOpen
            ? <div className='flex items-center gap-2'>
              <span>Hide</span> <IoEyeOff className='text-lg' />
            </div>
            : <div className='flex items-center gap-2'>
              <span>Show</span> <IoEye className='text-lg' />
            </div>
        }
      </button>
    </div>
    {
      isOpen
        ? <>
          <div className='grid grid-cols-[3fr_1fr_auto] gap-x-10 w-full'>
            {
              cartItems.map((item: CartItem) => (
                <CartLineItem key={`${item.skuId}_${item.type}`} item={item} />
              ))
            }
          </div>
          <HorizontalRule count={3} />
          <TotalLine
            total={totalPrice}
            currency={cartItems[0].currency}
            uic={uic}
            orgId={orgId}
          />
        </>
        : <></>
    }
  </div>
}

// #endregion

function RouteComponent() {
  const cart = useQuery(cart_queryOptionsObject)
  const orgId = Route.useParams().orgId as string

  const { lineItemsWithTotals, uic } = cart.data || { lineItemsWithTotals: [], uic: {} }

  const clearCartMutation = useMutation({
    mutationKey: ['clearCart'],
    mutationFn: async () => {
      const url = new URL(`${import.meta.env.VITE_BACKEND_URL}/purchasing/clearCart`)
      const res = await fetch(url.toString(), {
        method: 'POST',
        credentials: 'include',
      })

      if (!res.ok) {
        throw new Error('Failed to clear cart')
      }

      return
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['cart'],
      })
    }
  })

  return <div>
    <Header backNav={{
      label: "Back to Licensing",
      linkProps: { to: "/app/$orgId/licensing" }
    }} />

    <div className='max-w-6xl mx-auto px-8 my-10 mt-20 flex justify-between gap-10 flex-col md:flex-row'>
      <div className='md:w-md'>
        <h1 className='text-2xl font-medium'>Buy licenses</h1>
        <p className='opacity-50 text-sm mt-5 max-w-[35ch]'>
          Licenses are required to enroll attendees to events; and
          give access to exhibitors, presenters, and sponsors.
        </p>
        {
          cart.isPending
            ? <Spinner />
            : cart.isError
              ? <ErrorPanel>
                <p className='my-4 px-6'>{cart.error.message}</p>
                <p className='my-4 px-6 opacity-60 text-sm'>
                  In some cases, clearing the cart may help resolve the issue.
                </p>
                <button
                  className='
                  w-full flex items-center justify-center gap-2 px-2 h-9 mt-3 text-sm
                  border-t-hairline border-t-neutral-500/20 cursor-pointer
                  hover:bg-neutral-500/10 active:bg-neutral-500/20 active:pt-0.5
                  focus-visible:focus-ring focus-visible:bg-neutral-500/10
                  '
                  onClick={() => clearCartMutation.mutate()}>
                  <span>Clear cart</span>
                </button>
              </ErrorPanel>
              : cart.data?.lineItemsWithTotals?.length === 0
                ? <p
                  className='
                    opacity-50 text-sm p-1 my-4 w-full text-center 
                    bg-neutral-500/10 text-neutral-500
                  '>
                  No items in your cart
                </p>
                : <Cart
                  cartItems={lineItemsWithTotals}
                  isLoading={
                    cart.isPending || cart.isFetching || cart.isRefetching || cart.isLoading
                  }
                  uic={uic}
                  orgId={orgId}
                />
        }
      </div>
      <ErrorBoundary fallbackRender={errorRenderer}>
        <Outlet />
      </ErrorBoundary>
    </div>
  </div>
}
