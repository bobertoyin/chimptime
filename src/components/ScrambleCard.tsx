import { ArrowsClockwise, Cube } from "@phosphor-icons/react";
import { Card, Flex, IconButton, Text, Tooltip } from "@radix-ui/themes";
import { Alg } from "cubing/alg";
import { MouseEvent, useCallback } from "react";
import { UseQueryResult, useQueryClient } from "react-query";

import { Event, displayEvent } from "../utils/scramble";
import IconText from "./IconText";

interface ScrambleCardProps {
	scrambleResult: UseQueryResult<Alg>;
	event: Event;
}

export default function ScrambleCard(props: ScrambleCardProps): JSX.Element {
	const { scrambleResult, event } = props;
	const { isLoading, isError, data, error } = scrambleResult;
	const queryClient = useQueryClient();

	const newScrambleHandler = useCallback(
		(_event: MouseEvent<HTMLButtonElement>) => {
			queryClient.invalidateQueries("scramble");
		},
		[queryClient],
	);

	return (
		<Card size="3">
			<Flex direction="column" gap="1">
				<IconText>
					<Cube weight="bold" />
					<Text>{displayEvent(event)}</Text>
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
	);
}
