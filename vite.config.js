import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
 base: '/omrahNamesPoll/', // ⬅️ يجب أن يطابق اسم الريبو 100%
})
