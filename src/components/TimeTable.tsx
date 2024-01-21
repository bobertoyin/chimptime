import {
	Calendar,
	HashStraight,
	Pencil,
	Plus,
	Prohibit,
	Timer,
	Trash,
	X,
} from "@phosphor-icons/react";
import {
	Code,
	Flex,
	IconButton,
	ScrollArea,
	Table,
	Tooltip,
} from "@radix-ui/themes";
import { useLiveQuery } from "dexie-react-hooks";

import { Time, db } from "../utils/db";
import { displayTimeObj } from "../utils/time";

interface TimeTableRowProps {
	time: Time;
	index: number;
}

function TimeTableRow(props: TimeTableRowProps): JSX.Element {
	const { time, index } = props;
	return (
		<Table.Row key={time.id} align="center">
			<Table.RowHeaderCell justify="center">{index}</Table.RowHeaderCell>
			<Table.Cell justify="center">
				<Code>{displayTimeObj(time)}</Code>
			</Table.Cell>
			<Table.Cell justify="center">{time.date.toLocaleString()}</Table.Cell>
			<Table.Cell justify="center">
				<Flex gap="2" justify="center" align="center">
					<Tooltip content="+2">
						<IconButton
							onClick={() =>
								db.times.update(time.id ?? 0, { plusTwo: !time.plusTwo })
							}
						>
							<Plus weight="bold" />
						</IconButton>
					</Tooltip>
					<Tooltip content="DNF">
						<IconButton
							onClick={() => db.times.update(time.id ?? 0, { dnf: !time.dnf })}
						>
							<Prohibit weight="bold" />
						</IconButton>
					</Tooltip>
				</Flex>
			</Table.Cell>
			<Table.Cell justify="center">
				<Tooltip content="Delete">
					<IconButton onClick={() => db.times.delete(time.id ?? 0)}>
						<X weight="bold" />
					</IconButton>
				</Tooltip>
			</Table.Cell>
		</Table.Row>
	);
}

export default function TimeTable(): JSX.Element {
	const times = useLiveQuery(() =>
		db.times.toArray().then((array) => array.reverse()),
	);

	return (
		<ScrollArea>
			<Table.Root variant="surface">
				<Table.Header>
					<Table.Row align="center">
						<Table.ColumnHeaderCell justify="center">
							<HashStraight weight="bold" />
						</Table.ColumnHeaderCell>
						<Table.ColumnHeaderCell justify="center">
							<Timer weight="bold" />
						</Table.ColumnHeaderCell>
						<Table.ColumnHeaderCell justify="center">
							<Calendar weight="bold" />
						</Table.ColumnHeaderCell>
						<Table.ColumnHeaderCell justify="center">
							<Pencil weight="bold" />
						</Table.ColumnHeaderCell>
						<Table.ColumnHeaderCell justify="center">
							<Trash weight="bold" />
						</Table.ColumnHeaderCell>
					</Table.Row>
				</Table.Header>

				<Table.Body>
					{times?.map((time, index, times) => (
						<TimeTableRow time={time} index={times.length - index} />
					))}
				</Table.Body>
			</Table.Root>
		</ScrollArea>
	);
}
