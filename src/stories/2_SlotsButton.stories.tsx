import React from "react";
import { ExampleButton } from "../components/SlottedButton/ExampleButton";
import "../normalize.scss";

export default {
  title: "Button with slots",
  component: ExampleButton
};

export const ExampleButtonUsage = () => {
  const [disabled, setDisabled] = React.useState(false);
  const { before: Before, after: After } = ExampleButton.slots;

  React.useEffect(() => {
    const id = setInterval(() => setDisabled(v => !v), 1000);

    return () => clearInterval(id);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        textAlign: "center",
        flexDirection: "column",
        alignItems: "center",
        maxWidth: 400
      }}
    >
      <p>By default, this button renders children.</p>
      <ExampleButton>I am a button</ExampleButton>

      <p>
        Let's add icons. Note that there is no gap space between the
        "BeforeIcon", "Text", and "AfterIcon".
      </p>
      <ExampleButton>
        <ExampleButton.slots.before />
        <span>BeforeIcon</span>
        Text
        <span>AfterIcon</span>
      </ExampleButton>

      <p>
        Slots allow the caller to render content in specific managed locations
        within the component. In this example there is now gap space between the
        icon and text, because the icon targets the "before" slot.
      </p>

      <ExampleButton>
        <Before>BeforeIcon</Before>
        Text
        <After>AfterIcon</After>
      </ExampleButton>

      <p>
        Slots can be functions, where content can be dynamic based on the state
        of the component.
      </p>
      <ExampleButton disabled={disabled}>
        <Before>
          {(content, state) => `${state.disabled ? "DisabledIcon" : "Icon"}`}
        </Before>
        <span>Text</span>
      </ExampleButton>
    </div>
  );
};
