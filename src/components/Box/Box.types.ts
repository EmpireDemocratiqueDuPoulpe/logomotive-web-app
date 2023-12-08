import { ReactNode } from "react";
import type { Property } from "csstype";

/// --- PropTypes ------------------------------------------------------------------------------------------------------
export type Props = {
	className?: string | string[]
	width?: Property.Width
	height?: Property.Height
	header?: ReactNode
	children: ReactNode
}