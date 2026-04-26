import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const inputVariants = cva(
  "h-10 w-full min-w-0 border-input bg-transparent px-3 py-2 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
  {
    variants: {
      cut: {
        "tr-bl": "clip-btn-tr-bl rounded-none border-b-2 border-r-2 border-l border-t",
        "tl-br": "clip-btn-tl-br rounded-none border-b-2 border-r-2 border-l border-t",
        "tr": "clip-btn-tr rounded-none border-b-2 border-r-2 border-l border-t",
        "tl": "clip-btn-tl rounded-none border-b-2 border-r-2 border-l border-t",
        "br": "clip-btn-br rounded-none border-b-2 border-r-2 border-l border-t",
        "bl": "clip-btn-bl rounded-none border-b-2 border-r-2 border-l border-t",
        "none": "rounded-lg border",
      },
    },
    defaultVariants: {
      cut: "tr-bl",
    },
  }
)

export interface InputProps
  extends Omit<React.ComponentProps<"input">, "size">,
  VariantProps<typeof inputVariants> { }

function Input({ className, type, cut = "br", ...props }: InputProps) {
  if (cut === "none") {
    return (
      <input
        type={type}
        data-slot="input"
        className={cn(
          "flex h-10 w-full min-w-0 rounded-lg border border-input bg-transparent px-3 py-2 text-base transition-colors outline-none",
          "placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
          "disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50",
          className
        )}
        {...props}
      />
    );
  }

  return (
    <div className="relative group flex w-full">
      {/* Focus ring layer */}
      <div className={cn(`absolute -inset-[2px] transition-opacity opacity-0 group-focus-within:opacity-100 bg-ring/20 pointer-events-none clip-btn-${cut}`)} />

      {/* Border layer */}
      <div className={cn(`absolute inset-0 transition-colors bg-input group-focus-within:bg-ring pointer-events-none clip-btn-${cut}`)} />

      {/* Background layer */}
      <div className={cn(`absolute inset-[1px] bg-white transition-colors pointer-events-none clip-btn-${cut}`)} />

      {/* Transparent Input element on top */}
      <input
        type={type}
        data-slot="input"
        data-cut={cut}
        className={cn(
          "relative z-10 w-full h-10 bg-transparent px-3 py-2 text-base outline-none",
          "placeholder:text-muted-foreground md:text-sm",
          "disabled:cursor-not-allowed disabled:opacity-50 border-0 focus:ring-0",
          className
        )}
        {...props}
      />
    </div>
  )
}

export { Input }
