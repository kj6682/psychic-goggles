package com.example.library_backend;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LibraryItemRepository extends JpaRepository<LibraryItem, Long> {
}
