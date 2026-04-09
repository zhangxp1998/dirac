import { describe, expect, it } from "vitest"
import { slashCommandRegex } from "../slash-commands"

describe("slash-commands", () => {
	describe("slashCommandRegex", () => {
		it("should match command format", () => {
			const text = "/newtask"
			const match = text.match(slashCommandRegex)
			expect(match).not.toBeNull()
			expect(match![2]).toBe("/newtask")
		})

		it("should match command in middle of text", () => {
			const text = "Please run /newtask now"
			const match = text.match(slashCommandRegex)
			expect(match).not.toBeNull()
			expect(match![2]).toBe("/newtask")
		})

		it("should not match command-like pattern in URL", () => {
			const text = "http://example.com/newtask"
			const match = text.match(slashCommandRegex)
			// Should not match because / is not preceded by whitespace or start
			expect(match).toBeNull()
		})
	})
})
