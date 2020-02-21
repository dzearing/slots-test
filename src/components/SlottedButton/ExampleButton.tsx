import * as React from "react";
import { withSlots } from "../withSlots";
import styles from "../Button.module.scss";
import cx from "classnames";

export interface IExampleButtonProps extends React.ButtonHTMLAttributes<any> {
  as?: string;
}

/**
 * Example of a slotted button.
 */
export const ExampleButton = withSlots<
  { before: any; after: any },
  IExampleButtonProps
>(
  (props, renderSlot, hasSlot) => {
    return (
      <button
        {...props}
        className={cx(styles.root, props.disabled && styles.disabled)}
      >
        {hasSlot("before") && <span>{renderSlot("before")}</span>}
        {props.children && <span>{props.children}</span>}
        {hasSlot("after") && <span>{renderSlot("after")}</span>}
      </button>
    );
  },
  ["before", "after"]
);
