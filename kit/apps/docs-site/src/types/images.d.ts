// Tells TypeScript what an image import is: the bundler turns `import img from "./x.png"`
// into the image's URL (a string). Only needed for type-checking; the build already works.
declare module "*.png" {
  const src: string;
  export default src;
}
