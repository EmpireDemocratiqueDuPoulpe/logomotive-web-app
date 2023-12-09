"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useTheme } from "next-themes";
import useAuthContext from "@/contexts/AuthCtx/AuthCtx";
import logomotive from "../../../assets/logos/Logomotive.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faPlus, faArrowRightToBracket, faList } from "@fortawesome/free-solid-svg-icons";
import {
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
	Button,
	User,
	Dropdown,
	DropdownTrigger,
	DropdownMenu,
	DropdownItem,
	Link
} from "@nextui-org/react";

const EXCLUDED_ROUTES: string[] = [ "/auth" ];
const TITLE_SEP: string = " - ";

function removeAppName(str: string) : string {
	const separatorIdx: number = str.indexOf(TITLE_SEP);

	if (separatorIdx === -1) return str;
	else return str.substring(separatorIdx + TITLE_SEP.length);
}

function Header() : React.JSX.Element | null {
	/* --- States -------------------------------- */
	const [isMounted, setIsMounted] = useState(false);
	const auth = useAuthContext();
	const pathname: string = usePathname();
	const router = useRouter();
	const { theme, setTheme } = useTheme();

	/* --- Functions ----------------------------- */
	const toggleTheme = () : void => {
		setTheme((theme === "light") ? "dark" : "light");
	};

	/* --- Effects ------------------------------- */
	useEffect(() : void => {
		setIsMounted(true);
	}, []);

	/* --- Component ----------------------------- */
	return (!isMounted || EXCLUDED_ROUTES.some((r: string) => pathname.includes(r))) ? null : (
		<Navbar
			className="my-4"
			classNames={{
				item: [
					"flex",
					"relative",
					"h-full",
					"items-center",
					"data-[active=true]:after:content-['']",
					"data-[active=true]:after:absolute",
					"data-[active=true]:after:bottom-0",
					"data-[active=true]:after:left-0",
					"data-[active=true]:after:right-0",
					"data-[active=true]:after:h-[2px]",
					"data-[active=true]:after:rounded-[2px]",
					"data-[active=true]:after:bg-primary",
				],
			}}
			maxWidth="full"
			position="sticky"
		>
			<NavbarBrand>
				<Image className="h-16 w-16" src={logomotive} alt="Logo(motive)" priority={true}/>
				&nbsp;
				{removeAppName(document.title)}
			</NavbarBrand>

			<NavbarContent className="hidden sm:flex gap-4" justify="center">
				<NavbarItem isActive={pathname === "/"}>
					<Link color="foreground" href="/">
						Accueil
					</Link>
				</NavbarItem>

				<NavbarItem isActive={pathname === "/explore"}>
					<Link color="foreground" href="/explore">
						Explorer
					</Link>
				</NavbarItem>

				<NavbarItem isActive={pathname === "/build"}>
					<Link color="foreground" href="/build">
						&Eacute;diteur de script
					</Link>
				</NavbarItem>

				<Dropdown>
					<NavbarItem>
						<DropdownTrigger>
							<Button
								disableRipple
								className="p-0 bg-transparent data-[hover=true]:bg-transparent"
								endContent={<FontAwesomeIcon icon={faChevronDown}/>}
								radius="sm"
								variant="light"
							>
								Classes
							</Button>
						</DropdownTrigger>
					</NavbarItem>

					<DropdownMenu
						aria-label="Fonctionnalités de classes"
						className="w-[340px]"
						itemClasses={{
							base: "gap-4",
						}}
						disabledKeys={[ "create_class", "join_class", "list_classes" ]}
					>
						<DropdownItem
							key="create_class"
							description="Créez une classe et invitez-y des élèves."
							startContent={<FontAwesomeIcon icon={faPlus}/>}
						>
							Cr&eacute;er une classe
						</DropdownItem>

						<DropdownItem
							key="join_class"
							description="Rejoignez une classe et fermez Fortnite."
							startContent={<FontAwesomeIcon icon={faArrowRightToBracket}/>}
						>
							Rejoindre une classe
						</DropdownItem>

						<DropdownItem
							key="list_classes"
							description="Voyez les classes ouvertes (même si nous savons que vous n'en n'avez pas envie)."
							startContent={<FontAwesomeIcon icon={faList}/>}
						>
							Voir les classes ouvertes
						</DropdownItem>
					</DropdownMenu>
				</Dropdown>
			</NavbarContent>

			<NavbarContent justify="end">
				{auth.status === "connected" ? (
					<NavbarItem>
						<Dropdown placement="bottom-end">
							<DropdownTrigger>
								<User name={auth.user!.username} description="Utilisateur" as="button"/>
							</DropdownTrigger>

							<DropdownMenu aria-label="Actions utilisateur" variant="flat" disabledKeys={[ "settings" ]}>
								<DropdownItem key="settings">Paramètres</DropdownItem>
								<DropdownItem key="theme" onClick={toggleTheme}>
									Passer au th&egrave;me {(theme === "light" ? "sombre" : "clair")}
								</DropdownItem>
								<DropdownItem key="logout" color="danger" onClick={() => router.push("/auth/logout")}>
									Se d&eacute;connecter
								</DropdownItem>
							</DropdownMenu>
						</Dropdown>
					</NavbarItem>
				) : (
					<>
						<NavbarItem className="hidden lg:flex">
							<Link href="/auth/login">Se connecter</Link>
						</NavbarItem>

						<NavbarItem>
							<Button as={Link} color="primary" href="/auth/register" variant="flat">
								Cr&eacute;er un compte
							</Button>
						</NavbarItem>
					</>
				)}
			</NavbarContent>
		</Navbar>
	);
}

export default Header;