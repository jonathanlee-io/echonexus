package io.echonexus.echonexus_api_gateway.config

import com.nimbusds.jose.JWSAlgorithm
import com.nimbusds.jose.jwk.OctetSequenceKey
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.security.config.Customizer.withDefaults
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity
import org.springframework.security.config.web.server.ServerHttpSecurity
import org.springframework.security.oauth2.jwt.NimbusReactiveJwtDecoder
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder
import org.springframework.security.web.server.SecurityWebFilterChain
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource

@Configuration
@EnableWebFluxSecurity
class SecurityConfig(
  private val supabaseJwtProperties: SupabaseJwtProperties,
  private val corsConfigurationProperties: CorsConfigurationProperties,
) {

  @Bean
  fun securityWebFilterChain(http: ServerHttpSecurity): SecurityWebFilterChain {
    http.csrf { it.disable() }
    http.oauth2ResourceServer { it.jwt(withDefaults()) }
    http.authorizeExchange {
      it.pathMatchers("/v1/payments/plans").permitAll()
      it.pathMatchers(HttpMethod.POST, "/v1/products/feedback/**").permitAll()
      it.pathMatchers(HttpMethod.OPTIONS, "/v1/products/feedback/**").permitAll()
        .pathMatchers("/v1/scripts/feedback-widget.js").permitAll()
        .pathMatchers("/v1/scripts/echonexus-widget.js").permitAll()
        .pathMatchers("/v1/clients/**").authenticated()
        .pathMatchers("/v1/issues/**").authenticated()
        .pathMatchers("/v1/projects/**").authenticated()
        .pathMatchers("/v1/users/**").authenticated()
    }
    return http.build()
  }

  @Bean
  fun reactiveJwtDecoder(): ReactiveJwtDecoder {
    return NimbusReactiveJwtDecoder.withSecretKey(
      OctetSequenceKey
        .Builder(supabaseJwtProperties.secret.toByteArray())
        .algorithm(JWSAlgorithm.HS256)
        .build()
        .toSecretKey()
    ).build()
  }

  @Bean
  fun corsConfigurationSource(): UrlBasedCorsConfigurationSource {
    val source = UrlBasedCorsConfigurationSource()
    val config = CorsConfiguration()
    config.allowCredentials = true
    config.addAllowedOriginPattern(this.corsConfigurationProperties.origin)
    config.addAllowedHeader("Authorization")
    config.addAllowedHeader("Content-Type")
    config.addAllowedMethod("GET")
    config.addAllowedMethod("POST")
    config.addAllowedMethod("PUT")
    config.addAllowedMethod("PATCH")
    config.addAllowedMethod("DELETE")
    config.addAllowedMethod("OPTIONS")
    source.registerCorsConfiguration("/**", config)
    return source
  }
}
