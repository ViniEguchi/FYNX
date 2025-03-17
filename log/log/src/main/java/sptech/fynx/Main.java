package sptech.fynx;

import java.util.List;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        String[] tarefas = {"Processo 1", "Processo 2", "Processo 3"};
        Scanner scanner = new Scanner(System.in);

        List<String> logMessages = Log.generateLog(tarefas);

        System.out.print("Digite o nome do processo que deseja visualizar: ");
        String processoDesejado = scanner.nextLine();

        Log.exibirProcessoEspecifico(logMessages, processoDesejado);
    }
}
