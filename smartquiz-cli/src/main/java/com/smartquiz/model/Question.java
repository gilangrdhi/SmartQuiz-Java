package com.smartquiz.model;

public class Question {
    private int id;
    private String textSoal;
    private String[] pilihanGanda;
    private String kunciJawaban;

    public Question(int id, String textSoal, String[] pilihanGanda, String kunciJawaban) {
        this.id = id;
        this.textSoal = textSoal;
        this.pilihanGanda = pilihanGanda;
        this.kunciJawaban = kunciJawaban;
    }

    public int getId() {
        return id;
    }

    public String getTextSoal() {
        return textSoal;
    }

    public String[] getPilihanGanda() {
        return pilihanGanda;
    }

    public String getKunciJawaban() {
        return kunciJawaban;
    }
}
