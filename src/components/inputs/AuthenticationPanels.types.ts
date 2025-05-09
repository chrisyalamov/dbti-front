/**
 * Types for /components/AuthenticationPanels
 */

export type AuthPanelHeaderProps = {
    icon: React.ReactElement,
    title: string,
    description: string,
    error?: any
}

export type ErrorMessageProps = {
    error: string | null
}

export type AuthenticationPanelBaseProps = {
    /**
     * The index of the panel in the list of panels
     */
    index: number,
    /**
     * User Intent Continuity (UIC) token
     * Used for preventing CSRF attacks.
     */
    uic: string,
    /**
     * The handle of the user to authenticate
     * (email)
     */
    handle: string,
    /**
     * Function the panel should invoke, if the user is successfully
     * authenticated
     */
    onSuccess: () => void
}