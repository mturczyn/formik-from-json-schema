import { trimStart } from './trimStart'
import {
    getAttributeFromPath,
    setAttributeFromPath,
} from '../utils/setAttributeFromPath'
import { ErrorObject } from 'ajv'

type AjvErrors = ErrorObject<string, Record<string, any>, unknown>[]

export function ajvErorrsToFormikErrors(
    ajvErrors: AjvErrors,
    validatedValues: any
): { data: any; unexpectedErrors: AjvErrors } {
    const data = {}
    const unexpectedErrors: AjvErrors = []

    ajvErrors.forEach((ajvError) => {
        let path =
            ajvError.keyword === 'required'
                ? ajvError.params.missingProperty
                : trimStart(ajvError.instancePath, '/')

        if (ajvError.params.missingProperty) {
            path += `/${ajvError.params.missingProperty}`
        }

        if (!getAttributeFromPath(validatedValues, path, '/')) {
            unexpectedErrors.push(ajvError)
        }

        setAttributeFromPath(data, path, ajvError.message, '/')
    })

    return { data: data, unexpectedErrors: unexpectedErrors }
}
