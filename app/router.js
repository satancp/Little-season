module.exports = app => {
    app.get('/', app.controller.home.home.index);
    app.get('/user/list', app.controller.user.user.index);
    app.get('/api/user/list', app.controller.user.userApi.index);
    app.get('/user/add', app.controller.user.user.add);
    app.post('/api/user/add', app.controller.user.userApi.add);
    app.post('/api/user/update', app.controller.user.userApi.update);
    app.post('/api/user/delete', app.controller.user.userApi.delete);
    app.get('/resource/list', app.controller.resource.resource.index);
    app.get('/api/resource/list', app.controller.resource.resourceApi.index);
    app.get('/resource/add', app.controller.resource.resource.add);
    app.post('/api/resource/add', app.controller.resource.resourceApi.add);
    app.post('/api/resource/update', app.controller.resource.resourceApi.update);
    app.post('/api/resource/delete', app.controller.resource.resourceApi.delete);
    app.post('/api/upload/upload', app.controller.upload.upload.upload);
};
