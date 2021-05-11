import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { ApolloLink, from } from 'apollo-link';
import { IApiSettings } from '../shared/interfaces/IApiSettings';

/**
 * @deprecated Please use ApiService instead
 */
export class ApiService extends ApolloClient<NormalizedCacheObject> {
  private readonly authMiddleware = new ApolloLink((operation, forward) => {
    operation.setContext({
      headers: {
        authorization: localStorage.getItem(this.config.KEY_AUTH_TOKEN) || null,
      },
    });
    return forward(operation);
  });
  private readonly afterwareLink = new ApolloLink((operation, forward) => {
    return forward(operation).map((response) => {
      const context = operation.getContext();
      const {
        response: { headers },
      } = context;

      if (headers) {
        const refreshedToken = headers.get(this.config.KEY_AUTH_REFRESH_TOKEN);
        if (refreshedToken) {
          localStorage.setItem(this.config.KEY_AUTH_TOKEN, refreshedToken);
        }
      }

      return response;
    });
  });
  private readonly httpLink = new HttpLink({ uri: this.config.API_BASE });

  constructor(private readonly config: IApiSettings) {
    super({ cache: new InMemoryCache() });
    this.link = from([this.authMiddleware, this.afterwareLink, this.httpLink]);
  }
}
