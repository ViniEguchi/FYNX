package sptech.fynx;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;

public class LeitorExcel {

/*
public void lerPlanilhaS3(String bucket, String key) {
    try {

        S3Client s3 = AwsS3Config.createS3Client();

        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .build();

        InputStream arquivo = s3.getObject(getObjectRequest);

        Workbook workbook = new XSSFWorkbook(arquivo);
        Sheet sheet = workbook.getSheetAt(0);

        for (Row row : sheet) {
            for (Cell cell : row) {
                switch (cell.getCellType()) {
                    case STRING:
                        System.out.print(cell.getStringCellValue() + " | ");
                        break;
                    case NUMERIC:
                        System.out.print(cell.getNumericCellValue() + " | ");
                        break;
                    case BOOLEAN:
                        System.out.print(cell.getBooleanCellValue() + " | ");
                        break;
                    default:
                        System.out.print("Tipo não suportado | ");
                }
            }
            System.out.println();
        }

        workbook.close();

    } catch (IOException e) {
        e.printStackTrace();
        System.out.println("Erro ao ler o arquivo do S3.");
    }
}
*/


    public void lerPlanilha(String caminho) {
        try {
            //Path --> classe do java.nio.File
            //Path.of --> Método estatico da classe Path que cria um objeto de caminho atraves da string

            Path caminhoPath = Path.of(caminho);

            //InputStream --> classe do java que representa um fluxo de dados de entrada de um arquivo
            //Files --> classe do java que lida com arquivos e diretorios

            InputStream arquivo = Files.newInputStream(caminhoPath);

            //Workbook --> é a classe principal do ApachePOI.

            // E como funciona? --> dentro dessa classe contém todos os métodos métodos para manipular planilhas,
            // linhas e células.

            //Instanciando um objeto do tipo Workbook e passando o arquivo como parametro (byte-->objeto)
            Workbook workbook = new XSSFWorkbook(arquivo);

            //sheet é a "aba" da planilha
            Sheet sheet = workbook.getSheetAt(0);

            //Row --> linhas --> for percorre todas as linhas da "aba"
            for (Row row : sheet) {
                //cell ---> for pra percorrer cada celula em cada linha
                for (Cell cell : row) {
                    // getCellType --> metodo para verificar qual o tipo q esta na celula
                    switch (cell.getCellType()) {
                        //value para retornar o valor
                        case STRING:
                            System.out.print(cell.getStringCellValue() + " | ");
                            break;
                        case NUMERIC:
                            System.out.print(cell.getNumericCellValue() + " | ");
                            break;
                        case BOOLEAN:
                            System.out.print(cell.getBooleanCellValue() + " | ");
                            break;
                        default:
                            System.out.print("Tipo não suportado | ");
                    }
                }
                System.out.println();
            }

            //liberar os recursos
            workbook.close();

            //exceção caso o arquivo n possa ser lido
        } catch (IOException e) {
            e.printStackTrace();
            System.out.println("Erro ao ler o arquivo. Verifique o caminho.");
        }
    }
}
