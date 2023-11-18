import type { UseQueryResult } from "@tanstack/react-query";
import type { JSONResponse } from "@/utils/Endpoint.types";
import type { PublicScript } from "@/typings/global";

/// --- Types ----------------------------------------------------------------------------------------------------------
export type UsePublicScriptsData = UseQueryResult<JSONResponse<{ scripts: PublicScript[] }>>