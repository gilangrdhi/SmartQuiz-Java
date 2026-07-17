package com.smartquiz.smartquiz_api.model;

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

    @Column(name = "total_poin")
    private Integer totalPoin = 0;

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

    public Integer getTotalPoin() { return totalPoin; }
    public void setTotalPoin(Integer totalPoin) { this.totalPoin = totalPoin; }

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

}