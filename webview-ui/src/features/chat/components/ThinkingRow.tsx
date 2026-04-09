import { ChevronDownIcon, ChevronRightIcon } from "lucide-react"
import { memo, useCallback, useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/shared/ui/button"

interface ThinkingRowProps {
	showTitle: boolean
	reasoningContent?: string
	isVisible: boolean
	isExpanded: boolean
	onToggle?: () => void
	title?: string
	isStreaming?: boolean
	showChevron?: boolean
	onAskForUpdate?: () => void
}

export const ThinkingRow = memo(
	({
		showTitle = false,
		reasoningContent,
		isVisible,
		isExpanded,
		onToggle,
		title = "Thinking",
		isStreaming = false,
		showChevron = true,
		onAskForUpdate,
	}: ThinkingRowProps) => {
		const [thinkingTime, setThinkingTime] = useState(0)

		useEffect(() => {
			let interval: NodeJS.Timeout | undefined
			if (isStreaming) {
				interval = setInterval(() => {
					setThinkingTime((prev) => prev + 1)
				}, 1000)
			} else {
				setThinkingTime(0)
			}
			return () => {
				if (interval) clearInterval(interval)
			}
		}, [isStreaming])

		const scrollRef = useRef<HTMLDivElement>(null)
		const [canScrollUp, setCanScrollUp] = useState(false)
		const [canScrollDown, setCanScrollDown] = useState(false)

		const checkScrollable = useCallback(() => {
			if (scrollRef.current) {
				const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
				setCanScrollUp(scrollTop > 1)
				setCanScrollDown(scrollTop + clientHeight < scrollHeight - 1)
			}
		}, [])

		// Only auto-scroll to bottom during streaming (showCursor=true)
		// For expanded collapsed thinking, start at top
		useEffect(() => {
			if (scrollRef.current && isVisible) {
				scrollRef.current.scrollTop = scrollRef.current.scrollHeight
			}
			checkScrollable()
		}, [reasoningContent, isVisible, checkScrollable])

		if (!isVisible) {
			return null
		}

		// Don't render anything if collapsed and no title (nothing to show)
		if (!isExpanded && !showTitle) {
			return null
		}

		return (
			<div className="ml-1 pl-0 mb-2 -mt-[2px] transition-all duration-300">
				{showTitle ? (<>
					<Button
						className={cn(
							"inline-flex justify-baseline gap-0.5 text-left select-none px-0 py-0 my-0 h-auto min-h-0 w-full text-description overflow-visible",
							{
								"cursor-pointer": !!onToggle,
								"cursor-default": !onToggle,
							},
						)}
						onClick={onToggle}
						size="icon"
						variant="icon">
						<span
							className={cn("text-[13px] leading-[1.2] font-medium tracking-tight", {
								"animate-shimmer bg-linear-90 from-glow-plan via-description to-glow-plan bg-[length:200%_100%] bg-clip-text text-transparent":
									isStreaming,
								"select-none": isStreaming,
							})}>
							{title}
						</span>
						{showChevron &&
							(isExpanded ? (
								<ChevronDownIcon className="!size-1 text-description" />
							) : (
								<ChevronRightIcon className="!size-1 text-description" />
							))}
					</Button>

					{isStreaming && thinkingTime >= 60 && onAskForUpdate && (
						<div className="mt-2 flex items-center gap-2">
							<Button
								className="h-7 px-3 text-[11px] bg-button-background hover:bg-button-hover text-button-foreground border-0 rounded-xs flex items-center gap-1.5 transition-all duration-200 animate-in fade-in slide-in-from-top-1"
								onClick={(e) => {
									e.stopPropagation()
									onAskForUpdate()
								}}
								size="sm"
								variant="secondary">
								Ask model for an update
							</Button>
							<span className="text-[10px] text-description opacity-50">Thinking for {thinkingTime}s</span>
						</div>
					)}
				</>) : null}

				{isExpanded && (
					<Button
						className={cn(
							"flex gap-0 overflow-hidden w-full min-w-0 max-h-0 opacity-0 items-baseline justify-baseline text-left !p-0 !pl-0",
							"disabled:cursor-text disabled:opacity-100",
							{
								"max-h-[200px] opacity-100 mt-1": isExpanded,
								"transition-all duration-500 ease-in-out": isExpanded,
							},
						)}
						disabled={!showTitle}
						onClick={onToggle}
						variant="text">
						<div className="relative flex-1">
							<div
								className={cn(
									"flex max-h-[150px] overflow-y-auto text-description/90 leading-relaxed truncated whitespace-pre-wrap break-words pl-2 border-l border-white/5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden [direction:ltr]",
								)}
								onScroll={checkScrollable}
								ref={scrollRef}>
								<span className="pb-2 block text-sm italic opacity-80">{reasoningContent}</span>
							</div>
							{canScrollUp && (
								<div className="absolute top-0 left-0 right-0 h-6 pointer-events-none bg-gradient-to-b from-background to-transparent" />
							)}
							{canScrollDown && (
								<div className="absolute bottom-0 left-0 right-0 h-6 pointer-events-none bg-gradient-to-t from-background to-transparent" />
							)}
						</div>
					</Button>
				)}
			</div>
		)
	},
)

ThinkingRow.displayName = "ThinkingRow"
