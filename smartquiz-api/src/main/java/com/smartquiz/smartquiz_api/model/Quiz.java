package com.smartquiz.smartquiz_api.model;

import jakarta.persistence.*;

@Entity
@Table(name = "quizzes")
public class Quiz {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "judul", nullable = false)
    private String judul;

    @Column(name = "deskripsi", columnDefinition = "TEXT")
    private String deskripsi;

    @Column(name = "kategori", nullable = false)
    private String kategori = "Umum";

    @Column(name = "durasi_menit")
    private Integer durasiMenit = 10;

    @Column(name = "dibuat_oleh")
    private Long dibuatOleh;

    @Column(name = "is_published", nullable = false)
    private boolean published = true;

    public Quiz() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getJudul() { return judul; }
    public void setJudul(String judul) { this.judul = judul; }

    public String getDeskripsi() { return deskripsi; }
    public void setDeskripsi(String deskripsi) { this.deskripsi = deskripsi; }

    public String getKategori() { return kategori; }
    public void setKategori(String kategori) { this.kategori = kategori; }

    public Integer getDurasiMenit() { return durasiMenit; }
    public void setDurasiMenit(Integer durasiMenit) { this.durasiMenit = durasiMenit; }

    public Long getDibuatOleh() { return dibuatOleh; }
    public void setDibuatOleh(Long dibuatOleh) { this.dibuatOleh = dibuatOleh; }

    public boolean isPublished() { return published; }
    public void setPublished(boolean published) { this.published = published; }
}