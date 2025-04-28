package sptech.fynx.model.dao;

import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.JdbcTemplate;
import sptech.fynx.model.DadosModel;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

public class DadosDAO {

    //atributo - jdbcTembplate pra usar o framework mais facilmente pras querrys

    private final JdbcTemplate jdbcTemplate;

    //conexão com o banco -- COnecction é uma interface do JDBC
    private final Connection conexao;

    public DadosDAO(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource); // Inicializa o JdbcTemplate com o DataSource

        // testar conexão -- variavel começa nula
        Connection tempConexao = null;

        try {

            // Tenta obter uma conexão a partir do DataSource
            tempConexao = jdbcTemplate.getDataSource().getConnection(); // Obtém a conexão do DataSource
            criarTabela();
        } catch (SQLException e) {
            e.printStackTrace();  // Tratamento de exceção

        } finally {
            this.conexao = tempConexao;  // Atribui a conexão (null caso falhe)
        }
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

    public Connection getConexao() {
        return conexao;
    }

    public void inserirDadosEmLote(List<DadosModel> dadosList) {
        String sql = """
                    INSERT INTO historico (
                        data_contratacao, valor_operacao, valor_desenbolsado, fonte_recurso, 
                        custo_financeiro, juros, prazo_carencia, prazo_amortizacao, produto, 
                        setor_cnae, subsetor_cnae, cnae, situacao_operacao
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """;

        // Tamanho do lote (pode ser ajustado conforme necessidade)
        int batchSize = 2000;

        // Inserir os dados em lote
        for (int i = 0; i < dadosList.size(); i += batchSize) {
            int end = Math.min(i + batchSize, dadosList.size());
            List<DadosModel> sublist = dadosList.subList(i, end);

            // Executar a inserção em lote com o BatchPreparedStatementSetter
            jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
                @Override
                public void setValues(PreparedStatement ps, int i) throws SQLException {
                    DadosModel dados = sublist.get(i);
                    ps.setDate(1, dados.getDataContratacao());
                    ps.setDouble(2, dados.getValorOperacao());
                    ps.setDouble(3, dados.getValorDesenbolsado());
                    ps.setString(4, dados.getFonteRecurso());
                    ps.setString(5, dados.getCustoFinanceiro());
                    ps.setFloat(6, dados.getJuros());
                    ps.setInt(7, dados.getPrazoCarencia());
                    ps.setInt(8, dados.getPrazoAmortizacao());
                    ps.setString(9, dados.getProduto());
                    ps.setString(10, dados.getSetorCnae());
                    ps.setString(11, dados.getSubsetorCnae());
                    ps.setString(12, dados.getCnae());
                    ps.setString(13, dados.getSituacaoOperacao());
                }

                @Override
                public int getBatchSize() {
                    return sublist.size();
                }
            });


        }
    }
}
