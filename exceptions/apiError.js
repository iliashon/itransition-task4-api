module.exports = class ApiError extends Error {
    status;
    errors;

    constructor(status, message, errors = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static UnauthorizedError(a = "Not arg") {
        return new ApiError(401, "User is not authorized", [a]);
    }

    static BadRequest(message, errors = []) {
        return new ApiError(400, message, errors);
    }

    static BlockedError() {
        return new ApiError(403, "The user is blocked");
    }
};
