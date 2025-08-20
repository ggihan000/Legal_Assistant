//package com.gigavision.legal_assistant.config;
//
//import org.springframework.context.annotation.Configuration;
//import org.springframework.messaging.simp.SimpMessageType;
//import org.springframework.security.config.annotation.web.messaging.MessageSecurityMetadataSourceRegistry;
//import org.springframework.security.config.annotation.web.socket.AbstractSecurityWebSocketMessageBrokerConfigurer;
//import org.springframework.security.config.annotation.web.socket.EnableWebSocketSecurity;
//
//@Configuration
//@EnableWebSocketSecurity
//public class WebSocketSecurityConfig extends AbstractSecurityWebSocketMessageBrokerConfigurer {
//
//    @Override
//    protected void configureInbound(MessageSecurityMetadataSourceRegistry messages) {
//        messages
//                .simpTypeMatchers(
//                        SimpMessageType.CONNECT,
//                        SimpMessageType.DISCONNECT,
//                        SimpMessageType.HEARTBEAT,
//                        SimpMessageType.UNSUBSCRIBE,
//                        SimpMessageType.CONNECT_ACK
//                ).permitAll()
//
//                // Secure application-specific paths
//                .simpDestMatchers("/app/**").authenticated()
//                .simpSubscribeDestMatchers("/topic/**", "/user/**").authenticated()
//                .anyMessage().denyAll();
//    }
//
//    @Override
//    protected boolean sameOriginDisabled() {
//        return true; // Disable CSRF for WebSockets
//    }
//}
