import algoliasearch, { SearchClient, SearchIndex } from 'algoliasearch';

const dev_popInsIndexName = 'dev_PopIns';
const prod_popInsIndexName = 'prod_PopIns';
export default class PopInsSearchClient {
  private client: SearchClient;
  private index: SearchIndex;

  constructor(context: {
    algoliaSearchAPIKey: string;
    algoliaAppId: string;
    env: 'DEV' | 'PROD';
  }) {
    this.client = algoliasearch(
      context.algoliaAppId,
      context.algoliaSearchAPIKey,
    );
    this.index = this.client.initIndex(
      context.env == 'DEV' ? dev_popInsIndexName : prod_popInsIndexName,
    );
  }

  async searchForNearPoint(context: {
    lat: number;
    lng: number;
    radiusInMeters: number;
    numberOfRecords: number;
  }) {
    let results = await this.index.search('', {
      aroundLatLng: `${context.lat}, ${context.lng}`,
      aroundRadius: context.radiusInMeters,
      length: context.numberOfRecords,
      attributesToHighlight: [],
    });
    return results.hits;
  }

  async searchForUsersNearPoint(context: {
    lat: number;
    lng: number;
    radiusInMeters: number;
    numberOfRecords: number;
  }) {
    let results = await this.index.search('', {
      aroundLatLng: `${context.lat}, ${context.lng}`,
      aroundRadius: context.radiusInMeters,
      length: context.numberOfRecords,
      facetFilters: 'type:User',
      attributesToHighlight: [],
    });
    return results.hits;
  }

  async searchForPopInsNearPoint(context: {
    lat: number;
    lng: number;
    radiusInMeters: number;
    numberOfRecords: number;
  }) {
    let results = await this.index.search('', {
      aroundLatLng: `${context.lat}, ${context.lng}`,
      aroundRadius: context.radiusInMeters,
      length: context.numberOfRecords,
      facetFilters: 'type:PopIn',
      attributesToHighlight: [],
    });
    return results.hits;
  }

  async searchWithinBoundingBox(context: {
    p1lat: number;
    p1lng: number;
    p2lat: number;
    p2lng: number;
    numberOfRecords: number;
  }) {
    let results = await this.index.search('', {
      insideBoundingBox: [
        [context.p1lat, context.p1lng, context.p2lat, context.p2lng],
      ],
      length: context.numberOfRecords,
      attributesToHighlight: [],
    });
    return results.hits;
  }
}
