import { useQuery } from "@tanstack/react-query";
import { API } from "@/constants";
import type { UseScriptsData } from "@/hooks/scripts/useScripts.types";
import useMessageContext from "@/contexts/MessagesCtx/MessagesCtx";

function useScripts(options: object = {}): UseScriptsData {
	const messages = useMessageContext();
	return useQuery({
		...options,
		queryKey: [ "scripts", "ofUser" ],
		queryFn: async () => (await API.ENDPOINTS.V1.SCRIPTS.getAllOfUser.fetch()),
		throwOnError: (error: Error) : boolean => { messages.add({ status: "error", message: error.message }); return true; }
	});
}

export default useScripts;