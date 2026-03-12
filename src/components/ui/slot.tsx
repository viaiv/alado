import * as React from "react"

interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode
}

const Slot = React.forwardRef<HTMLElement, SlotProps>(
  ({ children, ...props }, ref) => {
    if (!React.isValidElement(children)) {
      return null
    }
    const childProps = children.props as Record<string, unknown>
    return React.cloneElement(children, {
      ...props,
      ...childProps,
      ref,
    } as React.Attributes & Record<string, unknown>)
  }
)
Slot.displayName = "Slot"

export { Slot }
