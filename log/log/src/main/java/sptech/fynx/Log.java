package sptech.fynx;

import java.sql.SQLException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;
import java.util.concurrent.ThreadLocalRandom;

public class Log {
    public static List<String> generateLog(String[] processes) {
        List<String> logMessages = new ArrayList<>();
        DateTimeFormatter dateFormat = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
        LocalDateTime now;
        int status, delay;

        now = LocalDateTime.now();
        logMessages.add(String.format("Iniciando processo... [%s]", now.format(dateFormat)));

        for (String process : processes) {
            try {
                delay = ThreadLocalRandom.current().nextInt(1000, 5000);
                status = ThreadLocalRandom.current().nextInt(1, 3);

                Thread.sleep(delay);

                now = LocalDateTime.now();
                String log = String.format("Processo '%s' concluído. Status: %d. [%s]",
                        process, status, now.format(dateFormat));

                logMessages.add(log);

            } catch (InterruptedException e) {
                now = LocalDateTime.now();
                String log = String.format("Ocorreu uma falha no procedimento '%s'. [%s] Erro: %s",
                        process, now.format(dateFormat), e.getMessage());
                logMessages.add(log);
                System.err.println(log);
                Thread.currentThread().interrupt();
            }
        }

        now = LocalDateTime.now();
        logMessages.add(String.format("Operação finalizada! [%s]", now.format(dateFormat)));

        logMessages.forEach(System.out::println);

        return logMessages;
    }

    public static void exibirProcessoEspecifico(List<String> logMessages, String processoDesejado) {
        System.out.println("\nExibindo logs do processo desejado:");
        logMessages.stream()
                .filter(log -> log.contains(processoDesejado))
                .forEach(System.out::println);
    }
}
