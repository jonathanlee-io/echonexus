package io.echonexus.echonexus_api_gateway.config

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "echonexus.cors")
data class CorsConfigurationProperties(val origin: String)
