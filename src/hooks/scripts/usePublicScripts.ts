import { useQuery } from "@tanstack/react-query";
import { API } from "@/constants";
import type { UsePublicScriptsData } from "@/hooks/scripts/usePublicScripts.types";
import useMessageContext from "@/contexts/MessagesCtx/MessagesCtx";

function usePublicScripts(options: object = {}): UsePublicScriptsData {
	const messages = useMessageContext();
	return useQuery({
		...options,
		queryKey: [ "scripts", "allPublic" ],
		queryFn: async () => (await API.ENDPOINTS.V1.SCRIPTS.getAllPublic.fetch()),
		throwOnError: (error: Error) : boolean => { messages.add({ status: "error", message: error.message }); return true; }
	});
}

export default usePublicScripts;