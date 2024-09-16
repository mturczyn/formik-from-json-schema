export async function getFileContent() {
    // Open file picker and destructure the result the first handle
    const [fileHandle] = await window.showOpenFilePicker()
    const file = await fileHandle.getFile()
    const content = await file.text()
    return content
}
