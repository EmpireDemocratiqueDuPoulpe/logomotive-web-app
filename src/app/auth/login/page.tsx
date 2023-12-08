"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useAuthContext from "@/contexts/AuthCtx/AuthCtx";

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
	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) : void => {
		const target: HTMLInputElement = event.target;
		const name: string = target.name;
		const value: string | boolean = target.type === "checkbox" ? target.checked : target.value;

		setUser(prevState => ({ ...prevState, [name]: value }));
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) : Promise<void> => {
		event.preventDefault();

		const isLogged: boolean = await authCtx.login(user);
		if (isLogged) {
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
			<form onSubmit={handleSubmit}>
				<label>
					E-mail
					<input type="email" name="email" value={user.email} onChange={handleInputChange}/>
				</label>

				<label>
					Mot de passe
					<input type="password" name="password" value={user.password} onChange={handleInputChange}/>
				</label>

				<input className="primaryColor" type="submit" value="Se connecter"/>
				<Link href="/auth/register">Je n&apos;ai pas de compte</Link>
			</form>
		</main>
	);
}

export default Login;