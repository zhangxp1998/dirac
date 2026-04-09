import "../../../node_modules/@vscode/codicons/dist/codicon.css"
import "../../../node_modules/@vscode/codicons/dist/codicon.ttf"
import "../../src/index.css"

import { cn } from "@heroui/react"
import type { Decorator } from "@storybook/react-vite"
import React from "react"
import { DiracAuthContext, DiracAuthContextType, DiracAuthProvider, useDiracAuth } from "@/context/DiracAuthContext"
import { useSettingsStore } from "@/features/settings/store/settingsStore"
import { StorybookThemes } from "../../.storybook/themes"

// Component that handles theme switching
const ThemeHandler: React.FC<{ children: React.ReactNode; theme?: string }> = ({ children, theme }) => {
	React.useEffect(() => {
		const styles = theme?.includes("light") ? StorybookThemes.light : StorybookThemes.dark

		// Apply CSS variables to the document root
		const root = document.documentElement
		Object.entries(styles).forEach(([property, value]) => {
			root.style.setProperty(property, value)
		})

		document.body.style.backgroundColor = styles["--vscode-editor-background"]
		document.body.style.color = styles["--vscode-editor-foreground"]
		document.body.style.fontFamily = styles["--vscode-font-family"]
		document.body.style.fontSize = styles["--vscode-font-size"]

		return () => {
			// Cleanup on unmount
			Object.keys(styles).forEach((property) => {
				root.style.removeProperty(property)
			})
		}
	}, [theme])

	return <>{children}</>
}
function StorybookDecoratorProvider(className = "relative"): Decorator {
	return (story, parameters) => {
		return (
			<div className={className}>
				<>
					<DiracAuthProvider>
						<ThemeHandler theme={parameters?.globals?.theme}>{React.createElement(story)}</ThemeHandler>
					</DiracAuthProvider>
				</>
			</div>
		)
	}
}

const ExtensionStateProviderWithOverrides: React.FC<{
	overrides?: any
	children: React.ReactNode
}> = ({ overrides, children }) => {
	React.useEffect(() => {
		if (overrides) {
			useSettingsStore.getState().setSettings(overrides)
		}
	}, [overrides])
	return <>{children}</>
}

const DiracAuthProviderWithOverrides: React.FC<{
	overrides?: Partial<DiracAuthContextType>
	children: React.ReactNode
}> = ({ overrides, children }) => {
	const authContext = useDiracAuth()
	return <DiracAuthContext.Provider value={{ ...authContext, ...overrides }}>{children}</DiracAuthContext.Provider>
}

export const createStorybookDecorator =
	(overrideStates?: any, classNames?: string, authOverrides?: Partial<DiracAuthContextType>) => (Story: any) => (
		<ExtensionStateProviderWithOverrides overrides={overrideStates}>
			<DiracAuthProviderWithOverrides overrides={authOverrides}>
				<div className={cn("max-w-lg mx-auto", classNames)}>
					<Story />
				</div>
			</DiracAuthProviderWithOverrides>
		</ExtensionStateProviderWithOverrides>
	)

export const StorybookWebview = StorybookDecoratorProvider()
