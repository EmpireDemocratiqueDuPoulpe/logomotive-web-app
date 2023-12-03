import { ReactNode } from "react";
import type { Property } from "csstype";

/// --- PropTypes ------------------------------------------------------------------------------------------------------
export type Props = {
	direction: Property.FlexDirection
	children: ReactNode
}