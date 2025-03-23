package sptech.fynx;

<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
import java.util.List;
>>>>>>> 2497fa5f3e9f50f073d043500cf781f84c122004
>>>>>>> 82d3e5bc3cfb95ca554586b841e8b480978ef28c
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        String[] tarefas = {"Processo 1", "Processo 2", "Processo 3"};
<<<<<<< HEAD
        Log.generateLog(tarefas);

        Scanner scanner = new Scanner(System.in);
        System.out.print("\nDigite o nome do processo para consultar o log: ");
        String consulta = scanner.nextLine().trim();    
        Log.consultarLog(consulta);
=======
        Scanner scanner = new Scanner(System.in);

        Log.generateLog(tarefas);

<<<<<<< HEAD
        scanner.close();
=======
        System.out.print("Digite o nome do processo que deseja visualizar: ");
        String processoDesejado = scanner.nextLine();

        Log.exibirProcessoEspecifico(logMessages, processoDesejado);
>>>>>>> 2497fa5f3e9f50f073d043500cf781f84c122004
>>>>>>> 82d3e5bc3cfb95ca554586b841e8b480978ef28c
    }
}

