import { InputsForArray } from './InputsForArray'
import { LabelWithInput } from './LabelWithInput'

export const InputsForForm = ({
    initialValues,
    parentName,
    onAddItemToArray,
    onRemoveItemToArray,
}: {
    initialValues: object
    parentName?: string
    onAddItemToArray?: (addItemEvent: {
        arrayItem: any
        objectPath: string
    }) => void
    onRemoveItemToArray?: (addItemEvent: {
        arrayItem: any
        objectPath: string
    }) => void
}) => {
    if (Array.isArray(initialValues)) {
        return (
            <InputsForArray
                key="rootform"
                arrayWithValues={initialValues}
                objectKey={parentName ?? ''}
                onAddItemToArray={onAddItemToArray}
                onRemoveItemToArray={onRemoveItemToArray}
            />
        )
    }

    return Object.keys(initialValues).map((objectKey) => {
        const currentValue = initialValues[objectKey]

        if (typeof currentValue === 'object') {
            if (Array.isArray(currentValue)) {
                return (
                    <InputsForArray
                        key={objectKey}
                        arrayWithValues={currentValue}
                        objectKey={objectKey}
                        onAddItemToArray={onAddItemToArray}
                        onRemoveItemToArray={onRemoveItemToArray}
                    />
                )
            }

            return (
                <InputsForForm
                    key={objectKey}
                    initialValues={currentValue}
                    parentName={objectKey}
                />
            )
        } else {
            const fullPropertyPath = !parentName
                ? objectKey
                : parentName + '.' + objectKey

            return (
                <LabelWithInput
                    key={fullPropertyPath}
                    fieldName={fullPropertyPath}
                    label={fullPropertyPath}
                ></LabelWithInput>
            )
        }
    })
}
