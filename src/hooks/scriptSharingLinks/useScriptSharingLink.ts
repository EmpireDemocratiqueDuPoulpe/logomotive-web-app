import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API } from "@/constants";
import type { UseScriptSharingLinksData } from "@/hooks/scriptSharingLinks/useScriptSharingLinks.types";
import type {JSONResponse, QueryParams} from "@/utils/Endpoint.types";
import type { NewScriptSharingLink, SharingLinkID } from "@/typings/global";
import toast from "react-hot-toast";

function useScriptSharingLink(link_id: string | null, queryParams: QueryParams | undefined = undefined, options: object = {}): UseScriptSharingLinksData {
	const queryClient: QueryClient = useQueryClient();
	const scriptSharingLinkQuery = useQuery({
		...options,
		queryKey: [ "script-sharing-link", "byID", link_id ],
		queryFn: async () => (await API.ENDPOINTS.V1.SCRIPT_SHARING_LINKS.getScriptByLinkID.fetch({ linkID: link_id }, queryParams)),
		enabled: (!!link_id)
	});

	const create = useMutation({
		mutationFn: (script: NewScriptSharingLink) => {
			return API.ENDPOINTS.V1.SCRIPT_SHARING_LINKS.create.fetch(script);
		},
		onSuccess: () : void => { queryClient.invalidateQueries({ queryKey: ["script-sharing-links"] }).catch(toast.error); }
	});

	const del = useMutation({
		mutationFn: (script: SharingLinkID) => {
			return API.ENDPOINTS.V1.SCRIPT_SHARING_LINKS.delete.fetch(script);
		},
		onSuccess: () : void => { queryClient.invalidateQueries({ queryKey: ["script-sharing-links"] }).catch(toast.error); }
	});

	return { ...scriptSharingLinkQuery, create, delete: del };
}

export default useScriptSharingLink;