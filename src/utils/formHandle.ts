import { FastifyRequest } from 'fastify';
import fs from 'fs';
import path from 'path';

export interface FileData {
    filename: string;
    mimetype: string;
    encoding: string;
    buffer: Buffer;
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
        const fileBuffer = await getFileBuffer(part);
        files.push({
            filename: part.filename,
            mimetype: part.mimetype,
            encoding: part.encoding,
            buffer: fileBuffer,
        });
        } else {
        fields[part.fieldname] = part.value;
        }
    }

  return { fields, files };
}

/**
 * Função auxiliar para ler o conteúdo do arquivo enviado.
 */
async function getFileBuffer(part: any): Promise<Buffer> {
    const chunks: Buffer[] = [];
    for await (const chunk of part.file) {
        chunks.push(chunk);
    }
    return Buffer.concat(chunks);
}

/**
 * Função auxiliar para salvar o arquivo no servidor.
 */
export async function saveFile(file: FileData, uploadPath: string): Promise<string> {
    const savePath = path.join(uploadPath, file.filename);
    await fs.promises.writeFile(savePath, file.buffer);
    return savePath;
}
