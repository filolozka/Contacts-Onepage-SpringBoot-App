package com.filolozka.contactsonepager.service;

import com.filolozka.contactsonepager.model.Contact;
import com.filolozka.contactsonepager.repository.ContactRepository;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ContactService {
    final ContactRepository contactRepository;

    public ContactService(ContactRepository contactRepository){
        this.contactRepository = contactRepository;
    }

    public Contact create(String name, String lastName, int age){
        Contact contact = new Contact(name, lastName, age);
        contactRepository.save(contact);
        return contact;
    }

    public List<Contact> getAll(){
        List<Contact> res = new ArrayList<>();
        contactRepository.findAll().forEach(res::add);
        return res;
    }

    public Contact get(int id){
        Optional<Contact> result = contactRepository.findById(id);
        return result.orElseThrow(EntityNotFoundException::new);
    }

    public Contact edit(int id, String name, String lastName, Integer age) {
        Contact contact = get(id);
        contact.setName(name);
        contact.setLastName(lastName);
        contact.setAge(age);
        contactRepository.save(contact);
        return contact;
    }

    public Contact delete(int id){
        Contact contactToDelete = get(id);
        contactRepository.delete(contactToDelete);
        return contactToDelete;
    }
}
