package com.filolozka.contactsonepager.dto;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

public class ContactDto {
    public int id;
    public String name;
    public String lastName;
    public int age;

    public ContactDto(String name, String lastName, int age) {
        this.name = name;
        this.lastName = lastName;
        this.age = age;
    }

    public ContactDto() {
    }
}
