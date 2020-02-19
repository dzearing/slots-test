import * as React from "react";
export const Slot = (props: {
  name: string;
  children?:
    | null
    | undefined
    | JSX.Element
    | string
    | ((
        C: any,
        props: any,
        state: any
      ) => undefined | null | string | JSX.Element);
}) => {
  return <>{props.children}</>;
};

const clearObject = (obj: Object) => {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      delete (obj as any)[key];
    }
  }
};

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
        if (child && child.type === Slot) {
          // return in context, filter out of children
          slots[child.props.name] = child.props.children;

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

export function withSlots<
  TSlots,
  TComponent = React.SFC,
  TProps = React.PropsWithChildren<any>
>(
  renderComponent: (
    props: TProps,
    renderSlot: RenderSlotFunction
  ) => JSX.Element
): TComponent & { slots: { [key in keyof TSlots]: React.ReactType } } {
  const ComponentWithSlots: any = React.forwardRef<TComponent, TProps>(
    (props, ref) => {
      // Pull out filtered children and slot context value
      const [internals] = React.useState<{
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
      }>({ props, slots: {} });

      Object.assign(internals, {
        props,
        ...processSlots(props.children as any)
      });

      const renderSlot: RenderSlotFunction = React.useCallback(
        (
          name: string,
          content?: string | null | JSX.Element,
          state: any = internals.props
        ) => {
          const slots = internals.slots;

          if (slots.hasOwnProperty(name)) {
            const newContent = slots[name];

            return typeof newContent === "function"
              ? newContent(content, state)
              : newContent;
          }

          return content;
        },
        []
      );

      return renderComponent(
        { ...props, ref, children: internals.children },
        renderSlot
      );
    }
  );

  // for (const name of slots) {
  //   // should equate to this:
  //   ComponentWithSlots[name] = props => <Slot {...props} name={name}> />;
  //   // should look like this for typings:
  //   ComponentWithSlots[name] = createSlotComponent<TState>(name);

  return ComponentWithSlots;
}
