'use strict';
module.exports = app => {
    return class ResourceApiController extends app.Controller {
        async index() {
            const { ctx } = this;
            const results = await app.mysql.select('resources', {
                orders: [['created_at', 'desc'], ['id', 'desc']],
                limit: 10,
                offset: 0
            });
            ctx.body = results;
        }

        async add() {
            const { ctx } = this;
            console.log(ctx.request.body);
            const results = await app.mysql.insert('resources', ctx.request.body);
            ctx.body = results;
        }

        async update() {
            const { ctx } = this;
            const row = { ...ctx.request.body };
            row.updated_at = app.mysql.literals.now;
            console.log(row);
            const result = await app.mysql.update('resources', row);
            ctx.body = result;
        }

        async delete() {
            const { ctx } = this;
            const result = await app.mysql.delete('resources', ctx.request.body);
            ctx.body = result;
        }
    };
};
