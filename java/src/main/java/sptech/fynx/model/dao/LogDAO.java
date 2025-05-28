package sptech.fynx.model.dao;

import org.springframework.jdbc.core.JdbcTemplate;
import sptech.fynx.model.LogModel;

import javax.sql.DataSource;
import java.sql.Timestamp;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

public class LogDAO extends BaseDAO {

    public LogDAO(DataSource dataSource) {
        super(dataSource); // Chama o construtor do BaseDAO para inicializar jdbcTemplate
    }

    public void inserirLog(LogModel log) {
        String sql = "INSERT INTO log (data_hora_inicio, data_hora_fim, descricao, status_log, erro) VALUES (?, ?, ?, ?, ?)";

        try {
            // Convertendo para Zona Horária Brasil (São Paulo)
            ZonedDateTime dataHoraInicioBrasilia = log.getDataHoraInicio() != null
                    ? log.getDataHoraInicio().atZone(ZoneId.of("America/Sao_Paulo"))
                    : null;

            ZonedDateTime dataHoraFimBrasilia = log.getDataHoraFim() != null
                    ? log.getDataHoraFim().atZone(ZoneId.of("America/Sao_Paulo"))
                    : null;

            // Convertendo para UTC
            Timestamp dataHoraInicioUTC = log.getDataHoraInicio() != null
                    ? Timestamp.from(log.getDataHoraInicio().atZone(ZoneId.of("UTC")).toInstant())
                    : null;

            Timestamp dataHoraFimUTC = log.getDataHoraFim() != null
                    ? Timestamp.from(log.getDataHoraFim().atZone(ZoneId.of("UTC")).toInstant())
                    : null;

            // Formatando as datas
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");
            String dataHoraInicioFormatada = dataHoraInicioBrasilia != null
                    ? formatter.format(dataHoraInicioBrasilia)
                    : "N/A";

            String dataHoraFimFormatada = dataHoraFimBrasilia != null
                    ? formatter.format(dataHoraFimBrasilia)
                    : "N/A";

            // Logs para Debug
            System.out.println("======= Início do Log =======");
            System.out.println("Nome: " + log.getNome());
            System.out.println("Status: " + (log.getStatusLog() ? "Sucesso" : "Falha"));
            System.out.println("Erro: " + (log.getErro() != null ? log.getErro() : "Nenhum"));
            System.out.println("Início: " + dataHoraInicioFormatada);
            System.out.println("Fim: " + dataHoraFimFormatada);

            // Testando conexão com o banco
            jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            System.out.println("Conexão com o banco testada com sucesso.");

            // Inserindo log no banco
            jdbcTemplate.update(sql, dataHoraInicioUTC, dataHoraFimUTC, log.getNome(), log.getStatusLog(), log.getErro());
            System.out.println("Log inserido com sucesso.");
            System.out.println("======= Fim do Log =======\n");

        } catch (Exception e) {
            System.err.println("Erro ao inserir log:");
            e.printStackTrace();
        }
    }
}
