import React from "react";
import type { Metadata } from "next";
import { App } from "@/constants";

export const metadata: Metadata = {
	title: `${App.APP_NAME} - Éditeur de script`
};

export default function ClientLayout({ children }: { children: React.ReactNode }) {
	return children;
}