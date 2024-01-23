import Dexie, { Table } from "dexie";

import { Event } from "./scramble";
import { Milliseconds } from "./time";

export interface Time {
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
	times!: Table<Time>;

	constructor() {
		super("ChimpTimeDB");
		this.version(1).stores({
			times: "++id, time, date, event, plusTwo, dnf",
		});
	}
}

export const db = new TimeDexie();
