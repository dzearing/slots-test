import React from "react";
import { Slot } from "../components/useSlots";
import { ExampleButton } from "../components/SlottedButton/ExampleButton";

export default {
  title: "Button with slots",
  component: ExampleButton
};

export const ExampleButtonUsage = () => {
  const [disabled, setDisabled] = React.useState(false);

  React.useEffect(() => {
    const id = setInterval(() => setDisabled(v => !v), 1000);

    return () => clearInterval(id);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
      }}
    >
      <h3>
        By default, components render children. In this example, note that there
        is no gap space between the "icon" and "text".
      </h3>
      <ExampleButton>
        <span>Icon</span>
        <span>Text</span>
      </ExampleButton>

      <h3>
        Slots allow the caller to render content in specific locations within
        the component. In this example there is now gap space between the icon
        and text, because the icon targets the "before" slot.
      </h3>
      <ExampleButton>
        <Slot name="before">
          <span>Icon</span>
        </Slot>
        <span>Text</span>
      </ExampleButton>

      <h3>
        Slots can be functions, where content can be dynamic based on the state
        of the component.
      </h3>
      <ExampleButton disabled={disabled}>
        <Slot name="before">
          {(content, state) => (
            <span>{`${state.disabled ? "DisabledIcon" : "Icon"} `}</span>
          )}
        </Slot>
        <span>Text</span>
      </ExampleButton>

      <h3>
        Using a Slot component to render slots loses some type safety. To
        re-enable type safety, you can use static members on the component to
        get type safe slots:
      </h3>
      <div>TODO</div>
      {/* <ExampleButton disabled={disabled}>
        <ExampleButton.before>
          {(content, state) => (
            <span>{`${state.disabled ? "DisabledIcon" : "Icon"} `}</span>
          )}
        </ExampleButton.before>
        <span>Text</span>
      </ExampleButton> */}
    </div>
  );
};
