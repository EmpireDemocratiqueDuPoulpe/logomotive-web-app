import React, { useRef } from "react";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import type { Props } from "@/components/Modal/Modal.types";
import styles from "./Modal.module.css";

function Modal({ title, isVisible, setVisible, children }: Props) : React.JSX.Element {
	/* --- States -------------------------------- */
	const backgroundRef = useRef<HTMLDivElement>(null);

	/* --- Functions ----------------------------- */
	const toggleModal = (event: React.MouseEvent) : void => {
		if (event.target === backgroundRef.current) {
			setVisible(!isVisible);
		}
	};

	/* --- Component ----------------------------- */
	return (
		<div ref={backgroundRef} className={clsx(styles.modalBackground, (isVisible ? styles.visible : styles.hidden))} onClick={toggleModal}>
			<div className={styles.modal}>
				<div className={styles.header}>
					<h2>{title ?? "Fenêtre"}</h2>

					<button onClick={toggleModal}>
						<FontAwesomeIcon icon={faXmark}/>
					</button>
				</div>

				{children}
			</div>
		</div>
	);
}

export default Modal;