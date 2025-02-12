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
import { type PropsWithChildren, useEffect, useMemo } from "react";
import * as React from "react";

type HeaderAction = PlainAction & { content: string };

export type CardProps = {
		title?: string;
		headerAction?: (PlainAction & { content: string }) | React.ReactNode;
		footerAction?: DisableableAction & LoadableAction;
	};

export function Card(props: PropsWithChildren<CardProps>) {
	const shouldRenderHeader = props.title || props.headerAction;

	const renderHeaderAction = useMemo(() => {
		const headerAction = props?.headerAction;
		if (!headerAction) return null;

		if (React.isValidElement(headerAction)) {
			return headerAction;
		}

		if (isHeaderActionObject(headerAction)) {
			return (
				<Button
					variant="plain"
					{...headerAction}
					onClick={headerAction.onAction}
				>
					{headerAction.content}
				</Button>
			);
		}

		return null;
	}, [props?.headerAction])

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

						{renderHeaderAction}
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

function isHeaderActionObject(value: unknown): value is HeaderAction {
	return (
		typeof value === "object" &&
		value !== null &&
		"onAction" in value &&
		"content" in value
	);
}
