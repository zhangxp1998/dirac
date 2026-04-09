/**
 * List of email domains that are considered trusted testers for Dirac.
 */
const DIRAC_TRUSTED_TESTER_DOMAINS = ["fibilabs.tech"]

/**
 * Checks if the given email belongs to a Dirac bot user.
 * E.g. Emails ending with @dirac.run
 */
export function isDiracBotUser(email: string): boolean {
	return email.endsWith("@dirac.run")
}

export function isDiracInternalTester(email: string): boolean {
	return isDiracBotUser(email) || DIRAC_TRUSTED_TESTER_DOMAINS.some((d) => email.endsWith(`@${d}`))
}
