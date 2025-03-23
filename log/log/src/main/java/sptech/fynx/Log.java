package sptech.fynx;

import java.sql.SQLException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
<<<<<<< HEAD
import java.util.concurrent.ThreadLocalRandom;

public class Log {
    static List<String> logs = new ArrayList<>();

    public static void generateLog(String[] processes) {
=======
import java.util.Scanner;
import java.util.concurrent.ThreadLocalRandom;

public class Log {
    public static List<String> generateLog(String[] processes) {
        List<String> logMessages = new ArrayList<>();
>>>>>>> 2497fa5f3e9f50f073d043500cf781f84c122004
        DateTimeFormatter dateFormat = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
        LocalDateTime now;
        int status, delay;

        now = LocalDateTime.now();
<<<<<<< HEAD
        String inicio = String.format("%s - Iniciando processo...\n", now.format(dateFormat));
        logs.add(inicio);
        System.out.print(inicio);
=======
        logMessages.add(String.format("Iniciando processo... [%s]", now.format(dateFormat)));
>>>>>>> 2497fa5f3e9f50f073d043500cf781f84c122004

        for (String process : processes) {
            try {
                delay = ThreadLocalRandom.current().nextInt(1000, 5000);
                status = ThreadLocalRandom.current().nextInt(1, 3);

                Thread.sleep(delay);

                now = LocalDateTime.now();
<<<<<<< HEAD
                String log = String.format("%s - Processo '%s' concluído. Status: %d\n",
                        now.format(dateFormat), process, status);
                logs.add(log);
                System.out.print(log);
=======
                String log = String.format("Processo '%s' concluído. Status: %d. [%s]",
                        process, status, now.format(dateFormat));
>>>>>>> 2497fa5f3e9f50f073d043500cf781f84c122004

                logMessages.add(log);

            } catch (InterruptedException e) {
                now = LocalDateTime.now();
<<<<<<< HEAD
                String erro = String.format("%s - Ocorreu uma falha no procedimento '%s'. Erro: %s\n",
                        now.format(dateFormat), process, e.getMessage());
                logs.add(erro);
                System.err.print(erro);
=======
                String log = String.format("Ocorreu uma falha no procedimento '%s'. [%s] Erro: %s",
                        process, now.format(dateFormat), e.getMessage());
                logMessages.add(log);
                System.err.println(log);
>>>>>>> 2497fa5f3e9f50f073d043500cf781f84c122004
                Thread.currentThread().interrupt();
            }
        }

        now = LocalDateTime.now();
<<<<<<< HEAD
        String fim = String.format("%s - Operação finalizada!\n", now.format(dateFormat));
        logs.add(fim);
        System.out.print(fim);
    }

    public static void consultarLog(String processo) {
        System.out.println("\n=== Consulta de Logs ===");
        boolean encontrado = false;
        for (String log : logs) {
            if (log.toLowerCase().contains(processo.toLowerCase())) {
                System.out.print(log);
                encontrado = true;
            }
        }
        if (!encontrado) {
            System.out.println("Nenhum log encontrado para o processo: " + processo);
        }
=======
        logMessages.add(String.format("Operação finalizada! [%s]", now.format(dateFormat)));

        logMessages.forEach(System.out::println);

        return logMessages;
    }

    public static void exibirProcessoEspecifico(List<String> logMessages, String processoDesejado) {
        System.out.println("\nExibindo logs do processo desejado:");
        logMessages.stream()
                .filter(log -> log.contains(processoDesejado))
                .forEach(System.out::println);
>>>>>>> 2497fa5f3e9f50f073d043500cf781f84c122004
    }
}
