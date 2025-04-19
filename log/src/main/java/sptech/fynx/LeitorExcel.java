package sptech.fynx;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.AwsSessionCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import sptech.fynx.model.dao.DadosDAO;
import sptech.fynx.model.DadosModel;
import sptech.fynx.model.dao.LogDAO;
import sptech.fynx.model.LogModel;

import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class LeitorExcel {

    // ===== VERSÃO COM AWS S3 =====
    // Método principal para ler a planilha armazenada no S3 e processar os dados
    public void lerPlanilha(String bucketName, String nomeArquivo, DadosDAO dadosDAO, LogDAO logDAO) {
        long inicio = System.currentTimeMillis(); // INÍCIO DA CONTAGEM DO TEMPO DE EXECUÇÃO
        S3Client s3 = null; // Inicializa o cliente S3
        List<DadosModel> dadosBatch = new ArrayList<>(); // Lista que armazenará os dados processados em lotes
        int contador = 0; // Contador de registros processados

        try {
            System.out.println("Iniciando leitura...");

            // Log de início - Grava um log informando que a leitura foi iniciada
            LogModel logInicio = new LogModel("Iniciando leitura...", getDataHoraBrasilia(), true);
            logDAO.inserirLog(logInicio);

            // Cria o cliente S3 para acessar o bucket
            s3 = criarClienteS3();

            // Solicitação para obter o arquivo do S3
            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(bucketName) // Nome do bucket no S3
                    .key(nomeArquivo)    // Nome do arquivo no bucket
                    .build();

            // Tenta abrir o arquivo Excel do S3
            try (InputStream inputStream = s3.getObject(getObjectRequest);
                 Workbook workbook = new XSSFWorkbook(inputStream)) { // Leitura do arquivo Excel

                Sheet sheet = workbook.getSheetAt(0); // Seleciona a primeira aba do arquivo Excel
                Connection conn = dadosDAO.getConexao(); // Obtem a conexão com o banco de dados
                conn.setAutoCommit(false); // Desativa o auto-commit para gerenciar as transações manualmente

                // Loop que percorre as linhas da planilha
                for (Row row : sheet) {
                    if (row.getRowNum() == 0) continue; // Pula o cabeçalho (primeira linha)

                    // Criação de um objeto DadosModel para armazenar as informações da linha
                    DadosModel dados = new DadosModel();
                    dados.setDataContratacao(getDateCellValue(row.getCell(0))); // Obtém a data de contratação da célula
                    dados.setValorOperacao(getNumericCellValue(row.getCell(1))); // Obtém o valor da operação da célula
                    dados.setValorDesenbolsado(getNumericCellValue(row.getCell(2))); // Obtém o valor desembolsado
                    dados.setFonteRecurso(getStringCellValue(row.getCell(3))); // Obtém a fonte de recurso
                    dados.setCustoFinanceiro(getStringCellValue(row.getCell(4))); // Obtém o custo financeiro
                    dados.setJuros(getFloatCellValue(row.getCell(5))); // Obtém o valor dos juros
                    dados.setPrazoCarencia(getIntCellValue(row.getCell(6))); // Obtém o prazo de carência
                    dados.setPrazoAmortizacao(getIntCellValue(row.getCell(7))); // Obtém o prazo de amortização
                    dados.setProduto(getStringCellValue(row.getCell(8))); // Obtém o produto
                    dados.setSetorCnae(getStringCellValue(row.getCell(9))); // Obtém o setor CNAE
                    dados.setSubsetorCnae(getStringCellValue(row.getCell(10))); // Obtém o subsetor CNAE
                    dados.setCnae(getStringCellValue(row.getCell(11))); // Obtém o código CNAE
                    dados.setSituacaoOperacao(getStringCellValue(row.getCell(12))); // Obtém a situação da operação

                    dadosBatch.add(dados); // Adiciona os dados processados no lote

                    contador++; // Incrementa o contador de registros

                    // A cada 2000 registros, realiza o commit no banco de dados
                    if (contador % 2000 == 0) {
                        dadosDAO.inserirDadosEmLote(dadosBatch); // Insere os dados do lote no banco de dados
                        conn.commit(); // Confirma a transação no banco
                        System.out.println("Carga de " + contador + " linhas realizada...");

                        // Log do progresso - Grava um log informando o progresso da carga de dados
                        LogModel logParcial = new LogModel("Carga de " + contador + " linhas realizada...",
                                getDataHoraBrasilia(), getDataHoraBrasilia(), true);
                        logDAO.inserirLog(logParcial);

                        dadosBatch.clear(); // Limpa o lote de dados após o commit
                    }
                }

                // Commit final para os registros restantes que não atingiram 2000
                if (!dadosBatch.isEmpty()) {
                    dadosDAO.inserirDadosEmLote(dadosBatch);
                    conn.commit();
                    System.out.println("Carga finalizada com o total de " + contador + " linhas.");
                }

                // Log final - Grava um log informando que a carga foi finalizada
                LogModel logFinal = new LogModel("Carga finalizada com " + contador + " linhas.",
                        logInicio.getDataHoraInicio(), getDataHoraBrasilia(), true);
                logDAO.inserirLog(logFinal);

                // Log final da leitura - Grava um log informando que a leitura foi finalizada
                LogModel logLeituraFim = new LogModel("Leitura finalizada.", getDataHoraBrasilia(), true);
                logDAO.inserirLog(logLeituraFim);

                conn.setAutoCommit(true); // Reativa o auto-commit após a carga dos dados

            }

        } catch (Exception e) {
            e.printStackTrace(); // Imprime o erro no console
            try {
                Connection conn = dadosDAO.getConexao();
                if (conn != null) conn.rollback(); // Realiza o rollback em caso de erro, revertendo a transação

                // Log de erro - Grava um log informando o erro ocorrido durante a leitura
                LogModel logErro = new LogModel("Erro durante a leitura da planilha",
                        getDataHoraBrasilia(), getDataHoraBrasilia(), false, e.getMessage());
                logDAO.inserirLog(logErro);

            } catch (SQLException ex) {
                ex.printStackTrace(); // Imprime o erro no console em caso de falha no rollback
            }

        } finally {
            long fim = System.currentTimeMillis(); // Fim da contagem de tempo
            // Exibe o tempo total de execução da leitura e processamento
            System.out.println("Tempo total de execução: " + (fim - inicio) / 1000.0 + " segundos");
            if (s3 != null) s3.close(); // Fecha o cliente S3 após o término
        }
    }

    // ===== CLIENTE S3 =====
    // Método para criar o cliente S3 usando credenciais da AWS
    private S3Client criarClienteS3() {
        // Obtém as credenciais de acesso da AWS a partir das variáveis de ambiente
        String accessKey = System.getenv("AWS_ACCESS_KEY_ID");
        String secretKey = System.getenv("AWS_SECRET_ACCESS_KEY");
        String sessionToken = System.getenv("AWS_SESSION_TOKEN");
        String region = System.getenv("AWS_REGION");

        // Verifica se as variáveis de ambiente estão configuradas corretamente
        if (accessKey == null || secretKey == null || sessionToken == null || region == null) {
            throw new IllegalArgumentException("As variáveis de ambiente AWS não foram configuradas corretamente.");
        }

        // Cria as credenciais da sessão
        AwsSessionCredentials credentials = AwsSessionCredentials.create(accessKey, secretKey, sessionToken);

        // Retorna o cliente S3 configurado
        return S3Client.builder()
                .region(Region.of(region)) // Define a região AWS
                .credentialsProvider(StaticCredentialsProvider.create(credentials)) // Fornece as credenciais
                .build();
    }

    // ===== MÉTODOS DE TRATAMENTO DE CÉLULAS =====
    // Método para obter o valor de uma célula do tipo STRING
    private String getStringCellValue(Cell cell) {
        return (cell != null && cell.getCellType() == CellType.STRING) ? cell.getStringCellValue().trim() : "";
    }

    // Método para obter o valor de uma célula do tipo NUMERIC (número com casas decimais)
    private double getNumericCellValue(Cell cell) {
        try {
            if (cell == null) return 0.0;
            return switch (cell.getCellType()) {
                case NUMERIC -> cell.getNumericCellValue(); // Se a célula for numérica, retorna o valor
                case STRING -> Double.parseDouble(cell.getStringCellValue().replace(",", ".")); // Converte string numérica para double
                default -> 0.0;
            };
        } catch (Exception e) {
            return 0.0; // Caso ocorra um erro, retorna 0.0
        }
    }

    // Método para obter o valor de uma célula do tipo FLOAT (número com casas decimais)
    private float getFloatCellValue(Cell cell) {
        try {
            if (cell == null) return 0.0f;
            return switch (cell.getCellType()) {
                case NUMERIC -> (float) cell.getNumericCellValue();
                case STRING -> Float.parseFloat(cell.getStringCellValue().replace(",", "."));
                default -> 0.0f;
            };
        } catch (Exception e) {
            return 0.0f; // Caso ocorra um erro, retorna 0.0f
        }
    }

    // Método para obter o valor de uma célula do tipo INT (número inteiro)
    private int getIntCellValue(Cell cell) {
        return (cell != null && cell.getCellType() == CellType.NUMERIC)
                ? (int) cell.getNumericCellValue()
                : 0; // Retorna 0 caso a célula esteja vazia ou com um tipo diferente
    }

    // Método para obter o valor de uma célula do tipo DATE (data)
    private java.sql.Date getDateCellValue(Cell cell) {
        try {
            if (cell != null) {
                if (cell.getCellType() == CellType.STRING) {
                    Date parsedDate = new SimpleDateFormat("yyyy-MM-dd").parse(cell.getStringCellValue());
                    return new java.sql.Date(parsedDate.getTime()); // Converte de String para java.sql.Date
                } else if (cell.getCellType() == CellType.NUMERIC && DateUtil.isCellDateFormatted(cell)) {
                    return new java.sql.Date(cell.getDateCellValue().getTime()); // Converte de Date para java.sql.Date
                }
            }
        } catch (Exception e) {
            e.printStackTrace(); // Em caso de erro, imprime a exceção
        }
        return null; // Retorna null caso não seja possível converter a célula
    }

    // Método para obter a data e hora atual no fuso horário de Brasília
    private LocalDateTime getDataHoraBrasilia() {
        return ZonedDateTime.now(ZoneId.of("America/Sao_Paulo")).toLocalDateTime();
    }
}






    /*
    // Método principal que realiza a leitura do Excel e insere os dados no banco
    public void lerPlanilha(String arquivoExcel, DadosDAO dadosDAO, LogDAO logDAO) {
        FileInputStream fis = null; // Para ler o arquivo Excel
        Workbook workbook = null;   // Representação da planilha inteira
        Connection conn = dadosDAO.getConexao(); // Conexão com o banco obtida pelo DAO
        int contador = 0; // Contador de linhas processadas

        System.out.println("Iniciando leitura...");

        // Cria um log para registrar o início da leitura
        LogModel logInicio = new LogModel();
        logInicio.setNome("Iniciando leitura...");
        logInicio.setDataHoraInicio(getDataHoraBrasilia()); // Horário de início
        logInicio.setStatusLog(true);
        logDAO.inserirLog(logInicio); // Insere log no banco

        try {
            conn.setAutoCommit(false); // Desativa o auto-commit para controlar manualmente

            // Abre o arquivo Excel para leitura
            fis = new FileInputStream(arquivoExcel);
            workbook = new XSSFWorkbook(fis);
            Sheet sheet = workbook.getSheetAt(0); // Pega a primeira aba da planilha

            // Itera sobre cada linha da planilha
            for (Row row : sheet) {
                if (row.getRowNum() == 0) continue; // Pula o cabeçalho

                // Cria o objeto DadosModel e preenche com os valores da linha
                DadosModel dados = new DadosModel();

                dados.setDataContratacao(getDateCellValue(row.getCell(0)));
                dados.setValorOperacao(getNumericCellValue(row.getCell(1)));
                dados.setValorDesenbolsado(getNumericCellValue(row.getCell(2)));
                dados.setFonteRecurso(getStringCellValue(row.getCell(3)));
                dados.setCustoFinanceiro(getStringCellValue(row.getCell(4)));
                dados.setJuros(getFloatCellValue(row.getCell(5)));
                dados.setPrazoCarencia(getIntCellValue(row.getCell(6)));
                dados.setPrazoAmortizacao(getIntCellValue(row.getCell(7)));
                dados.setProduto(getStringCellValue(row.getCell(8)));
                dados.setSetorCnae(getStringCellValue(row.getCell(9)));
                dados.setSubsetorCnae(getStringCellValue(row.getCell(10)));
                dados.setCnae(getStringCellValue(row.getCell(11)));
                dados.setSituacaoOperacao(getStringCellValue(row.getCell(12)));

                dadosDAO.inserirDados(dados); // Insere os dados no banco
                contador++; // Incrementa o número de linhas processadas

                // A cada 1000 linhas, realiza o commit no banco
                if (contador % 1000 == 0) {
                    conn.commit(); // Confirma as inserções
                    System.out.println("Carga de " + contador + " linhas realizada...");

                    // Cria um log parcial
                    LogModel logParcial = new LogModel();
                    logParcial.setNome("Carga de " + contador + " linhas realizada...");
                    logParcial.setDataHoraInicio(getDataHoraBrasilia());
                    logParcial.setDataHoraFim(getDataHoraBrasilia());
                    logParcial.setStatusLog(true);
                    logDAO.inserirLog(logParcial);
                }
            }

            conn.commit(); // Commit final
            System.out.println("Leitura realizada.");
            System.out.println("Carga finalizada com o total de " + contador + " linhas.");

            // Log de leitura finalizada (mensagem simples)
            LogModel logLeituraFim = new LogModel();
            logLeituraFim.setNome("Leitura finalizada.");
            logLeituraFim.setDataHoraInicio(getDataHoraBrasilia());
            logLeituraFim.setDataHoraFim(getDataHoraBrasilia());
            logLeituraFim.setStatusLog(true);
            logDAO.inserirLog(logLeituraFim);

            // Log com total de linhas carregadas
            LogModel logFinal = new LogModel();
            logFinal.setNome("Carga finalizada com o total de " + contador + " linhas.");
            logFinal.setDataHoraInicio(logInicio.getDataHoraInicio());
            logFinal.setDataHoraFim(getDataHoraBrasilia());
            logFinal.setStatusLog(true);
            logDAO.inserirLog(logFinal);

        } catch (IOException | SQLException e) {
            e.printStackTrace();
            try {
                if (conn != null) conn.rollback(); // Desfaz as operações em caso de erro
                System.err.println("Rollback executado por erro.");

                // Cria log de erro
                LogModel logErro = new LogModel();
                logErro.setNome("Erro durante a leitura da planilha");
                logErro.setErro(e.getMessage()); // Mensagem do erro
                logErro.setDataHoraInicio(logInicio.getDataHoraInicio());
                logErro.setDataHoraFim(getDataHoraBrasilia());
                logErro.setStatusLog(false);
                logDAO.inserirLog(logErro);

            } catch (SQLException ex) {
                ex.printStackTrace();
            }
        } finally {
            // Fecha recursos e volta o auto-commit ao normal
            try {
                if (workbook != null) workbook.close();
                if (fis != null) fis.close();
                if (conn != null) conn.setAutoCommit(true);
            } catch (IOException | SQLException e) {
                e.printStackTrace();
            }
        }
    }

    // TRATATIVAS:

    // Lê uma string da célula
    private String getStringCellValue(Cell cell) {
        return (cell != null && cell.getCellType() == CellType.STRING) ? cell.getStringCellValue() : "";
    }

    // Lê um valor numérico da célula (como double), tratando também se for string numérica
    private double getNumericCellValue(Cell cell) {
        if (cell != null) {
            if (cell.getCellType() == CellType.NUMERIC) return cell.getNumericCellValue();
            else if (cell.getCellType() == CellType.STRING) {
                try {
                    return Double.parseDouble(cell.getStringCellValue().replaceAll(",", "."));
                } catch (NumberFormatException e) {
                    return 0.0;
                }
            }
        }
        return 0.0;
    }

    // Lê um float (similar ao anterior)
    private float getFloatCellValue(Cell cell) {
        if (cell != null) {
            if (cell.getCellType() == CellType.NUMERIC) return (float) cell.getNumericCellValue();
            else if (cell.getCellType() == CellType.STRING) {
                try {
                    return Float.parseFloat(cell.getStringCellValue().replaceAll(",", "."));
                } catch (NumberFormatException e) {
                    return 0.0f;
                }
            }
        }
        return 0.0f;
    }

    // Lê um valor inteiro
    private int getIntCellValue(Cell cell) {
        return (cell != null && cell.getCellType() == CellType.NUMERIC) ? (int) cell.getNumericCellValue() : 0;
    }

    // Lê uma data da célula, tratando os dois formatos possíveis (string ou formato de data do Excel)
    private java.sql.Date getDateCellValue(Cell cell) {
        if (cell != null) {
            if (cell.getCellType() == CellType.STRING) {
                try {
                    Date parsedDate = new SimpleDateFormat("yyyy-MM-dd").parse(cell.getStringCellValue());
                    return new java.sql.Date(parsedDate.getTime());
                } catch (Exception e) {
                    e.printStackTrace();
                }
            } else if (cell.getCellType() == CellType.NUMERIC && DateUtil.isCellDateFormatted(cell)) {
                return new java.sql.Date(cell.getDateCellValue().getTime());
            }
        }
        return null;
    }

    // Retorna a data e hora atual no fuso de Brasília
    private LocalDateTime getDataHoraBrasilia() {
        return ZonedDateTime.now(ZoneId.of("America/Sao_Paulo")).toLocalDateTime();
    }
}
     */

