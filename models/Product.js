// Define the schema
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 10
  },
  description: {
    type: String,
    minlength: 4,
    maxlength: 20
  },
  price: {
    type: mongoose.Types.Decimal128,
    required: true,
    validate: {
      validator: function (v) {
        return v.toString().replace('.', '').length <= 6;
      },
      message: props => `${props.value} exceeds the maximum allowed 6 digits (excluding decimal point)`
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdOn: {
    type: Date,
    default: Date.now
  }
});

// Create the model
const Product = mongoose.model('Product', productSchema);

module.exports = Product;