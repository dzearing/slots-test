import * as React from "react";

export const Iterator = (props: React.PropsWithChildren<{}>) => {
  React.useEffect(() => {
    const id = setTimeout(() => {}, 1000);

    return () => clearTimeout(id);
  });

  return props.children;
};
