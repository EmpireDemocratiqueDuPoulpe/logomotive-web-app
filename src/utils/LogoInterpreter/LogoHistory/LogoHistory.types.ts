/// --- Types ----------------------------------------------------------------------------------------------------------
export type CommandHistory = {
	command: string
	output: string
};

export type HistoryListener = (history: CommandHistory[], length: number) => void