package org.kj6682.library_backend;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

public class LibraryItemTest {

    @Test
    public void testLibraryItemCreation() {
        LibraryItem item = new LibraryItem("Title", "Authors", "Book", "Category", "Location");
        
        assertThat(item.getTitle()).isEqualTo("Title");
        assertThat(item.getAuthors()).isEqualTo("Authors");
        assertThat(item.getType()).isEqualTo("Book");
        assertThat(item.getCategory()).isEqualTo("Category");
        assertThat(item.getLocation()).isEqualTo("Location");
    }

    @Test
    public void testLibraryItemSetters() {
        LibraryItem item = new LibraryItem();
        item.setId(10L);
        item.setTitle("New Title");

        assertThat(item.getId()).isEqualTo(10L);
        assertThat(item.getTitle()).isEqualTo("New Title");
    }
}
