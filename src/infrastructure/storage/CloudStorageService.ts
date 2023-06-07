import { Storage, type UploadOptions } from "@google-cloud/storage"
import path from "path"

export interface CloudStorageService {
    uploadFile: (
        file: Express.Multer.File,
        folderName: string
    ) => Promise<string>
}

export class GoogleCloudStorageService implements CloudStorageService {
    private readonly storage: Storage
    private readonly bucketName: string

    constructor (bucketName: string) {
        const keyPath = path.join(
            __dirname,
            "../../../credentials/credential.json"
        )
        console.log("key path", keyPath)

        this.storage = new Storage({
            keyFilename: keyPath
        })
        this.bucketName = bucketName
    }

    async uploadFile (
        file: Express.Multer.File,
        folderName: string
    ): Promise<string> {
        const { originalname, mimetype } = file

        // Generate nama file unik
        const fileName =
            folderName + "/" + Date.now().toString() + "-" + originalname

        const options: UploadOptions = {
            gzip: true, // Menyematkan gzip compression
            metadata: {
                contentType: mimetype
            }
        }

        await this.storage.bucket(this.bucketName).upload(file.path, {
            destination: fileName,
            ...options
        })
        // Mengatur akses file menjadi publik
        await this.storage.bucket(this.bucketName).file(fileName).makePublic()

        // Mengembalikan URL publik file yang di-upload
        const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${fileName}`
        console.log(publicUrl)
        return publicUrl
    }
}
