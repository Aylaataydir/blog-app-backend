"use strict"

class CustomError extends Error {
    statusCode: number;
    name = 'CustomError'

    constructor(message: string, statusCode = 500) {
        super(message)
        this.statusCode = statusCode
    }
}

export default CustomError;
