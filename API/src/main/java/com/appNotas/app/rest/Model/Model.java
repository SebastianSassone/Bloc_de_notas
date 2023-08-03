package com.appNotas.app.rest.Model;

import javax.persistence.*;

@Entity
@Table(schema = "notastabla")
public class Model {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Column
    private String title;
    @Column
    private String description;

    public long getId(){
        return id;
    }
    public void setId(long id){
        this.id = id;
    }
    public String getTitle(){
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }
    public String getDescription(){
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
}
