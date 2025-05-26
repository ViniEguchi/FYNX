package sptech.fynx.model;

import java.time.LocalDateTime;

public class LogModel {

    private LocalDateTime dataHoraInicio;
    private LocalDateTime dataHoraFim;
    private String nome;
    private Boolean statusLog;
    private String erro;

    // === CONSTRUTORES ===

    // Log simples: nome, início e status
    public LogModel(String nome, LocalDateTime dataHoraInicio, boolean statusLog) {
        this.nome = nome;
        this.dataHoraInicio = dataHoraInicio;
        this.statusLog = statusLog;
    }

    // Log com início, fim e status
    public LogModel(String nome, LocalDateTime dataHoraInicio, LocalDateTime dataHoraFim, boolean statusLog) {
        this.nome = nome;
        this.dataHoraInicio = dataHoraInicio;
        this.dataHoraFim = dataHoraFim;
        this.statusLog = statusLog;
    }

    // Log com erro
    public LogModel(String nome, LocalDateTime dataHoraInicio, LocalDateTime dataHoraFim, boolean statusLog, String erro) {
        this.nome = nome;
        this.dataHoraInicio = dataHoraInicio;
        this.dataHoraFim = dataHoraFim;
        this.statusLog = statusLog;
        this.erro = erro;
    }

    // === GETTERS E SETTERS ===

    public LocalDateTime getDataHoraInicio() {
        return dataHoraInicio;
    }

    public void setDataHoraInicio(LocalDateTime dataHoraInicio) {
        this.dataHoraInicio = dataHoraInicio;
    }

    public LocalDateTime getDataHoraFim() {
        return dataHoraFim;
    }

    public void setDataHoraFim(LocalDateTime dataHoraFim) {
        this.dataHoraFim = dataHoraFim;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Boolean getStatusLog() {
        return statusLog;
    }

    public void setStatusLog(Boolean statusLog) {
        this.statusLog = statusLog;
    }

    public String getErro() {
        return erro;
    }

    public void setErro(String erro) {
        this.erro = erro;
    }
}
