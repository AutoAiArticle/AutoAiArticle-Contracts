/**
 * Fixture loading helpers.
 *
 * `loadFixture(name)` reads a JSON file from the `../fixtures` directory (relative to the
 * compiled `dist/` output, i.e. `dist/fixtures.js` reads `fixtures/` at the package root).
 * Fixtures are published verbatim (see NFR-5).
 */
import { readFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url));
/** Absolute path to the published `fixtures/` directory. */
export const FIXTURES_DIR = resolve(here, '..', 'fixtures');
/** Read and parse a JSON fixture by its path relative to `fixtures/`. */
export async function loadFixture(name) {
    const raw = await readFile(join(FIXTURES_DIR, name), 'utf-8');
    return JSON.parse(raw);
}
