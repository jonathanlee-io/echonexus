package io.echonexus.echonexus_api_gateway.config

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "supabase.jwt")
data class SupabaseJwtProperties(val secret: String)
