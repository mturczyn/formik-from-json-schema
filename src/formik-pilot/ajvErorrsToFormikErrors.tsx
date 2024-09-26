import { trimStart } from './trimStart'
import { setAttributeFromPath } from '../utils/setAttributeFromPath'
import { getAttributeFromPath } from '../utils/getAttributeFromPath'
import { ErrorObject } from 'ajv'

type AjvErrors = ErrorObject<string, Record<string, any>, unknown>[]

export function ajvErorrsToFormikErrors(
    ajvErrors: AjvErrors,
    validatedValues: any
): { data: any; unexpectedErrors: AjvErrors } {
    const data = {}
    const unexpectedErrors: AjvErrors = []

    ajvErrors.forEach((ajvError) => {
        const path =
            ajvError.keyword === 'required'
                ? ajvError.params.missingProperty
                : trimStart(ajvError.instancePath, '/')

        const valueAtPath = getAttributeFromPath(validatedValues, path, '/')
        // If validated values do not contain even such field.
        if (valueAtPath !== '' && !valueAtPath) {
            unexpectedErrors.push(ajvError)
        }

        setAttributeFromPath(data, path, ajvError.message, '/')
    })

    return { data: data, unexpectedErrors: unexpectedErrors }
}
