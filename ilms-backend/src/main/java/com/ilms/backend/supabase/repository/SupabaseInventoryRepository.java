package com.ilms.backend.supabase.repository;

import com.ilms.backend.supabase.entity.SupabaseInventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SupabaseInventoryRepository extends JpaRepository<SupabaseInventory, Long> {
}
