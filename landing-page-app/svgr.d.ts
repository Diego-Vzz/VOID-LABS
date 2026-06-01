declare module '*.svg' {
  import React from 'react'
  const Component: React.FC<React.SVGProps<SVGSVGElement>>
  export default Component
}

declare module '*.svg?url' {
  const content: any
  export default content
}