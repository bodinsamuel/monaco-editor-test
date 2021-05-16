import type { Config } from './config';

declare global {
  class Crawler {
    constructor(config: Config);
  }
  function crawler(params: Config): boolean;
}
