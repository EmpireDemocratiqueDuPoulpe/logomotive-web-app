import type { UseQueryResult, UseMutationResult } from "@tanstack/react-query";
import type { JSONResponse } from "@/utils/Endpoint.types";
import type { Script, NewScriptSharingLink, SharingLinkID } from "@/typings/global";

/// --- Types ----------------------------------------------------------------------------------------------------------
export type UseScriptSharingLinksData = UseQueryResult<JSONResponse<Pick<Script, "script_id">>> & {
    create: UseMutationResult<JSONResponse<SharingLinkID>, JSONResponse, NewScriptSharingLink>
    delete: UseMutationResult<JSONResponse<{}>, JSONResponse, SharingLinkID>
}