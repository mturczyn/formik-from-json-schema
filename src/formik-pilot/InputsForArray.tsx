import { useState } from 'react'
import { InputsForForm } from './InputsForForm'

export const InputsForArray = ({
    objectKey,
    arrayWithValues: currentValue,
    onAddItemToArray,
    onRemoveItemToArray,
}: {
    objectKey: string
    arrayWithValues: any
    onAddItemToArray?: (addItemEvent: {
        arrayItem: any
        objectPath: string
    }) => void
    onRemoveItemToArray?: (addItemEvent: {
        arrayItem: any
        objectPath: string
    }) => void
}) => {
    const [showItems, setShowItems] = useState(true)
    const currentCount = currentValue.length

    return (
        <>
            {showItems ? (
                <button type="button" onClick={() => setShowItems(false)}>
                    Hide
                </button>
            ) : (
                <div>
                    {objectKey}{' '}
                    <button type="button" onClick={() => setShowItems(true)}>
                        Show all items ({currentCount})
                    </button>
                </div>
            )}
            {showItems && (
                <>
                    <button
                        type="button"
                        onClick={() =>
                            onAddItemToArray &&
                            onAddItemToArray({
                                arrayItem: { ...currentValue[0] },
                                objectPath: objectKey,
                            })
                        }
                    >
                        Add
                    </button>
                    {currentValue.map((item: any, index: number) => (
                        <div
                            key={`${objectKey}:${index}`}
                            style={{
                                border: '1px solid white',
                                margin: '5px 0',
                            }}
                        >
                            <button
                                type="button"
                                onClick={() =>
                                    onRemoveItemToArray &&
                                    onRemoveItemToArray({
                                        arrayItem: item,
                                        objectPath: objectKey,
                                    })
                                }
                            >
                                Remove
                            </button>
                            <InputsForForm
                                key={`${objectKey}:${index}`}
                                initialValues={item}
                                parentName={`${objectKey}[${index}]`}
                            />
                        </div>
                    ))}
                </>
            )}
        </>
    )
}
