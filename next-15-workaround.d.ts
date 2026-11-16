// Compatibility shim for Next 15.1's generated route declarations when using
// TypeScript's modern `bundler` resolver. Remove after upgrading Next.
declare module "next/dist/lib/metadata/types/metadata-interface.js" {
  export type ResolvingMetadata = unknown;
  export type ResolvingViewport = unknown;
}
