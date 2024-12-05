import contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
import { createContactSchema, updateContactSchema } from "../schemas/contactsSchemas.js";

export const getAllContacts = async (req, res, next) => {
    try {
        const contacts = await contactsService.listContacts();
        res.status(200).json(contacts); 
    } catch (error) {
        next(error);
    }
};

export const getOneContact = async (req, res, next) => {
    const { id } = req.params;
    try {
        const contact = await contactsService.getContactById(id);
        if (contact === null) {
            throw new HttpError(404);
        }
        res.status(200).json(contact); 
    } catch (error) {
        next(error);
    }
};

export const deleteContact = async (req, res, next) => {
    const { id } = req.params;
    try {
        const deletedContact = await contactsService.removeContact(id);
        if (deletedContact === null) {
            throw new HttpError(404);
        }
        res.status(200).json(deletedContact); 
    } catch (error) {
        next(error);
    }
};

export const createContact = async (req, res, next) => {
    const { name, email, phone } = req.body;
    try {
        const contact = { name, email, phone };
        const { error } = createContactSchema.validate(contact, { abortEarly: false });
        if (error) {
            throw new HttpError(400, error);
        }
        const newContact = await contactsService.addContact(name, email, phone);
        res.status(201).json(newContact); 
    } catch (error) {
        next(error);
    }
};

export const updateContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = req.body;
        if (Object.keys(data).length === 0) {
             throw new HttpError(400, "Body must have at least one field");
        }
        const { error } = updateContactSchema.validate(data, { abortEarly: false });
        if (error) {
            throw new HttpError(400, error);
        }
        const updatedContact = await contactsService.updateContact(id, data);
        if (!updatedContact) {
            throw new HttpError(404);
        }
        res.status(200).json(updatedContact); 
    } catch (error) {
        next(error);
    }
};
