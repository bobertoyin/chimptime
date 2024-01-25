import { Text } from "@radix-ui/themes";
import { PropsWithChildren } from "react";

interface IconTextProps {
	inline?: boolean;
}

export default function IconText(
	props: PropsWithChildren<IconTextProps>,
): JSX.Element {
	const { inline } = props;
	return (
		<Text
			style={{ display: inline ? "inline-flex" : "flex", alignItems: "center" }}
		>
			{props.children}
		</Text>
	);
}
