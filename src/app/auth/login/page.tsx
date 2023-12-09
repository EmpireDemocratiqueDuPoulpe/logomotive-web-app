"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthContext from "@/contexts/AuthCtx/AuthCtx";
import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { Link } from "@nextui-org/react";

function Login() : React.JSX.Element {
	/* --- States -------------------------------- */
	// TODO: FOR TESTING PURPOSE ONLY, REMOVE BEFORE PROD
	const [ user, setUser ] = useState({
		email: "johmnny.mcnumgget@cheems.mail",
		password: "MotDePasse123!"
	});
	const authCtx = useAuthContext();
	const router = useRouter();

	/* --- Functions ----------------------------- */
	const handleInputChange = (property: string, value: string) : void => {
		setUser(prevState => ({ ...prevState, [property]: value }));
	};

	const handleSubmit = async () : Promise<void> => {
		if (await authCtx.login(user)) {
			router.push("/");
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
				type="email"
				label="Email"
				value={user.email}
				onValueChange={(value: string) => handleInputChange("email", value)}
				isRequired
			/>

			<Input
				type="password"
				label="Mot de passe"
				value={user.password}
				onValueChange={(value: string) => handleInputChange("password", value)}
				isRequired
			/>

			<Button color="primary" onClick={handleSubmit}>Se connecter</Button>
			<Link href="/auth/register">Je n&apos;ai pas de compte</Link>
		</main>
	);
}

export default Login;