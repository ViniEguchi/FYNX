package sptech.fynx.dao;

import org.springframework.jdbc.core.JdbcTemplate;
import javax.sql.DataSource;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;


public class LogDAO {

    private final JdbcTemplate jdbcTemplate;

    public LogDAO(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }

    public void inserirLog(LogModel log) {
        String sql = "INSERT INTO log (data_hora_inicio, data_hora_fim, nome, status_log, erro) VALUES (?, ?, ?, ?, ?)";

        try {
            // Para o console, ajusta para horário de Brasília
            //Converte o LocalDateTime para ZonedDateTime com o fuso horário de Brasília (GMT-3).
            ZonedDateTime dataHoraInicioBrasilia = log.getDataHoraInicio() != null
                    ? log.getDataHoraInicio().atZone(ZoneId.of("America/Sao_Paulo"))
                    : null;

            ZonedDateTime dataHoraFimBrasilia = log.getDataHoraFim() != null
                    ? log.getDataHoraFim().atZone(ZoneId.of("America/Sao_Paulo"))
                    : null;

            // Para o banco de dados, ajusta para UTC (sem aplicar o fuso de Brasília)
            Timestamp dataHoraInicioUTC = log.getDataHoraInicio() != null
                    ? Timestamp.from(log.getDataHoraInicio().atZone(ZoneId.of("UTC")).toInstant())
                    : null;

            Timestamp dataHoraFimUTC = log.getDataHoraFim() != null
                    ? Timestamp.from(log.getDataHoraFim().atZone(ZoneId.of("UTC")).toInstant())
                    : null;

            // Formatação para o console (não impacta no banco, apenas na saída do log)
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");
            String dataHoraInicioFormatada = dataHoraInicioBrasilia != null
                    ? formatter.format(dataHoraInicioBrasilia)
                    : "N/A";

            String dataHoraFimFormatada = dataHoraFimBrasilia != null
                    ? formatter.format(dataHoraFimBrasilia)
                    : "N/A";

            // Log no console
            System.out.println("======= Início do Log =======");
            System.out.println("Nome: " + log.getNome());
            System.out.println("Status: " + (log.getStatusLog() ? "Sucesso" : "Falha"));
            System.out.println("Erro: " + (log.getErro() != null ? log.getErro() : "Nenhum"));
            System.out.println("Início: " + dataHoraInicioFormatada);
            System.out.println("Fim: " + dataHoraFimFormatada);

            // Teste de conexão com o banco
            jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            System.out.println("Conexão com o banco testada com sucesso.");

            // Inserção no banco de dados com datas em UTC
            jdbcTemplate.update(sql, dataHoraInicioUTC, dataHoraFimUTC, log.getNome(), log.getStatusLog(), log.getErro());
            System.out.println("Log inserido com sucesso.");
            System.out.println("======= Fim do Log =======\n");

        } catch (Exception e) {
            System.err.println("Erro ao inserir log:");
            e.printStackTrace();
        }
    }
}
