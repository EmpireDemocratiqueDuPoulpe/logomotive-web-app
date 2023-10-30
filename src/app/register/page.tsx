"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useAuthContext from "@/contexts/AuthCtx/AuthCtx";

function Register() : React.JSX.Element {
	/* --- States -------------------------------- */
	const [ user, setUser ] = useState({
		username: "mlamine",
		email: "mo.lamine@sup.info",
		password1: "MotDePasse123!",
		password2: "MotDePasse123!"
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

		const isRegistered: boolean = await authCtx.register(user);
		if (isRegistered) {
			router.push("/login");
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
					Nom d&apos;utilisateur
					<input type="text" name="username" value={user.username} onChange={handleInputChange} autoComplete="username"/>
				</label>

				<label>
					E-mail
					<input type="email" name="email" value={user.email} onChange={handleInputChange} autoComplete="email"/>
				</label>

				<label>
					Mot de passe
					<input type="password" name="password1" value={user.password1} onChange={handleInputChange} autoComplete="new-password"/>
				</label>

				<label>
					Mot de passe (confirmation)
					<input type="password" name="password2" value={user.password2} onChange={handleInputChange} autoComplete="new-password"/>
				</label>

				<Link href="/login">J&apos;ai d&eacute;j&agrave; un compte</Link>
				<input type="submit" value="Créer un compte"/>
			</form>
		</main>
	);
}

export default Register;