import type { ExecResult } from "@lib/regex/types"

class Regex {
	static readonly BREAK = "break"

	regexp: RegExp

	constructor(regexp: RegExp) {
		this.regexp = new RegExp(regexp.source, regexp.flags)
	}

	add(regexp: RegExp) {
		this.regexp = new RegExp(
			`${this.regexp.source}${regexp.source}`,
			this.regexp.flags,
		)

		return this
	}

	test(string: string) {
		return this.regexp.test(string)
	}

	exec(string: string, callback: (match: ExecResult) => unknown) {
		const iterator = this.#iterateExec(string)

		let current = iterator.next()

		while (!current.done) {
			const result = callback(current.value)
			if (result === Regex.BREAK) break
			current = iterator.next()
		}

		return this
	}

	match(string: string): ExecResult | null {
		const global = new Regex(
			new RegExp(
				this.regexp.source,
				this.regexp.flags.includes("g")
					? this.regexp.flags
					: `${this.regexp.flags}g`,
			),
		)

		let result: ExecResult | null = null

		global.exec(string, (match) => {
			result = match
			return Regex.BREAK
		})

		return result
	}

	clone() {
		return new Regex(new RegExp(this.regexp.source, this.regexp.flags))
	}

	toMatcher() {
		return this.match.bind(this)
	}

	*#iterateExec(string: string): Generator<ExecResult, undefined, unknown> {
		if (!this.regexp.flags.includes("g")) {
			throw new Error(
				`\`/${this.regexp.source}/\` must have the global \`g\` flag to exec over \`"${string}"\`.`,
			)
		}

		let match: RegExpExecArray | null = this.regexp.exec(string)

		while (match !== null) {
			if (match) {
				yield {
					range: [match.index, match.index + match[0].length],
					match: [...match],
				}
			}
			match = this.regexp.exec(string)
		}
	}
}

export default Regex