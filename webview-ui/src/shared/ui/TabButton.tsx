import React from "react"
import { cn } from "@/lib/utils"

interface TabButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	isActive: boolean
}

export const TabButton = ({ isActive, children, className, ...props }: TabButtonProps) => (
	<button
		className={cn(
			"px-3 py-2 text-xs font-semibold border-b-2 transition-colors focus:outline-none uppercase",
			isActive
				? "border-(--vscode-panelTitle-activeBorder) text-(--vscode-panelTitle-activeForeground)"
				: "border-transparent text-(--vscode-panelTitle-inactiveForeground) hover:text-(--vscode-panelTitle-activeForeground)",
			className,
		)}
		{...props}>
		{children}
	</button>
)
