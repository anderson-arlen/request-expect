const
	errors = require('./lib/errors'),
	types = require('./lib/types');

class RequestExpect {
	constructor() {
		this.sanitizeObject = this.sanitizeObject.bind(this);
		this.sanitizeArray = this.sanitizeArray.bind(this);
	}

	async sanitizeObject(spec, req, path) {
		const result = {};

		for(const key in spec) {
			const newPath = path ? `${path}.${key}` : key;

			if (spec[key] instanceof Function) {
				result[key] = await spec[key](newPath, req[key]);
			} else if (Array.isArray(spec[key])) {
				result[key] = await this.sanitizeArray(spec[key][0], req[key], newPath);
			} else if (spec[key] instanceof Object) {
				result[key] = await this.sanitizeObject(spec[key], req[key], newPath);
			} else {
				throw new Error();
			}
		}

		return result;
	}

	async sanitizeArray(spec, req, path) {
		const result = [];

		for(const value of req || [req]) {
			if (spec instanceof Function) {
				result.push(await spec(path, value));
			} else if (Array.isArray(spec)) {
				result.push(await this.sanitizeArray(spec[0], value, path));
			} else if (spec instanceof Object) {
				result.push(await this.sanitizeObject(spec, value, path));
			} else {
				throw new Error();
			}
		}

		return result;
	}
}

const reqExpect = new RequestExpect();

module.exports = {
	errors,

	async koa(ctx, next) {
		ctx.request.expect = async (getSpec) => {
			const sanitized = await reqExpect.sanitizeObject(getSpec(types), ctx.request);
			ctx.request = Object.assign(ctx.request, sanitized); // overwrite params, query, body

			return sanitized;
		};

		await next();
	},
	express(req, res, next) {
		req.expect = async(getSpec) => {
			const sanitized = await reqExpect.sanitizeObject(getSpec(types), req);
			req = Object.assign(req, sanitized); // overwrite params, query, body

			return sanitized;
		};

		next();
	}
};
