import { PropsWithChildren } from "react";

export default function IconText(props: PropsWithChildren): JSX.Element {
	return (
		<div style={{ display: "flex", alignItems: "center" }}>
			{props.children}
		</div>
	);
}
