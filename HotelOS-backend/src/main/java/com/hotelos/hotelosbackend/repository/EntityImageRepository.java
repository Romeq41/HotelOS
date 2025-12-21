package com.hotelos.hotelosbackend.repository;

import com.hotelos.hotelosbackend.models.EntityImage;
import com.hotelos.hotelosbackend.models.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface EntityImageRepository extends JpaRepository<EntityImage, Long> {

    Optional<EntityImage> findByEntityTypeAndEntityIdAndIsPrimaryTrue(EntityImage.EntityType entityType, Long entityId);

    List<EntityImage> findByEntityTypeAndEntityIdOrderByDisplayOrderAsc(EntityImage.EntityType entityType, Long entityId);

    Optional<EntityImage> findFirstByEntityTypeAndEntityIdOrderByDisplayOrderAsc(EntityImage.EntityType entityType, Long entityId);

    @Modifying
    @Transactional
    @Query("UPDATE EntityImage e SET e.isPrimary = false WHERE e.entityType = :entityType AND e.entityId = :entityId")
    void unsetPrimaryForEntity(@Param("entityType") EntityImage.EntityType entityType, @Param("entityId") Long entityId);


    @Query("SELECT MAX(e.displayOrder) FROM EntityImage e WHERE e.entityType = :entityType AND e.entityId = :entityId")
    Optional<Integer> findMaxDisplayOrderForEntity(@Param("entityType") EntityImage.EntityType entityType, @Param("entityId") Long entityId);

    boolean existsByEntityTypeAndEntityId(EntityImage.EntityType entityType,Long entityId);


}