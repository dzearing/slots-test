import * as React from "react";
import { withSlots } from "../useSlots";
import styles from "../Button.module.scss";
import cx from "classnames";

/**
 * Example of a slotted button.
 */
export const ExampleButton = withSlots((props, renderSlot) => {
  const { as: Root = "button" } = props;

  return (
    <Root
      {...props}
      className={cx(styles.root, props.disabled && styles.disabled)}
    >
      <span>{renderSlot("before")}</span>
      <span>{props.children}</span>
      <span>{renderSlot("after")}</span>
    </Root>
  );
});
