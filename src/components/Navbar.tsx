import { Timer } from "@phosphor-icons/react";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { Heading } from "@radix-ui/themes";

export default function NavBar(): JSX.Element {
	return (
		<NavigationMenu.Root>
			<Heading size="8" style={{ display: "flex", alignItems: "center" }}>
				<Timer weight="bold" />
				chimptime
			</Heading>
		</NavigationMenu.Root>
	);
}
