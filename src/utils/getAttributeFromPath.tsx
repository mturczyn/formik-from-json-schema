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
