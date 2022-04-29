type MultipartContent = {
    contentType: string;
    content: Buffer;
    fileName: string;
    name: string;
}

const CONTENT_TYPE: string = "Content-Type";
const CONTENT_DISPOSITION: string = "Content-Disposition";

export class MultipartParser {

    public parse(multipartBody: Buffer, boundary: string): MultipartContent[] {

        let multipartArray: MultipartContent[] = [];

        let boundaryHeaderStarted = false;
        let boundaryContentStarted = false;
        let lastlineBytes: number[] = [];

        let content: number[] = []
        let multipartElement = this.createNewMultipart();

        for (let i = 0; i < multipartBody.length; i++) {
            let byteContent = multipartBody[i];
            // Line Feed Check or End of Line Check
            if (byteContent === 0x0a) {
                let lineContent = Buffer.from(lastlineBytes).toString();
                // Check boundary started
                if (!boundaryHeaderStarted && lineContent.indexOf(boundary) !== -1) {
                    // Check boundaryContent is available 
                    if (boundaryContentStarted) {
                        multipartElement.content = Buffer.from(content);
                        multipartArray.push(multipartElement)
                        multipartElement = this.createNewMultipart();
                        content = []
                    }
                    boundaryHeaderStarted = true
                    boundaryContentStarted = false
                } else if (boundaryHeaderStarted) {
                    this.parseBoundaryHeaderContent(lineContent, multipartElement);
                    // Check the emptyline after Boundary Header Started
                    if (lineContent.length === 1) {
                        boundaryHeaderStarted = false
                        boundaryContentStarted = true
                    }
                } else if (boundaryContentStarted) {
                    content.push(...lastlineBytes)
                    content.push(byteContent)
                }

                lastlineBytes = []
            }
            else {
                lastlineBytes.push(byteContent);
            }
        }

        return multipartArray;

    }

    private parseBoundaryHeaderContent(lineContent: string, multipartElement: MultipartContent) {
        if (lineContent.indexOf(CONTENT_TYPE) != -1) {
            multipartElement.contentType = lineContent.split(':')[1].trim()
        } else if (lineContent.indexOf(CONTENT_DISPOSITION) != -1) {
            let nameContent = lineContent.split('=')[1];
            multipartElement.name = nameContent.substring(1, nameContent.indexOf('"', 1));

            let fileNameContent = lineContent.split("=")[2];
            if (fileNameContent) {
                multipartElement.fileName = fileNameContent.substring(1, fileNameContent.indexOf('"', 1));
            }

        }
    }

    private createNewMultipart(): MultipartContent {
        return {
            contentType: '',
            content: Buffer.alloc(0),
            fileName: '',
            name: ''
        };
    }

}