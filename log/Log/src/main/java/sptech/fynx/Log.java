package sptech.fynx;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

public class Log {

    static List<String> logs = new ArrayList<>();

    public static void generateLog(String[] processes) {
        DateTimeFormatter dateFormat = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
        LocalDateTime now = LocalDateTime.now();

        String inicio = String.format("%s - Iniciando processo...\n", now.format(dateFormat));
        logs.add(inicio);
        System.out.print(inicio);

        for (String process : processes) {
            try {
                int delay = ThreadLocalRandom.current().nextInt(1000, 5000);
                int status = ThreadLocalRandom.current().nextInt(1, 3);

                Thread.sleep(delay);

                now = LocalDateTime.now();
                String log = String.format("%s - Processo '%s' concluído. Status: %d\n",
                        now.format(dateFormat), process, status);
                logs.add(log);
                System.out.print(log);

            } catch (InterruptedException e) {
                now = LocalDateTime.now();
                String erro = String.format("%s - Ocorreu uma falha no procedimento '%s'. Erro: %s\n",
                        now.format(dateFormat), process, e.getMessage());
                logs.add(erro);
                System.err.print(erro);
                Thread.currentThread().interrupt();
            }
        }

        now = LocalDateTime.now();
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
    }
}
