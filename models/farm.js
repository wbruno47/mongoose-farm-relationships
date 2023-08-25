const mongoose = require('mongoose');
const Product = require('./product');
const { Schema } = mongoose;

const farmSchema = new Schema({
    name: {
        type: String,
        require: [true, 'Farm must have a name']
    },
    city: {
        type: String
    },
    email: {
        type: String,
        required: [true, 'Email is require']
    },
    products: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        }
    ]
})

farmSchema.post('findOneAndDelete', async function (farm) {
    console.log(farm);
    if (farm.products.length) {
        const res = Product.deleteMany({ _id: { $in: farm.products } });
        console.log(res);
    }
})


const Farm = mongoose.model('Farm', farmSchema);
module.exports = Farm;

