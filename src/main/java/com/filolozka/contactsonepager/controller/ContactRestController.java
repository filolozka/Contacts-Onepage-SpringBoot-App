package com.filolozka.contactsonepager.controller;

import com.filolozka.contactsonepager.dto.ContactDto;
import com.filolozka.contactsonepager.model.Contact;
import com.filolozka.contactsonepager.service.ContactService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("api/contacts")
public class ContactRestController {
    final ContactService contactService;

    public ContactRestController(ContactService contactService) {
        this.contactService = contactService;
    }

    @PostMapping
    public ContactDto create(@RequestBody ContactDto contactDto) {
        Contact contact = contactService.create(contactDto.name, contactDto.lastName, contactDto.age);
        contactDto.id = contact.getId();
        return contactDto;
    }

    @GetMapping("{id}")
    public ContactDto get(@PathVariable int id) {
        Contact contact = contactService.get(id);
        return new ContactDto(
                contact.getId(),
                contact.getName(),
                contact.getLastName(),
                contact.getAge());
    }

    @GetMapping
    public List<ContactDto> getAll(@RequestParam(value = "lastname", required = false) String lastName,
                                   @RequestParam(value = "name", required = false) String name) {
        List<Contact> contacts;
        if (lastName == null && name == null) {
            contacts = contactService.getAll();
        }
        else if (lastName == null) {
            contacts = contactService.getAllByName(name);
        }
        else if (name == null) {
            contacts = contactService.getAllByLastName(lastName);
        }
        else contacts = contactService.getAllByLastNameAndNameIgnoreCase(lastName, name);
        return contacts.stream().map(contact -> new ContactDto(
                contact.getId(), contact.getName(), contact.getLastName(), contact.getAge())
        ).collect(Collectors.toList());
    }

    @PutMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void edit(@RequestBody ContactDto contactDto) {
        contactService.edit(contactDto.id, contactDto.name, contactDto.lastName, contactDto.age);
    }

    @DeleteMapping("{id}")
    public ContactDto remove(@PathVariable int id) {
        Contact contact = contactService.delete(id);
        return new ContactDto(contact.getId(), contact.getName(), contact.getLastName(), contact.getAge());
    }
}
