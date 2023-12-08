import { ReactNode } from "react";

/// --- PropTypes ------------------------------------------------------------------------------------------------------
export type Props = {
	title?: string | undefined
	isVisible: boolean
	setVisible: (visible: boolean) => void
	children: ReactNode
}