import ActiveDirectory from "activedirectory2";
import { LdapJsClient } from "./ldap";

const options = {
  port: 389,
  url: `ldap://ipa.demo1.freeipa.org`,
  baseDn: "dc=demo1,dc=freeipa,dc=org",
  bindDn: "uid=admin,cn=users,cn=accounts,dc=demo1,dc=freeipa,dc=org",
  password: "Secret123",
  uid: "admin",
  cn: "Administrator",
};

async function ldapjsStart() {
  const ldapjs = new LdapJsClient({
    url: options.url,
  });

  try {
    const auth = await ldapjs.auth(options.bindDn, options.password);
    console.log("isAuth:", auth);

    const data = await ldapjs.search(options.bindDn, options.uid);
    console.log(`data: ${JSON.stringify(data, null, 2)}`);
  } catch (error) {
    console.log("Error:", error);
  }
}

async function ad2Start() {
  const config = {
    url: options.url,
    baseDN: options.baseDn,
    username: options.uid,
    password: options.password,
  };
  const ad = new ActiveDirectory(config);

  ad.findUser(options.bindDn, (err, user) => {
    if (err) {
      console.log("ADError:", err);
      return;
    }

    console.log("user:", user);
  });
}

// ldapjsStart();
ad2Start();
