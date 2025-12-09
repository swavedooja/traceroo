package com.ilms.backend.service;

import com.ilms.backend.entity.Location;
import com.ilms.backend.repository.LocationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class LocationService {
    private final LocationRepository locationRepo;

    public LocationService(LocationRepository locationRepo) {
        this.locationRepo = locationRepo;
    }

    public List<Location> list() {
        return locationRepo.findAll();
    }

    public List<Location> getRoots() {
        return locationRepo.findByParentIsNull();
    }

    public List<Location> getChildren(String parentCode) {
        return locationRepo.findByParentCode(parentCode);
    }

    public Optional<Location> get(String code) {
        return locationRepo.findByCode(code);
    }

    @Transactional
    public Location save(Location location) {
        // Ensure bidirectional relationship if children are added directly
        if (location.getChildren() != null) {
            for (Location child : location.getChildren()) {
                child.setParent(location);
            }
        }
        return locationRepo.save(location);
    }

    public void delete(String code) {
        locationRepo.deleteByCode(code);
    }
}
