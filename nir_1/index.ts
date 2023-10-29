import { LdapJsClient, LdapTsClient } from "./ldap";

const options = {
  port: 389,
  url: `ldap://ipa.demo1.freeipa.org`,
  baseDn: "dc=demo1,dc=freeipa,dc=org",
  bindDn: "uid=admin,cn=users,cn=accounts,dc=demo1,dc=freeipa,dc=org",
  password: "Secret123",
  uid: "admin",
  cn: "Administrator",
};

async function ldapJsStart() {
  try {
    const ldapJs = new LdapJsClient({
      url: options.url,
    });

    await ldapJs.auth(options.bindDn, options.password);

    return await ldapJs.search(options.bindDn, options.uid);
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

    return await ldapTs.search(options.bindDn, options.uid);
  } catch (error) {
    console.log("Error:", error);
  }
}

async function start() {
  console.time("ldapjs");
  await ldapJsStart();
  console.timeEnd("ldapjs");

  console.time("ldapts");
  await ldapTsStart();
  console.timeEnd("ldapts");
}

start();
