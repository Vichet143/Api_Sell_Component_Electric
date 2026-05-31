import { db } from "../config/database.js";
import Product from "../models/Product.js";
import RequiredField from "../utils/RequiredField.js";

class ProductService {
  static async addProduct(productData) {
    try {
      RequiredField(productData.product_name, "Product Name");
      RequiredField(productData.price, "Product Price");
      RequiredField(productData.category_name, "Category Name");
      RequiredField(productData.stock_quantity, "Stock Quantity");
      RequiredField(productData.image_url, "Image URL");
      RequiredField(productData.warranty, "Warranty");
      RequiredField(productData.discount, "Discount");
      RequiredField(productData.description, "Description");

      const product = new Product(
        null,
        productData.product_name,
        productData.description,
        productData.price,
        productData.category_name,
        productData.stock_quantity,
        productData.image_url,
        productData.warranty,
        productData.discount
      );

      const productRef = await db.collection("products").add(product.toFirestore());
      const productDoc = await productRef.get();
      return {
        success: true,
        message: "Product added successfully",
        product: {
          product_id: productRef.id,
          ...productDoc.data()
        }
      };
    } catch (error) {
      throw new Error(error.message, "Fail to add product");
    }
  }
}

export default ProductService;