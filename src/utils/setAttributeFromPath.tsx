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
