import { defineConfig } from 'vite';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

export default defineConfig({
    base: '/web-sintiasgraphy-sintia/',
    plugins: [
        ViteImageOptimizer({
            png: {
                quality: 70,
            },
        }),
    ],
});