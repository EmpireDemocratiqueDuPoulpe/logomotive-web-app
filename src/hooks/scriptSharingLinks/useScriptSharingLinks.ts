import { useQuery } from "@tanstack/react-query";
import { API } from "@/constants";
import type { UseScriptSharingLinksData } from "@/hooks/scriptSharingLinks/useScriptSharingLinks.types";
import type {QueryParams} from "@/utils/Endpoint.types";

function useScriptSharingLinks(script_id: number | null, queryParams: QueryParams | undefined = undefined, options: object = {}): UseScriptSharingLinksData {
	const scriptSharingLinksQuery = useQuery({
		...options,
		queryKey: [ "script-sharing-links", "of", script_id ],
		queryFn: async () => (await API.ENDPOINTS.V1.SCRIPT_SHARING_LINKS.getLinksOf.fetch({ scriptID: `${script_id}` }, queryParams)),
		enabled: (!!script_id)
	});

	return { ...scriptSharingLinksQuery };
}

export default useScriptSharingLinks;