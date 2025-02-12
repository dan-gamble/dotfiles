import {
	BlockStack,
	Button,
	InlineGrid,
	InlineStack,
	Card as PolarisCard,
	Text,
} from "@shopify/polaris";
import type {
	DisableableAction,
	LoadableAction,
	PlainAction,
} from "@shopify/polaris/build/ts/src/types";
import React, { type PropsWithChildren, useEffect } from "react";

export type CardProps = {
		title?: string;
		headerAction?: (PlainAction & { content: string }) | React.ReactNode;
		footerAction?: DisableableAction & LoadableAction;
	};

export function Card(props: PropsWithChildren<CardProps>) {
	const shouldRenderHeader = props.title || props.headerAction;

	return (
		<PolarisCard>
			<BlockStack gap="300">
				{shouldRenderHeader && (
					<InlineGrid columns="1fr auto" gap="200">
						{props.title && (
							<Text as="h2" variant="headingSm">
								{props.title}
							</Text>
						)}

						{props.headerAction && (
							<Button
								variant="plain"
								{...props.headerAction}
								onClick={props.headerAction.onAction}
							>
								{props.headerAction.content}
							</Button>
						)}
					</InlineGrid>
				)}

				{props.children}

				{props.footerAction && (
					<InlineStack align="end">
						<Button
							{...props.footerAction}
							onClick={props?.footerAction?.onAction}
						>
							{props.footerAction.content}
						</Button>
					</InlineStack>
				)}
			</BlockStack>
		</PolarisCard>
	);
}
