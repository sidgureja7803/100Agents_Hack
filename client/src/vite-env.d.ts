/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APPWRITE_FUNCTION_URL: string
  readonly VITE_APPWRITE_PROJECT_ID: string
  readonly VITE_APPWRITE_ENDPOINT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
