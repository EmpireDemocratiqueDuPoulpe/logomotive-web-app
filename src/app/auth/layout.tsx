"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import logomotive from "../../assets/logos/Logomotive.png";
import styles from "./layout.module.css";

const GO_BACK_EXCLUDED_ROUTES: string[] = [ "/logout" ];

export default function ClientLayout({ children }: { children: React.ReactNode }) : React.JSX.Element {
	/* --- States -------------------------------- */
	const pathname: string = usePathname();

	/* --- Layout -------------------------------- */
	return (
		<div className={styles.authBackground}>
			<div className={styles.authBox}>
				{GO_BACK_EXCLUDED_ROUTES.some((r: string) : boolean => pathname.includes(r)) ? null : (
					<Link className={styles.backLink} href="/">
						<FontAwesomeIcon icon={faArrowLeft}/>
						Retour
					</Link>
				)}

				<Image className={styles.appLogo} src={logomotive} alt="Logo(motive)"/>

				{children}
			</div>
		</div>
	);
}