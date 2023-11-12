import { LdapJsClient, LdapTsClient } from "./ldap";

const user = "admin";

const options = {
  port: 389,
  url: `ldap://ipa.demo1.freeipa.org`,
  baseDn: "dc=demo1,dc=freeipa,dc=org",
  bindDn: `uid=${user},cn=users,cn=accounts,dc=demo1,dc=freeipa,dc=org`,
  password: "Secret123",
  uid: `${user}`,
  cn: "admin",
};

async function ldapJsStart() {
  try {
    const ldapJs = new LdapJsClient({
      url: options.url,
    });

    await ldapJs.auth(options.bindDn, options.password);

    const e = await ldapJs.search(options.baseDn, options.uid);
    // console.log(e!.length!)
  } catch (error) {
    console.log("Error:", error);
  }
}

async function ldapTsStart() {
  try {
    const ldapTs = new LdapTsClient({
      url: options.url,
    });

    await ldapTs.auth(options.bindDn, options.password);

    await ldapTs.search(options.bindDn, options.uid);
  } catch (error) {
    console.log("Error:", error);
  }
}

async function start() {
  // console.time("ldapjs");
  // await ldapJsStart();
  // console.timeEnd("ldapjs");

  await ldapJsStart();

  return;
}

start();
