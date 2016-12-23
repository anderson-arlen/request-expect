const errors = require('./errors');

function any(isRequired, path, value) {
	const omitted = ~['', null, undefined].indexOf(value);

	if (isRequired && omitted)
		throw new errors.MissingRequiredValueError(path);

	return omitted ? undefined : value;
}

function string(isRequired, path, value) {
	const omitted = any(...arguments) === undefined;

	return omitted ? undefined : `${value}`;
}

function integer(isRequired, path, value) {
	const omitted = any(...arguments) === undefined;

	if (!omitted && /[^\d\.\-]/g.test(value))
		throw new errors.InvalidTypeError({value, path});

	return omitted ? undefined : parseInt(value, 10);
}

function number(isRequired, path, value) {
	const omitted = any(...arguments) === undefined;

	if (!omitted && /[^\d\.\-]/g.test(value))
		throw new errors.InvalidTypeError({value, path});

	if (omitted) return undefined;

	if (/\./.test(value))
		return parseFloat(value);

	return parseInt(value);
}

class TypeChecker {
	constructor() {
		this.any = any.bind(this, true);
		this.any.isOptional = any.bind(this, false);

		this.string = string.bind(this, true);
		this.string.isOptional = string.bind(this, false);

		this.integer = integer.bind(this, true);
		this.integer.isOptional = integer.bind(this, false);

		this.number = number.bind(this, true);
		this.number.isOptional = number.bind(this, false);
	}
}

module.exports = new TypeChecker();
