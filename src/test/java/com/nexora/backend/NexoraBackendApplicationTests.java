package com.nexora.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@ActiveProfiles("test")
// See BootstrapAdminTest: keeps ambient NEXORA_* / SPRING_DATASOURCE_* exports
// from overriding the isolated H2 test configuration.
@TestPropertySource(locations = "classpath:application-test.properties")
class NexoraBackendApplicationTests {

	@Test
	void contextLoads() {
	}

}
