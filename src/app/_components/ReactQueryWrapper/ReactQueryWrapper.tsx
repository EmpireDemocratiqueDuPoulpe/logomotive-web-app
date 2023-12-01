"use client";

import React from "react";
import {MutationCache, QueryCache, QueryClient, QueryClientProvider} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactQuery } from "@/constants";
import { Props } from "./ReactQueryWrapper.types";
import toast from "react-hot-toast";
import type { JSONResponse } from "@/utils/Endpoint.types";
import {hasProps} from "@/utils/misc";

const queryClient: QueryClient = new QueryClient({
	defaultOptions: ReactQuery.CLIENT_CONFIG,
	queryCache: new QueryCache({
		onError(error: unknown) : void {
			let errorMessage: string;

			if (hasProps(error, "status", "error")) {
				errorMessage = (error as JSONResponse).error!;
			} else if (error instanceof Error) {
				errorMessage = error.message;
			} else {
				errorMessage = `${error}`;
			}

			toast.error(errorMessage);
		}
	}),
	mutationCache: new MutationCache({
		onError(error: unknown) : void {
			let errorMessage: string;

			if (hasProps(error, "status", "error")) {
				errorMessage = (error as JSONResponse).error!;
			} else if (error instanceof Error) {
				errorMessage = error.message;
			} else {
				errorMessage = `${error}`;
			}

			toast.error(errorMessage);
		}
	})
});

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