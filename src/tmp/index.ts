/// <reference types="node" />
import { CheerioAPI, load } from 'cheerio';
import parseJson from 'parse-json';
import { Config } from './config';

[1].map((value) => {
  return value;
});
parseJson(true);

// This work
const $a = load('test', { test: 'test' });
$a('.title').map((i, el) => {
  return $a(el);
});
const test: CheerioAPI = {};

new Crawler({
  actions: [
    {
      indexName: true,
      // The $ is any :(
      recordExtractor: ({ $ }) => {
        return [
          {
            title: $('.title').map((i, el) => {
              return $(el);
            }),
          },
        ];
      },
    },
  ],
});

const config: Config = {
  appId: '',
  apiKey: '',
  exclusionPatterns: [],
  rateLimit: 8,
  actions: [{}],
};
