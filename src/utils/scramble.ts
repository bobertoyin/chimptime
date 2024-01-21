export enum Event {
	threeByThree = "333",
}

export function displayEvent(event: Event): string {
	switch (event) {
		case Event.threeByThree:
			return "3x3";
	}
}
