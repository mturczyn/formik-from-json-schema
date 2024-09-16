import { trimStart } from './trimStart'
import { setAttributeFromPath } from './setAttributeFromPath'

export function ajvErorrsToFormikErrors(ajvErrors) {
    const data = {}

    ajvErrors.forEach((ajvError) => {
        console.log('ajvError', ajvError)
        let path = trimStart(ajvError.instancePath, '/')

        if (ajvError.params.missingProperty) {
            path += `/${ajvError.params.missingProperty}`
        }

        console.log('path', path)
        setAttributeFromPath(data, path, ajvError.message)
    })

    console.log('data', data)

    return data
}
