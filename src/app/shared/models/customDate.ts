export class CustomDate extends Date {
    // ! Why?
    /*
        https://stackoverflow.com/a/2552510
    */
    override getMonth(): number {
        return super.getMonth() + 1
    }
}
