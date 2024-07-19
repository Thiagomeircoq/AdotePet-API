export interface Product {
    id: string;
    image: string;
    name: string;
    description: string;
    price: number;
    promotionalPrice: number | null;
    promotionStartDate: Date | null;
    promotionEndDate: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface ProductCreate {
    image?: string;
    name: string;
    description: string;
    price: number;
    promotionalPrice?: number | null;
    promotionStartDate?: Date | null;
    promotionEndDate?: Date | null;
}

export interface ProductUpdate extends ProductCreate {
    id: string;
}

export interface ProductRepository {
    create(data: ProductCreate): Promise<Product>;
    findAllProducts(): Promise<Product[]>;
    findById(id: string): Promise<Product | null>;
    deleteProduct(id: string): Promise<boolean>;
    updateProduct(data: ProductUpdate): Promise<Product>;
}