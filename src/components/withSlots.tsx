import * as React from "react";

const processSlots = (
  children: undefined | null | React.ReactChildren | React.ReactChildren[]
): {
  slots: { [key: string]: any };
  children: React.ReactChildren | React.ReactChildren[] | null | undefined;
} => {
  const slots: { [key: string]: any } = {};

  return {
    children:
      children &&
      React.Children.map(children, (child: any) => {
        if (child && child.type && child.type.__slotName) {
          // return in context, filter out of children
          slots[child.type.__slotName] = child.props.children;

          return null;
        }

        return child;
      }),
    slots
  };
};

export type RenderSlotFunction = (
  name: string,
  content?: string | null | JSX.Element,
  state?: any
) => undefined | null | string | JSX.Element;

export type HasSlotFunction = (name: string) => boolean;

export type RenderComponentFunction<TProps> = (
  props: TProps,
  renderSlot: RenderSlotFunction,
  hasSlot: HasSlotFunction
) => JSX.Element;

interface ISlotInternals<TProps> {
  props: TProps;
  slots: {
    [key: string]:
      | undefined
      | null
      | string
      | JSX.Element
      | ((
          content?: null | string | JSX.Element,
          state?: any
        ) => undefined | null | string | JSX.Element);
  };
  children?: React.ReactChildren;
  renderSlot: RenderSlotFunction;
  hasSlot: HasSlotFunction;
}

function initializeInternals<TProps>(): ISlotInternals<TProps> {
  const internals: any = {
    props: undefined,
    children: undefined,
    slots: {},
    renderSlot: undefined,
    hasSlot: undefined
  };

  internals.renderSlot = (
    name: string,
    content?: string | null | JSX.Element,
    state: any = internals.props
  ) => {
    const slots = internals.slots as any;

    if (slots.hasOwnProperty(name)) {
      const newContent = slots[name];

      return typeof newContent === "function"
        ? newContent(content, state)
        : newContent;
    }

    return content;
  };

  internals.hasSlot = (name: string) => !!internals.slots[name];

  return internals;
}

/**
 * HOC wrapper to render slots.
 * @param renderComponent - A function which takes in props, renderSlot, and hasSlot, and returns jsx.
 * @param slots - an array of slot names for building static slot components.
 */
export function withSlots<
  TSlots,
  TProps = React.PropsWithChildren<any>,
  TState = TProps
>(
  renderComponent: RenderComponentFunction<TProps>,
  slots: (keyof TSlots)[]
): React.SFC<TProps> & {
  slots: {
    [key in keyof TSlots]: React.SFC<{
      children?:
        | React.ReactChild
        | ((content: JSX.Element, state: TState) => React.ReactChild);
    }>;
  };
} {
  const ComponentWithSlots: any = React.forwardRef<any, TProps>(
    (props, ref) => {
      // Get/initialize internal state.
      const [internals] = React.useState<ISlotInternals<TProps>>(
        initializeInternals
      );

      // Assign props and slots to the internal state.
      Object.assign(internals, {
        props,
        ...processSlots(props.children as any)
      });

      // Render the component.
      return renderComponent(
        { ...props, ref, children: internals.children },
        internals.renderSlot,
        internals.hasSlot
      );
    }
  );

  // Build statics on the component to reference the slots.
  const slotSet: any = (ComponentWithSlots.slots = {});

  for (const name of slots as any) {
    slotSet[name] = (p: React.PropsWithChildren<{}>) => p.children;
    slotSet[name].__slotName = name;
  }

  return ComponentWithSlots as any;
}
