package sptech.fynx;

import sptech.fynx.extracao.LeitorExcel;
import sptech.fynx.model.dao.ConexaoBD;
import sptech.fynx.model.dao.DadosDAO;
import sptech.fynx.model.dao.LogDAO;

public class Main {
    public static void main(String[] args) {

        // ===== VERSÃO S3 =====
        String bucketName = System.getenv("BUCKET_NAME"); // Altere para o nome do seu bucket
        String nomeArquivo = System.getenv("ARCHIEVE_NAME"); // Caminho do arquivo dentro do bucket

        ConexaoBD conexaoBD = new ConexaoBD();
        DadosDAO dadosDAO = new DadosDAO(conexaoBD.getConexaoBD());
        LogDAO logDAO = new LogDAO(conexaoBD.getConexaoBD());

        LeitorExcel leitor = new LeitorExcel();
        leitor.lerPlanilha(bucketName, nomeArquivo, dadosDAO, logDAO); // Lê diretamente do S3



        // ===== VERSÃO LOCAL (COMENTADA) =====
        /*
        String caminhoArquivo = "C:\\Users\\giopa\\Downloads\\tratamento_dados.xlsx";

        // Conectar ao banco
        ConexaoBD conexaoBD = new ConexaoBD();

        // Criação do objeto DadosDAO e LogDAO já com o DataSource
        DadosDAO dadosDAO = new DadosDAO(conexaoBD.getConexaoBD());
        LogDAO logDAO = new LogDAO(conexaoBD.getConexaoBD());

        // Ler a planilha e inserir os dados no banco
        LeitorExcel leitor = new LeitorExcel();
        leitor.lerPlanilha(caminhoArquivo, dadosDAO, logDAO);  // Passando logDAO como argumento
        */
    }
}
