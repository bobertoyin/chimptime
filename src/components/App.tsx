import { Container, Grid } from "@radix-ui/themes";
import { useState } from "react";

import Footer from "./Footer";
import NavBar from "./Navbar";
import Timer from "./Timer";

export default function App(): JSX.Element {
	const [runTimer, setRunTimer] = useState(false);
	const [needsReset, setNeedsReset] = useState(false);
	const [time, setTime] = useState(0);

	return (
		<Container style={{ outline: "1px solid red" }}>
			<Grid gap="9">
				<NavBar />
				<Timer
					time={time}
					setTime={setTime}
					runTimer={runTimer}
					setRunTimer={setRunTimer}
					needsReset={needsReset}
					setNeedsReset={setNeedsReset}
				/>
				<Footer />
			</Grid>
		</Container>
	);
}
