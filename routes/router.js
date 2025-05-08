const { createIndexRouter } = require('./index');
const { createLearningRouter } = require('./learning');
const { createEventsRouter } = require('./events');
const { createNewsletterRouter } = require('./newsletter');
const { createProductsRouter } = require('./products');
const { createOrdersRouter } = require('./orders');
const { createSearchRouter } = require('./search');
const { createUsersRouter } = require('./users');
const { createServicesRouter } = require('./services');
const { createWishlistsRouter } = require('./wishlists');
const { createCartRouter } = require('./cart');

function createRouters(app, db) {
    const indexRouter = createIndexRouter(db);
    const learningRouter = createLearningRouter();
    const usersRouter = createUsersRouter(db);
    const newsletterRouter = createNewsletterRouter(db);
    const ordersRouter = createOrdersRouter(db);
    const productsRouter = createProductsRouter(db);
    const searchRouter = createSearchRouter(db);
    const eventsRouter = createEventsRouter(db);
    const servicesRouter = createServicesRouter(db);
    const wishlistsRouter = createWishlistsRouter(db);
    const cartRouter = createCartRouter(db);

    app.use('/', indexRouter);
    app.use('/learning', learningRouter);
    app.use('/newsletter', newsletterRouter);
    app.use('/users', usersRouter);
    app.use('/products', productsRouter);
    app.use('/orders', ordersRouter);
    app.use('/search', searchRouter);
    app.use('/events', eventsRouter);
    app.use('/services', servicesRouter);
    app.use('/wishlists', wishlistsRouter);
    app.use('/cart', cartRouter);

    return app;
}

module.exports = createRouters;

