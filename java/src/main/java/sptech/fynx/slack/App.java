package sptech.fynx.slack;

import org.json.JSONObject;

import java.io.IOException;

public class App {
    public static void main(String[] args) {

        JSONObject json = new JSONObject();

        try {
            json.put("text", "Teste 1" );
            Slack.sendMessage(json);
        } catch (IOException | InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

}
