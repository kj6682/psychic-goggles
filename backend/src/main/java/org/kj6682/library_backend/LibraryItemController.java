package org.kj6682.library_backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/items")
@CrossOrigin(origins = "http://localhost:5173")
public class LibraryItemController {

    @Autowired
    private LibraryItemRepository repository;

    @GetMapping
    public Page<LibraryItem> getAllItems(
            @RequestParam(required = false, defaultValue = "") String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return repository.findByTitleContainingIgnoreCase(query, pageable);
    }

    @PostMapping
    public LibraryItem createItem(@RequestBody LibraryItem item) {
        return repository.save(item);
    }

    @PutMapping("/{id}")
    public LibraryItem updateItem(@PathVariable Long id, @RequestBody LibraryItem item) {
        item.setId(id);
        return repository.save(item);
    }

    @DeleteMapping("/{id}")
    public void deleteItem(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
