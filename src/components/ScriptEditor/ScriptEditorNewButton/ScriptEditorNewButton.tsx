import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/react";

function ScriptEditorNewButton() : React.JSX.Element {
	/* --- States -------------------------------- */
	const router = useRouter();

	/* --- Component ----------------------------- */
	return (
		<Button className="ml-1" isIconOnly size="sm" onClick={() => router.push("/build")}>
			<FontAwesomeIcon icon={faAdd}/>
		</Button>
	);
}

export default ScriptEditorNewButton;