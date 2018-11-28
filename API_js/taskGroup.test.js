const app = require('./taskGroup').app;

test('GET should return 201 if there is any taskGroup in the Database', (done) =>{
    request(app)
        .get('/taskGroups')
        .exept(201)
        .end((err, res) => {
            if(err && res.error){
                console.log(res.error)
            }
            done(err);
        });
});