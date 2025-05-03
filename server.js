const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Set up multer storage configuration to save the file with its original name
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // File upload directory
    },
    filename: (req, file, cb) => {
        // Check if a file with the same name already exists
        const filePath = path.join('uploads', file.originalname);
        if (fs.existsSync(filePath)) {
            // If file already exists, pass an error to multer
            return cb(new Error('File with the same name already exists. Please rename your file and try again.'));
        }
        cb(null, file.originalname); // Save file with its original name
    }
});

// Set up multer upload middleware with a 500MB file size limit and multiple files support
const upload = multer({
    storage: storage,
    limits: { fileSize: 500 * 1024 * 1024 }, // 500MB limit per file
}).array('files', 5); // Allow multiple files (up to 5 files)

// Serve static files from the 'uploads' folder correctly by using __dirname
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Route to handle file uploads
app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            if (err instanceof multer.MulterError) {
                // Handle Multer-specific errors
                return res.send(`Multer Error: ${err.message}`);
            } else {
                // Handle other errors (like duplicate file)
                return res.send(`Error: ${err.message}`);
            }
        }

        // If upload is successful, redirect to the root page
        res.redirect('/');
    });
});

// Serve the file upload form and list the files in the 'uploads' directory
app.get('/', (req, res) => {
    // Read all files in the 'uploads/' directory
    fs.readdir('uploads', (err, files) => {
        if (err) {
            return res.send("Error reading uploads directory.");
        }

        let fileListHtml = '<h2>Uploaded Files:</h2><ul>';
        files.forEach(file => {
            fileListHtml += `<li><a href="/uploads/${file}" target="_blank">${file}</a></li>`;
        });
        fileListHtml += '</ul>';

        // Send the form and the list of uploaded files
        res.send(`
            <h2>Upload Files (Multiple files, up to 500MB per file)</h2>
            <form action="/upload" method="POST" enctype="multipart/form-data">
                <input type="file" name="files" multiple required>
                <button type="submit">Upload Files</button>
            </form>
            ${fileListHtml}
        `);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
