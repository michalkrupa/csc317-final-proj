const { execute, query } = require('./sql');

const products = [
    ["Emerald Pendant", "A vibrant emerald pendant on a delicate gold chain, blending natural beauty with timeless elegance.", 1220.00, "product1.jpeg", 0, 1],
    ["Ruby Pendant", "A rich ruby pendant on a fine white gold chain, radiating bold color and classic charm.", 240.00, "product2.jpeg", 1, 0],
    ["Aquamarine Pendant", "A serene aquamarine pendant on a sleek silver chain, exuding calm and elegance.", 140.00, "product3.jpeg", 1, 0],
    ["Diamond Ring", "A dazzling 3-carat diamond set in a luxurious 22K gold band, embodying brilliance and opulence.", 5500.00, "product4.jpeg", 1, 0],
    ["Emerald Pendant", "A striking 6-carat emerald pendant on a polished silver chain, showcasing bold elegance and rich color.", 2240.00, "product5.jpeg", 1, 0],
    ["Ruby", "A stunning 5-carat cut ruby, radiating deep red brilliance-perfect as a standout centerpiece.", 3540.00, "product6.jpeg", 0, 0],
    ["Sapphire", "A captivating 6-carat cut sapphire, showcasing deep blue hues and refined brilliance-ideal for a luxurious statement piece.", 10500.00, "product7.jpeg", 0, 0],
    ["Tanzanite", "Captivating 8-carat round-cut tanzanite, featuring a stunning blue-violet hue and exceptional clarity, perfect for any occasion.", 7500.00, "product8.jpeg", 1, 0],
    ["Aquamarine", "An exquisite 8-carat cut aquamarine, glowing with serene blue tones and timeless sophistication.", 90500.00, "product9.jpeg", 0, 0],
    ["Aquamarine Earrings", "Elegant aquamarine earrings, featuring soft blue gemstones that add a touch of calm and refined sparkle.", 5000.00, "product10.jpeg", 0, 1],
    ["Diamond Earrings", "Diamond earrings with a 22k gold band, radiating timeless elegance and brilliance for any occasion.", 7000.00, "product11.jpeg", 0, 1],
    ["Diamond Earrings", "Sparkling diamond earrings, radiating timeless elegance and brilliance for any occasion.", 8000.00, "product12.jpeg", 1, 0]
];

// Updated function to handle missing is_sale and is_featured
const addImageToProducts = (productData) => {
    return productData.map(([name, description, price, image, is_sale = 0, is_featured = 0]) => ({
        name,
        description,
        price,
        image,
        is_sale,
        is_featured,
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
                is_sale INTEGER NOT NULL DEFAULT 0,
                image TEXT
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
                `INSERT INTO products (name, description, price, image, is_sale, is_featured)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [product.name, product.description, product.price, product.image, product.is_sale, product.is_featured]
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
