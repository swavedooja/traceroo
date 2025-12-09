package com.ilms.backend.repository;

import com.ilms.backend.entity.Location;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LocationRepository extends JpaRepository<Location, String> {
    List<Location> findByParentIsNull();

    List<Location> findByParentCode(String parentCode);

    Optional<Location> findByCode(String code);

    void deleteByCode(String code);
}
