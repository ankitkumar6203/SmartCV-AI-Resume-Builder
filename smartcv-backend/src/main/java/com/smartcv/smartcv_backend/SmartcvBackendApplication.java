package com.smartcv.smartcv_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing  // ✅ Needed for @CreationTimestamp
public class SmartcvBackendApplication {

	public static void main(String[] args) {

		SpringApplication.run(SmartcvBackendApplication.class, args);
	}

}
