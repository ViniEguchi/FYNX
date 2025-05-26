package sptech.fynx.slack;

import netscape.javascript.JSObject;
import org.json.JSONObject;

import java.io.IOException;
import java.io.InterruptedIOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class Slack {
    //HttpClient --> serve para realizar response e request

    private static HttpClient client = HttpClient.newHttpClient();
    private static final String URL = System.getenv("SLACK_WEBHOOK_URL");

    //HttpClient --> método estático

    //JSObject content--> argumento enviado na request
    public static void sendMessage(JSONObject content) throws IOException, InterruptedException {
        HttpRequest request = HttpRequest.newBuilder(
                URI.create(URL))
                .header("accept","application/json")
                .POST(HttpRequest.BodyPublishers.ofString(content.toString()))
                .build();

        HttpResponse<String> response = client.send(request,HttpResponse.BodyHandlers.ofString());

        System.out.println(String.format("Status: %s", response.statusCode()));
        System.out.println(String.format("Response: %s", response.body()));

    }

    }
