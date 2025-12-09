package com.ilms.backend.controller;

import com.ilms.backend.entity.MasterDefinition;
import com.ilms.backend.service.MasterDefinitionService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/master-definitions")
@CrossOrigin(origins = "*")
public class MasterDefinitionController {
    private final MasterDefinitionService service;

    public MasterDefinitionController(MasterDefinitionService service) {
        this.service = service;
    }

    @GetMapping
    public List<MasterDefinition> list() {
        return service.listAll();
    }

    @GetMapping("/type/{type}")
    public List<MasterDefinition> listByType(@PathVariable String type) {
        return service.listByType(type);
    }

    @PostMapping
    public MasterDefinition create(@RequestBody MasterDefinition def) {
        return service.save(def);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
