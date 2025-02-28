package io.echonexus.echonexus_api_gateway

import io.echonexus.echonexus_api_gateway.config.CorsConfigurationProperties
import io.echonexus.echonexus_api_gateway.config.SupabaseJwtProperties
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.boot.runApplication

@SpringBootApplication
@EnableConfigurationProperties(SupabaseJwtProperties::class, CorsConfigurationProperties::class)
class EchoNexusApiGatewayApplication

fun main(args: Array<String>) {
	runApplication<EchoNexusApiGatewayApplication>(*args)
}
