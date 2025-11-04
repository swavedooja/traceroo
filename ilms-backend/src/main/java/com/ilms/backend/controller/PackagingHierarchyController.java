package com.ilms.backend.controller;

import com.ilms.backend.dto.PackagingHierarchyDTO;
import com.ilms.backend.entity.PackagingHierarchy;
import com.ilms.backend.service.PackagingHierarchyService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/packaging-hierarchy")
public class PackagingHierarchyController {

    private final PackagingHierarchyService service;

    public PackagingHierarchyController(PackagingHierarchyService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<PackagingHierarchy> create(@RequestBody PackagingHierarchyDTO dto) {
        PackagingHierarchy saved = service.save(dto);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PackagingHierarchy> get(@PathVariable Long id) {
        return service.get(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<PackagingHierarchy> update(@PathVariable Long id, @RequestBody PackagingHierarchyDTO dto) {
        dto.setId(id);
        return ResponseEntity.ok(service.save(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/preview")
    public ResponseEntity<Map<String, Object>> preview(@PathVariable Long id) {
        return ResponseEntity.ok(service.preview(id));
    }
}
