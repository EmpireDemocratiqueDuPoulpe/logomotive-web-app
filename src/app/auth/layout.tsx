"use client";

import React from "react";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import logomotive from "../../assets/logos/Logomotive.png";
import { Link } from "@nextui-org/react";
import styles from "./layout.module.css";

const GO_BACK_EXCLUDED_ROUTES: string[] = [ "/logout" ];

export default function ClientLayout({ children }: { children: React.ReactNode }) : React.JSX.Element {
	/* --- States -------------------------------- */
	const pathname: string = usePathname();

	/* --- Layout -------------------------------- */
	return (
		<div className={styles.authBackground}>
			<div className={clsx(styles.authBox, "bg-default-50")}>
				{GO_BACK_EXCLUDED_ROUTES.some((r: string) : boolean => pathname.includes(r)) ? null : (
					<Link className={styles.backLink} href="/" isBlock>
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