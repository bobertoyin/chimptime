import { ArrowClockwise } from "@phosphor-icons/react";
import { Code, Flex, IconButton, Tooltip } from "@radix-ui/themes";
import {
	KeyboardEvent,
	MouseEvent,
	useCallback,
	useEffect,
	useRef,
} from "react";

import { db } from "../utils/db";
import { displayTime } from "../utils/time";

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
}

function TimerResetButton(props: TimerResetButtonProps): JSX.Element {
	const { setNeedsReset, setRunTimer, setTime } = props;

	const clickHandler = useCallback(
		(_event: MouseEvent<HTMLButtonElement>) => {
			setNeedsReset(false);
			setRunTimer(false);
			setTime(0);
		},
		[setNeedsReset, setRunTimer, setTime],
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

	const spacebarHandler = useCallback(
		async (event: KeyboardEvent<HTMLDivElement>) => {
			if (event.key === " " && !event.repeat && !needsReset) {
				if (runTimer) {
					setNeedsReset(true);
					db.times.add({ time, date: new Date(), plusTwo: false, dnf: false });
				}
				setRunTimer((runTimer) => !runTimer);
			}
		},
		[needsReset, runTimer, setNeedsReset, setRunTimer, time],
	);

	useEffect(() => {
		let timerInterval: number | undefined;

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
		<Flex
			direction="column"
			gap="2"
			tabIndex={-1}
			ref={timerRef}
			onKeyDown={spacebarHandler}
		>
			<Code>{displayTime(time)}</Code>
			<br />
			{!runTimer ? (
				<TimerResetButton
					setTime={props.setTime}
					setRunTimer={props.setRunTimer}
					setNeedsReset={props.setNeedsReset}
				/>
			) : null}
		</Flex>
	);
}
