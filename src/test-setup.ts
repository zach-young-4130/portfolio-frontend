// Global test setup. jsdom (the Vitest DOM environment) does not implement
// window.matchMedia, which ThemeService and ParallaxDirective read at
// construction time. Provide a minimal, inert stub so those services can be
// instantiated under test.
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as typeof window.matchMedia;
}
