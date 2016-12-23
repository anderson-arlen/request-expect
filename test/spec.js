const
	requestExpect = require('../'),
	should = require('should');

describe('RequestExpect', () => {
	const ctx = {request: {}};

	it('should attach itself to ctx.request', async () => {
		const
			next = async () => {
				return true;
			};

		await requestExpect.koa(ctx, next);

		should.exist(ctx.request.expect);
	});

	describe('ctx.request.expect()', () => {
		it('should accept a callback which returns the request specification', async () => {
			ctx.request.body = {
				username: 'hello',
				password: '123456',
				someData: [1, 2, 3, 4, '5', '6'],
				moreData: {
					one: '1',
					two: '2.0'
				}
			};

			await ctx.request.expect((types) => {
				return {
					body: {
						username: types.string.isRequired,
						password: types.string.isRequired,
						someData: [
							types.integer.isRequired
						],
						moreData: {
							one: types.integer.isRequired,
							two: types.number.isRequired
						}
					}
				};
			});

			should(ctx.request.body).deepEqual({
				username: 'hello',
				password: '123456',
				someData: [1, 2, 3, 4, 5, 6],
				moreData: {
					one: 1,
					two: 2
				}
			});
		});
	});
});
