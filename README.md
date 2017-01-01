request-expect
==============
[![build status][travis-image]][travis-url]
[![NPM version][npm-image]][npm-url]
[![node version][node-image]][node-url]

[travis-image]: https://img.shields.io/travis/anderson-arlen/request-expect.svg?style=flat-square
[travis-url]: https://travis-ci.org/anderson-arlen/request-expect
[npm-image]: https://img.shields.io/npm/v/request-expect.svg?style=flat-square
[npm-url]: https://npmjs.org/package/request-expect
[node-image]: https://img.shields.io/badge/node.js-%3E%3D7.0.0-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/

Easily sanitize Koa and Express request bodies, throwing errors when required parameters are missing or invalid. Helps make your APIs self documenting.

## Installation

Install package with NPM and add it to your development dependencies:

`npm install --save-dev request-expect`

## Usage

#### Example for Koa
```javascript
const
	koa = require('koa'),
	bodyParser = require('koa-bodyparser'),
	requestExpect = require('request-expect'),

	app = koa();

app.use(bodyParser());
app.use(requestExpect.koa);
app.use(async function YourApiEndpoint(ctx) {
	// request-expect attaches itself to your request object
	ctx.request.expect((types) => {
		// return an object definition of what you expect to be sent in the request
		return {
			params: {
				id: types.integer
			},
			body: {
				email: types.string, // parameters are required by default.
				password: types.string,
				username: types.string.isOptional // optional parameter
			}
		};
	});

	// request-expect mutates your request object so everything
	// in ctx.request should now be safe.

	// do something...
});

app.listen(3000);
```

#### Example for Express
```javascript
const
	express = require('express'),
	requestExpect = require('request-expect'),

	app = express();

app.use(requestExpect.express);
app.get('/', async function YourApiEndpoint(req, res) {
	// request-expect attaches itself to your request object
	req.expect((types) => {
		// return an object definition of what you expect to be sent in the request
		return {
			params: {
				id: types.integer
			},
			body: {
				email: types.string, // parameters are required by default.
				password: types.string,
				username: types.string.isOptional // optional parameter
			}
		};
	});

	// request-expect mutates your request object so everything
	// in req should now be safe.

	// do something...
});

app.listen(3000);
```

#### Types
* `any` any type
* `string` same as `any` but casts to a string
* `integer` trims and runs parseInt
* `number` same as `integer`, but runs parseFloat instead of parseInt if a decimal is present

All types are required by default. To make it optional, chain `isOptional`. See the above examples.
