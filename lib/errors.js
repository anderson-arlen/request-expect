class CustomError extends Error {
	constructor(message) {
		super(message);
		this.message = message;
		this.name = this.constructor.name;
	}
}

class InvalidTypeError extends CustomError {
}

class MissingRequiredValueError extends CustomError {
}

module.exports = {
	InvalidTypeError,
	MissingRequiredValueError
};
