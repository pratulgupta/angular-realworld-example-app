import { getTestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';

console.log('🚀 Test setup file is being loaded!');

// Zoneless app (app.config.ts uses provideZonelessChangeDetection, angular.json
// polyfills are empty, zone.js is not installed) → the test env must be zoneless
// too: no `zone.js`/`zone.js/testing` imports, and the AOT testing platform
// (`platformBrowserTesting` + `BrowserTestingModule`) rather than the zone-based
// `*Dynamic*` (JIT) one, which pulled in the unresolvable zone.js.
try {
  getTestBed().initTestEnvironment(BrowserTestingModule, platformBrowserTesting(), {
    teardown: { destroyAfterEach: true },
  });
  console.log('✅ TestBed initialized successfully');
} catch (error) {
  console.error('❌ TestBed initialization failed:', error);
}
