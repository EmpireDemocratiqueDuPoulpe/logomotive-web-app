/// --- Types ----------------------------------------------------------------------------------------------------------
export type Line = {
	from: { x: number, y: number }
	to: { x: number, y: number }
};

export type RenderReason = "DOMUpdate" | "AssetLoaded" | "Command" | null;