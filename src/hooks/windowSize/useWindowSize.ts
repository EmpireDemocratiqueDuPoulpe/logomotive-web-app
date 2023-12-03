import { useState, useEffect } from "react";
import type { WindowSize, UseWindowSizeData } from "@/hooks/windowSize/useWindowSize.types";

function getWindowSize() : WindowSize {
	const { innerWidth: width, innerHeight: height } = window;
	return { width, height };
}

function useWindowSize() : UseWindowSizeData {
	const [windowSize, setWindowSize] = useState(getWindowSize());

	useEffect(() : (() => void) => {
		function handleResize() : void {
			setWindowSize(getWindowSize());
		}

		window.addEventListener("resize", handleResize);
		return () : void => { window.removeEventListener("resize", handleResize); };
	}, []);

	return windowSize;
}

export default useWindowSize;