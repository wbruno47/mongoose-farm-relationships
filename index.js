const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const AppError = require('./AppError');


const Product = require('./models/product')
const Farm = require('./models/farm');
const { runInNewContext } = require('vm');

/* Connect to MongoDB */
mongoose.connect('mongodb://127.0.0.1:27017/farmStand2',
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Mongo Connection open!!");
    })
    .catch(err => {
        console.log("Mongo ERROR: " + err);
    })


app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))


//FARM ROUTES
app.get('/farms', async (req, res) => {
    const farms = await Farm.find({});
    res.render('farms/index', { farms });
})

app.get('/farms/new', (req, res) => {
    res.render('farms/new');
})

app.post('/farms/', async (req, res) => {
    const farm = new Farm(req.body);
    await farm.save();
    res.redirect('/farms');
})

app.get('/farms/:id', async (req, res) => {

    const { id } = req.params;
    const farm = await Farm.findById(id).populate('products');
    console.log(farm);
    if (!farm) {
        throw next(new AppError('Farm not Found', 404));
    }
    res.render('farms/show', { farm });
})

app.get('/farms/:id/products/new', async (req, res) => {
    const { id } = req.params;
    const farm = await Farm.findById(id);
    console.log(farm);
    res.render('products/new', { categories, farm });
})

app.post('/farms/:id/products', async (req, res) => {
    const { id } = req.params;
    const farm = await Farm.findById(id);
    const { name, price, category } = req.body;
    const product = new Product({ name, price, category });

    farm.products.push(product);
    product.farm = farm;

    await farm.save();
    await product.save();

    // res.send(farm);
    res.redirect(`/farms/${farm._id}`);
})

app.delete('/farms/:id', async (req, res) => {
    await Farm.findByIdAndDelete(req.params.id);
    res.redirect('/farms');
})
// PRODUCT ROUTES
const categories = ['fruit', 'vegetable', 'dairy']

app.get('/products', async (req, res, next) => {
    try {
        const { category } = req.query;
        if (category) {
            console.log(category);
            const products = await Product.find({ category });
            res.render('products/index', { products, category });
        } else {
            const products = await Product.find({});
            res.render('products/index', { products, category: "All" });
        }
    } catch (e) {
        next(e);
    }
})

app.get('/products/new', (req, res) => {
    res.render('products/new', { categories });
})

app.post('/products', wrapAsync(async (req, res, next) => {
    //console.log(req.body);
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.redirect(`/products/${newProduct._id}`);

}))

function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(e => next(e));
    }
}

app.get('/products/:id', wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id).populate('farm', 'name');;
    console.log(product);
    if (!product) {
        throw next(new AppError('Product not Found', 404));
    }
    res.render('products/show', { product });
}))

app.get('/products/:id/edit', wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    console.log(product);
    if (!product) {
        return next(new AppError('Product not Found', 404));
    }
    res.render('products/edit', { product, categories });

}))

app.put('/products/:id', wrapAsync(async (req, res, next) => {
    console.log(req.body);
    const { id } = req.params;
    const editProduct = await Product.findByIdAndUpdate(id, req.body, { runValidators: true });
    res.redirect(`/products/${editProduct._id}`)
}))

app.delete('/products/:id', wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const deleteProduct = await Product.findByIdAndDelete(id);
    res.redirect('/products');
}))



app.use((err, req, res, next) => {
    const { status = 500, message = 'Something went wrong' } = err;
    res.status(status).send(message);
})

app.listen(3000, () => {
    console.log("APP IS LISTENING ON PORT 3000");
})