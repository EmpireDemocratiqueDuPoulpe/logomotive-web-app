/// --- Types ----------------------------------------------------------------------------------------------------------
export type Line = {
	from: { x: number, y: number }
	to: { x: number, y: number },
	hexColor: string
};

export type RenderReason = "DOMUpdate" | "AssetLoaded" | "Command" | null;

export type ScriptError = { line: number, error: string };

export type ScriptReturn = {
	status: "ok" | "failed"
	errors: ScriptError[]
};