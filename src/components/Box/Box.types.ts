import { ReactNode } from "react";
import type { Property } from "csstype";

/// --- PropTypes ------------------------------------------------------------------------------------------------------
export type Props = {
	width?: Property.Width
	height?: Property.Height
	children: ReactNode
}