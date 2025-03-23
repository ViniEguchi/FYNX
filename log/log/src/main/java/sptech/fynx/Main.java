package sptech.fynx;

import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        String[] tarefas = {"Processo 1", "Processo 2", "Processo 3"};
        Log.generateLog(tarefas);

        Scanner scanner = new Scanner(System.in);
        System.out.print("\nDigite o nome do processo para consultar o log: ");
        String consulta = scanner.nextLine().trim();    
        Log.consultarLog(consulta);
    }
}
