import { Timer } from "@phosphor-icons/react";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { Heading, Link } from "@radix-ui/themes";

import IconText from "./IconText";

export default function NavBar(): JSX.Element {
	return (
		<NavigationMenu.Root>
			<Link href="/">
				<Heading size="8">
					<IconText>
						<Timer weight="bold" />
						chimptime
					</IconText>
				</Heading>
			</Link>
		</NavigationMenu.Root>
	);
}
