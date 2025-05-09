export const initiateCheckout = async (
    uic: string,
    total: number,
    currency: string,
    organisationId: string,
) => {
    // initiate checkout session
    console.log(uic)
    const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/purchasing/stripe/initiateCheckout`,
        {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                uic,
                total,
                currency,
                organisationId,
            }),
        })

    const json = await response.json()
    if (!response.ok || !json || json.success === false) {
        throw new Error(
            json?.error?.message || 'Failed to initiate checkout session due to an unknown error',
        )
    }

    const { url } = json

    // redirect to checkout session
    window.location.href = url
}
