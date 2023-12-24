"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthContext from "@/contexts/AuthCtx/AuthCtx";
import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { Link } from "@nextui-org/react";

function Register() : React.JSX.Element {
	/* --- States -------------------------------- */
	const [ user, setUser ] = useState({
		username: "",
		email: "",
		password1: "",
		password2: ""
	});
	const authCtx = useAuthContext();
	const router = useRouter();

	/* --- Functions ----------------------------- */
	const handleInputChange = (property: string, value: string) : void => {
		setUser(prevState => ({ ...prevState, [property]: value }));
	};

	const handleSubmit = async () : Promise<void> => {
		if (await authCtx.register(user)) {
			router.push("/auth/login");
		}
	};

	/* --- Effects ------------------------------- */
	useEffect(() : void => {
		if (authCtx.isConnected) {
			router.push("/");
		}
	}, [authCtx.isConnected, router]);

	/* --- Component ----------------------------- */
	return (
		<main>
			<Input
				type="text"
				label="Nom d'utilisateur"
				value={user.username}
				onValueChange={(value: string) => handleInputChange("username", value)}
				isRequired
			/>

			<Input
				type="email"
				label="Email"
				value={user.email}
				onValueChange={(value: string) => handleInputChange("email", value)}
				isRequired
			/>

			<Input
				type="password"
				label="Mot de passe"
				description="Min. 8 caractères, minuscule, majuscule, chiffre, caractère spécial"
				value={user.password1}
				onValueChange={(value: string) => handleInputChange("password1", value)}
				isRequired
			/>

			<Input
				type="password"
				label="Confirmez le mot de passe"
				value={user.password2}
				onValueChange={(value: string) => handleInputChange("password2", value)}
				isRequired
			/>

			<Button color="primary" onClick={handleSubmit}>Cr&eacute;er un compte</Button>
			<Link href="/auth/login">J&apos;ai d&eacute;j&agrave; un compte</Link>
		</main>
	);
}

export default Register;