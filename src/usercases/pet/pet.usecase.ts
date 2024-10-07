import { CreatePetDTO, CreatePetImageDTO, PetRepository, UpdatePetDTO } from "../../interface/pet/pet.interface";
import { PetRepositoryPrisma } from "../../repositories/pet/pet.repository";
import { HttpError } from "../../errors/HttpError";
import { BreedRepository } from "../../interface/breed/breed.interface";
import { SpecieRepository } from "../../interface/specie/specie.interface";
import { SpecieRepositoryPrisma } from "../../repositories/specie/specie.repository";
import { BreedRepositoryPrisma } from "../../repositories/breed/breed.repository";
import { getImageUrl } from "../../utils/formHandle";

class PetUseCase {
    private petRepository: PetRepository
    private breedRepository: BreedRepository;
    private speciesRepository: SpecieRepository;

    constructor() {
        this.petRepository = new PetRepositoryPrisma;
        this.breedRepository = new BreedRepositoryPrisma;
        this.speciesRepository = new SpecieRepositoryPrisma;
    }

    async findById(id: string) {
        if (!id)
            throw new HttpError({ code: 400, message: 'Pet ID is required.' });

        const pet = await this.petRepository.findById(id);

        if (!pet)
            throw new HttpError({ code: 404, message: `Pet with ID ${id} not found.` });

        return {
            ...pet,
            images: pet.images.map(image => ({
                image_url: getImageUrl(image.image_url)
            })),
        };
    }

    async findAll() {
        const pets = await this.petRepository.findAll();
    
        if (!pets) {
            throw new HttpError({ code: 404, message: 'No Pets found.' });
        }
    
        const petsWithImages = pets.map(pet => ({
            ...pet,
            images: pet.images.map(image => ({
                image_url: getImageUrl(image.image_url)
            })),
        }));
    
        return petsWithImages;
    }

    async create(data: CreatePetDTO) {
        const { specie_id, breed_id } = data;

        const speciesExists = await this.speciesRepository.findById(specie_id);
        if (!speciesExists)
            throw new HttpError({ code: 404, message: `Species with ID ${specie_id} not found.` });

        if (breed_id) {
            const breedExists = await this.breedRepository.findById(breed_id);

            if (!breedExists)
                throw new HttpError({ code: 404, message: `Breed with ID ${breed_id} not found.` });

            const breedBelongsToSpecies = await this.breedRepository.belongsToSpecies(breed_id, specie_id);
            if (!breedBelongsToSpecies)
                throw new HttpError({ code: 400, message: `Breed with ID ${breed_id} does not belong to Species with ID ${specie_id}.` });
        }

        return await this.petRepository.create(data);
    }

    async update(data: UpdatePetDTO) {
        const { id, specie_id, breed_id } = data;
    
        const petExists = await this.findById(id);
        
        const speciesExists = await this.speciesRepository.findById(specie_id);
        if (!speciesExists) {
            throw new HttpError({ code: 404, message: `Species with ID ${specie_id} not found.` });
        }
    
        let effectiveBreedId: string | undefined;
        if (breed_id) {
            const breedExists = await this.breedRepository.findById(breed_id);
            if (!breedExists) {
                throw new HttpError({ code: 404, message: `Breed with ID ${breed_id} not found.` });
            }
            effectiveBreedId = breed_id;
        } else {
            effectiveBreedId = petExists.breed?.id;
        }
    
        if (effectiveBreedId) {
            const breedBelongsToSpecies = await this.breedRepository.belongsToSpecies(effectiveBreedId, specie_id);
            if (!breedBelongsToSpecies) {
                throw new HttpError({ code: 400, message: `Breed with ID ${effectiveBreedId} does not belong to Species with ID ${specie_id}.` });
            }
        }
        
        const pet = await this.petRepository.update(data);

        return {
            ...pet,
            images: pet.images.map(image => ({
                image_url: getImageUrl(image.image_url)
            })),
        };
    }

    async filterPets(filters: Record<string, any>) {
        const { name, species, breeds, sizes, colors, gender } = filters;
    
        const filterConditions: Record<string, any> = {};
    
        if (name) {
            filterConditions.name = { contains: name, mode: 'insensitive' };
        }
    
        if (species && species.length) {
            filterConditions.species_id = { in: species };
        }
    
        if (breeds && breeds.length) {
            filterConditions.breed_id = { in: breeds };
        }
    
        if (sizes && sizes.length) {
            filterConditions.size = { in: sizes };
        }
    
        if (colors && colors.length) {
            filterConditions.color = { in: colors };
        }
    
        if (gender && gender.length) {
            filterConditions.gender = { in: Array.isArray(gender) ? gender : [gender] };
        }
    
        const filteredPets = await this.petRepository.findWithFilters(filterConditions);
    
        if (!filteredPets) return null;
    
        const petsWithImages = filteredPets.map(pet => ({
            ...pet,
            images: pet.images.map(image => ({
                image_url: getImageUrl(image.image_url)
            })),
        }));
    
        return petsWithImages;
    }

    async saveImage(data: CreatePetImageDTO) {
        const { pet_id } = data;

        await this.findById(pet_id);

        return await this.petRepository.saveImage(data);
    }

    async delete(id: string) {
        await this.findById(id);

        await this.petRepository.delete(id);

        return { message: 'Pet successfully deleted' };
    }

}

export { PetUseCase };