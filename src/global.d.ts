export { };

declare global {
     interface Window {
          adsbygoogle?: { push: () => void }[];
     }
}
