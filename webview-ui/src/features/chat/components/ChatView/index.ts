/**
 * Barrel export for chat-view utilities, hooks, components, and types
 */

// Export layout components
export * from "./components/layout"
export { ActionButtons } from "./components/layout/ActionButtons"
export { ChatLayout } from "./components/layout/ChatLayout"
export { InputSection } from "./components/layout/InputSection"
export { MessagesArea } from "./components/layout/MessagesArea"
export { TaskSection } from "./components/layout/TaskSection"
export { WelcomeSection } from "./components/layout/WelcomeSection"
// Export message components
export * from "./components/messages"
export * from "./constants"
export { InteractionStateProvider, useInteractionState } from "./context/InteractionStateContext"
// Export hooks
export * from "./hooks"
// Export types and constants
export * from "./types/chatTypes"
// Export utilities
export * from "./utils/markdownUtils"
export * from "./utils/messageUtils"
export * from "./utils/scrollUtils"
