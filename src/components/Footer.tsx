import { GithubLogo } from "@phosphor-icons/react";
import { Link } from "@radix-ui/themes";

export default function Footer(): JSX.Element {
	return (
		<footer>
			<Link
				href="https://github.com/bobertoyin/chimptime"
				target="_blank"
				rel="noreferrer"
			>
				<GithubLogo weight="bold" /> GitHub
			</Link>
		</footer>
	);
}
