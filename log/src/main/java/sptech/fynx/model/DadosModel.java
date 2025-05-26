package sptech.fynx.model;

public class DadosModel {
    private int idDados;
    private java.sql.Date dataContratacao; // o que é java.sql.Date --> classe do jdbc pra Armazenar datas em bancos (tipo DATE)
    private double valorOperacao;
    private double valorDesenbolsado;
    private String fonteRecurso;
    private String custoFinanceiro;
    private float juros;
    private int prazoCarencia;
    private int prazoAmortizacao;
    private String produto;
    private String setorCnae;
    private String subsetorCnae;
    private String cnae;
    private String situacaoOperacao;

    // Getters e Setters
    public int getIdDados() {
        return idDados;
    }

    public void setIdDados(int idDados) {
        this.idDados = idDados;
    }

    public java.sql.Date getDataContratacao() {
        return dataContratacao;
    }

    public void setDataContratacao(java.sql.Date dataContratacao) {
        this.dataContratacao = dataContratacao;
    }

    public double getValorOperacao() {
        return valorOperacao;
    }

    public void setValorOperacao(double valorOperacao) {
        this.valorOperacao = valorOperacao;
    }

    public double getValorDesenbolsado() {
        return valorDesenbolsado;
    }

    public void setValorDesenbolsado(double valorDesenbolsado) {
        this.valorDesenbolsado = valorDesenbolsado;
    }

    public String getFonteRecurso() {
        return fonteRecurso;
    }

    public void setFonteRecurso(String fonteRecurso) {
        this.fonteRecurso = fonteRecurso;
    }

    public String getCustoFinanceiro() {
        return custoFinanceiro;
    }

    public void setCustoFinanceiro(String custoFinanceiro) {
        this.custoFinanceiro = custoFinanceiro;
    }

    public float getJuros() {
        return juros;
    }

    public void setJuros(float juros) {
        this.juros = juros;
    }

    public int getPrazoCarencia() {
        return prazoCarencia;
    }

    public void setPrazoCarencia(int prazoCarencia) {
        this.prazoCarencia = prazoCarencia;
    }

    public int getPrazoAmortizacao() {
        return prazoAmortizacao;
    }

    public void setPrazoAmortizacao(int prazoAmortizacao) {
        this.prazoAmortizacao = prazoAmortizacao;
    }

    public String getProduto() {
        return produto;
    }

    public void setProduto(String produto) {
        this.produto = produto;
    }

    public String getSetorCnae() {
        return setorCnae;
    }

    public void setSetorCnae(String setorCnae) {
        this.setorCnae = setorCnae;
    }

    public String getSubsetorCnae() {
        return subsetorCnae;
    }

    public void setSubsetorCnae(String subsetorCnae) {
        this.subsetorCnae = subsetorCnae;
    }

    public String getCnae() {
        return cnae;
    }

    public void setCnae(String cnae) {
        this.cnae = cnae;
    }

    public String getSituacaoOperacao() {
        return situacaoOperacao;
    }

    public void setSituacaoOperacao(String situacaoOperacao) {
        this.situacaoOperacao = situacaoOperacao;
    }

    @Override
    public String toString() {
        return "DadosModel{" +
                "idDados=" + idDados +
                ", dataContratacao=" + dataContratacao +
                ", valorOperacao=" + valorOperacao +
                ", valorDesenbolsado=" + valorDesenbolsado +
                ", fonteRecurso='" + fonteRecurso + '\'' +
                ", custoFinanceiro='" + custoFinanceiro + '\'' +
                ", juros=" + juros +
                ", prazoCarencia=" + prazoCarencia +
                ", prazoAmortizacao=" + prazoAmortizacao +
                ", produto='" + produto + '\'' +
                ", setorCnae='" + setorCnae + '\'' +
                ", subsetorCnae='" + subsetorCnae + '\'' +
                ", cnae='" + cnae + '\'' +
                ", situacaoOperacao='" + situacaoOperacao + '\'' +
                '}';
    }
}

