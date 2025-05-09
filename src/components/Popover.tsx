import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react"
import React, { Fragment, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useMediaQuery } from "usehooks-ts";
import { Drawer } from 'vaul';

type CustomAnimatedPopoverProps = {
    button: React.ReactElement;
    panel: React.ReactElement;
    open: boolean;
    onOpenChange: () => void;
    anchor: any;
}

type PopoverProps = {
    button: React.ReactElement
    panel: React.ReactElement
    open: boolean
    onOpenChange: () => void
    anchor: any
    ref: React.RefObject<null>
}

function ControlledPopover(props: PopoverProps) {
    return <Popover>
        <>
            <PopoverButton as="div" className="">
                {props.button}
            </PopoverButton>
            <AnimatePresence>
                {props.open && (
                    <PopoverPanel
                        static
                        as={Fragment}
                        anchor={props.anchor}
                        ref={props.ref}
                    >
                        <motion.div
                            initial={{ opacity: 0, filter: "blur(2px)", transform: "scale(0.9)" }}
                            animate={{ opacity: 1, filter: "blur(0px)", transform: "scale(1)" }}
                            exit={{ opacity: 0, filter: "blur(2px)", transform: "scale(0.9)" }}
                            transition={{ type: "tween", duration: 0.05 }}
                            className="
                            bg-white rounded-sm
                            shadow-[0_0_0_1px_rgb(0_0_0/15%),0_2px_5px_rgb(0_0_0/20%),0_5px_30px_rgb(0_0_0/25%)] 
                            origin-top
                        "
                        >
                            {props.panel}
                        </motion.div>
                    </PopoverPanel>
                )}
            </AnimatePresence>
        </>

    </Popover>
}

type DrawerProps = {
    button: React.ReactElement
    panel: React.ReactElement
    open: boolean
    onOpenChange: () => void
}

function ControlledDrawer(props: DrawerProps) {
    return <Drawer.Root open={props.open} onOpenChange={props.onOpenChange}>
        {props.button}
        <Drawer.Portal>
            <Drawer.Overlay className="fixed inset-0 bg-black/40" />
            <Drawer.Content className="bg-gray-100 flex flex-col rounded-t shadow-[0_0_100px_rgb(0_0_0/50%)] mt-24 h-fit fixed bottom-0 left-0 right-0 outline-none pt-3 pb-20">
                {props.panel}
            </Drawer.Content>
        </Drawer.Portal>
    </Drawer.Root>
}

export const CustomAnimatedPopover = (props: CustomAnimatedPopoverProps) => {
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (props.open && ref.current && !(ref.current as any).contains(event.target)) {
                props.onOpenChange();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [props]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (props.open && event.key === "Escape") {
                props.onOpenChange();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [props]);

    const isWidescreen = useMediaQuery('(pointer: fine)')

    return isWidescreen
        ? <ControlledPopover
            anchor={props.anchor}
            button={props.button}
            onOpenChange={props.onOpenChange}
            open={props.open}
            panel={props.panel}
            ref={ref}
        />
        : <ControlledDrawer
            button={props.button}
            onOpenChange={props.onOpenChange}
            open={props.open}
            panel={props.panel}
        />
}