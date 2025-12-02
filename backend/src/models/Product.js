import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true, index: true },
  name: { type: String, required: true, trim: true },
  sku: { type: String, trim: true },
  barcode: { type: String, trim: true },
  costPrice: { type: Number, default: 0, min: 0 },
  sellingPrice: { type: Number, default: 0, min: 0 },
  stock: { type: Number, default: 0, min: 0 },
  unit: { type: String, default: 'pcs' },
  lowStockThreshold: { type: Number, default: 5 },
}, { timestamps: true });

ProductSchema.index({ businessId: 1, barcode: 1 }, { unique: true, sparse: true });

ProductSchema.pre('save', function (next) {
  if (this.sellingPrice < this.costPrice) {
    return next(new Error('Selling price cannot be lower than cost price'));
  }
  next();
});

export default mongoose.model('Product', ProductSchema);
