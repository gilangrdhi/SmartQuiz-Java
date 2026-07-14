package com.smartquiz.repository;

import com.smartquiz.model.Question;
import com.smartquiz.config.DatabaseConfig;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

public class QuestionRepository {

    public List<Question> getAllQuestions() {
        List<Question> questions = new ArrayList<>();
        String sql = "SELECT * FROM questions";
        
        try (Connection conn = DatabaseConfig.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
             
            while (rs.next()) {
                int id = rs.getInt("id");
                String teksSoal = rs.getString("teks_soal");
                String[] opsi = {
                    rs.getString("opsi_a"),
                    rs.getString("opsi_b"),
                    rs.getString("opsi_c"),
                    rs.getString("opsi_d")
                };
                String kunci = rs.getString("kunci_jawaban");
                
                Question q = new Question(id, teksSoal, opsi, kunci);
                questions.add(q);
            }
        } catch (SQLException e) {
            System.out.println("Gagal mengambil data dari database.");
            e.printStackTrace();
        }
        return questions;
    }

    public void addQuestion(Question question) {
        String sql = "INSERT INTO questions (teks_soal, opsi_a, opsi_b, opsi_c, opsi_d, kunci_jawaban) VALUES (?, ?, ?, ?, ?, ?)";
        
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
             
            pstmt.setString(1, question.getTextSoal());
            pstmt.setString(2, question.getPilihanGanda()[0]);
            pstmt.setString(3, question.getPilihanGanda()[1]);
            pstmt.setString(4, question.getPilihanGanda()[2]);
            pstmt.setString(5, question.getPilihanGanda()[3]);
            pstmt.setString(6, question.getKunciJawaban());
            pstmt.executeUpdate();
            
        } catch (SQLException e) {
            System.out.println("Gagal menyimpan soal ke database.");
            e.printStackTrace();
        }
    }

    public void deleteQuestion(int id) {
        String sql = "DELETE FROM questions WHERE id = ?";
        
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
             
            pstmt.setInt(1, id);
            
            int barisYangBerubah = pstmt.executeUpdate();
            
            if (barisYangBerubah > 0) {
                System.out.println("[DATABASE] Soal dengan ID " + id + " berhasil dimusnahkan!");
            } else {
                System.out.println("[DATABASE] Soal dengan ID " + id + " tidak ditemukan.");
            }
            
        } catch (SQLException e) {
            System.out.println("Gagal menghapus soal dari database.");
            e.printStackTrace();
        }
    }

    public void updateQuestion(Question question) {
        String sql = "UPDATE questions SET teks_soal = ?, opsi_a = ?, opsi_b = ?, opsi_c = ?, opsi_d = ?, kunci_jawaban = ? WHERE id = ?";
        
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
             
            pstmt.setString(1, question.getTextSoal());
            pstmt.setString(2, question.getPilihanGanda()[0]);
            pstmt.setString(3, question.getPilihanGanda()[1]);
            pstmt.setString(4, question.getPilihanGanda()[2]);
            pstmt.setString(5, question.getPilihanGanda()[3]);
            pstmt.setString(6, question.getKunciJawaban());
            pstmt.setInt(7, question.getId());
            
            int barisYangBerubah = pstmt.executeUpdate();
            
            if (barisYangBerubah > 0) {
                System.out.println("[DATABASE] Soal dengan ID " + question.getId() + " berhasil diperbarui!");
            } else {
                System.out.println("[DATABASE] Soal dengan ID " + question.getId() + " tidak ditemukan.");
            }
            
        } catch (SQLException e) {
            System.out.println("Gagal memperbarui soal di database.");
            e.printStackTrace();
        }
    }
}