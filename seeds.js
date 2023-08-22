const mongoose = require('mongoose');
const Product = require('./models/product')

/* Connect to MongoDB */
mongoose.connect('mongodb://127.0.0.1:27017/farmStand',
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Mongo Connection open!!");
    })
    .catch(err => {
        console.log("Mongo ERROR: " + err);
    })

/* const p = new Product({
    name: 'Grapefruit',
    price: 1.99,
    category: 'Fruit'
})
p.save().then(p => {
    console.log(p);
}) */

/* const seedProducts = [
    {
        name: 'Eggplant',
        price: 1.00,
        category: 'vegetable'
    }, {
        name: 'Melon',
        price: 4.99,
        category: 'fruit'
    }, {
        name: 'Watermelon',
        price: 3.99,
        category: 'fruit'
    }, {
        name: 'Celery',
        price: 1.50,
        category: 'vegetable'
    }, {
        name: 'Milk - Chocolate',
        price: 2.5,
        category: 'dairy'
    }
]

Product.insertMany(seedProducts)
    .then(res => {
        console.log(res);
    }).catch(err => {
        console.log(err);
    });  */