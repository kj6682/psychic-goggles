package com.example.library_backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/items")
@CrossOrigin(origins = "http://localhost:5173")
public class LibraryItemController {

    @Autowired
    private LibraryItemRepository repository;

    @GetMapping
    public List<LibraryItem> getAllItems() {
        return repository.findAll();
    }

    @PostMapping
    public LibraryItem createItem(@RequestBody LibraryItem item) {
        return repository.save(item);
    }

    @DeleteMapping("/{id}")
    public void deleteItem(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
