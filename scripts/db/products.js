// products.js

const { execute, query } = require('./sql');

const products = [
    ["Amethyst Ring", "Elegant purple gemstone ring.", 120.00, "product1.jpeg"],
    ["Emerald Necklace", "Vibrant green emerald pendant.", 250.00, "product2.jpeg"],
    ["Ruby Earrings", "Bold ruby gemstone earrings.", 180.00, "product3.jpeg"],
    ["Sapphire Bracelet", "Blue sapphire stones in silver.", 210.00, "product4.jpeg"],
    ["Diamond Pendant", "Classic diamond solitaire necklace.", 320.00, "product5.jpeg"],
    ["Topaz Brooch", "Yellow topaz brooch with vintage design.", 145.00, "product6.jpeg"],
    ["Opal Ring", "Iridescent opal gemstone ring.", 160.00, "product7.jpeg"],
    ["Citrine Studs", "Golden citrine stud earrings.", 95.00, "product8.jpeg"],
    ["Turquoise Cuff", "Bold turquoise in handcrafted cuff.", 190.00, "product9.jpeg"],
    ["Garnet Chain", "Dark red garnet on gold chain.", 130.00, "product10.jpeg"],
    ["Moonstone Charm", "Soft glowing moonstone charm.", 110.00, "product11.jpeg"],
    ["Aquamarine Ring", "Calm blue aquamarine in silver.", 200.00, "product12.jpeg"]
];

const addImageToProducts = (productData) => {
    return productData.map(([name, description, price, image]) => ({
        name,
        description,
        price,
        image
    }));
};

const createProducts = async (db) => {
    try {
        await execute(
            db,
            `CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT,
                price REAL NOT NULL DEFAULT 0.0,
                is_featured INTEGER NOT NULL DEFAULT 0,
                is_sale INTEGER NOT NULL DEFAULT 0
            )`
        );

        const result = await query(db, `PRAGMA table_info(products)`);
        const columnExists = result.some(col => col.name === 'image');

        if (!columnExists) {
            await execute(db, `ALTER TABLE products ADD COLUMN image TEXT`);
            console.log('Image column added to products table.');
        } else {
            console.log('Image column already exists.');
        }

        const productObjects = addImageToProducts(products);

        // Optional: Check if products already exist
        const existing = await query(db, `SELECT COUNT(*) AS count FROM products`);
        if (existing[0].count > 0) {
            console.log('Products already seeded. Skipping.');
            return;
        }

        for (const product of productObjects) {
            await db.run(
                `INSERT INTO products (name, description, price, image)
                 VALUES (?, ?, ?, ?)`,
                [product.name, product.description, product.price, product.image]
            );
        }
        console.log('Products seeded.');
    } catch (error) {
        console.error('Error in createProducts:', error);
    } finally {
        console.log('Products table created or updated.');
    }
};

module.exports = {
    createProducts,
};
