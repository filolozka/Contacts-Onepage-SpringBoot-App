package com.filolozka.contactsonepager.repository;

import com.filolozka.contactsonepager.model.Contact;
import org.springframework.data.repository.CrudRepository;

public interface ContactRepository extends CrudRepository<Contact, Integer> {
}
