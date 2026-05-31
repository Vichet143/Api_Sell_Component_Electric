import ProductService from '../service/ProductService.js';

class ProductController {
  static async addProduct(req, res) {
    try {
      const imageUrl = req.file?.path || req.body.image_url;

      if (!imageUrl) {
        return res.status(400).json({ error: "Image is required" });
      }

      const productData = {
        ...req.body,
        image_url: imageUrl
      };
      const product = await ProductService.addProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async updateProduct(req, res) {
    try {
      const productId = req.query.id;
      const imageUrl = req.file?.path || req.body.image_url;
      const productData = {
        ...req.body
      };

      if (imageUrl) {
        productData.image_url = imageUrl;
      }

      const updatedProduct = await ProductService.updateProduct(productId, productData);
      res.status(200).json(updatedProduct);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteProduct(req, res) {
    try {
      const productId = req.query.id;
      const deletedProduct = await ProductService.deleteProduct(productId);
      res.status(200).json(deletedProduct);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getAllProducts(req, res) {
    try {
      const products = await ProductService.getAllProducts();
      res.status(200).json(products);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getProductById(req, res) {
    try {
      const productId = req.query.id;
      const product = await ProductService.getProductById(productId);
      res.status(200).json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default ProductController;