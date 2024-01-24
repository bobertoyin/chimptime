import { Container, Flex, Grid } from "@radix-ui/themes";
import { useState } from "react";

import Footer from "./Footer";
import NavBar from "./Navbar";
import SolveTable from "./SolveTable";
import Timer from "./Timer";

export default function App(): JSX.Element {
	const [runTimer, setRunTimer] = useState(false);
	const [needsReset, setNeedsReset] = useState(false);
	const [time, setTime] = useState(0);

	return (
		<div style={{ height: "100vh" }}>
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
						<Timer
							time={time}
							setTime={setTime}
							runTimer={runTimer}
							setRunTimer={setRunTimer}
							needsReset={needsReset}
							setNeedsReset={setNeedsReset}
						/>
						{!runTimer ? <SolveTable /> : null}
					</Grid>
					<Flex align="end" pb="5" style={{ height: "100px" }}>
						<Footer />
					</Flex>
				</Container>
			) : (
				<Timer
					time={time}
					setTime={setTime}
					runTimer={runTimer}
					setRunTimer={setRunTimer}
					needsReset={needsReset}
					setNeedsReset={setNeedsReset}
				/>
			)}
		</div>
	);
}
