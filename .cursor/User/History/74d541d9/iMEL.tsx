import {
	FormProvider,
	type ValidatedFormProps,
	useForm,
} from "@rvf/react-router";
import { SaveBar, useAppBridge } from "@shopify/app-bridge-react";
import type * as React from "react";
import { useCallback, useEffect, useId } from "react";
import { useBlocker } from "react-router";
import { compareValues } from "~/utils/helpers/compare-values";

export type FormProps = ValidatedFormProps<any, any, any> & {
	debug?: boolean;
	onDiscard?: () => void;
	children: React.ReactNode;
};

export function Form({
	debug = false,
	children,
	onDiscard,
	...props
}: FormProps) {
	const id = useId();
	const barId = `form-bar-${props.id ?? id}`;
	const defaultValues = props.defaultValues;
	const shopify = useAppBridge();

	useBlocker(() => {
		if (form.formState.isDirty && !form.formState.isSubmitting) {
			shopify.saveBar.leaveConfirmation();
			return true;
		}

		return false;
	});

	const form = useForm({
		method: "post",
		...props,
		resetAfterSubmit: true,
		onSubmitFailure: (handleSubmitResponse) => {
			form.resetForm(props.defaultValues);
		},
		onSubmitSuccess: (handleSubmitResponse) => {
			form.resetForm(props.defaultValues);
		},
	});

	useEffect(() => {
		if (form.formState.isDirty) {
			shopify.saveBar.show(barId);
		} else {
			shopify.saveBar.hide(barId);
		}
	}, [barId, form, shopify]);

	useEffect(() => {
		if (!defaultValues) return;

		const unsubscribeFns: (() => void)[] = Object.entries(defaultValues).map(
			([key, defaultValue]) =>
				form.subscribe.value(key, (value: any) => {
					if (compareValues(value, defaultValue)) {
						// If the form is clean, we want to hide the save bar, so we reset the form to the default values
						// @ts-ignore
						return form.resetField(key, defaultValue);
					}

					// Sometimes RVF doesn't mark the field as dirty when it should, so we do it manually here
					return form.setDirty(key, true);
				}),
		);

		return () => {
			for (const unsubscribe of unsubscribeFns) {
				unsubscribe();
			}
		};
	}, [form, defaultValues]);

	const handleReset = useCallback(() => {
		form.resetForm(defaultValues);

		if (typeof onDiscard === "function") {
			onDiscard();
		}
	}, [form, defaultValues, onDiscard]);

	return (
		<FormProvider scope={form.scope()}>
			<form {...form.getFormProps()}>
				<SaveBar id={barId}>
					<button
						type="submit"
						variant="primary"
						loading={form.formState.isSubmitting ? "" : undefined}
					/>

					<button
						type="button"
						disabled={form.formState.isSubmitting}
						onClick={handleReset}
					/>
				</SaveBar>

				{children}

				{debug && <pre>{JSON.stringify(form.value(), null, 2)}</pre>}
			</form>
		</FormProvider>
	);
}
