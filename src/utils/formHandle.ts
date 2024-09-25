import { FastifyRequest } from 'fastify';
import fs from 'fs';
import path from 'path';

export interface FileData {
    filename: string;
    mimetype: string;
    encoding: string;
    buffer: Buffer;
    size: number;
}

export interface ParsedData {
    fields: Record<string, any>;
    files: FileData[];
}

/**
 * Processa a requisição multipart e retorna os campos e arquivos.
 */
export async function parseMultipartData(req: FastifyRequest): Promise<ParsedData> {
    const parts = req.parts(); // Assíncrono
    const fields: Record<string, any> = {};
    const files: FileData[] = [];

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
 * Função auxiliar para ler o conteúdo do arquivo enviado e calcular o tamanho.
 */
async function getFileBuffer(part: any): Promise<{ buffer: Buffer; size: number }> {
    const chunks: Buffer[] = [];
    let totalSize = 0; // Inicializa o tamanho do arquivo

    for await (const chunk of part.file) {
        chunks.push(chunk);
        totalSize += chunk.length; // Soma o tamanho de cada chunk
    }

    return { buffer: Buffer.concat(chunks), size: totalSize };
}

/**
 * Função auxiliar para salvar o arquivo no servidor.
 */
export async function saveFile(file: FileData, uploadPath: string): Promise<string> {
    const savePath = path.join(uploadPath, file.filename);
    await fs.promises.writeFile(savePath, file.buffer);
    return savePath;
}
