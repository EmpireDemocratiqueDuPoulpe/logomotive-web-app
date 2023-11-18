import type {UseMutationResult, UseQueryResult} from "@tanstack/react-query";
import type { JSONResponse } from "@/utils/Endpoint.types";
import type { NewScript, Script, UpdatingScript } from "@/typings/global";

/// --- Types ----------------------------------------------------------------------------------------------------------
export type UseScriptData = UseQueryResult<JSONResponse<{ script: Script }>> & {
	create: UseMutationResult<JSONResponse<{ script_id: number }>, Error, NewScript>
	update: UseMutationResult<JSONResponse<{}>, Error, UpdatingScript>
}