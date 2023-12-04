export type Script = {
	script_id: number
	user_id: number
	name: string
	content: string
	tags?: string[]
	is_public: boolean
	created_at: string
	updated_at: string
}

export type NewScript = Omit<Script, "script_id" | "user_id" | "created_at" | "updated_at">
export type UpdatingScript = Omit<Script, "user_id" | "created_at" | "updated_at">

export type PublicScript = Omit<Script, "user_id" | "content" | "is_public"> & {
	username: string
}

export type ScriptInfo = Omit<Script, "content"> & {
	fileSize: number
}

export type ScriptSharingLink = {
	link_id: string
	script_id: number
};
export type NewScriptSharingLink = Omit<ScriptSharingLink, "link_id">
export type SharingLinkID = Omit<ScriptSharingLink, "script_id">

declare global {
	interface Navigator {
		msSaveBlob?: (blob: any, defaultName?: string) => boolean
	}
}
