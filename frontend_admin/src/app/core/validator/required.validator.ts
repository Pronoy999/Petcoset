import { ValidatorFn, AbstractControl } from '@angular/forms';

export function RequiredValidator(errorMessage = ""): ValidatorFn {
	return (control: AbstractControl): { [key: string]: any } | null => {

		return control.value.replace(/\s/g, "") !== "" ? null : { crequired: { value: control.value, errorMessage: errorMessage } };
	};
}