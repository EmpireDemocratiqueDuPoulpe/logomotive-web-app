import type { UseQueryResult } from "@tanstack/react-query";
import type { JSONResponse } from "@/utils/Endpoint.types";

/// --- Types ----------------------------------------------------------------------------------------------------------
export type UseScriptSharingLinksData = UseQueryResult<JSONResponse<{ links: string[] }>>;