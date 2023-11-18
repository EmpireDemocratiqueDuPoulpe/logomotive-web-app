export type Script = {
	script_id: number
	user_id: number
	name: string
	content: string
}

export type NewScript = Omit<Script, "script_id" | "user_id">

export type ScriptInfo = Omit<Script, "content"> & {
	fileSize: number
}

declare global {
	interface Navigator {
		msSaveBlob?: (blob: any, defaultName?: string) => boolean
	}
}
