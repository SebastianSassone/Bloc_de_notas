package com.appNotas.app.rest.Controller;

import com.appNotas.app.rest.Model.Model;
import com.appNotas.app.rest.Repository.Repository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
public class Controller {
    @Autowired
    private Repository repository;

    @GetMapping(value= "/notas")
    public List<Model> traerNota(){
        return repository.findAll();
    }

    @PostMapping(value="/guardar")
    public ResponseEntity<Object> guardarNota(@RequestBody Model model){
        repository.save(model);
        return ResponseEntity.ok("Guardado");
    }

    @PutMapping(value="/actualizar/{id}")
    public ResponseEntity<Object> actualizarNota(@PathVariable long id, @RequestBody Model model){
        Model updatedModel = repository.findById(id).orElse(null);
        if (updatedModel != null) {
            updatedModel.setTitle(model.getTitle());
            updatedModel.setDescription(model.getDescription());
            repository.save(updatedModel);
            return ResponseEntity.ok(updatedModel);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No actualizado");
        }
    }


    @DeleteMapping(value="/borrar/{id}")
    public ResponseEntity<Object> borrarNota(@PathVariable long id){
        Model deletedModel = repository.findById(id).orElse(null);
        if (deletedModel != null) {
            repository.delete(deletedModel);
            return ResponseEntity.ok("Borrado");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No borrado");
        }
    }
}
