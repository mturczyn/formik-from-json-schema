export function trimStart(str: string, character: string) {
    let s = str
    while (s.charAt(0) === character) {
        s = s.substring(1)
    }
    return s
}
