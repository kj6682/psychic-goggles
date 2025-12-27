package org.kj6682.library_backend;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LibraryItemRepository extends JpaRepository<LibraryItem, Long> {
    Page<LibraryItem> findByTitleContainingIgnoreCase(String title, Pageable pageable);
}
