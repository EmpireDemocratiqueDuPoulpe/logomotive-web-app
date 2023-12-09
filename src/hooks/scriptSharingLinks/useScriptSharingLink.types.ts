import type { UseQueryResult, UseMutationResult } from "@tanstack/react-query";
import type { JSONResponse } from "@/utils/Endpoint.types";
import type { Script, NewScriptSharingLink, SharingLinkID } from "@/typings/global";

/// --- Types ----------------------------------------------------------------------------------------------------------
export type UseScriptSharingLinkData = UseQueryResult<JSONResponse<{ script: Script }>> & {
    create: UseMutationResult<JSONResponse<SharingLinkID>, Error, NewScriptSharingLink>
    delete: UseMutationResult<JSONResponse<{}>, Error, SharingLinkID>
}