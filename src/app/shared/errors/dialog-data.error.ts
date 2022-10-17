export class DialogEmptyDataError extends Error {
    constructor(className: string) {
        const msg = `Missing data when opening dialog for class ${className}`
        super(msg)
        Object.setPrototypeOf(this, DialogEmptyDataError.prototype);
    }
}
export class DialogDataMissingKeyError extends Error {
    constructor(key: string, className: string) {
        const msg = `Missing key <${key}> in data when opening dialog for class ${className}`
        super(msg)
        Object.setPrototypeOf(this, DialogDataMissingKeyError.prototype);
    }
}
