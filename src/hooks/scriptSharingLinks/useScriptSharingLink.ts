import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useMessageContext from "@/contexts/MessagesCtx/MessagesCtx";
import { API } from "@/constants";
import type { UseScriptSharingLinksData } from "@/hooks/scriptSharingLinks/useScriptSharingLinks.types";
import type {JSONResponse, QueryParams} from "@/utils/Endpoint.types";
import type { NewScriptSharingLink, SharingLinkID } from "@/typings/global";

function useScriptSharingLink(link_id: string | null, queryParams: QueryParams | undefined = undefined, options: object = {}): UseScriptSharingLinksData {
	const queryClient: QueryClient = useQueryClient();
	const messages = useMessageContext();
	const scriptSharingLinkQuery = useQuery({
		...options,
		queryKey: [ "script-sharing-link", "byID", link_id ],
		queryFn: async () => (await API.ENDPOINTS.V1.SCRIPT_SHARING_LINKS.getScriptID.fetch({ linkID: link_id }, queryParams)),
		enabled: (!!link_id),
		throwOnError: (error: Error) : boolean => { messages.add({ status: "error", message: error.message }); return true; }
	});

	const create = useMutation({
		mutationFn: (script: NewScriptSharingLink) => {
			return API.ENDPOINTS.V1.SCRIPT_SHARING_LINKS.create.fetch(script);
		},
		onSuccess: () : void => { queryClient.invalidateQueries({ queryKey: ["script-sharing-links"] }).catch(console.error); },
		onError: (error: JSONResponse) : void => { messages.add({ status: "error", message: error.error ?? "Erreur inconnue" }); }
	});

	const del = useMutation({
		mutationFn: (script: SharingLinkID) => {
			return API.ENDPOINTS.V1.SCRIPT_SHARING_LINKS.delete.fetch(script);
		},
		onSuccess: () : void => { queryClient.invalidateQueries({ queryKey: ["script-sharing-links"] }).catch(console.error); },
		onError: (error: JSONResponse) : void => { messages.add({ status: "error", message: error.error ?? "Erreur inconnue" }); }
	});

	return { ...scriptSharingLinkQuery, create, delete: del };
}

export default useScriptSharingLink;