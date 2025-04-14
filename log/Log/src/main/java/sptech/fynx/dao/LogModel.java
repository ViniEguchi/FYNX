package sptech.fynx.dao;

import java.time.LocalDateTime;

public class LogModel {

    private LocalDateTime dataHoraInicio;
    private LocalDateTime dataHoraFim;
    private String nome;
    private Boolean statusLog;
    private String erro;

    // Getters e Setters
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
