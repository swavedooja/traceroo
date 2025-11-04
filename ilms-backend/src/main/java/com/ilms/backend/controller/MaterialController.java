package com.ilms.backend.controller;

import com.ilms.backend.dto.MaterialDTO;
import com.ilms.backend.entity.MaterialDocument;
import com.ilms.backend.entity.MaterialImage;
import com.ilms.backend.entity.MaterialMaster;
import com.ilms.backend.service.MaterialService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/materials")
public class MaterialController {

    private final MaterialService materialService;

    public MaterialController(MaterialService materialService) {
        this.materialService = materialService;
    }

    @GetMapping
    public Page<MaterialMaster> list(@RequestParam(value = "search", required = false) String search,
                                     @RequestParam(defaultValue = "0") int page,
                                     @RequestParam(defaultValue = "10") int size) {
        return materialService.list(search, page, size);
    }

    @GetMapping("/{code}")
    public ResponseEntity<MaterialMaster> get(@PathVariable String code) {
        return materialService.getByCode(code)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<MaterialMaster> create(@Valid @RequestBody MaterialDTO dto) {
        MaterialMaster saved = materialService.createOrUpdate(dto);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @PutMapping("/{code}")
    public ResponseEntity<MaterialMaster> update(@PathVariable String code, @Valid @RequestBody MaterialDTO dto) {
        dto.setMaterialCode(code);
        MaterialMaster saved = materialService.createOrUpdate(dto);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{code}")
    public ResponseEntity<Void> delete(@PathVariable String code) {
        materialService.delete(code);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{code}/images")
    public ResponseEntity<List<MaterialImage>> listImages(@PathVariable String code) {
        return materialService.getByCode(code)
                .map(m -> ResponseEntity.ok(materialService.listImages(m)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{code}/images")
    public ResponseEntity<MaterialImage> uploadImage(@PathVariable String code,
                                                     @RequestParam("file") MultipartFile file,
                                                     @RequestParam(value = "type", defaultValue = "material") String type) throws IOException {
        MaterialMaster m = materialService.getByCode(code).orElseThrow();
        MaterialImage img = materialService.saveImage(m, file, type);
        return new ResponseEntity<>(img, HttpStatus.CREATED);
    }

    @GetMapping("/{code}/documents")
    public ResponseEntity<List<MaterialDocument>> listDocs(@PathVariable String code) {
        return materialService.getByCode(code)
                .map(m -> ResponseEntity.ok(materialService.listDocs(m)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{code}/documents")
    public ResponseEntity<MaterialDocument> uploadDoc(@PathVariable String code,
                                                      @RequestParam("file") MultipartFile file,
                                                      @RequestParam("docType") String docType) throws IOException {
        MaterialMaster m = materialService.getByCode(code).orElseThrow();
        MaterialDocument d = materialService.saveDocument(m, file, docType);
        return new ResponseEntity<>(d, HttpStatus.CREATED);
    }
}
