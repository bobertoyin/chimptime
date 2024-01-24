import Dexie, { Table } from "dexie";

import { Event } from "./scramble";
import { Milliseconds } from "./time";

export interface Solve {
	id?: number;
	time: Milliseconds;
	date: Date;
	event: Event;
	scramble: string;
	plusTwo: boolean;
	dnf: boolean;
	notes?: string;
}

export class TimeDexie extends Dexie {
	solves!: Table<Solve>;

	constructor() {
		super("ChimpTimeDB");
		this.version(1).stores({
			solves: "++id, time, date, event, plusTwo, dnf",
		});
	}
}

export const db = new TimeDexie();
