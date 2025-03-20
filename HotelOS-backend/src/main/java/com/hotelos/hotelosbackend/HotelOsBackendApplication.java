package com.hotelos.hotelosbackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@EntityScan("com.hotelos.hotelosbackend.models")
public class HotelOsBackendApplication {
	public static void main(String[] args) {
		SpringApplication.run(HotelOsBackendApplication.class, args);
		System.out.println("Hello from my Spring Boot app!");

	}
}