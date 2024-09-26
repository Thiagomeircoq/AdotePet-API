import { FastifyRequest } from 'fastify';
import fs from 'fs';
import path from 'path';
import { HttpError } from '../errors/HttpError';
import crypto from 'crypto';

// Tipagem para dados de arquivo
export interface FileData {
    filename: string;
    mimetype: string;
    encoding: string;
    buffer: Buffer;
    size: number;
}

// Tipagem para o resultado do parseMultipartData
export interface ParsedData {
    fields: Record<string, any>;
    files: FileData[];
}

/**
 * Processa a requisição multipart e retorna os campos e arquivos.
 * @param req Requisição Fastify
 * @returns Campos e arquivos processados
 */
export async function parseMultipartData(req: FastifyRequest): Promise<ParsedData> {
    const parts = req.parts(); // Função assíncrona que retorna partes da requisição multipart
    const fields: Record<string, any> = {};
    const files: FileData[] = [];

    // Itera sobre as partes da requisição (campos e arquivos)
    for await (const part of parts) {
        if (part.file) {
            const { buffer, size } = await getFileBuffer(part);
            files.push({
                filename: part.filename,
                mimetype: part.mimetype,
                encoding: part.encoding,
                buffer,
                size,
            });
        } else {
            fields[part.fieldname] = part.value;
        }
    }

    return { fields, files };
}

/**
 * Lê o conteúdo de um arquivo enviado em um multipart.
 * @param part Parte do arquivo enviada
 * @returns Buffer e tamanho do arquivo
 */
async function getFileBuffer(part: any): Promise<{ buffer: Buffer; size: number }> {
    const chunks: Buffer[] = [];
    let totalSize = 0;

    for await (const chunk of part.file) {
        chunks.push(chunk);
        totalSize += chunk.length;
    }

    return { buffer: Buffer.concat(chunks), size: totalSize };
}

/**
 * Salva o arquivo no servidor no caminho especificado.
 * @param file Dados do arquivo (filename, buffer, etc.)
 * @param uploadPath Caminho de destino no servidor
 * @returns Caminho onde o arquivo foi salvo
 */
export async function saveFile(file: FileData, uploadPath: string): Promise<string> {
    const savePath = path.join(uploadPath, file.filename);
    await fs.promises.writeFile(savePath, file.buffer);
    return savePath;
}

/**
 * Gera a URL completa de um arquivo de imagem a partir do nome do arquivo.
 * @param imageName Nome do arquivo de imagem
 * @returns URL completa da imagem
 */
export function getImageUrl(imageName: string): string {
    const baseUploadsUrl = process.env.UPLOADS_URL || '/uploads';
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    return `${baseUrl}${baseUploadsUrl}/${imageName}`;
}

/**
 * Valida o tipo de arquivo e o tamanho do arquivo enviado.
 * @param file Dados do arquivo (mimetype, size, etc.)
 * @param allowedTypes Tipos de arquivos permitidos (e.g., 'image/png', 'image/jpeg')
 * @param maxSize Tamanho máximo permitido do arquivo (em bytes)
 * @throws HttpError se o tipo ou tamanho do arquivo não for permitido
 */
export function validateFile(file: FileData, allowedTypes: string[], maxSize: number): void {
    if (!allowedTypes.includes(file.mimetype)) {
        throw new HttpError({ code: 400, message: `Tipo de arquivo não permitido: ${file.mimetype}. Permitido apenas PNG, JPG, JFIF.` });
    }

    if (file.size > maxSize) {
        throw new HttpError({ code: 400, message: `O arquivo ${file.filename} excede o tamanho máximo permitido de ${maxSize} bytes.` });
    }
}

/**
 * Gera um nome de arquivo encriptado com base no ID e no nome original do arquivo,
 *
 * @param id ID para associar ao arquivo
 * @param file Dados do arquivo a ser salvo
 * @param uploadPath Caminho no servidor onde o arquivo será salvo
 * @returns O nome final do arquivo salvo
 */
export async function saveEncryptedFile(id: string, file: FileData, uploadPath: string): Promise<string> {
    const encryptedUrl = crypto
        .createHash('sha256')
        .update(`${id}-${file.filename}`)
        .digest('hex');

    const fileExtension = path.extname(file.filename);

    const finalFileName = `${encryptedUrl}${fileExtension}`;

    await saveFile({ ...file, filename: finalFileName }, uploadPath);

    return finalFileName;
}