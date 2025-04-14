package sptech.fynx;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import sptech.fynx.dao.DadosDAO;
import sptech.fynx.dao.DadosModel;
import sptech.fynx.dao.LogDAO;
import sptech.fynx.dao.LogModel;

import java.io.FileInputStream;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Date;



public class LeitorExcel {

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


 /*
    public void lerPlanilha(String bucketName, String nomeArquivo, DadosDAO dadosDAO, LogDAO logDAO) {
        S3Client s3 = null;
        InputStream inputStream = null;
        Workbook workbook = null;
        Connection conn = dadosDAO.getConexao();
        int contador = 0;

        System.out.println("Iniciando leitura...");

        // Log inicial da leitura
        LogModel logInicio = new LogModel();
        logInicio.setNome("Iniciando leitura...");
        logInicio.setDataHoraInicio(getDataHoraBrasilia());
        logInicio.setStatusLog(true);
        logDAO.inserirLog(logInicio);

        try {
            // Conectar ao S3
            s3 = criarClienteS3();

            // Baixar o arquivo do S3
            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(bucketName)
                    .key(nomeArquivo)
                    .build();
            inputStream = s3.getObject(getObjectRequest);

            workbook = new XSSFWorkbook(inputStream);
            Sheet sheet = workbook.getSheetAt(0);

            conn.setAutoCommit(false);

            for (Row row : sheet) {
                if (row.getRowNum() == 0) continue;

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

                dadosDAO.inserirDados(dados);
                contador++;

                if (contador % 1000 == 0) {
                    conn.commit();
                    System.out.println("Carga de " + contador + " linhas realizada...");

                    // Log de commit de cada 1000 linhas
                    LogModel logParcial = new LogModel();
                    logParcial.setNome("Carga de " + contador + " linhas realizada...");
                    logParcial.setDataHoraInicio(getDataHoraBrasilia());
                    logParcial.setDataHoraFim(getDataHoraBrasilia());
                    logParcial.setStatusLog(true);
                    logDAO.inserirLog(logParcial);
                }
            }

            conn.commit();
            System.out.println("Leitura realizada.");
            System.out.println("Carga finalizada com o total de " + contador + " linhas.");

            // Log de leitura finalizada (simples)
            LogModel logLeituraFim = new LogModel();
            logLeituraFim.setNome("Leitura finalizada.");
            logLeituraFim.setDataHoraInicio(getDataHoraBrasilia());
            logLeituraFim.setDataHoraFim(getDataHoraBrasilia());
            logLeituraFim.setStatusLog(true);
            logDAO.inserirLog(logLeituraFim);

            // Log final da carga completa
            LogModel logFinal = new LogModel();
            logFinal.setNome("Carga finalizada com o total de " + contador + " linhas.");
            logFinal.setDataHoraInicio(logInicio.getDataHoraInicio());
            logFinal.setDataHoraFim(getDataHoraBrasilia());
            logFinal.setStatusLog(true);
            logDAO.inserirLog(logFinal);

        } catch (Exception e) {
            e.printStackTrace();
            try {
                if (conn != null) conn.rollback();
                System.err.println("Rollback executado por erro.");

                // Log de erro
                LogModel logErro = new LogModel();
                logErro.setNome("Erro durante a leitura da planilha");
                logErro.setErro(e.getMessage());
                logErro.setDataHoraInicio(logInicio.getDataHoraInicio());
                logErro.setDataHoraFim(getDataHoraBrasilia());
                logErro.setStatusLog(false);
                logDAO.inserirLog(logErro);

            } catch (SQLException ex) {
                ex.printStackTrace();
            }
        } finally {
            try {
                if (workbook != null) workbook.close();
                if (inputStream != null) inputStream.close();
                if (conn != null) conn.setAutoCommit(true);
                if (s3 != null) s3.close();
            } catch (IOException | SQLException e) {
                e.printStackTrace();
            }
        }
    }

    private S3Client criarClienteS3() {
        // Recupera variáveis de ambiente para acessar o AWS S3
        String accessKey = System.getenv("AWS_ACCESS_KEY_ID");
        String secretKey = System.getenv("AWS_SECRET_ACCESS_KEY");
        String region = System.getenv("AWS_REGION");

        if (accessKey == null || secretKey == null || region == null) {
            throw new IllegalArgumentException("As variáveis de ambiente AWS não foram configuradas corretamente.");
        }

        AwsBasicCredentials awsCreds = AwsBasicCredentials.create(accessKey, secretKey);

        return S3Client.builder()
                .region(Region.of(region))
                .credentialsProvider(StaticCredentialsProvider.create(awsCreds))
                .build();
    }

    private String getStringCellValue(Cell cell) {
        return (cell != null && cell.getCellType() == CellType.STRING) ? cell.getStringCellValue() : "";
    }

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

    private int getIntCellValue(Cell cell) {
        return (cell != null && cell.getCellType() == CellType.NUMERIC) ? (int) cell.getNumericCellValue() : 0;
    }

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

    private LocalDateTime getDataHoraBrasilia() {
        return ZonedDateTime.now(ZoneId.of("America/Sao_Paulo")).toLocalDateTime();
    }
}
}
*/