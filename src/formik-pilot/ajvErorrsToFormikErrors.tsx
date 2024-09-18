import { trimStart } from './trimStart'
import { setAttributeFromPath } from './setAttributeFromPath'

export function ajvErorrsToFormikErrors(ajvErrors) {
    const data = {}

    ajvErrors.forEach((ajvError) => {
        let path =
            ajvError.keyword === 'required'
                ? ajvError.params.missingProperty
                : trimStart(ajvError.instancePath, '/')

        if (ajvError.params.missingProperty) {
            path += `/${ajvError.params.missingProperty}`
        }

        setAttributeFromPath(data, path, ajvError.message)
    })

    return data
}
