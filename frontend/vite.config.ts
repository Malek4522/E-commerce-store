import { vitePlugin as remix } from '@remix-run/dev';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { netlifyPlugin } from '@netlify/remix-adapter/plugin';

export default defineConfig({
    plugins: [
        remix({
            future: {
                v3_fetcherPersist: true,
                v3_lazyRouteDiscovery: true,
                v3_relativeSplatPath: true,
                v3_singleFetch: true,
                v3_throwAbortReason: true,
            },
            ignoredRouteFiles: ['**/*.module.scss'],
        }),
        netlifyPlugin(),
        tsconfigPaths(),
    ],
    resolve: {
        alias: { '~': __dirname },
    },
    optimizeDeps: {
        include: ['@radix-ui/react-select', '@radix-ui/react-slider'],
    },
    css: { preprocessorOptions: { scss: { api: 'modern' } } },
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.endsWith('.css') || id.endsWith('.scss')) {
                        return 'styles';
                    }
                },
            },
        },
    },
});
