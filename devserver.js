import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, extname } from 'node:path';

const MIME = {
    '.html': 'text/html',
    '.js':   'application/javascript',
    '.css':  'text/css',
    '.json': 'application/json',
};

const server = createServer(async (req, res) => {
    const url = req.url.split('?')[0];

    const filePath = url.startsWith('/dist/')
        ? join(process.cwd(), url)
        : join(process.cwd(), 'app', url === '/' ? '/index.html' : url);

    try {
        const data = await readFile(filePath);
        const mime = MIME[extname(filePath)] ?? 'text/plain';
        res.writeHead(200, { 'Content-Type': mime });
        res.end(data);
    } catch {
        // SPA fallback solo para rutas sin extensión (history mode)
        if (extname(url) === '') {
            try {
                const data = await readFile(join(process.cwd(), 'app', 'index.html'));
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            } catch {
                res.writeHead(404);
                res.end('Not found');
            }
        } else {
            res.writeHead(404);
            res.end('Not found');
        }
    }
});

server.listen(3000, () => console.log('Dev server: http://localhost:3000'));
