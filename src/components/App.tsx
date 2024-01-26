import { Container, Flex, Grid } from "@radix-ui/themes";
import { randomScrambleForEvent } from "cubing/scramble";
import { KeyboardEvent, useCallback, useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "react-query";

import { db } from "../utils/db";
import { Event } from "../utils/scramble";
import Footer from "./Footer";
import NavBar from "./Navbar";
import ScrambleCard from "./ScrambleCard";
import SolveTable from "./SolveTable";
import Timer from "./Timer";

export default function App(): JSX.Element {
	const [runTimer, setRunTimer] = useState(false);
	const [needsReset, setNeedsReset] = useState(false);
	const [time, setTime] = useState(0);
	const timerRef = useRef<HTMLDivElement>(null);
	const tick = 10;

	const cubeEvent = Event.threeByThree;
	const queryClient = useQueryClient();
	const scrambleResult = useQuery(
		"scramble",
		async () => await randomScrambleForEvent(cubeEvent),
		{
			staleTime: Infinity,
		},
	);

	const spacebarHandler = useCallback(
		async (event: KeyboardEvent<HTMLDivElement>) => {
			if (
				(event.key === " " || runTimer) &&
				timerRef.current === document.activeElement &&
				!event.repeat &&
				!needsReset
			) {
				setRunTimer((runTimer) => !runTimer);
				if (runTimer) {
					setNeedsReset(true);
					await db.solves.add({
						time,
						date: new Date(),
						plusTwo: false,
						dnf: false,
						event: cubeEvent,
						scramble: scrambleResult.data?.toString() ?? "",
					});
					await queryClient.invalidateQueries("scramble");
				}
			}
		},
		[
			needsReset,
			runTimer,
			time,
			cubeEvent,
			scrambleResult.data,
			queryClient,
			timerRef,
		],
	);

	useEffect(() => {
		let timerInterval: NodeJS.Timeout | undefined;

		if (timerRef.current) {
			timerRef.current.focus();
		}

		if (runTimer) {
			timerInterval = setInterval(() => setTime((time) => time + tick), tick);
		} else {
			clearInterval(timerInterval);
		}

		return () => clearInterval(timerInterval);
	}, [runTimer]);

	return (
		<div
			style={{ height: "100vh" }}
			ref={timerRef}
			onKeyDown={scrambleResult.data ? spacebarHandler : undefined}
			tabIndex={-1}
		>
			{!runTimer ? (
				<Container px="3" size="4" height="100%">
					<Flex align="center" style={{ height: "100px" }}>
						<NavBar />
					</Flex>
					<Grid
						columns="1"
						gap="3"
						align="center"
						style={{ minHeight: "150px", height: "calc(100vh - 200px)" }}
					>
						<Flex direction="column" gap="3">
							<ScrambleCard scrambleResult={scrambleResult} event={cubeEvent} />
							<Timer
								time={time}
								event={cubeEvent}
								setTime={setTime}
								runTimer={runTimer}
								timerRef={timerRef}
								setRunTimer={setRunTimer}
								needsReset={needsReset}
								setNeedsReset={setNeedsReset}
							/>
						</Flex>
						{!runTimer ? <SolveTable /> : null}
					</Grid>
					<Flex align="end" pb="5" style={{ height: "100px" }}>
						<Footer />
					</Flex>
				</Container>
			) : (
				<Timer
					time={time}
					event={cubeEvent}
					setTime={setTime}
					runTimer={runTimer}
					timerRef={timerRef}
					setRunTimer={setRunTimer}
					needsReset={needsReset}
					setNeedsReset={setNeedsReset}
				/>
			)}
		</div>
	);
}
