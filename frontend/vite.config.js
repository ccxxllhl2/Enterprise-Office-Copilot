import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// API 反向代理：本地开发(dev)和生产预览(preview)共用
const proxy = {
  // Agent 服务
  '/api/chat': {
    target: 'http://localhost:3000',
    changeOrigin: true,
  },
  '/api/agents': {
    target: 'http://localhost:3000',
    changeOrigin: true,
  },
  // 其余 API 走后端
  '/api': {
    target: 'http://localhost:8080',
    changeOrigin: true,
  },
}

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 80,
    proxy,
  },
  preview: {
    host: '0.0.0.0',
    port: 80,
    proxy,
  },
})
