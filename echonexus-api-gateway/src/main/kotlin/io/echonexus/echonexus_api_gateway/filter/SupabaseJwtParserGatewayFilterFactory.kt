package io.echonexus.echonexus_api_gateway.filter

import org.springframework.cloud.gateway.filter.GatewayFilter
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken
import org.springframework.stereotype.Component

@Component
class SupabaseJwtParserGatewayFilterFactory :
  AbstractGatewayFilterFactory<Any>() {

  companion object {
    const val EMAIL_HEADER = "X-Requesting-User-Email"
    const val SUBJECT_ID_HEADER = "X-Requesting-User-Subject-Id"
  }

  override fun apply(config: Any?): GatewayFilter {
    return GatewayFilter { exchange, chain ->
      exchange.getPrincipal<JwtAuthenticationToken>()
        .flatMap { jwtAuthenticationToken ->
          // Extract claims from the JWT
          val claims = jwtAuthenticationToken.token.claims
          val userMetaData = claims["user_metadata"] as? Map<*, *>
          val userEmail = userMetaData?.get("email") as? String

          val tokenAttributes = jwtAuthenticationToken.tokenAttributes
          val subjectId = tokenAttributes?.get("sub") as? String

          // Mutate the request and add the headers
          if (userEmail != null && subjectId != null) {
            val mutatedRequest = exchange.request.mutate()
              .headers {
                it.remove(EMAIL_HEADER)
                it.remove(SUBJECT_ID_HEADER)
              }
              .header(EMAIL_HEADER, userEmail)
              .header(SUBJECT_ID_HEADER, subjectId)
              .build()

            val mutatedExchange = exchange.mutate().request(mutatedRequest).build()
            chain.filter(mutatedExchange)
          } else {
            chain.filter(exchange)
          }
        }
    }
  }
}
