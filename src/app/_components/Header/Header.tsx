"use client";

import React from "react";
import Link from "next/link";
import useAuthContext from "@/contexts/AuthCtx/AuthCtx";
import styles from "./Header.module.css";

const TITLE_SEP: string = " - ";

function removeAppName(str: string) : string {
	return str.substring(str.indexOf(TITLE_SEP) + TITLE_SEP.length);
}

function Header() : React.JSX.Element {
	/* --- States -------------------------------- */
	const auth = useAuthContext();

	/* --- Component ----------------------------- */
	return (
		<div className={styles.headerContainer}>
			<header className={styles.header}>
				<div className={styles.logo}/>
				<div className={styles.pageName}>{removeAppName(document.title)}</div>

				<div className={styles.navigation}>
					{/*<div className={styles.navigationButtons}>
						<button className={clsx(styles.navigationButton, Fonts.notoSans.className)}>&lt;</button>
						<button className={clsx(styles.navigationButton, Fonts.notoSans.className)}>&gt;</button>
					</div> TODO*/}

					<Link href="/">Accueil</Link>
					<Link href="/explore">Explorer</Link>
					<Link href="/build">Éditeur de script</Link>
				</div>

				<div className={styles.auth}>
					{auth.status === "connected" ? (
						<>
							<span className={styles.authUsername}>{auth.user?.username}</span>
							<Link href="/auth/logout">D&eacute;connexion</Link>
						</>
					) : (
						<>
							<Link href="/auth/login">Se connecter</Link>
							ou
							<Link href="/auth/register">Cr&eacute;er un compte</Link>
						</>
					)}
				</div>
			</header>
		</div>
	);
}

export default Header;