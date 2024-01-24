import { ArrowClockwise, ArrowsClockwise, Cube } from "@phosphor-icons/react";
import { Card, Code, Flex, IconButton, Text, Tooltip } from "@radix-ui/themes";
import { randomScrambleForEvent } from "cubing/scramble";
import {
	KeyboardEvent,
	MouseEvent,
	RefObject,
	useCallback,
	useEffect,
	useRef,
} from "react";
import { useQuery, useQueryClient } from "react-query";

import { db } from "../utils/db";
import { Event, displayEvent } from "../utils/scramble";
import { displayTime } from "../utils/time";
import IconText from "./IconText";

interface TimerProps {
	time: number;
	setTime: (value: React.SetStateAction<number>) => void;
	runTimer: boolean;
	setRunTimer: (value: React.SetStateAction<boolean>) => void;
	needsReset: boolean;
	setNeedsReset: (value: React.SetStateAction<boolean>) => void;
}

interface TimerResetButtonProps {
	setTime: (value: React.SetStateAction<number>) => void;
	setRunTimer: (value: React.SetStateAction<boolean>) => void;
	setNeedsReset: (value: React.SetStateAction<boolean>) => void;
	timerRef: RefObject<HTMLDivElement>;
}

function TimerResetButton(props: TimerResetButtonProps): JSX.Element {
	const { setNeedsReset, setRunTimer, setTime, timerRef } = props;

	const clickHandler = useCallback(
		(_event: MouseEvent<HTMLButtonElement>) => {
			setNeedsReset(false);
			setRunTimer(false);
			setTime(0);
			if (timerRef.current) {
				timerRef.current.focus();
			}
		},
		[setNeedsReset, setRunTimer, setTime, timerRef],
	);

	return (
		<Tooltip content="Reset Timer">
			<IconButton onClick={clickHandler}>
				<ArrowClockwise weight="bold" />
			</IconButton>
		</Tooltip>
	);
}

export default function Timer(props: TimerProps): JSX.Element {
	const { time, setTime, runTimer, setRunTimer, needsReset, setNeedsReset } =
		props;
	const tick = 10;
	const timerRef = useRef<HTMLDivElement>(null);
	const cubeEvent = Event.threeByThree;
	const queryClient = useQueryClient();
	const { isLoading, isError, data, error } = useQuery(
		"scramble",
		async () => await randomScrambleForEvent(cubeEvent),
		{
			staleTime: Infinity,
		},
	);

	const spacebarHandler = useCallback(
		async (event: KeyboardEvent<HTMLDivElement>) => {
			if (event.key === " " && !event.repeat && !needsReset) {
				setRunTimer((runTimer) => !runTimer);
				if (runTimer) {
					setNeedsReset(true);
					await db.solves.add({
						time,
						date: new Date(),
						plusTwo: false,
						dnf: false,
						event: cubeEvent,
						scramble: data?.toString() ?? "",
					});
					await queryClient.invalidateQueries("scramble");
				}
			}
		},
		[
			needsReset,
			runTimer,
			setNeedsReset,
			setRunTimer,
			time,
			cubeEvent,
			data,
			queryClient,
		],
	);

	const newScrambleHandler = useCallback(
		(_event: MouseEvent<HTMLButtonElement>) => {
			queryClient.invalidateQueries("scramble");
		},
		[queryClient],
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
	}, [setTime, runTimer]);

	return (
		<>
			{!runTimer ? (
				<Flex direction="column" gap="3">
					<Card size="3">
						<Flex direction="column" gap="1">
							<IconText>
								<Cube weight="bold" />
								<Text>{displayEvent(cubeEvent)}</Text>
							</IconText>
							<Text weight="bold">
								{isLoading
									? "Loading scramble..."
									: isError
									  ? `Error: ${(error as Error).message}`
									  : data?.toString()}
							</Text>
							<Tooltip content="New Scramble">
								<IconButton onClick={newScrambleHandler}>
									<ArrowsClockwise weight="bold" />
								</IconButton>
							</Tooltip>
						</Flex>
					</Card>
					<Card
						tabIndex={-1}
						ref={timerRef}
						onKeyDown={data ? spacebarHandler : undefined}
						size="3"
					>
						<Flex direction="column" gap="5" justify="center" align="center">
							<Text size="9">
								<Code>{displayTime(time)}</Code>
							</Text>
							{!runTimer && needsReset ? (
								<TimerResetButton
									setTime={props.setTime}
									setRunTimer={props.setRunTimer}
									setNeedsReset={props.setNeedsReset}
									timerRef={timerRef}
								/>
							) : null}
						</Flex>
					</Card>
				</Flex>
			) : (
				<Flex
					tabIndex={-1}
					ref={timerRef}
					onKeyDown={spacebarHandler}
					justify="center"
					align="center"
					width="100%"
					height="100%"
				>
					<Text size="9">
						<Code>{displayTime(time)}</Code>
					</Text>
				</Flex>
			)}
		</>
	);
}
