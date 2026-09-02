/** Absolute path to the published `fixtures/` directory. */
export declare const FIXTURES_DIR: string;
/** Read and parse a JSON fixture by its path relative to `fixtures/`. */
export declare function loadFixture<T = unknown>(name: string): Promise<T>;
