import { isStringArray } from "@lib/ts/guards"
import { isConfigTranslations } from "@src/core/state/guards/config-translations.guard"
import type { AstroI18nConfig } from "@src/core/state/types"

export function isConfig(config: unknown): config is AstroI18nConfig {
	if (!config || typeof config !== "object") return false

	for (const [key, value] of Object.entries(config)) {
		switch (key) {
			case "primaryLocale": {
				if (typeof value !== "string") return false
				break
			}
			case "secondaryLocales": {
				if (!isStringArray(value)) return false
				break
			}
			case "showPrimaryLocale": {
				if (typeof value !== "boolean") return false
				break
			}
			case "trailingSlash": {
				if (value !== "always" && value !== "never") return false
				break
			}
			case "run": {
				if (value !== "server" && value !== "client+server") {
					return false
				}
				break
			}
			case "translations": {
				if (!isConfigTranslations(value)) return false
				break
			}
			case "routes": {
				return false
			}
			default: {
				return false
			}
		}
	}

	return true
}