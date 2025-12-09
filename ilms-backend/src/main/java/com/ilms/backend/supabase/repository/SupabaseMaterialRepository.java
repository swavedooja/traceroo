package com.ilms.backend.supabase.repository;

import com.ilms.backend.supabase.entity.SupabaseMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SupabaseMaterialRepository extends JpaRepository<SupabaseMaterial, String> {
    Optional<SupabaseMaterial> findByCode(String code);
}
