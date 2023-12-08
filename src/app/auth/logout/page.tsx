"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthContext from "@/contexts/AuthCtx/AuthCtx";
import styles from "./page.module.css";

function Logout() : React.JSX.Element {
	/* --- States -------------------------------- */
	const authCtx = useAuthContext();
	const router = useRouter();

	/* --- Effects ------------------------------- */
	useEffect(() : void => {
		if (!authCtx.isConnected) {
			router.push("/auth/login");
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
			<div className={styles.logoutMessage}>
				Déconnexion en cours...
			</div>
		</main>
	);
}

export default Logout;