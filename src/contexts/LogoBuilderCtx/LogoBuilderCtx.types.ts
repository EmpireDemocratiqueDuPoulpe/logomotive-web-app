import type { ReactNode } from "react";
import LogoInterpreter from "@/utils/LogoInterpreter/LogoInterpreter";

/// --- Types ----------------------------------------------------------------------------------------------------------
export type LogoBuilderCtxValues = Readonly<{
	interpreter: LogoInterpreter
	registerCanvas: (type: "draw" | "pointer", canvas: HTMLCanvasElement | null) => void
	executeCommand: (command: string) => void
}>

/// --- PropTypes ------------------------------------------------------------------------------------------------------
export type ProviderProps = { children?: ReactNode };