import * as fs from "fs"
import * as os from "os"

/**
 * Gets the number of available CPU cores, respecting cgroup limits if running on Linux.
 */
export function getAvailableCores(): number {
	let cores = os.cpus().length

	// Node.js 19.4.0+ has os.availableParallelism() which is generally better
	if (typeof os.availableParallelism === "function") {
		try {
			cores = os.availableParallelism()
		} catch (e) {
			// Fallback to os.cpus().length
		}
	}

	if (process.platform !== "linux") {
		return cores
	}

	try {
		// CFS Quota check (cgroup v2)
		// /sys/fs/cgroup/cpu.max contains "quota period"
		if (fs.existsSync("/sys/fs/cgroup/cpu.max")) {
			const content = fs.readFileSync("/sys/fs/cgroup/cpu.max", "utf8").trim()
			const parts = content.split(" ")
			if (parts.length === 2 && parts[0] !== "max") {
				const quota = parseInt(parts[0], 10)
				const period = parseInt(parts[1], 10)
				if (quota > 0 && period > 0) {
					const limit = Math.ceil(quota / period)
					if (limit > 0) {
						cores = Math.min(cores, limit)
					}
				}
			}
		}

		// CFS Quota check (cgroup v1)
		if (fs.existsSync("/sys/fs/cgroup/cpu/cpu.cfs_quota_us") && fs.existsSync("/sys/fs/cgroup/cpu/cpu.cfs_period_us")) {
			const quota = parseInt(fs.readFileSync("/sys/fs/cgroup/cpu/cpu.cfs_quota_us", "utf8").trim(), 10)
			const period = parseInt(fs.readFileSync("/sys/fs/cgroup/cpu/cpu.cfs_period_us", "utf8").trim(), 10)
			if (quota > 0 && period > 0) {
				const limit = Math.ceil(quota / period)
				if (limit > 0) {
					cores = Math.min(cores, limit)
				}
			}
		}
	} catch (e) {
		// Ignore errors reading cgroup files
	}

	return cores
}
