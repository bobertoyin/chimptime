import { GitBranch, GithubLogo } from "@phosphor-icons/react";
import { Code, Flex, Link, Separator, Text } from "@radix-ui/themes";

import pkgJson from "../../package.json"; // TODO: get version without importing all of package.json
import IconText from "./IconText";

export default function Footer(): JSX.Element {
	return (
		<footer>
			<Text>
				<Flex gap="3" align="center">
					<Code>
						<IconText>
							<GitBranch />v{pkgJson.version}
						</IconText>
					</Code>
					<Separator orientation="vertical" />
					<Link
						href="https://github.com/bobertoyin/chimptime"
						target="_blank"
						rel="noreferrer"
					>
						<IconText>
							<GithubLogo weight="bold" />
							GitHub
						</IconText>
					</Link>
				</Flex>
			</Text>
		</footer>
	);
}
