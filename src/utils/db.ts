import Dexie, { Table } from "dexie";
import Papa from "papaparse";

import { Event } from "./scramble";
import { Milliseconds } from "./time";

export interface Solve {
	id?: number;
	time: Milliseconds;
	date: Milliseconds;
	event: Event;
	scramble: string;
	plusTwo: boolean;
	dnf: boolean;
	notes?: string;
}

// biome-ignore lint/suspicious/noExplicitAny: custom type guard
function instanceOfSolve(object: any): object is Solve {
	if (
		"time" in object &&
		"date" in object &&
		"event" in object &&
		"scramble" in object &&
		"plusTwo" in object &&
		"dnf" in object
	) {
		object.time = Number(object.time);
		object.date = Number(object.date);
		object.plusTwo = object.plusTwo === "true";
		object.dnf = object.dnf === "true";
		return true;
	}
	return false;
}

export class TimeDexie extends Dexie {
	solves!: Table<Solve>;

	public constructor() {
		super("ChimpTimeDB");
		this.version(1).stores({
			solves: "++id, time, date, event, plusTwo, dnf",
		});
	}

	public async downloadCSV(): Promise<void> {
		let content =
			"data:text/csv;charset=utf-8,time,date,event,scramble,plusTwo,dnf,notes\n";
		await this.solves.each((solve) => {
			content += `${solve.time},${solve.date},${solve.event},${
				solve.scramble
			},${solve.plusTwo},${solve.dnf},${solve.notes ?? ""}\n`;
		});
		const encodedURI = encodeURI(content);
		window.location.href = encodedURI;
	}

	public async uploadCSV(file: File): Promise<void> {
		Papa.parse(file, {
			header: true,
			complete: async (results) => {
				const valid_rows: Solve[] = [];
				for (const row of results.data) {
					if (instanceOfSolve(row)) {
						console.log(row);
						valid_rows.push(row);
					}
				}
				await db.solves.bulkAdd(valid_rows);
			},
		});
	}
}

export const db = new TimeDexie();
