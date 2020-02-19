import * as React from "react";

// To be moved.
type StateHook<TSlots, TProps, TState = TProps> = (
  Component: any,
  props: TProps
) => {
  slotProps: { [key in keyof TSlots]?: any };
  state: any;
};

function getSlotProps<TSlots>(
  C: any,
  props: any,
  defaultSlotProps: any
): { [key in keyof TSlots]: any } {
  const slotProps: any = {};

  for (const slotName in C.slots) {
    let slotProp = props[slotName];

    // Shorthand reducer.
    if (typeof slotProp !== "object") {
      slotProp = {
        children: slotProp
      };
    }

    slotProps[slotName] = {
      ...defaultSlotProps[slotName],
      ...slotProp,
      className: props.classes[slotName]
    };
  }

  return slotProps;
}

// Helper function to be moved.
function getSlots<TSlots>(
  C: any,
  slotProps: any,
  state: any
): {
  slots: { [key in keyof TSlots]: React.ReactType };
  children: React.ReactChildren;
} {
  const slots: any = {};
  const { children: initialChildren } = state;
  const slotsFromChildren: any = {};

  const children = React.Children.map(initialChildren, child => {
    if (child && child.props) {
      const { slot } = child.props;

      return slot ? null : child;
    }

    return child;
  });

  for (const slotName in C.slots) {
    let slot = C.slots[slotName];

    // Derive the default slot.
    if (typeof slot === "function") {
      slot = slot(null, slotProps[slotName]);
    }
    if (slotName !== "root" && !state[slotName]) {
      console.log("blank", slotName);
      slot = () => null;
    }
    slots[slotName] = slot;
  }

  return { slots, children: children as React.ReactChildren };
}

//////////////////////////////////////////////////////////////////////////
// Types for slots.
export interface ButtonSlots {
  root: any;
  icon: any;
  content: any;
  endIcon: any;
}

// Types for variants.
export interface ButtonVariants {
  disabled: boolean;
  primary: boolean;
  checked: boolean;
  loading: boolean;
}

// Types for props.
export interface ButtonProps extends ButtonSlots, ButtonVariants {
  href?: string;
  classes: { [key: string]: string };
}

// Hook to abstract button state, accessibility, and prop distribution.
const useButton: StateHook<ButtonSlots, ButtonProps> = (
  C: any,
  props: ButtonProps
) => {
  return {
    slotProps: getSlotProps<ButtonSlots>(C, props, {}),
    state: props
  };
};

// Build the component heirarchy.
export const ButtonBase = (props: ButtonProps) => {
  const { slotProps, state } = useButton(ButtonBase, props);
  const { slots, children } = getSlots<ButtonSlots>(
    ButtonBase,
    slotProps,
    state
  );

  return (
    <slots.root {...slotProps.root}>
      <slots.icon {...slotProps.icon} />
      <slots.content {...slotProps.content} />
      {state.children}
      <slots.endIcon {...slotProps.endIcon} />
    </slots.root>
  );
};

// Define how the slots are derived.
ButtonBase.slots = {
  root: (C: any, p: any) => (p.href ? "a" : "button"),
  icon: "i",
  content: "span",
  endIcon: "i"
};

// Define how variants are split up.
ButtonBase.variants = ["disabled", "checked", "loading"];
