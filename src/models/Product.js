class Product{
  constructor(product_id,product_name,description,price,category_name,stock_quantity,image_url,warranty,discount,created_at = new Date(),updated_at = new Date()){
    this.product_id = product_id;
    this.product_name = product_name;
    this.description = description;
    this.price = price;
    this.category_name = category_name;
    this.stock_quantity = stock_quantity;
    this.image_url = image_url;
    this.warranty = warranty;
    this.discount = discount;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  toFirestore(){
    return {
      product_name: this.product_name,
      description: this.description,
      price: this.price,
      category_name: this.category_name,
      stock_quantity: this.stock_quantity,
      image_url: this.image_url,
      warranty: this.warranty,
      discount: this.discount,
      created_at: this.created_at,
      updated_at: this.updated_at
    }
  }
}

export default Product;