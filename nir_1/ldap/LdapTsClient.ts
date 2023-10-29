import { Client, ClientOptions, SearchOptions } from "ldapts";

export class LdapTsClient {
  private client: Client;

  constructor(config: ClientOptions) {
    this.client = new Client(config);
  }

  async auth(userCn: string, password: string) {
    await this.client.bind(userCn, password);
    return true;
  }

  async search(baseDn: string, uid: string) {
    const options: SearchOptions = {
      filter: `(uid=${uid})`,
      scope: "sub",
    };

    const { searchEntries } = await this.client.search(baseDn, options);
    return searchEntries;
  }
}
