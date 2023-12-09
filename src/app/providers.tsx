"use client";

import React from "react";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useRouter } from "next/navigation";

export function Providers({ children }: { children: React.ReactNode }) {
	/* --- States -------------------------------- */
	const router = useRouter();

	/* --- Providers ----------------------------- */
	return (
		<NextUIProvider navigate={router.push}>
			<NextThemesProvider attribute="class" defaultTheme="light">
				{children}
			</NextThemesProvider>
		</NextUIProvider>
	);
}