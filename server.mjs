import express from 'express';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();
const port = Number(process.env.PORT || 4174);
const root = dirname(fileURLToPath(import.meta.url));
const productDb = join(root, 'data', 'products.json');
const distDir = join(root, 'dist');

app.use(express.json());

app.get('/api/products', async (request, response) => {
  const products = JSON.parse(await readFile(productDb, 'utf8'));
  const { q = '', category = 'All' } = request.query;
  const query = String(q).trim().toLowerCase();

  const filtered = products.filter((product) => {
    const matchesCategory = category === 'All' || product.category === category;
    const searchable = [product.title, product.category, ...product.specs].join(' ').toLowerCase();
    return matchesCategory && (!query || searchable.includes(query));
  });

  response.json(filtered);
});

app.get('/api/products/:id', async (request, response) => {
  const products = JSON.parse(await readFile(productDb, 'utf8'));
  const product = products.find((item) => item.id === Number(request.params.id));
  if (!product) {
    response.status(404).json({ message: 'Product not found' });
    return;
  }
  response.json(product);
});

app.use(express.static(distDir));
app.use((request, response) => {
  response.sendFile(join(distDir, 'index.html'));
});

app.listen(port, '127.0.0.1', () => {
  console.log(`Amazone with Express API running at http://127.0.0.1:${port}`);
});
