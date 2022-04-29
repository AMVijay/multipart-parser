import { MultipartParser } from "./multipart-parser";

export function parse(multipartBody: Buffer, boundary: string) {
    const mulpartParser: MultipartParser = new MultipartParser();
    return mulpartParser.parse(multipartBody, boundary);
}
