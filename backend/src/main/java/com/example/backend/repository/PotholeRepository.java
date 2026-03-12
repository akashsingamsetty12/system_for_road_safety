package com.example.backend.repository;

import com.example.backend.model.Pothole;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PotholeRepository extends MongoRepository<Pothole, String> {
}
