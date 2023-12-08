"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import useAuthContext from "@/contexts/AuthCtx/AuthCtx";
import logomotive from "../../../assets/logos/Logomotive.png";
import styles from "./Header.module.css";

const EXCLUDED_ROUTES: string[] = [ "/auth" ];
const TITLE_SEP: string = " - ";

function removeAppName(str: string) : string {
	const separatorIdx: number = str.indexOf(TITLE_SEP);

	if (separatorIdx === -1) return str;
	else return str.substring(separatorIdx + TITLE_SEP.length);
}

function Header() : React.JSX.Element | null {
	/* --- States -------------------------------- */
	const auth = useAuthContext();
	const pathname: string = usePathname();

	/* --- Component ----------------------------- */
	return EXCLUDED_ROUTES.some((r: string) => pathname.includes(r)) ? null : (
		<div className={styles.headerContainer}>
			<header className={styles.header}>
				<div className={styles.logo}>
					<Image src={logomotive} alt="Logo(motive)"/>
				</div>
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