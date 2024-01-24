import {
	Calendar,
	Cube,
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

import * as Dialog from "@radix-ui/react-dialog";
import { Solve, db } from "../utils/db";
import { displayEvent } from "../utils/scramble";
import { displayTimeObj } from "../utils/time";

interface TimeTableRowProps {
	solve: Solve;
	index: number;
}

function SolveTableRow(props: TimeTableRowProps): JSX.Element {
	const { solve, index } = props;
	return (
		<Table.Row key={solve.id} align="center">
			<Table.RowHeaderCell justify="center">{index}</Table.RowHeaderCell>
			<Table.Cell justify="center">
				<Code>{displayTimeObj(solve)}</Code>
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
						<Dialog.Portal>
							<Dialog.Overlay className="dialog-overlay" />
							<Dialog.Content className="dialog-content">
								<Tooltip content="Close">
									<Dialog.Close asChild>
										<IconButton>
											<X weight="bold" />
										</IconButton>
									</Dialog.Close>
								</Tooltip>
								<Dialog.Title className="dialog-title">Edit Solve</Dialog.Title>
								<Dialog.Description className="dialog-description">
									{JSON.stringify(solve)}
								</Dialog.Description>
							</Dialog.Content>
						</Dialog.Portal>
					</Dialog.Root>
					<Tooltip content="+2">
						<IconButton
							onClick={() =>
								db.solves.update(solve.id ?? 0, { plusTwo: !solve.plusTwo })
							}
						>
							<Plus weight="bold" />
						</IconButton>
					</Tooltip>
					<Tooltip content="DNF">
						<IconButton
							onClick={() =>
								db.solves.update(solve.id ?? 0, { dnf: !solve.dnf })
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
