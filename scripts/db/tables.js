const { createCart } = require('./cart');
const { createEvents } = require('./events');
const { createNewsletterSubs } = require('./newsletters');
const { createProducts } = require('./products');
const { createService } = require('./services');
const { createOrders } = require('./orders');
const { createUsers, ensurePasswordColumn } = require('./users');
const { createWishlist } = require('./wishlists');

const tables = [
    createEvents,
    createService,
    createProducts,
    createOrders,
    createUsers,
    ensurePasswordColumn,
    createCart,
    createWishlist,
    createNewsletterSubs,
];

module.exports = tables;