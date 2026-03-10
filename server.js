const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8081;

const server = http.createServer((req, res) => {
    // Handle the PHP save endpoint specifically for local testing
    if (req.method === 'POST' && req.url === '/admin/save.php') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                // Verify valid JSON
                JSON.parse(body);
                fs.writeFileSync(path.join(__dirname, 'content', 'content.json'), body);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: 'Дані успішно збережено' }));
            } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Помилка збереження: ' + err.message }));
            }
        });
        return;
    }

    // Basic static file server
    let filePath = '.' + req.url;
    if (filePath == './') {
        filePath = './index.html';
    } else if (filePath.startsWith('./admin') && !filePath.includes('.')) {
        filePath = './admin/index.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.svg': 'image/svg+xml'
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code == 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 Not Found', 'utf-8');
            } else {
                res.writeHead(500);
                res.end('Sorry, error: ' + error.code + ' ..\\n');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`Test server running at http://127.0.0.1:${PORT}/`);
    console.log(`Admin panel: http://127.0.0.1:${PORT}/admin/index.html`);
});
