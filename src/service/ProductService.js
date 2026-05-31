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

  static async updateProduct(productId, productData) {
    try {
      const productRef = db.collection("products").doc(productId);
      const productDoc = await productRef.get();

      if (!productDoc.exists) {
        throw new Error("Product not found");
      }

      const updatedData = {
        ...productDoc.data(),
        ...productData,
        updated_at: new Date()
      };

      await productRef.update(updatedData);
      return {
        success: true,
        message: "Product updated successfully",
        product: {
          product_id: productId,
          ...updatedData
        }
      };
    } catch (error) {
      throw new Error(error.message, "Fail to update product");
    }
  }

  static async deleteProduct(productId) {
    try {
      const productRef = db.collection("products").doc(productId);
      const productDoc = await productRef.get();

      if (!productDoc.exists) {
        throw new Error("Product not found");
      }

      await productRef.delete();
      return {
        success: true,
        message: "Product deleted successfully"
      };
    } catch (error) {
      throw new Error(error.message, "Fail to delete product");
    }
  }

  static async getAllProducts() {
    try {
      const productsSnapshot = await db.collection("products").get();
      const products = productsSnapshot.docs.map(doc => ({
        product_id: doc.id,
        ...doc.data()
      }));
      return {
        success: true,
        products
      };
    } catch (error) {
      throw new Error(error.message, "Fail to retrieve products");
    }
  }

  static async getProductById(productId) {
    try {
      const productRef = db.collection("products").doc(productId);
      const productDoc = await productRef.get();

      if (!productDoc.exists) {
        throw new Error("Product not found");
      }

      return {
        success: true,
        product: {
          product_id: productDoc.id,
          ...productDoc.data()
        }
      };
    } catch (error) {
      throw new Error(error.message, "Fail to retrieve product");
    }
  }
}

export default ProductService;