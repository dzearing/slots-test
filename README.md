# react-slotable

React utilities which can help your components be more easily customized through named slots.

## Example usage

Let's start with a button component with some icons:

```tsx
const Button = props => {
  const { children, beforeIcon, afterIcon } = props;

  return (
    <button>
      {beforeIcon && <Icon name={beforeIcon} />}
      <span>{children}</span>
      {afterIcon && <Icon name={afterIcon} />}
    </button>
  );
};
```

This component suffers from a number of issues:

- before/after icons are not easily replacable with icons from other libraries
- hard dependency on Icon component, impacts bundle size
- opinions for the Icons are hard coded and can't be overridden

This can make developers lean away from your Button implementation.

## Introducing slots using `withSlots`

Slots provide a way for component producers to define "placeholder" areas in their component. They have a name and can define default rendered content.

```tsx
/**
 * Wrap a functional component using `withSlots`, taking an additional
 * renderSlot function parameter.
 */
const Button = withSlots((props, renderSlot) => {
  const { children, beforeIcon, afterIcon } = props;

  /**
   * Inidividual slotted areas are wrapped using the provided renderSlot
   * function, taking in the slot name, the default content, and optionally
   * the component state.
   */
  return (
    <button>
      {beforeIcon && renderSlot("before", <Icon name={beforeIcon} />)}

      <span>{children}</span>

      {afterIcon && renderSlot("before", <Icon name={afterIcon} />)}
    </button>
  );
});
```

The component will render identically to the previous with no api surface change or React component heirarchy wrappers, except that we've solved some of our initial problems.

Before, you could not change out icon implementations:

```tsx
<Button beforeIcon="Add" afterIcon="">
  content
</Button>
```

...but now you can completely replace it through children:

```tsx
<Button>
  <Slot name="beforeIcon">
    <AddIcon />
  </Slot>
  content
</Button>
```

...or clear it:

```tsx
<Button>
  <Slot name="beforeIcon" />
  content
</Button>
```

...or dynamically render new content based on the parent state:

```tsx
<Button>
  <Slot name="beforeIcon">{
    (defaultContent, state) => (
      state.disabled ? <DisabledAddIcon/> : <AddIcon/>
    )
  } />
  content
</Button>
```

...or wrap default content in a Tooltip:

```tsx
<Button>
  <Slot name="beforeIcon">{
    (defaultContent, state) => (
      <Tooltip>
        {
      state.disabled ? <DisabledAddIcon/> : <AddIcon/>
        }
      </Tooltip>
    )
  } />
  content
</Button>
```

### How it works
