import Dexie, { Table } from "dexie";

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
}

export const db = new TimeDexie();
