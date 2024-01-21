import { Text } from "@radix-ui/themes";
import { PropsWithChildren } from "react";

export default function IconText(props: PropsWithChildren): JSX.Element {
	return (
		<Text style={{ display: "flex", alignItems: "center" }}>
			{props.children}
		</Text>
	);
}
