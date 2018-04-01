'use strict';
module.exports = app => {
    return class ResourceController extends app.Controller {
        async index() {
            const { ctx } = this;
            await ctx.render('resource/list.js', { message: 'react server side render!' });
        }

        async add() {
            const { ctx } = this;
            await ctx.render('resource/add.js', { message: 'react server side render!' });
        }
    };
};
