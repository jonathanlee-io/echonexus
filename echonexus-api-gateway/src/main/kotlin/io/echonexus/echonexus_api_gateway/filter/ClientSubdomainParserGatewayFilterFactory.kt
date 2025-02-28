package io.echonexus.echonexus_api_gateway.filter

import org.springframework.cloud.gateway.filter.GatewayFilter
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory
import org.springframework.stereotype.Component

@Component
class ClientSubdomainParserGatewayFilterFactory :
  AbstractGatewayFilterFactory<Any>() {

  companion object {
    const val CLIENT_SUBDOMAIN_HEADER = "X-Requesting-User-Client-Subdomain"
  }


  override fun apply(config: Any?): GatewayFilter {
    return GatewayFilter { exchange, chain ->
      val host = exchange.request.uri.host
      val clientSubdomain = host.split(":").first().split(".").first()

      // Mutate the request and add the headers
      val mutatedRequest = exchange.request.mutate()
        .headers {
          it.remove(CLIENT_SUBDOMAIN_HEADER)
        }
        .header(CLIENT_SUBDOMAIN_HEADER, clientSubdomain)
        .build()

      val mutatedExchange = exchange.mutate().request(mutatedRequest).build()
      chain.filter(mutatedExchange)
    }

  }
}
