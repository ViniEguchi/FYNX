package sptech.fynx;

import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        String[] tarefas = {"Processo 1", "Processo 2", "Processo 3"};
        Scanner scanner = new Scanner(System.in);

        Log.generateLog(tarefas);

        scanner.close();
    }
}

