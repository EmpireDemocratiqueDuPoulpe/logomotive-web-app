import type { UseQueryResult } from "@tanstack/react-query";
import type { JSONResponse } from "@/utils/Endpoint.types";
import type { ScriptInfo } from "@/typings/global";

/// --- Types ----------------------------------------------------------------------------------------------------------
export type UseScriptsData = UseQueryResult<JSONResponse<{ scripts: ScriptInfo[] }>>