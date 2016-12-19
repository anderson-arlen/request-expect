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
		this.any = any.bind(this, false);
		this.any.isRequired = any.bind(this, true);

		this.string = string.bind(this, false);
		this.string.isRequired = string.bind(this, true);

		this.integer = integer.bind(this, false);
		this.integer.isRequired = integer.bind(this, true);

		this.number = number.bind(this, false);
		this.number.isRequired = number.bind(this, true);
	}
}

module.exports = new TypeChecker();
