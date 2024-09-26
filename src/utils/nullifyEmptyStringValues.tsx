export const nullifyEmptyStringValues = (values: any) =>
    Object.keys(values).forEach((key) => {
        if (values[key] === '') {
            values[key] = null
        }
    })
