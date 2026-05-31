import ProductService from '../service/ProductService.js';

class ProductController {
  static async addProduct(req, res) {
    try {
      const productData = {
        ...req.body,
        image_url: req.file.path
      };
      const product = await ProductService.addProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default ProductController;