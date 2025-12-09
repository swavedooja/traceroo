package com.ilms.backend.controller;

import com.ilms.backend.entity.Material;
import com.ilms.backend.service.MaterialService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/materials")
@CrossOrigin(origins = "*")
public class MaterialController {
    private final MaterialService service;

    public MaterialController(MaterialService service) {
        this.service = service;
    }

    @GetMapping
    public List<Material> list() {
        return service.list();
    }

    @GetMapping("/{code}")
    public ResponseEntity<Material> get(@PathVariable String code) {
        return service.get(code)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Material create(@RequestBody Material material) {
        return service.save(material);
    }

    @PutMapping("/{code}")
    public ResponseEntity<Material> update(@PathVariable String code, @RequestBody Material material) {
        if (!service.get(code).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        material.setCode(code);
        return ResponseEntity.ok(service.save(material));
    }

    @DeleteMapping("/{code}")
    public void delete(@PathVariable String code) {
        service.delete(code);
    }
}
