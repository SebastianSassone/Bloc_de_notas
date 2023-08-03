package com.appNotas.app.rest.Repository;

import com.appNotas.app.rest.Model.Model;
import org.springframework.data.jpa.repository.JpaRepository;
public interface Repository extends JpaRepository<Model, Long> {
}
