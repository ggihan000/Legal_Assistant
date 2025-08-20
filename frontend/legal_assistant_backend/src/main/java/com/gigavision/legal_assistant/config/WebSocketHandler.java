package com.gigavision.legal_assistant.config;

import com.gigavision.legal_assistant.model.User;
import com.gigavision.legal_assistant.model.UserPrincipal;
import com.gigavision.legal_assistant.services.JWTService;
import com.gigavision.legal_assistant.services.PythonServices;
import com.gigavision.legal_assistant.services.TranslationService;
import com.gigavision.legal_assistant.services.UserServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicReference;
import java.util.function.Consumer;

@Component
public class WebSocketHandler extends TextWebSocketHandler {
    //private final List<WebSocketSession> sessions = new CopyOnWriteArrayList<>();
    private List<WebSocketSession> authenticatedSessions = new ArrayList<>();
    private Map<WebSocketSession, List<Map<String, String>>> sessions = new ConcurrentHashMap<>();

    @Autowired
    private PythonServices pythonService;

    @Autowired
    private JWTService jwtService;

    @Autowired
    private TranslationService translationService;

    @Autowired
    private UserServices userServices;

    private String lang = "Eng";

    private String jsonTextConverter(String key,String content){
        return "{\""+key+"\":\""+content+"\"}";
    };

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws IOException {
        String firstMessage = "Hello how can I help you?";
        //sessions.get(session).add(Map.of("role", "ai", "content", firstMessage));
        sessions.put(session, new CopyOnWriteArrayList<>(List.of(
                new HashMap<>(Map.of("role", "ai", "content", firstMessage))
        )));
        session.sendMessage(new TextMessage(jsonTextConverter("firstmessage",firstMessage)));
        //sessions.put(session, new ArrayList<>());
        System.out.println("New connection: " + session);
        System.out.println("1");
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws IOException {
        String payload = message.getPayload();

        if(payload.startsWith("Bearer ")){
            String token = null;
            String email = null;
            token = payload.substring(7);
            if(token.length() > 7) {
                if (token != null) {
                    email = jwtService.extractUserName(token);
                }
            }

            if(email != null){
                UserPrincipal user = (UserPrincipal) userServices.loadUserByUsername(email);
                String sys_msg = "user_name-"+user.getFirstName()+", religion-"+user.getReligion();
                if(user.kandyResident()){
                    sys_msg = sys_msg + ", user lives in kandy(consider Kandy law also).";
                }
                System.out.println("sysmsg:"+sys_msg);
                authenticatedSessions.add(session);
                sessions.get(session).add(Map.of("role", "system", "content", sys_msg));
                session.sendMessage(new TextMessage("{\"auth\":\"AUTH_SUCCESS\"}"));
            }else {
                session.sendMessage(new TextMessage("{\"Error\":\"Invalid token\"}"));
                session.close(CloseStatus.POLICY_VIOLATION.withReason("Invalid Token"));
            }
            System.out.println("3");
            return;
        }


        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, String> map = objectMapper.readValue(payload, Map.class);

        lang = map.get("lang"); // "Eng"
        String msg = map.get("msg");

        if (lang.equals("Sin")){
            msg = translationService.translateText(msg,"en");
        }
        if(sessions.containsKey(session)){

            sessions.get(session).add(Map.of("role", "human", "content", msg));

            new Thread(() -> runScript(session)).start();

            //System.out.println("methana");
            //String s = translationService.translateText(payload,"si");
            //System.out.println(s);
            //session.sendMessage(new TextMessage(s));
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        sessions.remove(session);
        System.out.println("Disconnected: " + session.getId());
    }

    private void runScript(WebSocketSession session) {
        try {
            System.out.println("6");
            AtomicReference<String> fullMessage = new AtomicReference<>(" ");
            // Create callback to send output via WebSocket
            Consumer<String> outputHandler = line -> {
                try {
                    fullMessage.set(fullMessage + line);

                    String[] lines = line.split("\n", -1);

                    for (int i = 0; i < lines.length; i++) {
                        System.out.println(lines[i]);
                        if(lang.equals("Eng")) {
                            session.sendMessage(new TextMessage(jsonTextConverter("message", line)));
                        }else{
                            String conmsg = translationService.translateText(line,"si");
                            session.sendMessage(new TextMessage(jsonTextConverter("message",conmsg)));
                        }
                        session.sendMessage(new TextMessage(jsonTextConverter("message","\\n")));
                    }

                } catch (IOException e) {
                    // Handle send error
                }
            };
            pythonService.executePythonScript(sessions.get(session),outputHandler);
            sessions.computeIfAbsent(session, k -> new CopyOnWriteArrayList<>())
                    .add(Map.of("role", "ai", "content", fullMessage.get()));
            if (lang.equals("Sin")){
                String conmsg = translationService.translateText(String.valueOf(fullMessage),"si");
                session.sendMessage(new TextMessage(jsonTextConverter("message",conmsg)));
            }

        } catch (Exception e) {
            try {
                session.sendMessage(new TextMessage("Error: " + e.getMessage()));
            } catch (IOException ex) {
                // Handle error
            }
        }
    }
}
