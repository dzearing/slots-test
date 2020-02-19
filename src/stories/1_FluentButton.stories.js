import React from "react";
import Button from "../components/Button";

export default {
  title: "Button",
  component: Button
};

export const FluentThemedButtons = () => (
  <table>
    <tr>
      <td></td>
      <td>Default</td>
      <td>Primary</td>
      <td>Icon only</td>
    </tr>
    <tr>
      <td>Rested</td>
      <td>
        <Button>
          <span style={{ background: "red", display: "block", width: 16 }}>
            X
          </span>
          Default button with slots
        </Button>
      </td>
      <td>
        <Button primary icon="x" content="Primary Button" />
      </td>
      <td>
        <Button primary iconOnly icon="x" />
      </td>
    </tr>
    <tr>
      <td>Disabled</td>
      <td>
        <Button disabled icon="x" content="Default Button" />
      </td>
      <td>
        <Button disabled primary icon="x" content="Primary Button" />
      </td>
      <td>
        <Button disabled primary iconOnly icon="x" />
      </td>
    </tr>
  </table>
);
