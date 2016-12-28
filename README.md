# request-expect

> Easy request sanitization & make your APIs self documenting

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
	await ctx.request.expect((types) => {
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
	await req.expect((types) => {
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
