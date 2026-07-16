package com.smartquiz.view;

import com.smartquiz.model.Question;
import com.smartquiz.service.QuizService;
import java.util.Scanner;

public class QuizView {
    private QuizService service;
    private Scanner scanner;

    public QuizView(QuizService service) {
        this.service = service;
        this.scanner = new Scanner(System.in);
    }

    public void showLogin() {
        System.out.println("===========================");
        System.out.println("   LOGIN SMARTQUIZ ADMIN   ");
        System.out.println("===========================");
        
        boolean isLoginSukses = false;
        
        while (!isLoginSukses) {
            System.out.print("Username : ");
            String username = scanner.nextLine();
            
            System.out.print("Password : ");
            String password = scanner.nextLine();
            
            if (username.equals("gilang") && password.equals("pti2026")) {
                System.out.println("Login Berhasil! Selamat datang, " + username + ".\n");
                isLoginSukses = true;
                showMenu();
            } else {
                System.out.println("Username atau Password salah! Coba lagi.\n");
            }
        }
    }

    public void showMenu() {
        boolean isRunning = true;

        while (isRunning) {
            System.out.println("\n=== DASHBOARD SMARTQUIZ ===");
            System.out.println("1. Kerjakan Kuis");
            System.out.println("2. Tambahkan Soal Baru");
            System.out.println("3. Hapus Soal");
            System.out.println("4. Edit Soal");
            System.out.println("5. Keluar Aplikasi");
            System.out.print("Pilih menu (1/2/3/4/5): ");
            
            String pilihan = scanner.nextLine();
            
            switch (pilihan) {
                case "1":
                    playQuiz();
                    break;
                case "2":
                    addQuestionView();
                    break;
                case "3":
                    deleteQuestionView();
                    break;
                case "4":
                    updateQuestionView();
                    break;
                case "5":
                    System.out.println("Terima kasih telah menggunakan SmartQuiz!");
                    isRunning = false;
                    break;
                default:
                    System.out.println("Pilihan tidak valid, silakan coba lagi.");
            }
        }
    }

    private void deleteQuestionView() {
        System.out.println("\n--- HAPUS SOAL ---");
        java.util.List<Question> questions = service.getQuestionList();

        if (questions.isEmpty()) {
            System.out.println("Tidak ada soal yang tersedia untuk dihapus.");
            return;
        }

        System.out.println("Daftar Soal:");
        for (Question question : questions) {
            System.out.println("- " + question.getId() + ". " + question.getTextSoal());
        }

        System.out.println("\nMasukkan ID soal yang ingin dihapus (masukkan 0 untuk batal): ");

        try {
            int id = Integer.parseInt(scanner.nextLine());
            if (id == 0) {
                System.out.println("Penghapusan dibatalkan.");
                return;
            }

            service.deleteQuestion(id);
        } catch (NumberFormatException e) {
            System.out.println("Input tidak valid. Silakan masukkan ID soal yang benar.");
        }
    }

    private void updateQuestionView() {
        System.out.println("\n--- EDIT SOAL ---");
        java.util.List<Question> questions = service.getQuestionList();

        if (questions.isEmpty()) {
            System.out.println("Tidak ada soal yang tersedia untuk diedit.");
            return;
        }

        System.out.println("Daftar Soal:");
        for (Question question : questions) {
            System.out.println("- " + question.getId() + ". " + question.getTextSoal());
        }

        System.out.println("\nMasukkan ID soal yang ingin diedit (masukkan 0 untuk batal): ");

        try {
            int id = Integer.parseInt(scanner.nextLine());
            if (id == 0) {
                System.out.println("Pengeditan dibatalkan.");
                return;
            }

            Question questionToEdit = null;
            for (Question q : questions) {
                if (q.getId() == id) {
                    questionToEdit = q;
                    break;
                }
            }

            if (questionToEdit == null) {
                System.out.println("Soal dengan ID tersebut tidak ditemukan.");
                return;
            }

            System.out.print("Masukkan Teks Pertanyaan Baru: ");
            String pertanyaanBaru = scanner.nextLine();
            
            String[] opsiBaru = new String[4];
            System.out.print("Masukkan Opsi A Baru: ");
            opsiBaru[0] = "A. " + scanner.nextLine();
            System.out.print("Masukkan Opsi B Baru: ");
            opsiBaru[1] = "B. " + scanner.nextLine();
            System.out.print("Masukkan Opsi C Baru: ");
            opsiBaru[2] = "C. " + scanner.nextLine();
            System.out.print("Masukkan Opsi D Baru: ");
            opsiBaru[3] = "D. " + scanner.nextLine();
            
            System.out.print("Masukkan Kunci Jawaban Baru (A/B/C/D): ");
            String kunciBaru = scanner.nextLine().toUpperCase();

            Question updatedQuestion = new Question(id, pertanyaanBaru, opsiBaru, kunciBaru);
            service.updateQuestion(updatedQuestion);

        } catch (NumberFormatException e) {
            System.out.println("Input tidak valid. Silakan masukkan ID soal yang benar.");
        }
    }

    private void addQuestionView() {
        System.out.println("\n--- TAMBAH SOAL BARU ---");
        
        int idOtomatis = service.getQuestionList().size() + 1;
        System.out.println("ID Soal : " + idOtomatis + " (Otomatis)");
    
        System.out.print("Masukkan Teks Pertanyaan: ");
        String pertanyaan = scanner.nextLine();
                
        String[] opsi = new String[4];
        System.out.print("Masukkan Opsi A: ");
        opsi[0] = "A. " + scanner.nextLine();
        System.out.print("Masukkan Opsi B: ");
        opsi[1] = "B. " + scanner.nextLine();
        System.out.print("Masukkan Opsi C: ");
        opsi[2] = "C. " + scanner.nextLine();
        System.out.print("Masukkan Opsi D: ");
        opsi[3] = "D. " + scanner.nextLine();
        
        System.out.print("Masukkan Kunci Jawaban (A/B/C/D): ");
        String kunci = scanner.nextLine().toUpperCase();
        
        Question soalBaru = new Question(idOtomatis, pertanyaan, opsi, kunci);
        service.addQuestion(soalBaru); 
        
        System.out.println("Soal berhasil ditambahkan!");
    }
    
    private void playQuiz() {
        System.out.println("\n--- MEMULAI KUIS ---");
        int skor = 0;

        for (Question question : service.getQuestionList()) {
            System.out.println("\nSoal " + question.getId() + ":");
            System.out.println(question.getTextSoal());
            
            for (String option : question.getPilihanGanda()) {
                System.out.println(option);
            }
            
            System.out.print("Jawaban Anda (A/B/C/D): ");
            String jawabanUser = scanner.nextLine(); 
            
            if (jawabanUser.trim().equalsIgnoreCase(question.getKunciJawaban().trim())) {
                System.out.println("Benar!");
                skor += 10;
            } else {
                System.out.println("Salah! Jawaban yang benar adalah " + question.getKunciJawaban());
            }
        }

        System.out.println("\n=========================");
        System.out.println("Kuis Selesai! Skor Akhir Anda: " + skor);
        System.out.println("=========================");
    }
}