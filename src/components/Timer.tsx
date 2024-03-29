import { ArrowClockwise } from "@phosphor-icons/react";
import { Code, Flex, IconButton, Text, Tooltip } from "@radix-ui/themes";
import { MouseEvent, RefObject, TouchEventHandler, useCallback } from "react";

import { Event } from "../utils/scramble";
import { displayTime } from "../utils/time";

interface TimerProps {
	time: number;
	event: Event;
	runTimer: boolean;
	needsReset: boolean;
	timerRef: RefObject<HTMLDivElement>;
	setTime: (value: React.SetStateAction<number>) => void;
	setRunTimer: (value: React.SetStateAction<boolean>) => void;
	setNeedsReset: (value: React.SetStateAction<boolean>) => void;
	touchHandler?: TouchEventHandler<HTMLDivElement>;
}

interface TimerResetButtonProps {
	timerRef: RefObject<HTMLDivElement>;
	setTime: (value: React.SetStateAction<number>) => void;
	setRunTimer: (value: React.SetStateAction<boolean>) => void;
	setNeedsReset: (value: React.SetStateAction<boolean>) => void;
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
	const {
		time,
		runTimer,
		needsReset,
		timerRef,
		setTime,
		setRunTimer,
		setNeedsReset,
		touchHandler,
	} = props;

	return !runTimer ? (
		<Flex
			direction="column"
			gap="5"
			justify="center"
			align="center"
			my="9"
			onTouchStart={touchHandler}
		>
			<Text size="9">
				<Code>{displayTime(time)}</Code>
			</Text>
			{!runTimer && needsReset ? (
				<TimerResetButton
					timerRef={timerRef}
					setTime={setTime}
					setRunTimer={setRunTimer}
					setNeedsReset={setNeedsReset}
				/>
			) : null}
		</Flex>
	) : (
		<Flex
			justify="center"
			align="center"
			width="100%"
			height="100%"
			onTouchStart={touchHandler}
		>
			<Text size="9">
				<Code>{displayTime(time)}</Code>
			</Text>
		</Flex>
	);
}
