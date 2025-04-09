package sptech.fynx.dao;

import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;

public class DadosDAO {

    private final JdbcTemplate jdbcTemplate;

    public DadosDAO(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
        criarTabela();
    }

    private void criarTabela() {
        String sql = """
            CREATE TABLE IF NOT EXISTS dados (
                idDados INT PRIMARY KEY AUTO_INCREMENT,
                data_contratacao DATE,
                valor_operacao DOUBLE,
                valor_desenbolsado DOUBLE,
                fonte_recurso VARCHAR(50),
                custo_financeiro VARCHAR(50),
                juros FLOAT,
                prazo_carencia INT,
                prazo_amortizacao INT,
                produto VARCHAR(50),
                setor_cnae VARCHAR(50),
                subsetor_cnae VARCHAR(50),
                cnae CHAR(7),
                situacao_operacao VARCHAR(50)
            )
        """;

        jdbcTemplate.execute(sql);
    }


}
