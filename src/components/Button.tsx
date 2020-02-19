import * as React from "react";
import { ButtonProps, ButtonBase } from "./Button.base";
import classes from "./Button.module.scss";

const Button = (props: ButtonProps) => ButtonBase({ ...props, classes });

export default Button;
