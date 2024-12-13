/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // const component: DefineComponent<{}, {}, any>
  const component: ReturnType<typeof DefineComponent>
  export default component
}

declare module '*.md' {
  import { ComponentOptions } from 'vue'
  // const Component: ComponentOptions
  const component: ReturnType<typeof DefineComponent>
  export default Component
}
