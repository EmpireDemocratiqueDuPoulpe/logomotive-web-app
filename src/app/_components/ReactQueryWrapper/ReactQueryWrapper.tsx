"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactQuery } from "@/constants";
import { Props } from "./ReactQueryWrapper.types";

const queryClient: QueryClient = new QueryClient(ReactQuery.CLIENT_CONFIG);

function ReactQueryWrapper({ children }: Props) : React.JSX.Element {
	/* --- Component ----------------------------- */
	return (
		<QueryClientProvider client={queryClient}>
			{children}

			<ReactQueryDevtools initialIsOpen={false}/>
		</QueryClientProvider>
	);
}

export default ReactQueryWrapper;