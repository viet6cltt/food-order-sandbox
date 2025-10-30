const express = require('express');

function route(app) {
    const apiRouter = express.Router();

    // apiRouter.use('/...', controller);

    app.use('/api', apiRouter);

    // Handler err
    app.use((err, req, res, next) => {
        console.log('sending response error');
        console.error(err);
        return res.status(err.status || 500).json({ error: err.message });

    });
}

module.exports = route;