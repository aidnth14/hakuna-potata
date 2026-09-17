import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'node:path'

// Local dev middleware to handle /api/send-order in development
function localApiPlugin() {
  return {
    name: 'local-api-send-order',
    configureServer(server: any) {
      const env = loadEnv('development', process.cwd(), '');
      Object.assign(process.env, env);

      server.middlewares.use(async (req: any, res: any, next: any) => {
        if (req.url === '/api/send-order' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: any) => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              const parsed = JSON.parse(body || '{}');
              // @ts-ignore
              const { default: handler } = await import('./api/send-order.js');
              const fakeRes = {
                status(code: number) {
                  res.statusCode = code;
                  return this;
                },
                json(data: any) {
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify(data));
                  return this;
                },
              };
              await handler({ method: 'POST', body: parsed }, fakeRes);
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }
        next();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    localApiPlugin(),
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    allowedHosts: true, // Allow all hosts including cloudflared & local IP
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        order: resolve(import.meta.dirname, 'order/index.html'),
      },
    },
  },
})
