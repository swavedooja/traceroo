package com.ilms.backend.controller;

import com.ilms.backend.entity.Location;
import com.ilms.backend.service.LocationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
@CrossOrigin(origins = "*")
public class LocationController {
    private final LocationService service;

    public LocationController(LocationService service) {
        this.service = service;
    }

    @GetMapping
    public List<Location> list() {
        return service.list();
    }

    @GetMapping("/roots")
    public List<Location> getRoots() {
        return service.getRoots();
    }

    @GetMapping("/{code}/children")
    public List<Location> getChildren(@PathVariable String code) {
        return service.getChildren(code);
    }

    @GetMapping("/{code}")
    public ResponseEntity<Location> get(@PathVariable String code) {
        return service.get(code)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Location create(@RequestBody Location location) {
        return service.save(location);
    }

    @PutMapping("/{code}")
    public ResponseEntity<Location> update(@PathVariable String code, @RequestBody Location location) {
        if (!service.get(code).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        location.setCode(code);
        return ResponseEntity.ok(service.save(location));
    }

    @DeleteMapping("/{code}")
    public ResponseEntity<Void> delete(@PathVariable String code) {
        service.delete(code);
        return ResponseEntity.noContent().build();
    }
}
