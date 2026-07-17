package com.smartquiz.smartquiz_api.model;

import jakarta.persistence.*;

@Entity
@Table(name = "questions")

public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "teks_soal", nullable = false, columnDefinition = "TEXT")
    private String teksSoal;

    @Column(name = "opsi_a", nullable = false)
    private String opsiA;

    @Column(name = "opsi_b", nullable = false)
    private String opsiB;

    @Column(name = "opsi_c", nullable = false)
    private String opsiC;

    @Column(name = "opsi_d", nullable = false)
    private String opsiD;

    @Column(name = "kunci_jawaban", nullable = false)
    private String kunciJawaban;

    @Column(name = "kategori", nullable = false)
    private String kategori = "Umum";

    public Question() {
    }

    public Long getId() {return id;}
    public void setId(Long id) {this.id = id;}

    public String getTeksSoal() {return teksSoal;}
    public void setTeksSoal(String teksSoal) {this.teksSoal = teksSoal;}

    public String getOpsiA() {return opsiA;}
    public void setOpsiA(String opsiA) {this.opsiA = opsiA;}

    public String getOpsiB() {return opsiB;}
    public void setOpsiB(String opsiB) {this.opsiB = opsiB;}

    public String getOpsiC() {return opsiC;}
    public void setOpsiC(String opsiC) {this.opsiC = opsiC;}

    public String getOpsiD() {return opsiD;}
    public void setOpsiD(String opsiD) {this.opsiD = opsiD;}

    public String getKunciJawaban() {return kunciJawaban;}
    public void setKunciJawaban(String kunciJawaban) {this.kunciJawaban = kunciJawaban;}

    public String getKategori() { return kategori; }
    public void setKategori(String kategori) { this.kategori = kategori; }
}