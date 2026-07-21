package com.smartquiz.smartquiz_api.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "nama", nullable = false, unique = true)
    private String nama;

    @Column(name = "warna_avatar", nullable = false)
    private String warnaAvatar = "#4bb8fa";

    @Column(name = "jenis_topi", nullable = false)
    private String jenisTopi = "none";

    @Column(name = "pose_id", nullable = false)
    private String poseId = "pose1";

    @Column(name = "topi_x")
    private Integer topiX;

    @Column(name = "topi_y")
    private Integer topiY;

    @Column(name = "topi_width")
    private Integer topiWidth;

    @Column(name = "topi_height")
    private Integer topiHeight;

    @Column(name = "topi_rotation")
    private Integer topiRotation;

    @Column(name = "total_quiz")
    private Integer totalQuiz = 0;

    @Column(name = "total_poin")
    private Integer totalPoin = 0;

    @Column(name = "kuis_menang")
    private Integer kuisMenang = 0;

    @Column(name = "tingkat_kemenangan")
    private Double tingkatKemenangan = 0.0;

    @ElementCollection
    @CollectionTable(name = "user_buffs", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "buff_name")
    private List<String> activeBuffs = new ArrayList<>();

    public User() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getNama() { return nama; }
    public void setNama(String nama) { this.nama = nama; }

    public String getWarnaAvatar() { return warnaAvatar; }
    public void setWarnaAvatar(String warnaAvatar) { this.warnaAvatar = warnaAvatar; }

    public String getJenisTopi() { return jenisTopi; }
    public void setJenisTopi(String jenisTopi) { this.jenisTopi = jenisTopi; }

    public String getPoseId() { return poseId; }
    public void setPoseId(String poseId) { this.poseId = poseId; }

    public Integer getTopiX() { return topiX; }
    public void setTopiX(Integer topiX) { this.topiX = topiX; }

    public Integer getTopiY() { return topiY; }
    public void setTopiY(Integer topiY) { this.topiY = topiY; }

    public Integer getTopiWidth() { return topiWidth; }
    public void setTopiWidth(Integer topiWidth) { this.topiWidth = topiWidth; }

    public Integer getTopiHeight() { return topiHeight; }
    public void setTopiHeight(Integer topiHeight) { this.topiHeight = topiHeight; }

    public Integer getTopiRotation() { return topiRotation; }
    public void setTopiRotation(Integer topiRotation) { this.topiRotation = topiRotation; }

    public Integer getTotalQuiz() { return totalQuiz; }
    public void setTotalQuiz(Integer totalQuiz) { this.totalQuiz = totalQuiz; }

    public Integer getTotalPoin() { return totalPoin; }
    public void setTotalPoin(Integer totalPoin) { this.totalPoin = totalPoin; }

    public Integer getKuisMenang() { return kuisMenang; }
    public void setKuisMenang(Integer kuisMenang) { this.kuisMenang = kuisMenang; }

    public Double getTingkatKemenangan() { return tingkatKemenangan; }
    public void setTingkatKemenangan(Double tingkatKemenangan) { this.tingkatKemenangan = tingkatKemenangan; }

    public List<String> getActiveBuffs() { return activeBuffs; }
    public void setActiveBuffs(List<String> activeBuffs) { this.activeBuffs = activeBuffs; }

    public void calculateTingkatKemenangan() {
        if (this.totalQuiz != null && this.totalQuiz > 0) {
            this.tingkatKemenangan = ((double) this.kuisMenang / this.totalQuiz) * 100;
        } else {
            this.tingkatKemenangan = 0.0;
        }
    }
}