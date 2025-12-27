import * as qwk from './api-client';
import type * as Types from './index';

var searchResults = await qwk.searchWeb({
    query: {
        q: 'Bitcoin',
        cat: 'news'
    }
})

import { grab, log } from 'grab-url'
log(searchResults.data?.results?.[0].url)

if (!searchResults.data?.results?.[0].url)
    throw new Error('No URL found');

var topResult = await qwk.extractContent({
    query: {
        url: searchResults.data?.results?.[0].url || ''
    }
})

log(topResult.);
