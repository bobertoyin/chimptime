import Dexie, { Table } from "dexie";

import { Milliseconds } from "./time";

export interface Time {
	id?: number;
	time: Milliseconds;
	date: Date;
	plusTwo: boolean;
	dnf: boolean;
}

export class TimeDexie extends Dexie {
	times!: Table<Time>;

	constructor() {
		super("ChimpTimeDB");
		this.version(1).stores({
			times: "++id, time, date, plusTwo, dnf",
		});
	}
}

export const db = new TimeDexie();
