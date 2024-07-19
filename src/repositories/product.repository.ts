import { prisma } from "../database/prisma-client";
import { Product, ProductCreate, ProductUpdate, ProductRepository } from "../interface/products.interface";

class ProductRepositoryPrisma implements ProductRepository {

    async create(data: ProductCreate): Promise<Product> {
        const result = await prisma.product.create({
            data: {
                image: data.image ?? '',
                name: data.name,
                description: data.description,
                price: data.price,
                promotionalPrice: data.promotionalPrice ?? undefined,
                promotionStartDate: data.promotionStartDate ?? null,
                promotionEndDate: data.promotionEndDate ?? null
            },
        });

        return result;
    }

    async findAllProducts(): Promise<Product[]> {
        const result = await prisma.product.findMany();

        return result || null;
    }

    async findById(id: string): Promise<Product> {
        const result = await prisma.product.findFirst({
            where: { id }
        });

        if (!result) {
            throw new Error(`Product with id ${id} not found`);
        }

        return result;
    }

    async deleteProduct(id: string): Promise<boolean> {
        await this.findById(id);

        const result = await prisma.product.delete({
            where: {
                id
            },
        });

        return result ? true : false;
    }

    async updateProduct(data: ProductUpdate): Promise<Product> {
        await this.findById(data.id);

        const result = await prisma.product.update({
            where: {
                id: data.id
            },
            data: {
                image: data.image?? '',
                name: data.name,
                description: data.description,
                price: data.price,
                promotionalPrice: data.promotionalPrice?? undefined,
                promotionStartDate: data.promotionStartDate?? null,
                promotionEndDate: data.promotionEndDate?? null
            },
        });

        return result;
    }


}

export { ProductRepositoryPrisma };