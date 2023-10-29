import { Client, ClientOptions, SearchOptions, createClient } from "ldapjs";

export class LdapJsClient {
  private client: Client;

  constructor(config: ClientOptions) {
    this.client = createClient(config);
    this.client.on("error", (err) => {
      throw Error("LdapJsClient. Client error");
    });
  }

  async auth(userCn: string, password: string) {
    return new Promise<boolean>((resolve, reject) => {
      this.client.bind(userCn, password, (err) => {
        if (err) {
          this.client.destroy(err);

          return reject("LdapJsClient. Authentication failed");
        }

        resolve(true);
      });
    });
  }

  async search(baseDn: string, uid: string) {
    const options: SearchOptions = {
      filter: `(uid=${uid})`,
      scope: "sub",
    };

    let found = false;

    return new Promise((resolve, reject) => {
      this.client.search(baseDn, options, (err, res) => {
        if (err) reject(err);

        res.on("searchEntry", (entry) => {
          found = true;
          resolve(entry);
        });

        res.on("error", (err) => {
          reject(err);
        });

        res.on("end", (result) => {
          if (!found) {
            reject(result?.status);
          }
        });
      });
    });
  }
}
