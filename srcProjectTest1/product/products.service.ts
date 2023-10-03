import { Injectable , NotFoundException } from "@nestjs/common";
import { Product } from "./products.model";
@Injectable()
export class ProductsService {
	products: Product[] = [];

	insertProduct(title:string, desc: string, price: number) {
		const newId = Math.random().toString();
		const newProduct = new Product(newId, title, desc, price)
		this.products.push(newProduct);
		return newId;
	}

	getProducts() {
		return [...this.products];
	}
	getSingleProduct(productId:string){
		const product = this.FindProductEIndex(productId)[0]
		return {...product};
	}
	updateProduct(prodId: string, newTitle: string, prodPrice:number ,prodDesc: string) {
		const [product, index] = this.FindProductEIndex(prodId);
		const updateProduct = {...product};
		if (newTitle) {
			updateProduct.title = newTitle;
		}
		if (prodPrice){
			updateProduct.price = prodPrice;
		}
		if (prodDesc) {
			updateProduct.description = prodDesc;
		}
		this.products[index] = updateProduct;
	}

	deleteProduct(prodId: string) {
		const index = this.FindProductEIndex(prodId)[1];
		this.products.splice(index, 1);
	}
	private FindProductEIndex(prodId: string): [Product, number] {
		const productIndex = this.products.findIndex((prod => prod.id === prodId))
		const product = this.products[productIndex];
		if (!product) {
			throw new NotFoundException("Could not find the product asked");
		}
		return [product, productIndex];
	}
}
