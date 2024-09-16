export function setAttributeFromPath(data: any, path: string, value: any) {
    const pathParts = path.split('/')
    console.log('pathParts', pathParts)

    pathParts.forEach((part, index) => {
        if (data[part]) {
            data[part] = {}
        }
        if (index < pathParts.length - 1) {
            data = data[part]
        } else {
            data[part] = value
        }
    })
}
