import { Box, Container, Flex } from "@radix-ui/themes";
import { useState } from "react";

import Footer from "./Footer";
import NavBar from "./Navbar";
import Timer from "./Timer";

export default function App(): JSX.Element {
	const [runTimer, setRunTimer] = useState(false);
	const [needsReset, setNeedsReset] = useState(false);
	const [times, setTimes] = useState<number[]>([]);
	const [time, setTime] = useState(0);

	return (
		<div style={{ height: "100vh" }}>
			<Container px="3" size="3" height="100%">
				<Flex align="center" style={{ height: "100px" }}>
					<NavBar />
				</Flex>
				<Flex
					align="center"
					style={{ minHeight: "150px", height: "calc(100vh - 200px)" }}
				>
					<Box width="100%">
						<Timer
							time={time}
							setTime={setTime}
							runTimer={runTimer}
							setRunTimer={setRunTimer}
							needsReset={needsReset}
							setNeedsReset={setNeedsReset}
							setTimes={setTimes}
						/>
						{String(times)}
					</Box>
				</Flex>
				<Flex align="end" pb="5" style={{ height: "100px" }}>
					<Footer />
				</Flex>
			</Container>
		</div>
	);
}
