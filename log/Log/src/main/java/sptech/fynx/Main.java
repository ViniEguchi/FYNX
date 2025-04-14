package sptech.fynx;

import sptech.fynx.dao.ConexaoBD;
import sptech.fynx.dao.DadosDAO;
import sptech.fynx.dao.LogDAO;

public class Main {
    public static void main(String[] args) {
        String caminhoArquivo = "C:\\Users\\giopa\\Downloads\\tratamento_dados.xlsx";

        // Conectar ao banco
        ConexaoBD conexaoBD = new ConexaoBD();

        // Criação do objeto DadosDAO e LogDAO já com o DataSource
        DadosDAO dadosDAO = new DadosDAO(conexaoBD.getConexaoBD());
        LogDAO logDAO = new LogDAO(conexaoBD.getConexaoBD());

        // Ler a planilha e inserir os dados no banco
        LeitorExcel leitor = new LeitorExcel();
        leitor.lerPlanilha(caminhoArquivo, dadosDAO, logDAO);  // Passando logDAO como argumento
    }
}
