import { FastifyInstance } from "fastify";
import { HttpError } from "../../errors/HttpError";
import { CreatePetDTO } from "../../interface/pet/pet.interface";
import { petJsonSchema, PetSchema } from "../../schemas/pet/pet.schema";
import { formatZodError } from "../../errors/ZoodError";
import { PetUseCase } from "../../usercases/pet/pet.usecase";
import { parseMultipartData, saveFile } from "../../utils/formHandle";
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';

export async function petRoutes(fastify: FastifyInstance) {
    const petUseCase = new PetUseCase();

    fastify.get<{ Params: { id: string } }>('/:id', {
        schema: {
            description: 'Obtém um pet pelo ID',
            tags: ['Pet'],
            params: {
                type: 'object',
                properties: {
                    id: { type: 'string', description: 'ID do pet' }
                },
                required: ['id']
            },
            response: {
                200: {
                    description: 'Pet encontrado',
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        color: { type: 'string' },
                        size: { type: 'string' },
                        age: { type: 'number' },
                        gender: { type: 'string' },
                        species: {
                            type: 'object',
                            properties: {
                                id: { type: 'string' },
                                name: { type: 'string' }
                            }
                        },
                        breed: {
                            type: 'object',
                            properties: {
                                id: { type: 'string' },
                                name: { type: 'string' }
                            }
                        },
                        images: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    image_url: { type: 'string' }
                                }
                            }
                        },
                        created_at: { type: 'string', format: 'date-time' },
                        updated_at: { type: 'string', format: 'date-time' },
                    }
                },
                404: {
                    description: 'Pet não encontrado',
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                },
                500: {
                    description: 'Erro interno do servidor',
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                }
            }
        },
        handler: async (req, reply) => {
            const { id } = req.params;

            try {
                const pet = await petUseCase.findById(id);

                return reply.send(pet);
            } catch (error) {
                if (error instanceof HttpError) {
                    return reply.status(error.code).send({ message: error.message });
                } else if (error instanceof Error) {
                    return reply.status(500).send({ message: error.message });
                } else {
                    return reply.status(500).send({ message: 'Unknown error occurred' });
                }
            }
        }
    });

    fastify.get<{ Params: { id: string } }>('/', {
        schema: {
            description: 'Obtém todos os Pets',
            tags: ['Pet'],
            response: {
                200: {
                    description: 'Lista de pets encontradas',
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            name: { type: 'string' },
                            color: { type: 'string' },
                            size: { type: 'string' },
                            age: { type: 'number' },
                            gender: { type: 'string' },
                            species: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string' },
                                    name: { type: 'string' }
                                }
                            },
                            breed: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string' },
                                    name: { type: 'string' }
                                }
                            },
                            images: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        image_url: { type: 'string' }
                                    }
                                }
                            },
                            created_at: { type: 'string', format: 'date-time' },
                            updated_at: { type: 'string', format: 'date-time' },
                        }
                    }
                },
                404: {
                    description: 'Pets não encontrados',
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                },
                500: {
                    description: 'Erro interno do servidor',
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                }
            }
        },
        handler: async (req, reply) => {
            const { id } = req.params;

            try {
                const pet = await petUseCase.findAll();

                return reply.send(pet);
            } catch (error) {
                if (error instanceof HttpError) {
                    return reply.status(error.code).send({ message: error.message });
                } else if (error instanceof Error) {
                    return reply.status(500).send({ message: error.message });
                } else {
                    return reply.status(500).send({ message: 'Unknown error occurred' });
                }
            }
        }
    });

    fastify.post<{ Body: CreatePetDTO }>('/', {
        schema: {
            description: 'Cadastra um novo PET',
            tags: ['Pet'],
            consumes: ['multipart/form-data'],
            response: {
                201: {
                    description: 'Pet criado com sucesso',
                    type: 'object',
                    properties: {
                        message: { type: 'string' },
                        pet: {
                            type: 'object',
                            properties: {
                                id: { type: 'string' },
                                name: { type: 'string' },
                                species_id: { type: 'string' },
                                breed_id: { type: 'string' },
                                color: { type: 'string' },
                                size: { type: 'string' },
                                age: { type: 'number' },
                                gender: { type: 'string' },
                                created_at: { type: 'string', format: 'date-time' },
                                updated_at: { type: 'string', format: 'date-time' },
                                species: {
                                    type: 'object',
                                    properties: {
                                        id: { type: 'string' },
                                        name: { type: 'string' }
                                    }
                                },
                                breed: {
                                    type: 'object',
                                    properties: {
                                        id: { type: 'string' },
                                        name: { type: 'string' },
                                        species_id: { type: 'string' }
                                    }
                                },
                                images: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            image_url: { type: 'string' }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                409: {
                    description: 'Erro de conflito',
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                },
                422: {
                    description: 'Erro de validação',
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                },
                500: {
                    description: 'Erro interno do servidor',
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                }
            }
        },
        handler: async (req, reply) => {
            try {
                const { fields, files } = await parseMultipartData(req);

                const uploadPath = path.join(process.cwd(), 'src', 'uploads');
                if (!fs.existsSync(uploadPath)) {
                    fs.mkdirSync(uploadPath, { recursive: true });
                }

                const allowedTypes = ['image/png', 'image/jpeg', 'application/octet-stream', 'image/jpg', 'image/jfif'];
                const maxSize = 5 * 1024 * 1024;

                const petData = {
                    name: fields.name,
                    specie_id: fields.specie_id,
                    breed_id: fields.breed_id,
                    color: fields.color,
                    size: fields.size,
                    age: parseInt(fields.age, 10),
                    gender: fields.gender,
                };

                const pet = await petUseCase.create(petData);

                const savedFiles = [];
                for (const file of files) {
                    if (!allowedTypes.includes(file.mimetype)) {
                        return reply.status(400).send({ message: `Tipo de arquivo não permitido: ${file.mimetype}. Permitido apenas PNG, JPG, JFIF.` });
                    }
                
                    if (file.size > maxSize) {
                        return reply.status(400).send({ message: `O arquivo ${file.filename} excede o tamanho máximo permitido de 5MB.` });
                    }

                    const encryptedUrl = crypto
                        .createHash('sha256')
                        .update(`${pet.id}-${file.filename}`)
                        .digest('hex');

                    const fileExtension = path.extname(file.filename);

                    const finalFileName = `${encryptedUrl}${fileExtension}`;
                
                    const filePath = await saveFile({ ...file, filename: finalFileName }, uploadPath);
                    
                    savedFiles.push({ image_url: filePath });
                
                    await petUseCase.saveImage({
                        pet_id: pet.id,
                        image_url: finalFileName,
                    });
                }

                return reply.status(201).send({
                    message: 'Pet cadastrado com sucesso!',
                    pet: {
                        ...pet,
                        images: savedFiles
                    }
                });
            } catch (error) {
        
                if (error instanceof HttpError) {
                    return reply.status(error.code).send({ message: error.message });
                } else if (error instanceof Error) {
                    return reply.status(500).send({ message: error.message });
                } else {
                    return reply.status(500).send({ message: 'Unknown error occurred' });
                }
            }
        }
    });

    fastify.put<{ Body: CreatePetDTO , Params: { id: string}}>('/:id', {
        schema: {
            description: 'Atualiza o pet pelo ID',
            tags: ['Pet'],
            body: petJsonSchema,
            params: {
                type: 'object',
                properties: {
                    id: { type: 'string', description: 'ID do pet' }
                },
                required: ['id']
            },
            response: {
                200: {
                    description: 'Pet atualizado com sucesso',
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        color: { type: 'string' },
                        size: { type: 'string' },
                        age: { type: 'number' },
                        gender: { type: 'string' },
                        species: {
                            type: 'object',
                            properties: {
                                id: { type: 'string' },
                                name: { type: 'string' }
                            }
                        },
                        breed: {
                            type: 'object',
                            properties: {
                                id: { type: 'string' },
                                name: { type: 'string' }
                            }
                        },
                        created_at: { type: 'string', format: 'date-time' },
                        updated_at: { type: 'string', format: 'date-time' },
                    }
                },
                409: {
                    description: 'Erro de conflito',
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                },
                422: {
                    description: 'Erro de validação',
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                },
                500: {
                    description: 'Erro interno do servidor',
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                }
            }
        },
        preHandler: async (req, reply) => {
            const result = PetSchema.safeParse(req.body);
        
            if (!result.success) {
                return reply.status(422).send({ message: formatZodError(result.error) });
            }
        
            req.body = result.data;
        },
        handler: async (req, reply) => {
            const { id } = req.params;
            
            const dataBody = {...req.body, id: id}
        
            try {
                const breed = await petUseCase.update(dataBody);

                return reply.status(200).send(breed);
            } catch (error) {
        
                if (error instanceof HttpError) {
                    return reply.status(error.code).send({ message: error.message });
                } else if (error instanceof Error) {
                    return reply.status(500).send({ message: error.message });
                } else {
                    return reply.status(500).send({ message: 'Unknown error occurred' });
                }
            }
        }
    });
}
