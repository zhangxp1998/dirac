import * as proto from "@/shared/proto"
import { getAvailableTerminalProfiles as getTerminalProfilesFromShell } from "../../../utils/shell"
import { Controller } from "../index"

export async function getAvailableTerminalProfiles(
	_controller: Controller,
	_request: proto.dirac.EmptyRequest,
): Promise<proto.dirac.TerminalProfiles> {
	const profiles = getTerminalProfilesFromShell()

	return proto.dirac.TerminalProfiles.create({
		profiles: profiles.map((profile) => ({
			id: profile.id,
			name: profile.name,
			path: profile.path || "",
			description: profile.description || "",
		})),
	})
}
