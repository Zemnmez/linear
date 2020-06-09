/// <reference types="react-scripts" />

declare module '*.mp4' {
  const src: string;
  export default src;
}

declare module '*.module.css' {
  const mappings: Record<string,string>;
  export default mappings;
}