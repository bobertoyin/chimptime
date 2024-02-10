import {
	Calendar,
	Cube,
	DownloadSimple,
	FloppyDisk,
	HashStraight,
	Pencil,
	Plus,
	Prohibit,
	Timer,
	Trash,
	UploadSimple,
	X,
} from "@phosphor-icons/react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import * as Dialog from "@radix-ui/react-dialog";
import * as Toolbar from "@radix-ui/react-toolbar";
import {
	Box,
	Button,
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
import { useRef } from "react";

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
	const solve_date = new Date(solve.date);
	return (
		<Table.Row key={solve.id} align="center">
			<Table.RowHeaderCell justify="center">{index}</Table.RowHeaderCell>
			<Table.Cell justify="center">
				<Code>{displaySolve(solve)}</Code>
			</Table.Cell>
			<Table.Cell justify="center">{displayEvent(solve.event)}</Table.Cell>
			<Table.Cell justify="center">{solve_date.toLocaleString()}</Table.Cell>
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
										<Text size="3">{solve_date.toLocaleString()}</Text>
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

function UploadButton(): JSX.Element {
	const fileInput = useRef<HTMLInputElement>(null);

	return (
		<IconButton onClick={(_event) => fileInput.current?.click()}>
			<UploadSimple weight="bold" />
			<input
				type="file"
				hidden
				ref={fileInput}
				onChange={async (event) => {
					const file = event.target.files?.item(0);
					if (file) {
						await db.uploadCSV(file);
					}
				}}
			/>
		</IconButton>
	);
}

export default function SolveTable(): JSX.Element {
	const solves = useLiveQuery(async () =>
		(await db.solves.orderBy("date").toArray()).reverse(),
	);
	const empty = !(solves && solves.length > 0);

	return (
		<ScrollArea>
			<Flex direction="column" gap="4" p="1">
				<Toolbar.Root aria-label="Table options">
					<Flex gap="2">
						<Tooltip content="Import">
							<Toolbar.ToolbarButton asChild>
								<UploadButton />
							</Toolbar.ToolbarButton>
						</Tooltip>
						<Tooltip content="Export">
							<Toolbar.ToolbarButton asChild disabled={empty}>
								<IconButton onClick={async () => await db.downloadCSV()}>
									<DownloadSimple weight="bold" />
								</IconButton>
							</Toolbar.ToolbarButton>
						</Tooltip>
						<AlertDialog.Root>
							<Tooltip content="Delete All">
								<Toolbar.ToolbarButton asChild disabled={empty}>
									<AlertDialog.Trigger asChild>
										<IconButton>
											<Trash weight="bold" />
										</IconButton>
									</AlertDialog.Trigger>
								</Toolbar.ToolbarButton>
							</Tooltip>
							<AlertDialog.Overlay className="alert-dialog-overlay" />
							<AlertDialog.Content className="alert-dialog-content">
								<AlertDialog.Title>Are you sure?</AlertDialog.Title>
								<AlertDialog.Description>
									This action cannot be undone. This will permanently delete all
									solves in your session.
								</AlertDialog.Description>
								<Flex gap="1">
									<AlertDialog.Cancel asChild>
										<Button color="gray">Cancel</Button>
									</AlertDialog.Cancel>
									<AlertDialog.Action asChild>
										<Button color="red" onClick={() => db.solves.clear()}>
											Delete All
										</Button>
									</AlertDialog.Action>
								</Flex>
							</AlertDialog.Content>
						</AlertDialog.Root>
					</Flex>
				</Toolbar.Root>
				<Table.Root variant="ghost">
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
			</Flex>
		</ScrollArea>
	);
}
