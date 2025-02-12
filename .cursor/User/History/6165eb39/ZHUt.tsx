import {
	FormProvider,
	isValidationErrorResponse,
	useForm,
} from "@rvf/react-router";
import { withZod } from "@rvf/zod";
import {
	BlockStack,
	Card,
	InlineStack,
	Layout,
	Link,
	Page,
	Text,
} from "@shopify/polaris";
import { z } from "zod";
import { TextField } from "~/components/TextField";
import type { Route } from "./+types/index";

const validator = withZod(
	z.object({
		projectName: z
			.string()
			.min(1, "Projects need a name.")
			.max(50, "Must be 50 characters or less."),
		tasks: z
			.array(
				z.object({
					title: z
						.string()
						.min(1, "Tasks need a title.")
						.max(50, "Must be 50 characters or less."),
					daysToComplete: z.coerce.number({
						required_error: "This is required",
					}),
				}),
			)
			.min(1, "Needs at least one task.")
			.default([]),
	}),
);

// export const headers: Route.HeadersFunction = ({ loaderHeaders, parentHeaders }) => {
//   return {
//     "Server-Timing": combineServerTimings(parentHeaders, loaderHeaders),
//   };
// };

export async function loader({ context, request }: Route.LoaderArgs) {
	await context.shopify.authenticate.admin(request);

	return null;
}

export async function action({ context, request }: Route.ActionArgs) {
	return null;
}

export default function Index() {
	const form = useForm({
		validator,
		defaultValues: {
			projectName: "",
			tasks: [],
		},
		onSubmitSuccess: () => {
			// if (isValidationErrorResponse(actionData)) return;

			form.resetForm();
		},
	});

	const s = form.scope("projectName");

	return (
		<Page>
			<BlockStack gap="500">
				<Layout>
					<Layout.Section>
						<FormProvider scope={form.scope()}>
							<form {...form.getFormProps()}>
								<TextField
									label="Project name"
									name="projectName"
									scope={form.scope("projectName")}
								/>
							</form>
						</FormProvider>

						<Card>
							<BlockStack gap="500">
								<BlockStack gap="200">
									<Text as="h2" variant="headingMd">
										BAO Development
									</Text>
								</BlockStack>
							</BlockStack>
						</Card>
					</Layout.Section>

					<Layout.Section variant="oneThird">
						<BlockStack gap="500">
							<Card>
								<BlockStack gap="200">
									<Text as="h2" variant="headingMd">
										Information
									</Text>

									<BlockStack gap="200">
										<InlineStack align="space-between">
											<Text as="span" variant="bodyMd">
												By Association Only
											</Text>

											<Link
												url="https://bao.agency"
												target="_blank"
												removeUnderline
											>
												BAO
											</Link>
										</InlineStack>
									</BlockStack>
								</BlockStack>
							</Card>
						</BlockStack>
					</Layout.Section>
				</Layout>
			</BlockStack>
		</Page>
	);
}
