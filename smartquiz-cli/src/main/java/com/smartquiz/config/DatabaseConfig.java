package com.smartquiz.config;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException; // Pastikan import ini ada

public class DatabaseConfig {
    private static final String URL = "jdbc:mysql://localhost:3306/smartquiz_db";
    private static final String USER = "root";
    private static final String PASSWORD = "";

    public static Connection getConnection() {
        Connection connection = null;
        
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            connection = DriverManager.getConnection(URL, USER, PASSWORD);
            System.out.println("[SISTEM] Koneksi ke MySQL Berhasil!");
            
        } catch (ClassNotFoundException e) {
            System.out.println("[SISTEM] Driver MySQL tidak ditemukan! Cek pom.xml.");
        } catch (SQLException e) {
            System.out.println("[SISTEM] Gagal menyambung ke Database! Pastikan XAMPP menyala.");
            e.printStackTrace();
        }
        
        return connection;
    }
}