import { Solve } from "./db";

export type Milliseconds = number;

export function displaySolve(solve: Solve, detailed = false): string {
	if (solve.dnf) {
		return detailed ? `DNF(${displayTime(solve.time)})` : "DNF";
	}
	return `${solve.plusTwo ? "+" : ""}${displayTime(
		solve.time + (solve.plusTwo ? 2000 : 0),
	)}`;
}

export function displayTime(time: Milliseconds): string {
	let display = "";
	const timeSeconds = time / 1000;
	const hours = Math.floor(timeSeconds / 3600);
	const minutes = Math.floor((timeSeconds % 3600) / 60);
	const seconds = (timeSeconds % 60).toFixed(2);
	if (hours > 0) {
		display += `${hours}:`;
	}
	if (minutes > 0 || hours > 0) {
		display += `${hours > 0 ? String(minutes).padStart(2, "0") : minutes}:`;
	}
	display += `${hours > 0 || minutes > 0 ? seconds.padStart(5, "0") : seconds}`;
	return display;
}
