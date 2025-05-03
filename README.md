# mock-file-upload
Mock app in Node.js that supports file uploads (500MB max. per file)

## Install dependencies
### 1. Automatic
Simply use
```shell
npm install
```
to install all dependencies listed in `package.json`.

### 2. Manual
Simply use
```shell
npm install express multer
```
to manually install dependencies. 
Express is used to statically serve uploads instead of using an API (for compatibility) and Multer is used to handle the uploading and filesystem access, along
with the file size limits.
