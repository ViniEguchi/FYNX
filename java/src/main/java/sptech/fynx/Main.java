package sptech.fynx;

import org.json.JSONObject;
import sptech.fynx.extracao.LeitorExcel;
import sptech.fynx.model.dao.ConexaoBD;
import sptech.fynx.model.dao.DadosDAO;
import sptech.fynx.model.dao.LogDAO;
import sptech.fynx.slack.Slack;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

public class Main {
    public static void main(String[] args) {

        // Variáveis de ambiente
        String bucketName = System.getenv("BUCKET_NAME");
        String nomeArquivo = System.getenv("ARCHIEVE_NAME");

        // Formatter para timestamp nas mensagens (ex: terça-feira, 28 de maio de 2025 às 14:30:55)
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("EEEE, dd 'de' MMMM 'de' yyyy 'às' HH:mm:ss")
                .withLocale(new Locale("pt", "BR"));

        // Conexão e DAOs
        ConexaoBD conexaoBD = new ConexaoBD();
        DadosDAO dadosDAO = new DadosDAO(conexaoBD.getConexaoBD());
        LogDAO logDAO = new LogDAO(conexaoBD.getConexaoBD());

        try {
            // Mensagem inicial para o Slack
            String msgInicio = String.format(
                    "🚀 Parabéns! A carga do arquivo foi iniciada com sucesso na %s.",
                    LocalDateTime.now().format(formatter)
            );
            JSONObject jsonInicio = new JSONObject();
            jsonInicio.put("text", msgInicio);
            Slack.sendMessage(jsonInicio);

            // Leitura da planilha e inserção no banco de dados
            LeitorExcel leitor = new LeitorExcel();
            leitor.lerPlanilha(bucketName, nomeArquivo, dadosDAO, logDAO);

            // Mensagem final para o Slack
            String msgFim = String.format(
                    "✅ Uhuu! Carga finalizada com sucesso na %s.",
                    LocalDateTime.now().format(formatter)
            );
            JSONObject jsonFim = new JSONObject();
            jsonFim.put("text", msgFim);
            Slack.sendMessage(jsonFim);

        } catch (IOException | InterruptedException e) {
            e.printStackTrace();

            // Mensagem de erro para o Slack
            try {
                String msgErro = String.format(
                        "⚠️ Ocorreu um erro durante a carga do arquivo na %s.\n" +
                                "Sentimos muito 😔, nossa equipe já está trabalhando para resolver o problema!",
                        LocalDateTime.now().format(formatter)
                );
                JSONObject jsonErro = new JSONObject();
                jsonErro.put("text", msgErro);
                Slack.sendMessage(jsonErro);
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        }
    }
}
