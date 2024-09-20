export function setAttributeFromPath(
    data: any,
    path: string,
    value: any,
    pathSplitChar: string
) {
    const pathParts = path.split(pathSplitChar)

    pathParts.forEach((part, index) => {
        if (!data[part]) {
            data[part] = {}
        }
        if (index < pathParts.length - 1) {
            data = data[part]
        } else {
            data[part] = value
        }
    })
}

export function getAttributeFromPath(
    data: any,
    path: string,
    pathSplitChar: string
) {
    const pathParts = path.split(pathSplitChar)
    let value
    pathParts.forEach((part, index) => {
        if (!data[part] && data[part] !== '') {
            return undefined
        }
        if (index < pathParts.length - 1) {
            data = data[part]
        } else {
            value = data[part]
        }
    })
    return value
}
