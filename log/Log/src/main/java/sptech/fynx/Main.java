package sptech.fynx;

import sptech.fynx.dao.ConexaoBD;
import sptech.fynx.dao.DadosDAO;

import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
/*
        String[] tarefas = {"Processo 1", "Processo 2", "Processo 3"};
        Scanner scanner = new Scanner(System.in);

        Log.generateLog(tarefas);

        System.out.print("\nDeseja consultar algum processo específico? (s/n): ");
        String resposta = scanner.nextLine();

        if (resposta.equalsIgnoreCase("s")) {
            System.out.print("Digite o nome ou parte do nome do processo: ");
            String processo = scanner.nextLine();
            Log.consultarLog(processo);
        }

        scanner.close();
*/


        ConexaoBD conexao = new ConexaoBD();
        DadosDAO dadosDAO = new DadosDAO(conexao.getConexaoBD());


        String caminhoArquivo = "C:\\Users\\Giovanna\\Downloads\\tratamento_dados.xlsx";
        LeitorExcel leitor = new LeitorExcel();
        leitor.lerPlanilha(caminhoArquivo);
    }
}
