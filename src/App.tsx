import { Button } from "@radix-ui/themes";
import {
	KeyboardEvent,
	MouseEvent,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";

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

	return <Button onClick={clickHandler}>Reset</Button>;
}

function Timer(props: TimerProps): JSX.Element {
	const { setTime, runTimer, setRunTimer, needsReset, setNeedsReset } = props;
	const tick = 10;
	const timerRef = useRef<HTMLDivElement>(null);

	const spacebarHandler = useCallback(
		(event: KeyboardEvent<HTMLDivElement>) => {
			if (event.key === " " && !event.repeat && !needsReset) {
				if (runTimer) {
					setNeedsReset(true);
				}
				setRunTimer((runTimer) => !runTimer);
			}
		},
		[needsReset, runTimer, setNeedsReset, setRunTimer],
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
		<div tabIndex={-1} ref={timerRef} onKeyDown={spacebarHandler}>
			<b>{(props.time / 1000).toFixed(props.runTimer ? 1 : 2)}</b>
			<br />
			<TimerResetButton
				setTime={props.setTime}
				setRunTimer={props.setRunTimer}
				setNeedsReset={props.setNeedsReset}
			/>
		</div>
	);
}

export default function App(): JSX.Element {
	const [runTimer, setRunTimer] = useState(false);
	const [needsReset, setNeedsReset] = useState(false);
	const [time, setTime] = useState(0);

	return (
		<>
			<h1>chimptime</h1>
			<Timer
				time={time}
				setTime={setTime}
				runTimer={runTimer}
				setRunTimer={setRunTimer}
				needsReset={needsReset}
				setNeedsReset={setNeedsReset}
			/>
		</>
	);
}
