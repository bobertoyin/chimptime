import { GithubLogo, Heart } from "@phosphor-icons/react";
import { Flex, Link, Separator, Text } from "@radix-ui/themes";

import IconText from "./IconText";

export default function Footer(): JSX.Element {
	return (
		<footer>
			<Text>
				<Flex gap="3" align="center">
					<IconText>
						<Text>Made with</Text>
						<Flex mx="1" align="center" justify="center">
							<Heart weight="fill" />
						</Flex>
						<Text>
							by{" "}
							<Link href="https://bobertoyin.com" target="_blank" rel="noreferrer">
								Robert Yin
							</Link>
						</Text>
					</IconText>
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
