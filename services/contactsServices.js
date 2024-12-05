
const fs = require("fs").promises;
const path = require("path");
const crypto = require("crypto");

const contactsPath = path.resolve("db", "contacts.json");

async function readFile() {
  const data = await fs.readFile(contactsPath, { encoding: "utf-8" });
  return JSON.parse(data);
}

async function writeFile(contacts) {
  await fs.writeFile(contactsPath, JSON.stringify(contacts, undefined, 2));
}

async function listContacts() {
  const contacts = await readFile();
  return contacts;
}

async function getContactById(contactId) {
  const contacts = await readFile();
  const searchContact = contacts.find((contact) => contact.id === contactId);

  if (typeof searchContact === "undefined") {
    return null;
  }

  return searchContact;
}

async function removeContact(contactId) {
  const contacts = await readFile();
  const index = contacts.findIndex((contact) => contact.id === contactId);

  if (index === -1) {
    return null;
  }

  const deletedContact = contacts[index];
  contacts.splice(index, 1);
  await writeFile(contacts);
  return deletedContact;
}

async function addContact(name, email, phone) {
  const contacts = await readFile();
  const newContact = {
    id: crypto.randomUUID(),
    name,
    email,
    phone,
  };

  contacts.push(newContact);
  await writeFile(contacts);
  return newContact;
}

module.exports = {
  listContacts,
  removeContact,
  getContactById,
  addContact,
};
