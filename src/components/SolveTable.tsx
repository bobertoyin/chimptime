import {
	Calendar,
	Cube,
	FloppyDisk,
	HashStraight,
	Pencil,
	Plus,
	Prohibit,
	Timer,
	Trash,
	X,
} from "@phosphor-icons/react";
import {
	Box,
	Code,
	Flex,
	IconButton,
	ScrollArea,
	Table,
	Text,
	TextArea,
	Tooltip,
} from "@radix-ui/themes";
import { useLiveQuery } from "dexie-react-hooks";

import * as Dialog from "@radix-ui/react-dialog";
import { Solve, db } from "../utils/db";
import { displayEvent } from "../utils/scramble";
import { displaySolve } from "../utils/time";
import IconText from "./IconText";

interface TimeTableRowProps {
	solve: Solve;
	index: number;
}

function SolveTableRow(props: TimeTableRowProps): JSX.Element {
	const { solve, index } = props;
	let new_notes: string;
	return (
		<Table.Row key={solve.id} align="center">
			<Table.RowHeaderCell justify="center">{index}</Table.RowHeaderCell>
			<Table.Cell justify="center">
				<Code>{displaySolve(solve)}</Code>
			</Table.Cell>
			<Table.Cell justify="center">{displayEvent(solve.event)}</Table.Cell>
			<Table.Cell justify="center">{solve.date.toLocaleString()}</Table.Cell>
			<Table.Cell justify="center">
				<Flex gap="2" justify="center" align="center">
					<Dialog.Root>
						<Tooltip content="Edit">
							<Dialog.Trigger asChild>
								<IconButton>
									<Pencil weight="bold" />
								</IconButton>
							</Dialog.Trigger>
						</Tooltip>
						<Dialog.Overlay className="dialog-overlay" />
						<Dialog.Content className="dialog-content">
							<Flex direction="column" gap="4">
								<Tooltip content="Close">
									<Dialog.Close asChild>
										<IconButton>
											<X weight="bold" />
										</IconButton>
									</Dialog.Close>
								</Tooltip>
								<Dialog.Title style={{ margin: 0 }}>
									Solve #{index}
								</Dialog.Title>
								<Dialog.Description>
									<Flex
										direction="column"
										gap="3"
										justify="center"
										align="center"
									>
										<Box>
											<Code size="6">{displaySolve(solve, true)}</Code>
										</Box>
										<IconText>
											<Cube weight="bold" />
											<Text size="3">{displayEvent(solve.event)}</Text>
										</IconText>
										<Text size="3">{solve.date.toLocaleString()}</Text>
										<Text size="3">{solve.scramble}</Text>
									</Flex>
								</Dialog.Description>
								<TextArea
									placeholder="Notes"
									defaultValue={solve.notes}
									onChange={(event) => {
										new_notes = event.target.value;
									}}
								/>
								<Tooltip content="Save">
									<IconButton
										onClick={() =>
											db.solves.update(solve.id ?? 0, { notes: new_notes })
										}
									>
										<FloppyDisk weight="bold" />
									</IconButton>
								</Tooltip>
							</Flex>
						</Dialog.Content>
					</Dialog.Root>
					<Tooltip content="+2">
						<IconButton
							onClick={() =>
								db.solves.update(solve.id ?? 0, {
									plusTwo: !solve.plusTwo,
									dnf: false,
								})
							}
						>
							<Plus weight="bold" />
						</IconButton>
					</Tooltip>
					<Tooltip content="DNF">
						<IconButton
							onClick={() =>
								db.solves.update(solve.id ?? 0, {
									dnf: !solve.dnf,
									plusTwo: false,
								})
							}
						>
							<Prohibit weight="bold" />
						</IconButton>
					</Tooltip>
				</Flex>
			</Table.Cell>
			<Table.Cell justify="center">
				<Tooltip content="Delete">
					<IconButton onClick={() => db.solves.delete(solve.id ?? 0)}>
						<X weight="bold" />
					</IconButton>
				</Tooltip>
			</Table.Cell>
		</Table.Row>
	);
}

export default function SolveTable(): JSX.Element {
	const solves = useLiveQuery(async () =>
		(await db.solves.orderBy("date").toArray()).reverse(),
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
							<Cube weight="bold" />
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
					{solves?.map((solve, index, solves) => (
						<SolveTableRow solve={solve} index={solves.length - index} />
					))}
				</Table.Body>
			</Table.Root>
		</ScrollArea>
	);
}
