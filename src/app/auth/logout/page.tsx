"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthContext from "@/contexts/AuthCtx/AuthCtx";

function Logout() : React.JSX.Element {
	/* --- States -------------------------------- */
	const authCtx = useAuthContext();
	const router = useRouter();

	/* --- Effects ------------------------------- */
	useEffect(() : void => {
		if (!authCtx.isConnected) {
			router.push("/");
		}
	}, [authCtx.isConnected, router]);

	useEffect(() : void => {
		if (authCtx.isConnected) {
			authCtx.logout().catch();
		}
		// We only want this effect to run once
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	/* --- Component ----------------------------- */
	return (
		<main>
			Déconnexion en cours...
		</main>
	);
}

export default Logout;